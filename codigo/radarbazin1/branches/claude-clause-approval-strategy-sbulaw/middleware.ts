import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* ============================================================
   Porta de entrada do domínio.

   O projeto serve duas coisas muito diferentes no mesmo domínio:
   as ferramentas comerciais (páginas estáticas em public/, feitas
   para circular por link) e o Nu.tre (app com banco e chave da
   Anthropic, de uso pessoal).

   Enquanto a proteção da Vercel cobria o domínio inteiro, isso não
   era problema. Ao abrir o domínio para compartilhar as ferramentas,
   as rotas de /api ficaram acessíveis a qualquer um — elas leem e
   gravam no banco sem autenticação, e duas delas chamam a Anthropic
   com a chave do projeto.

   Regra aqui: as ferramentas continuam públicas; TODO o resto exige
   a senha em APP_SENHA. Falha fechada — sem a variável configurada,
   nada além das ferramentas responde.
   ============================================================ */

/* Páginas e recursos que podem ser abertos por qualquer pessoa. */
const PUBLICO: RegExp[] = [
  // ferramentas comerciais
  /^\/(operacoes|quiosques|midia|obras|apresentacao|simulador-estrutura|simulador-remuneracao|pesquisa-executivos|clausulas)\.html$/,
  // manifests e ícones dessas ferramentas
  /^\/[a-z0-9-]+\.webmanifest$/,
  /^\/[a-z0-9-]+-icon(-\d+)?\.(png|svg)$/,
  /^\/(icon|icon-pink)\.(png|svg)$/,
  /^\/sw-[a-z0-9-]+\.js$/,
  // planilhas de exemplo que as ferramentas oferecem para download
  /^\/exemplos\//,
  /^\/favicon\.ico$/,
];

const COOKIE = "acesso_nutri";
const ROTA_LOGIN = "/acesso";
const NOVENTA_DIAS = 60 * 60 * 24 * 90;

