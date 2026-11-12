# -*- coding: utf-8 -*-
"""Conteudo compartilhado do relatorio (PDF + Markdown)."""

META = {
    "title": "Programa de Benefícios",
    "subtitle": "Oportunidades de evolução da experiência no app",
    "lead": "Consolidação de feedbacks de clientes, lojistas e operação — com destaque NorteShopping.",
    "date": "Julho / 2026",
    "brand": "ALLOS",
}

# Sumário executivo — 5 frentes
FRENTES = [
    ("petroleo", "1 · Benefícios & Segmentação",
     "Lista completa, selo de exclusivo, visibilidade dos ativados e limpeza dos usados/expirados."),
    ("ambar", "2 · Notas Fiscais & Sorteios",
     "Bloqueio automático fora da campanha, motivo de rejeição no app e histórico de 90 dias."),
    ("teal", "3 · Cadastro & Perfis",
     "Categorias para Administração e Terceiros e CRM que respeita benefícios já usados."),
    ("coral", "4 · Experiência no App",
     "Sessão/login sem senha, busca de lojas, valet por categoria e compra de ingressos."),
    ("menta", "5 · Operação, Retail & Comercial",
     "Validação por QR Code, SKU/Retail por marca, anunciantes externos e capacitação de mídia."),
]

# Frentes detalhadas: (id, título da frente, cor de destaque, [ (cor_card, título_card, [bullets]) ])
SECOES = [
    ("beneficios", "Benefícios & Segmentação", "petroleo", [
        ("petroleo", "Lista completa de benefícios", [
            'Hoje "Meus Benefícios" fica em aba separada, difícil de localizar.',
            "Sugestão: lista completa de benefícios, adicional à visão por categoria.",
            "Identificar os segmentados/exclusivos com um selo específico.",
        ]),
        ("ambar", 'Selo "Benefício Exclusivo"', [
            "Ações segmentadas geram ruído com clientes fora do público-alvo.",
            "Nem sempre fica claro que o benefício é exclusivo.",
            "O selo reforça a comunicação e o senso de exclusividade.",
        ]),
        ("teal", "Visibilidade dos benefícios ativados", [
            "Ao ativar e não usar na hora, o benefício some da lista principal.",
            'Fica só na aba "Benefícios Ativos" (menu) — parece que sumiu.',
            "Sugestão: manter indicador na lista principal ou facilitar o acesso.",
        ]),
        ("coral", "Benefícios usados / expirados", [
            "Benefícios já usados seguem na lista geral e dão erro ao tentar usar.",
            "Ativos exibem histórico parcial de ações fora do ar (às vezes P&B).",
            "Sugestão: sair da lista ao usar; histórico completo (ex.: 6 meses).",
        ]),
    ]),
    ("notas", "Notas Fiscais & Sorteios", "ambar", [
        ("coral", "Bloqueio automático de NF", [
            "Hoje o app permite ativar sorteio com NF fora do período promocional.",
            "Validação só manual, quando há ganhador.",
            "Ideal: bloquear a ativação automaticamente, como já ocorre no brinde.",
        ]),
        ("petroleo", "Rejeição de NF transparente", [
            "NF é rejeitada sem motivo claro e sem prazo dentro do app.",
            "Cliente precisa ir ao balcão só para abrir chamado.",
            "Ideal: informar o motivo, permitir reenvio e acompanhar o status.",
        ]),
        ("ambar", "Histórico de NF (90 dias)", [
            "Histórico exibido é limitado; não cobre todas as NF dos últimos 90 dias.",
            "Esse período é a base do cálculo da categoria do cliente.",
            "Ideal: histórico completo para acompanhamento e conferência.",
        ]),
        ("teal", "Separação de GMV por ação", [
            "Permitir que o cliente escolha para qual campanha direcionar a NF.",
            "Garante mensuração correta do GMV de cada ação.",
        ]),
        ("menta", "Ativação de sorteios mais intuitiva", [
            "Destacar visualmente que é preciso clicar no sorteio para participar.",
            "Banner in-app atual atrapalha a navegação — reduzir dúvidas e elevar conversão.",
        ]),
    ]),
    ("cadastro", "Cadastro, Perfis & Experiência no App", "teal", [
        ("petroleo", "Perfis de usuário", [
            'Hoje só existem "Clientes" e "Lojistas".',
            "Colaboradores da administração e terceiros entram como lojistas.",
            "Limita segmentação — ex.: ação da adm não exclui só os lojistas.",
            "Sugestão: criar categorias Administração e Terceiros.",
        ]),
        ("ambar", "Sessão & login", [
            "Mesmo atualizado, o app desloga o cliente ao longo do dia/mês.",
            "Muitos esquecem a senha e recorrem ao balcão — filas e desistência.",
            "Ideal: sessão mais longa; login por biometria, facial ou SMS/WhatsApp.",
        ]),
        ("coral", 'CRM "customer in the mall"', [
            "Comunicação é pré-programada e impacta quem já usou o benefício.",
            "Ex.: já usei o Outback e recebo o CRM do mesmo benefício.",
            "Gera falsa percepção de que está disponível de novo.",
        ]),
        ("teal", "Valet por categoria", [
            "Evoluir o produto para aplicar desconto/isenção de estacionamento pela categoria.",
            "Cliente paga apenas a taxa de manobra do valet sobre o valor comum do pátio.",
        ]),
        ("menta", "Outras melhorias de app", [
            "Retomar o filtro de busca de lojas (usabilidade).",
            "Nova funcionalidade: compra de ingressos e bilheteria pelo app.",
        ]),
    ]),
    ("operacao", "Operação, Retail & Comercial", "menta", [
        ("petroleo", "Validação por QR Code", [
            "Hoje o lojista valida o benefício manualmente, sem baixa automática.",
            "Cliente digita um código — permite reuso e impede medir a conversão por loja.",
            "Ideal: validação por QR Code, com baixa automática e registro rastreável no resgate.",
        ]),
        ("ambar", "SKU / Retail por marca", [
            "Limitação de SKU dificulta usar produtos de Retail com algumas marcas.",
            "Ex.: números da sorte extras para quem compra produtos específicos (não a loja toda).",
            "Amplia as possibilidades de negociação.",
        ]),
        ("teal", "Anunciantes externos", [
            "Processo já automatizado, mas ainda exige customização por cliente (ex.: Coca-Cola).",
            "Customização consome tempo e pode inviabilizar a negociação pelo timing do anunciante.",
            "Oportunidade de receita a destravar.",
        ]),
        ("coral", "Capacitação de mídia", [
            "Capacitar os executivos de mídia para inserir os produtos na rotina.",
            "Uso mais efetivo dos produtos = mais valor para shopping e lojista.",
        ]),
    ]),
]

