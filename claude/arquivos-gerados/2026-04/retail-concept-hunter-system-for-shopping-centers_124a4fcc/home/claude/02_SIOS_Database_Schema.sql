-- SIOS - Shopping Intelligent Operating System
-- PostgreSQL Schema v1.0
-- Executar em ordem: 1. Extensions → 2. Enums → 3. Tables → 4. Indexes → 5. Triggers

---
-- PART 1: EXTENSIONS
---

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Full text search
CREATE EXTENSION IF NOT EXISTS "hstore";   -- Key-value storage


---
-- PART 2: ENUMS (tipos de dados)
---

CREATE TYPE role_enum AS ENUM ('admin', 'executor', 'viewer');
CREATE TYPE status_enum AS ENUM ('ativo', 'inativo', 'pausado');
CREATE TYPE tenant_status_enum AS ENUM ('prospect', 'negotiating', 'signed', 'operational', 'closed');
CREATE TYPE lead_status_enum AS ENUM ('novo', 'contato_feito', 'apresentacao', 'proposta', 'negotiacao', 'fechado', 'perdido');
CREATE TYPE fit_level_enum AS ENUM ('excelente', 'bom', 'moderado', 'baixo', 'incompatível');
CREATE TYPE investor_profile_enum AS ENUM ('conservador', 'moderado', 'arrojado');
CREATE TYPE payback_period_enum AS ENUM ('12_meses', '24_meses', '36_meses', '60_meses', 'indefinido');


---
-- PART 3: MAIN TABLES
---

-- 3.1 SHOPPING (Master)
CREATE TABLE IF NOT EXISTS shopping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL UNIQUE,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    cep VARCHAR(8),
    lat DECIMAL(10,7),
    lng DECIMAL(10,7),
    gla_total_sqm NUMERIC(10,2),  -- Gross Leasable Area
    area_comum_sqm NUMERIC(10,2),
    status status_enum DEFAULT 'ativo',
    posicionamento VARCHAR(50),  -- 'premium', 'family', 'convenience', etc
    telefone VARCHAR(20),
    email VARCHAR(100),
    gerente_venda VARCHAR(255),
    
    -- Metas
    meta_occupancy_taxa NUMERIC(5,2),  -- Ex: 95.00
    meta_sales_sqm_mensal NUMERIC(10,2),  -- R$/m²/mês
    meta_noi_anual NUMERIC(15,2),  -- Net Operating Income
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT shopping_valid_estado CHECK (estado ~ '^[A-Z]{2}$'),
    CONSTRAINT shopping_valid_gla CHECK (gla_total_sqm > 0)
);

-- 3.2 USUÁRIOS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shopping_id UUID NOT NULL REFERENCES shopping(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    role role_enum DEFAULT 'viewer',
    password_hash VARCHAR(255) NOT NULL,
    two_factor_secret VARCHAR(255),  -- TOTP secret
    last_login TIMESTAMP,
    status status_enum DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.3 PONTOS VAGOS (Vitrines Digitais)
CREATE TABLE IF NOT EXISTS espacos_disponiveis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shopping_id UUID NOT NULL REFERENCES shopping(id) ON DELETE CASCADE,
    
    -- Identificação
    localizacao_descritiva VARCHAR(255),  -- Ex: "Piso 1, Corredor Norte, Ancla Lojas Americanas"
    piso INT,
    corredor VARCHAR(50),
    numero_loja VARCHAR(20),
    
    -- Dimensões
    area_total_sqm NUMERIC(10,2) NOT NULL,
    area_venda_sqm NUMERIC(10,2),
    area_deposito_sqm NUMERIC(10,2),
    vitrine_metros_lineares NUMERIC(10,2),
    pe_direito NUMERIC(5,2),  -- em metros
    
    -- Infraestrutura técnica
    energia_kva NUMERIC(8,2),
    agua_disponivel BOOLEAN DEFAULT TRUE,
    esgoto_disponivel BOOLEAN DEFAULT TRUE,
    docas_proximidade BOOLEAN DEFAULT FALSE,
    ar_condicionado BOOLEAN DEFAULT TRUE,
    sprinkler BOOLEAN DEFAULT FALSE,
    
    -- Fluxo e positioning
    tipo_fluxo VARCHAR(50),  -- 'circulacao_geral', 'corredor_premium', 'ancla', etc
    fluxo_mensal_pessoas NUMERIC(10,0),
    ancora_proxima VARCHAR(255),
    vizinhanca TEXT,  -- JSON: ["Zara", "Prada", "Nike"]
    
    -- Comercial
    preco_m2_mensal NUMERIC(10,2),  -- R$/m²/mês
    luva_inicial NUMERIC(15,2),  -- Taxa inicial
    carencia_meses INT DEFAULT 0,  -- Meses sem aluguel
    condicoes_comerciais TEXT,  -- Notas extras
    
    -- Mídia
    fotos_url TEXT[],  -- Array de URLs
    planta_baixa_url VARCHAR(255),
    tour_360_url VARCHAR(255),
    
    -- Status
    status status_enum DEFAULT 'ativo',
    data_disponibilidade DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT espaco_valid_area CHECK (area_total_sqm > 0),
    CONSTRAINT espaco_valid_price CHECK (preco_m2_mensal > 0)
);

