# Portfolio - John Everton

Portfolio pessoal interativo construido com Django e JavaScript puro. A ideia principal era criar algo diferente do convencional: em vez de uma pagina estatica com cards, eu criei um **terminal interativo** onde o visitante pode navegar pelo meu perfil usando comandos reais de sistema.

## Funcionalidades

### Terminal Interativo
O destaque do portfolio. Um emulador de terminal no navegador com:

- **Comandos de navegacao**: `about`, `skills`, `projects`, `education`, `contact`
- **Historico de comandos**: seta ↑/↓ navega pelos comandos anteriores
- **Autocomplete**: Tab completa comandos parciais
- **Sugestao por proximidade**: se errar um comando, sugere o mais proximo (distancia de Levenshtein)
- **Comandos de sistema**: `whoami`, `ls`, `cat`, `neofetch`, `pwd`, `date`, `echo`
- **Calculadora de emprestimos**: `loan` com juros compostos diarios e tabela de amortizacao

### Calculadora de Emprestimos (`loan`)
Implementada em JavaScript espelhando o model `Loan` do Django:

- Converte taxa mensal para diaria: `(1 + taxa)^(1/30) - 1`
- Gera projecoes por periodo (7, 15, 30, 60, 90, 180, 360 dias)
- Tabela de amortizacao dia a dia com `loan "valor" "taxa" table "dias"`
- Auto-deteccao de formato: `30` = 30%, `0.30` = 30%

### Interface
- Navbar fixa com links suaves entre secoes
- Scroll progress bar
- Botao voltar ao topo
- Cards de projetos com hover effects e modal de detalhes
- Banner criativo com stats (projetos, tecnologias, destaque)
- Animacoes de entrada por scroll (reveal-left, reveal-right, reveal-scale)
- Totalmente responsivo (mobile-first)
- Tema escuro com accent colors (cyan, green, purple)

## Stack Tecnica

| Camada     | Tecnologia          |
|------------|---------------------|
| Backend    | Django 6.0 (Python) |
| Frontend   | JavaScript ES6+ (puro, sem framework) |
| Linguagens | Python, JavaScript  |
| Banco      | PostgreSQL          |
| Templates  | Django Templates    |
| Estilo     | CSS puro (variaveis CSS, Grid, Flexbox) |

## Como Rodar

```bash
# 1. Clonar o repositorio
git clone https://github.com/johndenv/portifolio_denv_john.git
cd portifolio_denv_john

# 2. Criar e ativar ambiente virtual
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate    # Linux/Mac

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Configurar PostgreSQL
#    Crie o banco de dados no PostgreSQL:
#    CREATE DATABASE postgres;

# 5. Criar arquivo .env (copie do .env.example)
#    Defina as variaveis de ambiente

# 6. Rodar migracoes
python manage.py migrate

# 7. Rodar o servidor
python manage.py runserver
```

> No Windows, tambem pode usar o `start.bat` duplo-clique para iniciar direto.

## Estrutura do Projeto

```
portifolio_denv_john/
├── manage.py                  # CLI do Django
├── requirements.txt           # Dependencias do projeto
├── Procfile                   # Configuracao para Heroku
├── runtime.txt                # Versao do Python
├── .env                       # Variaveis de ambiente (nao vai pro Git)
├── .gitignore                 # Arquivos ignorados pelo Git
├── start.bat                  # Atalho para iniciar servidor (Windows)
│
├── portifolio/                # Configuracao do projeto Django
│   ├── settings.py            # Configuracoes (DEBUG, STATIC, TEMPLATES)
│   ├── urls.py                # Roteamento principal
│   └── wsgi.py                # Ponto de entrada WSGI
│
├── core/                      # App principal
│   ├── views.py               # View home (renderiza index.html)
│   └── ...
│
├── templates/
│   └── index.html             # Template unico (SPA via JS)
│
├── static/
│   ├── css/
│   │   └── styles.css         # Estilos completos (~1700 linhas)
│   └── js/
│       ├── app.js             # Entry point - classe Portfolio (gera todo o DOM)
│       ├── data.js            # Dados do portfolio (profile, skills, projects, etc)
│       ├── terminal.js        # Emulador de terminal interativo
│       └── loan.js            # Calculadora de emprestimos (juros compostos)
│
└── db.sqlite3                 # Banco de dados SQLite (legado)
```

