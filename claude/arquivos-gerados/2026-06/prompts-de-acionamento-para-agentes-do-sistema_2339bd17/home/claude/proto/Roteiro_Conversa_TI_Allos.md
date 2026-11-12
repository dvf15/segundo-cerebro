# Roteiro para a conversa com a TI / Segurança da Allos
## Projeto: Shopping Inteligente OS — pedido de orientação para Fase 2

---

### Como usar este documento
Leve o **protótipo Fase 1** (arquivo HTML) aberto na reunião. Ele mostra o que o sistema faz,
sem tocar em nenhum dado real. Seu objetivo na reunião **não é pedir aprovação para construir** —
é **sair com as respostas** que definem como a Fase 2 pode ser feita com segurança. Você chega
com algo pronto e perguntas claras, não com uma ideia vaga.

---

### Abertura (o que dizer em 30 segundos)
> "Desenvolvi um protótipo de um sistema de IA para acelerar a comercialização dos shoppings.
> Ele está funcionando com dados fictícios. Antes de qualquer passo com dados reais, quero entender
> com vocês como fazer isso dentro das regras de segurança e da LGPD da companhia. Trouxe o protótipo
> para mostrar e algumas perguntas objetivas."

---

### As perguntas que destravam o projeto (faça todas)

**Sobre hospedagem de dados**
1. Dados comerciais internos (lojas, contratos, plano de mix) podem ser hospedados em qual ambiente?
   Existe nuvem ou banco já homologado pela Allos para isso?
2. Há restrição para dados saírem do ambiente corporativo? (Isso decide se posso usar ferramentas externas.)

**Sobre o dado mais sensível — investidores (LGPD)**
3. A base de investidores contém dado pessoal. Qual a base legal e o processo para tratá-la?
   Preciso envolver o time de Privacidade/DPO?
4. Existe política sobre uso de dados pessoais com ferramentas de IA?

**Sobre o Sistema Bahia**
5. Como se obtém acesso de leitura ao Sistema Bahia (preços, vendas)? Há API interna? Quem é o dono do sistema?
6. Esse acesso pode ser concedido para um sistema novo, ou só para sistemas já homologados?

**Sobre IA / Claude**
7. A Allos já tem contrato ou política para uso de modelos de IA (Anthropic/Claude) com dados corporativos?
   Existe um caminho aprovado, ou preciso abrir um processo?

**Sobre o caminho de construção**
8. Para virar produção, o sistema precisa passar por homologação? Qual o processo e quem participa?
9. Vocês recomendam que eu construa com apoio de um dev interno, ou há um time que assume isso?

---

### O que você leva de volta (checklist de saída)
Saia da reunião com isto preenchido:

- [ ] Onde os dados podem morar: ____________________
- [ ] Ferramenta/nuvem homologada: ____________________
- [ ] Caminho LGPD para a base de investidores: ____________________
- [ ] Como acessar o Sistema Bahia (e quem é o dono): ____________________
- [ ] Política de IA da companhia: ____________________
- [ ] Processo de homologação para produção: ____________________
- [ ] Próximo passo combinado + responsável: ____________________

---

### O que NÃO fazer antes dessas respostas
- Não subir nenhum dado real (vendas, contratos, investidores) em nuvem nenhuma.
- Não tentar conectar ao Sistema Bahia por conta própria.
- Não contratar ferramenta paga assumindo que será aprovada.

> Regra simples: o protótipo Fase 1 é seu para explorar à vontade. Tudo que envolve dado real
> ou sistema interno só avança **depois** que a TI definir o como. Essa ordem protege você e o projeto.

---

### Frase de fechamento sugerida
> "Meu objetivo é fazer isso do jeito certo desde o começo. Com essas definições de vocês, consigo
> avançar para a próxima fase já dentro das regras da companhia. Posso contar com vocês para isso?"