-- 3.4 PONTOS DE VENDA OPERACIONAIS (Tenants)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shopping_id UUID NOT NULL REFERENCES shopping(id) ON DELETE CASCADE,
    espaco_id UUID REFERENCES espacos_disponiveis(id),
    
    -- Identificação
    razao_social VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) NOT NULL,
    nome_fantasia VARCHAR(255),
    categoria_retail VARCHAR(100),  -- 'Moda', 'Food', 'Serviços', etc
    
    -- Gestão
    gerente_loja VARCHAR(255),
    email_gerente VARCHAR(100),
    telefone_gerente VARCHAR(20),
    
    -- Operacional
    data_abertura DATE,
    data_fechamento DATE,
    status tenant_status_enum DEFAULT 'operational',
    
    -- Performance
    vendas_mensal NUMERIC(15,2),
    ticket_medio NUMERIC(10,2),
    conversao_taxa NUMERIC(5,2),  -- Percentual
    qtd_funcionarios INT,
    margem_operacional NUMERIC(5,2),  -- Percentual
    
    -- Contrato
    valor_aluguel_mensal NUMERIC(15,2),
    valor_taxa_area_comum NUMERIC(15,2),
    data_inicio_contrato DATE,
    data_fim_contrato DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.5 INVESTIDORES (FARMER - CRM)
CREATE TABLE IF NOT EXISTS investidores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shopping_id UUID NOT NULL REFERENCES shopping(id) ON DELETE CASCADE,
    
    -- PF/PJ
    tipo_pessoa VARCHAR(2),  -- 'PF' ou 'PJ'
    nome VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(14),  -- Criptografado no app
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    
    -- Perfil Suitability
    capital_inicial NUMERIC(15,2),
    capital_disponivel_agora NUMERIC(15,2),
    disponibilidade_tempo VARCHAR(50),  -- 'integral', 'parcial', 'passivo'
    experiencia_nivel VARCHAR(50),  -- 'nenhuma', 'funcionario', 'gerente', 'dono', 'franqueado'
    tolerancia_risco investor_profile_enum,
    payback_esperado payback_period_enum,
    
    -- Preferências
    categorias_interesse TEXT[],  -- JSON array
    tamanho_loja_preferido VARCHAR(50),  -- 'pequeno', 'medio', 'grande'
    pracos_interesse TEXT[],  -- Array de cidades/regiões
    
    -- Scoring
    score_fit NUMERIC(5,2),  -- 0-100
    score_credito NUMERIC(5,2),  -- Integração SERASA
    score_qualidade_lead NUMERIC(5,2),
    
    -- Status
    status lead_status_enum DEFAULT 'novo',
    data_contato_inicial TIMESTAMP,
    data_ultima_comunicacao TIMESTAMP,
    observacoes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.6 MARCAS / FRANQUIAS (KA - Expansion CRM)
