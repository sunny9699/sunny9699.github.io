/**
 * Sunny Panchal — Portfolio Scripts
 * Handles theme switching (system/light/dark), native <dialog> modals & drawer,
 * accessible tablists, FAQ smooth accordion + expand-all, Cmd+K palette,
 * copy utilities, and accessible form validation.
 */


const EMAIL_ADDRESS = 'panchalsunny785@gmail.com';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDialogLightDismissFallback();
  initNavbarAndDrawer();
  initRoleRotator();
  initLiveClock();
  initCopyHandlers();
  initProjectFilters();
  initBlueprintTabs();
  initPatternTabs();
  initMatrixFilter();
  initFaqAccordion();
  initProjectModal();
  initArticleModal();
  initCommandPalette();
  initContactForm();
  initScrollReveals();
});

/* ==========================================================================
   1. Theme Switching (System Default + 2-State Override + Cross-Tab Sync)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const metaScheme = document.querySelector('meta[name="color-scheme"]');
  const darkMedia = window.matchMedia('(prefers-color-scheme: dark)');

  function getStoredScheme() {
    try {
      const val = localStorage.getItem('color-scheme');
      return val === 'light' || val === 'dark' ? val : null;
    } catch {
      return null;
    }
  }

  function getEffectiveScheme() {
    return getStoredScheme() ?? (darkMedia.matches ? 'dark' : 'light');
  }

  function applyMetaAndLabel() {
    const stored = getStoredScheme();
    const effective = getEffectiveScheme();
    if (metaScheme) {
      metaScheme.content = stored ?? 'light dark';
    }
    if (themeToggle) {
      const nextTheme = effective === 'dark' ? 'light' : 'dark';
      const label = `Switch to ${nextTheme} theme`;
      themeToggle.setAttribute('aria-label', label);
      themeToggle.setAttribute('title', label);
    }
  }

  function toggleTheme() {
    const current = getEffectiveScheme();
    const target = current === 'dark' ? 'light' : 'dark';
    const osScheme = darkMedia.matches ? 'dark' : 'light';

    try {
      if (target === osScheme) {
        localStorage.removeItem('color-scheme');
      } else {
        localStorage.setItem('color-scheme', target);
      }
    } catch {
      // Storage unavailable; still apply in memory via meta
      if (metaScheme) metaScheme.content = target;
    }

    applyMetaAndLabel();
    showToast(`Switched to ${target} theme`);
  }

  applyMetaAndLabel();

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  darkMedia.addEventListener('change', () => {
    applyMetaAndLabel();
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'color-scheme') {
      applyMetaAndLabel();
    }
  });

  window.__toggleSiteTheme = toggleTheme;
}

/* ==========================================================================
   2. Native <dialog closedby="any"> Fallback for Browsers Missing Support
   ========================================================================== */
function initDialogLightDismissFallback() {
  if ('closedBy' in HTMLDialogElement.prototype) return;

  const isOutsideDialog = (e, dialog) => {
    const r = dialog.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  };

  document.querySelectorAll('dialog[closedby="any"]').forEach((dialog) => {
    let pressedOutside = false;
    dialog.addEventListener('pointerdown', (e) => {
      pressedOutside = isOutsideDialog(e, dialog);
    });
    dialog.addEventListener('pointerup', (e) => {
      if (pressedOutside && isOutsideDialog(e, dialog)) {
        dialog.close();
      }
      pressedOutside = false;
    });
  });
}

/* ==========================================================================
   3. Navbar Scroll Spy & Native Mobile Drawer
   ========================================================================== */
function initNavbarAndDrawer() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('navHamburger');
  const drawer = document.getElementById('mobileNavDialog');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const navLinks = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const sections = document.querySelectorAll('main section[id]');

  function updateScrollState() {
    const scrollY = window.scrollY;
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 24);
    }

    let currentId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 130;
      if (scrollY >= top && scrollY < top + sec.offsetHeight) {
        currentId = sec.id;
      }
    });

    const syncLinks = (links) => {
      links.forEach((link) => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    syncLinks(navLinks);
    syncLinks(drawerLinks);
  }

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      drawer.showModal();
      hamburger.setAttribute('aria-expanded', 'true');
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', () => drawer.close());
    }

    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => drawer.close());
    });

    drawer.addEventListener('close', () => {
      hamburger.setAttribute('aria-expanded', 'false');
    });
  }
}

