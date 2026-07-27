// ============================================================
// APP.JS - Ponto de entrada principal
// Gera todo o DOM do portfolio via JavaScript
// ============================================================

import { profile, skills, projects, experience, education } from "./data.js";
import { Terminal } from "./terminal.js";

class Portfolio {
    constructor() {
        this.render();
    }

    render() {
        document.body.innerHTML = "";

        // Scroll progress bar
        this.buildScrollProgress();

        // Scroll to top button
        this.buildScrollTopBtn();

        // Navbar
        this.buildNavbar();

        // Hero Section
        this.buildHero();

        // Terminal Section (destaque principal)
        this.buildTerminalSection();

        // About Section
        this.buildAbout();

        // Skills Section
        this.buildSkills();

        // Projects Section
        this.buildProjects();

        // Experience Section
        if (experience.length > 0) this.buildExperience();

        // Education Section
        this.buildEducation();

        // Contact Section
        this.buildContact();

        // Footer
        this.buildFooter();

        // Inicializa todos os efeitos de scroll
        this.initScrollEffects();
    }

    // ==================== SCROLL PROGRESS BAR ====================
    buildScrollProgress() {
        const bar = document.createElement("div");
        bar.classList.add("scroll-progress");
        document.body.appendChild(bar);
    }

    // ==================== SCROLL TO TOP ====================
    buildScrollTopBtn() {
        const btn = document.createElement("button");
        btn.classList.add("scroll-top-btn");
        btn.innerHTML = "&#9650;";
        btn.setAttribute("aria-label", "Voltar ao topo");
        btn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        document.body.appendChild(btn);
    }

    // ==================== NAVBAR ====================
    buildNavbar() {
        const nav = this.el("nav", "navbar");
        nav.innerHTML = `
            <div class="nav-container">
                <a href="#hero" class="nav-logo">&lt;${profile.displayName}/&gt;</a>
                <div class="nav-links">
                    <a href="#about">Sobre</a>
                    <a href="#skills">Skills</a>
                    <a href="#projects">Projetos</a>
                    <a href="#contact">Contato</a>
                </div>
                <button class="nav-toggle" aria-label="Menu">
                    <span></span><span></span><span></span>
                </button>
            </div>
        `;
        document.body.appendChild(nav);

        // Mobile toggle
        const toggle = nav.querySelector(".nav-toggle");
        const links = nav.querySelector(".nav-links");
        toggle.addEventListener("click", () => {
            links.classList.toggle("active");
            toggle.classList.toggle("active");
        });

        // Close menu on link click
        links.querySelectorAll("a").forEach((a) => {
            a.addEventListener("click", () => {
                links.classList.remove("active");
                toggle.classList.remove("active");
            });
        });
    }

    // ==================== HERO ====================
    buildHero() {
        const section = this.el("section", "hero");
        section.id = "hero";

        // Container de particulas para efeito parallax
        const particles = document.createElement("div");
        particles.classList.add("hero-particles");
        for (let i = 0; i < 40; i++) {
            const p = document.createElement("div");
            p.classList.add("particle");
            p.style.left = Math.random() * 100 + "%";
            p.style.animationDelay = Math.random() * 6 + "s";
            p.style.animationDuration = (4 + Math.random() * 4) + "s";
            const size = 1 + Math.random() * 3;
            p.style.width = size + "px";
            p.style.height = size + "px";
            const colors = ["var(--accent-green)", "var(--accent-cyan)", "var(--accent-purple)", "var(--accent-yellow)"];
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            particles.appendChild(p);
        }
        section.appendChild(particles);

        section.innerHTML += `
            <div class="hero-content">
                <p class="hero-greeting">Ola, eu sou</p>
                <h1 class="hero-name">${profile.name}</h1>
                <h2 class="hero-role">${profile.role}</h2>
                <p class="hero-tagline">${profile.tagline}</p>
                <div class="hero-buttons">
                    <a href="#projects" class="btn btn-primary">Ver Projetos</a>
                    <a href="#contact" class="btn btn-outline">Contato</a>
                </div>
                <div class="hero-social">
                    <a href="${profile.github}" target="_blank" rel="noopener">GitHub</a>
                    <a href="mailto:${profile.email}">Email</a>
                </div>
            </div>
            <div class="hero-terminal-hint">
                <span class="typing-text">Try: "help" no terminal abaixo</span>
            </div>
        `;
        document.body.appendChild(section);
    }

    // ==================== TERMINAL ====================
    buildTerminalSection() {
        const section = this.el("section", "terminal-section");
        section.id = "terminal";

        const wrapper = this.el("div", "terminal-wrapper");
        wrapper.innerHTML = `<h2 class="section-title">&lt;Terminal/&gt;</h2>
            <p class="section-subtitle">Interaja com meu portfolio via comandos</p>`;
        const termContainer = this.el("div", "terminal-container");
        wrapper.appendChild(termContainer);
        section.appendChild(wrapper);
        document.body.appendChild(section);

        // Inicializa o terminal
        new Terminal(termContainer);
    }

