/* IAgencia — gerador de PDF de impressão (sem dependências).
   Cada página leva: a arte em JPEG (até a sangria), marcas de corte vetoriais,
   TrimBox/BleedBox e uma legenda técnica fora da área de sangria. */
(function (root) {
  const IAG = (root.IAG = root.IAG || {});
  const MM = 72 / 25.4; // pontos por milímetro
  const LIMITE_PT = 14400; // limite de página do Acrobat (200 pol.)

  const ascii = (s) =>
    String(s)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/×/g, 'x')
      .replace(/[^\x20-\x7e]/g, '?')
      .replace(/([\\()])/g, '\\$1');

  const bytes = (s) => {
    const u = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i) & 0xff;
    return u;
  };
  const n = (v) => (Math.round(v * 1000) / 1000).toString();

  /* Geometria da página em pontos, a partir das medidas reais em mm.
     escala = 1 (1:1), 10 (1:10)... */
  function geometria(p) {
    const s = 1 / (p.escala || 1);
    const w = p.w * s, h = p.h * s, b = p.sangria * s; // mm de página
    const menor = Math.min(w, h);
    const marca = Math.max(4, Math.min(12, menor * 0.03)); // comprimento da marca
    const recuo = b + 1.5; // a marca começa fora da sangria
    const margem = recuo + marca + 5;
    return {
      s, w, h, b, marca, recuo, margem,
      mediaW: (w + 2 * margem) * MM,
      mediaH: (h + 2 * margem) * MM,
    };
  }

  function escalaMinima(p) {
    for (const e of [1, 2, 5, 10, 20, 50]) {
      const g = geometria({ ...p, escala: e });
      if (g.mediaW <= LIMITE_PT && g.mediaH <= LIMITE_PT) return e;
    }
    return 100;
  }

  /* paginas: [{ w, h, sangria, escala, jpeg:Uint8Array, imgW, imgH, legenda }] (mm reais) */
  function montar(paginas) {
    const partes = [];
    const offsets = [];
    let pos = 0;
    const emit = (d) => {
      const u = typeof d === 'string' ? bytes(d) : d;
      partes.push(u);
      pos += u.length;
    };
    const abre = (id) => {
      offsets[id] = pos;
      emit(id + ' 0 obj\n');
    };

    const total = 3 + paginas.length * 3;
    emit('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
    abre(1);
    emit('<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    abre(2);
    emit('<< /Type /Pages /Count ' + paginas.length + ' /Kids [' +
      paginas.map((_, i) => 4 + i * 3 + ' 0 R').join(' ') + '] >>\nendobj\n');
    abre(3);
    emit('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n');

    paginas.forEach((p, i) => {
      const idPag = 4 + i * 3, idCont = idPag + 1, idImg = idPag + 2;
      const g = geometria(p);
      const H = g.mediaH;
      // caixas (origem do PDF embaixo, à esquerda)
      const tx0 = g.margem * MM, tx1 = (g.margem + g.w) * MM;
      const ty0 = g.margem * MM, ty1 = (g.margem + g.h) * MM;
      const bp = g.b * MM;
      const caixa = (a, b, c, d) => '[' + [a, b, c, d].map(n).join(' ') + ']';

      let c = 'q ' + n(tx1 - tx0 + 2 * bp) + ' 0 0 ' + n(ty1 - ty0 + 2 * bp) + ' ' +
        n(tx0 - bp) + ' ' + n(ty0 - bp) + ' cm /Im0 Do Q\n';
      // marcas de corte: preto 100% (K), traço fino
      c += '0 0 0 1 K 0.3 w\n';
      const r = g.recuo * MM, m = g.marca * MM;
      const linha = (x1, y1, x2, y2) => { c += n(x1) + ' ' + n(y1) + ' m ' + n(x2) + ' ' + n(y2) + ' l S\n'; };
      for (const x of [tx0, tx1]) {
        linha(x, ty0 - r, x, ty0 - r - m);
        linha(x, ty1 + r, x, ty1 + r + m);
      }
      for (const y of [ty0, ty1]) {
        linha(tx0 - r, y, tx0 - r - m, y);
        linha(tx1 + r, y, tx1 + r + m, y);
      }
      // marcas de centro
      const cx = (tx0 + tx1) / 2, cy = (ty0 + ty1) / 2;
      linha(cx, ty0 - r, cx, ty0 - r - m * 0.6);
      linha(cx, ty1 + r, cx, ty1 + r + m * 0.6);
      linha(tx0 - r, cy, tx0 - r - m * 0.6, cy);
      linha(tx1 + r, cy, tx1 + r + m * 0.6, cy);
      // legenda técnica no rodapé, fora da sangria
      const corpo = 6;
      const maxCar = Math.max(0, Math.floor((tx1 - tx0 - 8 * MM) / (corpo * 0.52)));
      const txt = ascii(p.legenda || '').slice(0, maxCar);
      if (txt) {
        c += '0 0 0 1 k BT /F1 ' + corpo + ' Tf ' + n(tx0 + 4 * MM) + ' ' +
          n(ty0 - r - m * 0.5 - corpo * 0.35) + ' Td (' + txt + ') Tj ET\n';
      }

      abre(idPag);
      emit('<< /Type /Page /Parent 2 0 R /MediaBox ' + caixa(0, 0, g.mediaW, H) +
        ' /BleedBox ' + caixa(tx0 - bp, ty0 - bp, tx1 + bp, ty1 + bp) +
        ' /TrimBox ' + caixa(tx0, ty0, tx1, ty1) +
        ' /Resources << /XObject << /Im0 ' + idImg + ' 0 R >> /Font << /F1 3 0 R >> >>' +
        ' /Contents ' + idCont + ' 0 R >>\nendobj\n');
      abre(idCont);
      emit('<< /Length ' + c.length + ' >>\nstream\n' + c + 'endstream\nendobj\n');
      abre(idImg);
      emit('<< /Type /XObject /Subtype /Image /Width ' + p.imgW + ' /Height ' + p.imgH +
        ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + p.jpeg.length + ' >>\nstream\n');
      emit(p.jpeg);
      emit('\nendstream\nendobj\n');
    });

    const xref = pos;
    let t = 'xref\n0 ' + (total + 1) + '\n0000000000 65535 f \n';
    for (let id = 1; id <= total; id++) t += String(offsets[id]).padStart(10, '0') + ' 00000 n \n';
    t += 'trailer\n<< /Size ' + (total + 1) + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n';
    emit(t);

    const out = new Uint8Array(pos);
    let o = 0;
    for (const u of partes) { out.set(u, o); o += u.length; }
    return out;
  }

  IAG.pdf = { montar, geometria, escalaMinima, MM, LIMITE_PT };
  if (typeof module !== 'undefined') module.exports = IAG.pdf;
})(typeof window !== 'undefined' ? window : globalThis);
