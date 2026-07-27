// ============================================================
// TERMINAL - Emulador de terminal interativo para o portfolio
// ============================================================

import { profile, skills, projects, education, terminalConfig } from "./data.js";
import { parseLoanCommand } from "./loan.js";

export class Terminal {
    constructor(container) {
        this.container = container;
        this.history = [];
        this.historyIndex = -1;
        this.commandHistory = [];
        this.outputLines = [];
        this.init();
    }

    init() {
        this.container.classList.add("terminal");

        // Barra de titulo
        this.titleBar = document.createElement("div");
        this.titleBar.classList.add("terminal-titlebar");
        this.titleBar.innerHTML = `
            <div class="terminal-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
            </div>
            <span class="terminal-title">john@portfolio:~</span>
            <div class="terminal-titlebar-spacer"></div>
        `;
        this.container.appendChild(this.titleBar);

        // Area de saida
        this.outputArea = document.createElement("div");
        this.outputArea.classList.add("terminal-output");
        this.container.appendChild(this.outputArea);

        // Area de input
        this.inputArea = document.createElement("div");
        this.inputArea.classList.add("terminal-input-area");
        this.inputArea.innerHTML = `
            <span class="terminal-prompt">${terminalConfig.prompt}~$ </span>
        `;

        this.input = document.createElement("input");
        this.input.type = "text";
        this.input.classList.add("terminal-input");
        this.input.setAttribute("autocomplete", "off");
        this.input.setAttribute("spellcheck", "false");
        this.inputArea.appendChild(this.input);
        this.container.appendChild(this.inputArea);

        // Eventos
        this.input.addEventListener("keydown", (e) => this.handleKeydown(e));
        this.container.addEventListener("click", () => this.input.focus());

        // Mensagem de boas-vindas
        this.printAscii(terminalConfig.asciiArt);
        for (const line of terminalConfig.welcomeMessage) {
            this.println(line);
        }

        this.input.focus();
    }