/* ==========================================================================
   4. Dynamic Role Rotator & Live IST Clock
   ========================================================================== */
function initRoleRotator() {
  const roleEl = document.getElementById('roleRotator');
  if (!roleEl) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const roles = [
    'Scalable Backend Systems',
    'REST & GraphQL APIs',
    'AWS Serverless Pipelines',
    'High-Speed PostgreSQL & Redis'
  ];

  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % roles.length;
    if (prefersReduced) {
      roleEl.textContent = roles[idx];
      return;
    }
    roleEl.style.opacity = '0';
    roleEl.style.transform = 'translateY(5px)';
    setTimeout(() => {
      roleEl.textContent = roles[idx];
      roleEl.style.opacity = '1';
      roleEl.style.transform = 'translateY(0)';
    }, 210);
  }, 3400);
}

function initLiveClock() {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  function updateClock() {
    try {
      clockEl.textContent = `${formatter.format(new Date())} IST (UTC+5:30)`;
    } catch {
      clockEl.textContent = 'IST (UTC+5:30)';
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   5. Clipboard Helpers (Email + Code Snippets)
   ========================================================================== */
async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.setAttribute('readonly', '');
    temp.style.position = 'fixed';
    temp.style.opacity = '0';
    document.body.appendChild(temp);
    temp.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(temp);
    return ok;
  }
}

function initCopyHandlers() {
  document.querySelectorAll('.copy-email-trigger').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await copyTextToClipboard(EMAIL_ADDRESS);
      const label = btn.querySelector('.copy-text');
      if (label) {
        const orig = label.textContent;
        label.textContent = 'Copied!';
        setTimeout(() => {
          label.textContent = orig;
        }, 1800);
      }
      showToast(`Copied ${EMAIL_ADDRESS}`);
    });
  });

  document.querySelectorAll('.btn-copy-code').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetId = btn.dataset.copyTarget;
      const codeEl = targetId ? document.getElementById(targetId) : null;
      if (!codeEl) return;
      await copyTextToClipboard(codeEl.textContent);
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      showToast('Code snippet copied to clipboard');
      setTimeout(() => {
        btn.textContent = orig;
      }, 1800);
    });
  });
}

/* ==========================================================================
   6. Reusable WAI-ARIA Tablist Helper
   ========================================================================== */
function setupAccessibleTabs(tablistSelector, onActivate) {
  const tablist = document.querySelector(tablistSelector);
  if (!tablist) return;

  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  if (!tabs.length) return;

  function activateTab(selectedTab, shouldFocus = false) {
    tabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
    });

    selectedTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (shouldFocus) selectedTab.focus();
    onActivate(selectedTab);
  }

  tabs.forEach((tab, idx) => {
    tab.setAttribute('tabindex', tab.getAttribute('aria-selected') === 'true' ? '0' : '-1');
    tab.addEventListener('click', () => activateTab(tab, false));
    tab.addEventListener('keydown', (e) => {
      let nextIdx = null;
      if (e.key === 'ArrowRight') nextIdx = (idx + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') nextIdx = 0;
      else if (e.key === 'End') nextIdx = tabs.length - 1;

      if (nextIdx !== null) {
        e.preventDefault();
        activateTab(tabs[nextIdx], true);
      }
    });
  });
}

function initProjectFilters() {
  const cards = document.querySelectorAll('.project-card');
  setupAccessibleTabs('.project-filters', (tab) => {
    const filter = tab.dataset.filter || 'all';
    cards.forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('filtered-out', !match);
    });
  });
}

