import { useState, useEffect, useMemo } from "react";
import { 
  Building2, Users, TrendingUp, FileText, Activity, 
  Search, Plus, ChevronRight, ChevronDown, Clock, 
  AlertCircle, CheckCircle2, XCircle, Phone, Mail, 
  Link2, MessageSquare, Download, RefreshCw, User,
  Calendar, Target, Filter, ArrowLeft, Save, X
} from "lucide-react";

const STAGES = [
  { id: "lead", label: "Lead", color: "bg-slate-100 text-slate-700 border-slate-300", dot: "bg-slate-400", order: 1 },
  { id: "qualified", label: "Qualified Lead", color: "bg-blue-50 text-blue-700 border-blue-300", dot: "bg-blue-400", order: 2 },
  { id: "contacted", label: "Contatado", color: "bg-blue-100 text-blue-800 border-blue-400", dot: "bg-blue-500", order: 3 },
  { id: "meeting_scheduled", label: "Reunião Agendada", color: "bg-amber-50 text-amber-700 border-amber-300", dot: "bg-amber-400", order: 4 },
  { id: "meeting_done", label: "Reunião Feita", color: "bg-amber-100 text-amber-800 border-amber-400", dot: "bg-amber-500", order: 5 },
  { id: "proposal", label: "Proposta", color: "bg-purple-50 text-purple-700 border-purple-300", dot: "bg-purple-400", order: 6 },
  { id: "negotiation", label: "Negociação", color: "bg-purple-100 text-purple-800 border-purple-400", dot: "bg-purple-500", order: 7 },
  { id: "loi", label: "LOI Assinado", color: "bg-emerald-50 text-emerald-700 border-emerald-300", dot: "bg-emerald-400", order: 8 },
  { id: "contract", label: "Contrato Assinado", color: "bg-emerald-100 text-emerald-800 border-emerald-500", dot: "bg-emerald-600", order: 9 },
  { id: "construction", label: "Em Obra", color: "bg-green-100 text-green-800 border-green-500", dot: "bg-green-600", order: 10 },
  { id: "opening", label: "Aberto", color: "bg-green-200 text-green-900 border-green-600", dot: "bg-green-700", order: 11 },
  { id: "lost", label: "Perdido/Pausado", color: "bg-rose-50 text-rose-700 border-rose-300", dot: "bg-rose-400", order: 99 },
];

const getStage = (id) => STAGES.find(s => s.id === id) || STAGES[0];