CREATE TABLE IF NOT EXISTS marcas_franquias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shopping_id UUID NOT NULL REFERENCES shopping(id) ON DELETE CASCADE,
    
    -- Identificação
    nome_marca VARCHAR(255) NOT NULL,
    tipo_negocio VARCHAR(50),  -- 'franquia', 'multimarca', 'monologo', 'pop-up'
    categoria_retail VARCHAR(100),
    
    -- Expansão
    unidades_existentes INT,
    estados_presenca TEXT[],
    pracos_interesse_futuro TEXT[],
    interesse_confirmado_neste_shopping BOOLEAN DEFAULT FALSE,
    
    -- Requisitos Técnicos
    m2_minimo NUMERIC(8,2),
    m2_maximo NUMERIC(8,2),
    pe_direito_minimo NUMERIC(5,2),
    vitrine_ml_minimo NUMERIC(8,2),
    energia_kva_minimo NUMERIC(8,2),
    agua_esgoto_obrigatorio BOOLEAN DEFAULT FALSE,
    docas_obrigatorio BOOLEAN DEFAULT FALSE,
    
    -- Investimento
    capital_inicial_minimo NUMERIC(15,2),
    capital_inicial_maximo NUMERIC(15,2),
    royalties_percentual NUMERIC(5,2),
    taxa_publicidade_percentual NUMERIC(5,2),
    
    -- Parceria
    perfil_parceiro VARCHAR(50),  -- 'operador_ativo', 'socio_parcial', 'passivo'
    
    -- Mix Strategy
    vizinhanca_desejada TEXT[],  -- Marcas amigas
    vizinhanca_evitar TEXT[],    -- Concorrentes
    
    -- Inteligência
    score_fit NUMERIC(5,2),  -- 0-100, vs. shopping
    growth_trajectory VARCHAR(50),  -- 'introducao', 'crescimento', 'maturidade'
    status lead_status_enum DEFAULT 'novo',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.7 MATCH INTELIGENTE (Orquestrador)
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shopping_id UUID NOT NULL REFERENCES shopping(id) ON DELETE CASCADE,
    
    investidor_id UUID REFERENCES investidores(id),
    marca_id UUID REFERENCES marcas_franquias(id),
    espaco_id UUID REFERENCES espacos_disponiveis(id),
    
    -- Scoring
    score_compatibilidade NUMERIC(5,2),  -- 0-100
    score_investor_brand NUMERIC(5,2),
    score_brand_space NUMERIC(5,2),
    score_space_investor NUMERIC(5,2),
    
    -- Status do Match
    status VARCHAR(50) DEFAULT 'proposto',  -- 'proposto', 'em_discussao', 'aceito', 'rejeitado'
    data_proposicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_resposta TIMESTAMP,
    
    -- Próximos Passos
    proxima_acao VARCHAR(255),
    data_proxima_reuniao DATE,
    responsavel_executor VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.8 PLANO DE MIX (Estratégia do Shopping)
CREATE TABLE IF NOT EXISTS mix_plan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shopping_id UUID NOT NULL REFERENCES shopping(id) ON DELETE CASCADE,
    
    -- Estrutura
    versao INT DEFAULT 1,
    data_criacao DATE DEFAULT CURRENT_DATE,
    periodo_vigencia_inicio DATE,
    periodo_vigencia_fim DATE,
    
    -- Por Categoria
    categoria VARCHAR(100) NOT NULL,
    status_atual VARCHAR(50),  -- 'presente', 'ausente', 'gap_qualidade', 'concorrencia'
    
    -- Metas
    qtd_lojas_desejadas INT,
    qtd_lojas_atuais INT,
    marcas_target TEXT[],  -- Array JSON
    marcas_excluir TEXT[],
    prioridade_preenchimento INT,  -- 1-10 (1 = máxima prioridade)
    
    -- Inovação
    inovacoes_desejadas TEXT[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.9 FORNECEDORES (Diretório Homologado)
CREATE TABLE IF NOT EXISTS fornecedores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shopping_id UUID NOT NULL REFERENCES shopping(id) ON DELETE CASCADE,
    
    nome_fornecedor VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),  -- 'arquiteto', 'engenheiro', 'tech', 'rh', 'juridico'
    especialidade VARCHAR(255),
    cnpj VARCHAR(14),
    email VARCHAR(100),
    telefone VARCHAR(20),
    
    -- Qualidade
    avaliacao NUMERIC(5,1),  -- 0-5 stars
    num_projetos INT,
    tempo_entrega_dias INT,
    
    -- Certificação
    homologado BOOLEAN DEFAULT FALSE,
    data_homologacao DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.10 PRODUTOS FINANCEIROS (ALAVANCADOR)