## Arquitetura do Frontend

O frontend e todo construido via JavaScript. O `index.html` e praticamente vazio - todo o DOM e gerado pela classe `Portfolio` em `app.js`.

### Como funciona a renderizacao

```
DOMContentLoaded
    └── new Portfolio()
         ├── render()              # Monta todo o DOM
         │   ├── buildNavbar()     # Navegacao fixa
         │   ├── buildHero()       # Secao principal com titulo
         │   ├── buildTerminalSection()  # Terminal interativo
         │   ├── buildAbout()      # Sobre mim
         │   ├── buildSkills()     # Habilidades tecnicas
         │   ├── buildProjects()   # Projetos + modal
         │   ├── buildEducation()  # Formacao academica
         │   ├── buildContact()    # Contato
         │   └── buildFooter()     # Rodape
         │
         └── initScrollEffects()   # Scroll reveal, progress bar, parallax
```

### Modulos JS

- **`app.js`** - Classe principal `Portfolio`.Responsavel por criar todo o DOM dinamicamente e inicializar os efeitos de scroll. Usa o helper `el(tag, className)` para criar elementos.

- **`terminal.js`** - Classe `Terminal`. Emulador completo com input, output, historico, autocomplete, e mais de 15 comandos. Cada comando e um metodo `cmd*()` separado.

- **`loan.js`** - Classe `Loan`. Port da logica de calculo de emprestimos do model Django para JavaScript. Calcula taxa diaria, projecoes por periodo, e gera tabelas de amortizacao.

- **`data.js`** - Arquivo de dados. Todas as informacoes do portfolio ficam aqui (profile, skills, projects, education, terminalConfig). Para customizar, e so editar este arquivo.

## Como Customizar

Para atualizar as informacoes do portfolio, edite o arquivo **`static/js/data.js`**:

- **Perfil**: nome, cargo, email, telefone, GitHub
- **Skills**: linguagens, frameworks, ferramentas, conceitos
- **Projetos**: nome, descricao, tech stack, link GitHub, destaque
- **Educacao**: curso, instituicao, periodo
- **Terminal**: ASCII art, mensagem de boas-vindas

## Hospedagem

### Heroku
1. Crie um repositorio no Heroku
2. Conecte ao GitHub
3. Defina as variaveis de ambiente no painel do Heroku:
   - `DATABASE_URL`: URL do PostgreSQL (Heroku adiciona automaticamente)
   - `SECRET_KEY`: Chave secreta aleatoria
   - `DEBUG`: False
   - `ALLOWED_HOSTS`: seu-app.herokuapp.com
4. Faça deploy

### Outras Plataformas
O projeto e compativel com qualquer plataforma que suporte Django:
- Railway
- Render
- DigitalOcean
- AWS Elastic Beanstalk

Apenas configure as variaveis de ambiente e o PostgreSQL.

## Comandos do Terminal

| Comando | Descricao |
|---------|-----------|
| `help` | Lista todos os comandos disponiveis |
| `about` | Informacoes pessoais e bio |
| `skills` | Habilidades tecnicas agrupadas por categoria |
| `projects` | Lista de projetos com links |
| `education` | Formacao academica |
| `contact` | Email, telefone e GitHub |
| `loan "valor" "taxa"` | Calcula juros compostos |
| `loan "valor" "taxa" table "dias"` | Tabela de amortizacao |
| `whoami` | Mostra o usuario atual |
| `ls` | Lista arquivos do portfolio |
| `cat <arquivo>` | Le um arquivo (about.md, skills.json, etc) |
| `neofetch` | Info do sistema em estilo neofetch |
| `history` | Historico de comandos |
| `clear` | Limpa o terminal |
| `banner` | Exibe a ASCII art |
| `date` | Data e hora atual |
| `pwd` | Diretorio atual |
| `echo <texto>` | Repete o texto |

## Autor

**John Everton Marques Dos Santos**
- GitHub: [johndenv](https://github.com/johndenv)
- Email: evertonjohn097@gmail.com
- Localizacao: Sao Joao do Paraiso - MG, Brasil
