/* IAgencia — interface, estado e exportação. */
(function () {
  const IAG = window.IAG;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const num = (v) => { const x = parseFloat(String(v).replace(',', '.')); return isFinite(x) ? x : 0; };
  const fmt = (v, d) => v.toLocaleString('pt-BR', { maximumFractionDigits: d == null ? 1 : d });

  /* ---------- dados iniciais ---------- */
  // Cores, fontes e formas abaixo são PROPOSTAS de partida (status "rascunho").
  // Personas e conceito ficam como [FALTA] até o marketing preencher.
  const novoCluster = (nome, cores, fontes, extra) => Object.assign({
    id: uid(), nome, status: 'rascunho',
    conceito: '[FALTA: conceito da linha criativa do cluster]',
    tom: '[FALTA: tom de voz]',
    palavras: '',
    personas: [{ id: uid(), nome: '[FALTA: persona]', descricao: '[FALTA: descrição validada pelo marketing]' }],
    cores, fontes, forma: 'reta', raio: 0.3, caixaAlta: false, alinhamento: 'left',
  }, extra || {});

  const estadoInicial = () => {
    const clusters = [
      novoCluster('Sofisticados', { fundo: '#F6F1E7', primaria: '#1F2A2E', secundaria: '#B08D57', acento: '#7A1F2B', texto: '#2A2A2A' }, { titulo: 'Playfair Display', texto: 'Inter' }, { forma: 'reta', raio: 0.08 }),
      novoCluster('Compactos de Alto Padrão', { fundo: '#FFFFFF', primaria: '#14342B', secundaria: '#C9A66B', acento: '#E4572E', texto: '#22302B' }, { titulo: 'DM Serif Display', texto: 'Poppins' }, { forma: 'curva', raio: 0.5 }),
      novoCluster('Modelo (renomeie)', { fundo: '#FFF7EC', primaria: '#5B2A86', secundaria: '#FF8A00', acento: '#E6007E', texto: '#2B1B3D' }, { titulo: 'Montserrat', texto: 'Nunito' }, { forma: 'diagonal', raio: 1, caixaAlta: true }),
    ];
    return {
      versao: 1, clusters, clusterId: clusters[0].id,
      shopping: { nome: '', logo: '' },
      campanha: { titulo: '', chamada: '', periodo: '', cta: '', legal: '', kv: '', foco: { x: 0.5, y: 0.5 }, premios: [], marcas: [] },
      pecas: [peca('Cartaz A3', 297, 420, 3)],
      opcoes: { dpi: 150, guias: true },
    };
  };

  function peca(nome, w, h, sangria, extra) {
    return Object.assign({ id: uid(), nome, w, h, sangria, seguranca: Math.max(5, Math.round(Math.min(w, h) * 0.04)), qtd: 1, material: '', obs: '', escala: 0 }, extra || {});
  }

  // A3/A4 seguem a ISO 216. Os demais são exemplos editáveis, não padrões:
  // medida e sangria finais são sempre as que a gráfica pedir.
  const PREDEFINIDOS = [
    ['Cartaz A4 (ISO 216)', 210, 297, 3], ['Cartaz A3 (ISO 216)', 297, 420, 3],
    ['Banner vertical 80 × 120 cm (exemplo)', 800, 1200, 20], ['Totem 60 × 180 cm (exemplo)', 600, 1800, 20],
    ['Adesivo de piso 100 × 100 cm (exemplo)', 1000, 1000, 10], ['Faixa 300 × 80 cm (exemplo)', 3000, 800, 30],
    ['Painel 200 × 100 cm (exemplo)', 2000, 1000, 20], ['Display de mesa 10 × 15 cm (exemplo)', 100, 150, 3],
  ];

  let st = estadoInicial();
  let aba = 'cluster';
  let pecaId = null;
  const cluster = () => st.clusters.find((c) => c.id === st.clusterId) || st.clusters[0];

  /* ---------- persistência (IndexedDB: guarda as imagens em alta) ---------- */
  const banco = () => new Promise((res, rej) => {
    const r = indexedDB.open('iagencia', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
  async function ler() {
    try {
      const db = await banco();
      return await new Promise((res) => { const q = db.transaction('kv').objectStore('kv').get('estado'); q.onsuccess = () => res(q.result); q.onerror = () => res(null); });
    } catch (e) { return null; }
  }
  let tSalvar;
  function salvar() {
    clearTimeout(tSalvar);
    tSalvar = setTimeout(async () => {
      try { const db = await banco(); db.transaction('kv', 'readwrite').objectStore('kv').put(st, 'estado'); } catch (e) { aviso('Não consegui salvar neste navegador: ' + e.message); }
    }, 400);
  }

  /* ---------- utilidades de UI ---------- */
  function aviso(msg) { const el = $('#status'); el.textContent = msg; clearTimeout(aviso.t); aviso.t = setTimeout(() => (el.textContent = ''), 6000); }
  const medida = (p) => {
    const g = Math.max(p.w, p.h) >= 1000;
    return g ? fmt(p.w / 1000, 2) + ' × ' + fmt(p.h / 1000, 2) + ' m' : fmt(p.w / 10) + ' × ' + fmt(p.h / 10) + ' cm';
  };
  const baixar = (dados, nome, tipo) => {
    const url = URL.createObjectURL(dados instanceof Blob ? dados : new Blob([dados], { type: tipo }));
    const a = document.createElement('a'); a.href = url; a.download = nome; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };
  const slug = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'peca';
  const lerArquivo = (f) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); });
  const campo = (rot, html, cls) => '<label class="campo ' + (cls || '') + '"><span>' + rot + '</span>' + html + '</label>';
  const entrada = (caminho, valor, extra) => '<input data-bind="' + caminho + '" value="' + esc(valor) + '" ' + (extra || '') + '>';
  const area = (caminho, valor, linhas) => '<textarea data-bind="' + caminho + '" rows="' + (linhas || 2) + '">' + esc(valor) + '</textarea>';

  /* ---------- abas ---------- */
  const ABAS = [['cluster', '1 · Cluster'], ['campanha', '2 · KV'], ['pecas', '3 · Peças'], ['entrega', '4 · Entrega']];

  function telaCluster() {
    const c = cluster(), C = c.cores;
    const ct = (a, b) => IAG.cor.contraste(a, b);
    const selo = (v, min) => '<b class="' + (v >= min ? 'ok' : 'ruim') + '">' + fmt(v, 1) + ':1</b>';
    return `
    <div class="linha">
      ${campo('Cluster do shopping', '<select data-acao="trocar-cluster">' + st.clusters.map((x) => '<option value="' + x.id + '"' + (x.id === c.id ? ' selected' : '') + '>' + esc(x.nome) + (x.status === 'rascunho' ? ' (rascunho)' : '') + '</option>').join('') + '</select>', 'cresce')}
      <button data-acao="novo-cluster">+ Novo</button>
      <button data-acao="excluir-cluster" class="sutil">Excluir</button>
    </div>
    ${c.status === 'rascunho' ? '<p class="alerta">Guia em <b>rascunho</b>: cores, fontes e forma são propostas de partida. Personas e conceito precisam vir do marketing. Marque como aprovado quando validar.</p>' : ''}
    <div class="linha">
      ${campo('Nome', entrada('cluster.nome', c.nome), 'cresce')}
      ${campo('Status', '<select data-bind="cluster.status" data-redesenha><option value="rascunho"' + (c.status === 'rascunho' ? ' selected' : '') + '>Rascunho</option><option value="aprovado"' + (c.status === 'aprovado' ? ' selected' : '') + '>Aprovado</option></select>')}
    </div>
    <h3>Linha criativa</h3>
    ${campo('Conceito', area('cluster.conceito', c.conceito, 2))}
    ${campo('Tom de voz', area('cluster.tom', c.tom, 2))}
    ${campo('Palavras-chave', entrada('cluster.palavras', c.palavras, 'placeholder="separe por vírgula"'))}
    <h3>Personas</h3>
    ${c.personas.map((p, i) => `<div class="item">
      ${campo('Persona', entrada('cluster.personas.' + i + '.nome', p.nome))}
      ${campo('Quem é / o que busca', area('cluster.personas.' + i + '.descricao', p.descricao, 2))}
      <button class="sutil" data-acao="remover" data-lista="cluster.personas" data-i="${i}">Remover</button></div>`).join('')}
    <button data-acao="nova-persona">+ Persona</button>
    <h3>Cores</h3>
    <div class="cores">
      ${[['fundo', 'Fundo'], ['primaria', 'Primária (título)'], ['secundaria', 'Secundária'], ['acento', 'Acento'], ['texto', 'Texto']].map(([k, r]) =>
        '<label class="cor"><input type="color" data-bind="cluster.cores.' + k + '" value="' + esc(C[k]) + '"><span>' + r + '<br><code data-hex="' + k + '">' + esc(C[k]) + '</code></span></label>').join('')}
    </div>
    <p class="nota" id="contrastes">Contraste (WCAG): título × fundo ${selo(ct(C.primaria, C.fundo), 3)} · texto × fundo ${selo(ct(C.texto, C.fundo), 4.5)}. Quando não atinge o mínimo, a peça troca a cor por preto ou branco automaticamente.</p>
    <h3>Tipografia e forma</h3>
    <div class="linha">
      ${campo('Fonte de título', '<select data-bind="cluster.fontes.titulo">' + IAG.FONTES.map((f) => '<option' + (f === c.fontes.titulo ? ' selected' : '') + '>' + f + '</option>').join('') + '</select>', 'cresce')}
      ${campo('Fonte de texto', '<select data-bind="cluster.fontes.texto">' + IAG.FONTES.map((f) => '<option' + (f === c.fontes.texto ? ' selected' : '') + '>' + f + '</option>').join('') + '</select>', 'cresce')}
    </div>
    <div class="linha">
      ${campo('Recorte do KV', '<select data-bind="cluster.forma">' + [['reta', 'Reto'], ['curva', 'Curvo'], ['diagonal', 'Diagonal']].map(([v, r]) => '<option value="' + v + '"' + (v === c.forma ? ' selected' : '') + '>' + r + '</option>').join('') + '</select>', 'cresce')}
      ${campo('Alinhamento', '<select data-bind="cluster.alinhamento"><option value="left"' + (c.alinhamento !== 'center' ? ' selected' : '') + '>À esquerda</option><option value="center"' + (c.alinhamento === 'center' ? ' selected' : '') + '>Centralizado</option></select>', 'cresce')}
    </div>
    <div class="linha">
      ${campo('Cantos (reto → redondo)', '<input type="range" min="0" max="1" step="0.05" data-bind="cluster.raio" data-num value="' + c.raio + '">', 'cresce')}
      <label class="check"><input type="checkbox" data-bind="cluster.caixaAlta"${c.caixaAlta ? ' checked' : ''}> Título em caixa alta</label>
    </div>
    <h3>Compartilhar o guia</h3>
    <div class="linha">
      <button data-acao="exportar-cluster">Exportar guia (.json)</button>
      <label class="botao">Importar guia<input type="file" accept=".json,application/json" data-acao="importar-cluster" hidden></label>
    </div>
    <p class="nota">O guia fica salvo neste navegador. Para todos os shoppings do cluster usarem o mesmo, exporte o arquivo e distribua.</p>`;
  }

  function telaCampanha() {
    const c = st.campanha;
    const mini = (lista, rotulo, chave) => c[lista].map((p, i) => `<div class="item mini">
      <div class="thumb">${p.img ? '<img src="' + p.img + '" alt="">' : ''}</div>
      ${campo(rotulo, entrada('campanha.' + lista + '.' + i + '.' + chave, p[chave]), 'cresce')}
      <button class="sutil" data-acao="remover" data-lista="campanha.${lista}" data-i="${i}">Remover</button></div>`).join('');
    return `
    <h3>Shopping</h3>
    <div class="linha">
      ${campo('Nome do shopping', entrada('shopping.nome', st.shopping.nome), 'cresce')}
      <label class="botao">${st.shopping.logo ? 'Trocar logo' : 'Logo do shopping'}<input type="file" accept="image/*" data-arquivo="shopping.logo" hidden></label>
    </div>
    <h3>KV padrão</h3>
    <label class="botao principal">${c.kv ? 'Trocar KV' : 'Inserir KV'}<input type="file" accept="image/*" data-arquivo="campanha.kv" hidden></label>
    ${c.kv ? `<div class="foco" data-acao="foco" title="Clique no ponto que não pode ser cortado"><img src="${c.kv}" alt="KV"><i style="left:${c.foco.x * 100}%;top:${c.foco.y * 100}%"></i></div>
      <p class="nota">Clique no KV para marcar o ponto focal: é ele que fica preservado quando o formato muda. <span id="kvinfo"></span></p>` : '<p class="nota">Envie o KV em alta, de preferência sem os textos aplicados: o título e a mecânica são recompostos em cada formato.</p>'}
    <h3>Textos da campanha</h3>
    ${campo('Título', entrada('campanha.titulo', c.titulo))}
    ${campo('Chamada / mecânica', area('campanha.chamada', c.chamada, 2))}
    <div class="linha">
      ${campo('Período', entrada('campanha.periodo', c.periodo, 'placeholder="de __/__ a __/__"'), 'cresce')}
      ${campo('Como participar (CTA)', entrada('campanha.cta', c.cta), 'cresce')}
    </div>
    ${campo('Texto legal', area('campanha.legal', c.legal, 3))}
    <h3>Prêmios</h3>
    ${mini('premios', 'Legenda', 'legenda')}
    <label class="botao">+ Imagens dos prêmios<input type="file" accept="image/*" multiple data-arquivos="premios" hidden></label>
    <h3>Marcas participantes</h3>
    ${mini('marcas', 'Marca', 'nome')}
    <label class="botao">+ Logos das marcas<input type="file" accept="image/*" multiple data-arquivos="marcas" hidden></label>
    <p class="nota">Logos em PNG com fundo transparente ou SVG dão o melhor resultado. A régua de marcas sai sempre sobre branco.</p>
    <div class="linha separa"><button data-acao="exemplo" class="sutil">Preencher com exemplo fictício</button></div>`;
  }

  function telaPecas() {
    return `
    <h3>Solicitar desdobramento</h3>
    <form id="nova-peca" class="item">
      ${campo('Modelo', '<select name="modelo"><option value="">Medida livre</option>' + PREDEFINIDOS.map((p, i) => '<option value="' + i + '">' + esc(p[0]) + '</option>').join('') + '</select>')}
      ${campo('Nome da peça', '<input name="nome" required placeholder="ex.: Banner da praça de eventos">')}
      <div class="linha">
        ${campo('Largura', '<input name="w" required inputmode="decimal">', 'cresce')}
        ${campo('Altura', '<input name="h" required inputmode="decimal">', 'cresce')}
        ${campo('Unidade', '<select name="un"><option value="10">cm</option><option value="1000">m</option><option value="1">mm</option></select>')}
      </div>
      <div class="linha">
        ${campo('Sangria (mm)', '<input name="sangria" value="3" inputmode="decimal">', 'cresce')}
        ${campo('Margem de segurança (mm)', '<input name="seguranca" placeholder="automática" inputmode="decimal">', 'cresce')}
        ${campo('Qtd.', '<input name="qtd" value="1" inputmode="numeric" style="width:64px">')}
      </div>
      ${campo('Material / acabamento', '<input name="material" placeholder="ex.: lona fosca com ilhós">')}
      ${campo('Observações', '<input name="obs">')}
      <button class="principal">Adicionar peça</button>
      <p class="nota">Sangria e margem variam por material e por gráfica: confirme com o fornecedor antes de fechar o arquivo.</p>
    </form>
    <h3>Peças solicitadas (${st.pecas.length})</h3>
    ${st.pecas.length ? st.pecas.map((p, i) => `<div class="item peca ${p.id === pecaId ? 'ativa' : ''}" data-acao="selecionar" data-id="${p.id}">
      <div class="linha"><b class="cresce">${esc(p.nome)}</b><span class="tag">${medida(p)}</span></div>
      <div class="linha fino">
        ${campo('L (mm)', entrada('pecas.' + i + '.w', p.w, 'data-num inputmode="decimal"'))}
        ${campo('A (mm)', entrada('pecas.' + i + '.h', p.h, 'data-num inputmode="decimal"'))}
        ${campo('Sangria', entrada('pecas.' + i + '.sangria', p.sangria, 'data-num inputmode="decimal"'))}
        ${campo('Segurança', entrada('pecas.' + i + '.seguranca', p.seguranca, 'data-num inputmode="decimal"'))}
        ${campo('Qtd.', entrada('pecas.' + i + '.qtd', p.qtd, 'data-num inputmode="numeric"'))}
      </div>
      <div class="linha">
        ${campo('Material / acabamento', entrada('pecas.' + i + '.material', p.material), 'cresce')}
        <button class="sutil" data-acao="remover" data-lista="pecas" data-i="${i}">Remover</button>
      </div></div>`).join('') : '<p class="nota">Nenhuma peça ainda.</p>'}`;
  }

  function telaEntrega() {
    return `
    <h3>Arquivos de impressão</h3>
    <div class="linha">
      ${campo('Resolução alvo', '<select data-bind="opcoes.dpi" data-num data-redesenha>' + [72, 100, 150, 300].map((d) => '<option value="' + d + '"' + (d === st.opcoes.dpi ? ' selected' : '') + '>' + d + ' dpi</option>').join('') + '</select>')}
      <button class="principal" data-acao="pdf-todas"${st.pecas.length ? '' : ' disabled'}>PDF único com todas</button>
      <button data-acao="csv"${st.pecas.length ? '' : ' disabled'}>Ficha de produção (.csv)</button>
    </div>
    ${st.pecas.map((p) => {
      const d = IAG.dpiEfetivo(p, st.opcoes.dpi), e = p.escala || IAG.pdf.escalaMinima(p);
      return `<div class="item peca ${p.id === pecaId ? 'ativa' : ''}" data-acao="selecionar" data-id="${p.id}">
        <div class="linha"><b class="cresce">${esc(p.nome)}</b><span class="tag">${medida(p)}</span></div>
        <p class="nota">Sangria ${fmt(p.sangria)} mm · segurança ${fmt(p.seguranca)} mm · ${p.qtd} un. · sai a ${fmt(d, 0)} dpi${d < st.opcoes.dpi - 0.5 ? ' <b class="ruim">(reduzido pelo limite do navegador)</b>' : ''} · PDF em escala 1:${e}${e > 1 ? ' <b class="ruim">(avise a gráfica)</b>' : ''}</p>
        <div class="linha"><button data-acao="pdf" data-id="${p.id}">PDF com marcas de corte</button><button class="sutil" data-acao="png" data-id="${p.id}">PNG (sem marcas)</button></div>
      </div>`;
    }).join('')}
    <h3>Pedido</h3>
    <div class="linha">
      <button data-acao="exportar-pedido">Exportar pedido (.json)</button>
      <label class="botao">Abrir pedido<input type="file" accept=".json,application/json" data-acao="importar-pedido" hidden></label>
      <button class="sutil" data-acao="zerar">Começar do zero</button>
    </div>
    <p class="nota"><b>O que o arquivo é e não é.</b> O PDF sai no tamanho final, com TrimBox, BleedBox, marcas de corte e de centro. A arte é uma imagem RGB: a conversão para CMYK (ou o perfil que a gráfica usar) fica com o fornecedor, e cores especiais (Pantone) não são suportadas. Peça prova de cor antes de rodar tiragem.</p>`;
  }

  const TELAS = { cluster: telaCluster, campanha: telaCampanha, pecas: telaPecas, entrega: telaEntrega };

  function desenhar() {
    if (!st.pecas.some((p) => p.id === pecaId)) pecaId = st.pecas[0] ? st.pecas[0].id : null;
    $('#abas').innerHTML = ABAS.map(([k, r]) => '<button data-aba="' + k + '" class="' + (k === aba ? 'ativa' : '') + '">' + r + '</button>').join('');
    $('#painel').innerHTML = TELAS[aba]();
    $('#qual-peca').innerHTML = st.pecas.map((p) => '<option value="' + p.id + '"' + (p.id === pecaId ? ' selected' : '') + '>' + esc(p.nome) + ' — ' + medida(p) + '</option>').join('');
    $('#guias').checked = st.opcoes.guias;
    $('#cab-cluster').textContent = cluster().nome + (st.shopping.nome ? ' · ' + st.shopping.nome : '');
    previa();
  }

  /* ---------- prévia ---------- */
  let tPrevia, seq = 0;
  function previa() { clearTimeout(tPrevia); tPrevia = setTimeout(desenharPrevia, 120); }

  async function desenharPrevia() {
    const meu = ++seq;
    const cv = $('#previa'), rel = $('#relatorio');
    const p = st.pecas.find((x) => x.id === pecaId);
    if (!p || !(p.w > 0 && p.h > 0)) { cv.width = cv.height = 0; rel.innerHTML = '<li>Adicione uma peça na aba Peças.</li>'; return; }
    const at = await IAG.ativos(st);
    if (meu !== seq) return;
    const b = p.sangria, borda = Math.max(b * 1.2, Math.max(p.w, p.h) * 0.03) + b;
    const totalW = p.w + 2 * borda, totalH = p.h + 2 * borda;
    const caixa = $('#palco').getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const esc2 = Math.min((caixa.width - 24) / totalW, (Math.max(320, window.innerHeight - 250)) / totalH);
    const { canvas, relatorio } = IAG.renderizarArte(p, st, at, esc2 * dpr);
    if (meu !== seq) return;
    cv.width = Math.round(totalW * esc2 * dpr); cv.height = Math.round(totalH * esc2 * dpr);
    cv.style.width = cv.width / dpr + 'px'; cv.style.height = cv.height / dpr + 'px';
    const ctx = cv.getContext('2d');
    const k = esc2 * dpr, o = borda * k;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.drawImage(canvas, o - b * k, o - b * k, (p.w + 2 * b) * k, (p.h + 2 * b) * k);
    if (st.opcoes.guias) {
      // marcas de corte
      const r = (b + (borda - b) * 0.15) * k, m = (borda - b) * 0.7 * k;
      ctx.strokeStyle = '#000'; ctx.lineWidth = Math.max(1, dpr * 0.75);
      const L = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
      for (const x of [o, o + p.w * k]) { L(x, o - r, x, o - r - m); L(x, o + p.h * k + r, x, o + p.h * k + r + m); }
      for (const y of [o, o + p.h * k]) { L(o - r, y, o - r - m, y); L(o + p.w * k + r, y, o + p.w * k + r + m, y); }
      // corte (magenta) e segurança (ciano)
      ctx.setLineDash([6 * dpr, 4 * dpr]);
      ctx.strokeStyle = '#e6007e'; ctx.strokeRect(o, o, p.w * k, p.h * k);
      ctx.strokeStyle = '#00a0c6'; ctx.strokeRect(o + p.seguranca * k, o + p.seguranca * k, (p.w - 2 * p.seguranca) * k, (p.h - 2 * p.seguranca) * k);
      ctx.setLineDash([]);
    }
    rel.innerHTML = revisao(p, relatorio).map(([t, msg]) => '<li class="' + t + '">' + msg + '</li>').join('');
    const info = $('#kvinfo');
    if (info && at.kv) info.textContent = 'Arquivo: ' + at.kv.naturalWidth + ' × ' + at.kv.naturalHeight + ' px.';
  }

  // Limiares da revisão são regras práticas deste app, não norma: 100 ppi para
  // imagem vista de perto e 6 pt para texto legal. A gráfica dá a palavra final.
  function revisao(p, r) {
    const itens = [['info', 'Formato ' + IAG.NOME_FORMATO[r.formato] + ' · ' + medida(p) + ' · sangria ' + fmt(p.sangria) + ' mm']];
    const ppi = (rot, v) => { if (v != null) itens.push([v < 100 ? 'ruim' : 'ok', rot + ' sai a ' + fmt(v, 0) + ' ppi no tamanho final' + (v < 100 ? ' — baixa para leitura de perto; peça o arquivo em maior resolução' : '')]); };
    ppi('KV', r.kvPpi); ppi('Prêmio com menor resolução', r.premioPpi); ppi('Logo de marca com menor resolução', r.marcaPpi); ppi('Logo do shopping', r.logoPpi);
    if (r.legalPt != null) itens.push([r.legalPt < 6 ? 'ruim' : 'ok', 'Texto legal com corpo ' + fmt(r.legalPt, 1) + ' pt' + (r.legalPt < 6 ? ' — confira a legibilidade ou encurte o texto' : '')]);
    else if (!st.campanha.legal) itens.push(['ruim', 'Sem texto legal.']);
    if (p.sangria <= 0) itens.push(['ruim', 'Peça sem sangria.']);
    r.avisos.forEach((a) => itens.push(['ruim', a]));
    return itens;
  }

  /* ---------- exportação ---------- */
  const jpegDe = (canvas) => new Promise((res, rej) => canvas.toBlob(async (b) => (b ? res(new Uint8Array(await b.arrayBuffer())) : rej(new Error('o navegador não conseguiu gerar a imagem neste tamanho'))), 'image/jpeg', 0.93));

  async function pagina(p, at) {
    const dpi = IAG.dpiEfetivo(p, st.opcoes.dpi);
    const { canvas } = IAG.renderizarArte(p, st, at, dpi / 25.4);
    const escala = p.escala || IAG.pdf.escalaMinima(p);
    const jpeg = await jpegDe(canvas);
    const legenda = [st.shopping.nome, p.nome, fmt(p.w) + ' x ' + fmt(p.h) + ' mm', 'sangria ' + fmt(p.sangria) + ' mm', 'escala 1:' + escala, Math.round(dpi) + ' dpi', 'RGB', p.qtd + ' un.', p.material].filter(Boolean).join(' | ');
    const pg = { w: p.w, h: p.h, sangria: p.sangria, escala, jpeg, imgW: canvas.width, imgH: canvas.height, legenda };
    canvas.width = canvas.height = 0;
    return pg;
  }

  async function exportarPdf(pecas, nome) {
    try {
      const at = await IAG.ativos(st), paginas = [];
      for (let i = 0; i < pecas.length; i++) {
        aviso('Gerando ' + (i + 1) + ' de ' + pecas.length + ': ' + pecas[i].nome + '…');
        await new Promise((r) => setTimeout(r, 30));
        paginas.push(await pagina(pecas[i], at));
      }
      baixar(IAG.pdf.montar(paginas), nome, 'application/pdf');
      aviso('PDF gerado: ' + nome);
    } catch (e) { aviso('Falha ao gerar o PDF: ' + e.message); }
  }

  async function exportarPng(p) {
    const at = await IAG.ativos(st);
    const { canvas } = IAG.renderizarArte({ ...p, sangria: 0 }, st, at, IAG.dpiEfetivo(p, st.opcoes.dpi) / 25.4);
    canvas.toBlob((b) => (b ? baixar(b, slug(p.nome) + '.png') : aviso('Falha ao gerar o PNG.')), 'image/png');
  }

  function exportarCsv() {
    const cab = ['Peça', 'Largura (mm)', 'Altura (mm)', 'Sangria (mm)', 'Segurança (mm)', 'Qtd.', 'Material / acabamento', 'Observações', 'Escala do PDF', 'dpi de saída'];
    const linhas = st.pecas.map((p) => [p.nome, p.w, p.h, p.sangria, p.seguranca, p.qtd, p.material, p.obs, '1:' + (p.escala || IAG.pdf.escalaMinima(p)), Math.round(IAG.dpiEfetivo(p, st.opcoes.dpi))]);
    const csv = [cab].concat(linhas).map((l) => l.map((v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"').join(';')).join('\r\n');
    baixar('﻿' + csv, 'ficha-de-producao.csv', 'text/csv;charset=utf-8');
  }

  /* ---------- exemplo fictício (gera imagens no próprio navegador) ---------- */
  function exemplo() {
    const c = cluster().cores;
    const tela = (w, h, fn) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; fn(cv.getContext('2d'), w, h); return cv.toDataURL('image/png'); };
    const kv = tela(2400, 2400, (x, w, h) => {
      const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, c.primaria); g.addColorStop(1, c.acento); x.fillStyle = g; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 28; i++) { x.fillStyle = i % 2 ? c.secundaria : '#ffffff'; x.globalAlpha = 0.12 + (i % 5) * 0.05; x.beginPath(); x.arc((i * 733) % w, (i * 419) % h, 60 + ((i * 97) % 260), 0, 7); x.fill(); }
      x.globalAlpha = 1; x.fillStyle = c.secundaria; x.fillRect(w * 0.36, h * 0.44, w * 0.28, h * 0.26); x.fillStyle = '#ffffff'; x.fillRect(w * 0.485, h * 0.38, w * 0.03, h * 0.32); x.fillRect(w * 0.33, h * 0.4, w * 0.34, h * 0.06);
      x.font = '700 90px sans-serif'; x.textAlign = 'center'; x.fillText('KV DE EXEMPLO', w / 2, h * 0.85);
    });
    const item = (rot, cor) => tela(600, 600, (x, w, h) => { x.fillStyle = cor; x.beginPath(); x.arc(w / 2, h / 2, w * 0.42, 0, 7); x.fill(); x.fillStyle = '#fff'; x.font = '700 80px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(rot, w / 2, h / 2); });
    const logo = (rot) => tela(600, 240, (x, w, h) => { x.fillStyle = '#111'; x.font = '800 96px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(rot, w / 2, h / 2); });
    st.shopping.nome = st.shopping.nome || 'Shopping Exemplo';
    Object.assign(st.campanha, {
      titulo: 'Título da campanha', chamada: '[FALTA: mecânica da promoção]', periodo: '[FALTA: período]', cta: '[FALTA: como participar]',
      legal: 'Certificado de Autorização nº [FALTA: número]. Consulte o regulamento em [FALTA: endereço]. Imagens meramente ilustrativas.',
      kv, foco: { x: 0.5, y: 0.5 },
      premios: [1, 2, 3].map((i) => ({ id: uid(), img: item('P' + i, [c.primaria, c.acento, c.secundaria][i - 1]), legenda: 'Prêmio ' + i })),
      marcas: ['MARCA A', 'MARCA B', 'MARCA C', 'MARCA D'].map((n) => ({ id: uid(), img: logo(n), nome: n })),
    });
  }

  /* ---------- eventos ---------- */
  function resolver(caminho) {
    const partes = caminho.split('.');
    let alvo = partes[0] === 'cluster' ? cluster() : st[partes[0]];
    for (let i = 1; i < partes.length - 1; i++) alvo = alvo[partes[i]];
    return [alvo, partes[partes.length - 1]];
  }

  document.addEventListener('input', (e) => {
    const el = e.target, caminho = el.dataset.bind;
    if (!caminho) return;
    const [alvo, chave] = resolver(caminho);
    alvo[chave] = el.type === 'checkbox' ? el.checked : 'num' in el.dataset ? num(el.value) : el.value;
    if (caminho.startsWith('cluster.cores.')) {
      const hex = $('[data-hex="' + chave + '"]'); if (hex) hex.textContent = el.value;
    }
    salvar();
    if ('redesenha' in el.dataset) desenhar(); else previa();
  });

  document.addEventListener('change', async (e) => {
    const el = e.target;
    if (el.id === 'qual-peca') { pecaId = el.value; desenhar(); return; }
    if (el.id === 'guias') { st.opcoes.guias = el.checked; salvar(); previa(); return; }
    if (el.dataset.bind && (el.type === 'color' || /^pecas\.\d+\.(w|h)$/.test(el.dataset.bind) || el.dataset.bind === 'cluster.nome')) { desenhar(); return; }
    if (el.name === 'modelo' && el.value !== '') {
      const [nome, w, h, s] = PREDEFINIDOS[+el.value], f = el.form;
      f.nome.value = nome.replace(/ \((exemplo|ISO 216)\)/, ''); f.un.value = '10'; f.w.value = fmt(w / 10); f.h.value = fmt(h / 10); f.sangria.value = s;
      return;
    }
    if (el.dataset.acao === 'trocar-cluster') { st.clusterId = el.value; salvar(); desenhar(); return; }
    if (el.type !== 'file' || !el.files.length) return;
    try {
      if (el.dataset.arquivo) { const [alvo, chave] = resolver(el.dataset.arquivo); alvo[chave] = await lerArquivo(el.files[0]); }
      else if (el.dataset.arquivos) {
        for (const f of el.files) {
          const img = await lerArquivo(f), nome = f.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
          st.campanha[el.dataset.arquivos].push(el.dataset.arquivos === 'premios' ? { id: uid(), img, legenda: '' } : { id: uid(), img, nome });
        }
      } else if (el.dataset.acao === 'importar-cluster') {
        const c = JSON.parse(await el.files[0].text());
        if (!c.cores || !c.fontes || !c.nome) throw new Error('arquivo não é um guia de cluster');
        c.id = uid(); c.personas = c.personas || []; st.clusters.push(c); st.clusterId = c.id;
      } else if (el.dataset.acao === 'importar-pedido') {
        const p = JSON.parse(await el.files[0].text());
        if (!p.clusters || !p.campanha || !p.pecas) throw new Error('arquivo não é um pedido do IAgencia');
        if (!confirm('Abrir este pedido substitui o trabalho atual neste navegador. Continuar?')) return;
        st = Object.assign(estadoInicial(), p);
      }
      salvar(); desenhar();
    } catch (err) { aviso('Não consegui ler o arquivo: ' + err.message); }
  });

  document.addEventListener('submit', (e) => {
    if (e.target.id !== 'nova-peca') return;
    e.preventDefault();
    const f = e.target, un = num(f.un.value), w = num(f.w.value) * un, h = num(f.h.value) * un;
    if (!(w > 0 && h > 0)) { aviso('Informe largura e altura maiores que zero.'); return; }
    const p = peca(f.nome.value.trim(), w, h, Math.max(0, num(f.sangria.value)), { qtd: Math.max(1, Math.round(num(f.qtd.value)) || 1), material: f.material.value.trim(), obs: f.obs.value.trim() });
    if (f.seguranca.value.trim()) p.seguranca = Math.max(0, num(f.seguranca.value));
    st.pecas.push(p); pecaId = p.id; salvar(); desenhar();
  });

  document.addEventListener('click', (e) => {
    const abaEl = e.target.closest('[data-aba]');
    if (abaEl) { aba = abaEl.dataset.aba; desenhar(); return; }
    const el = e.target.closest('[data-acao]');
    if (!el || el.tagName === 'SELECT' || el.type === 'file') return;
    const a = el.dataset.acao;
    if (a === 'selecionar') { if (e.target.closest('input,button,select,textarea')) return; pecaId = el.dataset.id; desenhar(); return; }
    if (a === 'foco') {
      const r = el.querySelector('img').getBoundingClientRect();
      st.campanha.foco = { x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) };
    } else if (a === 'remover') {
      const [alvo, chave] = resolver(el.dataset.lista + '.x'); void chave;
      if (!confirm('Remover este item?')) return;
      alvo.splice(+el.dataset.i, 1);
    } else if (a === 'nova-persona') cluster().personas.push({ id: uid(), nome: '', descricao: '' });
    else if (a === 'novo-cluster') {
      const nome = prompt('Nome do novo cluster:'); if (!nome) return;
      const base = JSON.parse(JSON.stringify(cluster()));
      const c = novoCluster(nome.trim(), base.cores, base.fontes, { forma: base.forma, raio: base.raio, caixaAlta: base.caixaAlta, alinhamento: base.alinhamento });
      st.clusters.push(c); st.clusterId = c.id;
    } else if (a === 'excluir-cluster') {
      if (st.clusters.length < 2) { aviso('É preciso manter ao menos um cluster.'); return; }
      if (!confirm('Excluir o cluster "' + cluster().nome + '"?') || !confirm('Confirma de novo? O guia deste cluster será apagado deste navegador.')) return;
      st.clusters = st.clusters.filter((c) => c.id !== st.clusterId); st.clusterId = st.clusters[0].id;
    } else if (a === 'exportar-cluster') { baixar(JSON.stringify(cluster(), null, 2), 'guia-' + slug(cluster().nome) + '.json', 'application/json'); return; }
    else if (a === 'exportar-pedido') { baixar(JSON.stringify(st), 'pedido-' + slug(st.shopping.nome || 'shopping') + '.json', 'application/json'); return; }
    else if (a === 'exemplo') {
      const c = st.campanha;
      if ((c.kv || c.titulo || c.premios.length || c.marcas.length) && !confirm('Isso substitui KV, textos, prêmios e marcas atuais pelo exemplo. Continuar?')) return;
      exemplo();
    } else if (a === 'zerar') {
      if (!confirm('Apagar campanha, peças e guias deste navegador?') || !confirm('Confirma de novo? Não dá para desfazer.')) return;
      st = estadoInicial();
    } else if (a === 'pdf') { const p = st.pecas.find((x) => x.id === el.dataset.id); exportarPdf([p], slug(p.nome) + '.pdf'); return; }
    else if (a === 'png') { exportarPng(st.pecas.find((x) => x.id === el.dataset.id)); return; }
    else if (a === 'pdf-todas') { exportarPdf(st.pecas, 'desdobramentos-' + slug(st.shopping.nome || 'shopping') + '.pdf'); return; }
    else if (a === 'csv') { exportarCsv(); return; }
    else return;
    salvar(); desenhar();
  });

  window.addEventListener('resize', previa);

  (async function iniciar() {
    const salvo = await ler();
    if (salvo && salvo.clusters && salvo.clusters.length) st = Object.assign(estadoInicial(), salvo);
    desenhar();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(previa);
  })();

  IAG._estado = () => st; // para testes
})();