function initBlueprintTabs() {
  const panels = document.querySelectorAll('.blueprint-panel');
  setupAccessibleTabs('.blueprint-tabs', (tab) => {
    const targetId = `bp-${tab.dataset.blueprint}`;
    panels.forEach((panel) => {
      const active = panel.id === targetId;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
      if (active) panel.setAttribute('tabindex', '0');
      else panel.removeAttribute('tabindex');
    });
  });
}

function initPatternTabs() {
  const panels = document.querySelectorAll('.code-panel');
  setupAccessibleTabs('.pattern-tabs', (tab) => {
    const targetId = `pat-${tab.dataset.pattern}`;
    panels.forEach((panel) => {
      const active = panel.id === targetId;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
      if (active) panel.setAttribute('tabindex', '0');
      else panel.removeAttribute('tabindex');
    });
  });
}

/* ==========================================================================
   7. Trade-offs Matrix Category Filter
   ========================================================================== */
function initMatrixFilter() {
  const buttons = document.querySelectorAll('.matrix-tab-btn');
  const rows = document.querySelectorAll('.matrix-table tbody tr');
  if (!buttons.length || !rows.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.matrixCat || 'all';
      rows.forEach((row) => {
        row.style.display = cat === 'all' || row.dataset.cat === cat ? '' : 'none';
      });
    });
  });
}

/* ==========================================================================
   8. Smooth FAQ Accordion & Expand All / Collapse All
   ========================================================================== */
function initFaqAccordion() {
  const items = Array.from(document.querySelectorAll('.faq-item'));
  const toggleAllBtn = document.getElementById('faqToggleAllBtn');
  if (!items.length) return;

  function setItemState(item, open) {
    item.classList.toggle('active', open);
    const btn = item.querySelector('.faq-question');
    if (btn) btn.setAttribute('aria-expanded', String(open));
  }

  function syncToggleAllButton() {
    if (!toggleAllBtn) return;
    const allOpen = items.every((item) => item.classList.contains('active'));
    toggleAllBtn.setAttribute('aria-expanded', String(allOpen));
  }

  items.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const nextOpen = !item.classList.contains('active');
      setItemState(item, nextOpen);
      syncToggleAllButton();
    });
  });

  if (toggleAllBtn) {
    toggleAllBtn.addEventListener('click', () => {
      const expand = toggleAllBtn.getAttribute('aria-expanded') !== 'true';
      items.forEach((item) => setItemState(item, expand));
      syncToggleAllButton();
    });
  }
}

/* ==========================================================================
   9. Project Modal (<dialog>)
   ========================================================================== */