const INITIAL_MARCAS = [
  { id: "M01", nome: "H&M", saidaAlvo: "Lojas Americanas", ablM2: 2724, categoria: "Fast fashion intl.", canalContato: "Grupo Dorben (JV oficial H&M Brasil) via LinkedIn/Diretoria Allos", fonte: "Bloomberg Línea + Exame (mar/2026)", donoAllos: "Diretoria + KA", prazo: "15d", stage: "lead", proximaAcao: "Reunião institucional Dorben/H&M", prazoProximaAcao: null, blocker: "Plaza não está no plano H&M atual (CEO mencionou BH/Brasília)", probabilidade: 40, impacto: "Muito Alto", prioridade: "ALTA" },
  { id: "M02", nome: "Bullguer", saidaAlvo: "Foyer / Viena+Mania", ablM2: 330, categoria: "Hambúrguer autoral", canalContato: "bullguer.com.br | Instagram @bullguerrio | LinkedIn fundadores", fonte: "Pesquisa de campo Zona Sul Rio", donoAllos: "Street Converter", prazo: "21d", stage: "lead", proximaAcao: "Identificar fundadores e prospectar", prazoProximaAcao: null, blocker: null, probabilidade: 50, impacto: "Médio-Alto", prioridade: "ALTA" },
  { id: "M03", nome: "Ferro e Farinha", saidaAlvo: "Foyer / Viena+Mania", ablM2: 330, categoria: "Pizza autoral", canalContato: "ferroefarinha.com.br | (21) 3495-1552 (Catete) | @ferroefarinha", fonte: "You Must Go + Foursquare", donoAllos: "Street Converter", prazo: "21d", stage: "lead", proximaAcao: "Contato Catete (matriz) - sondar interesse mall", prazoProximaAcao: null, blocker: "Operação rua sem time corporativo - contato com fundador (Sei Shiroma)", probabilidade: 50, impacto: "Alto", prioridade: "ALTA" },
  { id: "M04", nome: "Tenore Churrascaria", saidaAlvo: "Mania de Churrasco (74m²)", ablM2: 74, categoria: "Churrascaria", canalContato: "tenore.com.br | (21) 2610-1893 | Av. Jornalista Alberto F. Torres 521, Icaraí", fonte: "Visit Niterói", donoAllos: "Street Converter", prazo: "21d", stage: "lead", proximaAcao: "Contato direto Icaraí - sondar expansão", prazoProximaAcao: null, blocker: null, probabilidade: 45, impacto: "Médio", prioridade: "MÉDIA" },
  { id: "M05", nome: "Cantón Peruvian/Chinese", saidaAlvo: "Foyer / Viena", ablM2: 256, categoria: "Chifa autoral", canalContato: "canton.com.br | @cantonbrasil | São Francisco beira-mar", fonte: "Wanderlog", donoAllos: "Street Converter", prazo: "21d", stage: "lead", proximaAcao: "Reunião comercial com operação SF", prazoProximaAcao: null, blocker: null, probabilidade: 55, impacto: "Médio-Alto", prioridade: "ALTA" },
  { id: "M06", nome: "TT Burguer (Troisgros)", saidaAlvo: "Foyer / Viena", ablM2: 256, categoria: "Hambúrguer autoral", canalContato: "ttburger.com.br - Grupo Thomas Troisgros", fonte: "You Must Go", donoAllos: "Street Converter", prazo: "21d", stage: "lead", proximaAcao: "Identificar contato comercial Grupo Troisgros", prazoProximaAcao: null, blocker: null, probabilidade: 40, impacto: "Alto", prioridade: "MÉDIA" },
  { id: "M07", nome: "Bossa Nova Bowl", saidaAlvo: "Foyer 1.500m²", ablM2: 1500, categoria: "Boliche compacto", canalContato: "bossanovabowl.com.br - SAC/Expansão site", fonte: "Site oficial", donoAllos: "KA Expansion", prazo: "30d", stage: "lead", proximaAcao: "Contato canal expansão site oficial", prazoProximaAcao: null, blocker: "n.v. expansão Rio", probabilidade: 45, impacto: "Alto", prioridade: "ALTA" },
  { id: "M08", nome: "Lock Quest", saidaAlvo: "Foyer 1.500m²", ablM2: 1500, categoria: "Escape rooms", canalContato: "lockquest.com.br - contato site", fonte: "Site", donoAllos: "KA Expansion", prazo: "30d", stage: "lead", proximaAcao: "Contato canal site", prazoProximaAcao: null, blocker: null, probabilidade: 45, impacto: "Alto", prioridade: "ALTA" },
  { id: "M09", nome: "EnigMa Escape", saidaAlvo: "Foyer 1.500m²", ablM2: 1500, categoria: "Escape rooms", canalContato: "enigmaescape.com.br", fonte: "Site", donoAllos: "KA Expansion", prazo: "30d", stage: "lead", proximaAcao: "Contato canal site", prazoProximaAcao: null, blocker: null, probabilidade: 40, impacto: "Alto", prioridade: "MÉDIA" },
  { id: "M10", nome: "Sandbox VR", saidaAlvo: "Foyer 1.500m²", ablM2: 1500, categoria: "VR multiplayer", canalContato: "sandboxvr.com (matriz) - franquia BR a prospectar", fonte: "Site matriz", donoAllos: "KA Expansion", prazo: "30d", stage: "lead", proximaAcao: "Localizar master franchisee BR", prazoProximaAcao: null, blocker: "n.v. master franchisee", probabilidade: 30, impacto: "Alto", prioridade: "MÉDIA" },
  { id: "M11", nome: "Topgolf Brasil", saidaAlvo: "Foyer 1.500m²", ablM2: 1500, categoria: "Entret esportivo", canalContato: "topgolf.com.br (Allianz Parque SP)", fonte: "Site Topgolf BR", donoAllos: "KA Expansion", prazo: "30d", stage: "lead", proximaAcao: "Validar interesse expansão RJ - SP é único site BR", prazoProximaAcao: null, blocker: "Operação ainda em pé na SP", probabilidade: 25, impacto: "Muito Alto", prioridade: "MÉDIA" },
  { id: "M12", nome: "Suplicy Cafés Especiais", saidaAlvo: "B&B Cafeteria / foyer", ablM2: 33, categoria: "Café especial autoral", canalContato: "suplicycafes.com.br | LinkedIn Diretoria Expansão", fonte: "Site Suplicy", donoAllos: "Hunter+KA", prazo: "30d", stage: "lead", proximaAcao: "Contato comercial - apresentar caixa", prazoProximaAcao: null, blocker: null, probabilidade: 55, impacto: "Médio", prioridade: "ALTA" },
  { id: "M13", nome: "The Coffee", saidaAlvo: "B&B / foyer", ablM2: 33, categoria: "Café especial", canalContato: "thecoffee.jp | franquia@thecoffee.jp", fonte: "Site The Coffee", donoAllos: "Hunter+KA", prazo: "30d", stage: "lead", proximaAcao: "Email franquia + LinkedIn", prazoProximaAcao: null, blocker: null, probabilidade: 50, impacto: "Médio", prioridade: "MÉDIA" },
  { id: "M14", nome: "Octavio Café", saidaAlvo: "B&B / foyer", ablM2: 33, categoria: "Café especial premium", canalContato: "octaviocafe.com.br", fonte: "Site", donoAllos: "Hunter+KA", prazo: "30d", stage: "lead", proximaAcao: "Validar interesse RJ (atual base SP)", prazoProximaAcao: null, blocker: "Base SP - n.v. expansão RJ", probabilidade: 30, impacto: "Médio", prioridade: "BAIXA" },
  { id: "M15", nome: "Coffee Lab", saidaAlvo: "B&B / foyer", ablM2: 33, categoria: "Café especial microlotes", canalContato: "coffeelab.com.br", fonte: "Site", donoAllos: "Hunter+KA", prazo: "30d", stage: "lead", proximaAcao: "Contato canal site", prazoProximaAcao: null, blocker: null, probabilidade: 40, impacto: "Médio", prioridade: "MÉDIA" },
  { id: "M16", nome: "ALO Yoga", saidaAlvo: "Adidas (205m²)", ablM2: 205, categoria: "Activewear premium", canalContato: "aloyoga.com.br/institucional/lojas | Iguatemi/I-Retail (rep BR)", fonte: "Site ALO + S.Mag", donoAllos: "KA", prazo: "30d", stage: "lead", proximaAcao: "Contato I-Retail (representante BR)", prazoProximaAcao: null, blocker: "1a loja Rio aberta abr/26 (VillageMall) - validar interesse 2a unidade", probabilidade: 35, impacto: "Alto", prioridade: "ALTA" },
  { id: "M17", nome: "Smart Fit", saidaAlvo: "Adidas / Físico Forma", ablM2: 205, categoria: "Academia", canalContato: "smartfit.com.br/contato | LinkedIn Diretoria Expansão", fonte: "Site Smart Fit", donoAllos: "KA", prazo: "30d", stage: "lead", proximaAcao: "Validar formato shopping (2 unidades Niterói são street)", prazoProximaAcao: null, blocker: null, probabilidade: 45, impacto: "Alto", prioridade: "ALTA" },
  { id: "M18", nome: "Cobasi (compacto)", saidaAlvo: "Americanas (parte) / caixa média", ablM2: 800, categoria: "Pet shop full", canalContato: "cobasi.com.br/parceria-expansao | LinkedIn Diretoria Expansão", fonte: "Site Cobasi", donoAllos: "KA", prazo: "30d", stage: "lead", proximaAcao: "Contato canal parceria-expansão", prazoProximaAcao: null, blocker: "1 unidade Niterói - validar interesse 2a", probabilidade: 45, impacto: "Alto", prioridade: "ALTA" },
  { id: "M19", nome: "Petz (compacto)", saidaAlvo: "Idem Cobasi - alternativa", ablM2: 800, categoria: "Pet shop full", canalContato: "petz.com.br/expansao | LinkedIn Diretoria Expansão", fonte: "Site Petz", donoAllos: "KA", prazo: "30d", stage: "lead", proximaAcao: "Contato canal expansão", prazoProximaAcao: null, blocker: null, probabilidade: 40, impacto: "Alto", prioridade: "MÉDIA" },
  { id: "M20", nome: "Dr. Consulta", saidaAlvo: "Espaço Crescer (165m²)", ablM2: 165, categoria: "Clínica multi-especialidade", canalContato: "drconsulta.com.br/expansao | LinkedIn Diretoria", fonte: "Site Dr. Consulta", donoAllos: "KA", prazo: "30d", stage: "lead", proximaAcao: "Contato canal expansão", prazoProximaAcao: null, blocker: null, probabilidade: 50, impacto: "Médio", prioridade: "ALTA" },
  { id: "M21", nome: "Le Beauté Salon Bar", saidaAlvo: "Walter Coiffeur (141m²)", ablM2: 141, categoria: "Salão + bar (conceito)", canalContato: "Cidade de Niterói matéria abr/2024 - prospectar Icaraí", fonte: "Cidade Niterói", donoAllos: "Street Converter", prazo: "21d", stage: "lead", proximaAcao: "Identificar proprietários via redes sociais", prazoProximaAcao: null, blocker: "Operador local pequeno - sem expansão estruturada", probabilidade: 40, impacto: "Médio", prioridade: "MÉDIA" },
  { id: "M22", nome: "Onodera Estética", saidaAlvo: "Walter Coiffeur / Crescer", ablM2: 141, categoria: "Clínica estética", canalContato: "onoderaestetica.com.br | 0800 7717070", fonte: "Site oficial", donoAllos: "KA", prazo: "30d", stage: "lead", proximaAcao: "Contato 0800 e canal expansão", prazoProximaAcao: null, blocker: null, probabilidade: 45, impacto: "Médio", prioridade: "MÉDIA" },
  { id: "M23", nome: "Maria Brigadeiro", saidaAlvo: "Cacau Noir (26m²)", ablM2: 26, categoria: "Brigaderia autoral", canalContato: "mariabrigadeiro.com.br | franquia@mariabrigadeiro.com.br", fonte: "Site", donoAllos: "Hunter", prazo: "30d", stage: "lead", proximaAcao: "Email franquia", prazoProximaAcao: null, blocker: null, probabilidade: 55, impacto: "Baixo", prioridade: "BAIXA" },
  { id: "M24", nome: "Amaro Guide Shop", saidaAlvo: "Foyer pop-up / caixa moda fem.", ablM2: 600, categoria: "DTC nativa digital", canalContato: "amaro.com | LinkedIn Diretoria Lojas Amaro", fonte: "Site Amaro", donoAllos: "Hunter", prazo: "45d", stage: "lead", proximaAcao: "LinkedIn Diretoria Expansão Amaro", prazoProximaAcao: null, blocker: null, probabilidade: 35, impacto: "Médio", prioridade: "MÉDIA" },
  { id: "M25", nome: "Sindilojas RJ (multifranqueados)", saidaAlvo: "Lote 28 caixas pequenas", ablM2: 1485, categoria: "Multifranqueados", canalContato: "sindilojas-rio.com.br | (21) 2272-1300", fonte: "Sindilojas RJ", donoAllos: "Farmer", prazo: "30d", stage: "lead", proximaAcao: "Reunião institucional Sindilojas", prazoProximaAcao: null, blocker: null, probabilidade: 50, impacto: "Médio-Alto", prioridade: "ALTA" },
];

