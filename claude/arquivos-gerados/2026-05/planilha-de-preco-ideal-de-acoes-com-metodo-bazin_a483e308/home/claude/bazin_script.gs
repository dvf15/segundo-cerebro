/**
 * Script para Google Sheets - Atualização Automática de Preços + Bazin
 * Coloque este código em: Extensões > Apps Script
 */

// Configurações
const TICKERS = ["AAPL3.SA", "KLBN4.SA", "ITSA4.SA", "BBDC4.SA", "AXIA3.SA"];
const SHEET_NAME = "Ações";
const TAXA_DESCONTO = 0.11; // 11% - ajuste conforme necessário
const PRAZO_ANOS = 5;
const PL_ALVO = 15;

// Função principal para atualizar preços
function atualizarPrecos() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  
  // Linha onde começam os dados (ajuste conforme sua planilha)
  const linhaInicio = 3; // Começa na linha 3
  
  TICKERS.forEach((ticker, index) => {
    const linha = linhaInicio + index;
    const preco = buscarPrecoYahoo(ticker);
    
    if (preco) {
      sheet.getRange(`B${linha}`).setValue(preco);
      sheet.getRange(`B${linha}`).setNumberFormat("R$ #,##0.00");
    }
  });
  
  // Calcula margem de segurança e status
  calcularMargemSeguranca(sheet, linhaInicio);
  Logger.log("✅ Preços atualizados com sucesso!");
}

// Buscar preço via Yahoo Finance (usando GOOGLEFINANCE)
function buscarPrecoYahoo(ticker) {
  try {
    const formula = `=GOOGLEFINANCE("${ticker}", "price")`;
    const sheet = SpreadsheetApp.getActiveSheet();
    const cell = sheet.getRange("Z1");
    cell.setFormula(formula);
    SpreadsheetApp.flush();
    const preco = cell.getValue();
    cell.clearContent();
    return preco;
  } catch (e) {
    Logger.log(`Erro ao buscar ${ticker}: ${e}`);
    return null;
  }
}

// Calcular margem de segurança e definir status
function calcularMargemSeguranca(sheet, linhaInicio) {
  for (let i = 0; i < TICKERS.length; i++) {
    const linha = linhaInicio + i;
    
    // Coluna: Preço Atual (B), DPA (C), Crescimento (D), P/L (E), Div Yield (F)
    // Preço Justo (G), Margem Seg (H), Status (I)
    
    const precoAtual = sheet.getRange(`B${linha}`).getValue() || 0;
    const dpa = sheet.getRange(`C${linha}`).getValue() || 0;
    const crescimento = (sheet.getRange(`D${linha}`).getValue() || 0) / 100;
    
    if (dpa > 0 && precoAtual > 0) {
      // Fórmula Bazin: PJ = (DPA × (1 + g)^5) × (P/L + DY) / Taxa Desconto
      const divYield = (sheet.getRange(`F${linha}`).getValue() || 0) / 100;
      const dpaProjetado = dpa * Math.pow(1 + crescimento, PRAZO_ANOS);
      const precoJusto = (dpaProjetado * (PL_ALVO + divYield)) / TAXA_DESCONTO;
      
      const margemSeguranca = ((precoJusto - precoAtual) / precoJusto) * 100;
      
      // Atribui valores
      sheet.getRange(`G${linha}`).setValue(precoJusto).setNumberFormat("R$ #,##0.00");
      sheet.getRange(`H${linha}`).setValue(margemSeguranca).setNumberFormat("0.00%");
      
      // Define status baseado em margem de segurança
      let status = "❌ Cara";
      if (margemSeguranca >= 20) {
        status = "✅ Muito Barata";
      } else if (margemSeguranca >= 10) {
        status = "🟢 Barata";
      } else if (margemSeguranca >= 0) {
        status = "🟡 Neutra";
      }
      
      sheet.getRange(`I${linha}`).setValue(status);
    }
  }
}

// Agendar execução automática
function criarTrigger() {
  // Remove triggers antigos
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => ScriptApp.deleteTrigger(t));
  
  // Cria novo trigger: executa a cada 1 hora
  ScriptApp.newTrigger("atualizarPrecos")
    .timeBased()
    .everyHours(1)
    .create();
  
  Logger.log("⏰ Trigger configurado para executar a cada 1 hora");
}

// Menu personalizado para facilitar
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("📈 Bazin")
    .addItem("🔄 Atualizar Preços Agora", "atualizarPrecos")
    .addItem("⏰ Agendar Atualizações", "criarTrigger")
    .addSeparator()
    .addItem("ℹ️ Instruções", "mostrarInstrucoes")
    .addToUi();
}

function mostrarInstrucoes() {
  const html = HtmlService.createHtmlOutput(`
    <h2>📖 Como usar</h2>
    <ol>
      <li>Preencha as colunas: <b>DPA, Crescimento %, P/L, Div Yield</b></li>
      <li>Clique em <b>Atualizar Preços Agora</b> para buscar preços</li>
      <li>Clique em <b>Agendar Atualizações</b> para atualizar automaticamente</li>
      <li>As puts você alimenta manualmente</li>
    </ol>
    <p><b>Legenda de Status:</b></p>
    <ul>
      <li>✅ Muito Barata: Margem ≥ 20%</li>
      <li>🟢 Barata: Margem ≥ 10%</li>
      <li>🟡 Neutra: Margem ≥ 0%</li>
      <li>❌ Cara: Margem &lt; 0%</li>
    </ul>
  `);
  SpreadsheetApp.getUi().showModalDialog(html, "Instruções");
}
