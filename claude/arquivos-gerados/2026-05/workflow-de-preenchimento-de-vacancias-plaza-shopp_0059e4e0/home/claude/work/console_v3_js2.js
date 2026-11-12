// =================== DB CRUD ===================
function getDbRecords(dbKey) {
  const db = DATABASES[dbKey];
  if (!db) return [];
  if (db.scope === "global") return state.globalDbs[dbKey] || [];
  if (!state.activeShoppingId) return [];
  return (state.dbs[state.activeShoppingId] && state.dbs[state.activeShoppingId][dbKey]) || [];
}
function saveDbRecords(dbKey, records) {
  const db = DATABASES[dbKey];
  if (db.scope === "global") state.globalDbs[dbKey] = records;
  else {
    if (!state.dbs[state.activeShoppingId]) state.dbs[state.activeShoppingId] = {};
    state.dbs[state.activeShoppingId][dbKey] = records;
  }
}

function renderDbList(dbKey) {
  const db = DATABASES[dbKey];
  if (!db) return;
  const records = getDbRecords(dbKey);
  const search = (document.getElementById("search-"+dbKey)?.value || "").toLowerCase();
  const filtered = search ? records.filter(r => JSON.stringify(r).toLowerCase().includes(search)) : records;
  const table = document.getElementById("table-"+dbKey);
  document.getElementById("count-"+dbKey).innerHTML = 'Total: <span class="v">'+filtered.length+'</span>'+(records.length !== filtered.length ? ' (de '+records.length+')' : '');
  if (filtered.length === 0) {
    table.innerHTML = '<tr class="empty"><td>Nenhum registro. Use "+ Novo registro".</td></tr>';
    return;
  }
  const displayFields = pickDisplayFields(db);
  let html = '<thead><tr>';
  displayFields.forEach(f => html += '<th>'+esc(f.label)+'</th>');
  html += '<th></th></tr></thead><tbody>';
  filtered.forEach((r) => {
    html += '<tr>';
    displayFields.forEach(f => {
      let v = r[f.key];
      if (Array.isArray(v)) v = v.join(", ");
      if (v === undefined || v === null || v === "") { v = '<span style="color:var(--steel)">—</span>'; html += '<td>'+v+'</td>'; return; }
      if (f.key === "presenca_shopping" && typeof v === "string") {
        const cls = v === "AUSENTE" ? "ausente" : (v.includes("EXISTE") ? "existe" : "nv");
        v = '<span class="db-badge '+cls+'">'+esc(v)+'</span>';
      } else if (f.key === "status_homol" && typeof v === "string") {
        v = '<span class="db-badge '+(v === "Homologado" ? "homologado" : "nv")+'">'+esc(v)+'</span>';
      } else if (f.key === "prioridade" && typeof v === "string") {
        v = '<span class="db-badge '+v.toLowerCase()+'">'+esc(v)+'</span>';
      } else if (f.key === "status_produto" && typeof v === "string") {
        v = '<span class="db-badge '+(v === "Ativo" ? "ativo" : "pausado")+'">'+esc(v)+'</span>';
      } else {
        v = esc(String(v));
      }
      html += '<td>'+v+'</td>';
    });
    html += '<td class="actions-cell">';
    html += '<button onclick="editRecord(\''+dbKey+'\',\''+r.id+'\')">Editar</button>';
    html += '<button onclick="deleteRecord(\''+dbKey+'\',\''+r.id+'\')">×</button>';
    html += '</td></tr>';
  });
  html += '</tbody>';
  table.innerHTML = html;
}

function pickDisplayFields(db) {
  const result = [];
  if (db.label_field) {
    const f = db.fields.find(x => x.key === db.label_field);
    if (f) result.push(f);
  }
  const priority = ["categoria","tipo","status","status_homol","status_ka","status_abordagem","status_produto","presenca_shopping","capital","cidade","piso","prioridade","raio_km","parceiro"];
  priority.forEach(k => {
    if (result.length >= 6) return;
    const f = db.fields.find(x => x.key === k);
    if (f && !result.includes(f)) result.push(f);
  });
  return result.slice(0, 6);
}

function openRecordModal(dbKey, prefilled) {
  currentRecordEdit = {dbKey, recordId:null};
  const db = DATABASES[dbKey];
  document.getElementById("recordModalTitle").textContent = "Novo registro · " + db.title;
  document.getElementById("recordModalDesc").textContent = db.subtitle;
  document.getElementById("deleteRecordBtn").style.display = "none";
  buildRecordForm(dbKey, prefilled || {});
  document.getElementById("modalRecord").classList.add("active");
}

function editRecord(dbKey, recordId) {
  const records = getDbRecords(dbKey);
  const rec = records.find(r => r.id === recordId);
  if (!rec) return;
  currentRecordEdit = {dbKey, recordId};
  const db = DATABASES[dbKey];
  document.getElementById("recordModalTitle").textContent = "Editar · " + db.title;
  document.getElementById("recordModalDesc").textContent = db.subtitle;
  document.getElementById("deleteRecordBtn").style.display = "inline-flex";
  buildRecordForm(dbKey, rec);
  document.getElementById("modalRecord").classList.add("active");
}