const SAIDAS = [
  { id: "S01", nome: "Foyer Cinemark (redev)", ablM2: 5097, tipo: "Redevelopment", prioridade: "ALTA" },
  { id: "S02", nome: "Lojas Americanas", ablM2: 2724, tipo: "Substituição âncora", prioridade: "ALTA" },
  { id: "S03", nome: "Adidas", ablM2: 205, tipo: "Substituição", prioridade: "MÉDIA" },
  { id: "S04", nome: "Viena + Mania Churrasco", ablM2: 330, tipo: "Substituição autoral", prioridade: "MÉDIA" },
  { id: "S05", nome: "Walter Coiffeur", ablM2: 141, tipo: "Substituição", prioridade: "MÉDIA" },
  { id: "S06", nome: "Espaço Crescer", ablM2: 165, tipo: "Substituição saúde", prioridade: "MÉDIA" },
  { id: "S07", nome: "B&B Cafeteria", ablM2: 33, tipo: "Substituição café", prioridade: "MÉDIA" },
  { id: "S08", nome: "Físico e Forma", ablM2: 65, tipo: "Substituição wellness", prioridade: "MÉDIA" },
  { id: "S09", nome: "Cacau Noir", ablM2: 26, tipo: "Substituição doces", prioridade: "BAIXA" },
  { id: "S10", nome: "Lote 28 caixas pequenas", ablM2: 1485, tipo: "Lote multifranqueado", prioridade: "MÉDIA" },
];

