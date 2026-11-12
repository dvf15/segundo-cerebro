"""
SIOS - KA_EXPANSION Agent v2.0
Mapeamento de Marcas e Franquias em Expansão

OBJETIVO:
Mapear marcas e franquias em expansão no Brasil e fazer match com:
- Oportunidades do shopping (espaços vagos)
- Base de investidores (via FARMER)

FONTES DE DADOS:
- ABF (Associação Brasileira de Franchising): planilha exportada
- Press releases: scraping leve com Google Search API
- LinkedIn: posts de "Estamos contratando" / "Expansão"
- Sites das marcas: scraping da página "Seja franqueado"

APIs USADAS:
- Google Custom Search API (R$ 25/mês para 1.000 queries)
- SerpApi (alternativa, R$ 50/mês)
- ABF: NÃO TEM API. Importação manual de planilha exportada do site

NOTA SOBRE LinkedIn:
LinkedIn API oficial é limitada para esse uso.
Alternativas:
1. LinkedIn Sales Navigator (manual, R$ 500/mês)
2. Scraping monitorado com cuidado (risco de banimento)
3. PhantomBuster (R$ 200/mês, automação semi-legal)

ESTRATÉGIA RECOMENDADA: Importação manual de leads + Apollo para enrichment
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum
from datetime import datetime
import logging
import requests

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/ka-expansion", tags=["ka_expansion"])

# ============================================================================
# MODELOS
# ============================================================================

class ExpansionStage(str, Enum):
    SEED = "introducao"           # 1-10 unidades
    GROWTH = "crescimento"        # 11-50 unidades
    SCALE = "escala"              # 51-200 unidades
    MATURITY = "maturidade"       # 200+ unidades
    LEGACY = "legado"             # Sem crescimento


class BusinessModel(str, Enum):
    OWN_STORES = "lojas_proprias"
    FRANCHISE = "franquia"
    HYBRID = "hibrido"
    LICENSING = "licenciamento"
    POP_UP = "pop_up"
    MULTIBRAND = "multimarca"


class BrandRequirements(BaseModel):
    """Requisitos técnicos da marca para abrir loja"""
    m2_min: float
    m2_max: float
    pe_direito_min: float
    vitrine_metros_min: float
    energia_kva_min: float
    requires_water: bool = False
    requires_sewage: bool = False
    requires_loading_dock: bool = False
    requires_grease_trap: bool = False  # Para food
    requires_exhaust: bool = False  # Para food
    floor_preference: List[int] = []  # [1] = térreo apenas, [1,2] = ambos
    proximity_anchor: bool = False
    avoid_competitors: List[str] = []


class BrandFinancials(BaseModel):
    """Modelo financeiro da marca"""
    initial_investment_min: float
    initial_investment_max: float
    royalty_pct: float
    marketing_fee_pct: float
    average_revenue_year1: Optional[float] = None
    average_payback_months: Optional[int] = None
    franchise_fee: Optional[float] = None


class Brand(BaseModel):
    """Marca/Franquia em expansão"""
    name: str
    cnpj: Optional[str] = None
    category: str  # "moda", "food", "servicos", etc
    business_model: BusinessModel
    
    # Status atual
    units_current: int
    units_planned_12m: int
    expansion_stage: ExpansionStage
    
    # Geografia
    states_present: List[str]
    states_target: List[str]
    cities_target: List[str]
    confirmed_interest_in_shopping: bool = False
    
    # Requisitos técnicos
    requirements: BrandRequirements
    
    # Financeiro
    financials: BrandFinancials
    
    # Perfil parceiro
    partner_profile: str  # "operador_ativo", "socio_parcial", "passivo"
    partner_experience_required: str  # "alta", "media", "baixa"
    
    # Marketing/Brand Strength
    instagram_followers: Optional[int] = None
    google_rating: Optional[float] = None
    brand_awareness_score: Optional[float] = None  # 0-100
    
    # Origem do dado
    source: str  # "abf", "linkedin", "press_release", "manual"
    source_date: datetime
    
    # Score
    fit_score_with_shopping: Optional[float] = None
    

class SpaceMatch(BaseModel):
    """Match entre marca e espaço disponível"""
    space_id: str
    fit_score: float  # 0-100
    technical_fit: bool
    location_fit: bool
    commercial_fit: bool
    reasoning: str


class InvestorMatch(BaseModel):
    """Match entre marca e investidor"""
    investor_id: str
    fit_score: float
    capital_compatible: bool
    profile_compatible: bool
    reasoning: str


class BrandOutput(BaseModel):
    """Output completo do KA"""
    brand: Brand
    expansion_stage: ExpansionStage
    required_format: Dict
    ideal_mall_profile: str
    fit_score: float
    matching_spaces: List[SpaceMatch]
    matching_investors: List[InvestorMatch]
    deal_priority: str  # "alta", "media", "baixa"
    next_actions: List[str]


# ============================================================================
# DATA SOURCES
# ============================================================================

class GoogleSearchService:
    """
    Google Custom Search API
    Custo: $5 por 1.000 queries (R$ 25 - barato)
    Setup: https://developers.google.com/custom-search/v1/overview
    """
    
    def __init__(self, api_key: str, search_engine_id: str):
        self.api_key = api_key
        self.cx = search_engine_id
        self.url = "https://www.googleapis.com/customsearch/v1"
    
    async def search_expansion_news(self, brand_name: str) -> List[Dict]:
        """
        Busca notícias de expansão de uma marca
        
        Query exemplo: "Cacau Show" OR "expansão" OR "novas lojas" OR "franquia"
        """
        try:
            params = {
                "key": self.api_key,
                "cx": self.cx,
                "q": f"\"{brand_name}\" (expansão OR \"novas lojas\" OR \"franquia\" OR \"abre\")",
                "dateRestrict": "y1",  # Último ano
                "num": 10
            }
            response = requests.get(self.url, params=params, timeout=10)
            response.raise_for_status()
            
            return response.json().get("items", [])
        except Exception as e:
            logger.error(f"Google Search error: {str(e)}")
            return []


class ABFDataService:
    """
    ABF (Associação Brasileira de Franchising)
    
    NÃO TEM API. Mas tem:
    - Guia de Franquias (publicação anual)
    - Site com busca: https://www.abf.com.br/
    - Diretório de associadas
    
    Estratégia:
    1. Exportar manualmente lista de associadas (1x/trimestre)
    2. Importar em CSV → enriquecer com Apollo/Google Search
    3. Manter base em PostgreSQL atualizada
    """
    
    @staticmethod
    def import_from_csv(file_path: str) -> List[Dict]:
        """Importa CSV exportado do site da ABF"""
        import pandas as pd
        try:
            df = pd.read_csv(file_path)
            return df.to_dict("records")
        except Exception as e:
            logger.error(f"Erro ao importar ABF CSV: {str(e)}")
            return []
    
    @staticmethod
    def extract_brand_data(row: Dict) -> Brand:
        """Converte linha de CSV ABF em modelo Brand"""
        # Mapping específico do formato ABF
        return Brand(
            name=row.get("nome_marca"),
            category=row.get("setor"),
            business_model=BusinessModel.FRANCHISE,
            units_current=row.get("unidades_existentes", 0),
            units_planned_12m=row.get("expansao_planejada", 0),
            expansion_stage=ABFDataService._classify_stage(row.get("unidades_existentes", 0)),
            states_present=row.get("estados", "").split(","),
            states_target=row.get("estados_target", "").split(","),
            cities_target=[],
            requirements=BrandRequirements(
                m2_min=row.get("m2_min", 30),
                m2_max=row.get("m2_max", 200),
                pe_direito_min=3.0,
                vitrine_metros_min=4.0,
                energia_kva_min=15
            ),
            financials=BrandFinancials(
                initial_investment_min=row.get("investimento_min", 100000),
                initial_investment_max=row.get("investimento_max", 500000),
                royalty_pct=row.get("royalty_pct", 5.0),
                marketing_fee_pct=row.get("marketing_pct", 2.0)
            ),
            partner_profile="operador_ativo",
            partner_experience_required="media",
            source="abf",
            source_date=datetime.now()
        )
    
    @staticmethod
    def _classify_stage(units: int) -> ExpansionStage:
        if units <= 10:
            return ExpansionStage.SEED
        elif units <= 50:
            return ExpansionStage.GROWTH
        elif units <= 200:
            return ExpansionStage.SCALE
        else:
            return ExpansionStage.MATURITY


# ============================================================================
# KA AGENT v2.0
# ============================================================================

class KAExpansionAgent:
    """
    KA Expansion: Curadoria de marcas em expansão
    Faz match 3-way: Marca × Espaço × Investidor
    """
    
    def __init__(self, settings):
        self.settings = settings
        self.google_search = GoogleSearchService(
            api_key=getattr(settings, 'GOOGLE_SEARCH_API_KEY', ''),
            search_engine_id=getattr(settings, 'GOOGLE_SEARCH_CX', '')
        )
    
    # ------------------------------------------------------------------------
    # SOURCING DE MARCAS
    # ------------------------------------------------------------------------
    
    async def discover_expanding_brands(self, region: str = "Brasil") -> List[Dict]:
        """
        Descobre marcas em expansão usando múltiplas fontes
        """
        brands = []
        
        # 1. Importar base ABF (atualizada manualmente)
        # brands.extend(ABFDataService.import_from_csv("/data/abf_2025.csv"))
        
        # 2. Buscar em press releases (Google Search)
        keywords = [
            "franquia expansão Brasil 2025",
            "rede de varejo abre 100 lojas",
            "marca em crescimento shopping",
            "rodada de investimento varejo"
        ]
        
        for kw in keywords:
            results = await self.google_search.search_expansion_news(kw)
            for item in results:
                # Parse + extrair nome da marca
                # Pode usar LLM para extrair entidades
                pass
        
        return brands
    
    # ------------------------------------------------------------------------
    # SCORING DE FIT COM SHOPPING
    # ------------------------------------------------------------------------
    
    def calculate_brand_fit_with_shopping(
        self,
        brand: Brand,
        shopping_data: Dict,
        mix_plan: Dict
    ) -> Dict:
        """
        Calcula fit score 0-100 entre marca e shopping
        
        Critérios:
        1. Categoria desejada no Mix Plan (0-30)
        2. Não está no Mix Plan de exclusão (0-15)
        3. Fit financeiro (0-15)
        4. Brand awareness (0-15)
        5. Stage de expansão alinhado (0-10)
        6. Geografia alinhada (0-15)
        """
        score = 0
        breakdown = {}
        
        # 1. Categoria desejada (0-30)
        target_categories = mix_plan.get("target_categories", [])
        if brand.category in target_categories:
            cat_score = 30
            breakdown["category_in_mix_plan"] = "Sim - Prioritária"
        elif brand.category in mix_plan.get("secondary_categories", []):
            cat_score = 18
            breakdown["category_in_mix_plan"] = "Secundária"
        else:
            cat_score = 5
            breakdown["category_in_mix_plan"] = "Fora do plano"
        score += cat_score
        
        # 2. Categoria não excluída (0-15)
        excluded = mix_plan.get("exclude_categories", [])
        if brand.category not in excluded:
            score += 15
            breakdown["not_excluded"] = True
        else:
            breakdown["not_excluded"] = False
        
        # 3. Fit financeiro (0-15)
        # Royalty e marketing fee razoáveis indicam marca saudável
        if brand.financials.royalty_pct <= 6 and brand.financials.marketing_fee_pct <= 3:
            score += 15
        elif brand.financials.royalty_pct <= 8:
            score += 10
        else:
            score += 5
        
        # 4. Brand awareness (0-15)
        if brand.brand_awareness_score and brand.brand_awareness_score >= 70:
            score += 15
        elif brand.instagram_followers and brand.instagram_followers >= 100000:
            score += 12
        elif brand.instagram_followers and brand.instagram_followers >= 30000:
            score += 8
        else:
            score += 4
        
        # 5. Stage de expansão (0-10)
        # SCALE é o melhor (provada e ainda crescendo)
        stage_scores = {
            ExpansionStage.SCALE: 10,
            ExpansionStage.GROWTH: 8,
            ExpansionStage.MATURITY: 6,
            ExpansionStage.SEED: 4,
            ExpansionStage.LEGACY: 1
        }
        score += stage_scores.get(brand.expansion_stage, 5)
        
        # 6. Geografia (0-15)
        shopping_state = shopping_data.get("state", "")
        if shopping_state in brand.states_target:
            score += 15
        elif shopping_state in brand.states_present:
            score += 10  # Já tem na região (pode expandir)
        else:
            score += 3  # Marca nova na região
        
        return {
            "total_score": min(score, 100),
            "breakdown": breakdown,
            "classification": self._classify_brand_fit(score)
        }
    
    def _classify_brand_fit(self, score: float) -> str:
        if score >= 80:
            return "MATCH PERFEITO - Iniciar negociação imediata"
        elif score >= 65:
            return "BOA OPORTUNIDADE - Apresentar shopping"
        elif score >= 50:
            return "POTENCIAL - Cultivar relação"
        else:
            return "BAIXO FIT - Não priorizar"
    
    # ------------------------------------------------------------------------
    # MATCHING COM ESPAÇOS DISPONÍVEIS
    # ------------------------------------------------------------------------
    
    def match_with_available_spaces(
        self,
        brand: Brand,
        available_spaces: List[Dict]
    ) -> List[SpaceMatch]:
        """
        Match marca com espaços vagos do shopping
        
        Validação técnica:
        - m² compatível
        - Pé-direito
        - Vitrine
        - Energia
        - Água/Esgoto (se food)
        - Localização (piso, ancla)
        """
        matches = []
        
        for space in available_spaces:
            score = 0
            checks = {}
            reasoning_parts = []
            
            req = brand.requirements
            
            # 1. Área (40 pts)
            space_m2 = space.get("area_total_sqm", 0)
            if req.m2_min <= space_m2 <= req.m2_max:
                score += 40
                checks["technical_fit"] = True
                reasoning_parts.append(f"Área OK: {space_m2}m²")
            elif space_m2 < req.m2_min:
                checks["technical_fit"] = False
                reasoning_parts.append(f"Área pequena demais ({space_m2}m² vs min {req.m2_min}m²)")
            else:
                checks["technical_fit"] = False
                reasoning_parts.append(f"Área grande demais ({space_m2}m² vs max {req.m2_max}m²)")
            
            # 2. Pé-direito (10 pts)
            if space.get("pe_direito", 0) >= req.pe_direito_min:
                score += 10
            else:
                reasoning_parts.append("⚠️ Pé-direito insuficiente")
            
            # 3. Vitrine (10 pts)
            if space.get("vitrine_metros_lineares", 0) >= req.vitrine_metros_min:
                score += 10
            else:
                reasoning_parts.append("⚠️ Vitrine pequena")
            
            # 4. Energia (10 pts)
            if space.get("energia_kva", 0) >= req.energia_kva_min:
                score += 10
            else:
                reasoning_parts.append("⚠️ Energia insuficiente")
            
            # 5. Infraestrutura específica (15 pts)
            infra_ok = True
            if req.requires_water and not space.get("agua_disponivel"):
                infra_ok = False
                reasoning_parts.append("⚠️ Sem água")
            if req.requires_sewage and not space.get("esgoto_disponivel"):
                infra_ok = False
                reasoning_parts.append("⚠️ Sem esgoto")
            if req.requires_loading_dock and not space.get("docas_proximidade"):
                reasoning_parts.append("⚠️ Sem doca")
            
            if infra_ok:
                score += 15
            
            # 6. Localização - piso (10 pts)
            space_floor = space.get("piso", 0)
            if not req.floor_preference or space_floor in req.floor_preference:
                score += 10
                checks["location_fit"] = True
            else:
                checks["location_fit"] = False
                reasoning_parts.append(f"Piso {space_floor} não ideal")
            
            # 7. Vizinhança (5 pts)
            neighbors = space.get("vizinhanca", [])
            avoid_competitors = req.avoid_competitors
            if not any(comp in neighbors for comp in avoid_competitors):
                score += 5
            else:
                reasoning_parts.append("⚠️ Concorrente próximo")
            
            # Comercial fit: assume true (validação posterior pelo Bahia)
            checks["commercial_fit"] = True
            
            match = SpaceMatch(
                space_id=space.get("id"),
                fit_score=score,
                technical_fit=checks.get("technical_fit", False),
                location_fit=checks.get("location_fit", False),
                commercial_fit=checks.get("commercial_fit", False),
                reasoning=" | ".join(reasoning_parts) if reasoning_parts else "Match completo"
            )
            matches.append(match)
        
        # Ordenar por fit_score
        matches.sort(key=lambda x: x.fit_score, reverse=True)
        return matches[:5]
    
    # ------------------------------------------------------------------------
    # MATCH COM INVESTIDORES
    # ------------------------------------------------------------------------
    
    def match_with_investors(
        self,
        brand: Brand,
        qualified_investors: List[Dict]
    ) -> List[InvestorMatch]:
        """
        Match marca com investidores qualificados (do FARMER)
        """
        matches = []
        
        for inv in qualified_investors:
            score = 0
            checks = {}
            reasoning = []
            
            # 1. Capital compatível (40 pts)
            inv_capital = inv.get("capital_initial", 0)
            if brand.financials.initial_investment_min <= inv_capital <= brand.financials.initial_investment_max * 1.3:
                score += 40
                checks["capital_compatible"] = True
                reasoning.append("Capital alinhado")
            elif inv_capital < brand.financials.initial_investment_min:
                checks["capital_compatible"] = False
                reasoning.append(f"Falta capital (R$ {brand.financials.initial_investment_min - inv_capital:,.0f})")
            else:
                score += 20
                checks["capital_compatible"] = True
                reasoning.append("Capital sobrando")
            
            # 2. Categoria de interesse (25 pts)
            if brand.category in inv.get("categories_interest", []):
                score += 25
            else:
                reasoning.append("Categoria fora de interesse")
            
            # 3. Perfil de parceiro (20 pts)
            inv_availability = inv.get("time_availability", "")
            if brand.partner_profile == "operador_ativo" and inv_availability == "integral":
                score += 20
                checks["profile_compatible"] = True
            elif brand.partner_profile == "passivo" and inv_availability == "passivo":
                score += 20
                checks["profile_compatible"] = True
            elif brand.partner_profile == "socio_parcial":
                score += 15
                checks["profile_compatible"] = True
            else:
                checks["profile_compatible"] = False
                reasoning.append("Perfil de parceria desalinhado")
            
            # 4. Experiência (15 pts)
            if brand.partner_experience_required == "alta" and inv.get("experience_level") in ["dono_loja", "franqueado"]:
                score += 15
            elif brand.partner_experience_required == "media":
                score += 12
            elif brand.partner_experience_required == "baixa":
                score += 10
            
            match = InvestorMatch(
                investor_id=inv.get("id"),
                fit_score=score,
                capital_compatible=checks.get("capital_compatible", False),
                profile_compatible=checks.get("profile_compatible", False),
                reasoning=" | ".join(reasoning)
            )
            matches.append(match)
        
        matches.sort(key=lambda x: x.fit_score, reverse=True)
        return matches[:10]
    
    # ------------------------------------------------------------------------
    # ANÁLISE COMPLETA
    # ------------------------------------------------------------------------
    
    async def run_full_analysis(
        self,
        brand: Brand,
        shopping_data: Dict,
        mix_plan: Dict,
        available_spaces: List[Dict],
        qualified_investors: List[Dict]
    ) -> BrandOutput:
        """Análise completa: marca × shopping × espaços × investidores"""
        
        # 1. Score fit com shopping
        fit = self.calculate_brand_fit_with_shopping(brand, shopping_data, mix_plan)
        brand.fit_score_with_shopping = fit["total_score"]
        
        # 2. Match com espaços
        space_matches = self.match_with_available_spaces(brand, available_spaces)
        
        # 3. Match com investidores
        investor_matches = self.match_with_investors(brand, qualified_investors)
        
        # 4. Mall profile ideal
        if shopping_data.get("posicionamento") == "premium" and brand.brand_awareness_score and brand.brand_awareness_score > 80:
            mall_profile = "Premium - Marca já alinha"
        elif shopping_data.get("posicionamento") == "family" and brand.category in ["food", "moda_familiar"]:
            mall_profile = "Family - Categoria apropriada"
        else:
            mall_profile = "Verificar alinhamento"
        
        # 5. Required format
        required_format = {
            "m2_range": f"{brand.requirements.m2_min}-{brand.requirements.m2_max}m²",
            "vitrine_min": f"{brand.requirements.vitrine_metros_min}m",
            "investment": f"R$ {brand.financials.initial_investment_min:,.0f}-{brand.financials.initial_investment_max:,.0f}",
            "type": brand.business_model
        }
        
        # 6. Deal priority
        if fit["total_score"] >= 75 and space_matches and space_matches[0].fit_score >= 70:
            priority = "ALTA"
        elif fit["total_score"] >= 60:
            priority = "MEDIA"
        else:
            priority = "BAIXA"
        
        # 7. Next actions
        next_actions = []
        if priority == "ALTA":
            next_actions.append("📞 Contato direto com expansion manager da marca")
            if investor_matches and investor_matches[0].fit_score >= 70:
                next_actions.append(f"🤝 Apresentar para investidor top match")
            if space_matches and space_matches[0].fit_score >= 70:
                next_actions.append(f"📐 Reservar espaço top match para visita técnica")
        elif priority == "MEDIA":
            next_actions.append("📧 Enviar pitch deck com oportunidade")
            next_actions.append("📅 Agendar reunião de apresentação")
        else:
            next_actions.append("📁 Adicionar à base de cultivar")
            next_actions.append("🔄 Revisitar em 3 meses")
        
        return BrandOutput(
            brand=brand,
            expansion_stage=brand.expansion_stage,
            required_format=required_format,
            ideal_mall_profile=mall_profile,
            fit_score=fit["total_score"],
            matching_spaces=space_matches,
            matching_investors=investor_matches,
            deal_priority=priority,
            next_actions=next_actions
        )


# ============================================================================
# ENDPOINTS
# ============================================================================

@router.post("/import-abf")
async def import_abf_data(file_path: str):
    """Importa base ABF (CSV exportado manualmente)"""
    data = ABFDataService.import_from_csv(file_path)
    return {"imported": len(data), "source": "ABF"}


@router.post("/discover")
async def discover_brands(region: str = "Brasil"):
    """Descobre marcas em expansão automaticamente"""
    ka = KAExpansionAgent(settings=None)
    brands = await ka.discover_expanding_brands(region)
    return {"discovered": len(brands), "brands": brands}


@router.post("/analyze-brand", response_model=BrandOutput)
async def analyze_brand(
    brand: Brand,
    shopping_data: Dict,
    mix_plan: Dict,
    available_spaces: List[Dict],
    qualified_investors: List[Dict]
):
    """Análise completa de uma marca"""
    ka = KAExpansionAgent(settings=None)
    result = await ka.run_full_analysis(
        brand, shopping_data, mix_plan,
        available_spaces, qualified_investors
    )
    return result
