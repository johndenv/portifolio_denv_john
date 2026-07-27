export const profile = {
    name: "John Everton Marques Dos Santos",

    displayName: "John",

    role: "Desenvolvedor Full Stack",

    tagline: "Construindo soluções digitais com código limpo e performance",

    bio: "Desenvolvedor apaixonado por tecnologia, especializado em Python e Django. Tenho como principal diferencial o raciocínio lógico e a capacidade de transformar problemas complexos em soluções simples, eficientes e escaláveis. Utilizo inteligência artificial como uma ferramenta para acelerar o desenvolvimento, mas acredito que a verdadeira diferença está na análise crítica, na arquitetura bem planejada e na escrita de código limpo e sustentável. Estou em constante evolução, aprendendo novas tecnologias e buscando entregar soluções de alta qualidade que gerem valor real.",

    location: "São João do Paraiso-MG, Brasil",

    email: "evertonjohn097@gmail.com",

    phone: "(31) 99762-3668",

    github: "https://github.com/johndenv",
};

export const skills = {
    languages: ["Python", "JavaScript","PostgresSQL"],
    frameworks: ["Django"],
    tools: ["Git", "PostgreSQL", "VS Code"],
    concepts: ["REST API", "CRUD", "POO", "CI/CD"],
};

export const projects = [
    {
        name: "ProxyServer",
        description: "Servidor proxy de alta performance para roteamento e cache de requisicoes HTTP/HTTPS. Solucao robusta para seguranca e otimizacao de trafego de rede.",
        tech: ["Python", "Django", "PostgreSQL"],
        github: "https://github.com/johndenv/ProxyServer",
        highlight: true,
    },
    {
        name: "Authentication-Django",
        description: "Pagina de registro e login profissional com autenticacao segura, sistema de tokens e protecao contra ataques.",
        tech: ["Python", "Django", "SQLite"],
        github: "https://github.com/johndenv/Authentication-Django",
        highlight: true,
    },
    {
        name: "Loan Calculator",
        description: "API de calculo de juros compostos diarios a partir de taxa mensal. Tabela de amortizacao e projecoes financeiras.",
        tech: ["Python", "Django", "JavaScript"],
        github: "https://github.com/johndenv/portifolio_denv_john",
        highlight: true,
    },
];

export const experience = [];

export const education = [
    {
        // <!-- PREENCHA: Sua formacao academica -->
        course: "Ciencia da Computacao",
        institution: "Universidade UNA",
        period: "2025 - 2029",
    },
];

// ============================================================
// TERMINAL COMMANDS CONFIGURATION
// Cada comando exibido no terminal do portfolio
// ============================================================

export const terminalConfig = {
    prompt: "john@portfolio",

    version: "1.0.0",

    // ASCII Art exibido ao abrir o terminal
    asciiArt: `
 ██████╗ ██╗   ██╗██╗███████╗    ██████╗  ██████╗  ██████╗ ███████╗███████╗
██╔═══██╗██║   ██║██║██╔════╝    ██╔══██╗██╔═══██╗██╔═══██╗██╔════╝██╔════╝
██║   ██║██║   ██║██║███████╗    ██║  ██║██║   ██║██║   ██║█████╗  ███████╗
██║▄▄ ██║██║   ██║██║╚════██║    ██║  ██║██║   ██║██║   ██║██╔══╝  ╚════██║
╚██████╔╝╚██████╔╝██║███████║    ██████╔╝╚██████╔╝╚██████╔╝███████╗███████║
 ╚══▀▀═╝  ╚═════╝ ╚═╝╚══════╝    ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚══════╝`,

    welcomeMessage: [
        "Bem-vindo ao meu portfolio interativo!",
        "",
        "  Comandos rapidos:",
        "    help      -> Lista todos os comandos disponiveis",
        "    about     -> Saiba mais sobre mim",
        "    skills    -> Minhas habilidades tecnicas",
        "    projects  -> Meus projetos",
        "    loan      -> Calculadora de emprestimos",
        "",
        '  Digite "help" para ver a lista completa de comandos.',
        "  Use as setas ↑/↓ para navegar no historico ou Tab para autocompletar.",
        "",
    ],
};
