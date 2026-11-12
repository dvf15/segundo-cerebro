// Persistência local — nada sai do aparelho.
const CHAVE = 'bloquinhos-magicos-v1';

function padrao() {
  return {
    estrelas: 0,
    mudo: false,
    // medalhas por nível de contas: 0 a 3
    medalhas: { faisca: 0, chama: 0, fogueira: 0, vulcao: 0 },
    // subnível atual (adaptativo) por nível
    subniveis: { faisca: 1, chama: 1, fogueira: 1, vulcao: 1 },
    // fusões descobertas no sandbox: chaves "a+b" com a<=b
    album: [],
    // recorde por jogo de lógica
    recordes: {},
    // voz preferida para a narração (voiceURI)
    vozURI: '',
  };
}

function carregar() {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return padrao();
    return Object.assign(padrao(), JSON.parse(bruto));
  } catch {
    return padrao();
  }
}

const dados = carregar();

function salvar() {
  try { localStorage.setItem(CHAVE, JSON.stringify(dados)); } catch { /* sem espaço: segue sem salvar */ }
}

export const store = {
  get dados() { return dados; },
  salvar,
  addEstrelas(n) {
    dados.estrelas += n;
    salvar();
    document.dispatchEvent(new CustomEvent('estrelas', { detail: dados.estrelas }));
  },
  descobrirFusao(a, b) {
    const chave = `${Math.min(a, b)}+${Math.max(a, b)}`;
    if (!dados.album.includes(chave)) {
      dados.album.push(chave);
      salvar();
      return true; // fusão inédita
    }
    return false;
  },
  setMedalha(nivel, estrelas) {
    if (estrelas > (dados.medalhas[nivel] || 0)) {
      dados.medalhas[nivel] = estrelas;
      salvar();
    }
  },
  setSubnivel(nivel, sub) {
    dados.subniveis[nivel] = sub;
    salvar();
  },
  setRecorde(jogo, valor) {
    if (valor > (dados.recordes[jogo] || 0)) {
      dados.recordes[jogo] = valor;
      salvar();
      return true;
    }
    return false;
  },
  setMudo(v) { dados.mudo = v; salvar(); },
  setVozURI(v) { dados.vozURI = v; salvar(); },
};
