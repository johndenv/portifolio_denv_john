// ============================================================
// LOAN CALCULATOR - Calculo de juros compostos diarios
// Port JS do model Loan do Django
// ============================================================

export class Loan {
    constructor(valueLoan, interestMonth) {
        this._valueLoan = parseFloat(valueLoan);
        this._interestMonth = parseFloat(interestMonth);
    }

    get valueLoan() {
        return this._valueLoan;
    }

    get interestMonth() {
        return this._interestMonth;
    }

    // Calcula a taxa diaria a partir da mensal
    // Formula: (1 + taxa_mensal)^(1/30) - 1
    get dailyRate() {
        return Math.pow(1 + this._interestMonth, 1 / 30) - 1;
    }

    // Taxa diaria formatada como porcentagem (4 casas decimais)
    get percentageInterestRate() {
        return (this.dailyRate * 100).toFixed(4) + "%";
    }

    // Juro diario em reais
    get jurosDiarioReais() {
        return this._valueLoan * this.dailyRate;
    }

    // Calcula o montante apos N dias
    montante(days) {
        return this._valueLoan * Math.pow(1 + this.dailyRate, days);
    }

    // Calcula o total de juros apos N dias
    totalJuros(days) {
        return this.montante(days) - this._valueLoan;
    }

    // Gerencia uma tabela de amortizacao completa
    amortizationTable(days) {
        const table = [];
        let saldoDevedor = this._valueLoan;

        for (let d = 1; d <= days; d++) {
            const jurosDia = saldoDevedor * this.dailyRate;
            saldoDevedor += jurosDia;

            table.push({
                dia: d,
                juros: jurosDia,
                saldoAcumulado: saldoDevedor,
            });
        }

        return table;
    }