CREATE TABLE IF NOT EXISTS produtos_financeiros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shopping_id UUID NOT NULL REFERENCES shopping(id) ON DELETE CASCADE,
    
    tipo VARCHAR(50),  -- 'credito', 'seguro', 'beneficio', 'pagamento'
    nome_produto VARCHAR(255) NOT NULL,
    
    -- Condicoes
    taxa_juro NUMERIC(5,2),  -- Para crédito
    cobertura_maxima NUMERIC(15,2),
    elegibilidade_criteria TEXT,  -- JSON
    
    -- Integração
    instituicao_parceira VARCHAR(255),
    link_contratacao VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.11 AUDIT LOG (Conformidade + Segurança)
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    shopping_id UUID REFERENCES shopping(id),
    
    acao VARCHAR(255) NOT NULL,  -- 'CREATE', 'UPDATE', 'DELETE', 'READ'
    tabela VARCHAR(100),
    registro_id UUID,
    dados_anteriores JSONB,
    dados_novos JSONB,
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.12 RELATÓRIOS MENSAIS (cache)
CREATE TABLE IF NOT EXISTS relatorios_mensais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shopping_id UUID NOT NULL REFERENCES shopping(id) ON DELETE CASCADE,
    
    mes INT,  -- 1-12
    ano INT,
    
    -- KPIs
    occupancy_taxa NUMERIC(5,2),
    sales_total NUMERIC(15,2),
    sales_per_sqm NUMERIC(10,2),
    noi_mensal NUMERIC(15,2),
    
    -- Agentes
    novas_prospects_hunter INT,
    novos_investidores_farmer INT,
    matches_propostos INT,
    contratos_fechados INT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT relatorio_unique UNIQUE(shopping_id, mes, ano)
);


---
-- PART 4: INDEXES (Performance)
---

-- Busca por shopping
CREATE INDEX idx_users_shopping ON users(shopping_id);
CREATE INDEX idx_espacos_shopping ON espacos_disponiveis(shopping_id);
CREATE INDEX idx_tenants_shopping ON tenants(shopping_id);
CREATE INDEX idx_investidores_shopping ON investidores(shopping_id);
CREATE INDEX idx_marcas_shopping ON marcas_franquias(shopping_id);
CREATE INDEX idx_matches_shopping ON matches(shopping_id);

-- Busca por status
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_espacos_status ON espacos_disponiveis(status);
CREATE INDEX idx_investidores_status ON investidores(status);
CREATE INDEX idx_marcas_status ON marcas_franquias(status);

-- Busca geográfica
CREATE INDEX idx_shopping_location ON shopping USING gist (ll_to_earth(lat, lng));
CREATE INDEX idx_espacos_fluxo ON espacos_disponiveis(tipo_fluxo);

-- Full text search (HUNTER scouting)
CREATE INDEX idx_tenants_nome ON tenants USING gin (to_tsvector('portuguese', razao_social));
CREATE INDEX idx_marcas_nome ON marcas_franquias USING gin (to_tsvector('portuguese', nome_marca));

-- Busca por data
CREATE INDEX idx_matches_data ON matches(data_proposicao DESC);
CREATE INDEX idx_audit_timestamp ON audit_log(timestamp DESC);

-- Composite indexes (queries comuns)
CREATE INDEX idx_matches_composite ON matches(shopping_id, status, score_compatibilidade DESC);
CREATE INDEX idx_tenants_categoria ON tenants(shopping_id, categoria_retail);


---
-- PART 5: VIEWS ÚTEIS (Simplificam queries)
---

-- View: Oportunidades Abertas (HUNTER output)
CREATE OR REPLACE VIEW v_oportunidades_abertas AS
SELECT 
    ed.id,
    ed.shopping_id,
    ed.localizacao_descritiva,
    ed.area_total_sqm,
    ed.preco_m2_mensal,
    ed.fluxo_mensal_pessoas,
    ed.ancora_proxima,
    ed.status,
    (ed.area_total_sqm * ed.preco_m2_mensal) as aluguel_estimado_mensal
