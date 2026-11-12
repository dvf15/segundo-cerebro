"""
SIOS - Shopping Intelligent Operating System
FastAPI Backend v1.0

Estrutura modular para 7 agentes:
1. HUNTER - Prospecção
2. FARMER - Investidores
3. KA_EXPANSION - Marcas
4. ALAVANCADOR - Produtos Financeiros
5. BUILDER - Construção/Setup
6. SELLER - Vendas/Marketing
7. ORCHESTRATOR - Orquestrador Central

Início: Execute este arquivo com: uvicorn main:app --reload
API Docs: http://localhost:8000/docs
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, UUID, DateTime, Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, ValidationError
import os
import logging
from datetime import datetime, timedelta
import jwt
from functools import lru_cache
import json
import requests
from typing import Optional, List
import asyncio
from enum import Enum

# ============================================================================
# PART 1: CONFIGURAÇÃO E SEGURANÇA
# ============================================================================

# 1.1 VARIÁVEIS DE AMBIENTE
class Settings:
    """Carrega config do .env (ou variáveis de ambiente)"""
    
    # Database
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql://user:password@localhost:5432/sios_db"
    )
    
    # Segurança
    SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    
    # APIs Externas
    GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")
    GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
    SERASA_API_KEY = os.getenv("SERASA_API_KEY")
    SERASA_API_URL = "https://api.serasa.com.br/v1"
    
    INSTAGRAM_ACCESS_TOKEN = os.getenv("INSTAGRAM_ACCESS_TOKEN")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY")
    
    # Limites
    RATE_LIMIT_REQUESTS = 100
    RATE_LIMIT_WINDOW_SECONDS = 60
    
    # Logging
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

@lru_cache()
def get_settings():
    return Settings()

# 1.2 LOGGING
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 1.3 DATABASE
engine = create_engine(get_settings().DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ============================================================================
# PART 2: MODELOS PYDANTIC (Validação de entrada/saída)
# ============================================================================

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class ShoppingInput(BaseModel):
    nome: str
    cidade: str
    estado: str
    gla_total_sqm: float
    posicionamento: str
    meta_occupancy_taxa: float

class TenantInput(BaseModel):
    razao_social: str
    cnpj: str
    categoria_retail: str
    vendas_mensal: Optional[float] = None
    ticket_medio: Optional[float] = None

# ============================================================================
# PART 3: FUNÇÕES DE SEGURANÇA
# ============================================================================

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Gera JWT token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, get_settings().SECRET_KEY, algorithm=get_settings().ALGORITHM)
    return encoded_jwt

def verify_token(token: str = Header()):
    """Valida JWT token"""
    try:
        payload = jwt.decode(token, get_settings().SECRET_KEY, algorithms=[get_settings().ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_db():
    """Dependency: Session do banco"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============================================================================
# PART 4: AGENTE HUNTER - Prospecção Ativa
# ============================================================================

class HunterScoringEnum(str, Enum):
    EXCELENTE = "excelente"
    BOM = "bom"
    MODERADO = "moderado"
    BAIXO = "baixo"

class HunterProspecao(BaseModel):
    """Input para Hunter"""
    shopping_id: str
    raio_km: float  # 2-50
    categoria_retail: str
    coordinates: tuple  # (lat, lng)

class HunterOutput(BaseModel):
    """Output do Hunter"""
    brand_name: str
    category: str
    location: str
    instagram_followers: int
    estimated_revenue: Optional[float]
    experience_level: str
    fit_score: float  # 0-100
    sris_score: float
    priority: int
    reasoning: str