    // ==================== ABOUT ====================
    buildAbout() {
        const section = this.el("section", "about");
        section.id = "about";
        section.innerHTML = `
            <div class="section-container">
                <h2 class="section-title">&lt;Sobre/&gt;</h2>
                <div class="about-grid">
                    <div class="about-text">
                        <p>${profile.bio}</p>
                        <div class="about-details">
                            <div class="about-item">
                                <span class="about-label">Nome:</span>
                                <span>${profile.name}</span>
                            </div>
                            <div class="about-item">
                                <span class="about-label">Localizacao:</span>
                                <span>${profile.location}</span>
                            </div>
                            <div class="about-item">
                                <span class="about-label">Cargo:</span>
                                <span>${profile.role}</span>
                            </div>
                        </div>
                    </div>
                    <div class="about-code">
                        <pre><code>${this.aboutCodeBlock()}</code></pre>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(section);
    }

    aboutCodeBlock() {
        return `class Developer {
  constructor() {
    this.name = "${profile.name}";
    this.role = "${profile.role}";
    this.location = "${profile.location}";
    this.passions = [
      "Clean Code",
      "Problem Solving",
      "Continuous Learning"
    ];
  }

  get stack() {
    return [...${JSON.stringify(skills.languages)}];
  }

  code() {
    return "Building the future, one line at a time";
  }
}

const me = new Developer();
console.log(me.code());`;
    }

    // ==================== SKILLS ====================
    buildSkills() {
        const section = this.el("section", "skills");
        section.id = "skills";

        const container = this.el("div", "section-container");
        container.innerHTML = `<h2 class="section-title">&lt;Skills/&gt;</h2>`;

        const grid = this.el("div", "skills-grid");

        const categories = [
            { title: "Linguagens", icon: "</>", items: skills.languages },
            { title: "Frameworks", icon: "{}", items: skills.frameworks },
            { title: "Ferramentas", icon: "[]", items: skills.tools },
            { title: "Conceitos", icon: "//", items: skills.concepts },
        ];

        for (const cat of categories) {
            const card = this.el("div", "skill-card");
            card.innerHTML = `
                <div class="skill-icon">${cat.icon}</div>
                <h3>${cat.title}</h3>
                <div class="skill-tags">
                    ${cat.items.map((s) => `<span class="skill-tag">${s}</span>`).join("")}
                </div>
            `;
            grid.appendChild(card);
        }

        container.appendChild(grid);
        section.appendChild(container);
        document.body.appendChild(section);
    }

// ==================== PROJECTS ====================
    buildProjects() {
        const section = this.el("section", "projects");
        section.id = "projects";

        const container = this.el("div", "section-container");
        
        // Banner criativo
        const banner = this.el("div", "projects-banner");
        banner.innerHTML = `
            <div class="banner-bg"></div>
            <div class="banner-content">
                <div class="banner-icon">🚀</div>
                <h2 class="section-title" style="color: var(--accent-green); margin: 0.5rem 0;"><Projetos/></h2>
                <p class="banner-tagline">Código que resolve problemas reais • Open source • Em produção</p>
                <div class="banner-stats">
                    <div class="stat-item">
                        <span class="stat-number">${projects.length}</span>
                        <span class="stat-label">Projetos</span>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                        <span class="stat-number">${[...new Set(projects.flatMap(p => p.tech))].length}</span>
                        <span class="stat-label">Tecnologias</span>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                        <span class="stat-number">${projects.filter(p => p.highlight).length}</span>
                        <span class="stat-label">Em Destaque</span>
                    </div>
                </div>
            </div>
            <div class="banner-decoration">
                <span class="decoration-line"></span>
                <span class="decoration-dots">● ● ●</span>
            </div>
        `;
        container.appendChild(banner);

        const grid = this.el("div", "projects-grid");

        for (const p of projects) {
            const card = this.el("div", `project-card${p.highlight ? " highlight" : ""}`);
            card.dataset.project = p.name;
            
            const techCount = p.tech.length;
            const descPreview = p.description.length > 100 
                ? p.description.substring(0, 100) + "..." 
                : p.description;

            card.innerHTML = `
                <div class="project-glow"></div>
                <div class="project-header">
                    <span class="project-folder">📁</span>
                    <div class="project-links">
                        <a href="${p.github}" target="_blank" rel="noopener" class="project-link github" data-tooltip="Ver no GitHub">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                
                <div class="project-stats">
                    <span class="stat"><span class="stat-value">${techCount}</span> techs</span>
                    <span class="stat">${p.highlight ? "⭐ Destaque" : "Projeto"}</span>
                </div>

                <h3 class="project-name">${p.name}</h3>
                <p class="project-desc">${descPreview}</p>
                
                <div class="project-tech">
                    ${p.tech.map((t) => `<span class="tech-tag">${t}</span>`).join("")}
                </div>

                <div class="project-footer">
                    <button class="expand-btn" data-project="${p.name}" aria-label="Ver detalhes">
                        <span>Ver detalhes</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <a href="${p.github}" target="_blank" rel="noopener" class="code-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Código
                    </a>
                </div>
            `;
            grid.appendChild(card);
        }

        container.appendChild(grid);
        section.appendChild(container);
        document.body.appendChild(section);

        // Modal de detalhes do projeto
        this.createProjectModal();
        this.bindProjectInteractions();
    }

    createProjectModal() {
        // Remove existing modal if any
        const existing = document.getElementById("project-modal");
        if (existing) existing.remove();

        const modal = document.createElement("div");
        modal.id = "project-modal";
        modal.className = "project-modal";
        modal.innerHTML = `
            <div class="modal-overlay" aria-hidden="true"></div>
            <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <button class="modal-close" aria-label="Fechar detalhes">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="modal-body">
                    <div class="modal-header">
                        <span class="modal-folder">📁</span>
                        <h2 id="modal-title" class="modal-title"></h2>
                        <div class="modal-badges"></div>
                    </div>
                    <div class="modal-divider"></div>
                    <p class="modal-description"></p>
                    <div class="modal-tech">
                        <h4>Stack Tecnológica</h4>
                        <div class="modal-tech-tags"></div>
                    </div>
                    <div class="modal-divider"></div>
                    <div class="modal-actions">
                        <a class="modal-github-btn" target="_blank" rel="noopener">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Ver código no GitHub
                        </a>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close handlers
        modal.querySelector(".modal-close").addEventListener("click", () => this.closeModal());
        modal.querySelector(".modal-overlay").addEventListener("click", () => this.closeModal());
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("open")) this.closeModal();
        });
    }

    bindProjectInteractions() {
        // Expand buttons
        document.querySelectorAll(".expand-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const projectName = btn.dataset.project;
                this.openModal(projectName);
            });
        });

        // Card click (anywhere but buttons)
        document.querySelectorAll(".project-card").forEach(card => {
            card.addEventListener("click", (e) => {
                if (!e.target.closest(".project-link") && !e.target.closest(".expand-btn") && !e.target.closest(".code-btn")) {
                    const projectName = card.dataset.project;
                    this.openModal(projectName);
                }
            });
        });
    }

    openModal(projectName) {
        const project = projects.find(p => p.name === projectName);
        if (!project) return;

        const modal = document.getElementById("project-modal");
        modal.querySelector(".modal-title").textContent = project.name;
        modal.querySelector(".modal-description").textContent = project.description;
        modal.querySelector(".modal-github-btn").href = project.github;

        // Badges
        const badges = modal.querySelector(".modal-badges");
        badges.innerHTML = `
            ${project.highlight ? '<span class="badge highlight">⭐ Projeto em Destaque</span>' : ''}
            <span class="badge tech-count">${project.tech.length} tecnologias</span>
        `;

        // Tech tags
        const techTags = modal.querySelector(".modal-tech-tags");
        techTags.innerHTML = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join("");

        modal.classList.add("open");
        document.body.style.overflow = "hidden";
        
        // Focus trap
        setTimeout(() => modal.querySelector(".modal-close").focus(), 100);
    }

    closeModal() {
        const modal = document.getElementById("project-modal");
        modal.classList.remove("open");
        document.body.style.overflow = "";
    }

    // ==================== EXPERIENCE ====================
    buildExperience() {
        const section = this.el("section", "experience");
        section.id = "experience";

        const container = this.el("div", "section-container");
        container.innerHTML = `<h2 class="section-title">&lt;Experiencia/&gt;</h2>`;

        const timeline = this.el("div", "timeline");

        for (const e of experience) {
            const item = this.el("div", "timeline-item");
            item.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <span class="timeline-period">${e.period}</span>
                    <h3>${e.role}</h3>
                    <h4>${e.company}</h4>
                    <p>${e.description}</p>
                </div>
            `;
            timeline.appendChild(item);
        }

        container.appendChild(timeline);
        section.appendChild(container);
        document.body.appendChild(section);
    }

    // ==================== EDUCATION ====================
    buildEducation() {
        const section = this.el("section", "education");
        section.id = "education";

        const container = this.el("div", "section-container");
        container.innerHTML = `<h2 class="section-title">&lt;Formacao/&gt;</h2>`;

        const grid = this.el("div", "education-grid");

        for (const e of education) {
            const card = this.el("div", "education-card");
            card.innerHTML = `
                <div class="edu-icon">🎓</div>
                <h3>${e.course}</h3>
                <h4>${e.institution}</h4>
                <p>${e.period}</p>
            `;
            grid.appendChild(card);
        }

        container.appendChild(grid);
        section.appendChild(container);
        document.body.appendChild(section);
    }

    // ==================== CONTACT ====================
    buildContact() {
        const section = this.el("section", "contact");
        section.id = "contact";

        const container = this.el("div", "section-container");
        container.innerHTML = `
            <h2 class="section-title">&lt;Contato/&gt;</h2>
            <p class="section-subtitle">Vamos conversar!</p>
            <div class="contact-grid">
                <a href="mailto:${profile.email}" class="contact-card">
                    <div class="contact-icon">✉</div>
                    <h3>Email</h3>
                    <p>${profile.email}</p>
                </a>
                <a href="${profile.github}" target="_blank" rel="noopener" class="contact-card">
                    <div class="contact-icon">⌨</div>
                    <h3>GitHub</h3>
                    <p>${profile.github.replace("https://github.com/", "")}</p>
                </a>
            </div>
        `;
        section.appendChild(container);
        document.body.appendChild(section);
    }

    // ==================== FOOTER ====================
    buildFooter() {
        const footer = this.el("footer", "footer");
        footer.innerHTML = `
            <div class="footer-content">
                <p>&lt;/&gt; Desenvolvido por <strong>${profile.name}</strong> | ${new Date().getFullYear()}</p>
                <p class="footer-sub">Feito com JavaScript puro e muito cafe</p>
            </div>
        `;
        document.body.appendChild(footer);
    }

    // ==================== SCROLL EFFECTS ====================
    initScrollEffects() {
        // Smooth scroll para links - compensa navbar fixo
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", function (e) {
                e.preventDefault();
                const targetId = this.getAttribute("href");
                const target = document.querySelector(targetId);
                if (target) {
                    const navbar = document.querySelector(".navbar");
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                    });
                }
            });
        });

        // Scroll progress bar + scroll to top button
        const progressBar = document.querySelector(".scroll-progress");
        const scrollTopBtn = document.querySelector(".scroll-top-btn");

        window.addEventListener("scroll", () => {
            // Progress bar
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + "%";

            // Scroll to top button
            if (scrollTop > 400) {
                scrollTopBtn.classList.add("visible");
            } else {
                scrollTopBtn.classList.remove("visible");
            }

            // Parallax no hero
            const heroContent = document.querySelector(".hero-content");
            if (heroContent && scrollTop < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrollTop * 0.3}px)`;
                heroContent.style.opacity = 1 - scrollTop / (window.innerHeight * 0.8);
            }
        });

        // Scroll reveal com direcoes alternadas
        this.initScrollReveal();
    }

    initScrollReveal() {
        // Titulos entram de cima
        const titles = document.querySelectorAll(".section-title, .section-subtitle");
        titles.forEach((el) => {
            el.classList.add("reveal-up");
        });

        // About: texto esquerda, codigo direita
        const aboutText = document.querySelector(".about-text");
        const aboutCode = document.querySelector(".about-code");
        if (aboutText) aboutText.classList.add("reveal-left");
        if (aboutCode) aboutCode.classList.add("reveal-right");

        // Skills cards: escala com stagger
        document.querySelectorAll(".skill-card").forEach((card, i) => {
            card.classList.add("reveal-scale", `stagger-${(i % 4) + 1}`);
        });

        // Education cards: escala
        document.querySelectorAll(".education-card").forEach((card, i) => {
            card.classList.add("reveal-scale", `stagger-${(i % 4) + 1}`);
        });

        // Contact cards: alternado esquerda/direita
        document.querySelectorAll(".contact-card").forEach((card, i) => {
            card.classList.add(i % 2 === 0 ? "reveal-left" : "reveal-right");
        });

        // Terminal: escala
        const terminal = document.querySelector(".terminal");
        if (terminal) terminal.classList.add("reveal-scale");

        // Observer para ativar as animacoes
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        document.querySelectorAll(".reveal-left, .reveal-right, .reveal-up, .reveal-scale").forEach((el) => {
            observer.observe(el);
        });

        // Fallback: revela elementos já visíveis no carregamento
        setTimeout(() => {
            document.querySelectorAll(".reveal-left, .reveal-right, .reveal-up, .reveal-scale").forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add("active");
                }
            });
        }, 100);
    }

    // ==================== UTILITIES ====================
    el(tag, className = "") {
        const element = document.createElement(tag);
        if (className) {
            className.split(" ").filter(Boolean).forEach(c => element.classList.add(c));
        }
        return element;
    }
}

// Inicia o portfolio quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    new Portfolio();
});