FROM espacos_disponiveis ed
WHERE ed.status = 'ativo'
ORDER BY ed.area_total_sqm DESC;

-- View: Investidores Qualificados (FARMER output)
CREATE OR REPLACE VIEW v_investidores_qualificados AS
SELECT 
    inv.id,
    inv.shopping_id,
    inv.nome,
    inv.capital_inicial,
    inv.disponibilidade_tempo,
    inv.tolerancia_risco,
    inv.score_fit,
    inv.score_credito,
    ROUND((inv.score_fit + inv.score_credito) / 2, 2) as score_medio
FROM investidores inv
WHERE inv.status IN ('contato_feito', 'apresentacao', 'proposta')
AND inv.score_fit >= 60
ORDER BY inv.score_medio DESC;

-- View: Marcas em Expansão Viáveis (KA output)
CREATE OR REPLACE VIEW v_marcas_viavel_expansao AS
SELECT 
    mf.id,
    mf.shopping_id,
    mf.nome_marca,
    mf.categoria_retail,
    mf.unidades_existentes,
    mf.m2_minimo,
    mf.capital_inicial_minimo,
    mf.score_fit,
    mf.growth_trajectory
FROM marcas_franquias mf
WHERE mf.status IN ('apresentacao', 'proposta')
AND mf.score_fit >= 65
ORDER BY mf.score_fit DESC;

-- View: Dashboard Ocupação
CREATE OR REPLACE VIEW v_dashboard_ocupacao AS
SELECT 
    s.id,
    s.nome,
    COUNT(DISTINCT ed.id) as total_espacos,
    COUNT(DISTINCT CASE WHEN ed.status = 'ativo' THEN ed.id END) as espacos_vagos,
    COUNT(DISTINCT t.id) as tenants_operacionais,
    ROUND(
        COUNT(DISTINCT t.id)::NUMERIC / NULLIF(COUNT(DISTINCT ed.id) + COUNT(DISTINCT t.id), 0) * 100, 
        2
    ) as occupancy_taxa
FROM shopping s
LEFT JOIN espacos_disponiveis ed ON s.id = ed.shopping_id
LEFT JOIN tenants t ON s.id = t.shopping_id
GROUP BY s.id, s.nome;


---
-- PART 6: TRIGGERS (Automação)
---

-- Trigger: Update timestamp automaticamente
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_shopping_update BEFORE UPDATE ON shopping
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER tr_espacos_update BEFORE UPDATE ON espacos_disponiveis
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER tr_tenants_update BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Trigger: Registrar todas as mudanças em audit_log
CREATE OR REPLACE FUNCTION audit_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (user_id, shopping_id, acao, tabela, registro_id, dados_anteriores, dados_novos)
    VALUES (
        COALESCE(current_setting('app.user_id', true)::uuid, NULL),
        COALESCE(NEW.shopping_id, OLD.shopping_id, NULL),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        to_jsonb(OLD),
        to_jsonb(NEW)
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_audit_tenants AFTER INSERT OR UPDATE OR DELETE ON tenants
    FOR EACH ROW EXECUTE FUNCTION audit_changes();

CREATE TRIGGER tr_audit_investidores AFTER INSERT OR UPDATE OR DELETE ON investidores
    FOR EACH ROW EXECUTE FUNCTION audit_changes();

CREATE TRIGGER tr_audit_marcas AFTER INSERT OR UPDATE OR DELETE ON marcas_franquias
    FOR EACH ROW EXECUTE FUNCTION audit_changes();


---
-- PART 7: INITIAL DATA (exemplo)
---

INSERT INTO shopping (nome, cidade, estado, gla_total_sqm, posicionamento, meta_occupancy_taxa)
VALUES 
    ('Shopping Mooca', 'São Paulo', 'SP', 35000, 'family', 95.00),
    ('Boulevard BH', 'Belo Horizonte', 'MG', 28000, 'premium', 92.00);

-- Confirm
SELECT 'Database initialized successfully!' as status;