    // Formata valor em BRL
    static formatBRL(value) {
        return "R$ " + value.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Formata a saida completa do calculo
    formatOutput() {
        const lines = [];
        lines.push("╔══════════════════════════════════════════════════╗");
        lines.push("║       CALCULO DE JUROS COMPOSTOS DIARIOS       ║");
        lines.push("╠══════════════════════════════════════════════════╣");
        lines.push(`║  Valor do Emprestimo:  ${Loan.formatBRL(this._valueLoan).padStart(20)}  ║`);
        lines.push(`║  Taxa Mensal:          ${(this._interestMonth * 100).toFixed(2).padStart(19)}%  ║`);
        lines.push("╠══════════════════════════════════════════════════╣");
        lines.push(`║  Taxa Diaria:          ${this.percentageInterestRate.padStart(20)}  ║`);
        lines.push(`║  Juro Diario (R$):     ${Loan.formatBRL(this.jurosDiarioReais).padStart(20)}  ║`);
        lines.push("╠══════════════════════════════════════════════════╣");

        // Projecoes para 30, 60, 90, 180, 360 dias
        const periods = [30, 60, 90, 180, 360];
        lines.push("║  PROJECAO POR PERIODO:                          ║");
        lines.push("║  ─────────────────────────────────────────────── ║");

        for (const days of periods) {
            const mont = this.montante(days);
            const juros = this.totalJuros(days);
            lines.push(`║  ${String(days).padStart(3)} dias -> Mont: ${Loan.formatBRL(mont).padStart(14)} | Juros: ${Loan.formatBRL(juros).padStart(14)} ║`);
        }

        lines.push("╚══════════════════════════════════════════════════╝");
        return lines.join("\n");
    }

    // Tabela de amortizacao formatada
    formatAmortizationTable(days) {
        const table = this.amortizationTable(days);
        const lines = [];
        lines.push("╔═══════════════════════════════════════════════════════════╗");
        lines.push("║               TABELA DE AMORTIZACAO                      ║");
        lines.push("╠═════╦══════════════════╦══════════════════════════════════╣");
        lines.push("║ Dia ║    Juros (R$)    ║       Saldo Acumulado           ║");
        lines.push("╠═════╬══════════════════╬══════════════════════════════════╣");

        for (const row of table) {
            lines.push(`║ ${String(row.dia).padStart(3)} ║ ${Loan.formatBRL(row.juros).padStart(16)} ║ ${Loan.formatBRL(row.saldoAcumulado).padStart(32)} ║`);
        }

        lines.push("╚═════╩══════════════════╩══════════════════════════════════╝");
        return lines.join("\n");
    }
}

// Funcao auxiliar para processar comando de emprestimo no terminal
export function parseLoanCommand(args) {
    if (args.length < 2) {
        return [
            "",
            "  ╔══════════════════════════════════════════════════════════════╗",
            "  ║            COMANDO LOAN - Calculo de Emprestimos            ║",
            "  ╠═══════════════════════════════════════════════════════════════╣",
            "  ║                                                            ║",
            "  ║  COMO USAR:                                                ║",
            "  ║  ──────────────────────────────────────────────────────    ║",
            "  ║                                                            ║",
            "  ║    loan \"valor\" \"taxa\"                                      ║",
            "  ║                                                            ║",
            "  ║    Onde:                                                   ║",
            "  ║      \"valor\"  = Valor do emprestimo em R$                 ║",
            "  ║      \"taxa\"   = Taxa de juros ao mes                      ║",
            "  ║                                                            ║",
            "  ║  TAXA (aceita os dois formatos):                           ║",
            "  ║    Porcentagem:  30   -> 30% ao mes   (divide por 100)    ║",
            "  ║    Decimal:      0.30 -> 30% ao mes   (ja e decimal)      ║",
            "  ║    Porcentagem:  1.5  -> 1.5% ao mes                      ║",
            "  ║    Decimal:      0.015-> 1.5% ao mes                      ║",
            "  ║                                                            ║",
            "  ║  EXEMPLOS:                                                 ║",
            "  ║  ──────────────────────────────────────────────────────    ║",
            "  ║                                                            ║",
            "  ║    loan \"30\" \"30\"                                          ║",
            "  ║      -> R$ 30 com 30% ao mes = R$ 39,00 em 30 dias       ║",
            "  ║                                                            ║",
            "  ║    loan \"1000\" \"2\"                                         ║",
            "  ║      -> R$ 1.000 com 2% ao mes = R$ 1.061,00 em 30 dias  ║",
            "  ║                                                            ║",
            "  ║    loan \"5000\" \"1.5\"                                       ║",
            "  ║      -> R$ 5.000 com 1.5% ao mes = R$ 5.230,00 em 30d    ║",
            "  ║                                                            ║",
            "  ║    loan \"30\" \"30\" table \"30\"                                ║",
            "  ║      -> Tabela dia a dia de 30 dias                       ║",
            "  ║                                                            ║",
            "  ╚═══════════════════════════════════════════════════════════════╝",
            "",
        ];
    }

    const value = parseFloat(args[0]);
    let rate = parseFloat(args[1]);

    if (isNaN(value) || isNaN(rate)) {
        return [
            "",
            "  Erro: Os valores informados nao sao numeros validos.",
            "",
            "  Voce digitou:",
            `    Valor: "${args[0]}"`,
            `    Taxa:  "${args[1]}"`,
            "",
            '  Formato correto: loan "valor" "taxa"',
            '  Exemplos:',
            '    loan "30" "30"      -> R$ 30 com 30% ao mes (taxa como porcentagem)',
            '    loan "1000" "0.02"  -> R$ 1.000 com 2% ao mes (taxa como decimal)',
            '    loan "5000" "1.5"   -> R$ 5.000 com 1.5% ao mes',
            "",
            "  Nota: A taxa aceita tanto porcentagem (30) quanto decimal (0.30).",
            "        Se for > 1, assume porcentagem e divide por 100.",
            "",
        ];
    }

    // Auto-detectar: se taxa > 1, assume que é porcentagem (ex: 30 = 30% = 0.30)
    if (rate > 1) {
        rate = rate / 100;
    }

    if (value <= 0 || rate <= 0) {
        return [
            "",
            "  Erro: Valor e taxa devem ser maiores que zero.",
            "",
            "  Voce digitou:",
            `    Valor: ${value}`,
            `    Taxa:  ${rate * 100}% ao mes`,
            "",
            "  Tente novamente com valores positivos:",
            '    loan "30" "30"',
            "",
        ];
    }

    if (value > 10000000) {
        return [
            "",
            "  Erro: O valor maximo para simulacao e R$ 10.000.000,00.",
            "",
            `  Voce digitou: R$ ${value.toLocaleString("pt-BR")}`,
            "",
            "  Tente com um valor menor.",
            "",
        ];
    }

    if (rate > 1) {
        return [
            "",
            "  Erro: A taxa informada parece estar incorreta.",
            "",
            `  Voce digitou: ${(rate * 100).toFixed(1)}% ao mes`,
            "",
            "  Taxas mensais geralmente estao entre 0.1% e 100%.",
            "  Exemplos: 30 (30%), 2 (2%), 0.5 (0.5%), 0.015 (1.5%)",
            "",
        ];
    }

    const loan = new Loan(value, rate);

    // Verifica se tem subcomando "table"
    if (args[2] === "table") {
        const days = parseInt(args[3]) || 30;
        if (isNaN(days) || days <= 0 || days > 365) {
            return [
                "",
                "  Erro: O numero de dias deve ser entre 1 e 365.",
                "",
                '  Formato correto: loan "valor" "taxa" table "dias"',
                "",
                "  Exemplos:",
                '    loan "30" "0.015" table "30"    -> Tabela de 30 dias',
                '    loan "1000" "0.02" table "90"   -> Tabela de 90 dias',
                '    loan "5000" "0.015" table "365" -> Tabela de 1 ano',
                "",
            ];
        }
        return loan.formatAmortizationTable(days).split("\n");
    }

    // Verifica se tem argumento invalido apos os dois primeiros
    if (args.length > 2 && args[2] !== "table") {
        return [
            "",
            `  Erro: Subcomando "${args[2]}" nao reconhecido.`,
            "",
            "  Subcomandos disponiveis:",
            '    loan "valor" "taxa"           -> Calculo com projecoes',
            '    loan "valor" "taxa" table     -> Tabela de amortizacao',
            "",
            "  Para tabela com periodo especifico:",
            '    loan "valor" "taxa" table "dias"',
            "",
        ];
    }

    return loan.formatOutput().split("\n");
}
