// Gera um único HTML autocontido (CSS e JS embutidos) para publicar como página estática.
// Uso: node scripts/gerar-unico.mjs <arquivo-de-saida.html>
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const ler = (f) => readFileSync(join(raiz, f), 'utf8');
const saida = process.argv[2];
if (!saida) { console.error('Informe o arquivo de saída.'); process.exit(1); }

let html = ler('index.html');
html = html.replace('<link rel="stylesheet" href="styles.css">', () => '<style>\n' + ler('styles.css') + '</style>');
for (const js of ['calc.js', 'dados.js', 'app.js']) {
  const src = ler(js);
  if (/<\/script/i.test(src)) throw new Error(js + ' contém </script> e não pode ser embutido');
  html = html.replace(`<script src="${js}"></script>`, () => '<script>\n' + src + '</script>');
}
// Ícones e manifesto embutidos: num endereço protegido por login o sistema busca
// esses arquivos sem a sessão do usuário e recebe a tela de login, e o atalho fica sem ícone.
const b64 = (f) => 'data:image/png;base64,' + readFileSync(join(raiz, f)).toString('base64');
const manifesto = JSON.parse(ler('eventos.webmanifest'));
delete manifesto.start_url; delete manifesto.scope;
manifesto.icons = [192, 512].map((t) => ({ src: b64(`eventos-icon-${t}.png`), sizes: `${t}x${t}`, type: 'image/png', purpose: 'any' }));
const trocar = (de, para) => { if (!html.includes(de)) throw new Error('não achei: ' + de); html = html.replace(de, () => para); };
trocar('href="eventos-icon-192.png"', `href="${b64('eventos-icon-192.png')}"`);
trocar('href="eventos-icon-180.png"', `href="${b64('eventos-icon-180.png')}"`);
trocar('<link rel="manifest" href="eventos.webmanifest">', `<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Radar Eventos">
<meta name="application-name" content="Radar Eventos">
<script>
(function () {
  try {
    var m = ${JSON.stringify(manifesto)};
    m.start_url = location.origin + location.pathname; m.scope = location.origin + '/';
    var l = document.createElement('link');
    l.rel = 'manifest'; l.href = URL.createObjectURL(new Blob([JSON.stringify(m)], { type: 'application/manifest+json' }));
    document.head.appendChild(l);
  } catch (e) { /* sem manifesto: a página segue funcionando normalmente */ }
})();
</script>`);
if (/(href="styles\.css"|<script src=|href="eventos-)/.test(html)) throw new Error('sobrou referência externa');
writeFileSync(resolve(saida), html);
console.log('gerado', resolve(saida), html.length, 'bytes');
