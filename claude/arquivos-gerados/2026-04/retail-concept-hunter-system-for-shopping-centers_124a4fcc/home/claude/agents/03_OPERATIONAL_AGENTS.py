"""
SIOS - Agentes Operacionais v2.0

Este arquivo contém:
1. ALAVANCADOR - Soluções financeiras
2. BUILDER - Construção/operação
3. SELLER - Marketing/vendas
4. ENTERTAINER - Eventos
5. CONTENT_PLATFORM - Plataforma de conteúdo

Todos seguem o padrão:
- Modelo de dados (Pydantic)
- Agente com lógica de negócio
- Endpoints FastAPI
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


# ============================================================================
# AGENTE 1: ALAVANCADOR - Soluções Financeiras
# ============================================================================

router_alavancador = APIRouter(prefix="/api/v1/alavancador", tags=["alavancador"])


class FinancialSolutionType(str, Enum):
    CAPEX_FINANCING = "financiamento_obra"
    WORKING_CAPITAL = "capital_giro"
    INSURANCE_OPERATION = "seguro_operacional"
    INSURANCE_LIFE = "seguro_vida"
    INSURANCE_CONSTRUCTION = "seguro_obra"
    PAYMENT_GATEWAY = "gateway_pagamento"
    POS_MACHINE = "maquininha"
    HEALTH_PLAN = "plano_saude"
    MEAL_VOUCHER = "vale_refeicao"
    FOOD_VOUCHER = "vale_alimentacao"


class FinancialPartnerType(str, Enum):
    BANK = "banco"
    FINTECH = "fintech"
    INSURER = "seguradora"
    PAYMENT_PROVIDER = "adquirente"
    BENEFITS_PROVIDER = "operadora_beneficios"


class FinancialSolution(BaseModel):
    """Produto financeiro disponível"""
    name: str
    type: FinancialSolutionType
    provider: str  # "Banco Inter", "C6", "Sumup", etc
    provider_type: FinancialPartnerType
    
    # Pricing
    cost_description: str  # "2.5% a.m.", "R$ 79/mês", "1.99% por transação"
    cost_min: Optional[float] = None
    cost_max: Optional[float] = None
    
    # Eligibility
    eligibility_criteria: List[str]  # ["PJ", "Faturamento >500k", "Tempo de empresa >2 anos"]
    
    # Benefits
    benefits: List[str]
    
    # Setup
    setup_time_days: int
    setup_complexity: str  # "baixa", "media", "alta"
    
    # Integration
    has_api: bool = False
    contract_link: Optional[str] = None


class TenantProfile(BaseModel):
    """Perfil do tenant para recomendação financeira"""
    category: str  # "moda", "food", etc
    revenue_monthly: float
    employees_count: int
    age_months: int
    is_franchise: bool
    capex_required: float
    has_existing_capital: bool


class FinancialStackRecommendation(BaseModel):
    """Stack financeira recomendada para um tenant"""
    capex_solution: Optional[FinancialSolution] = None
    working_capital_solution: Optional[FinancialSolution] = None
    insurances: List[FinancialSolution]
    payment_solutions: List[FinancialSolution]
    benefits_solutions: List[FinancialSolution]
    total_monthly_cost_estimate: float
    setup_time_total_days: int
    notes: str


class AlavancadorAgent:
    """
    ALAVANCADOR: Recomenda stack financeira ideal por tenant
    
    Parceiros recomendados (negociar contratos B2B):
    - Banco Inter, C6, Nubank PJ (capex/working capital)
    - Sulamerica, Bradesco Seguros (seguros)
    - Sumup, PagSeguro, Stone (pagamentos)
    - Ticket, Sodexo (benefícios)
    """
    
    def __init__(self, db):
        self.db = db
    
    def recommend_stack(
        self,
        tenant: TenantProfile,
        available_solutions: List[FinancialSolution]
    ) -> FinancialStackRecommendation:
        """Recomenda stack financeira ideal"""
        
        recommendations = {
            "capex": None,
            "working_capital": None,
            "insurances": [],
            "payments": [],
            "benefits": []
        }
        
        # 1. CAPEX Financing (se necessário)
        if tenant.capex_required > 0 and not tenant.has_existing_capital:
            capex_options = [s for s in available_solutions 
                           if s.type == FinancialSolutionType.CAPEX_FINANCING]
            # Filtrar por elegibilidade
            eligible = self._filter_eligible(capex_options, tenant)
            if eligible:
                recommendations["capex"] = self._best_match(eligible, tenant)
        
        # 2. Working Capital (recomendado para todos)
        wc_options = [s for s in available_solutions 
                     if s.type == FinancialSolutionType.WORKING_CAPITAL]
        eligible = self._filter_eligible(wc_options, tenant)
        if eligible:
            recommendations["working_capital"] = self._best_match(eligible, tenant)
        
        # 3. Seguros (obrigatórios)
        for ins_type in [FinancialSolutionType.INSURANCE_OPERATION,
                         FinancialSolutionType.INSURANCE_CONSTRUCTION]:
            options = [s for s in available_solutions if s.type == ins_type]
            eligible = self._filter_eligible(options, tenant)
            if eligible:
                recommendations["insurances"].append(self._best_match(eligible, tenant))
        
        # 4. Pagamentos
        payment_options = [s for s in available_solutions 
                          if s.type in [FinancialSolutionType.PAYMENT_GATEWAY,
                                       FinancialSolutionType.POS_MACHINE]]
        eligible = self._filter_eligible(payment_options, tenant)
        recommendations["payments"] = eligible[:2]  # Top 2 (online + presencial)
        
        # 5. Benefícios (se tem funcionários)
        if tenant.employees_count >= 5:
            for ben_type in [FinancialSolutionType.HEALTH_PLAN,
                            FinancialSolutionType.MEAL_VOUCHER,
                            FinancialSolutionType.FOOD_VOUCHER]:
                options = [s for s in available_solutions if s.type == ben_type]
                eligible = self._filter_eligible(options, tenant)
                if eligible:
                    recommendations["benefits"].append(self._best_match(eligible, tenant))
        
        # Calcular custo mensal estimado
        # Nota: cálculo real requer informação detalhada de cada produto
        total_cost = self._estimate_monthly_cost(recommendations, tenant)
        
        # Setup time total
        all_solutions = ([recommendations["capex"]] if recommendations["capex"] else []) + \
                       ([recommendations["working_capital"]] if recommendations["working_capital"] else []) + \
                       recommendations["insurances"] + \
                       recommendations["payments"] + \
                       recommendations["benefits"]
        setup_time = max([s.setup_time_days for s in all_solutions if s], default=0)
        
        return FinancialStackRecommendation(
            capex_solution=recommendations["capex"],
            working_capital_solution=recommendations["working_capital"],
            insurances=recommendations["insurances"],
            payment_solutions=recommendations["payments"],
            benefits_solutions=recommendations["benefits"],
            total_monthly_cost_estimate=total_cost,
            setup_time_total_days=setup_time,
            notes=self._generate_notes(tenant, recommendations)
        )
    
    def _filter_eligible(self, solutions: List[FinancialSolution], tenant: TenantProfile) -> List[FinancialSolution]:
        """Filtra soluções elegíveis para o tenant"""
        eligible = []
        for sol in solutions:
            qualified = True
            for criteria in sol.eligibility_criteria:
                # Lógica simplificada de eligibilidade
                if "Faturamento" in criteria:
                    # Extract minimum revenue requirement
                    pass  # implementar parsing
                if "Tempo de empresa" in criteria:
                    if tenant.age_months < 24:
                        qualified = False
                        break
            if qualified:
                eligible.append(sol)
        return eligible
    
    def _best_match(self, solutions: List[FinancialSolution], tenant: TenantProfile) -> FinancialSolution:
        """Escolhe melhor opção"""
        # Critério simples: menor custo
        # Em produção: ML model com mais variáveis
        return min(solutions, key=lambda s: s.cost_min or float('inf'))
    
    def _estimate_monthly_cost(self, recommendations: Dict, tenant: TenantProfile) -> float:
        """Estima custo mensal total"""
        total = 0
        # Lógica simplificada
        if recommendations["capex"]:
            total += tenant.capex_required * 0.025  # 2.5% a.m.
        # Adicionar outros custos...
        return total
    
    def _generate_notes(self, tenant: TenantProfile, recs: Dict) -> str:
        """Gera notas estratégicas"""
        notes = []
        if tenant.is_franchise:
            notes.append("Como franqueado, alguns produtos podem ter taxa preferencial via franqueador")
        if tenant.revenue_monthly < 100000:
            notes.append("Recomenda-se acompanhamento mensal de fluxo de caixa")
        if tenant.employees_count >= 10:
            notes.append("Considerar plano de saúde coletivo (custo benefício alto)")
        return " | ".join(notes) if notes else "Stack padrão recomendada"


@router_alavancador.post("/recommend", response_model=FinancialStackRecommendation)
async def recommend_financial_stack(
    tenant: TenantProfile,
    available_solutions: List[FinancialSolution]
):
    """Recomenda stack financeira para tenant"""
    agent = AlavancadorAgent(db=None)
    return agent.recommend_stack(tenant, available_solutions)


# ============================================================================
# AGENTE 2: BUILDER - Construção/Operação
# ============================================================================

router_builder = APIRouter(prefix="/api/v1/builder", tags=["builder"])


class SupplierCategory(str, Enum):
    ARCHITECTURE = "arquitetura"
    ENGINEERING = "engenharia"
    CONSTRUCTION = "construcao"
    MATERIALS = "materiais"
    FURNITURE = "mobiliario"
    TECH_POS = "tech_pos"
    TECH_ERP = "tech_erp"
    TECH_NETWORK = "tech_rede"
    HR = "rh"
    LEGAL = "juridico"
    DIGITAL = "digital_marketing"


class Supplier(BaseModel):
    """Fornecedor homologado"""
    name: str
    cnpj: str
    category: SupplierCategory
    specialty: str
    
    contact_email: str
    contact_phone: str
    
    # Performance
    rating: float  # 0-5
    completed_projects_count: int
    average_lead_time_days: int
    
    # Cost
    cost_range_description: str  # "R$ 5k-15k/projeto", "R$ 200/hora"
    cost_min: float
    cost_max: float
    
    # Specialization
    fits_shopping_type: List[str]  # ["premium", "family", "convenience"]
    portfolio_url: Optional[str] = None
    
    # Status
    is_homologated: bool
    homologation_date: Optional[datetime] = None


class GoLivePhase(str, Enum):
    PRE_DESIGN = "pre_projeto"
    DESIGN = "projeto"
    APPROVAL = "aprovacao"
    CONSTRUCTION = "obra"
    SETUP_TECH = "setup_tech"
    SETUP_TEAM = "setup_equipe"
    TRAINING = "treinamento"
    SOFT_OPENING = "soft_opening"
    GO_LIVE = "go_live"


class GoLiveTask(BaseModel):
    """Tarefa do checklist Go-Live"""
    phase: GoLivePhase
    task_name: str
    responsible: str
    duration_days: int
    depends_on: List[str] = []
    is_critical: bool
    cost_estimate: Optional[float] = None


class GoLiveChecklist(BaseModel):
    """Checklist completo de abertura de loja"""
    tenant_name: str
    target_open_date: datetime
    estimated_total_days: int
    estimated_total_cost: float
    tasks: List[GoLiveTask]
    critical_path: List[str]


class BuilderAgent:
    """
    BUILDER: Suporte completo de abertura de loja
    
    Gerencia:
    - Recomendação de fornecedores
    - Checklist Go-Live (60-90 dias típico)
    - Critical path optimization
    - Timeline de abertura
    """
    
    def get_standard_golive_checklist(self) -> List[GoLiveTask]:
        """Checklist padrão de 60 dias para abertura de loja"""
        return [
            # PRE-PROJETO (Dias 1-7)
            GoLiveTask(phase=GoLivePhase.PRE_DESIGN, task_name="Briefing inicial",
                      responsible="Tenant + Builder", duration_days=2, is_critical=True),
            GoLiveTask(phase=GoLivePhase.PRE_DESIGN, task_name="Visita técnica ao espaço",
                      responsible="Arquiteto", duration_days=1, depends_on=["Briefing inicial"], is_critical=True),
            GoLiveTask(phase=GoLivePhase.PRE_DESIGN, task_name="Levantamento técnico",
                      responsible="Engenheiro", duration_days=3, depends_on=["Visita técnica ao espaço"], is_critical=True),
            
            # PROJETO (Dias 8-25)
            GoLiveTask(phase=GoLivePhase.DESIGN, task_name="Projeto arquitetônico",
                      responsible="Arquiteto", duration_days=10, depends_on=["Levantamento técnico"], is_critical=True, cost_estimate=15000),
            GoLiveTask(phase=GoLivePhase.DESIGN, task_name="Projeto elétrico",
                      responsible="Engenheiro elétrico", duration_days=5, depends_on=["Projeto arquitetônico"], is_critical=True, cost_estimate=5000),
            GoLiveTask(phase=GoLivePhase.DESIGN, task_name="Projeto hidráulico (se aplicável)",
                      responsible="Engenheiro hidráulico", duration_days=3, depends_on=["Projeto arquitetônico"], is_critical=False, cost_estimate=3000),
            
            # APROVAÇÃO (Dias 26-35)
            GoLiveTask(phase=GoLivePhase.APPROVAL, task_name="Aprovação shopping",
                      responsible="Builder + Shopping", duration_days=7, depends_on=["Projeto arquitetônico"], is_critical=True),
            GoLiveTask(phase=GoLivePhase.APPROVAL, task_name="Aprovação prefeitura",
                      responsible="Builder + Tenant", duration_days=10, depends_on=["Aprovação shopping"], is_critical=True),
            GoLiveTask(phase=GoLivePhase.APPROVAL, task_name="Aprovação corpo de bombeiros",
                      responsible="Builder", duration_days=15, depends_on=["Aprovação prefeitura"], is_critical=True),
            
            # OBRA (Dias 30-55)
            GoLiveTask(phase=GoLivePhase.CONSTRUCTION, task_name="Quebra e demolição",
                      responsible="Empreiteira", duration_days=3, depends_on=["Aprovação shopping"], is_critical=True, cost_estimate=8000),
            GoLiveTask(phase=GoLivePhase.CONSTRUCTION, task_name="Estrutura e elétrica",
                      responsible="Empreiteira", duration_days=10, depends_on=["Quebra e demolição"], is_critical=True, cost_estimate=50000),
            GoLiveTask(phase=GoLivePhase.CONSTRUCTION, task_name="Acabamentos",
                      responsible="Empreiteira", duration_days=8, depends_on=["Estrutura e elétrica"], is_critical=True, cost_estimate=30000),
            GoLiveTask(phase=GoLivePhase.CONSTRUCTION, task_name="Mobiliário e visual merchandising",
                      responsible="Marca", duration_days=5, depends_on=["Acabamentos"], is_critical=True, cost_estimate=40000),
            
            # TECH (Dias 50-58)
            GoLiveTask(phase=GoLivePhase.SETUP_TECH, task_name="Instalação PDV/POS",
                      responsible="Tech provider", duration_days=2, depends_on=["Acabamentos"], is_critical=True, cost_estimate=2000),
            GoLiveTask(phase=GoLivePhase.SETUP_TECH, task_name="Setup ERP/sistema gestão",
                      responsible="Tech provider", duration_days=3, depends_on=["Instalação PDV/POS"], is_critical=True, cost_estimate=5000),
            GoLiveTask(phase=GoLivePhase.SETUP_TECH, task_name="Wi-Fi e CFTV",
                      responsible="Tech provider", duration_days=2, depends_on=["Acabamentos"], is_critical=False, cost_estimate=3000),
            
            # EQUIPE (Dias 45-58)
            GoLiveTask(phase=GoLivePhase.SETUP_TEAM, task_name="Recrutamento e seleção",
                      responsible="HR provider", duration_days=10, is_critical=True, cost_estimate=5000),
            GoLiveTask(phase=GoLivePhase.SETUP_TEAM, task_name="Documentação trabalhista",
                      responsible="Legal provider", duration_days=5, depends_on=["Recrutamento e seleção"], is_critical=True, cost_estimate=2000),
            GoLiveTask(phase=GoLivePhase.TRAINING, task_name="Treinamento equipe",
                      responsible="Marca + Tenant", duration_days=5, depends_on=["Documentação trabalhista"], is_critical=True),
            
            # SOFT OPENING (Dias 58-60)
            GoLiveTask(phase=GoLivePhase.SOFT_OPENING, task_name="Soft opening (testes)",
                      responsible="Tenant", duration_days=2, depends_on=["Treinamento equipe", "Setup ERP/sistema gestão"], is_critical=True),
            GoLiveTask(phase=GoLivePhase.GO_LIVE, task_name="Inauguração oficial",
                      responsible="Tenant + Shopping", duration_days=1, depends_on=["Soft opening (testes)"], is_critical=True),
        ]
    
    def calculate_critical_path(self, tasks: List[GoLiveTask]) -> List[str]:
        """Calcula critical path (tarefas que não podem atrasar)"""
        return [t.task_name for t in tasks if t.is_critical]
    
    def estimate_total_cost(self, tasks: List[GoLiveTask]) -> float:
        """Estima custo total da obra"""
        return sum(t.cost_estimate or 0 for t in tasks)
    
    def estimate_total_days(self, tasks: List[GoLiveTask]) -> int:
        """Estima duração (considerando paralelização do critical path)"""
        # Simplificação: soma dos críticos sequenciais
        # Em produção: algoritmo de critical path real
        return sum(t.duration_days for t in tasks if t.is_critical)
    
    def generate_checklist(self, tenant_name: str, target_date: datetime) -> GoLiveChecklist:
        """Gera checklist completo"""
        tasks = self.get_standard_golive_checklist()
        return GoLiveChecklist(
            tenant_name=tenant_name,
            target_open_date=target_date,
            estimated_total_days=self.estimate_total_days(tasks),
            estimated_total_cost=self.estimate_total_cost(tasks),
            tasks=tasks,
            critical_path=self.calculate_critical_path(tasks)
        )
    
    def recommend_suppliers(
        self,
        category: SupplierCategory,
        shopping_type: str,
        budget_range: tuple
    ) -> List[Supplier]:
        """Recomenda fornecedores homologados"""
        # Query DB filtrando por categoria + shopping_type + budget
        # Retornar top 3 por rating
        return []


@router_builder.post("/checklist")
async def generate_golive_checklist(tenant_name: str, target_open_date: datetime):
    """Gera checklist completo de abertura"""
    builder = BuilderAgent()
    return builder.generate_checklist(tenant_name, target_open_date)


@router_builder.get("/suppliers/{category}")
async def get_suppliers(category: SupplierCategory, shopping_type: str):
    """Lista fornecedores por categoria"""
    builder = BuilderAgent()
    return builder.recommend_suppliers(category, shopping_type, (0, 100000))


# ============================================================================
# AGENTE 3: SELLER - Vendas/Marketing
# ============================================================================

router_seller = APIRouter(prefix="/api/v1/seller", tags=["seller"])


class ChannelType(str, Enum):
    MALL_SCREENS = "telas_mall"
    APP = "app"
    EMAIL_CRM = "email_crm"
    SMS = "sms"
    PARKING_BENEFITS = "estacionamento"
    EVENTS = "eventos"
    OOH_HELLOO = "ooh_helloo"
    SOCIAL_MEDIA = "social_media"
    INFLUENCERS = "influenciadores"
    SPONSORSHIPS = "patrocinios"


class ActivationType(str, Enum):
    AWARENESS = "awareness"
    CONVERSION = "conversao"
    LOYALTY = "fidelizacao"
    REACTIVATION = "reativacao"


class TenantCategory(str, Enum):
    FASHION = "moda"
    FOOD = "food"
    SERVICES = "servicos"
    BEAUTY = "saude_beleza"
    TECH = "tech"
    PET = "pet"
    SPORTS = "esporte"
    HOME = "casa"
    KIDS = "infantil"


class Activation(BaseModel):
    """Ativação de marketing"""
    name: str
    type: ActivationType
    channel: ChannelType
    
    cost: float
    duration_days: int
    
    expected_reach: int  # pessoas
    expected_conversion_rate: float  # %
    expected_revenue: float
    
    roi: float  # (revenue - cost) / cost
    
    suitable_for_categories: List[TenantCategory]


class MediaMixRecommendation(BaseModel):
    """Mix de mídia recomendado"""
    tenant_category: TenantCategory
    monthly_budget: float
    activations: List[Activation]
    expected_total_reach: int
    expected_total_revenue: float
    overall_roi: float
    notes: str


class SellerAgent:
    """
    SELLER: Otimiza ativações de marketing por tipo de tenant
    
    Channels:
    - Mall screens (alta visibilidade)
    - App do shopping (engagement)
    - Estacionamento gratuito
    - Eventos
    - OOH (Helloo)
    - Patrocínios sazonais
    """
    
    # Database de ativações conhecidas (com performance histórica)
    KNOWN_ACTIVATIONS = {
        "telas_mall_30dias": Activation(
            name="Anúncio em telas LCD 30 dias",
            type=ActivationType.AWARENESS,
            channel=ChannelType.MALL_SCREENS,
            cost=8000,
            duration_days=30,
            expected_reach=200000,
            expected_conversion_rate=0.5,
            expected_revenue=80000,
            roi=9.0,
            suitable_for_categories=[TenantCategory.FASHION, TenantCategory.FOOD, TenantCategory.BEAUTY]
        ),
        "app_pushnotif": Activation(
            name="Push notification dirigida no app",
            type=ActivationType.CONVERSION,
            channel=ChannelType.APP,
            cost=2000,
            duration_days=7,
            expected_reach=30000,
            expected_conversion_rate=2.5,
            expected_revenue=45000,
            roi=21.5,
            suitable_for_categories=[TenantCategory.FASHION, TenantCategory.FOOD, TenantCategory.SERVICES]
        ),
        "evento_namorados": Activation(
            name="Patrocínio Dia dos Namorados",
            type=ActivationType.AWARENESS,
            channel=ChannelType.SPONSORSHIPS,
            cost=25000,
            duration_days=14,
            expected_reach=500000,
            expected_conversion_rate=0.8,
            expected_revenue=180000,
            roi=6.2,
            suitable_for_categories=[TenantCategory.FASHION, TenantCategory.BEAUTY, TenantCategory.FOOD]
        ),
    }
    
    def recommend_media_mix(
        self,
        tenant_category: TenantCategory,
        monthly_budget: float,
        objective: ActivationType = ActivationType.CONVERSION
    ) -> MediaMixRecommendation:
        """
        Recomenda mix de mídia otimizado por orçamento
        
        Algoritmo:
        1. Filtra ativações compatíveis com categoria
        2. Prioriza por ROI
        3. Aloca dentro do budget
        """
        # Filtrar
        eligible = [a for a in self.KNOWN_ACTIVATIONS.values()
                   if tenant_category in a.suitable_for_categories]
        
        # Ordenar por ROI
        eligible.sort(key=lambda x: x.roi, reverse=True)
        
        # Alocar
        selected = []
        remaining_budget = monthly_budget
        for activation in eligible:
            if activation.cost <= remaining_budget:
                selected.append(activation)
                remaining_budget -= activation.cost
        
        # Calcular totais
        total_reach = sum(a.expected_reach for a in selected)
        total_revenue = sum(a.expected_revenue for a in selected)
        total_cost = sum(a.cost for a in selected)
        overall_roi = (total_revenue - total_cost) / total_cost if total_cost > 0 else 0
        
        notes = self._generate_strategic_notes(tenant_category, selected, remaining_budget)
        
        return MediaMixRecommendation(
            tenant_category=tenant_category,
            monthly_budget=monthly_budget,
            activations=selected,
            expected_total_reach=total_reach,
            expected_total_revenue=total_revenue,
            overall_roi=overall_roi,
            notes=notes
        )
    
    def _generate_strategic_notes(
        self,
        category: TenantCategory,
        activations: List[Activation],
        remaining_budget: float
    ) -> str:
        """Gera insights estratégicos"""
        notes = []
        
        if category == TenantCategory.FASHION:
            notes.append("📍 Foco em datas-chave: Dia das Mães, Black Friday, Natal")
        elif category == TenantCategory.FOOD:
            notes.append("📍 Frequência > Reach. Apostar em recorrência via app")
        elif category == TenantCategory.BEAUTY:
            notes.append("📍 Influenciadoras locais convertem 3x mais")
        
        if remaining_budget > 1000:
            notes.append(f"💰 R$ {remaining_budget:,.0f} disponível para teste de novos canais")
        
        if not any(a.type == ActivationType.LOYALTY for a in activations):
            notes.append("⚠️ Considerar incluir ativação de loyalty/recorrência")
        
        return " | ".join(notes)


@router_seller.post("/media-mix")
async def recommend_media_mix(
    tenant_category: TenantCategory,
    monthly_budget: float
):
    """Recomenda mix de mídia ideal"""
    seller = SellerAgent()
    return seller.recommend_media_mix(tenant_category, monthly_budget)


# ============================================================================
# AGENTE 4: ENTERTAINER - Eventos e Experiência
# ============================================================================

router_entertainer = APIRouter(prefix="/api/v1/entertainer", tags=["entertainer"])


class EventType(str, Enum):
    PROPRIETARY = "proprietario"
    THEMATIC = "tematico"
    SEASONAL = "sazonal"
    RETAIL_DATE = "data_varejo"
    ENTERTAINMENT = "entretenimento"
    CULTURAL = "cultural"


class EventAudience(str, Enum):
    KIDS = "infantil"
    FAMILY = "familia"
    YOUNG_ADULTS = "jovem_adulto"
    ADULTS = "adulto"
    SENIORS = "terceira_idade"
    ALL = "todos"


class EventRiskLevel(str, Enum):
    LOW = "baixo"
    MEDIUM = "medio"
    HIGH = "alto"


class Event(BaseModel):
    """Evento programado"""
    name: str
    type: EventType
    target_audience: EventAudience
    theme: str
    
    # Timeline
    start_date: datetime
    end_date: datetime
    setup_days: int
    operation_days: int
    dismantle_days: int
    
    # Operação
    risk_level: EventRiskLevel
    estimated_visitors: int
    requires_security_extra: bool = False
    requires_insurance_special: bool = False
    
    # Financeiro
    investment: float
    expected_traffic_increase_pct: float  # 5%, 10%, 20%
    expected_sales_lift_pct: float
    
    # Aprovações
    requires_anvisa: bool = False
    requires_fire_dept: bool = False
    requires_municipal: bool = False
    
    notes: Optional[str] = None


class AnnualCalendar(BaseModel):
    """Calendário anual de eventos"""
    year: int
    shopping_id: str
    events: List[Event]
    total_investment: float
    expected_annual_traffic_increase: float
    coverage_pct: float  # % do ano com eventos


class EntertainerAgent:
    """
    ENTERTAINER: Gera calendário anual de eventos
    
    Princípios:
    1. NUNCA deixar espaço de eventos vazio
    2. Alinhar com datas do varejo
    3. Priorizar baixo risco operacional
    4. Concentrar eventos infantis em férias escolares
    5. Mix de proprietários + sazonais + temáticos
    """
    
    def generate_annual_calendar(
        self,
        year: int,
        shopping_id: str,
        positioning: str,  # "premium", "family", "convenience"
        annual_budget: float
    ) -> AnnualCalendar:
        """Gera calendário anual completo"""
        
        events = []
        
        # JANEIRO - Volta às aulas + férias
        events.append(Event(
            name="Mundo da Volta às Aulas",
            type=EventType.PROPRIETARY,
            target_audience=EventAudience.FAMILY,
            theme="Educação e diversão",
            start_date=datetime(year, 1, 15),
            end_date=datetime(year, 2, 5),
            setup_days=3, operation_days=21, dismantle_days=2,
            risk_level=EventRiskLevel.LOW,
            estimated_visitors=80000,
            investment=40000,
            expected_traffic_increase_pct=12.0,
            expected_sales_lift_pct=8.0,
            notes="Alinhar com varejo escolar"
        ))
        
        # FEVEREIRO - Carnaval
        events.append(Event(
            name="Bloquinho Kids do Shopping",
            type=EventType.SEASONAL,
            target_audience=EventAudience.KIDS,
            theme="Carnaval familiar",
            start_date=datetime(year, 2, 14),
            end_date=datetime(year, 2, 17),
            setup_days=2, operation_days=4, dismantle_days=1,
            risk_level=EventRiskLevel.LOW,
            estimated_visitors=25000,
            investment=20000,
            expected_traffic_increase_pct=15.0,
            expected_sales_lift_pct=10.0,
            requires_municipal=True
        ))
        
        # MARÇO - Páscoa
        events.append(Event(
            name="Aldeia da Páscoa Imersiva",
            type=EventType.SEASONAL,
            target_audience=EventAudience.FAMILY,
            theme="Páscoa lúdica",
            start_date=datetime(year, 3, 20),
            end_date=datetime(year, 4, 8),
            setup_days=5, operation_days=18, dismantle_days=2,
            risk_level=EventRiskLevel.LOW,
            estimated_visitors=120000,
            investment=60000,
            expected_traffic_increase_pct=18.0,
            expected_sales_lift_pct=15.0
        ))
        
        # MAIO - Mães
        events.append(Event(
            name="Espaço Mães - Mimos & Experiências",
            type=EventType.RETAIL_DATE,
            target_audience=EventAudience.ADULTS,
            theme="Celebração das mães",
            start_date=datetime(year, 5, 1),
            end_date=datetime(year, 5, 12),
            setup_days=2, operation_days=11, dismantle_days=1,
            risk_level=EventRiskLevel.LOW,
            estimated_visitors=90000,
            investment=35000,
            expected_traffic_increase_pct=14.0,
            expected_sales_lift_pct=20.0,
            notes="MAIOR LIFT do ano em moda/beleza"
        ))
        
        # JUNHO - Festa Junina
        events.append(Event(
            name="Arraiá do Shopping",
            type=EventType.SEASONAL,
            target_audience=EventAudience.FAMILY,
            theme="Festa junina",
            start_date=datetime(year, 6, 15),
            end_date=datetime(year, 6, 30),
            setup_days=4, operation_days=15, dismantle_days=2,
            risk_level=EventRiskLevel.MEDIUM,
            estimated_visitors=100000,
            investment=50000,
            expected_traffic_increase_pct=15.0,
            expected_sales_lift_pct=12.0,
            requires_fire_dept=True,
            notes="Foco em food (gastronomia regional)"
        ))
        
        # JULHO - Férias
        events.append(Event(
            name="Parque de Férias - Mundo Animado",
            type=EventType.PROPRIETARY,
            target_audience=EventAudience.KIDS,
            theme="Férias escolares",
            start_date=datetime(year, 7, 1),
            end_date=datetime(year, 7, 31),
            setup_days=5, operation_days=31, dismantle_days=3,
            risk_level=EventRiskLevel.MEDIUM,
            estimated_visitors=200000,
            investment=120000,
            expected_traffic_increase_pct=25.0,
            expected_sales_lift_pct=18.0,
            requires_insurance_special=True,
            notes="MELHOR mês para infantil. Justifica investimento alto"
        ))
        
        # AGOSTO - Pais
        events.append(Event(
            name="Pais & Filhos - Experiências",
            type=EventType.RETAIL_DATE,
            target_audience=EventAudience.FAMILY,
            theme="Dia dos Pais",
            start_date=datetime(year, 8, 1),
            end_date=datetime(year, 8, 11),
            setup_days=2, operation_days=10, dismantle_days=1,
            risk_level=EventRiskLevel.LOW,
            estimated_visitors=70000,
            investment=30000,
            expected_traffic_increase_pct=10.0,
            expected_sales_lift_pct=12.0
        ))
        
        # OUTUBRO - Dia das Crianças + Halloween
        events.append(Event(
            name="Festival Dia das Crianças",
            type=EventType.RETAIL_DATE,
            target_audience=EventAudience.KIDS,
            theme="Brincadeiras e diversão",
            start_date=datetime(year, 10, 5),
            end_date=datetime(year, 10, 12),
            setup_days=3, operation_days=7, dismantle_days=1,
            risk_level=EventRiskLevel.LOW,
            estimated_visitors=80000,
            investment=40000,
            expected_traffic_increase_pct=20.0,
            expected_sales_lift_pct=25.0
        ))
        
        events.append(Event(
            name="Halloween Experience",
            type=EventType.SEASONAL,
            target_audience=EventAudience.YOUNG_ADULTS,
            theme="Halloween imersivo",
            start_date=datetime(year, 10, 25),
            end_date=datetime(year, 10, 31),
            setup_days=2, operation_days=7, dismantle_days=1,
            risk_level=EventRiskLevel.LOW,
            estimated_visitors=40000,
            investment=20000,
            expected_traffic_increase_pct=8.0,
            expected_sales_lift_pct=5.0
        ))
        
        # NOVEMBRO - Black Friday
        events.append(Event(
            name="Black Week Experience",
            type=EventType.RETAIL_DATE,
            target_audience=EventAudience.ALL,
            theme="Black Friday",
            start_date=datetime(year, 11, 25),
            end_date=datetime(year, 11, 30),
            setup_days=2, operation_days=6, dismantle_days=1,
            risk_level=EventRiskLevel.MEDIUM,
            estimated_visitors=150000,
            investment=40000,
            expected_traffic_increase_pct=30.0,
            expected_sales_lift_pct=40.0,
            requires_security_extra=True,
            notes="MAIOR EVENTO DO ANO - Maximizar capacidade"
        ))
        
        # DEZEMBRO - Natal
        events.append(Event(
            name="Vila Encantada de Natal",
            type=EventType.PROPRIETARY,
            target_audience=EventAudience.FAMILY,
            theme="Natal mágico",
            start_date=datetime(year, 11, 15),
            end_date=datetime(year, 12, 24),
            setup_days=15, operation_days=39, dismantle_days=5,
            risk_level=EventRiskLevel.MEDIUM,
            estimated_visitors=400000,
            investment=200000,
            expected_traffic_increase_pct=35.0,
            expected_sales_lift_pct=30.0,
            requires_insurance_special=True,
            notes="EVENTO MAIS LONGO E IMPORTANTE. Reservar 6 meses antes."
        ))
        
        # Calcular totais
        total_investment = sum(e.investment for e in events)
        # Cobertura: dias com eventos / 365
        days_with_events = sum(e.operation_days for e in events)
        coverage = (days_with_events / 365) * 100
        
        # Filtrar pelo orçamento se estourar
        if total_investment > annual_budget:
            # Priorizar por ROI (sales lift / investment)
            events.sort(key=lambda x: x.expected_sales_lift_pct / x.investment * 1000, reverse=True)
            selected = []
            cumulative = 0
            for e in events:
                if cumulative + e.investment <= annual_budget:
                    selected.append(e)
                    cumulative += e.investment
            events = selected
            total_investment = cumulative
        
        annual_traffic = sum(e.estimated_visitors for e in events)
        
        return AnnualCalendar(
            year=year,
            shopping_id=shopping_id,
            events=events,
            total_investment=total_investment,
            expected_annual_traffic_increase=annual_traffic,
            coverage_pct=coverage
        )


@router_entertainer.post("/calendar/{year}")
async def generate_annual_calendar(
    year: int,
    shopping_id: str,
    positioning: str,
    annual_budget: float
):
    """Gera calendário anual de eventos"""
    agent = EntertainerAgent()
    return agent.generate_annual_calendar(year, shopping_id, positioning, annual_budget)


# ============================================================================
# PLATAFORMA DE CONTEÚDO - Marketing & Inbound
# ============================================================================

router_content = APIRouter(prefix="/api/v1/content", tags=["content_platform"])


class ContentType(str, Enum):
    OPPORTUNITY_OF_WEEK = "oportunidade_semana"
    BRAND_OF_WEEK = "marca_semana"
    INVESTOR_INSIGHT = "insight_investidor"
    RETAIL_TREND = "tendencia_varejo"
    CASE_STUDY = "case_study"
    EDUCATIONAL = "educacional"


class ContentPiece(BaseModel):
    """Peça de conteúdo"""
    title: str
    type: ContentType
    
    # Conteúdo
    teaser: str  # 1-2 linhas
    body: str  # texto completo
    cta: str  # call to action
    
    # Multimedia
    image_prompt: Optional[str] = None  # Para gerar com IA
    video_url: Optional[str] = None
    
    # Distribuição
    publish_date: datetime
    channels: List[str]  # ["website", "linkedin", "instagram", "email"]
    
    # Lead Capture
    has_lead_form: bool = True
    lead_form_fields: List[str] = ["nome", "email", "telefone", "categoria_interesse"]
    
    # Métricas (preenchidas após publicação)
    views: Optional[int] = None
    leads_generated: Optional[int] = None
    conversion_rate: Optional[float] = None


class ContentCalendar(BaseModel):
    """Calendário editorial"""
    week_number: int
    year: int
    pieces: List[ContentPiece]


class ContentPlatformAgent:
    """
    PLATAFORMA DE CONTEÚDO: Marketing inbound
    
    Estilo: Endeavor / Partners / "Juntos pelo Varejo"
    
    Funções:
    1. Gerar calendário editorial semanal
    2. Capturar leads (investidores + marcas)
    3. Educar empreendedores
    4. Showcase oportunidades
    """
    
    def generate_weekly_calendar(
        self,
        week: int,
        year: int,
        active_opportunities: List[Dict],
        active_brands: List[Dict]
    ) -> ContentCalendar:
        """Gera calendário editorial da semana"""
        
        pieces = []
        
        # SEGUNDA: Oportunidade da Semana
        if active_opportunities:
            top_opp = active_opportunities[0]
            pieces.append(ContentPiece(
                title=f"🔥 Oportunidade da Semana: {top_opp.get('name', 'Loja Premium')}",
                type=ContentType.OPPORTUNITY_OF_WEEK,
                teaser=f"Loja de {top_opp.get('size', 'XX')}m² em ponto estratégico do shopping...",
                body=self._generate_opportunity_body(top_opp),
                cta="Quero saber mais sobre essa oportunidade",
                publish_date=self._get_weekday(week, year, weekday=0),  # Monday
                channels=["website", "linkedin", "email_lista"],
                has_lead_form=True,
                lead_form_fields=["nome", "email", "telefone", "capital_disponivel", "experiencia"]
            ))
        
        # TERÇA: Marca da Semana
        if active_brands:
            top_brand = active_brands[0]
            pieces.append(ContentPiece(
                title=f"📍 Marca em Expansão: {top_brand.get('name', 'Marca Premium')}",
                type=ContentType.BRAND_OF_WEEK,
                teaser="Conheça uma das marcas mais promissoras do mercado brasileiro...",
                body=self._generate_brand_body(top_brand),
                cta="Quero ser franqueado dessa marca",
                publish_date=self._get_weekday(week, year, weekday=1),  # Tuesday
                channels=["website", "linkedin", "instagram"],
                has_lead_form=True
            ))
        
        # QUARTA: Insight para Investidor
        pieces.append(ContentPiece(
            title="💡 Insight da Semana: Por que franquia bate ações em 2025?",
            type=ContentType.INVESTOR_INSIGHT,
            teaser="Análise comparativa: ROI de franquias vs investimentos tradicionais...",
            body="[Gerar com IA: análise de retornos comparados]",
            cta="Receba nosso guia completo de oportunidades",
            publish_date=self._get_weekday(week, year, weekday=2),  # Wednesday
            channels=["website", "linkedin", "email_lista"]
        ))
        
        # QUINTA: Tendência do Varejo
        pieces.append(ContentPiece(
            title="🔮 Tendência: O que está bombando no varejo este mês",
            type=ContentType.RETAIL_TREND,
            teaser="3 movimentos do mercado que todo investidor precisa conhecer...",
            body="[Conteúdo educativo sobre tendências]",
            cta="Inscreva-se na nossa newsletter semanal",
            publish_date=self._get_weekday(week, year, weekday=3),  # Thursday
            channels=["website", "linkedin"]
        ))
        
        # SEXTA: Case ou Educacional
        pieces.append(ContentPiece(
            title="📈 Case: Como [Nome] virou referência em 18 meses",
            type=ContentType.CASE_STUDY,
            teaser="Jornada de um franqueado que escalou rápido...",
            body="[Storytelling estilo Endeavor]",
            cta="Quero conversar com um especialista",
            publish_date=self._get_weekday(week, year, weekday=4),  # Friday
            channels=["website", "linkedin", "instagram", "email_lista"]
        ))
        
        return ContentCalendar(
            week_number=week,
            year=year,
            pieces=pieces
        )
    
    def _generate_opportunity_body(self, opp: Dict) -> str:
        """Gera corpo do post de oportunidade"""
        return f"""
        🏢 LOCALIZAÇÃO: {opp.get('location', 'Centro do shopping')}
        📐 ÁREA: {opp.get('size', 'XX')}m²
        💰 INVESTIMENTO ESTIMADO: A partir de R$ {opp.get('investment', 100000):,.0f}
        🎯 PERFIL IDEAL: {opp.get('ideal_profile', 'Empreendedor com experiência em varejo')}
        
        Por que essa oportunidade é única:
        - Fluxo de {opp.get('traffic', 'XX')}k pessoas/mês
        - Vizinhança premium (próximo a marcas top)
        - Apoio completo do shopping em obra e marketing
        
        💼 Ideal para investidores que buscam:
        - Operação consolidada e previsível
        - Marca em crescimento
        - Estrutura de suporte do shopping
        """
    
    def _generate_brand_body(self, brand: Dict) -> str:
        """Gera corpo do post de marca"""
        return f"""
        📊 EM NÚMEROS:
        - {brand.get('units', 'XX')} unidades operando
        - {brand.get('expansion_planned', 'XX')} novas lojas previstas em 12 meses
        - Presente em {len(brand.get('states', []))} estados
        
        💰 INVESTIMENTO:
        - A partir de R$ {brand.get('investment_min', 100000):,.0f}
        - Royalties: {brand.get('royalty', 5)}%
        - Payback médio: {brand.get('payback', 24)} meses
        
        🎯 PERFIL DO FRANQUEADO IDEAL:
        - {brand.get('partner_profile', 'Operador ativo')}
        - Experiência em {brand.get('experience_required', 'varejo')}
        """
    
    def _get_weekday(self, week: int, year: int, weekday: int) -> datetime:
        """Retorna data específica da semana"""
        # Simplificação: retorna data atual + offset
        return datetime.now() + timedelta(days=weekday)


@router_content.get("/calendar/week/{week}/year/{year}")
async def get_weekly_calendar(week: int, year: int):
    """Gera calendário editorial semanal"""
    agent = ContentPlatformAgent()
    # Em produção: buscar opportunities e brands ativas do DB
    return agent.generate_weekly_calendar(week, year, [], [])


@router_content.post("/lead-capture")
async def capture_lead(lead_data: Dict):
    """Captura lead vindo de formulário do site"""
    # 1. Salvar no DB
    # 2. Notificar Farmer agent (lead novo)
    # 3. Enviar email automatizado de boas-vindas
    return {"status": "captured", "next_step": "Farmer agent notified"}