function buildRecordForm(dbKey, record) {
  const db = DATABASES[dbKey];
  const groups = {};
  db.fields.forEach(f => { const g = f.group || "Geral"; if (!groups[g]) groups[g] = []; groups[g].push(f); });
  let html = '<div class="form-grid">';
  Object.keys(groups).forEach(g => {
    html += '<div class="form-section-title">'+esc(g)+'</div>';
    groups[g].forEach(f => {
      const fid = "rec_" + dbKey + "_" + f.key;
      const v = record[f.key] !== undefined ? record[f.key] : (f.defaultValue || "");
      const colCls = (f.type === "textarea" || f.type === "multi") ? "full" : "";
      html += '<div class="'+colCls+'"><label>'+esc(f.label)+
        (f.required ? ' <span class="required">*</span>' : '')+
        (f.hint ? ' <span class="hint">'+esc(f.hint)+'</span>' : '') + '</label>';
      if (f.type === "textarea") html += '<textarea id="'+fid+'">'+esc(v)+'</textarea>';
      else if (f.type === "select") {
        html += '<select id="'+fid+'"><option value="">—</option>';
        (f.options||[]).forEach(o => html += '<option '+(v === o ? "selected" : "")+'>'+esc(o)+'</option>');
        html += '</select>';
      } else if (f.type === "multi") {
        const arr = Array.isArray(v) ? v : (v ? [v] : []);
        html += '<div class="pill-group" id="'+fid+'">';
        (f.options||[]).forEach(o => {
          const checked = arr.includes(o);
          html += '<label class="pill-check'+(checked?" checked":"")+'"><input type="checkbox" value="'+esc(o)+'"'+(checked?" checked":"")+'><span>'+esc(o)+'</span></label>';
        });
        html += '</div>';
      } else if (f.type === "num") html += '<input type="number" id="'+fid+'" value="'+esc(v)+'">';
      else if (f.type === "date") html += '<input type="date" id="'+fid+'" value="'+esc(v)+'">';
      else if (f.type === "url") html += '<input type="url" id="'+fid+'" value="'+esc(v)+'">';
      else html += '<input type="text" id="'+fid+'" value="'+esc(v)+'">';
      html += '</div>';
    });
  });
  html += '</div>';
  document.getElementById("recordModalForm").innerHTML = html;
}

async function saveRecord() {
  if (!currentRecordEdit) return;
  const {dbKey, recordId} = currentRecordEdit;
  const db = DATABASES[dbKey];
  const record = recordId ? {...getDbRecords(dbKey).find(r => r.id === recordId)} : {};
  if (!record.id) record.id = "rec_" + Date.now().toString(36) + Math.random().toString(36).substr(2,5);
  db.fields.forEach(f => {
    const fid = "rec_" + dbKey + "_" + f.key;
    if (f.type === "multi") {
      const checks = document.querySelectorAll("#"+fid+" input:checked");
      record[f.key] = Array.from(checks).map(c => c.value);
    } else {
      const el = document.getElementById(fid);
      if (el) record[f.key] = f.type === "num" ? (el.value ? parseFloat(el.value) : "") : el.value;
    }
  });
  const missing = db.fields.filter(f => f.required && !record[f.key]).map(f => f.label);
  if (missing.length > 0) { toast("Obrigatórios: " + missing.join(", "), "error"); return; }
  const records = getDbRecords(dbKey);
  if (recordId) { const idx = records.findIndex(r => r.id === recordId); if (idx >= 0) records[idx] = record; }
  else records.push(record);
  saveDbRecords(dbKey, records);
  await saveState();
  closeRecordModal();
  renderDbList(dbKey);
  renderDbsNav();
  toast(recordId ? "Atualizado" : "Adicionado", "success");
}

async function deleteRecord(dbKey, recordId) {
  if (!confirm("Excluir registro?")) return;
  const records = getDbRecords(dbKey).filter(r => r.id !== recordId);
  saveDbRecords(dbKey, records);
  await saveState();
  renderDbList(dbKey);
  renderDbsNav();
  toast("Excluído");
}

function deleteCurrentRecord() {
  if (!currentRecordEdit || !currentRecordEdit.recordId) return;
  if (!confirm("Excluir registro?")) return;
  deleteRecord(currentRecordEdit.dbKey, currentRecordEdit.recordId);
  closeRecordModal();
}

function closeRecordModal() {
  document.getElementById("modalRecord").classList.remove("active");
  currentRecordEdit = null;
}

// =================== API ===================
function openApiModal() {
  document.getElementById("apiKeyInput").value = apiConfig.key || "";
  document.getElementById("apiModel").value = apiConfig.model;
  document.getElementById("apiWebSearch").value = String(apiConfig.webSearch);
  document.getElementById("apiMaxTokens").value = apiConfig.maxTokens;
  document.getElementById("modalApi").classList.add("active");
}
function closeApiModal() { document.getElementById("modalApi").classList.remove("active"); }