const projectData = {
  collabcrm: {
    kicker: 'Enterprise · Serverless',
    title: 'CollabCRM',
    subtitle: 'Customer Relationship Management & Real-Time Collaboration Platform',
    sections: [
      {
        heading: 'Overview',
        content: 'Built serverless backend functionality supporting core CRM operations across employee workflows, project management, sales pipelines, and recruitment processes.'
      },
      {
        heading: 'Key Architecture & Implementation',
        bullets: [
          'Implemented Kanban-style project tracking and live notifications using <strong>AWS API Gateway WebSocket</strong>.',
          'Built event-driven serverless endpoints with <strong>AWS Lambda</strong> and <strong>Serverless Framework</strong>.',
          'Managed transactional relational CRM data using <strong>PostgreSQL and Sequelize ORM</strong>, paired with <strong>DynamoDB</strong> for connection state and fast lookups.'
        ]
      },
      {
        heading: 'Technology Stack',
        tech: ['Node.js', 'React.js', 'PostgreSQL', 'Sequelize', 'DynamoDB', 'AWS Lambda', 'API Gateway WebSocket', 'Serverless Framework']
      }
    ]
  },
  loanorigination: {
    kicker: 'Fintech · Compliance',
    title: 'Loan Origination System',
    subtitle: 'Automated Underwriting & Credit Assessment Platform',
    sections: [
      {
        heading: 'Overview',
        content: 'Developed end-to-end loan-origination backend workflows in Node.js integrating external borrower verification, eligibility checks, income assessment, and dynamic loan-offer generation.'
      },
      {
        heading: 'Key Architecture & Implementation',
        bullets: [
          'Integrated a third-party <strong>credit-score API</strong> into Node.js underwriting pipelines with structured validation and error handling.',
          'Secured loan application documents and compliance audit logs in <strong>AWS S3 using server-side encryption (SSE)</strong>.',
          'Persisted financial borrower data and loan-offer records in <strong>PostgreSQL on Amazon RDS</strong> orchestrated alongside AWS Lambda workflows.'
        ]
      },
      {
        heading: 'Technology Stack',
        tech: ['Node.js', 'AWS Lambda', 'AWS S3 (SSE)', 'PostgreSQL', 'Amazon RDS', 'Credit Score API']
      }
    ]
  },
  schoolhouse: {
    kicker: 'EdTech · Real-Time Systems',
    title: 'The Modern Schoolhouse',
    subtitle: 'School Management & Interactive Communication Suite',
    sections: [
      {
        heading: 'Overview',
        content: 'Developed backend modules for an educational management platform supporting parent-teacher communication, structured lessons, school-wide announcements, and user administration.'
      },
      {
        heading: 'Key Architecture & Implementation',
        bullets: [
          'Built real-time chat channels between parents and teachers powered by <strong>Socket.IO and WebSockets</strong>.',
          'Structured backend modules cleanly with <strong>NestJS</strong> backed by <strong>Redis</strong> for caching and real-time messaging support.',
          'Managed relational school records in <strong>PostgreSQL with Sequelize</strong> and supported deployment on <strong>AWS</strong>.'
        ]
      },
      {
        heading: 'Technology Stack',
        tech: ['NestJS', 'React.js', 'PostgreSQL', 'Sequelize', 'Socket.IO', 'Redis', 'AWS']
      }
    ]
  },
  taskmanagement: {
    kicker: 'Open Code · GitHub',
    title: 'Task Management Service',
    subtitle: 'RESTful Backend Workflow Repository (github.com/sunny9699/task-management)',
    sections: [
      {
        heading: 'Overview',
        content: 'Public JavaScript repository illustrating clean backend CRUD orchestration, modular structure, and RESTful resource routing.'
      },
      {
        heading: 'Repository Highlights',
        bullets: [
          'Organized separation of route definitions, business handlers, and storage logic.',
          'Consistent HTTP status codes and clean JSON response envelopes.',
          'Available openly at <a href="https://github.com/sunny9699/task-management" target="_blank" rel="noopener noreferrer" style="text-decoration:underline">github.com/sunny9699/task-management</a>.'
        ]
      },
      {
        heading: 'Technology Stack',
        tech: ['JavaScript (ES6+)', 'Node.js', 'REST APIs', 'Git']
      }
    ]
  }
};

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const kickerEl = document.getElementById('modalKicker');
  const titleEl = document.getElementById('modalTitle');
  const subtitleEl = document.getElementById('modalSubtitle');
  const bodyEl = document.getElementById('modalBody');
  if (!modal) return;

  function openProject(id) {
    const data = projectData[id];
    if (!data) return;

    kickerEl.textContent = data.kicker;
    titleEl.textContent = data.title;
    subtitleEl.textContent = data.subtitle;

    bodyEl.innerHTML = data.sections
      .map((sec) => {
        let inner = `<div class="modal-section"><h4>${sec.heading}</h4>`;
        if (sec.content) inner += `<p>${sec.content}</p>`;
        if (sec.bullets) inner += `<ul>${sec.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>`;
        if (sec.tech) inner += `<div class="modal-tech-list">${sec.tech.map((t) => `<span class="tech-badge">${t}</span>`).join('')}</div>`;
        return `${inner}</div>`;
      })
      .join('');

    modal.showModal();
  }

  document.querySelectorAll('[data-project-open]').forEach((btn) => {
    btn.addEventListener('click', () => openProject(btn.dataset.projectOpen));
  });

  window.__openProjectById = openProject;
}

/* ==========================================================================
   10. Technical Writing Modal (<dialog>)
   ========================================================================== */
