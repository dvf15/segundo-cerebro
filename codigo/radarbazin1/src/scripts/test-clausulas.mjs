// Testes headless do Radar de Cláusulas (public/clausulas.html).
// Carrega o <script> da página sem o bloco de inicialização (que mexe no DOM)
// e exercita o motor da régua, custo, codec da ficha e trilha de auditoria.
// Rode: node scripts/test-clausulas.mjs
import fs from "node:fs";
const html=fs.readFileSync(new URL("../public/clausulas.html",import.meta.url),"utf8");
const i0=html.lastIndexOf("<script>"), i1=html.lastIndexOf("</script>"); if(i0<0||i1<i0) throw new Error("script não encontrado");
let src=html.slice(i0+8,i1); const idx=src.indexOf("NAVEGAÇÃO & INICIALIZAÇÃO"); src=src.slice(0,src.lastIndexOf("/*",idx));
// --- stubs mínimos de navegador ---
const store={}; const localStorage={getItem:k=>(k in store?store[k]:null),setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}};
const el=()=>({textContent:"",value:"",innerHTML:"",className:"",classList:{add(){},remove(){},toggle(){},contains(){return false;}},querySelectorAll:()=>[],querySelector:()=>null,closest:()=>null,insertAdjacentHTML(){},scrollIntoView(){},focus(){},select(){},remove(){},options:[],dataset:{},getAttribute:()=>null,setAttribute(){}});
const document={getElementById:()=>el(),querySelectorAll:()=>[],querySelector:()=>null,documentElement:{classList:{add(){},remove(){}}},body:{appendChild(){}},createElement:()=>el()};
const location={hash:"",origin:"http://radar.test",pathname:"/clausulas.html",search:""};
const history={replaceState(){}}; const navigator={clipboard:{writeText:()=>Promise.resolve()}}; const window={scrollTo(){},open(){}};
const api=new Function("localStorage","document","location","history","navigator","window","alert","confirm",src+`
;return {decidir,alcadaRule,descontoPct,custoPorLojaRS,statusDo,registrar,verificarIntegridade,hashEvento,encodePayload,decodePayload,sanitizeSolic,registrarSolic,decidirSolic,receberDecisao,payloadSolic,proximaAlcada,checagens,
 get AUDIT(){return AUDIT}, set AUDIT(v){AUDIT=v}, get SOLIC(){return SOLIC}, PARAMS, STATUS, MARCAS};`)(localStorage,document,location,history,navigator,window,()=>{},()=>true);

let ok=0,fail=0; const T=(nome,cond,extra)=>{ if(cond){ok++;} else {fail++; console.log("  ✗ "+nome+(extra?" — "+extra:""));} };
const TAXA="Redução da Taxa de Transferência";
const CT50={aluguel_mensal:20000,taxa_padrao:3,taxa_neg:1.5}, CT60={aluguel_mensal:20000,taxa_padrao:3,taxa_neg:1.2};
const d=(marca,ct,tipo,seg)=>api.decidir(tipo||TAXA,seg||"Vestuário Feminino",marca,ct||CT50);

console.log("Régua de alçada");
T("marca A → Diretoria", d({grau:"A",pracas:1}).alcada==="Diretoria de Operações");
T("marca B → Diretoria", d({grau:"B",pracas:1}).alcada==="Diretoria de Operações");
T("Padrão 1 praça 50% → Superintendente", d({grau:"Padrao",pracas:1}).alcada==="Superintendente");
T("Padrão 1 praça 60% → Diretoria", d({grau:"Padrao",pracas:1},CT60).alcada==="Diretoria de Operações");
T("Padrão 2 praças no portfólio → Diretor", d({grau:"Padrao",pracas:2,dentro:true}).alcada==="Diretor de Portfólio");
T("Padrão 4 praças no portfólio → Diretor", d({grau:"Padrao",pracas:4,dentro:true}).alcada==="Diretor de Portfólio");
T("Padrão 5 praças → Diretoria", d({grau:"Padrao",pracas:5,dentro:true}).alcada==="Diretoria de Operações");
T("Padrão 3 praças fora do portfólio → Diretoria", d({grau:"Padrao",pracas:3,dentro:false}).alcada==="Diretoria de Operações");
const lim=d({grau:"Padrao",pracas:1},{},"Anticorrupção","Cosméticos"); T("Compliance → inegociável + Diretoria", lim.ineg&&lim.alcada==="Diretoria de Operações");