async function saveApiConfig() {
  const key = document.getElementById("apiKeyInput").value.trim();
  apiConfig.key = key;
  apiConfig.model = document.getElementById("apiModel").value;
  apiConfig.webSearch = document.getElementById("apiWebSearch").value === "true";
  apiConfig.maxTokens = parseInt(document.getElementById("apiMaxTokens").value) || 6000;
  saveApiConfigToStorage();
  if (!key) { toast("Chave removida"); updateApiStatus(false); closeApiModal(); return; }
  toast("Testando chave...");
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
      body:JSON.stringify({model:apiConfig.model, max_tokens:50, messages:[{role:"user",content:"ok"}]})
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    updateApiStatus(true);
    toast("✓ Conexão OK", "success");
    closeApiModal();
  } catch(e) { toast("Erro: " + e.message, "error"); updateApiStatus(false); }
}

function clearApiKey() {
  apiConfig.key = "";
  saveApiConfigToStorage();
  updateApiStatus(false);
  toast("Chave removida");
  closeApiModal();
}

function updateApiStatus(connected) {
  document.getElementById("apiLed").classList.toggle("on", connected);
  document.getElementById("apiStatusLabel").textContent = connected
    ? "API · " + apiConfig.model.split("-")[1] + " " + apiConfig.model.split("-")[2]
    : "API não configurada";
  document.getElementById("apiWarning").style.display = connected ? "none" : "block";
}

// =================== PROMPT BUILDING (OTIMIZADO) ===================
function buildShoppingHeader() {
  const s = state.shoppings[state.activeShoppingId];
  if (!s) return "[SEM SHOPPING]";
  const lines = [
    "## SHOPPING ATIVO",
    "Nome: " + s.nome + " | " + s.cidade + (s.estado ? "/"+s.estado : ""),
    "Cluster: " + s.cluster + " | Batalhas: " + ((s.batalhas||[]).join(", ") || "n.v."),
    "ABL: " + (s.abl ? Number(s.abl).toLocaleString("pt-BR")+"m²" : "n.v.") +
      " | Lojas: " + (s.lojas || "n.v.") + " | Vacância: " + (s.vacancia ? s.vacancia+"%" : "n.v.") +
      (s.abl_vaga ? " ("+Number(s.abl_vaga).toLocaleString("pt-BR")+"m²)" : "")
  ];
  if (s.target) lines.push("Target: " + s.target);
  if (s.concorrencia) lines.push("Concorrência: " + s.concorrencia);
  if (s.lacunas) lines.push("Lacunas: " + s.lacunas);
  if (s.saidas) lines.push("Saídas/risco: " + s.saidas);
  if (s.mix) lines.push("Mix atual (NÃO sugerir): " + s.mix);
  return lines.join("\n");
}

function compactRecord(record, db) {
  const labelF = db.label_field;
  const priorityKeys = [labelF, "categoria","tipo","status","status_homol","status_ka","status_abordagem","status_produto","presenca_shopping","capital","cidade","piso","prioridade","raio_km","valor_min","valor_max"];
  const parts = [];
  priorityKeys.forEach(k => {
    if (!k) return;
    const v = record[k];
    if (v && v !== "" && (!Array.isArray(v) || v.length > 0)) {
      const dispV = Array.isArray(v) ? v.join("/") : v;
      parts.push(k+": "+dispV);
    }
  });
  if (record.notas) parts.push("obs: " + String(record.notas).slice(0, 80));
  return parts.slice(0, 8).join(" | ");
}

function buildDbInjection(dbKeys) {
  if (!dbKeys || dbKeys.length === 0) return "";
  let txt = "\n\n## BASES DE DADOS (fonte primária)\n";
  dbKeys.forEach(dbKey => {
    const db = DATABASES[dbKey];
    if (!db) return;
    const records = getDbRecords(dbKey);
    txt += "\n### "+db.title+" ["+dbKey+"] ("+records.length+" reg"+(db.scope==="global"?", global":"")+")\n";
    if (records.length === 0) { txt += "(vazia)\n"; return; }
    records.slice(0, 15).forEach((r,i) => { txt += "- ["+(i+1)+"] " + compactRecord(r, db) + "\n"; });
    if (records.length > 15) txt += "... +"+(records.length-15)+" registros omitidos\n";
  });
  return txt;
}

function getDbsForSection(sectionId) {
  if (sectionId === "wf1") return ["pontos_vagos","plano_mix","marcas","hunter_targets","investidores"];
  if (sectionId === "wf2") return ["hunter_targets","pontos_vagos","produtos_fin","fornecedores"];
  if (sectionId === "wf3") return ["plano_mix"];
  if (sectionId.startsWith("agent-")) {
    const id = parseInt(sectionId.replace("agent-",""));
    const a = AGENTS.find(x => x.id === id);
    return a ? (a.uses_dbs || []) : [];
  }
  return [];
}

function renderInjectionInfo(sectionId) {
  const div = document.getElementById("inject-"+sectionId);
  if (!div) return;
  const dbs = getDbsForSection(sectionId);
  if (dbs.length === 0) {
    div.innerHTML = '<div class="title">▸ Sem bases injetadas</div><div style="font-size:11px;color:var(--steel);">Usa apenas perfil + parâmetros.</div>';
    return;
  }
  const chips = dbs.map(k => {
    const db = DATABASES[k];
    const n = getDbRecords(k).length;
    return '<span class="chip">'+db.icon+' '+esc(db.title.split(" (")[0])+': <span class="n">'+Math.min(n,15)+(n>15?"/"+n:"")+'</span></span>';
  }).join("");
  div.innerHTML = '<div class="title">▸ Bases injetadas (máx. 15 reg/base)</div><div class="list">'+chips+'</div>';
}