# Priorização
QUICK_WINS = [
    "Lista completa de benefícios + selo de exclusivo",
    "Sair da lista ao usar / histórico de expirados",
    "Indicador dos benefícios ativados na lista principal",
    "Bloqueio automático de NF fora da campanha",
    "Motivo de rejeição de NF + reenvio e status no app",
    "Histórico completo de NF (90 dias)",
    "Retomar o filtro de busca de lojas",
]
PRODUTO = [
    "Login sem senha (biometria / facial / SMS-WhatsApp) e sessão longa",
    "Novos perfis: Administração e Terceiros",
    "CRM que respeita benefícios já utilizados",
    "Separação de GMV por ação (cliente escolhe a campanha)",
    "Validação por QR Code com baixa automática e rastreio",
    "Flexibilizar SKU/Retail para ações por marca",
    "Valet por categoria e compra de ingressos pelo app",
    "Destravar anunciantes externos + capacitação de mídia",
]

# Paleta ALLOS (hex)
PALETTE = {
    "petroleo": "#00616F",
    "escuro":   "#0D454A",
    "teal":     "#368C82",
    "coral":    "#CD5151",
    "menta":    "#6CC680",
    "ambar":    "#EDA754",
    "bege":     "#CCC5BC",
    "areia":    "#E5DED4",
    "white":    "#FFFFFF",
}