console.log("Desconto e custo");
const r3=d({grau:"Padrao",pracas:3,dentro:true}); T("desconto 50% derivado", r3.desconto===50);
T("custo por loja R$ 30.000", r3.porLoja===30000, String(r3.porLoja)); T("custo total R$ 90.000 (×3)", r3.total===90000, String(r3.total)); T("12,5% do aluguel anual", r3.clc===12.5, String(r3.clc));
const mu=d({grau:"Padrao",pracas:1},{aluguel_mensal:15000,multa_padrao:3,multa_neg:2},"Alteração de Multa Rescisória","Fast Food"); T("multa 3→2 = 33,3% → Superintendente", mu.desconto===33.3&&mu.alcada==="Superintendente", mu.desconto+"/"+mu.alcada);
T("desconto explícito prevalece", api.descontoPct(TAXA,{desconto:"70",taxa_padrao:3,taxa_neg:1.5})===70);
T("reajuste índice 1,5 p.p. × 12 m = R$ 1.800", api.custoPorLojaRS("Alteração de Índice de Reajuste",{aluguel_mensal:10000,reaj_padrao:4.5,reaj_neg:3,meses:12})===1800);
T("override por segmento", api.statusDo("Cláusula Padrão","Serviços Financeiros")==="Não Recomendado"&&api.statusDo("Cláusula Padrão","Fast Food")==="Recomendado");
T("checagens avisam desconto > máx", api.checagens(d({grau:"Padrao",pracas:1},CT60),CT60,{cadastrada:true},"x").some(c=>/acima do limite|passa do máximo/.test(c.m)));

console.log("Pipeline e decisões");
const s1=api.registrarSolic({r:r3,ct:CT50,marca:{nome:"Modas Bella",cadastrada:true},solicitante:"Ana",obs:""});
T("solicitação registrada aguardando Diretor", s1.status==="aguardando"&&s1.alcada==="Diretor de Portfólio");
T("evento de criação na trilha", api.AUDIT.length===1&&api.AUDIT[0].tipo==="solic_criada");
T("decisão sem justificativa é recusada", api.decidirSolic(s1.id,"aprovada","Chefe","")===null&&s1.status==="aguardando");
T("escalar sobe de alçada", api.decidirSolic(s1.id,"escalar","Diretor X","precedente de rede").alcada==="Diretoria de Operações");
T("escalar na alçada máxima é recusado", api.decidirSolic(s1.id,"escalar","Diretor X","de novo")===null);
T("aprovar grava status e evento", api.decidirSolic(s1.id,"aprovada","Diretoria","dentro da estratégia").status==="aprovada"&&api.AUDIT.at(-1).decisao==="aprovada");
T("proximaAlcada", api.proximaAlcada("Superintendente")==="Diretor de Portfólio"&&api.proximaAlcada("Diretoria de Operações")===null);

console.log("Trilha de auditoria (hash encadeado)");
T("íntegra após eventos", api.verificarIntegridade().ok===true&&api.AUDIT.length===3);
const orig=api.AUDIT[1].just; api.AUDIT[1].just="alterado fora da ferramenta"; const v=api.verificarIntegridade();
T("adulteração detectada no evento certo", v.ok===false&&v.em===1, JSON.stringify(v)); api.AUDIT[1].just=orig; T("volta a íntegra ao restaurar", api.verificarIntegridade().ok===true);
const bak=api.AUDIT.slice(); api.AUDIT=bak.filter((_,i)=>i!==1); T("remoção de evento detectada", api.verificarIntegridade().ok===false); api.AUDIT=bak;

console.log("Ficha: codec RC1 / RC1D");
const p=api.payloadSolic(s1); const code=api.encodePayload("RC1",p);
T("round-trip", JSON.stringify(api.decodePayload(code,"RC1"))===JSON.stringify(p));
T("tolera quebras e espaços", api.decodePayload(code.replace(/(.{60})/g,"$1\n ").replace(/=+$/,""),"RC1")?.id===p.id);
T("tolera %3A e mensagem em volta", api.decodePayload("Segue: "+code.replace("RC1:","RC1%3A")+" obrigado","RC1")?.id===p.id);
T("prefixo errado não abre como decisão", api.decodePayload(code,"RC1D")===null||api.decodePayload(code,"RC1D")?.t!=="RC-DEC");
const dec={t:"RC-DEC",v:1,id:"sc_naoexiste",decisao:"negada",decisor:"Diretor Y",just:"fora do mix",em:new Date().toISOString(),solic:Object.assign({},p,{id:"sc_naoexiste"})};
const err=api.receberDecisao(api.decodePayload(api.encodePayload("RC1D",dec),"RC1D"));
T("decisão por código cria a solicitação ausente e decide", err===null&&api.SOLIC.find(x=>x.id==="sc_naoexiste")?.status==="negada", String(err));
T("decisão repetida é recusada", typeof api.receberDecisao(dec)==="string");
T("sanitize descarta campo estranho e limita praças", (()=>{ const s=api.sanitizeSolic({marca:"X",pracas:5000,hack:"1",alcada:"Chefe"}); return s.hack===undefined&&s.pracas===999&&s.alcada==="Diretoria de Operações"; })());

console.log(`\n${ok} ok · ${fail} falha(s)`); process.exit(fail?1:0);