function getVal(id) { const el = document.getElementById(id); return el ? el.value.trim() : ""; }

function buildPromptForSection(sectionId) {
  const s = state.shoppings[state.activeShoppingId];
  if (!s) return null;
  let executionBlock, label, type;
  if (sectionId === "wf1") {
    type = "workflow"; label = "Vacancy-to-Contract Sprint";
    executionBlock = "Workflow: "+label+"\nLojas vagas extras: "+(getVal("wf1_vagas") || "(usar base Pontos Vagos)")+"\nRaio: "+getVal("wf1_raio")+" | Meta: "+(getVal("wf1_meta") || "n.v.")+"\nLacunas: "+(getVal("wf1_lacunas") || "(usar Plano de Mix)")+"\nBlockers: "+(getVal("wf1_blockers") || "n.v.");
  } else if (sectionId === "wf2") {
    type = "workflow"; label = "Street-to-Shopping Conversion";
    executionBlock = "Workflow: "+label+"\nRaio: "+getVal("wf2_raio")+" | Foco: "+getVal("wf2_foco")+"\nBairros: "+(getVal("wf2_bairros") || "n.v.")+"\nPacote Alavancador: "+(getVal("wf2_pacote") || "(usar base Produtos Financeiros)")+"\nMeta: "+(getVal("wf2_meta") || "n.v.");
  } else if (sectionId === "wf3") {
    type = "workflow"; label = "Cluster Experience Growth";
    executionBlock = "Workflow: "+label+"\nObjetivo: "+getVal("wf3_obj")+"\nEspaços: "+(getVal("wf3_espacos") || "n.v.")+"\nSazonalidades: "+(getVal("wf3_datas") || "n.v.")+"\nLacunas: "+(getVal("wf3_gaps") || "n.v.")+" | Orçamento: "+(getVal("wf3_orcamento") || "n.v.");
  } else if (sectionId.startsWith("agent-")) {
    const id = parseInt(sectionId.replace("agent-",""));
    const agent = AGENTS.find(a => a.id === id);
    type = "agent"; label = agent.name;
    const params = (agent.fields||[]).map(f => f.label+": "+(getVal("agent"+agent.id+"_"+f.key) || "n.v.")).join("\n");
    executionBlock = "Agente: "+String(agent.id).padStart(2,"0")+" · "+agent.name+" ("+agent.category+")\nDescrição: "+agent.desc+"\n\nParâmetros:\n"+params;
  } else return null;

  const dbInjection = buildDbInjection(getDbsForSection(sectionId));
  const prompt = buildShoppingHeader() + dbInjection +
    "\n\n## EXECUÇÃO\n" + executionBlock +
    "\n\n## REGRAS v5\n" +
    "1. Cluster First: cluster e batalhas como filtro.\n" +
    "2. Filtro de duplicidade OBRIGATÓRIO: NÃO sugerir marcas no Mix atual nem registros 'JÁ EXISTE' das bases.\n" +
    "3. Cluster Fit (0-40 não, 41-70 aceitável, 71-85 forte, 86-100 estratégico).\n" +
    "4. Use as bases injetadas como fonte primária. Use web search quando relevante.\n" +
    "5. Dados não verificáveis: \"n.v.\". Nunca inventar.\n" +
    "6. Cada recomendação: problema econômico, batalha, dono, prazo, impacto, KPI.\n" +
    "7. Confiança (1-10) ao final + ressalvas.\n" +
    "\n## AUTO-CADASTRO (IMPORTANTE — siga literalmente)\n" +
    "Sempre que sugerir uma nova entidade (marca, investidor, ponto, fornecedor, produto, target hunter), ADICIONE no final do output um bloco de código exatamente assim:\n" +
    "```ADD_TO_DB:<dbKey>\n" +
    "{\"campo1\":\"valor\",\"campo2\":\"valor\"}\n" +
    "```\n" +
    "dbKeys válidos: pontos_vagos, investidores, marcas, plano_mix, fornecedores, hunter_targets, produtos_fin.\n" +
    "Use JSON válido (aspas duplas, sem trailing comma). Inclua os campos relevantes (ex: nome_marca, categoria, presenca_shopping, status_abordagem, score_fit, notas). Um bloco por sugestão.\n" +
    "\n## FORMATO\nMarkdown. ## headings. Tabelas quando útil. Resumo executivo no início. Saída padrão v5: diagnóstico, oportunidades em tabela, plano 30/60/90, KPIs, riscos, próxima ação por dono.";
  return {prompt, label, type};
}