function App() {
  const [view, setView] = useState("dashboard");
  const [data, setData] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [filter, setFilter] = useState({ stage: "all", dono: "all", search: "", prioridade: "all" });
  const [error, setError] = useState(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    try {
      let uName = null;
      try {
        const u = await window.storage.get("plaza_user_name", false);
        if (u) uName = u.value;
      } catch (e) {}
      setUserName(uName);

      let d = null;
      try {
        const r = await window.storage.get("plaza_pipeline_data_v1", true);
        if (r) d = JSON.parse(r.value);
      } catch (e) {}
      
      if (!d) {
        d = { marcas: INITIAL_MARCAS, saidas: SAIDAS, log: [], notes: {}, lastSeed: new Date().toISOString() };
        await window.storage.set("plaza_pipeline_data_v1", JSON.stringify(d), true);
      }
      setData(d);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function saveUserName(name) {
    try {
      await window.storage.set("plaza_user_name", name, false);
      setUserName(name);
    } catch (e) { setError(e.message); }
  }

  async function saveData(newData) {
    setData(newData);
    try {
      await window.storage.set("plaza_pipeline_data_v1", JSON.stringify(newData), true);
    } catch (e) { setError(e.message); }
  }

  async function updateMarca(id, updates, noteText = null) {
    const marca = data.marcas.find(m => m.id === id);
    if (!marca) return;
    const oldStage = marca.stage;
    const newMarcas = data.marcas.map(m => m.id === id ? { ...m, ...updates, lastUpdate: new Date().toISOString() } : m);
    const newNotes = { ...data.notes };
    if (noteText && noteText.trim()) {
      newNotes[id] = [{ date: new Date().toISOString(), text: noteText.trim(), user: userName || "Anônimo" }, ...(newNotes[id] || [])];
    }
    const changes = [];
    if (updates.stage && updates.stage !== oldStage) changes.push(`Estágio: ${getStage(oldStage).label} → ${getStage(updates.stage).label}`);
    if (updates.proximaAcao && updates.proximaAcao !== marca.proximaAcao) changes.push(`Próxima ação atualizada`);
    if (updates.prazoProximaAcao !== undefined && updates.prazoProximaAcao !== marca.prazoProximaAcao) changes.push(`Prazo: ${updates.prazoProximaAcao || "removido"}`);
    if (updates.probabilidade !== undefined && updates.probabilidade !== marca.probabilidade) changes.push(`Probabilidade: ${updates.probabilidade}%`);
    if (noteText && noteText.trim()) changes.push("Nota adicionada");

    const logEntry = {
      ts: new Date().toISOString(),
      user: userName || "Anônimo",
      target: marca.nome,
      changes: changes.join(" · ")
    };
    const newLog = [logEntry, ...(data.log || [])].slice(0, 200);
    await saveData({ ...data, marcas: newMarcas, notes: newNotes, log: newLog });
  }

  async function resetData() {
    if (!confirm("⚠️ Isto apagará TODAS as atualizações do time. Confirma reset para dados iniciais?")) return;
    const fresh = { marcas: INITIAL_MARCAS, saidas: SAIDAS, log: [], notes: {}, lastSeed: new Date().toISOString() };
    await saveData(fresh);
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-slate-500">Carregando…</div></div>;
  }

  if (!userName) {
    return <WelcomeScreen onSave={saveUserName} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header userName={userName} onChangeUser={() => setUserName(null)} />
      {error && (
        <div className="bg-rose-100 border-b border-rose-300 px-4 py-2 text-sm text-rose-800 flex items-center justify-between">
          <span>Erro: {error}</span>
          <button onClick={() => setError(null)}><X size={16} /></button>
        </div>
      )}
      <main className="max-w-4xl mx-auto p-3 sm:p-4">
        {view === "dashboard" && <Dashboard data={data} setView={setView} setFilter={setFilter} />}
        {view === "pipeline" && <Pipeline data={data} filter={filter} setFilter={setFilter} onSelectMarca={setSelectedMarca} />}
        {view === "saidas" && <Saidas data={data} onSelectMarca={setSelectedMarca} />}
        {view === "relatorio" && <Relatorio data={data} />}
        {view === "atividade" && <Atividade data={data} onReset={resetData} />}
      </main>
      <BottomNav view={view} setView={setView} />
      {selectedMarca && (
        <MarcaDetail
          marca={data.marcas.find(m => m.id === selectedMarca)}
          notes={data.notes[selectedMarca] || []}
          onClose={() => setSelectedMarca(null)}
          onUpdate={(updates, note) => updateMarca(selectedMarca, updates, note)}
        />
      )}
    </div>
  );
}

function WelcomeScreen({ onSave }) {
  const [name, setName] = useState("");
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="text-slate-700" size={28} />
          <h1 className="text-xl font-bold text-slate-800">Plaza Niterói</h1>
        </div>
        <p className="text-slate-500 text-sm mb-1">Sistema de Acompanhamento do Pipeline</p>
        <p className="text-slate-400 text-xs mb-6">Vacancy-to-Contract · Workflow 1</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Seu nome</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full mt-1 px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <p className="text-xs text-slate-400 mt-1.5">Aparece no histórico de alterações. Fica salvo neste navegador.</p>
          </div>
          <button
            onClick={() => name.trim() && onSave(name.trim())}
            disabled={!name.trim()}
            className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            Entrar
          </button>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="font-medium text-slate-600">Dados compartilhados:</span> todas as atualizações que você fizer ficarão visíveis para os demais membros do time que acessarem este sistema. Não armazene informações confidenciais sensíveis.
          </p>
        </div>
      </div>
    </div>
  );
}

function Header({ userName, onChangeUser }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="text-slate-700" size={20} />
          <div>
            <h1 className="font-semibold text-slate-800 text-sm leading-tight">Plaza Niterói</h1>
            <p className="text-xs text-slate-400 leading-tight">Pipeline Vacancy-to-Contract</p>
          </div>
        </div>
        <button onClick={onChangeUser} className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900">
          <User size={14} />
          <span className="hidden sm:inline">{userName}</span>
        </button>
      </div>
    </header>
  );
}

