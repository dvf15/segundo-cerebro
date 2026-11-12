// =================== PRICING ===================
const PRICING = {
  "claude-sonnet-4-6-20250929": {input:3.00, output:15.00},
  "claude-opus-4-7-20251201":   {input:15.00, output:75.00},
  "claude-haiku-4-5-20251001":  {input:1.00, output:5.00}
};

// =================== ESTADO ===================
let state = { shoppings:{}, activeShoppingId:null, history:[], drafts:{}, dbs:{}, globalDbs:{} };
let apiConfig = { key:"", model:"claude-sonnet-4-6-20250929", webSearch:true, maxTokens:6000 };
let currentRecordEdit = null;

// =================== STORAGE ===================
async function loadState() {
  try {
    const r = await window.storage.get("sios-state-v3");
    if (r && r.value) state = JSON.parse(r.value);
  } catch(e) {}
  if (!state.shoppings) state.shoppings = {};
  if (!state.dbs) state.dbs = {};
  if (!state.globalDbs) state.globalDbs = {};
  if (!state.history) state.history = [];
  if (!state.drafts) state.drafts = {};
  Object.keys(DATABASES).forEach(k => {
    if (DATABASES[k].scope === "global" && !state.globalDbs[k]) state.globalDbs[k] = [];
  });
  if (Object.keys(state.shoppings).length === 0) {
    seedPlaza();
    await saveState();
  }
  if (state.activeShoppingId && !state.dbs[state.activeShoppingId]) {
    state.dbs[state.activeShoppingId] = {};
    Object.keys(DATABASES).forEach(k => {
      if (DATABASES[k].scope === "shopping") state.dbs[state.activeShoppingId][k] = [];
    });
  }
  try { const a = localStorage.getItem("sios-api-config"); if (a) apiConfig = {...apiConfig, ...JSON.parse(a)}; } catch(e) {}
}
async function saveState() {
  try { await window.storage.set("sios-state-v3", JSON.stringify(state)); } catch(e) {}
}
function saveApiConfigToStorage() {
  try { localStorage.setItem("sios-api-config", JSON.stringify(apiConfig)); } catch(e) {}
}

function seedPlaza() {
  const id = "plaza-niteroi-" + Date.now();
  state.shoppings[id] = {
    id, nome:"Plaza Shopping Niterói", cidade:"Niterói", estado:"RJ",
    endereco:"Rua XV de Novembro, 8, Centro", cluster:"Entretenimento",
    operador:"Allos", abl:43000, lojas:300, ano:1986, abl_vaga:6028,
    batalhas:["Entretenimento","Gastronomia","Lojas"],
    target:"Famílias do Centro de Niterói + público regional.",
    concorrencia:"Bay Market, Icaraí Shopping, Niterói Shopping. Polos: Gavião Peixoto, Conde de Bonfim.",
    fortes:"Cinemark mantido, Espaço Gourmet consolidado.",
    lacunas:"Entret adulto, gastronomia autoral, cafés especiais.",
    saidas:"39 saídas Ano 1 (~6.028m²) + foyer Cinemark redev (5.097m²).",
    mix:"Cinemark, Coco Bambu, Outback, Madero, Abbraccio, NOI, L'Entrecôte, Benihana, Renner, Riachuelo, C&A, Marisa, Forever 21, Calvin Klein, Lacoste, GAP, Levi's, Reserva, Decathlon, Nike, Centauro, Trackfield, LEGO, Ri Happy, Bacio di Latte, Oakberry, Yogoberry, Bibi Sucos, Habib's"
  };
  state.activeShoppingId = id;
  state.dbs[id] = {};
  Object.keys(DATABASES).forEach(k => { if (DATABASES[k].scope === "shopping") state.dbs[id][k] = []; });
  state.dbs[id].hunter_targets = [
    {id:"h1", nome:"Bullguer", categoria:"Alimentação", subcategoria:"Hambúrguer autoral", cidade:"Rio de Janeiro", bairro:"Ipanema", raio_km:15, presenca_shopping:"AUSENTE", status_abordagem:"Identificado", score_fit:90, notas:"Várias unidades ZS Rio"},
    {id:"h2", nome:"Ferro e Farinha", categoria:"Alimentação", subcategoria:"Pizza autoral", cidade:"Rio de Janeiro", bairro:"Catete", raio_km:14, presenca_shopping:"AUSENTE", status_abordagem:"Identificado", score_fit:90, notas:"4 unidades RJ"},
    {id:"h3", nome:"Tenore Churrascaria", categoria:"Alimentação", subcategoria:"Churrascaria", cidade:"Niterói", bairro:"Icaraí", raio_km:3, presenca_shopping:"AUSENTE", status_abordagem:"Identificado", score_fit:78, notas:"Vista praia Icaraí"}
  ];
  if (!state.globalDbs.marcas || state.globalDbs.marcas.length === 0) {
    state.globalDbs.marcas = [
      {id:"m1", nome_marca:"H&M Brasil", categoria:"Moda", subcategoria:"Fast fashion", modelo_exp:"Loja própria", unidades_ativas:8, contato_nome:"Grupo Dorben (JV)", status_ka:"Watchlist"},
      {id:"m2", nome_marca:"Bossa Nova Bowl", categoria:"Entretenimento", subcategoria:"Boliche compacto", status_ka:"Watchlist"},
      {id:"m3", nome_marca:"Cobasi", categoria:"Pet", subcategoria:"Pet shop full", modelo_exp:"Loja própria", status_ka:"Watchlist"}
    ];
  }
  if (!state.globalDbs.produtos_fin || state.globalDbs.produtos_fin.length === 0) {
    state.globalDbs.produtos_fin = [
      {id:"f1", nome_produto:"Crédito para obra Allos", tipo:"Crédito para obra", parceiro:"Itaú BBA", valor_min:50000, valor_max:500000, taxa_juros:1.5, status_produto:"Ativo"}
    ];
  }
}