const articleData = {
  'postgres-indexing': {
    category: 'Database & Caching',
    title: 'Cutting REST API Latency by ~30% with DB Indexing & Redis',
    meta: 'Backend Performance · MindInventory Engineering Note',
    contentHtml: `
      <div class="modal-section">
        <h4>Why Slow Reads Happen in Growing APIs</h4>
        <p>As transactional tables grow, queries filtering on multiple columns (such as tenant/owner ID, status flags, and sort timestamps) degrade rapidly if indexes only cover single columns or omit the leading filter keys.</p>
      </div>
      <div class="modal-section">
        <h4>1. Inspecting Query Execution Plans</h4>
        <p>Before changing code or adding hardware, inspecting the planner behavior clarifies whether PostgreSQL/MySQL is running sequential scans, expensive sorts in memory, or N+1 loops from ORM associations:</p>
        <pre><code>EXPLAIN (ANALYZE, BUFFERS)
SELECT id, status, created_at
FROM records
WHERE account_id = $1 AND status = 'ACTIVE'
ORDER BY created_at DESC
LIMIT 25;</code></pre>
      </div>
      <div class="modal-section">
        <h4>2. Composite Indexes + Redis Cache-Aside</h4>
        <p>Pairing targeted composite database indexes with a bounded TTL Redis cache-aside lookup keeps frequent reads sub-millisecond while maintaining fresh state upon writes:</p>
        <pre><code>CREATE INDEX CONCURRENTLY idx_records_account_status_created
ON records (account_id, status, created_at DESC);</code></pre>
        <ul>
          <li>Order composite index columns around equality predicates first, followed by range/sort columns.</li>
          <li>Invalidate or expire Redis keys cleanly on mutation routes so stale responses never linger.</li>
          <li>Applying these optimizations together reduced REST API response times by roughly <strong>30%</strong> in production at MindInventory.</li>
        </ul>
      </div>
    `
  },
  'sqs-resilient-pipeline': {
    category: 'Distributed Systems',
    title: 'Resilient Background Workers with AWS SQS & Lambda',
    meta: 'Event-Driven Architecture · Practical Guide',
    contentHtml: `
      <div class="modal-section">
        <h4>When Synchronous HTTP Is the Wrong Fit</h4>
        <p>Long-running background processing — document uploads, credit-bureau checks, webhook notifications, and batch exports — degrades UX when executed synchronously on API request threads. External timeouts ripple back into failed HTTP requests.</p>
      </div>
      <div class="modal-section">
        <h4>Decoupled SQS Pipeline Design</h4>
        <ul>
          <li><strong>API Tier:</strong> Validates input DTOs, persists initial state, enqueues a lightweight payload to AWS SQS, and returns immediately.</li>
          <li><strong>Queue &amp; Visibility Tuning:</strong> Configures Queue <code>VisibilityTimeout</code> conservatively above worker timeout so active messages are not redelivered mid-flight.</li>
          <li><strong>Partial Batch Responses:</strong> Lambda consumers return only failed <code>messageId</code> items via <code>batchItemFailures</code> so healthy messages in the same batch are acknowledged once.</li>
          <li><strong>Dead-Letter Queues (DLQ):</strong> Messages exhausting retry policies move to a DLQ for inspection instead of blocking healthy throughput.</li>
        </ul>
      </div>
    `
  },
  'nestjs-clean-architecture': {
    category: 'Backend Architecture',
    title: 'Modular NestJS & SOLID Services Tested with Jest',
    meta: 'NestJS, GraphQL & Testing · Architecture Note',
    contentHtml: `
      <div class="modal-section">
        <h4>Keeping Growing Backends Maintainable</h4>
        <p>At AIPXperts and MindInventory, modularizing NestJS services around explicit domain boundaries prevented business logic from leaking into HTTP controllers, GraphQL resolvers, or TypeORM/Sequelize queries.</p>
      </div>
      <div class="modal-section">
        <h4>Practical Habits That Scale</h4>
        <pre><code>// Thin Controller -> Focused Use-Case Service -> Repository Boundary
@Controller('loans')
export class LoansController {
  constructor(private readonly loanService: LoanService) {}

  @Post('apply')
  submitApplication(@Body() dto: CreateLoanDto) {
    return this.loanService.submit(dto);
  }
}</code></pre>
        <ul>
          <li><strong>SOLID Boundaries:</strong> Controllers handle validation pipes and HTTP status codes; services hold pure business rules.</li>
          <li><strong>Fast Jest Verification:</strong> Writing both focused unit specs (mocking repository boundaries) and supertest integration tests ensures regressions are caught before deployment.</li>
        </ul>
      </div>
    `
  },
  'api-security-hardening': {
    category: 'API Security',
    title: 'Securing REST & GraphQL Endpoints with JWT, Guards & S3 SSE',
    meta: 'Security Engineering · Fintech & SaaS Note',
    contentHtml: `
      <div class="modal-section">
        <h4>Layered Protection Beyond Simple Authentication</h4>
        <p>In fintech lending and multi-role CRM/EdTech apps, security has to guard every layer: transport, request parsing, authorization, and object persistence.</p>
      </div>
      <div class="modal-section">
        <h4>Core Controls in Production</h4>
        <ul>
          <li><strong>JWT &amp; OAuth Verification:</strong> Validate signatures, expiration timestamps, and token claims in reusable middleware/guards before reaching route handlers.</li>
          <li><strong>Strict RBAC Enforcement:</strong> Enforce role checks at the guard level (separating borrowers, admins, faculty, and parents).</li>
          <li><strong>Defensive Middleware &amp; CORS:</strong> Whitelist explicit origins, enforce strict payload schema validation, and sanitize user-supplied fields.</li>
          <li><strong>Encrypted File Vaults:</strong> Store sensitive documents and audit trails in <strong>AWS S3 with server-side encryption (SSE)</strong> paired with least-privilege IAM policies.</li>
        </ul>
      </div>
    `
  }
};