# ---------- Anexo para consulta (textos originais, na íntegra) ----------
_ANEXO_SEG = [
    "Benefícios segmentados (“Meus Benefícios”): atualmente ficam em uma aba separada do aplicativo, o que dificulta sua localização. Sugestão: exibir todos os benefícios em uma única lista e identificar os exclusivos com um selo específico.",
    "Identificação de benefícios exclusivos: nas ações segmentadas, há ruídos com clientes que não fazem parte do público-alvo, pois nem sempre fica claro que se trata de um benefício exclusivo. A inclusão de um selo de “Benefício Exclusivo” ajudaria a reforçar essa comunicação e o senso de exclusividade.",
    "Validação de notas fiscais para sorteios: hoje o sistema permite que clientes ativem participação em sorteios utilizando notas fiscais emitidas fora do período promocional. A validação acontece apenas manualmente quando há um ganhador. O ideal é que o app bloqueie automaticamente a ativação caso a nota fiscal esteja fora do período da campanha, assim como já acontece nas campanhas de brinde.",
    "Localização de benefícios ativados: quando o cliente ativa um benefício, mas não o utiliza imediatamente, ele desaparece da lista principal e passa a ficar disponível apenas na aba “Benefícios Ativos”, acessível pelo menu. Isso gera a percepção de que o benefício sumiu. Sugestão: manter uma indicação visível na lista principal ou facilitar o acesso aos benefícios ativados.",
    "Histórico de notas fiscais: o histórico exibido é limitado e não contempla todas as notas dos últimos 90 dias, período utilizado para cálculo da categoria do cliente. Isso dificulta o acompanhamento e a conferência das notas enviadas.",
    "Classificação de perfis de usuários: atualmente só existem as categorias “Clientes” e “Lojistas”. Não há uma classificação específica para colaboradores da administração e terceiros, que acabam sendo enquadrados como lojistas. Isso limita a segmentação de campanhas e impede, por exemplo, que ações destinadas à administração excluam corretamente apenas os lojistas. Sugestão: criar categorias distintas para Administração e Terceiros.",
]
_ANEXO_EXP = [
    "Benefícios já utilizados continuam na lista geral de benefícios disponíveis; Se o cliente tenta utilizar aparece uma mensagem de erro; O ideal seria a partir do momento que ele usou, que saísse da lista geral.",
    "Mesmo o app atualizado, alguns clientes ao decorrer do dia são deslogados tento que fazer novamente o login; Isso atrapalha a experiência e faz com que o cliente desista de usar o PB.",
    "Em benefícios ativos fica um histórico de apenas alguns benefícios/ações/promos que não estão mais no ar e somente as vezes ficam em preto e branco (representando que já expiraram), mas continuam na lista; O ideal seria não aparecerem mais quando expiram ou aparecer um histórico completo dos últimos 6 meses, por exemplo.",
    "CRM customer in the mall: Os benefícios já são programados previamente e mesmo que o cliente já os tenha utilizado, será impactado com a comunicação dele. Ex: Já usei benefício Outback e sou impactada com a comunicação de CRM deste benefício, gerando falsa percepção de que está novamente disponível para uso.",
    "Valet: Evolução de produto para que o cliente possa aplicar o desconto/isenção do benefício estacionamento de acordo com a sua categoria sobre valor comum do pátio e pagar apenas o referente a taxa de manobra valet.",
]
_ANEXO_NS = [
    ("q", "1 — Onde estão os maiores desafios dos shoppings hoje?"),
    ("b", "O app desloga o cliente mais de uma vez por mês. Muitos não lembram a senha e acabam recorrendo ao balcão para pedir ajuda, o que gera filas e frustração. Acredito que a sessão deveria permanecer ativa por mais tempo, com login facilitado por biometria, reconhecimento facial ou código via SMS/WhatsApp, sem depender de senha."),
    ("b", "A nota fiscal é rejeitada sem uma explicação clara e sem prazo de resposta dentro do app. Com isso, o cliente precisa ir ao balcão apenas para abrir um chamado. Acredito que o próprio app poderia informar o motivo da rejeição, permitir o reenvio da nota e possibilitar o acompanhamento do status da solicitação."),
    ("b", "Estamos sem o filtro de busca de lojas, o que gera uma experiência ruim de usabilidade para o cliente."),
    ("b", "Existe uma limitação no uso de SKU, o que dificulta a utilização dos produtos de Retail com algumas marcas. Gostaríamos de direcionar, por exemplo, “números da sorte extras” para clientes que comprassem produtos específicos, e não para compras na loja toda. Isso poderia ampliar nossas possibilidades de negociação."),
    ("q", "2 — Onde o produto hoje deixa valor na mesa para o consumidor, shopping ou lojista?"),
    ("b", "Precisamos capacitar melhor nossos executivos de mídia para que eles insiram esses produtos de forma mais efetiva em suas rotinas."),
    ("b", "Temos oportunidades no produto para anunciantes externos. Recentemente, o processo se tornou automatizado, mas ainda precisa ser customizado por cliente, como no caso da Coca-Cola. Isso exige mais tempo e, em alguns momentos, pode inviabilizar a negociação pelo timing do anunciante."),
    ("q", "3 — Onde a operação ainda carrega no braço o que o digital deveria resolver?"),
    ("b", "O lojista valida o benefício manualmente, sem baixa automática. Hoje, é necessário informar um código para que o cliente o digite no app. Esse processo permite, em alguns casos, a reutilização do benefício e impede a mensuração da conversão real por loja. O ideal seria que a validação fosse feita por QR Code, com baixa automática no momento do resgate e registro rastreável de cada utilização."),
    ("q", "Outros pontos levantados"),
    ("b", "Separação de GMV por ação: permitir que o cliente escolha para qual campanha deseja direcionar a nota fiscal, garantindo uma mensuração correta do GMV de cada ação."),
    ("b", "Ativação de sorteios mais intuitiva: destacar visualmente que é necessário clicar no sorteio para ativar a participação, reduzindo dúvidas e aumentando a conversão. Hoje temos um banner in app, mas impacta na navegação do cliente."),
    ("b", "Bloqueio automático de notas fora da campanha: impedir a ativação de sorteios com notas fiscais emitidas fora do período promocional, assim como já ocorre nas campanhas de brinde."),
    ("b", "Maior visibilidade dos benefícios ativados: manter um indicador na lista principal ou facilitar o acesso aos benefícios já ativados e não utilizados, evitando a percepção de que desapareceram."),
    ("b", "Funcionalidade de compras de ingressos e bilheteria pelo app."),
]

# (título, cor de destaque, blocos[(tipo, texto)]) — tipo: 'b' bullet, 'q' pergunta/rótulo
ANEXO = [
    ("Benefícios segmentados", "petroleo", [("b", t) for t in _ANEXO_SEG]),
    ("Melhorias de experiência no app", "ambar", [("b", t) for t in _ANEXO_EXP]),
    ("NorteShopping", "teal", _ANEXO_NS),
]
