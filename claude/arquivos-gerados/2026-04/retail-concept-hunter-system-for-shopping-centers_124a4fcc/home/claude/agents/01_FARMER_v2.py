"""
SIOS - FARMER Agent v2.0 (Aprimorado)
Identificação e Qualificação de Investidores

OBJETIVO:
Identificar e qualificar investidores e fazer match com:
- Lojas disponíveis
- Franquias
- Novas oportunidades de negócio

FONTES DE INVESTIDORES:
1. Tenants existentes (já no shopping)
2. Empreendedores locais
3. Profissionais alta renda
4. Donos de negócio
5. Operadores de franquia

APIs USADAS:
- Apollo.io (R$ 250/mês - 1.000 contatos): legal, B2B
- Hunter.io (R$ 200/mês - email finding): legal
- LinkedIn Sales Navigator (R$ 500/mês): manual export
- Google Places (R$ 30/mês): negócios locais

NOTA SOBRE LinkedIn API:
LinkedIn não permite scraping automatizado da plataforma.
Use Sales Navigator + export manual OU Apollo.io (que tem dados B2B legalizados)
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict
from enum import Enum
from datetime import datetime, timedelta
import logging
import requests
import asyncio

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/farmer", tags=["farmer"])

# ============================================================================
# MODELOS DE DADOS
# ============================================================================

class InvestorSource(str, Enum):
    """Fontes de origem do investidor"""
    EXISTING_TENANT = "existing_tenant"
    LOCAL_ENTREPRENEUR = "local_entrepreneur"
    HIGH_INCOME_PROFESSIONAL = "high_income_professional"
    BUSINESS_OWNER = "business_owner"
    FRANCHISE_OPERATOR = "franchise_operator"
    REFERRAL = "referral"
    INBOUND = "inbound"


class RiskProfile(str, Enum):
    CONSERVATIVE = "conservador"
    MODERATE = "moderado"
    AGGRESSIVE = "arrojado"


class TimeAvailability(str, Enum):
    FULL_TIME = "integral"  # 40h+
    PART_TIME = "parcial"   # 20h
    PASSIVE = "passivo"     # only capital


class ExperienceLevel(str, Enum):
    NONE = "nenhuma"
    EMPLOYEE = "funcionario"
    MANAGER = "gerente"
    OWNER = "dono_loja"
    FRANCHISEE = "franqueado"


class InvestorProfile(BaseModel):
    """Perfil completo de investidor (suitability model)"""
    # Identificação
    nome: str
    email: EmailStr
    telefone: str
    cpf_cnpj_hash: str  # Hash do CPF para privacidade
    
    # Origem
    source: InvestorSource
    referral_by: Optional[str] = None
    linkedin_url: Optional[str] = None
    
    # Capital
    capital_initial: float = Field(..., gt=0, description="Capital total disponível")
    working_capital: float = Field(..., ge=0, description="Capital de giro 6 meses")
    
    # Disponibilidade
    time_availability: TimeAvailability
    
    # Experiência
    experience_level: ExperienceLevel
    previous_businesses: int = 0
    industries_known: List[str] = []
    
    # Perfil de risco
    risk_profile: RiskProfile
    payback_expectation_months: int  # 12, 24, 36, 60
    
    # Preferências
    categories_interest: List[str]  # ["moda", "food", "servicos"]
    preferred_store_size: str  # "pequeno", "medio", "grande"
    cities_interest: List[str]
    
    # Score (calculado)
    suitability_score: Optional[float] = None
    credit_score: Optional[float] = None
    qualification_status: Optional[str] = None


class OpportunityMatch(BaseModel):
    """Match entre investidor e oportunidade"""
    opportunity_id: str
    opportunity_type: str  # "store", "kiosk", "pop_up", "franchise"
    fit_score: float  # 0-100
    capital_match: bool
    experience_match: bool
    category_match: bool
    risk_match: bool
    reasoning: str


class InvestorOutput(BaseModel):
    """Output completo do FARMER"""
    investor: InvestorProfile
    estimated_capital_band: str  # "50k-100k", "100k-200k", etc
    experience_band: str
    risk_assessment: str
    matching_opportunities: List[OpportunityMatch]
    best_business_model: str
    recommended_pitch: str
    conversion_probability: float  # 0-100
    next_action: str


# ============================================================================
# APOLLO.IO INTEGRATION (Fonte legal de B2B data)
# ============================================================================

class ApolloService:
    """
    Apollo.io: B2B data legalmente coletada
    Plano: R$ 250/mês para ~1.000 lookups
    
    Por quê Apollo e não LinkedIn:
    - Apollo coleta dados de fontes públicas (sites empresariais, etc)
    - LinkedIn proíbe scraping em ToS
    - Apollo tem 250M+ contatos B2B
    - Inclui email + telefone direto
    """
    
    BASE_URL = "https://api.apollo.io/v1"
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
            "X-Api-Key": api_key
        }
    
    async def search_business_owners(
        self,
        city: str,
        industries: List[str],
        revenue_min: int = 1000000  # R$ 1M+ revenue
    ) -> List[Dict]:
        """
        Busca donos de negócio na cidade
        
        Filtros:
        - Localização: cidade específica
        - Setor: lojistas, varejo, food, etc
        - Revenue: empresas com faturamento alvo
        """
        try:
            payload = {
                "person_titles": ["Owner", "CEO", "Founder", "Proprietário"],
                "person_locations": [city],
                "organization_industry_tag_ids": industries,
                "organization_num_employees_ranges": ["1,10", "11,50"],
                "page": 1,
                "per_page": 50
            }
            
            response = requests.post(
                f"{self.BASE_URL}/mixed_people/search",
                headers=self.headers,
                json=payload,
                timeout=30
            )
            response.raise_for_status()
            
            people = response.json().get("people", [])
            logger.info(f"Apollo: {len(people)} business owners encontrados em {city}")
            
            return people
            
        except Exception as e:
            logger.error(f"Apollo error: {str(e)}")
            return []
    
    async def find_high_income_professionals(
        self,
        city: str,
        min_seniority: str = "VP"
    ) -> List[Dict]:
        """
        Busca profissionais de alta renda
        Médicos, advogados, executivos C-level
        """
        try:
            payload = {
                "person_titles": [
                    "Médico", "Doctor", "Cirurgião",
                    "Advogado", "Lawyer", "Sócio",
                    "VP", "Director", "Diretor", "C-Level"
                ],
                "person_locations": [city],
                "person_seniorities": ["c_suite", "vp", "director", "owner"],
                "page": 1,
                "per_page": 50
            }
            
            response = requests.post(
                f"{self.BASE_URL}/mixed_people/search",
                headers=self.headers,
                json=payload,
                timeout=30
            )
            response.raise_for_status()
            
            return response.json().get("people", [])
        except Exception as e:
            logger.error(f"Apollo professionals error: {str(e)}")
            return []


# ============================================================================
# FARMER AGENT v2.0
# ============================================================================

class FarmerAgentV2:
    """
    FARMER aprimorado com:
    - Multi-source investor sourcing
    - Match com oportunidades específicas
    - Pitch personalizado por perfil
    - Conversion probability prediction
    """
    
    def __init__(self, settings):
        self.settings = settings
        self.apollo = ApolloService(settings.APOLLO_API_KEY) if hasattr(settings, 'APOLLO_API_KEY') else None
    
    # ------------------------------------------------------------------------
    # SOURCING (5 fontes diferentes)
    # ------------------------------------------------------------------------
    
    async def source_existing_tenants(self, shopping_id: str, db) -> List[Dict]:
        """
        Fonte 1: Tenants existentes do shopping
        São os melhores leads (já conhecem o ambiente, têm capital)
        
        Critério: Tenant operacional há 2+ anos com vendas crescentes
        """
        query = """
        SELECT 
            id, razao_social, cnpj, nome_fantasia, categoria_retail,
            vendas_mensal, ticket_medio, gerente_loja, email_gerente
        FROM tenants
        WHERE shopping_id = :shopping_id
        AND status = 'operational'
        AND data_abertura < CURRENT_DATE - INTERVAL '2 years'
        AND vendas_mensal > 0
        ORDER BY vendas_mensal DESC
        """
        # Executar query no DB
        # Identifica tenants de sucesso que podem expandir/abrir nova loja
        return []
    
    async def source_local_entrepreneurs(self, city: str) -> List[Dict]:
        """
        Fonte 2: Empreendedores locais
        Donos de negócios bem-sucedidos na região
        """
        if not self.apollo:
            logger.warning("Apollo não configurado, usando dados manuais")
            return []
        
        # Buscar via Apollo
        owners = await self.apollo.search_business_owners(
            city=city,
            industries=["retail", "food_and_beverage", "services"],
            revenue_min=2000000
        )
        return owners
    
    async def source_high_income_professionals(self, city: str) -> List[Dict]:
        """
        Fonte 3: Profissionais alta renda
        Médicos, advogados, executivos buscando diversificar
        """
        if not self.apollo:
            return []
        
        professionals = await self.apollo.find_high_income_professionals(city=city)
        return professionals
    
    async def source_franchise_operators(self, city: str) -> List[Dict]:
        """
        Fonte 4: Operadores de franquia (multifranqueados)
        Mandamento Zé Roberto Levy #8: "Multifranqueado é peça-chave"
        """
        # Cruza com base ABF + dados de tenants existentes
        # Quem opera 2+ franquias na região é candidato premium
        query = """
        SELECT cpf_cnpj_hash, nome, COUNT(DISTINCT marca_franquia) as num_brands
        FROM franchise_operators
        WHERE city = :city
        GROUP BY cpf_cnpj_hash, nome
        HAVING COUNT(DISTINCT marca_franquia) >= 2
        ORDER BY num_brands DESC
        """
        return []
    
    async def source_referrals(self, shopping_id: str, db) -> List[Dict]:
        """
        Fonte 5: Indicações
        Investidores que vieram de indicação convertem 3x mais
        Criar programa de referral
        """
        return []
    
    # ------------------------------------------------------------------------
    # SCORING APRIMORADO (Suitability Model XP-style)
    # ------------------------------------------------------------------------
    
    def calculate_suitability_score(self, investor: InvestorProfile) -> Dict:
        """
        Score Suitability 0-100 com 6 dimensões:
        
        1. Capital (0-25)
        2. Working Capital (0-15)
        3. Experience (0-20)
        4. Time Availability (0-10)
        5. Risk Profile (0-15)
        6. Knowledge of Industry (0-15)
        """
        score = 0
        breakdown = {}
        
        # 1. Capital Inicial (0-25)
        if investor.capital_initial >= 1000000:
            cap_score = 25
            cap_band = "1M+"
        elif investor.capital_initial >= 500000:
            cap_score = 22
            cap_band = "500k-1M"
        elif investor.capital_initial >= 200000:
            cap_score = 18
            cap_band = "200k-500k"
        elif investor.capital_initial >= 100000:
            cap_score = 12
            cap_band = "100k-200k"
        elif investor.capital_initial >= 50000:
            cap_score = 6
            cap_band = "50k-100k"
        else:
            cap_score = 2
            cap_band = "<50k"
        
        score += cap_score
        breakdown["capital"] = {"score": cap_score, "band": cap_band}
        
        # 2. Working Capital - 6 meses de operação (0-15)
        # Critério: tem reserva para 6 meses sem faturamento?
        ratio = investor.working_capital / max(investor.capital_initial, 1)
        if ratio >= 0.5:
            wc_score = 15  # 50%+ reserva = excelente
        elif ratio >= 0.3:
            wc_score = 10
        elif ratio >= 0.15:
            wc_score = 5
        else:
            wc_score = 0  # SEM RESERVA = RISCO ALTO
        
        score += wc_score
        breakdown["working_capital"] = {"score": wc_score, "ratio": ratio}
        
        # 3. Experience (0-20)
        exp_map = {
            ExperienceLevel.FRANCHISEE: 20,
            ExperienceLevel.OWNER: 17,
            ExperienceLevel.MANAGER: 12,
            ExperienceLevel.EMPLOYEE: 6,
            ExperienceLevel.NONE: 2
        }
        exp_score = exp_map.get(investor.experience_level, 2)
        # Bonus por múltiplos negócios anteriores
        exp_score += min(investor.previous_businesses * 2, 5)
        exp_score = min(exp_score, 20)
        
        score += exp_score
        breakdown["experience"] = {"score": exp_score, "level": investor.experience_level}
        
        # 4. Time Availability (0-10)
        time_map = {
            TimeAvailability.FULL_TIME: 10,
            TimeAvailability.PART_TIME: 6,
            TimeAvailability.PASSIVE: 8  # Passivo é OK se tiver operador
        }
        time_score = time_map.get(investor.time_availability, 5)
        score += time_score
        breakdown["time"] = {"score": time_score, "type": investor.time_availability}
        
        # 5. Risk Profile alignment (0-15)
        # Varejo de shopping é risco moderado-alto
        # Conservador NÃO É BOM para esse tipo de investimento
        risk_map = {
            RiskProfile.AGGRESSIVE: 15,
            RiskProfile.MODERATE: 12,
            RiskProfile.CONSERVATIVE: 5  # Pode dar problema com volatilidade
        }
        risk_score = risk_map.get(investor.risk_profile, 5)
        score += risk_score
        breakdown["risk"] = {"score": risk_score, "profile": investor.risk_profile}
        
        # 6. Industry Knowledge (0-15)
        # Conhecimento do setor reduz muito o risco operacional
        category_overlap = len(set(investor.categories_interest) & set(investor.industries_known))
        knowledge_score = min(category_overlap * 5, 15)
        score += knowledge_score
        breakdown["industry_knowledge"] = {"score": knowledge_score, "overlap": category_overlap}
        
        return {
            "total_score": min(score, 100),
            "breakdown": breakdown,
            "qualification": self._classify_score(score)
        }
    
    def _classify_score(self, score: float) -> str:
        if score >= 80:
            return "PREMIUM - Prioridade máxima, fechar rápido"
        elif score >= 65:
            return "QUALIFICADO - Avançar para apresentação"
        elif score >= 50:
            return "POTENCIAL - Educar e desenvolver"
        else:
            return "DESQUALIFICADO - Não investir tempo agora"
    
    # ------------------------------------------------------------------------
    # MATCHING com Oportunidades
    # ------------------------------------------------------------------------
    
    async def match_with_opportunities(
        self,
        investor: InvestorProfile,
        opportunities: List[Dict]  # Lojas, franquias, kiosks disponíveis
    ) -> List[OpportunityMatch]:
        """
        Match investidor com oportunidades disponíveis
        
        Critérios de match:
        1. Capital compatível
        2. Categoria de interesse
        3. Tamanho de loja
        4. Perfil de risco vs. tipo de operação
        """
        matches = []
        
        for opp in opportunities:
            fit_score = 0
            checks = {}
            reasoning_parts = []
            
            # 1. Capital match (30 pts)
            opp_capital = opp.get("capital_required", 0)
            if investor.capital_initial >= opp_capital:
                if investor.capital_initial >= opp_capital * 1.5:
                    fit_score += 30  # Folga confortável
                    checks["capital_match"] = True
                    reasoning_parts.append(f"Capital folgado ({investor.capital_initial/opp_capital:.1f}x)")
                else:
                    fit_score += 20
                    checks["capital_match"] = True
                    reasoning_parts.append("Capital justo mas suficiente")
            else:
                checks["capital_match"] = False
                reasoning_parts.append(f"Capital insuficiente (faltam R$ {opp_capital - investor.capital_initial:,.0f})")
            
            # 2. Category match (25 pts)
            opp_category = opp.get("category", "")
            if opp_category in investor.categories_interest:
                fit_score += 25
                checks["category_match"] = True
                reasoning_parts.append(f"Categoria de interesse: {opp_category}")
            else:
                checks["category_match"] = False
                reasoning_parts.append(f"Fora de interesse declarado")
            
            # 3. Experience match (20 pts)
            opp_complexity = opp.get("complexity", "medium")  # low, medium, high
            if opp_complexity == "low" or investor.experience_level in [ExperienceLevel.OWNER, ExperienceLevel.FRANCHISEE]:
                fit_score += 20
                checks["experience_match"] = True
                reasoning_parts.append("Experiência adequada à operação")
            elif opp_complexity == "medium" and investor.experience_level == ExperienceLevel.MANAGER:
                fit_score += 12
                checks["experience_match"] = True
            else:
                fit_score += 5
                checks["experience_match"] = False
                reasoning_parts.append("Experiência limitada para complexidade da operação")
            
            # 4. Risk match (15 pts)
            opp_risk = opp.get("risk_level", "medium")
            risk_alignment = {
                ("low", RiskProfile.CONSERVATIVE): 15,
                ("medium", RiskProfile.MODERATE): 15,
                ("high", RiskProfile.AGGRESSIVE): 15,
                ("low", RiskProfile.MODERATE): 10,
                ("medium", RiskProfile.AGGRESSIVE): 12,
                ("medium", RiskProfile.CONSERVATIVE): 5,
            }
            risk_pts = risk_alignment.get((opp_risk, investor.risk_profile), 5)
            fit_score += risk_pts
            checks["risk_match"] = risk_pts >= 10
            
            # 5. Time availability (10 pts)
            if opp.get("requires_full_time") and investor.time_availability == TimeAvailability.FULL_TIME:
                fit_score += 10
            elif opp.get("requires_full_time") and investor.time_availability == TimeAvailability.PASSIVE:
                fit_score += 0  # Loja própria precisa de operador
                reasoning_parts.append("⚠️ Loja própria precisa operador full-time")
            else:
                fit_score += 7
            
            match = OpportunityMatch(
                opportunity_id=opp.get("id", ""),
                opportunity_type=opp.get("type", "store"),
                fit_score=fit_score,
                capital_match=checks.get("capital_match", False),
                experience_match=checks.get("experience_match", False),
                category_match=checks.get("category_match", False),
                risk_match=checks.get("risk_match", False),
                reasoning=" | ".join(reasoning_parts)
            )
            matches.append(match)
        
        # Ordenar por fit_score
        matches.sort(key=lambda x: x.fit_score, reverse=True)
        return matches[:5]  # Top 5 matches
    
    # ------------------------------------------------------------------------
    # PITCH GENERATION (Personalizado)
    # ------------------------------------------------------------------------
    
    def generate_pitch(self, investor: InvestorProfile, top_match: OpportunityMatch) -> str:
        """
        Gera pitch personalizado baseado em perfil + match
        """
        # Adapta linguagem ao perfil
        if investor.risk_profile == RiskProfile.CONSERVATIVE:
            tone = "segurança, payback rápido, marca consolidada"
        elif investor.risk_profile == RiskProfile.AGGRESSIVE:
            tone = "alto upside, oportunidade única, ROI agressivo"
        else:
            tone = "equilíbrio risco-retorno, marca em crescimento"
        
        # Highlight baseado em experiência
        if investor.experience_level == ExperienceLevel.NONE:
            experience_angle = "suporte completo do shopping (BUILDER), franquia com manual"
        elif investor.experience_level == ExperienceLevel.FRANCHISEE:
            experience_angle = "expansão estratégica de portfólio, scale-up"
        else:
            experience_angle = "leverage da sua experiência prévia"
        
        pitch = f"""
        Olá {investor.nome.split()[0]},
        
        Identificamos uma oportunidade no shopping que faz sentido com seu perfil:
        
        🎯 OPORTUNIDADE: [Nome da marca/loja]
        - Categoria: {top_match.opportunity_type}
        - Fit Score: {top_match.fit_score:.0f}/100 com seu perfil
        - {top_match.reasoning}
        
        ✨ POR QUE FAZ SENTIDO PRA VOCÊ:
        - {experience_angle}
        - Foco em {tone}
        - Payback estimado: {investor.payback_expectation_months} meses (alinhado expectativa)
        
        📅 PRÓXIMOS PASSOS:
        Posso reservar 30 minutos esta semana para apresentar a oportunidade em detalhe?
        
        Aguardo seu retorno.
        """
        return pitch.strip()
    
    # ------------------------------------------------------------------------
    # CONVERSION PROBABILITY
    # ------------------------------------------------------------------------
    
    def estimate_conversion_probability(
        self,
        investor: InvestorProfile,
        suitability_score: float,
        top_match_score: float
    ) -> float:
        """
        Probabilidade de conversão (0-100)
        
        Baseado em:
        - Suitability score
        - Match score com top opportunity
        - Source (referral converte 3x mais)
        - Categoria interesse alinhada
        """
        base = (suitability_score * 0.4) + (top_match_score * 0.4)
        
        # Bonus por fonte
        source_multiplier = {
            InvestorSource.REFERRAL: 1.5,
            InvestorSource.EXISTING_TENANT: 1.4,
            InvestorSource.FRANCHISE_OPERATOR: 1.3,
            InvestorSource.LOCAL_ENTREPRENEUR: 1.1,
            InvestorSource.HIGH_INCOME_PROFESSIONAL: 1.0,
            InvestorSource.BUSINESS_OWNER: 1.2,
            InvestorSource.INBOUND: 0.8
        }
        multiplier = source_multiplier.get(investor.source, 1.0)
        
        probability = min(base * multiplier * 0.2, 100)
        return round(probability, 1)
    
    # ------------------------------------------------------------------------
    # MAIN ORCHESTRATION
    # ------------------------------------------------------------------------
    
    async def run_full_analysis(
        self,
        investor: InvestorProfile,
        available_opportunities: List[Dict]
    ) -> InvestorOutput:
        """Análise completa do investidor"""
        
        # 1. Calcular suitability
        suitability = self.calculate_suitability_score(investor)
        investor.suitability_score = suitability["total_score"]
        investor.qualification_status = suitability["qualification"]
        
        # 2. Match com oportunidades
        matches = await self.match_with_opportunities(investor, available_opportunities)
        
        # 3. Top match
        top_match = matches[0] if matches else None
        top_match_score = top_match.fit_score if top_match else 0
        
        # 4. Gerar pitch
        pitch = self.generate_pitch(investor, top_match) if top_match else "Sem oportunidade compatível no momento"
        
        # 5. Probability
        probability = self.estimate_conversion_probability(
            investor, suitability["total_score"], top_match_score
        )
        
        # 6. Best business model recomendado
        if investor.experience_level == ExperienceLevel.NONE:
            business_model = "Franquia consolidada com manual operacional"
        elif investor.time_availability == TimeAvailability.PASSIVE:
            business_model = "Sócio capitalista com operador franqueado"
        elif investor.experience_level == ExperienceLevel.FRANCHISEE:
            business_model = "Multi-franquia ou marca premium em expansão"
        else:
            business_model = "Loja própria de marca em crescimento"
        
        # 7. Próxima ação
        if probability >= 70:
            next_action = "🔥 AGENDAR REUNIÃO ESTA SEMANA"
        elif probability >= 50:
            next_action = "📞 LIGAÇÃO DE QUALIFICAÇÃO"
        elif probability >= 30:
            next_action = "📧 NUTRIR COM CONTEÚDO"
        else:
            next_action = "📁 ARQUIVAR E REVISITAR EM 6 MESES"
        
        return InvestorOutput(
            investor=investor,
            estimated_capital_band=suitability["breakdown"]["capital"]["band"],
            experience_band=str(investor.experience_level),
            risk_assessment=str(investor.risk_profile),
            matching_opportunities=matches,
            best_business_model=business_model,
            recommended_pitch=pitch,
            conversion_probability=probability,
            next_action=next_action
        )


# ============================================================================
# ENDPOINTS
# ============================================================================

@router.post("/analyze", response_model=InvestorOutput)
async def analyze_investor(
    investor: InvestorProfile,
    available_opportunities: List[Dict]
):
    """
    Análise completa de investidor:
    - Suitability score
    - Match com oportunidades
    - Pitch personalizado
    - Probabilidade de conversão
    """
    farmer = FarmerAgentV2(settings=None)  # Pass real settings
    result = await farmer.run_full_analysis(investor, available_opportunities)
    return result


@router.post("/source/existing-tenants/{shopping_id}")
async def source_tenants(shopping_id: str):
    """Identifica tenants existentes que podem expandir"""
    farmer = FarmerAgentV2(settings=None)
    tenants = await farmer.source_existing_tenants(shopping_id, db=None)
    return {"source": "existing_tenants", "count": len(tenants), "data": tenants}


@router.post("/source/local-entrepreneurs")
async def source_entrepreneurs(city: str):
    """Identifica empreendedores locais via Apollo"""
    farmer = FarmerAgentV2(settings=None)
    entrepreneurs = await farmer.source_local_entrepreneurs(city)
    return {"source": "local_entrepreneurs", "city": city, "data": entrepreneurs}


@router.post("/batch-score")
async def batch_score_investors(investors: List[InvestorProfile]):
    """Scoring em batch para múltiplos investidores"""
    farmer = FarmerAgentV2(settings=None)
    results = []
    for inv in investors:
        score = farmer.calculate_suitability_score(inv)
        results.append({
            "investor_email": inv.email,
            "score": score["total_score"],
            "qualification": score["qualification"]
        })
    
    # Ordenar por score
    results.sort(key=lambda x: x["score"], reverse=True)
    return {"total": len(results), "ranked": results}