    handleKeydown(e) {
        if (e.key === "Enter") {
            const cmd = this.input.value.trim();
            if (cmd) {
                this.commandHistory.push(cmd);
                this.historyIndex = this.commandHistory.length;
                this.executeCommand(cmd);
            }
            this.input.value = "";
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.input.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.input.value = "";
            }
        } else if (e.key === "Tab") {
            e.preventDefault();
            this.autocomplete();
        } else if (e.key === "l" && e.ctrlKey) {
            e.preventDefault();
            this.clear();
        }
    }

    autocomplete() {
        const commands = [
            "help", "about", "skills", "projects",
            "education", "contact", "loan", "clear", "history",
            "whoami", "ls", "cat", "neofetch",
        ];
        const val = this.input.value.trim().toLowerCase();
        if (!val) return;

        const matches = commands.filter((c) => c.startsWith(val));
        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.println(`Comandos similares: ${matches.join(", ")}`);
        }
    }

    // Calcula distancia de Levenshtein entre duas strings
    levenshtein(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b[i - 1] === a[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    // Encontra comandos similares ao digitado
    findSimilarCommands(input) {
        const allCommands = [
            "help", "about", "skills", "projects", "education", "contact",
            "loan", "clear", "cls", "history", "whoami", "ls", "cat",
            "neofetch", "date", "pwd", "echo", "banner",
            "sobre", "habilidades", "projetos", "experiencia", "formacao",
            "contato", "emprestimo"
        ];
        const suggestions = [];
        for (const cmd of allCommands) {
            const dist = this.levenshtein(input, cmd);
            if (dist <= 2 && dist < input.length) {
                suggestions.push(cmd);
            }
        }
        return suggestions.slice(0, 3);
    }

    executeCommand(raw) {
        // Mostra o comando digitado
        this.println(`${terminalConfig.prompt}~$ ${raw}`, "input-line");

        const parts = raw.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (cmd) {
            case "help":
                this.cmdHelp();
                break;
            case "about":
            case "sobre":
                this.cmdAbout();
                break;
            case "skills":
            case "habilidades":
                this.cmdSkills();
                break;
            case "projects":
            case "projetos":
                this.cmdProjects();
                break;
            case "experience":
            case "experiencia":
                this.println("");
                this.println("  Nenhuma experiencia profissional registrada no momento.");
                this.println('  Use "about" para saber mais sobre mim.');
                this.println("");
                break;
            case "education":
            case "formacao":
                this.cmdEducation();
                break;
            case "contact":
            case "contato":
                this.cmdContact();
                break;
            case "loan":
            case "emprestimo":
                this.cmdLoan(args);
                break;
            case "clear":
            case "cls":
                this.clear();
                break;
            case "history":
                this.cmdHistory();
                break;
            case "whoami":
                this.println("");
                this.println(`  Usuario: ${profile.name}`);
                this.println(`  Cargo:   ${profile.role}`);
                this.println(`  Local:   ${profile.location}`);
                this.println("");
                break;
            case "ls":
                this.cmdLs();
                break;
            case "cat":
                this.cmdCat(args);
                break;
            case "neofetch":
                this.cmdNeofetch();
                break;
            case "date":
                this.println("");
                this.println(`  Data e hora atual: ${new Date().toLocaleString("pt-BR")}`);
                this.println("");
                break;
            case "pwd":
                this.println("/home/john/portfolio");
                break;
            case "echo":
                if (args.length === 0) {
                    this.println("");
                    this.println('  Uso: echo <texto>');
                    this.println('  Exemplo: echo ola mundo');
                    this.println("");
                } else {
                    this.println(args.join(" "));
                }
                break;
            case "banner":
                this.printAscii(terminalConfig.asciiArt);
                break;
            default:
                this.handleUnknownCommand(cmd);
        }

        this.scrollToBottom();
    }

    handleUnknownCommand(cmd) {
        this.println("");

        // Verifica se o usuario esqueceu de passar argumentos
        const commandsNeedingArgs = {
            "loan": 'loan "valor" "taxa" | Ex: loan "30" "30" (30%/mes) ou loan "30" "0.30"',
            "emprestimo": 'emprestimo "valor" "taxa" | Ex: emprestimo "30" "30"',
            "cat": "cat <arquivo> | Arquivos: about.md, skills.json, README.md",
            "echo": "echo <texto> | Exemplo: echo ola mundo",
        };
        if (commandsNeedingArgs[cmd]) {
            this.println(`  O comando "${cmd}" precisa de argumentos.`);
            this.println(`  Uso correto: ${commandsNeedingArgs[cmd]}`);
            this.println("");
            this.scrollToBottom();
            return;
        }

        // Procura comandos similares (tipo o bash faz)
        const similar = this.findSimilarCommands(cmd);
        if (similar.length > 0) {
            this.println(`  O comando "${cmd}" nao existe.`);
            this.println(`  Voce quis dizer: ${similar.join(", ")} ?`);
            this.println('  Digite "help" para ver todos os comandos disponiveis.');
        } else {
            this.println(`  O comando "${cmd}" nao foi encontrado neste terminal.`);
            this.println("");
            this.println("  Comandos disponiveis:");
            this.println("    help, about, skills, projects, education, contact,");
            this.println("    loan, whoami, ls, cat, neofetch, history, clear,");
            this.println("    date, pwd, echo, banner");
            this.println("");
            this.println('  Dica: Digite "help" para ver detalhes de cada comando.');
        }
        this.println("");
    }

    // ==================== COMANDOS ====================

    cmdHelp() {
        const lines = [
            "",
            "  ╔══════════════════════════════════════════════════════════════╗",
            "  ║                 COMANDOS DISPONIVEIS                        ║",
            "  ╠══════════════════════════════════════════════════════════════╣",
            "  ║                                                            ║",
            "  ║  NAVEGACAO (digite o comando e aperte Enter):              ║",
            "  ║  ───────────────────────────────────────────────────────   ║",
            "  ║    help          - Exibe esta mensagem de ajuda            ║",
            "  ║    about         - Informacoes sobre mim                   ║",
            "  ║    skills        - Minhas habilidades tecnicas             ║",
            "  ║    projects      - Lista de projetos                       ║",
            "  ║    education     - Minha formacao academica                ║",
            "  ║    contact       - Formas de entrar em contato             ║",
            "  ║                                                            ║",
"  ║  CALCULADORA DE EMPRESTIMOS:                               ║",
            "  ║  ───────────────────────────────────────────────────────   ║",
            "  ║    loan \"valor\" \"taxa\"                                       ║",
            "  ║      Calcula juros compostos diarios e projecoes           ║",
            "  ║      Taxa: use 30 para 30% ou 0.30 para 30%               ║",
            "  ║      Exemplo: loan \"30\" \"30\"                                 ║",
            "  ║        -> R$ 30 com 30%/mes = R$ 39,00 em 30 dias         ║",
            "  ║                                                            ║",
            "  ║    loan \"valor\" \"taxa\" table \"dias\"                           ║",
            "  ║      Gera tabela de amortizacao dia a dia                  ║",
            "  ║      Exemplo: loan \"30\" \"30\" table \"30\"                       ║",
            "  ║        -> Tabela de 30 dias para R$ 30 a 30%/mes         ║",
            "  ║                                                            ║",
            "  ║  SISTEMA:                                                  ║",
            "  ║  ───────────────────────────────────────────────────────   ║",
            "  ║    whoami       - Mostra o usuario atual                  ║",
            "  ║    ls           - Lista arquivos do portfolio              ║",
            "  ║    cat <arquivo>- Le o conteudo de um arquivo             ║",
            "  ║      Exemplo: cat about.md                                ║",
            "  ║    neofetch     - Informacoes do sistema                  ║",
            "  ║    history      - Historico de comandos digitados         ║",
            "  ║    clear        - Limpa a tela do terminal                ║",
            "  ║    banner       - Exibe a arte ASCII de boas-vindas      ║",
            "  ║    date         - Mostra data e hora atual                ║",
            "  ║    pwd          - Mostra o diretorio atual                ║",
            "  ║    echo <texto> - Repete o texto digitado                 ║",
            "  ║                                                            ║",
            "  ║  DICAS:                                                    ║",
            "  ║  ───────────────────────────────────────────────────────   ║",
            "  ║    Tab         - Autocompleta o comando que voce digitou  ║",
            "  ║    ↑ / ↓       - Navega pelos comandos anteriores         ║",
            "  ║    Ctrl+L      - Limpa o terminal rapidamente             ║",
            "  ║                                                            ║",
            "  ║  Se errar o comando, o terminal vai te ajudar a corrigir! ║",
            "  ╚══════════════════════════════════════════════════════════════╝",
            "",
        ];
        for (const line of lines) {
            this.println(line);
        }
    }

    cmdAbout() {
        const lines = [
            "",
            `  ╔══════════════════════════════════════════════════╗`,
            `  ║                  SOBRE MIM                       ║`,
            `  ╠══════════════════════════════════════════════════╣`,
            `  ║  Nome:     ${profile.name.padEnd(36)} ║`,
            `  ║  Cargo:    ${profile.role.padEnd(36)} ║`,
            `  ║  Local:    ${profile.location.padEnd(36)} ║`,
            `  ╠══════════════════════════════════════════════════╣`,
            `  ║  Bio:                                                ║`,
        ];

        // Quebra a bio em linhas de no maximo 44 chars
        const bioWords = profile.bio.split(" ");
        let bioLine = "";
        for (const word of bioWords) {
            if ((bioLine + " " + word).trim().length > 44) {
                lines.push(`  ║    ${bioLine.trim().padEnd(46)} ║`);
                bioLine = word;
            } else {
                bioLine += " " + word;
            }
        }
        if (bioLine.trim()) {
            lines.push(`  ║    ${bioLine.trim().padEnd(46)} ║`);
        }

        lines.push(`  ╚══════════════════════════════════════════════════╝`);

        for (const line of lines) {
            this.println(line);
        }
    }

    cmdSkills() {
        const lines = [
            "",
            "  ╔══════════════════════════════════════════════════╗",
            "  ║           HABILIDADES TECNICAS                   ║",
            "  ╠══════════════════════════════════════════════════╣",
        ];

        const addCategory = (title, items) => {
            lines.push(`  ║  ${title}:`.padEnd(50) + "║");
            let row = "  ║    ";
            for (let i = 0; i < items.length; i++) {
                const tag = `[${items[i]}]`;
                if (row.length + tag.length > 48) {
                    lines.push(row.padEnd(50) + "║");
                    row = "  ║    ";
                }
                row += tag + " ";
            }
            if (row.trim() !== "║") {
                lines.push(row.padEnd(50) + "║");
            }
        };

        addCategory("Linguagens", skills.languages);
        addCategory("Frameworks", skills.frameworks);
        addCategory("Ferramentas", skills.tools);
        addCategory("Conceitos", skills.concepts);

        lines.push("  ╚══════════════════════════════════════════════════╝");

        for (const line of lines) {
            this.println(line);
        }
    }

    cmdProjects() {
        const lines = [
            "",
            "  ╔═══════════════════════════════════════════════════════════════════╗",
            "  ║                    📁 MEUS PROJETOS                             ║",
            "  ╠═══════════════════════════════════════════════════════════════════╣",
            "  ║                                                                ║",
            "  ║  Digite o número do projeto para ver detalhes, ou             ║",
            "  ║  use 'cat <nome>' para ver mais informações.                  ║",
            "  ║                                                                ║",
            "  ╚══════════════════════════════════════════════════════════════════╝",
            "",
        ];

        for (let i = 0; i < projects.length; i++) {
            const p = projects[i];
            const star = p.highlight ? "⭐" : "  ";
            const num = String(i + 1).padStart(2);
            
            lines.push(`  ${star}  [${num}] ${p.name}`);
            lines.push(`       │  ${p.description.substring(0, 70)}${p.description.length > 70 ? "..." : ""}`);
            lines.push(`       │  Stack: ${p.tech.join(", ")}`);
            lines.push(`       │  GitHub: ${p.github}`);
            if (i < projects.length - 1) {
                lines.push(`       ├─────────────────────────────────────────────────────────────`);
            }
            lines.push("");
        }

        lines.push("  💡 Dica: No site, clique nos cards dos projetos para ver detalhes!");

        for (const line of lines) {
            this.println(line);
        }
    }

    cmdEducation() {
        const lines = [
            "",
            "  ╔══════════════════════════════════════════════════╗",
            "  ║            FORMACAO ACADEMICA                    ║",
            "  ╠══════════════════════════════════════════════════╣",
        ];

        for (const e of education) {
            lines.push(`  ║  Curso:       ${e.course.padEnd(34)} ║`);
            lines.push(`  ║  Instituicao: ${e.institution.padEnd(34)} ║`);
            lines.push(`  ║  Periodo:     ${e.period.padEnd(34)} ║`);
        }

        lines.push("  ╚══════════════════════════════════════════════════╝");

        for (const line of lines) {
            this.println(line);
        }
    }

    cmdContact() {
        const lines = [
            "",
            "  ╔══════════════════════════════════════════════════╗",
            "  ║           CONTATO                                ║",
            "  ╠══════════════════════════════════════════════════╣",
            `  ║  Email:   ${profile.email.padEnd(38)} ║`,
            `  ║  Telefone: ${profile.phone.padEnd(37)} ║`,
            `  ║  GitHub:  ${profile.github.padEnd(38)} ║`,
            `  ║  Local:   ${profile.location.padEnd(38)} ║`,
            "  ╚══════════════════════════════════════════════════╝",
        ];

        for (const line of lines) {
            this.println(line);
        }
    }

    cmdLoan(args) {
        const lines = parseLoanCommand(args);
        for (const line of lines) {
            this.println(line, "loan-output");
        }
    }

    cmdHistory() {
        if (this.commandHistory.length === 0) {
            this.println("Nenhum comando no historico.");
            return;
        }
        this.println("");
        for (let i = 0; i < this.commandHistory.length; i++) {
            this.println(`  ${String(i + 1).padStart(4)}  ${this.commandHistory[i]}`);
        }
        this.println("");
    }

    cmdLs() {
        const files = [
            { name: "about.md", type: "file", desc: "Sobre mim" },
            { name: "skills.json", type: "file", desc: "Habilidades" },
            { name: "projects/", type: "dir", desc: "Diretorio de projetos" },
            { name: "education.dat", type: "file", desc: "Formacao academica" },
            { name: "contact.info", type: "file", desc: "Informacoes de contato" },
            { name: "loan_calc.py", type: "file", desc: "Calculadora de emprestimos" },
            { name: "README.md", type: "file", desc: "Documentacao do portfolio" },
        ];

        this.println("");
        for (const f of files) {
            const icon = f.type === "dir" ? "📁" : "📄";
            this.println(`  ${icon} ${f.name.padEnd(20)} ${f.desc}`);
        }
        this.println("");
    }

    cmdCat(args) {
        if (args.length === 0) {
            this.println("");
            this.println('  Uso: cat <arquivo>');
            this.println("");
            this.println('  Arquivos disponiveis:');
            this.println('    cat about.md      -> Sobre mim');
            this.println('    cat skills.json   -> Minhas habilidades');
            this.println('    cat README.md     -> Documentacao');
            this.println("");
            this.println('  Dica: use "ls" para ver todos os arquivos.');
            this.println("");
            return;
        }

        const file = args[0].toLowerCase();
        switch (file) {
            case "about.md":
                this.cmdAbout();
                break;
            case "skills.json":
                this.cmdSkills();
                break;
            case "education.dat":
                this.cmdEducation();
                break;
            case "contact.info":
                this.cmdContact();
                break;
            case "readme.md":
                this.println("");
                this.println(`  # ${profile.name} - Portfolio`);
                this.println(`  ${profile.tagline}`);
                this.println("");
                this.println(`  ## Sobre`);
                this.println(`  ${profile.bio}`);
                this.println("");
                this.println(`  ## Stack`);
                this.println(`  ${[...skills.languages, ...skills.frameworks].join(", ")}`);
                this.println("");
                break;
            default:
                this.println("");
                this.println(`  cat: arquivo "${file}" nao encontrado.`);
                this.println("");
                this.println('  Arquivos disponiveis:');
                this.println('    about.md, skills.json, education.dat, contact.info, README.md');
                this.println("");
                this.println('  Use "ls" para ver a lista completa de arquivos.');
                this.println("");
        }
    }

    cmdNeofetch() {
        const lines = [
            "",
            "       .--.        " + `${profile.name}@portfolio`,
            "      |o_o |       " + "────────────────────",
            "      |:_/ |       " + `OS:      Portfolio OS v${terminalConfig.version}`,
            "     //   \\ \\      " + `Host:    ${profile.role}`,
            "    (|     | )     " + `Kernel:  JavaScript ES2024`,
            "   /'\\_   _/`\\     " + `Shell:   Portfolio Terminal`,
            "   \\___)=(___/     " + `DE:      Custom DOM Renderer`,
            "                   " + `Theme:   Terminal Dark`,
            "                   " + `CPU:     Creative Logic`,
            "                   " + `Memory:  Infinite Curiosity`,
            "                   " + `Location:${profile.location}`,
            "",
        ];
        for (const line of lines) {
            this.println(line);
        }
    }

    // ==================== UTILIDADES ====================

    println(text, className = "") {
        const line = document.createElement("div");
        line.classList.add("terminal-line");
        if (className) line.classList.add(className);

        // Detecta se e uma linha de input (comando digitado)
        if (className === "input-line") {
            line.classList.add("terminal-input-echo");
        }

        // Preserva espacos com whitespace
        line.style.whiteSpace = "pre";
        line.textContent = text;
        this.outputArea.appendChild(line);
    }

    printAscii(text) {
        const pre = document.createElement("pre");
        pre.classList.add("terminal-ascii");
        pre.textContent = text;
        this.outputArea.appendChild(pre);
    }

    clear() {
        this.outputArea.innerHTML = "";
    }

    scrollToBottom() {
        this.outputArea.scrollTop = this.outputArea.scrollHeight;
    }
}
