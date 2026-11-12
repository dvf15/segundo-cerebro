import { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, AlertTriangle, RefreshCw, Save, Info } from 'lucide-react';

export default function RadarBazin() {
  const acoesIniciais = [
    {
      ticker: 'KLBN4',
      nome: 'Klabin',
      setor: 'Papel e Celulose',
      cotacao: 3.30,
      mediaDividendos: 0.23,
      observacao: 'Setor cíclico (commodity + dólar). Dividendos variam com o ciclo.',
      perenidade: 'media'
    },
    {
      ticker: 'ITSA4',
      nome: 'Itaúsa (Holding Itaú)',
      setor: 'Financeiro / Holding',
      cotacao: 12.96,
      mediaDividendos: 0.80,
      observacao: 'Holding do Itaú. Dividendos previsíveis + bonificações históricas.',
      perenidade: 'alta'
    },
    {
      ticker: 'BBDC4',
      nome: 'Bradesco',
      setor: 'Bancário',
      cotacao: 17.70,
      mediaDividendos: 1.34,
      observacao: 'Em recuperação após 2022-2024. Usei últimos 12M; média 5 anos pode estar abaixo.',
      perenidade: 'alta'
    },
    {
      ticker: 'AXIA3',
      nome: 'Axia Energia (ex-Eletrobras)',
      setor: 'Energia Elétrica',
      cotacao: 54.67,
      mediaDividendos: 3.65,
      observacao: '⚠️ Bazin pouco confiável: privatizada em 2022, histórico estatal distorce média 5 anos. Usei apenas dividendos 2025.',
      perenidade: 'incerta'
    }
  ];

  const [acoes, setAcoes] = useState(acoesIniciais);
  const [dyMinimo, setDyMinimo] = useState(6);
  const [margemSeguranca, setMargemSeguranca] = useState(0);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Carrega dados salvos
  useEffect(() => {
    async function carregarDados() {
      try {
        const salvo = await window.storage.get('radar-bazin-v1');
        if (salvo) {
          const dados = JSON.parse(salvo.value);
          setAcoes(dados.acoes || acoesIniciais);
          setDyMinimo(dados.dyMinimo || 6);
          setMargemSeguranca(dados.margemSeguranca || 0);
          setUltimaAtualizacao(dados.ultimaAtualizacao || null);
        }
      } catch (e) {
        // Primeira vez — sem dados salvos
      }
      setCarregando(false);
    }
    carregarDados();
  }, []);

  const salvar = async () => {
    const agora = new Date().toLocaleString('pt-BR');
    try {
      await window.storage.set('radar-bazin-v1', JSON.stringify({
        acoes, dyMinimo, margemSeguranca, ultimaAtualizacao: agora
      }));
      setUltimaAtualizacao(agora);
    } catch (e) {
      alert('Erro ao salvar. Tente novamente.');
    }
  };

  const atualizarCampo = (idx, campo, valor) => {
    const v = parseFloat(valor.toString().replace(',', '.'));
    if (isNaN(v)) return;
    const novas = [...acoes];
    novas[idx] = { ...novas[idx], [campo]: v };
    setAcoes(novas);
  };

  const calcular = (acao) => {
    const precoJusto = acao.mediaDividendos / (dyMinimo / 100);
    const precoCompra = precoJusto * (1 - margemSeguranca / 100);
    const desconto = ((precoJusto - acao.cotacao) / precoJusto) * 100;
    const dyAtual = (acao.mediaDividendos / acao.cotacao) * 100;
    let status, cor;
    if (acao.cotacao <= precoCompra) {
      status = 'BARATA';
      cor = 'verde';
    } else if (acao.cotacao <= precoJusto) {
      status = 'JUSTA';
      cor = 'amarelo';
    } else {
      status = 'CARA';
      cor = 'vermelho';
    }
    return { precoJusto, precoCompra, desconto, dyAtual, status, cor };
  };

  const resetar = () => {
    if (confirm('Restaurar valores iniciais? Suas edições serão perdidas.')) {
      setAcoes(acoesIniciais);
      setDyMinimo(6);
      setMargemSeguranca(0);
    }
  };

  if (carregando) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-white mb-1">Radar Bazin</h1>
          <p className="text-sm text-slate-400">Carteira previdenciária — atualize cotações diariamente</p>
          {ultimaAtualizacao && (
            <p className="text-xs text-slate-500 mt-1">Última atualização: {ultimaAtualizacao}</p>
          )}
        </div>

        {/* Parâmetros */}
        <div className="bg-slate-900 rounded-xl p-4 mb-4 border border-slate-800">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-3 font-semibold">Parâmetros Bazin</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">DY mínimo (%)</label>
              <input
                type="number"
                step="0.5"
                value={dyMinimo}
                onChange={(e) => setDyMinimo(parseFloat(e.target.value) || 6)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-base focus:outline-none focus:border-blue-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Bazin clássico = 6%</p>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Margem segurança (%)</label>
              <input
                type="number"
                step="5"
                value={margemSeguranca}
                onChange={(e) => setMargemSeguranca(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-base focus:outline-none focus:border-blue-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Desconto extra sobre Preço Justo</p>
            </div>
          </div>
        </div>

        {/* Cards das ações */}
        <div className="space-y-3">
          {acoes.map((acao, idx) => {
            const c = calcular(acao);
            const corBg = c.cor === 'verde' ? 'bg-emerald-500/10 border-emerald-500/40' : c.cor === 'amarelo' ? 'bg-amber-500/10 border-amber-500/40' : 'bg-rose-500/10 border-rose-500/40';
            const corTexto = c.cor === 'verde' ? 'text-emerald-400' : c.cor === 'amarelo' ? 'text-amber-400' : 'text-rose-400';
            const Icon = c.cor === 'verde' ? TrendingDown : c.cor === 'amarelo' ? Info : TrendingUp;

            return (
              <div key={acao.ticker} className={`rounded-xl border p-4 ${corBg}`}>
                {/* Cabeçalho */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{acao.ticker}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${corTexto} bg-slate-900/60`}>{c.status}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{acao.nome}</div>
                    <div className="text-[10px] text-slate-500">{acao.setor}</div>
                  </div>
                  <Icon className={`w-5 h-5 ${corTexto}`} />
                </div>

                {/* Inputs editáveis */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-wide text-slate-500 block mb-1">Cotação atual (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={acao.cotacao}
                      onBlur={(e) => atualizarCampo(idx, 'cotacao', e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wide text-slate-500 block mb-1">Méd. div. 5a (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={acao.mediaDividendos}
                      onBlur={(e) => atualizarCampo(idx, 'mediaDividendos', e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Resultados */}
                <div className="bg-slate-900/40 rounded-lg p-3 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Preço Justo (Bazin):</span>
                    <span className="text-white font-semibold">R$ {c.precoJusto.toFixed(2)}</span>
                  </div>
                  {margemSeguranca > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Preço Compra (c/ margem):</span>
                      <span className="text-white font-semibold">R$ {c.precoCompra.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Desconto vs. Justo:</span>
                    <span className={c.desconto >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                      {c.desconto >= 0 ? '+' : ''}{c.desconto.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">DY estimado:</span>
                    <span className="text-blue-400 font-semibold">{c.dyAtual.toFixed(2)}%</span>
                  </div>
                </div>

                {/* Observação */}
                <div className="mt-3 flex gap-2 text-xs text-slate-400 leading-relaxed">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-500" />
                  <span>{acao.observacao}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ações */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={salvar}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            <Save className="w-4 h-4" /> Salvar dados
          </button>
          <button
            onClick={resetar}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 rounded-xl border border-slate-700 transition"
          >
            <RefreshCw className="w-4 h-4" /> Resetar
          </button>
        </div>

        {/* Rodapé / instruções */}
        <div className="mt-5 bg-slate-900/50 rounded-xl p-4 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
          <div className="font-semibold text-slate-300 mb-1">Como usar:</div>
          <p>1. <strong>Diariamente</strong>, abra Status Invest, Investidor10 ou seu home broker e copie a cotação de cada ação.</p>
          <p>2. Clique no campo "Cotação atual" e cole o valor. Clique fora para confirmar.</p>
          <p>3. Os números (Preço Justo, status, DY) recalculam automaticamente.</p>
          <p>4. Toque em <strong>Salvar</strong> para guardar os valores. Eles ficam disponíveis nas próximas sessões.</p>
          <p>5. Atualize a <strong>Média dividendos 5a</strong> uma vez por ano (após o último pagamento de dezembro).</p>
          <div className="pt-2 mt-2 border-t border-slate-800">
            <strong className="text-slate-300">Legenda:</strong>
            <div className="mt-1 space-y-0.5">
              <div><span className="text-emerald-400">●</span> <strong>BARATA</strong>: cotação ≤ preço com margem</div>
              <div><span className="text-amber-400">●</span> <strong>JUSTA</strong>: entre margem e preço justo</div>
              <div><span className="text-rose-400">●</span> <strong>CARA</strong>: acima do preço justo</div>
            </div>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-800 text-[11px] text-slate-500">
            <strong>Aviso:</strong> Bazin é uma heurística, não uma garantia. Para AXIA3 e KLBN4, valide com outros métodos. Não é recomendação de investimento.
          </div>
        </div>
      </div>
    </div>
  );
}