// =================== NAVIGATION ===================
function navigate(sectionId) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  const sect = document.getElementById(sectionId);
  if (sect) sect.classList.add("active");
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  const nav = document.querySelector('.nav-item[data-section="'+sectionId+'"]');
  if (nav) nav.classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
  if (sectionId === "home") renderHome();
  if (sectionId === "shopping") loadShoppingProfile();
  if (sectionId === "history") renderHistory();
  if (sectionId === "data") populateDbExportSelect();
  if (sectionId.startsWith("db-")) renderDbList(sectionId.replace("db-",""));
  if (sectionId.startsWith("wf") || sectionId.startsWith("agent-")) {
    loadDraft(sectionId);
    renderInjectionInfo(sectionId);
  }
}

// =================== SHOPPING ===================
function renderShoppingSwitcher() {
  const sel = document.getElementById("shoppingSelect");
  const ids = Object.keys(state.shoppings);
  if (ids.length === 0) {
    sel.innerHTML = '<option value="">— nenhum —</option>';
    document.getElementById("shoppingMeta").textContent = "";
    return;
  }
  sel.innerHTML = ids.map(id => {
    const s = state.shoppings[id];
    return '<option value="'+id+'" '+(id===state.activeShoppingId?"selected":"")+'>'+esc(s.nome)+'</option>';
  }).join("");
  const cur = state.shoppings[state.activeShoppingId];
  if (cur) {
    document.getElementById("shoppingMeta").innerHTML =
      (cur.cidade||"—") + " · " + (cur.cluster||"sem cluster") + "<br>" +
      (cur.abl ? Number(cur.abl).toLocaleString("pt-BR")+" m²" : "");
  }
}

function changeShopping(id) {
  state.activeShoppingId = id;
  if (!state.dbs[id]) {
    state.dbs[id] = {};
    Object.keys(DATABASES).forEach(k => { if (DATABASES[k].scope === "shopping") state.dbs[id][k] = []; });
  }
  saveState();
  renderShoppingSwitcher();
  renderHome();
  if (document.getElementById("shopping").classList.contains("active")) loadShoppingProfile();
  toast("Ativo: " + state.shoppings[id].nome);
}

