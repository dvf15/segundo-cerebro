/* IAgencia — motor de layout. Recompõe o KV em qualquer formato usando a
   linha criativa do cluster. Desenha em milímetros: (0,0) é o canto superior
   esquerdo do corte; a arte se estende `sangria` mm para fora. */
(function () {
  const IAG = (window.IAG = window.IAG || {});

  /* ---------- imagens e fontes ---------- */
  const cache = new Map();
  IAG.carregarImagem = (src) => {
    if (!src) return Promise.resolve(null);
    if (!cache.has(src)) {
      cache.set(src, new Promise((res) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = () => res(null);
        i.src = src;
      }));
    }
    return cache.get(src);
  };

  IAG.FONTES = ['Montserrat', 'Poppins', 'Inter', 'Nunito', 'Oswald', 'Bebas Neue', 'Playfair Display', 'DM Serif Display'];
  async function garantirFontes(cluster) {
    const faltou = [];
    for (const [f, peso] of [[cluster.fontes.titulo, 800], [cluster.fontes.titulo, 700], [cluster.fontes.texto, 400], [cluster.fontes.texto, 600]]) {
      try { await document.fonts.load(peso + ' 20px "' + f + '"'); } catch (e) { /* segue */ }
      if (!document.fonts.check(peso + ' 20px "' + f + '"') && !faltou.includes(f)) faltou.push(f);
    }
    return faltou;
  }

  /* ---------- cor ---------- */
  const rgb = (hex) => {
    const h = String(hex || '#000').replace('#', '');
    const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.padEnd(6, '0');
    return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) || 0);
  };
  const lum = (hex) => {
    const [r, g, b] = rgb(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contraste = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const sobre = (fundo) => (contraste(fundo, '#111111') >= contraste(fundo, '#ffffff') ? '#111111' : '#ffffff');
  const legivel = (cor, fundo, min) => (contraste(cor, fundo) >= (min || 3) ? cor : sobre(fundo));
  const alfa = (hex, a) => { const [r, g, b] = rgb(hex); return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; };
  IAG.cor = { contraste, sobre, legivel };

  /* ---------- formato ---------- */
  IAG.orientacao = (w, h) => {
    const r = w / h;
    return r < 0.45 ? 'tall' : r < 0.85 ? 'portrait' : r <= 1.2 ? 'square' : r <= 2.6 ? 'landscape' : 'wide';
  };
  IAG.NOME_FORMATO = { tall: 'vertical estreito', portrait: 'vertical', square: 'quadrado', landscape: 'horizontal', wide: 'faixa horizontal' };

  /* ---------- primitivas ---------- */
  function caixaArredondada(ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function quebrar(ctx, texto, largura) {
    const linhas = [];
    let estourou = false;
    for (const par of String(texto).split('\n')) {
      let atual = '';
      for (const p of par.split(/\s+/).filter(Boolean)) {
        if (ctx.measureText(p).width > largura) estourou = true;
        const t = atual ? atual + ' ' + p : p;
        if (atual && ctx.measureText(t).width > largura) { linhas.push(atual); atual = p; } else atual = t;
      }
      linhas.push(atual);
    }
    return { linhas, estourou };
  }

  /* Ajusta o corpo do texto à caixa (busca binária) e desenha. Devolve o corpo em mm. */
  function texto(ctx, str, cx, o) {
    if (!str || cx.w <= 0 || cx.h <= 0) return 0;
    const s = o.caixaAlta ? String(str).toUpperCase() : String(str);
    const lh = o.lh || 1.15;
    const fonte = (t) => (o.peso || 400) + ' ' + t + 'px "' + o.familia + '", "Helvetica Neue", Arial, sans-serif';
    let lo = 0.05, hi = Math.min(cx.h / lh, o.max || Infinity), melhor = null;
    for (let i = 0; i < 22; i++) {
      const t = (lo + hi) / 2;
      ctx.font = fonte(t);
      const q = quebrar(ctx, s, cx.w);
      const ok = !q.estourou && q.linhas.length <= (o.linhas || 3) && q.linhas.length * t * lh <= cx.h;
      if (ok) { melhor = { t, linhas: q.linhas }; lo = t; } else hi = t;
    }
    if (!melhor) return 0;
    ctx.font = fonte(melhor.t);
    ctx.fillStyle = o.cor;
    ctx.textBaseline = 'middle';
    ctx.textAlign = o.alinhar || 'left';
    const altura = melhor.linhas.length * melhor.t * lh;
    const y0 = o.vertical === 'topo' ? cx.y : o.vertical === 'base' ? cx.y + cx.h - altura : cx.y + (cx.h - altura) / 2;
    const x = o.alinhar === 'center' ? cx.x + cx.w / 2 : o.alinhar === 'right' ? cx.x + cx.w : cx.x;
    melhor.linhas.forEach((l, i) => ctx.fillText(l, x, y0 + (i + 0.5) * melhor.t * lh));
    return melhor.t;
  }

  function conter(ctx, img, cx) {
    if (!img) return 0;
    const e = Math.min(cx.w / img.naturalWidth, cx.h / img.naturalHeight);
    const w = img.naturalWidth * e, h = img.naturalHeight * e;
    ctx.drawImage(img, cx.x + (cx.w - w) / 2, cx.y + (cx.h - h) / 2, w, h);
    return img.naturalWidth / (w / 25.4); // ppi no tamanho final
  }

  function grade(n, cx, vao, proporcao) {
    let melhor = null;
    for (let c = 1; c <= n; c++) {
      const l = Math.ceil(n / c);
      const cw = (cx.w - vao * (c - 1)) / c, ch = (cx.h - vao * (l - 1)) / l;
      const nota = Math.min(cw, ch * proporcao);
      if (cw > 0 && ch > 0 && (!melhor || nota > melhor.nota)) melhor = { c, l, cw, ch, nota };
    }
    if (!melhor) return [];
    const cw = Math.min(melhor.cw, melhor.ch * proporcao * 1.25);
    const celulas = [];
    for (let i = 0; i < n; i++) {
      const lin = Math.floor(i / melhor.c), col = i % melhor.c;
      const naLinha = lin === melhor.l - 1 ? n - lin * melhor.c : melhor.c;
      const larg = naLinha * cw + (naLinha - 1) * vao;
      celulas.push({ x: cx.x + (cx.w - larg) / 2 + col * (cw + vao), y: cx.y + lin * (melhor.ch + vao), w: cw, h: melhor.ch });
    }
    return celulas;
  }

  /* ---------- composição ---------- */
  function compor(ctx, peca, st, at) {
    const cl = at.cluster, camp = st.campanha;
    const w = peca.w, h = peca.h, b = peca.sangria, m = peca.seguranca;
    const S = Math.min(w, h), o = IAG.orientacao(w, h);
    const empilha = o === 'tall' || o === 'portrait' || o === 'square';
    const C = cl.cores, raio = (cl.raio == null ? 0.3 : cl.raio);
    const rel = { formato: o, avisos: [], kvPpi: null, legalPt: null, tituloPt: null, logoPpi: null };
    const pt = (mm) => (mm * 72) / 25.4;

    // fundo até a sangria
    ctx.fillStyle = C.fundo;
    ctx.fillRect(-b, -b, w + 2 * b, h + 2 * b);

    // divisão KV / painel
    const fracao = { tall: 0.4, portrait: 0.48, square: 0.46, landscape: 0.5, wide: 0.3 }[o];
    const corte = empilha ? h * fracao : w * fracao;
    const amp = cl.forma === 'reta' ? 0 : empilha ? Math.min(h * 0.035, w * 0.09) : Math.min(w * 0.03, h * 0.09);

    // KV (cobre a área, respeitando o ponto focal)
    const hero = empilha ? { x: -b, y: -b, w: w + 2 * b, h: corte + amp + b } : { x: -b, y: -b, w: corte + amp + b, h: h + 2 * b };
    ctx.save();
    ctx.beginPath(); ctx.rect(hero.x, hero.y, hero.w, hero.h); ctx.clip();
    if (at.kv) {
      const iw = at.kv.naturalWidth, ih = at.kv.naturalHeight;
      const e = Math.max(hero.w / iw, hero.h / ih);
      const dw = iw * e, dh = ih * e;
      const f = camp.foco || { x: 0.5, y: 0.5 };
      ctx.drawImage(at.kv, hero.x + (hero.w - dw) * f.x, hero.y + (hero.h - dh) * f.y, dw, dh);
      rel.kvPpi = iw / (dw / 25.4);
    } else {
      const g = ctx.createLinearGradient(hero.x, hero.y, hero.x + hero.w, hero.y + hero.h);
      g.addColorStop(0, C.primaria); g.addColorStop(1, C.secundaria);
      ctx.fillStyle = g; ctx.fillRect(hero.x, hero.y, hero.w, hero.h);
      texto(ctx, 'Insira o KV', { x: hero.x + hero.w * 0.15, y: hero.y + hero.h * 0.4, w: hero.w * 0.7, h: hero.h * 0.2 },
        { familia: cl.fontes.titulo, peso: 700, cor: alfa(sobre(C.primaria), 0.7), alinhar: 'center', linhas: 1 });
      rel.avisos.push('KV não inserido.');
    }
    ctx.restore();

    // painel com a forma do cluster (reta, curva ou diagonal)
    const borda = new Path2D(), painel = new Path2D();
    if (empilha) {
      const y0 = cl.forma === 'diagonal' ? corte + amp : corte + amp, y1 = cl.forma === 'diagonal' ? corte - amp : corte + amp;
      borda.moveTo(-b, y0);
      if (cl.forma === 'curva') borda.quadraticCurveTo(w / 2, corte - amp, w + b, y1); else borda.lineTo(w + b, y1);
      painel.addPath(borda); painel.lineTo(w + b, h + b); painel.lineTo(-b, h + b); painel.closePath();
    } else {
      const x0 = corte + amp, x1 = cl.forma === 'diagonal' ? corte - amp : corte + amp;
      borda.moveTo(x0, -b);
      if (cl.forma === 'curva') borda.quadraticCurveTo(corte - amp, h / 2, x1, h + b); else borda.lineTo(x1, h + b);
      painel.addPath(borda); painel.lineTo(w + b, h + b); painel.lineTo(w + b, -b); painel.closePath();
    }
    ctx.fillStyle = C.fundo; ctx.fill(painel);
    ctx.strokeStyle = C.secundaria; ctx.lineWidth = S * 0.012; ctx.stroke(borda);

    // logo do shopping sobre o KV
    const chipH = S * (o === 'wide' ? 0.16 : 0.085);
    if (at.logoShopping || st.shopping.nome) {
      const pad = chipH * 0.18;
      let cw = chipH * 2.4;
      if (at.logoShopping) cw = Math.min(chipH * 3, Math.max(chipH, (chipH - 2 * pad) * (at.logoShopping.naturalWidth / at.logoShopping.naturalHeight) + 2 * pad));
      const maxW = (empilha ? w : corte) - 2 * m;
      cw = Math.min(cw, maxW);
      ctx.fillStyle = 'rgba(255,255,255,0.94)';
      caixaArredondada(ctx, m, m, cw, chipH, chipH * raio * 0.5); ctx.fill();
      const dentro = { x: m + pad, y: m + pad, w: cw - 2 * pad, h: chipH - 2 * pad };
      if (at.logoShopping) rel.logoPpi = conter(ctx, at.logoShopping, dentro);
      else texto(ctx, st.shopping.nome, dentro, { familia: cl.fontes.titulo, peso: 700, cor: '#111111', alinhar: 'center', linhas: 2 });
    }

    // área útil do painel (dentro da margem de segurança)
    const pad = S * 0.035;
    const A = empilha
      ? { x: m, y: corte + amp + pad, w: w - 2 * m, h: h - m - (corte + amp + pad) }
      : { x: corte + amp + pad, y: m, w: w - m - (corte + amp + pad), h: h - 2 * m };
    if (A.w <= 0 || A.h <= 0) { rel.avisos.push('Margem de segurança grande demais para este formato.'); return rel; }
    const vao = Math.min(A.w, A.h) * 0.045;
    const alinhar = cl.alinhamento === 'center' ? 'center' : 'left';

    // faixas: legal embaixo, depois marcas, prêmios e texto
    let base = A.y + A.h;
    if (camp.legal) {
      const lh = Math.max(A.h * (o === 'wide' ? 0.12 : 0.075), Math.min(A.h * 0.12, 6));
      const cx = { x: A.x, y: base - lh, w: A.w, h: lh };
      const t = texto(ctx, camp.legal, cx, { familia: cl.fontes.texto, peso: 400, cor: alfa(legivel(C.texto, C.fundo, 4.5), 0.9), linhas: 5, lh: 1.2, alinhar, vertical: 'base' });
      rel.legalPt = pt(t);
      base -= lh + vao * 0.6;
    }
    let txt, premiosCx, marcasCx;
    const temPremios = at.premios.length > 0, temMarcas = at.marcas.length > 0;
    if (o === 'wide') {
      const colTxt = temPremios || temMarcas ? A.w * 0.52 : A.w;
      txt = { x: A.x, y: A.y, w: colTxt - vao, h: base - A.y };
      const dir = { x: A.x + colTxt, y: A.y, w: A.w - colTxt, h: base - A.y };
      const hm = temMarcas ? (temPremios ? dir.h * 0.34 : dir.h * 0.6) : 0;
      if (temMarcas) marcasCx = { x: dir.x, y: dir.y + dir.h - hm, w: dir.w, h: hm };
      if (temPremios) premiosCx = { x: dir.x, y: dir.y, w: dir.w, h: dir.h - hm - (temMarcas ? vao : 0) };
    } else {
      const util = base - A.y;
      if (temMarcas) { const hm = util * 0.15; marcasCx = { x: A.x, y: base - hm, w: A.w, h: hm }; base -= hm + vao; }
      if (temPremios) { const hp = util * (o === 'tall' ? 0.3 : 0.33); premiosCx = { x: A.x, y: base - hp, w: A.w, h: hp }; base -= hp + vao; }
      txt = { x: A.x, y: A.y, w: A.w, h: base - A.y };
    }

    // bloco de texto: título, chamada, período (pílula) e CTA
    const partes = [];
    if (camp.titulo) partes.push(['titulo', 0.5]);
    if (camp.chamada) partes.push(['chamada', 0.27]);
    if (camp.periodo || camp.cta) partes.push(['rodape', 0.2]);
    const soma = partes.reduce((a, p) => a + p[1], 0) || 1;
    const vt = txt.h * 0.04;
    let y = txt.y;
    const utilTxt = txt.h - vt * Math.max(0, partes.length - 1);
    for (const [tipo, peso] of partes) {
      const cx = { x: txt.x, y, w: txt.w, h: (utilTxt * peso) / soma };
      if (tipo === 'titulo') {
        const t = texto(ctx, camp.titulo, cx, { familia: cl.fontes.titulo, peso: 800, cor: legivel(C.primaria, C.fundo, 3), linhas: o === 'tall' ? 4 : 3, lh: 1.02, alinhar, caixaAlta: cl.caixaAlta, vertical: 'base' });
        rel.tituloPt = pt(t);
      } else if (tipo === 'chamada') {
        texto(ctx, camp.chamada, cx, { familia: cl.fontes.texto, peso: 400, cor: legivel(C.texto, C.fundo, 4.5), linhas: 4, lh: 1.22, alinhar, vertical: 'topo', max: (rel.tituloPt ? (rel.tituloPt * 25.4) / 72 : cx.h) * 0.62 });
      } else {
        const emLinha = camp.periodo && camp.cta && cx.w / cx.h > 9;
        const ph = emLinha || !(camp.periodo && camp.cta) ? cx.h : cx.h * 0.52;
        if (camp.periodo) {
          const corpo = ph * 0.48;
          ctx.font = '700 ' + corpo + 'px "' + cl.fontes.texto + '", Arial, sans-serif';
          const pw = Math.min(emLinha ? cx.w * 0.55 : cx.w, ctx.measureText(camp.periodo).width + ph * 0.9);
          const px = alinhar === 'center' && !emLinha ? cx.x + (cx.w - pw) / 2 : cx.x;
          ctx.fillStyle = C.acento;
          caixaArredondada(ctx, px, cx.y, pw, ph, ph * raio); ctx.fill();
          texto(ctx, camp.periodo, { x: px + ph * 0.3, y: cx.y + ph * 0.18, w: pw - ph * 0.6, h: ph * 0.64 }, { familia: cl.fontes.texto, peso: 700, cor: sobre(C.acento), alinhar: 'center', linhas: 1 });
          if (camp.cta && emLinha) texto(ctx, camp.cta, { x: px + pw + vao, y: cx.y, w: cx.w - pw - vao, h: ph }, { familia: cl.fontes.texto, peso: 600, cor: legivel(C.secundaria, C.fundo, 3), linhas: 2, max: corpo });
        }
        if (camp.cta && !(camp.periodo && emLinha)) {
          const cy = camp.periodo ? cx.y + ph + cx.h * 0.08 : cx.y;
          texto(ctx, camp.cta, { x: cx.x, y: cy, w: cx.w, h: cx.y + cx.h - cy }, { familia: cl.fontes.texto, peso: 600, cor: legivel(C.secundaria, C.fundo, 3), linhas: 2, alinhar, vertical: 'topo' });
        }
      }
      y += cx.h + vt;
    }
    if (!camp.titulo) rel.avisos.push('Título da campanha vazio.');

    // prêmios
    if (premiosCx) {
      let menor = Infinity;
      grade(at.premios.length, premiosCx, vao * 0.7, 1).forEach((c, i) => {
        const p = at.premios[i];
        ctx.fillStyle = 'rgba(255,255,255,0.96)';
        caixaArredondada(ctx, c.x, c.y, c.w, c.h, Math.min(c.w, c.h) * raio * 0.35); ctx.fill();
        ctx.strokeStyle = alfa(C.secundaria, 0.55); ctx.lineWidth = S * 0.003; ctx.stroke();
        const pi = Math.min(c.w, c.h) * 0.08;
        const hl = p.legenda ? c.h * 0.22 : 0;
        if (p.img) menor = Math.min(menor, conter(ctx, p.img, { x: c.x + pi, y: c.y + pi, w: c.w - 2 * pi, h: c.h - 2 * pi - hl }));
        if (p.legenda) texto(ctx, p.legenda, { x: c.x + pi, y: c.y + c.h - hl - pi * 0.5, w: c.w - 2 * pi, h: hl }, { familia: cl.fontes.texto, peso: 600, cor: '#1a1a1a', alinhar: 'center', linhas: 2 });
      });
      if (menor !== Infinity) rel.premioPpi = menor;
    }

    // régua de marcas (fundo branco: logos costumam ser desenhadas para ele)
    if (marcasCx) {
      ctx.fillStyle = '#ffffff';
      caixaArredondada(ctx, marcasCx.x, marcasCx.y, marcasCx.w, marcasCx.h, marcasCx.h * raio * 0.4); ctx.fill();
      const n = at.marcas.length, pi = marcasCx.h * 0.16;
      const cw = Math.min((marcasCx.w - 2 * pi) / n, marcasCx.h * 2.6);
      const x0 = marcasCx.x + (marcasCx.w - cw * n) / 2;
      let menor = Infinity;
      at.marcas.forEach((mk, i) => {
        const cx = { x: x0 + i * cw + pi * 0.6, y: marcasCx.y + pi, w: cw - pi * 1.2, h: marcasCx.h - 2 * pi };
        if (mk.img) menor = Math.min(menor, conter(ctx, mk.img, cx));
        else if (mk.nome) texto(ctx, mk.nome, cx, { familia: cl.fontes.texto, peso: 700, cor: '#1a1a1a', alinhar: 'center', linhas: 2 });
      });
      if (menor !== Infinity) rel.marcaPpi = menor;
    }
    return rel;
  }

  /* ---------- API ---------- */
  IAG.ativos = async (st) => {
    const cluster = st.clusters.find((c) => c.id === st.clusterId) || st.clusters[0];
    const c = st.campanha;
    const [kv, logoShopping] = await Promise.all([IAG.carregarImagem(c.kv), IAG.carregarImagem(st.shopping.logo)]);
    const premios = await Promise.all(c.premios.map(async (p) => ({ ...p, img: await IAG.carregarImagem(p.img) })));
    const marcas = await Promise.all(c.marcas.map(async (p) => ({ ...p, img: await IAG.carregarImagem(p.img) })));
    const fontesFaltando = await garantirFontes(cluster);
    return { cluster, kv, logoShopping, premios, marcas, fontesFaltando };
  };

  /* Renderiza a arte (corte + sangria) num canvas. pxPorMm define a resolução. */
  IAG.renderizarArte = (peca, st, at, pxPorMm) => {
    const cv = document.createElement('canvas');
    cv.width = Math.max(1, Math.round((peca.w + 2 * peca.sangria) * pxPorMm));
    cv.height = Math.max(1, Math.round((peca.h + 2 * peca.sangria) * pxPorMm));
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.scale(cv.width / (peca.w + 2 * peca.sangria), cv.height / (peca.h + 2 * peca.sangria));
    ctx.translate(peca.sangria, peca.sangria);
    const relatorio = compor(ctx, peca, st, at);
    if (at.fontesFaltando.length) relatorio.avisos.push('Fonte não carregada (usando substituta): ' + at.fontesFaltando.join(', ') + '.');
    return { canvas: cv, relatorio };
  };

  /* Resolução efetiva de exportação, respeitando limites do navegador. */
  IAG.LIMITE_LADO = 12000;
  IAG.LIMITE_AREA = 60e6;
  IAG.dpiEfetivo = (peca, alvo) => {
    const wp = (peca.w + 2 * peca.sangria) / 25.4, hp = (peca.h + 2 * peca.sangria) / 25.4;
    return Math.min(alvo, IAG.LIMITE_LADO / Math.max(wp, hp), Math.sqrt(IAG.LIMITE_AREA / (wp * hp)));
  };
})();