/* Comparação de tamanho fixo: não revela o tamanho da senha pelo tempo de resposta. */
function iguais(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let dif = 0;
  for (let i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return dif === 0;
}

/* Espaço e quebra de linha nas pontas são acidente de digitação ou de quem
   colou o valor no painel — nunca intenção. Some dos dois lados. */
function limpa(v: string): string {
  return v.trim();
}

/* Só aceita destino interno: evita virar redirecionador para fora do domínio. */
function destinoSeguro(v: string | null): string {
  if (!v || !v.startsWith("/") || v.startsWith("//")) return "/";
  return v;
}

function esc(v: string): string {
  return v.replace(/[&<>"]/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&quot;"
  );
}

/* Tela de senha — a única entrada.

   Antes a senha vinha por ?senha=... na própria URL, e isso se mostrou
   frágil demais para valer a conveniência: numa query string o "+" chega
   como espaço, o "#" corta tudo o que vem depois, o teclado do iPhone
   capitaliza a primeira letra e a senha ainda fica no histórico do
   navegador. Uma senha legítima era recusada sem explicação. Num campo de
   formulário nada disso acontece. */
function paginaLogin(destino: string, erro?: string): string {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Acesso restrito</title>
<style>
  :root { color-scheme: dark }
  body { margin:0; min-height:100vh; display:grid; place-items:center;
         background:#242427; color:#e2e8f0; padding:24px;
         font:15px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif }
  form { width:100%; max-width:320px }
  h1 { margin:0 0 4px; font-size:20px; color:#fff }
  p  { margin:0 0 20px; color:#94a3b8; font-size:13px }
  input { width:100%; box-sizing:border-box; padding:13px 14px; font-size:17px;
          color:#fff; background:#42424a; border:1px solid #55555f;
          border-radius:12px; outline:none }
  input:focus { border-color:#10b981 }
  button { width:100%; margin-top:12px; padding:13px; font-size:16px;
           font-weight:700; color:#fff; background:#059669; border:0;
           border-radius:12px }
  .erro { margin:12px 0 0; color:#fca5a5; font-size:13px }
</style>
</head>
<body>
<form method="post" action="${esc(ROTA_LOGIN)}">
  <h1>Nu.tre</h1>
  <p>Área pessoal. Informe a senha para continuar.</p>
  <input type="password" name="senha" placeholder="Senha" autofocus
         autocapitalize="off" autocorrect="off" spellcheck="false"
         autocomplete="current-password">
  <input type="hidden" name="de" value="${esc(destino)}">
  <button type="submit">Entrar</button>
  ${erro ? `<p class="erro">${esc(erro)}</p>` : ""}
</form>
</body>
</html>`;
}

function html(corpo: string, status: number): NextResponse {
  return new NextResponse(corpo, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function semVariavel(): NextResponse {
  return new NextResponse(
    "Acesso restrito. Configure APP_SENHA nas variáveis de ambiente do projeto para liberar esta área.",
    { status: 401, headers: { "content-type": "text/plain; charset=utf-8" } }
  );
}

function liberaEIr(destino: string, senha: string, req: NextRequest): NextResponse {
  const url = req.nextUrl.clone();
  url.pathname = destino;
  url.search = "";
  const res = NextResponse.redirect(url, 303);
  res.cookies.set(COOKIE, senha, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: NOVENTA_DIAS,
  });
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLICO.some((r) => r.test(pathname))) return NextResponse.next();

  const bruta = process.env.APP_SENHA;
  if (!bruta) return semVariavel();
  const senha = limpa(bruta);

  /* A tela de senha: mostra o formulário e recebe o envio. */
  if (pathname === ROTA_LOGIN) {
    if (req.method === "POST") {
      const form = await req.formData().catch(() => null);
      const informada = limpa(String(form?.get("senha") ?? ""));
      const destino = destinoSeguro(String(form?.get("de") ?? "/"));
      if (iguais(informada, senha)) return liberaEIr(destino, senha, req);
      return html(paginaLogin(destino, "Senha incorreta."), 401);
    }
    const cookie = req.cookies.get(COOKIE)?.value;
    const destino = destinoSeguro(req.nextUrl.searchParams.get("de"));
    if (cookie && iguais(limpa(cookie), senha)) return liberaEIr(destino, senha, req);
    return html(paginaLogin(destino), 200);
  }

  const cookie = req.cookies.get(COOKIE)?.value;
  if (cookie && iguais(limpa(cookie), senha)) return NextResponse.next();

  /* Navegação de pessoa vai para a tela de senha; chamada de programa
     recebe 401 seco, para não engolir HTML no lugar de JSON. */
  const aceita = req.headers.get("accept") ?? "";
  if (req.method === "GET" && aceita.includes("text/html")) {
    const url = req.nextUrl.clone();
    url.pathname = ROTA_LOGIN;
    url.search = `?de=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url, 303);
  }

  return new NextResponse("Acesso restrito.", {
    status: 401,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

/* Ficam fora do middleware:
   - os bundles estáticos do Next, que não carregam segredo e cujo bloqueio
     só quebraria o app depois do login;
   - as ferramentas públicas e seus recursos (a mesma lista de PUBLICO).
     Assim a Vercel as serve direto como arquivo estático, e elas seguem no
     ar mesmo quando o middleware falha. Em 02/11/2026 o middleware passou
     a falhar na Vercel (500 MIDDLEWARE_INVOCATION_FAILED) em todas as
     rotas, inclusive as que ele só deixava passar, e derrubou as
     ferramentas junto com o app. A área protegida continua passando por
     aqui: se o middleware falhar, ela fica fechada, não aberta.
   Ao incluir uma ferramenta nova, acrescente-a nas duas listas. */
export const config = {
  matcher:
    "/((?!_next/static|_next/image|(?:operacoes|quiosques|midia|obras|apresentacao|simulador-estrutura|simulador-remuneracao|pesquisa-executivos|clausulas)\\.html$|[a-z0-9-]+\\.webmanifest$|[a-z0-9-]+-icon(?:-\\d+)?\\.(?:png|svg)$|icon(?:-pink)?\\.(?:png|svg)$|sw-[a-z0-9-]+\\.js$|exemplos/|favicon\\.ico$).*)",
};