class HunterAgent:
    """
    HUNTER: Prospecting Active Innovation
    
    Responsabilidade:
    - Mapear negócios em raio 2-50km
    - Identificar oportunidades de mix
    - Entregar briefings priorizados para EV
    
    Dados de entrada:
    - Coordenadas do shopping
    - Raio de busca
    - Categorias desejadas
    - Mix plan do shopping
    
    Dados de saída:
    - Lista de prospects ranqueados
    - Score de fit (0-100)
    - Gap de mix
    - Rota de contato
    """
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.google_places_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        self.instagram_graph_url = "https://graph.instagram.com"
    
    async def search_nearby_businesses(
        self,
        latitude: float,
        longitude: float,
        radius_km: float,
        category: str
    ) -> List[dict]:
        """
        Busca negócios próximos usando Google Places API
        
        Custo: ~R$ 0,007 por request
        """
        try:
            radius_meters = radius_km * 1000
            
            # Mapeamento de categoria para tipo do Google
            category_type_map = {
                "moda": "clothing_store",
                "food": "restaurant",
                "servicos": "professional_services",
                "saude_beleza": "beauty_salon",
                "tech": "electronics_store",
                "pet": "pet_store",
                "esporte": "sporting_goods_store",
                "casa": "home_goods_store"
            }
            
            place_type = category_type_map.get(category.lower(), "point_of_interest")
            
            params = {
                "location": f"{latitude},{longitude}",
                "radius": radius_meters,
                "type": place_type,
                "key": self.settings.GOOGLE_PLACES_API_KEY
            }
            
            response = requests.get(self.google_places_url, params=params, timeout=10)
            response.raise_for_status()
            
            results = response.json().get("results", [])
            logger.info(f"Hunter: Encontrados {len(results)} estabelecimentos em {category}")
            
            return results
            
        except Exception as e:
            logger.error(f"Hunter: Erro na busca do Google Places: {str(e)}")
            return []
    
    async def get_instagram_signal(self, business_name: str) -> dict:
        """
        Busca sinais do Instagram (público, sem autenticação)
        
        Alternativa grátis: Scraping com Instagrapi (cuidado com rate limits)
        """
        try:
            # Nota: Para scraping real, usar biblioteca como Instagrapi
            # Por enquanto, retorna mock data
            
            return {
                "followers": 5000,
                "engagement_rate": 3.5,
                "posts_count": 150,
                "bio": "Fashion brand"
            }
        except Exception as e:
            logger.error(f"Hunter: Erro na busca Instagram: {str(e)}")
            return {}
    
    def score_fit(
        self,
        business: dict,
        shopping_mix_plan: dict,
        proximity_score: float
    ) -> float:
        """
        Calcula score de fit (0-100) do negócio com o shopping
        
        Critérios (SRIS - Shopping Retail Intelligence Scoring):
        - Presença no shopping (0-25 pontos)
        - Alinhamento ao mix plan (0-30 pontos)
        - Maturidade do negócio (0-25 pontos)
        - Proximidade + tráfego (0-20 pontos)
        """
        
        score = 0
        
        # 1. Presença (0-25)
        presence_in_shopping = business.get("presence_in_shopping", "absent")
        if presence_in_shopping == "absent":
            score += 25
        elif presence_in_shopping == "low_quality":
            score += 15
        elif presence_in_shopping == "competitor":
            score += 5
        
        # 2. Alinhamento ao mix plan (0-30)
        category = business.get("category", "")
        if category in shopping_mix_plan.get("target_categories", []):
            score += 30
        elif category in shopping_mix_plan.get("secondary_categories", []):
            score += 15
        elif category not in shopping_mix_plan.get("exclude_categories", []):
            score += 5
        
        # 3. Maturidade (0-25)
        google_rating = business.get("rating", 0)
        review_count = business.get("review_count", 0)
        
        if google_rating >= 4.5 and review_count >= 100:
            score += 25
        elif google_rating >= 4.0 and review_count >= 50:
            score += 18
        elif google_rating >= 3.5 and review_count >= 20:
            score += 12
        else:
            score += 5
        
        # 4. Proximidade + tráfego (0-20)
        score += proximity_score  # 0-20
        
        return min(score, 100)
    
    async def run(self, prospecao: HunterProspecao, shopping_mix: dict) -> List[HunterOutput]:
        """Main function do Hunter"""
        
        logger.info(f"Hunter iniciado para shopping {prospecao.shopping_id}")
        
        # 1. Buscar negócios próximos
        businesses = await self.search_nearby_businesses(
            latitude=prospecao.coordinates[0],
            longitude=prospecao.coordinates[1],
            radius_km=prospecao.raio_km,
            category=prospecao.categoria_retail
        )
        
        # 2. Enriquecer dados
        prospects = []
        for biz in businesses[:20]:  # Limita a 20 para economia de API
            
            # Sinal do Instagram
            ig_signal = await self.get_instagram_signal(biz.get("name"))
            
            # Scoring
            proximity_score = (1 - (biz.get("distance", 0) / (prospecao.raio_km * 1000))) * 20
            fit = self.score_fit(biz, shopping_mix, proximity_score)
            
            # SRIS Score (Shopping Retail Intelligence)
            sris = (fit + ig_signal.get("engagement_rate", 0) * 5 + 
                   min(biz.get("rating", 0), 5) / 5 * 20) / 3
            
            prospect = HunterOutput(
                brand_name=biz.get("name"),
                category=prospecao.categoria_retail,
                location=biz.get("formatted_address"),
                instagram_followers=ig_signal.get("followers", 0),
                estimated_revenue=None,  # Pode ser estimado com ML
                experience_level="established" if biz.get("rating", 0) >= 4.0 else "emerging",
                fit_score=fit,
                sris_score=sris,
                priority=int(fit / 10),  # 0-10
                reasoning=f"Score fit: {fit:.1f}. Rating: {biz.get('rating', 0)}. Reviews: {biz.get('review_count', 0)}"
            )
            
            prospects.append(prospect)
        
        # 3. Rankear por fit_score
        prospects.sort(key=lambda x: x.fit_score, reverse=True)
        
        logger.info(f"Hunter: {len(prospects)} prospects entregues")
        return prospects


