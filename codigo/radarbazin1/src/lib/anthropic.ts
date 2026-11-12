import Anthropic from "@anthropic-ai/sdk";

// Chave colada no painel da Vercel às vezes vem com espaço, quebra de linha ou aspas;
// limpamos antes de usar para não dar "invalid x-api-key" por causa disso.
export function anthropicClient() {
  const apiKey = (process.env.ANTHROPIC_API_KEY ?? "").trim().replace(/^["']+|["']+$/g, "").trim();
  return new Anthropic({ apiKey });
}