function BottomNav({ view, setView }) {
  const tabs = [
    { id: "dashboard", icon: TrendingUp, label: "Painel" },
    { id: "pipeline", icon: Target, label: "Pipeline" },
    { id: "saidas", icon: Building2, label: "Saídas" },
    { id: "relatorio", icon: FileText, label: "Relatório" },
    { id: "atividade", icon: Activity, label: "Atividade" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-10">
      <div className="max-w-4xl mx-auto grid grid-cols-5">
        {tabs.map(t => {
          const Icon = t.icon;
          const active = view === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`flex flex-col items-center gap-0.5 py-2.5 transition-colors ${active ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Dashboard({ data, setView, setFilter }) {
  const stats = useMemo(() => {
    const total = data.marcas.length;
    const abordadas = data.marcas.filter(m => m.stage !== "lead").length;
    const reunioes = data.marcas.filter(m => ["meeting_scheduled", "meeting_done", "proposal", "negotiation", "loi", "contract"].includes(m.stage)).length;
    const lois = data.marcas.filter(m => ["loi", "contract", "construction", "opening"].includes(m.stage)).length;
    const contratos = data.marcas.filter(m => ["contract", "construction", "opening"].includes(m.stage)).length;
    const perdidas = data.marcas.filter(m => m.stage === "lost").length;
    const ablRecolocada = data.marcas
      .filter(m => ["loi", "contract", "construction", "opening"].includes(m.stage))
      .reduce((s, m) => s + (m.ablM2 || 0), 0);
    return { total, abordadas, reunioes, lois, contratos, perdidas, ablRecolocada };
  }, [data]);

  const byStage = useMemo(() => {
    const counts = {};
    STAGES.forEach(s => counts[s.id] = 0);
    data.marcas.forEach(m => { counts[m.stage] = (counts[m.stage] || 0) + 1; });
    return STAGES.filter(s => counts[s.id] > 0).map(s => ({ ...s, count: counts[s.id] }));
  }, [data]);

  const proximas = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const in7days = new Date(today); in7days.setDate(in7days.getDate() + 7);
    return data.marcas
      .filter(m => m.prazoProximaAcao && new Date(m.prazoProximaAcao) <= in7days && !["contract", "construction", "opening", "lost"].includes(m.stage))
      .sort((a, b) => new Date(a.prazoProximaAcao) - new Date(b.prazoProximaAcao));
  }, [data]);

  const atrasadas = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return data.marcas.filter(m => m.prazoProximaAcao && new Date(m.prazoProximaAcao) < today && !["contract", "construction", "opening", "lost"].includes(m.stage));
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard icon={Target} label="Marcas-alvo" value={stats.total} sub="no pipeline" color="slate" />
        <StatCard icon={Users} label="Abordadas" value={stats.abordadas} sub={`${stats.total ? Math.round(stats.abordadas/stats.total*100) : 0}% do total`} color="blue" />
        <StatCard icon={CheckCircle2} label="LOIs/Contratos" value={stats.lois} sub={`${stats.contratos} assinados`} color="emerald" />
        <StatCard icon={Building2} label="ABL recolocada" value={`${stats.ablRecolocada.toLocaleString("pt-BR")} m²`} sub={`meta: 5.121 m² (85%)`} color="purple" small />
      </div>

      {atrasadas.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-rose-600" size={18} />
            <h3 className="font-semibold text-rose-800 text-sm">{atrasadas.length} {atrasadas.length === 1 ? "ação atrasada" : "ações atrasadas"}</h3>
          </div>
          <div className="space-y-1">
            {atrasadas.slice(0, 3).map(m => (
              <div key={m.id} className="text-xs text-rose-700 flex justify-between items-center bg-white rounded-lg px-2.5 py-1.5">
                <span className="font-medium truncate flex-1">{m.nome}</span>
                <span className="text-rose-500 text-[10px] ml-2 flex-shrink-0">{formatDateBR(m.prazoProximaAcao)}</span>
              </div>
            ))}
            {atrasadas.length > 3 && <button onClick={() => setView("pipeline")} className="text-xs text-rose-600 underline mt-1">Ver todas →</button>}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-3">
        <h3 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-1.5">
          <Activity size={16} /> Pipeline por estágio
        </h3>
        {byStage.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Nenhum dado ainda</p>
        ) : (
          <div className="space-y-1.5">
            {byStage.map(s => (
              <button
                key={s.id}
                onClick={() => { setFilter({ stage: s.id, dono: "all", search: "", prioridade: "all" }); setView("pipeline"); }}
                className="w-full flex items-center justify-between hover:bg-slate-50 -mx-1 px-1 py-1 rounded transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className="text-xs text-slate-700 truncate">{s.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full ${s.dot}`} style={{ width: `${(s.count / data.marcas.length) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-slate-600 w-6 text-right">{s.count}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-3">
        <h3 className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-1.5">
          <Clock size={16} /> Próximas ações (7 dias)
        </h3>
        {proximas.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Nenhuma ação com prazo nos próximos 7 dias</p>
        ) : (
          <div className="space-y-1.5">
            {proximas.slice(0, 5).map(m => (
              <div key={m.id} className="flex items-start justify-between gap-2 py-1.5 border-b border-slate-100 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{m.nome}</p>
                  <p className="text-[11px] text-slate-500 truncate">{m.proximaAcao}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-medium flex-shrink-0">{formatDateBR(m.prazoProximaAcao)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, small }) {
  const colors = {
    slate: "from-slate-50 to-slate-100 text-slate-800 border-slate-200",
    blue: "from-blue-50 to-blue-100 text-blue-900 border-blue-200",
    emerald: "from-emerald-50 to-emerald-100 text-emerald-900 border-emerald-200",
    purple: "from-purple-50 to-purple-100 text-purple-900 border-purple-200",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl border p-3`}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={14} className="opacity-70" />
        <span className="text-[11px] font-medium uppercase tracking-wide opacity-70">{label}</span>
      </div>
      <p className={`font-bold ${small ? "text-base" : "text-2xl"} leading-tight`}>{value}</p>
      <p className="text-[10px] opacity-60 mt-0.5">{sub}</p>
    </div>
  );
}

function Pipeline({ data, filter, setFilter, onSelectMarca }) {
  const filtered = useMemo(() => {
    return data.marcas.filter(m => {
      if (filter.stage !== "all" && m.stage !== filter.stage) return false;
      if (filter.dono !== "all" && m.donoAllos !== filter.dono) return false;
      if (filter.prioridade !== "all" && m.prioridade !== filter.prioridade) return false;
      if (filter.search && !m.nome.toLowerCase().includes(filter.search.toLowerCase()) &&
          !m.saidaAlvo.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      const sa = getStage(a.stage).order;
      const sb = getStage(b.stage).order;
      if (sa !== sb) return sa - sb;
      const pri = { ALTA: 1, MÉDIA: 2, BAIXA: 3 };
      return (pri[a.prioridade] || 4) - (pri[b.prioridade] || 4);
    });
  }, [data, filter]);

  const donos = useMemo(() => Array.from(new Set(data.marcas.map(m => m.donoAllos))).sort(), [data]);

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-slate-200 p-2.5">
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Buscar marca ou saída..."
            value={filter.search}
            onChange={e => setFilter({ ...filter, search: e.target.value })}
            className="w-full pl-8 pr-2.5 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <select value={filter.stage} onChange={e => setFilter({ ...filter, stage: e.target.value })} className="text-xs border border-slate-200 rounded-lg px-1.5 py-1 bg-white">
            <option value="all">Estágio: todos</option>
            {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <select value={filter.dono} onChange={e => setFilter({ ...filter, dono: e.target.value })} className="text-xs border border-slate-200 rounded-lg px-1.5 py-1 bg-white">
            <option value="all">Dono: todos</option>
            {donos.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filter.prioridade} onChange={e => setFilter({ ...filter, prioridade: e.target.value })} className="text-xs border border-slate-200 rounded-lg px-1.5 py-1 bg-white">
            <option value="all">Prioridade: todas</option>
            <option value="ALTA">ALTA</option>
            <option value="MÉDIA">MÉDIA</option>
            <option value="BAIXA">BAIXA</option>
          </select>
        </div>
      </div>

      <div className="text-xs text-slate-500 px-1">{filtered.length} {filtered.length === 1 ? "marca" : "marcas"} listadas</div>

      <div className="space-y-2">
        {filtered.length === 0 && <p className="text-sm text-slate-400 italic text-center py-8">Nenhuma marca corresponde aos filtros.</p>}
        {filtered.map(m => <MarcaCard key={m.id} marca={m} onClick={() => onSelectMarca(m.id)} />)}
      </div>
    </div>
  );
}

function MarcaCard({ marca, onClick }) {
  const stage = getStage(marca.stage);
  const priColors = { ALTA: "border-l-rose-500", MÉDIA: "border-l-amber-500", BAIXA: "border-l-slate-300" };
  const isOverdue = marca.prazoProximaAcao && new Date(marca.prazoProximaAcao) < new Date() && !["contract","construction","opening","lost"].includes(marca.stage);

  return (
    <button onClick={onClick} className={`w-full text-left bg-white rounded-xl border border-slate-200 border-l-4 ${priColors[marca.prioridade]} p-3 hover:border-blue-300 transition-all`}>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-slate-800 truncate">{marca.nome}</h3>
          <p className="text-[11px] text-slate-500 truncate">{marca.saidaAlvo} · {marca.ablM2.toLocaleString("pt-BR")} m²</p>
        </div>
        <ChevronRight size={16} className="text-slate-300 flex-shrink-0 mt-0.5" />
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${stage.color}`}>{stage.label}</span>
        <span className="text-[10px] text-slate-500">{marca.donoAllos}</span>
        {marca.prazoProximaAcao && (
          <span className={`text-[10px] flex items-center gap-0.5 ${isOverdue ? "text-rose-600 font-medium" : "text-slate-500"}`}>
            <Calendar size={10} />{formatDateBR(marca.prazoProximaAcao)}
          </span>
        )}
        {marca.probabilidade !== undefined && (
          <span className="text-[10px] text-slate-500 ml-auto">{marca.probabilidade}% prob.</span>
        )}
      </div>
    </button>
  );
}

function MarcaDetail({ marca, notes, onClose, onUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    stage: marca.stage,
    proximaAcao: marca.proximaAcao || "",
    prazoProximaAcao: marca.prazoProximaAcao || "",
    probabilidade: marca.probabilidade || 0,
    blocker: marca.blocker || "",
  });
  const [newNote, setNewNote] = useState("");
  const stage = getStage(marca.stage);

  function handleSave() {
    onUpdate(form, newNote);
    setNewNote("");
    setEditMode(false);
  }

  function handleQuickNote() {
    if (newNote.trim()) {
      onUpdate({}, newNote);
      setNewNote("");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between z-10">
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700"><ArrowLeft size={20} /></button>
          <h2 className="font-semibold text-sm text-slate-800 truncate flex-1 mx-3 text-center">{marca.nome}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700"><X size={20} /></button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${stage.color}`}>{stage.label}</span>
              <span className="text-[11px] text-slate-500">{marca.prioridade}</span>
              <span className="text-[11px] text-slate-500">· {marca.categoria}</span>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed">
              <p className="mb-1"><span className="font-medium text-slate-700">Saída-alvo:</span> {marca.saidaAlvo} · {marca.ablM2.toLocaleString("pt-BR")} m²</p>
              <p className="mb-1"><span className="font-medium text-slate-700">Dono Allos:</span> {marca.donoAllos}</p>
              <p><span className="font-medium text-slate-700">Impacto:</span> {marca.impacto}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 mb-1">Canal de Contato</p>
            <p className="text-xs text-slate-700 leading-relaxed">{marca.canalContato}</p>
            <p className="text-[10px] text-slate-400 mt-1">Fonte: {marca.fonte}</p>
          </div>

          {!editMode ? (
            <>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-blue-700 mb-1">Próxima Ação</p>
                <p className="text-xs text-blue-900 leading-relaxed">{marca.proximaAcao || "—"}</p>
                {marca.prazoProximaAcao && <p className="text-[10px] text-blue-600 mt-1">Prazo: {formatDateBR(marca.prazoProximaAcao)}</p>}
              </div>

              {marca.blocker && (
                <div className="bg-amber-50 rounded-lg p-3">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-amber-700 mb-1">Blocker</p>
                  <p className="text-xs text-amber-900 leading-relaxed">{marca.blocker}</p>
                </div>
              )}

              <button onClick={() => setEditMode(true)} className="w-full bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
                Atualizar status
              </button>
            </>
          ) : (
            <div className="space-y-3 bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wide text-slate-600">Estágio</label>
                <select value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })} className="w-full mt-1 px-2.5 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                  {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wide text-slate-600">Próxima ação</label>
                <textarea value={form.proximaAcao} onChange={e => setForm({ ...form, proximaAcao: e.target.value })} rows="2" className="w-full mt-1 px-2.5 py-2 text-sm border border-slate-300 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium uppercase tracking-wide text-slate-600">Prazo</label>
                  <input type="date" value={form.prazoProximaAcao} onChange={e => setForm({ ...form, prazoProximaAcao: e.target.value })} className="w-full mt-1 px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white" />
                </div>
                <div>
                  <label className="text-[11px] font-medium uppercase tracking-wide text-slate-600">Prob. (%)</label>
                  <input type="number" min="0" max="100" value={form.probabilidade} onChange={e => setForm({ ...form, probabilidade: parseInt(e.target.value) || 0 })} className="w-full mt-1 px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wide text-slate-600">Blocker</label>
                <textarea value={form.blocker} onChange={e => setForm({ ...form, blocker: e.target.value })} rows="2" className="w-full mt-1 px-2.5 py-2 text-sm border border-slate-300 rounded-lg" placeholder="Algum bloqueio? (opcional)" />
              </div>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wide text-slate-600">Adicionar nota</label>
                <textarea value={newNote} onChange={e => setNewNote(e.target.value)} rows="2" placeholder="Ex: Conversei com fulano, agendou para 5/jun..." className="w-full mt-1 px-2.5 py-2 text-sm border border-slate-300 rounded-lg" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditMode(false)} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium py-2 rounded-lg">Cancelar</button>
                <button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-1.5"><Save size={14} />Salvar</button>
              </div>
            </div>
          )}

          {!editMode && (
            <div className="border border-slate-200 rounded-lg p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 mb-2">Nota rápida</p>
              <textarea value={newNote} onChange={e => setNewNote(e.target.value)} rows="2" placeholder="Adicionar nota sem mudar status..." className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-lg" />
              <button onClick={handleQuickNote} disabled={!newNote.trim()} className="mt-2 w-full bg-slate-700 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-medium py-1.5 rounded-lg flex items-center justify-center gap-1">
                <MessageSquare size={12} />Adicionar nota
              </button>
            </div>
          )}

          {notes.length > 0 && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 mb-2">Histórico de notas ({notes.length})</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notes.map((n, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-2.5">
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{n.text}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{n.user} · {formatDateTimeBR(n.date)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Saidas({ data, onSelectMarca }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-2">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-2">
        <p className="text-xs text-blue-900 leading-relaxed">
          <span className="font-semibold">10 saídas prioritárias</span> agrupam as 38 saídas Ano 1. Cada uma tem múltiplas marcas-alvo no pipeline.
        </p>
      </div>
      {data.saidas.map(s => {
        const marcasDaSaida = data.marcas.filter(m => m.saidaAlvo.includes(s.nome.split(" ")[0]) || s.nome.toLowerCase().includes(m.saidaAlvo.toLowerCase().split(" ")[0]));
        const stagesDistinct = Array.from(new Set(marcasDaSaida.map(m => m.stage)));
        const hasWin = marcasDaSaida.some(m => ["loi","contract","construction","opening"].includes(m.stage));
        const isExpanded = expanded === s.id;
        const priColors = { ALTA: "border-l-rose-500", MÉDIA: "border-l-amber-500", BAIXA: "border-l-slate-300" };

        return (
          <div key={s.id} className={`bg-white rounded-xl border border-slate-200 border-l-4 ${priColors[s.prioridade]}`}>
            <button onClick={() => setExpanded(isExpanded ? null : s.id)} className="w-full text-left p-3 flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-slate-800">{s.nome}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{s.ablM2.toLocaleString("pt-BR")} m² · {s.tipo} · {marcasDaSaida.length} {marcasDaSaida.length === 1 ? "alternativa" : "alternativas"}</p>
                {hasWin && <span className="inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">Tem oportunidade avançada</span>}
              </div>
              {isExpanded ? <ChevronDown size={16} className="text-slate-400 flex-shrink-0 mt-1" /> : <ChevronRight size={16} className="text-slate-400 flex-shrink-0 mt-1" />}
            </button>
            {isExpanded && (
              <div className="px-3 pb-3 space-y-1.5 border-t border-slate-100 pt-2">
                {marcasDaSaida.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">Nenhuma marca-alvo atrelada nesta lista (pode ter sido reclassificada).</p>
                ) : marcasDaSaida.map(m => {
                  const st = getStage(m.stage);
                  return (
                    <button key={m.id} onClick={() => onSelectMarca(m.id)} className="w-full text-left bg-slate-50 hover:bg-slate-100 rounded-lg p-2 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-700 truncate">{m.nome}</p>
                        <p className="text-[10px] text-slate-500 truncate">{m.donoAllos}</p>
                      </div>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${st.color} flex-shrink-0`}>{st.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Relatorio({ data }) {
  const [period, setPeriod] = useState("week");
  const report = useMemo(() => generateReport(data, period), [data, period]);
  const [copied, setCopied] = useState(false);

  function copyToClipboard() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(report).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-slate-200 p-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="font-semibold text-sm text-slate-800">Relatório de Acompanhamento</h2>
          <select value={period} onChange={e => setPeriod(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white">
            <option value="week">Última semana</option>
            <option value="biweek">Últimas 2 semanas</option>
            <option value="month">Último mês</option>
            <option value="all">Tudo</option>
          </select>
        </div>
        <button onClick={copyToClipboard} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-lg flex items-center justify-center gap-1.5">
          <Download size={14} />{copied ? "Copiado!" : "Copiar relatório"}
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-3">
        <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-700 leading-relaxed overflow-x-auto">{report}</pre>
      </div>
    </div>
  );
}

function generateReport(data, period) {
  const now = new Date();
  let since = new Date(0);
  if (period === "week") { since = new Date(now); since.setDate(since.getDate() - 7); }
  else if (period === "biweek") { since = new Date(now); since.setDate(since.getDate() - 14); }
  else if (period === "month") { since = new Date(now); since.setMonth(since.getMonth() - 1); }

  const total = data.marcas.length;
  const byStage = STAGES.map(s => ({ s, count: data.marcas.filter(m => m.stage === s.id).length })).filter(x => x.count > 0);
  const recentActivity = (data.log || []).filter(l => new Date(l.ts) >= since);
  const updatedInPeriod = data.marcas.filter(m => m.lastUpdate && new Date(m.lastUpdate) >= since);
  const overdue = data.marcas.filter(m => m.prazoProximaAcao && new Date(m.prazoProximaAcao) < now && !["contract","construction","opening","lost"].includes(m.stage));
  const lois = data.marcas.filter(m => ["loi","contract","construction","opening"].includes(m.stage));
  const ablRecolocada = lois.reduce((s, m) => s + (m.ablM2 || 0), 0);

  const lines = [];
  lines.push(`RELATÓRIO PIPELINE - PLAZA NITERÓI`);
  lines.push(`Gerado em ${formatDateTimeBR(now.toISOString())}`);
  lines.push(`Período: ${period === "week" ? "última semana" : period === "biweek" ? "últimas 2 semanas" : period === "month" ? "último mês" : "completo"}`);
  lines.push(``);
  lines.push(`== RESUMO EXECUTIVO ==`);
  lines.push(`• Marcas-alvo no pipeline: ${total}`);
  lines.push(`• LOIs/contratos assinados: ${lois.length}`);
  lines.push(`• ABL recolocada: ${ablRecolocada.toLocaleString("pt-BR")} m² (meta 270d: 5.121 m²)`);
  lines.push(`• Atualizações no período: ${updatedInPeriod.length} marcas`);
  lines.push(`• Ações atrasadas: ${overdue.length}`);
  lines.push(``);
  lines.push(`== DISTRIBUIÇÃO POR ESTÁGIO ==`);
  byStage.forEach(x => lines.push(`• ${x.s.label}: ${x.count}`));
  lines.push(``);

  if (overdue.length > 0) {
    lines.push(`== AÇÕES ATRASADAS (${overdue.length}) ==`);
    overdue.forEach(m => {
      lines.push(`• ${m.nome} (${m.donoAllos})`);
      lines.push(`  Ação: ${m.proximaAcao || "—"}`);
      lines.push(`  Prazo: ${formatDateBR(m.prazoProximaAcao)} | Saída: ${m.saidaAlvo}`);
    });
    lines.push(``);
  }

  if (updatedInPeriod.length > 0) {
    lines.push(`== MARCAS ATUALIZADAS NO PERÍODO (${updatedInPeriod.length}) ==`);
    updatedInPeriod.sort((a,b) => new Date(b.lastUpdate) - new Date(a.lastUpdate)).forEach(m => {
      lines.push(`• ${m.nome} → ${getStage(m.stage).label} (${m.donoAllos})`);
      lines.push(`  ${m.proximaAcao || "Sem próxima ação definida"}`);
    });
    lines.push(``);
  }

  const altaPrio = data.marcas.filter(m => m.prioridade === "ALTA" && !["contract","construction","opening","lost"].includes(m.stage));
  if (altaPrio.length > 0) {
    lines.push(`== PIPELINE PRIORIDADE ALTA EM ABERTO (${altaPrio.length}) ==`);
    altaPrio.forEach(m => {
      lines.push(`• ${m.nome} | ${getStage(m.stage).label} | ${m.donoAllos}`);
      lines.push(`  Saída: ${m.saidaAlvo} (${m.ablM2.toLocaleString("pt-BR")} m²) | Prob.: ${m.probabilidade}%`);
      if (m.blocker) lines.push(`  Blocker: ${m.blocker}`);
    });
    lines.push(``);
  }

  if (recentActivity.length > 0) {
    lines.push(`== ATIVIDADE RECENTE (${recentActivity.length} eventos) ==`);
    recentActivity.slice(0, 15).forEach(l => {
      lines.push(`• [${formatDateBR(l.ts)}] ${l.user} → ${l.target}: ${l.changes || "atualizado"}`);
    });
  }

  return lines.join("\n");
}

function Atividade({ data, onReset }) {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-slate-200 p-3">
        <h2 className="font-semibold text-sm text-slate-800 mb-2">Histórico do time</h2>
        {(!data.log || data.log.length === 0) ? (
          <p className="text-xs text-slate-400 italic">Nenhuma atividade registrada ainda. Atualize uma marca para começar.</p>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {data.log.map((l, i) => (
              <div key={i} className="border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700">
                      <span className="font-medium">{l.user}</span> atualizou <span className="font-medium text-blue-700">{l.target}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{l.changes || "—"}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{formatDateTimeBR(l.ts)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl border border-rose-200 p-3">
        <h3 className="font-semibold text-sm text-rose-700 mb-1">Zona de risco</h3>
        <p className="text-xs text-slate-600 mb-2">Reset apaga TODAS as atualizações do time e volta para os dados iniciais.</p>
        <button onClick={onReset} className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <RefreshCw size={12} />Resetar dados
        </button>
      </div>
    </div>
  );
}

function formatDateBR(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

function formatDateTimeBR(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default App;