# ============================================================================
# PART 5: AGENTE FARMER - Triagem de Investidores
# ============================================================================

class InvestorProfile(BaseModel):
    capital_inicial: float
    disponibilidade_tempo: str  # 'integral', 'parcial', 'passivo'
    experiencia: str  # 'nenhuma', 'funcionario', 'gerente', 'dono', 'franqueado'
    tolerancia_risco: str  # 'conservador', 'moderado', 'arrojado'
    categorias_interesse: List[str]

class FarmerOutput(BaseModel):
    investor_id: str
    nome: str
    capital: float
    suitability_score: float  # 0-100
    risk_profile: str
    qualified: bool
    reasoning: str

class FarmerAgent:
    """
    FARMER: Central de Inteligência de Investidores
    
    Responsabilidade:
    - Triagem de investidores com modelo suitability
    - Scoring automático de qualificação
    - Match inteligente com marcas/espaços
    
    Modelo Suitability inspirado em XP Investimentos
    """
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.serasa_url = settings.SERASA_API_URL
    
    async def get_credit_score(self, cpf_cnpj: str) -> Optional[float]:
        """
        Integração com SERASA Experian
        Retorna score de crédito (0-1000)
        
        Custo: Contrato B2B (R$ 300-500/mês)
        Alternativa grátis: Usar score interno baseado em dados públicos
        """
        try:
            # Mock - em produção, chamar SERASA
            # headers = {"Authorization": f"Bearer {self.settings.SERASA_API_KEY}"}
            # response = requests.get(f"{self.serasa_url}/score/{cpf_cnpj}", headers=headers)
            
            logger.info(f"Farmer: Consultando score SERASA para {cpf_cnpj[:3]}***")
            return 750.0  # Mock score
            
        except Exception as e:
            logger.error(f"Farmer: Erro na consulta SERASA: {str(e)}")
            return None
    
    def calculate_suitability_score(self, investor: InvestorProfile, credit_score: Optional[float]) -> float:
        """
        Calcula score suitability (0-100)
        
        Dimensões:
        1. Capital disponível (0-30)
        2. Experiência (0-20)
        3. Tolerância a risco (0-20)
        4. Disponibilidade (0-15)
        5. Credibilidade (0-15)
        """
        score = 0
        
        # 1. Capital (0-30)
        if investor.capital_inicial >= 500000:
            score += 30
        elif investor.capital_inicial >= 200000:
            score += 25
        elif investor.capital_inicial >= 100000:
            score += 20
        elif investor.capital_inicial >= 50000:
            score += 10
        else:
            score += 5
        
        # 2. Experiência (0-20)
        exp_map = {
            "franqueado": 20,
            "dono": 18,
            "gerente": 12,
            "funcionario": 6,
            "nenhuma": 3
        }
        score += exp_map.get(investor.experiencia, 3)
        
        # 3. Tolerância risco (0-20)
        # Note: isso é contextual. Aqui assume risk tolerance alinhada com oportunidade
        if investor.tolerancia_risco == "arrojado":
            score += 20
        elif investor.tolerancia_risco == "moderado":
            score += 15
        else:  # conservador
            score += 8
        
        # 4. Disponibilidade (0-15)
        if investor.disponibilidade_tempo == "integral":
            score += 15
        elif investor.disponibilidade_tempo == "parcial":
            score += 8
        else:  # passivo
            score += 12  # Sócio passivo pode ser ótimo
        
        # 5. Credibilidade (0-15)
        if credit_score:
            score += min((credit_score / 1000) * 15, 15)
        
        return min(score, 100)
    
    async def run(self, investor: InvestorProfile) -> FarmerOutput:
        """Main function do Farmer"""
        
        logger.info(f"Farmer avaliando novo investidor")
        
        # 1. Score de crédito
        credit_score = await self.get_credit_score("00000000000000")  # Mock CPF
        
        # 2. Score suitability
        suitability = self.calculate_suitability_score(investor, credit_score)
        
        # 3. Qualificado?
        qualified = suitability >= 60
        
        # 4. Risco
        risk_profile = "alto" if investor.tolerancia_risco == "arrojado" else \
                      "moderado" if investor.tolerancia_risco == "moderado" else "conservador"
        
        output = FarmerOutput(
            investor_id="inv_123",
            nome="Investidor Test",
            capital=investor.capital_inicial,
            suitability_score=suitability,
            risk_profile=risk_profile,
            qualified=qualified,
            reasoning=f"Capital: R${investor.capital_inicial:,.0f}. Exp: {investor.experiencia}. Score: {suitability:.1f}"
        )
        
        logger.info(f"Farmer: {'Qualificado' if qualified else 'Não qualificado'}")
        return output