function initArticleModal() {
  const modal = document.getElementById('articleModal');
  const catEl = document.getElementById('articleCategory');
  const titleEl = document.getElementById('articleTitle');
  const metaEl = document.getElementById('articleMeta');
  const bodyEl = document.getElementById('articleBody');
  if (!modal) return;

  function openArticle(id) {
    const data = articleData[id];
    if (!data) return;

    catEl.textContent = data.category;
    titleEl.textContent = data.title;
    metaEl.textContent = data.meta;
    bodyEl.innerHTML = data.contentHtml;
    modal.showModal();
  }

  document.querySelectorAll('[data-article-open]').forEach((btn) => {
    btn.addEventListener('click', () => openArticle(btn.dataset.articleOpen));
  });

  window.__openArticleById = openArticle;
}

/* ==========================================================================
   11. Quick Command Palette (Cmd+K / Ctrl+K)
   ========================================================================== */
function initCommandPalette() {
  const modal = document.getElementById('cmdModal');
  const triggerBtn = document.getElementById('cmdTriggerBtn');
  const input = document.getElementById('cmdInput');
  const list = document.getElementById('cmdList');
  if (!modal || !input || !list) return;

  const commands = [
    { label: 'Go to About & Principles', type: 'Section', run: () => navigateTo('#about') },
    { label: 'Go to Production Stack', type: 'Section', run: () => navigateTo('#stack') },
    { label: 'Go to Experience History', type: 'Section', run: () => navigateTo('#experience') },
    { label: 'Go to Selected Projects', type: 'Section', run: () => navigateTo('#projects') },
    { label: 'Go to Architecture & Code Patterns', type: 'Section', run: () => navigateTo('#architecture') },
    { label: 'Go to Technical Writing', type: 'Section', run: () => navigateTo('#writing') },
    { label: 'Go to Hiring & Technical FAQ', type: 'Section', run: () => navigateTo('#faq') },
    { label: 'Go to Education & Certification', type: 'Section', run: () => navigateTo('#education') },
    { label: 'Go to Contact', type: 'Section', run: () => navigateTo('#contact') },
    { label: 'Inspect Project: CollabCRM', type: 'Project', run: () => window.__openProjectById?.('collabcrm') },
    { label: 'Inspect Project: Loan Origination System', type: 'Project', run: () => window.__openProjectById?.('loanorigination') },
    { label: 'Inspect Project: The Modern Schoolhouse', type: 'Project', run: () => window.__openProjectById?.('schoolhouse') },
    { label: 'Read Note: ~30% REST Latency Reduction', type: 'Writing', run: () => window.__openArticleById?.('postgres-indexing') },
    { label: 'Read Note: AWS SQS Background Workers', type: 'Writing', run: () => window.__openArticleById?.('sqs-resilient-pipeline') },
    { label: 'Toggle Dark / Light Theme', type: 'Action', run: () => window.__toggleSiteTheme?.() },
    { label: `Copy Email (${EMAIL_ADDRESS})`, type: 'Action', run: async () => { await copyTextToClipboard(EMAIL_ADDRESS); showToast(`Copied ${EMAIL_ADDRESS}`); } },
    { label: 'Open Resume PDF', type: 'Action', run: () => window.open('assets/Sunny_Panchal_Resume.pdf', '_blank', 'noopener') }
  ];

  let activeIndex = 0;
  let filtered = commands;

  function navigateTo(hash) {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function executeCommand(cmd) {
    modal.close();
    requestAnimationFrame(() => cmd.run());
  }

  function renderList(query = '') {
    const q = query.trim().toLowerCase();
    filtered = q ? commands.filter((c) => c.label.toLowerCase().includes(q) || c.type.toLowerCase().includes(q)) : commands;
    activeIndex = 0;

    if (!filtered.length) {
      list.innerHTML = '<li class="cmd-empty">No matching sections or actions found.</li>';
      return;
    }

    list.innerHTML = filtered
      .map(
        (cmd, idx) => `
        <li>
          <button type="button" class="cmd-item ${idx === 0 ? 'selected' : ''}" data-cmd-idx="${idx}" role="option" aria-selected="${idx === 0}">
            <span>${cmd.label}</span>
            <span class="cmd-item-type">${cmd.type}</span>
          </button>
        </li>`
      )
      .join('');

    list.querySelectorAll('.cmd-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.cmdIdx);
        if (filtered[i]) executeCommand(filtered[i]);
      });
    });
  }

  function openPalette() {
    input.value = '';
    renderList();
    modal.showModal();
  }

  if (triggerBtn) triggerBtn.addEventListener('click', openPalette);

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.open) modal.close();
      else openPalette();
    }
  });

  input.addEventListener('input', () => renderList(input.value));

  input.addEventListener('keydown', (e) => {
    if (!filtered.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % filtered.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + filtered.length) % filtered.length;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeIndex]) executeCommand(filtered[activeIndex]);
      return;
    } else {
      return;
    }

    const items = list.querySelectorAll('.cmd-item');
    items.forEach((item, idx) => {
      const sel = idx === activeIndex;
      item.classList.toggle('selected', sel);
      item.setAttribute('aria-selected', String(sel));
      if (sel) item.scrollIntoView({ block: 'nearest' });
    });
  });
}