// =================== EXECUTION ===================
async function executeBriefing(sectionId) {
  const s = state.shoppings[state.activeShoppingId];
  if (!s) { toast("Selecione um shopping", "error"); return; }
  if (!s.cluster) { toast("Defina o cluster", "error"); navigate("shopping"); return; }
  const built = buildPromptForSection(sectionId);
  if (!built) return;
  if (!apiConfig.key) {
    if (confirm("API não configurada. Baixar prompt para colar manualmente?")) downloadPromptText(built.prompt, built.label);
    else openApiModal();
    return;
  }
  const btn = document.getElementById("btn-" + sectionId);
  const origText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="streaming-indicator"><span class="pulse"></span>Executando...</span>';

  const section = document.getElementById(sectionId);
  let outputBlock = section.querySelector(".output-block");
  if (outputBlock) outputBlock.remove();
  outputBlock = document.createElement("div");
  outputBlock.className = "output-block";
  outputBlock.innerHTML = '<div class="output-bar"><span class="label">▸ ' + esc(built.label) + ' · ' + esc(s.nome) + '</span><div class="actions-mini"><button onclick="copyOutput(this)">Copiar</button><button onclick="downloadOutput(this)">↓ MD</button></div></div><div class="output-content"><div class="streaming-indicator"><span class="pulse"></span>Aguardando API...</div></div>';
  section.querySelector(".card").appendChild(outputBlock);
  outputBlock.scrollIntoView({behavior:"smooth", block:"center"});

  const startTime = Date.now();
  try {
    const payload = { model:apiConfig.model, max_tokens:apiConfig.maxTokens, messages:[{role:"user", content:built.prompt}] };
    if (apiConfig.webSearch) payload.tools = [{type:"web_search_20250305", name:"web_search"}];
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{"Content-Type":"application/json","x-api-key":apiConfig.key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
      body:JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || "Erro API");
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n\n");
    const elapsed = ((Date.now() - startTime)/1000).toFixed(1);
    const usage = data.usage || {};
    const cost = (usage.input_tokens || 0) / 1e6 * (PRICING[apiConfig.model]||PRICING["claude-sonnet-4-6-20250929"]).input + (usage.output_tokens || 0) / 1e6 * (PRICING[apiConfig.model]||PRICING["claude-sonnet-4-6-20250929"]).output;

    const {cleanText, suggestions} = parseAddToDb(text);

    state.history.push({
      ts:Date.now(), shoppingId:s.id, shoppingNome:s.nome, type:built.type, sectionId, label:built.label,
      prompt:built.prompt, output:text, usage, cost, elapsed, model:apiConfig.model, webSearchUsed:apiConfig.webSearch, suggestions
    });
    if (state.history.length > 50) state.history = state.history.slice(-50);
    await saveState();

    let outputHtml = renderMarkdown(cleanText);
    if (suggestions.length > 0) outputHtml += renderSuggestions(suggestions);
    outputBlock.querySelector(".output-content").innerHTML = outputHtml;

    const stats = document.createElement("div");
    stats.className = "stats-bar";
    stats.innerHTML = '<span class="stat">Modelo: <span class="v">'+apiConfig.model.split("-").slice(1,3).join(" ")+'</span></span><span class="stat">Tokens in: <span class="v">'+(usage.input_tokens||0).toLocaleString("pt-BR")+'</span></span><span class="stat">Tokens out: <span class="v">'+(usage.output_tokens||0).toLocaleString("pt-BR")+'</span></span><span class="stat">Tempo: <span class="v">'+elapsed+'s</span></span><span class="stat">Custo: <span class="v">$'+cost.toFixed(3)+'</span></span>' + (suggestions.length > 0 ? '<span class="stat">Sugestões: <span class="v" style="color:var(--moss);">'+suggestions.length+'</span></span>' : '');
    outputBlock.appendChild(stats);
    toast("✓ "+elapsed+"s"+(suggestions.length>0?" · "+suggestions.length+" sugestões":""), "success");
    renderHome();
  } catch(e) {
    outputBlock.querySelector(".output-content").innerHTML = '<div style="color:var(--accent);padding:20px;"><strong>Erro:</strong> ' + esc(e.message) + '</div>';
    toast("Erro: " + e.message, "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = origText;
  }
}

// =================== AUTO-CADASTRO PARSER ===================
function parseAddToDb(text) {
  const suggestions = [];
  const regex = /```\s*ADD_TO_DB\s*:\s*([a-z_]+)\s*\n([\s\S]*?)```/gi;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const dbKey = match[1].toLowerCase().trim();
    const jsonRaw = match[2].trim();
    if (!DATABASES[dbKey]) continue;
    let parsed = null;
    try { parsed = JSON.parse(jsonRaw); } catch(e) {
      try {
        const fixed = jsonRaw.replace(/'/g, '"').replace(/,(\s*[}\]])/g, "$1");
        parsed = JSON.parse(fixed);
      } catch(e2) { console.warn("ADD_TO_DB JSON inválido:", e2.message); continue; }
    }
    if (parsed) {
      suggestions.push({
        id:"sug_"+Date.now().toString(36)+"_"+suggestions.length+Math.random().toString(36).substr(2,3),
        dbKey, data:parsed, added:false
      });
    }
  }
  const cleanText = text.replace(regex, "").trim();
  return {cleanText, suggestions};
}

function renderSuggestions(suggestions) {
  let html = '<div class="add-suggestions"><div class="title">Auto-cadastro · '+suggestions.length+' sugestão(ões) detectada(s)</div>';
  suggestions.forEach(sug => {
    const db = DATABASES[sug.dbKey];
    const dbName = db ? db.title : sug.dbKey;
    const labelF = db ? db.label_field : null;
    const previewName = labelF && sug.data[labelF] ? sug.data[labelF] : Object.values(sug.data)[0] || "(sem nome)";
    const previewFields = Object.entries(sug.data).slice(0, 4).map(([k,v]) => k+": "+(Array.isArray(v)?v.join("/"):v)).join(" · ");
    html += '<div class="add-suggestion-card" id="sug-card-'+sug.id+'">';
    html += '<div class="info"><div class="target">→ '+esc(dbName)+'</div>';
    html += '<div><strong>'+esc(String(previewName))+'</strong></div>';
    html += '<div class="preview">'+esc(previewFields)+'</div></div>';
    html += '<div style="display:flex;gap:5px;">';
    html += '<button class="btn" onclick="reviewSuggestion(\''+sug.id+'\')">Revisar</button>';
    html += '<button class="btn btn-success" onclick="addSuggestion(\''+sug.id+'\')">+ Adicionar</button>';
    html += '</div></div>';
  });
  if (suggestions.length > 1) {
    html += '<div style="margin-top:10px;text-align:right;"><button class="btn btn-success" onclick="addAllSuggestions()">+ Adicionar todas</button></div>';
  }
  html += '</div>';
  window._currentSuggestions = (window._currentSuggestions || []).concat(suggestions);
  return html;
}

function findSuggestion(sugId) { return (window._currentSuggestions || []).find(s => s.id === sugId); }

async function addSuggestion(sugId) {
  const sug = findSuggestion(sugId);
  if (!sug || sug.added) return;
  const db = DATABASES[sug.dbKey];
  if (!db) { toast("Base não encontrada: "+sug.dbKey, "error"); return; }
  if (db.scope === "shopping" && !state.activeShoppingId) { toast("Selecione um shopping primeiro", "error"); return; }
  const record = {...sug.data};
  if (!record.id) record.id = "rec_" + Date.now().toString(36) + Math.random().toString(36).substr(2,5);
  const records = getDbRecords(sug.dbKey);
  records.push(record);
  saveDbRecords(sug.dbKey, records);
  await saveState();
  sug.added = true;
  const card = document.getElementById("sug-card-"+sugId);
  if (card) {
    card.classList.add("added");
    const btn = card.querySelector(".btn-success");
    if (btn) { btn.textContent = "✓ Adicionado"; btn.disabled = true; }
  }
  renderDbsNav();
  toast("Adicionado à base "+db.title, "success");
}

function reviewSuggestion(sugId) {
  const sug = findSuggestion(sugId);
  if (!sug) return;
  openRecordModal(sug.dbKey, sug.data);
}

async function addAllSuggestions() {
  if (!window._currentSuggestions) return;
  let added = 0;
  for (const sug of window._currentSuggestions) {
    if (sug.added) continue;
    await addSuggestion(sug.id);
    added++;
  }
  toast("✓ "+added+" registros adicionados", "success");
}

// =================== MARKDOWN ===================
function renderMarkdown(text) {
  if (!text) return "";
  let h = esc(text);
  h = h.replace(/^### (.+)$/gm, '<h3>$1</h3>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^# (.+)$/gm, '<h1>$1</h1>')
       .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
       .replace(/(^|[^*])\*([^*\n]+)\*([^*]|$)/g, '$1<em>$2</em>$3').replace(/`([^`]+)`/g, '<code>$1</code>');
  h = h.replace(/(\|.+\|\n\|[\s\-:|]+\|\n(?:\|.+\|\n?)+)/g, m => {
    const lines = m.trim().split("\n");
    const head = lines[0].split("|").slice(1,-1).map(c => '<th>'+c.trim()+'</th>').join("");
    const rows = lines.slice(2).map(l => '<tr>' + l.split("|").slice(1,-1).map(c => '<td>'+c.trim()+'</td>').join("") + '</tr>').join("");
    return '<table><thead><tr>'+head+'</tr></thead><tbody>'+rows+'</tbody></table>';
  });
  h = h.replace(/^(\s*)([-*+]) (.+)$/gm, '$1<li>$3</li>').replace(/(<li>.*<\/li>\n?)+/g, m => '<ul>'+m+'</ul>')
       .replace(/^(\s*)\d+\. (.+)$/gm, '$1<oli>$2</oli>').replace(/(<oli>.*<\/oli>\n?)+/g, m => '<ol>'+m.replace(/oli/g,"li")+'</ol>');
  h = h.split(/\n\n+/).map(p => { if (p.match(/^<(h\d|ul|ol|table|li)/)) return p; return '<p>'+p.replace(/\n/g,"<br>")+'</p>'; }).join("\n");
  return h;
}

// =================== HISTORY ===================
function renderHistory() {
  const wrap = document.getElementById("historyList");
  if (state.history.length === 0) { wrap.innerHTML = '<div style="padding:40px;text-align:center;color:var(--steel);font-style:italic;">Nenhuma execução ainda.</div>'; return; }
  wrap.innerHTML = state.history.slice().reverse().map((h,i) =>
    '<div style="padding:14px 18px;border-bottom:1px solid var(--rule-soft);display:flex;justify-content:space-between;align-items:center;gap:12px;">' +
    '<div style="flex:1;"><div style="font-weight:600;font-size:13px;margin-bottom:2px;">' + esc(h.label) + '</div>' +
    '<div style="color:var(--steel);font-size:11px;font-family:var(--mono);">' + esc(h.shoppingNome) + ' · ' + new Date(h.ts).toLocaleString("pt-BR") + ' · $' + (h.cost||0).toFixed(3) + (h.suggestions?.length ? ' · '+h.suggestions.length+' sug.' : '') + '</div></div>' +
    '<div><button class="btn" style="padding:5px 10px;font-size:11px;" onclick="showHistoryItem('+(state.history.length-1-i)+')">Ver</button></div></div>'
  ).join("");
}

function showHistoryItem(idx) {
  const h = state.history[idx];
  if (!h) return;
  const wrap = document.getElementById("historyList").parentElement;
  let exist = wrap.querySelector(".output-block.hist");
  if (exist) exist.remove();
  const ob = document.createElement("div");
  ob.className = "output-block hist";
  ob.style.marginTop = "14px";
  ob.innerHTML = '<div class="output-bar"><span class="label">▸ ' + esc(h.label) + ' · ' + esc(h.shoppingNome) + '</span><div class="actions-mini"><button onclick="copyOutput(this)">Copiar</button><button onclick="this.closest(\'.output-block\').remove()">Fechar</button></div></div><div class="output-content">' + renderMarkdown(h.output || "(sem output)") + '</div>';
  wrap.appendChild(ob);
  ob.scrollIntoView({behavior:"smooth"});
}

function copyOutput(btn) {
  const text = btn.closest(".output-block").querySelector(".output-content").innerText;
  navigator.clipboard.writeText(text);
  toast("Copiado", "success");
}
function downloadOutput(btn) {
  const text = btn.closest(".output-block").querySelector(".output-content").innerText;
  const blob = new Blob([text], {type:"text/markdown"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "analise-" + new Date().toISOString().slice(0,10) + ".md";
  a.click();
}
function downloadPrompt(sectionId) {
  const built = buildPromptForSection(sectionId);
  if (built) downloadPromptText(built.prompt, built.label);
}
function downloadPromptText(text, label) {
  const cur = state.shoppings[state.activeShoppingId];
  const blob = new Blob([text], {type:"text/plain"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "prompt-" + (cur?cur.nome:"shopping").toLowerCase().replace(/[^a-z0-9]/g,"-") + "-" + label.toLowerCase().replace(/[^a-z0-9]/g,"-") + ".txt";
  a.click();
  toast("Prompt baixado");
}

// =================== EXPORT/IMPORT ===================
function exportAll() {
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "shopping-os-backup-" + new Date().toISOString().slice(0,10) + ".json";
  a.click();
  toast("Backup exportado", "success");
}

function exportCurrentShopping() {
  const s = state.shoppings[state.activeShoppingId];
  if (!s) { toast("Sem shopping ativo", "error"); return; }
  const data = { type:"shopping_export", shopping:s, dbs:state.dbs[s.id] || {}, history:state.history.filter(h => h.shoppingId === s.id), exportedAt:new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = s.nome.toLowerCase().replace(/[^a-z0-9]/g,"-") + "-" + new Date().toISOString().slice(0,10) + ".json";
  a.click();
  toast("Shopping exportado", "success");
}

function importAll() {
  const input = document.createElement("input");
  input.type = "file"; input.accept = "application/json";
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!data.shoppings) throw new Error("Arquivo inválido");
      if (!confirm("Importar substitui TODO o estado atual. Continuar?")) return;
      state = data;
      await saveState();
      renderShoppingSwitcher();
      renderHome();
      renderDbsNav();
      toast("Backup importado", "success");
    } catch(e) { toast("Erro: " + e.message, "error"); }
  };
  input.click();
}

function importShopping() {
  const input = document.createElement("input");
  input.type = "file"; input.accept = "application/json";
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const sh = data.shopping;
      if (!sh) throw new Error("Sem objeto shopping");
      if (state.shoppings[sh.id]) { if (!confirm('Shopping "'+sh.nome+'" já existe. Substituir?')) return; }
      state.shoppings[sh.id] = sh;
      if (data.dbs) state.dbs[sh.id] = data.dbs;
      if (data.history) state.history = state.history.concat(data.history);
      state.activeShoppingId = sh.id;
      await saveState();
      renderShoppingSwitcher();
      renderHome();
      renderDbsNav();
      toast("Shopping importado: " + sh.nome, "success");
    } catch(e) { toast("Erro: " + e.message, "error"); }
  };
  input.click();
}

function populateDbExportSelect() {
  const sel = document.getElementById("dbExportSelect");
  sel.innerHTML = Object.keys(DATABASES).map(k => {
    const db = DATABASES[k];
    const n = getDbRecords(k).length;
    return '<option value="'+k+'">'+db.title+' ('+n+(db.scope==='global'?" global":"")+')</option>';
  }).join("");
}

function exportSingleDB(format) {
  const dbKey = document.getElementById("dbExportSelect").value;
  if (!dbKey) return;
  const db = DATABASES[dbKey];
  const records = getDbRecords(dbKey);
  if (records.length === 0) { toast("Base vazia", "error"); return; }
  const baseName = dbKey + "-" + new Date().toISOString().slice(0,10);
  if (format === "json") {
    const data = { dbKey, scope:db.scope, exportedAt:new Date().toISOString(), records };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = baseName + ".json"; a.click();
    toast(records.length + " registros (JSON)", "success");
  } else {
    const headers = db.fields.map(f => f.label);
    const keys = db.fields.map(f => f.key);
    const rows = records.map(r => keys.map(k => {
      let v = r[k] || ""; if (Array.isArray(v)) v = v.join("/"); v = String(v).replace(/"/g, '""');
      return '"' + v + '"';
    }).join(";"));
    const csv = headers.map(h => '"' + h + '"').join(";") + "\n" + rows.join("\n");
    const blob = new Blob(["\ufeff" + csv], {type:"text/csv;charset=utf-8"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = baseName + ".csv"; a.click();
    toast(records.length + " registros (CSV)", "success");
  }
}

function importSingleDB(format) {
  const dbKey = document.getElementById("dbExportSelect").value;
  if (!dbKey) return;
  const db = DATABASES[dbKey];
  const input = document.createElement("input");
  input.type = "file"; input.accept = format === "json" ? "application/json" : ".csv,text/csv";
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      let newRecords;
      if (format === "json") {
        const data = JSON.parse(text);
        newRecords = Array.isArray(data) ? data : (data.records || []);
      } else { newRecords = parseCsv(text, db); }
      if (!newRecords || newRecords.length === 0) throw new Error("Sem registros válidos");
      const merge = confirm("Importar "+newRecords.length+" registros para "+db.title+"?\n\nOK = MERGE (adiciona)\nCancelar = SUBSTITUI todos");
      const existing = getDbRecords(dbKey);
      const finalRecords = (merge ? existing.concat(newRecords) : newRecords).map(r => {
        if (!r.id) r.id = "rec_" + Date.now().toString(36) + Math.random().toString(36).substr(2,5);
        return r;
      });
      saveDbRecords(dbKey, finalRecords);
      await saveState();
      populateDbExportSelect();
      renderDbsNav();
      toast(newRecords.length+" registros importados", "success");
    } catch(e) { toast("Erro: " + e.message, "error"); }
  };
  input.click();
}

function parseCsv(text, db) {
  const lines = text.replace(/^\ufeff/, "").split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  function parseRow(l) {
    const cols = []; let cur = "", inQ = false;
    for (let i = 0; i < l.length; i++) {
      const c = l[i];
      if (c === '"') { if (inQ && l[i+1] === '"') { cur += '"'; i++; } else inQ = !inQ; }
      else if (c === ";" && !inQ) { cols.push(cur); cur = ""; }
      else cur += c;
    }
    cols.push(cur);
    return cols;
  }
  const headers = parseRow(lines[0]);
  const labelToKey = {};
  db.fields.forEach(f => { labelToKey[f.label] = f.key; });
  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseRow(lines[i]);
    const rec = {};
    headers.forEach((h, idx) => {
      const k = labelToKey[h];
      if (!k) return;
      const v = (cols[idx] || "").trim();
      if (!v) return;
      const field = db.fields.find(f => f.key === k);
      if (field && field.type === "multi") rec[k] = v.split("/").map(s => s.trim());
      else if (field && field.type === "num") rec[k] = parseFloat(v) || v;
      else rec[k] = v;
    });
    if (Object.keys(rec).length > 0) records.push(rec);
  }
  return records;
}

async function clearAllData() {
  if (!confirm("APAGAR TUDO?")) return;
  if (!confirm("Tem certeza?")) return;
  state = {shoppings:{}, activeShoppingId:null, history:[], drafts:{}, dbs:{}, globalDbs:{}};
  await saveState();
  await loadState();
  renderShoppingSwitcher(); renderHome(); renderDbsNav();
  navigate("home");
  toast("Limpo");
}

// =================== DRAFTS ===================
function loadDraft(sectionId) {
  const s = state.shoppings[state.activeShoppingId];
  if (!s) return;
  const draft = state.drafts[s.id+"::"+sectionId];
  if (!draft) return;
  Object.keys(draft).forEach(k => { const el = document.getElementById(k); if (el) el.value = draft[k]; });
}
function clearForm(sectionId) {
  if (!confirm("Limpar campos?")) return;
  document.querySelectorAll("#"+sectionId+" input, #"+sectionId+" textarea, #"+sectionId+" select").forEach(inp => {
    if (inp.type === "checkbox") { inp.checked = false; inp.parentNode.classList.remove("checked"); }
    else if (inp.tagName === "SELECT") inp.selectedIndex = 0;
    else inp.value = "";
  });
}

// =================== EVENTS / INIT ===================
document.addEventListener("click", e => {
  const pill = e.target.closest(".pill-check");
  if (pill && pill.querySelector("input")) {
    const cb = pill.querySelector("input");
    setTimeout(() => pill.classList.toggle("checked", cb.checked), 0);
  }
});
document.addEventListener("keydown", e => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
    const active = document.querySelector(".section.active");
    if (active && (active.id.startsWith("wf") || active.id.startsWith("agent-"))) executeBriefing(active.id);
  }
});

(async () => {
  await loadState();
  buildAllSections();
  renderDbsNav();
  renderAgentsNav();
  renderShoppingSwitcher();
  renderHome();
  loadShoppingProfile();
  updateApiStatus(!!apiConfig.key);
})();