# ============================================================================
# PART 6: FAST API APPLICATION
# ============================================================================

app = FastAPI(
    title="SIOS - Shopping Intelligent Operating System",
    description="Multi-Agent System for Shopping Retail Intelligence",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instanciar agentes
settings = get_settings()
hunter = HunterAgent(settings)
farmer = FarmerAgent(settings)

# ============================================================================
# ENDPOINTS
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.post("/api/v1/hunter/search")
async def hunter_search(
    prospecao: HunterProspecao,
    shopping_mix: dict
):
    """
    HUNTER: Inicia busca de prospects
    
    Input:
    - shopping_id
    - raio_km (2-50)
    - categoria_retail
    - coordinates (lat, lng)
    - shopping_mix: plano de mix do shopping
    
    Output: Lista de prospects ranqueados
    """
    try:
        prospects = await hunter.run(prospecao, shopping_mix)
        return {
            "status": "success",
            "agent": "hunter",
            "prospects_found": len(prospects),
            "data": [p.dict() for p in prospects]
        }
    except Exception as e:
        logger.error(f"Erro no Hunter: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/farmer/qualify")
async def farmer_qualify(investor: InvestorProfile):
    """
    FARMER: Qualifica investidor
    
    Input: Perfil do investidor
    Output: Score suitability + recomendação
    """
    try:
        result = await farmer.run(investor)
        return {
            "status": "success",
            "agent": "farmer",
            "data": result.dict()
        }
    except Exception as e:
        logger.error(f"Erro no Farmer: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/shopping/{shopping_id}/dashboard")
async def get_dashboard(shopping_id: str, db: Session = Depends(get_db)):
    """
    Dashboard consolidado do shopping
    
    Mostra:
    - Occupancy taxa
    - KPIs do mês
    - Prospects em pipeline
    - Investidores qualificados
    """
    return {
        "shopping_id": shopping_id,
        "occupancy_taxa": 92.5,
        "sales_sqm_mensal": 1250.00,
        "prospects_pipeline": 15,
        "investors_qualified": 8,
        "last_updated": datetime.utcnow().isoformat()
    }

# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