/* ==========================================================================
   12. Accessible Contact Form Validation (:user-invalid + Live Announcer)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  // Enable custom inline validation without native popup bubbles obscuring above-input hints
  form.noValidate = true;

  const supportsUserInvalid = CSS.supports('selector(:user-invalid)');
  const fields = Array.from(form.querySelectorAll('input, textarea'));
  const dirtyMap = new WeakMap();
  const flagged = new WeakSet();
  const announced = new WeakSet();

  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.classList.add('visually-hidden');
  document.body.append(announcer);
  let announceTimer;
  let announcedField;

  const linkError = (el, shown) => {
    const errorId = el.dataset.error;
    if (!errorId) return;
    const ids = (el.getAttribute('aria-describedby') || '')
      .split(/\s+/)
      .filter((id) => id && id !== errorId);
    if (shown) ids.push(errorId);
    if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
    else el.removeAttribute('aria-describedby');
  };

  const announceError = (el) => {
    const errorEl = document.getElementById(el.dataset.error);
    if (!errorEl) return;
    const labelText = el.labels?.[0]?.textContent?.trim() || '';
    clearTimeout(announceTimer);
    announcer.textContent = '';
    announcedField = el;
    announceTimer = setTimeout(() => {
      announcer.textContent = `${labelText ? `${labelText}: ` : ''}${errorEl.textContent.trim()}`;
    }, 450);
  };

  const syncAria = (el, shouldAnnounce = false) => {
    if (!el.matches?.('input, select, textarea')) return;
    if (el.validity.valid) el.classList.remove('user-invalid-fallback');
    const isInvalid =
      (supportsUserInvalid && el.matches(':user-invalid')) ||
      el.classList.contains('user-invalid-fallback');

    if (isInvalid) {
      if (shouldAnnounce && !announced.has(el)) {
        announceError(el);
        announced.add(el);
      }
      el.setAttribute('aria-invalid', 'true');
      linkError(el, true);
      flagged.add(el);
    } else if (flagged.has(el) || el.getAttribute('aria-invalid') !== 'true') {
      el.setAttribute('aria-invalid', 'false');
      linkError(el, false);
      flagged.delete(el);
      announced.delete(el);
      if (announcedField === el) {
        clearTimeout(announceTimer);
        announcer.textContent = '';
      }
    }
  };

  fields.forEach((el) => el.setAttribute('aria-invalid', 'false'));

  if (!supportsUserInvalid) {
    const updateFallback = (el) => {
      const valid = el.validity.valid;
      el.classList.toggle('user-invalid-fallback', !valid);
      syncAria(el, !valid);
    };
    form.addEventListener('blur', (e) => {
      const st = dirtyMap.get(e.target) || { interacted: false, blurred: false };
      st.blurred = true;
      dirtyMap.set(e.target, st);
      if (st.interacted) updateFallback(e.target);
    }, true);
    form.addEventListener('input', (e) => {
      const st = dirtyMap.get(e.target) || { interacted: false, blurred: false };
      st.interacted = true;
      dirtyMap.set(e.target, st);
      if (st.blurred || e.target.classList.contains('user-invalid-fallback')) updateFallback(e.target);
    });
  } else {
    form.addEventListener('blur', (e) => syncAria(e.target, true), true);
    form.addEventListener('input', (e) => {
      if (e.target.getAttribute('aria-invalid') === 'true' || e.target.classList.contains('user-invalid-fallback')) {
        syncAria(e.target);
      }
    });
  }

  form.addEventListener('reset', () => {
    setTimeout(() => {
      fields.forEach((el) => {
        el.classList.remove('user-invalid-fallback');
        dirtyMap.delete(el);
        syncAria(el);
      });
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      let firstInvalid = null;
      fields.forEach((f) => {
        if (!f.validity.valid) {
          if (!firstInvalid) firstInvalid = f;
          f.classList.add('user-invalid-fallback');
          syncAria(f, f === firstInvalid);
        } else {
          syncAria(f);
        }
      });
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    const bodyText = `Hello Sunny,\n\n${message}\n\nFrom: ${name} (${email})`;
    const mailtoUrl = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(`[Portfolio] ${subject}`)}&body=${encodeURIComponent(bodyText)}`;

    submitBtn.disabled = true;
    const btnText = submitBtn.querySelector('span');
    if (btnText) btnText.textContent = 'Preparing Draft...';

    window.location.href = mailtoUrl;

    setTimeout(() => {
      if (feedback) {
        feedback.textContent = `Mail draft opened! If no mail client launched, copy my email directly: ${EMAIL_ADDRESS}`;
        feedback.className = 'form-feedback success';
      }
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Open Email Draft';
      showToast('Opening email draft...');
      form.reset();
    }, 900);
  });
}

/* ==========================================================================
   13. Scroll Reveals & Toast
   ========================================================================== */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -36px 0px', threshold: 0.08 }
  );

  reveals.forEach((el) => observer.observe(el));
}

let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const msgEl = document.getElementById('toastMessage');
  if (!toast || !msgEl) return;

  clearTimeout(toastTimer);
  msgEl.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}