function openShoppingModal() { document.getElementById("modalShopping").classList.add("active"); }
function closeShoppingModal() {
  document.getElementById("modalShopping").classList.remove("active");
  ["newSh_nome","newSh_cidade","newSh_estado"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("newSh_cluster").value = "";
}

async function createShopping() {
  const nome = document.getElementById("newSh_nome").value.trim();
  const cidade = document.getElementById("newSh_cidade").value.trim();
  const cluster = document.getElementById("newSh_cluster").value;
  if (!nome || !cidade || !cluster) { toast("Preencha nome, cidade, cluster", "error"); return; }
  const id = nome.toLowerCase().replace(/[^a-z0-9]/g,"-") + "-" + Date.now().toString(36);
  state.shoppings[id] = {
    id, nome, cidade, estado:document.getElementById("newSh_estado").value.trim(),
    cluster, batalhas:[], operador:"", endereco:"", abl:"", lojas:"", ano:"", reforma:"",
    vacancia:"", abl_vaga:"", target:"", concorrencia:"", fortes:"", lacunas:"", saidas:"", mix:""
  };
  state.activeShoppingId = id;
  state.dbs[id] = {};
  Object.keys(DATABASES).forEach(k => { if (DATABASES[k].scope === "shopping") state.dbs[id][k] = []; });
  await saveState();
  renderShoppingSwitcher();
  renderHome();
  closeShoppingModal();
  toast("Shopping criado: " + nome, "success");
  navigate("shopping");
}

async function confirmDeleteShopping() {
  const cur = state.shoppings[state.activeShoppingId];
  if (!cur) return;
  if (!confirm('Excluir "'+cur.nome+'"? Inclui bases.')) return;
  delete state.shoppings[state.activeShoppingId];
  delete state.dbs[state.activeShoppingId];
  state.activeShoppingId = Object.keys(state.shoppings)[0] || null;
  await saveState();
  renderShoppingSwitcher();
  renderHome();
  navigate("home");
  toast("Excluído");
}

function loadShoppingProfile() {
  const s = state.shoppings[state.activeShoppingId];
  if (!s) return;
  ["nome","cidade","estado","endereco","cluster","operador","abl","lojas","ano","reforma","vacancia","abl_vaga","target","concorrencia","fortes","lacunas","saidas","mix"].forEach(k => {
    const el = document.getElementById("sh_" + k);
    if (el) el.value = s[k] || "";
  });
  document.querySelectorAll("#sh_batalhas_group .pill-check").forEach(p => {
    const cb = p.querySelector("input");
    cb.checked = (s.batalhas||[]).includes(cb.value);
    p.classList.toggle("checked", cb.checked);
  });
}

async function saveShopping() {
  const s = state.shoppings[state.activeShoppingId];
  if (!s) return;
  ["nome","cidade","estado","endereco","cluster","operador","abl","lojas","ano","reforma","vacancia","abl_vaga","target","concorrencia","fortes","lacunas","saidas","mix"].forEach(k => {
    const el = document.getElementById("sh_" + k);
    if (el) s[k] = el.value;
  });
  s.batalhas = Array.from(document.querySelectorAll("#sh_batalhas_group input:checked")).map(i => i.value);
  await saveState();
  renderShoppingSwitcher();
  document.getElementById("shoppingSaveStatus").textContent = "Salvo · " + new Date().toLocaleTimeString("pt-BR");
  toast("Perfil salvo", "success");
}

// =================== BUILD SECTIONS ===================
function buildAllSections() {
  let html = "";
  // Bases
  Object.keys(DATABASES).forEach(dbKey => {
    const db = DATABASES[dbKey];
    html += '<section id="db-'+dbKey+'" class="section">';
    html += '<div class="breadcrumb">BASE <span class="sep">/</span> <span class="current">'+esc(db.title)+'</span></div>';
    html += '<h1 class="page-title"><span style="font-family:var(--display);color:var(--moss);font-size:0.65em;margin-right:8px;">'+db.icon+'</span>'+esc(db.title)+'</h1>';
    html += '<p class="page-desc">'+esc(db.subtitle)+'. <strong>Agente:</strong> '+esc(db.agent_link)+'. <span class="db-badge '+db.scope+'" style="margin-left:6px;">'+(db.scope==='global'?'Global':'Por shopping')+'</span></p>';
    html += '<div class="card">';
    html += '<div class="db-toolbar">';
    html += '<button class="btn btn-primary" onclick="openRecordModal(\''+dbKey+'\')">+ Novo registro</button>';
    html += '<input type="text" id="search-'+dbKey+'" placeholder="Buscar..." oninput="renderDbList(\''+dbKey+'\')">';
    html += '<span class="count" id="count-'+dbKey+'"></span>';
    html += '</div>';
    html += '<div class="db-table-wrap"><table class="db-table" id="table-'+dbKey+'"></table></div>';
    html += '</div></section>';
  });

  // Workflows
  const wfs = [
    {id:"wf1", num:"01", name:"Vacancy-to-Contract Sprint", sub:"Reduz vacância monetizada.",
     fields:[{key:"vagas",label:"Lojas vagas (extras)",type:"textarea"},{key:"raio",label:"Raio km",type:"text",val:"2-50"},{key:"meta",label:"Meta",type:"text"},{key:"lacunas",label:"Lacunas adicionais",type:"textarea"},{key:"blockers",label:"Blockers",type:"textarea"}]},
    {id:"wf2", num:"02", name:"Street-to-Shopping Conversion", sub:"Capta operadores de rua.",
     fields:[{key:"raio",label:"Raio",type:"text",val:"0-50km"},{key:"foco",label:"Foco",type:"select",options:["Gastronomia autoral","Moda multimarca","Serviços","Beleza","Cafés/padarias","Tudo"]},{key:"bairros",label:"Bairros/polos",type:"textarea"},{key:"pacote",label:"Pacote Alavancador",type:"textarea"},{key:"meta",label:"Meta",type:"text"}]},
    {id:"wf3", num:"03", name:"Cluster Experience Growth", sub:"Aumenta frequência, ticket, experiência.",
     fields:[{key:"obj",label:"Objetivo",type:"select",options:["Aumentar frequência","Aumentar ticket","Aumentar vendas","Reposicionar","Elevar NPS","Mídia"]},{key:"espacos",label:"Espaços de eventos",type:"textarea"},{key:"datas",label:"Sazonalidades",type:"textarea"},{key:"gaps",label:"Lacunas de experiência",type:"textarea"},{key:"orcamento",label:"Orçamento",type:"text"}]}
  ];
  wfs.forEach(wf => {
    html += '<section id="'+wf.id+'" class="section">';
    html += '<div class="breadcrumb">WORKFLOW <span class="sep">/</span> <span class="current">'+wf.num+' · '+esc(wf.name)+'</span></div>';
    html += '<h1 class="page-title">'+esc(wf.name)+'</h1><p class="page-desc">'+esc(wf.sub)+'</p>';
    html += '<div class="injection-info" id="inject-'+wf.id+'"></div>';
    html += '<div class="card"><h2>Parâmetros</h2><div class="form-grid">';
    wf.fields.forEach(f => {
      html += '<div class="full"><label>'+esc(f.label)+'</label>';
      if (f.type === "textarea") html += '<textarea id="'+wf.id+'_'+f.key+'"></textarea>';
      else if (f.type === "select") html += '<select id="'+wf.id+'_'+f.key+'">'+(f.options||[]).map(o=>'<option>'+esc(o)+'</option>').join("")+'</select>';
      else html += '<input type="text" id="'+wf.id+'_'+f.key+'" value="'+esc(f.val||"")+'">';
      html += '</div>';
    });
    html += '</div><div class="actions">';
    html += '<button class="btn btn-primary" id="btn-'+wf.id+'" onclick="executeBriefing(\''+wf.id+'\')">▸ Executar <span class="shortcut">⌘↵</span></button>';
    html += '<button class="btn" onclick="downloadPrompt(\''+wf.id+'\')">Baixar prompt</button>';
    html += '<button class="btn btn-ghost" onclick="clearForm(\''+wf.id+'\')">Limpar</button>';
    html += '</div><div class="cost-estimate">Custo estimado: $0.10-0.30 · v3 otimizado</div></div></section>';
  });

  // Agentes
  AGENTS.forEach(a => {
    const catColor = CATEGORIES_META.colors[a.category];
    const catIcon = CATEGORIES_META.icons[a.category];
    html += '<section id="agent-'+a.id+'" class="section">';
    html += '<div class="breadcrumb">AGENTE <span class="sep">/</span> <span class="current">'+String(a.id).padStart(2,"0")+' · '+esc(a.name)+'</span></div>';
    html += '<div style="margin-bottom:8px;"><span class="cat-badge" style="background:'+catColor+';"><span class="ic">'+catIcon+'</span>'+a.category+'</span></div>';
    html += '<h1 class="page-title">'+esc(a.name)+'</h1><p class="page-desc">'+esc(a.desc)+'</p>';
    html += '<div class="injection-info" id="inject-agent-'+a.id+'"></div>';
    html += '<div class="card"><h2>Parâmetros</h2><div class="form-grid">';
    (a.fields||[]).forEach(f => {
      const id = "agent"+a.id+"_"+f.key;
      html += '<div class="full"><label>'+esc(f.label)+'</label>';
      if (f.type === "textarea") html += '<textarea id="'+id+'"></textarea>';
      else if (f.type === "select") html += '<select id="'+id+'">'+(f.options||[]).map(o=>'<option>'+esc(o)+'</option>').join("")+'</select>';
      else html += '<input type="text" id="'+id+'" value="'+esc(f.defaultValue||"")+'">';
      html += '</div>';
    });
    html += '</div><div class="actions">';
    html += '<button class="btn btn-primary" id="btn-agent-'+a.id+'" onclick="executeBriefing(\'agent-'+a.id+'\')">▸ Executar</button>';
    html += '<button class="btn" onclick="downloadPrompt(\'agent-'+a.id+'\')">Baixar prompt</button>';
    html += '<button class="btn btn-ghost" onclick="clearForm(\'agent-'+a.id+'\')">Limpar</button>';
    html += '</div><div class="cost-estimate">Custo estimado: $0.03-0.15</div></div></section>';
  });

  document.getElementById("dynamicSections").innerHTML = html;
}

// =================== NAV/HOME RENDERERS ===================
function renderDbsNav() {
  document.getElementById("dbsNav").innerHTML = Object.keys(DATABASES).map((k,i) => {
    const db = DATABASES[k];
    const count = getDbRecords(k).length;
    return '<div class="nav-item db" data-section="db-'+k+'" onclick="navigate(\'db-'+k+'\')">'+
      '<span class="num">B'+(i+1)+'</span><span>'+esc(db.title.split(" (")[0])+'</span>'+
      (count > 0 ? '<span class="badge">'+count+'</span>' : '')+'</div>';
  }).join("");
}

function renderAgentsNav() {
  let html = "";
  CATEGORIES_META.list.forEach(cat => {
    const agentsInCat = AGENTS.filter(a => a.category === cat);
    if (agentsInCat.length === 0) return;
    const col = CATEGORIES_META.colors[cat];
    html += '<div class="group-label cat"><span class="cat-dot" style="background:'+col+';"></span>'+cat+'</div>';
    agentsInCat.forEach(a => {
      html += '<div class="nav-item" data-section="agent-'+a.id+'" onclick="navigate(\'agent-'+a.id+'\')">'+
        '<span class="num">'+String(a.id).padStart(2,"0")+'</span>'+
        '<span>'+esc(a.name.split(" / ")[0])+'</span></div>';
    });
  });
  document.getElementById("agentsByCategory").innerHTML = html;
}

function renderHomeDbsGrid() {
  document.getElementById("homeDbsGrid").innerHTML = Object.keys(DATABASES).map(k => {
    const db = DATABASES[k];
    const records = getDbRecords(k);
    return '<div class="item-card db" onclick="navigate(\'db-'+k+'\')">'+
      '<div class="db-icon">'+db.icon+'</div>'+
      '<h4>'+esc(db.title.split(" (")[0])+'</h4>'+
      '<p>'+esc(db.subtitle.slice(0,68))+(db.subtitle.length>68?"...":"")+'</p>'+
      '<div class="db-stats"><span class="v">'+records.length+'</span> registros · '+(db.scope==='global'?'Global':'Shopping')+'</div></div>';
  }).join("");
}

function renderHomeAgentsByCategory() {
  let html = "";
  CATEGORIES_META.list.forEach(cat => {
    const agentsInCat = AGENTS.filter(a => a.category === cat);
    if (agentsInCat.length === 0) return;
    const col = CATEGORIES_META.colors[cat];
    const ic = CATEGORIES_META.icons[cat];
    html += '<div class="cat-section"><div class="cat-header">';
    html += '<div class="cat-mark" style="background:'+col+';">'+ic+'</div>';
    html += '<h2>'+cat+'</h2>';
    html += '<span class="count">'+agentsInCat.length+' agente'+(agentsInCat.length>1?'s':'')+'</span>';
    html += '</div><div class="grid-4">';
    agentsInCat.forEach(a => {
      html += '<div class="item-card" onclick="navigate(\'agent-'+a.id+'\')">'+
        '<div class="ic-num">AGENTE '+String(a.id).padStart(2,"0")+'</div>'+
        '<h4>'+esc(a.name)+'</h4>'+
        '<p>'+esc(a.desc.slice(0,80))+(a.desc.length>80?"...":"")+'</p></div>';
    });
    html += '</div></div>';
  });
  document.getElementById("homeAgentsByCategory").innerHTML = html;
}

function renderHome() {
  const cur = state.shoppings[state.activeShoppingId];
  const my = cur ? state.history.filter(h => h.shoppingId === cur.id) : [];
  document.getElementById("cntExecutions").textContent = my.length;
  const tokens = my.reduce((s,h) => s + (h.usage?.input_tokens||0) + (h.usage?.output_tokens||0), 0);
  document.getElementById("cntTokens").textContent = tokens.toLocaleString("pt-BR");
  const cost = my.reduce((s,h) => s + (h.cost||0), 0);
  document.getElementById("cntCost").textContent = "$" + cost.toFixed(2);
  renderHomeDbsGrid();
  renderHomeAgentsByCategory();
  renderDbsNav();
}

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function toast(msg, type) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast show" + (type === "error" ? " error" : (type === "success" ? " success" : ""));
  setTimeout(() => t.className = "toast", 3000);
}
