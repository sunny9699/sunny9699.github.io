/**
 * Sunny Panchal — Professional Portfolio
 * Interactivity: Theme toggle, dynamic role rotation, live IST clock,
 * email copy, project modals, form validation, FAQ accordion,
 * project category filtering, and scroll reveals.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initRoleRotator();
  initLiveClock();
  initCopyEmail();
  initContactForm();
  initFaqAccordion();
  initProjectFilters();
  initScrollReveals();
  initProjectModals();
  initBlueprintTabs();
  initMatrixFilter();
  initScenarioSolver();
  initArticleModal();
});

/* ==========================================================================
   1. Theme Management (Light / Dark)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeColorMeta = document.getElementById('themeColorMeta');
  
  // Check persisted theme or system preference
  const savedTheme = localStorage.getItem('sunny_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('sunny_theme', newTheme);
      showToast(`Switched to ${newTheme} theme`);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'dark' ? '#09090b' : '#ffffff');
    }
  }
}

/* ==========================================================================
   2. Navbar Scroll & Active State & Mobile Drawer
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navHamburger = document.getElementById('navHamburger');
  const navDrawer = document.getElementById('navDrawer');
  const navLinks = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect & Active link spy
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    if (navbar) {
      if (scrollY > 30) {
        navbar.style.boxShadow = 'var(--shadow-md)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    }

    // Active Section Spy
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Mobile drawer toggle
  if (navHamburger && navDrawer) {
    navHamburger.addEventListener('click', () => {
      const isExpanded = navHamburger.getAttribute('aria-expanded') === 'true';
      navHamburger.setAttribute('aria-expanded', !isExpanded);
      navDrawer.classList.toggle('open');
      navDrawer.setAttribute('aria-hidden', isExpanded);
    });

    // Close drawer on link click
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        navHamburger.setAttribute('aria-expanded', 'false');
        navDrawer.classList.remove('open');
        navDrawer.setAttribute('aria-hidden', 'true');
      });
    });

    // Close drawer if clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navDrawer.classList.contains('open')) {
        navHamburger.setAttribute('aria-expanded', 'false');
        navDrawer.classList.remove('open');
        navDrawer.setAttribute('aria-hidden', 'true');
      }
    });
  }
}

/* ==========================================================================
   3. Dynamic Role Rotator
   ========================================================================== */
function initRoleRotator() {
  const roleEl = document.getElementById('roleRotator');
  if (!roleEl) return;

  const roles = [
    'Software Engineer',
    'Backend Architect',
    'Cloud-Native Engineer',
    'API & Microservices Specialist'
  ];

  let currentIndex = 0;

  setInterval(() => {
    roleEl.style.opacity = '0';
    roleEl.style.transform = 'translateY(6px)';

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % roles.length;
      roleEl.textContent = roles[currentIndex];
      roleEl.style.opacity = '1';
      roleEl.style.transform = 'translateY(0)';
    }, 250);
  }, 3200);
}

/* ==========================================================================
   4. Live IST Clock (Ahmedabad, India)
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;

  function updateTime() {
    try {
      const now = new Date();
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      const formatted = timeFormatter.format(now);
      clockEl.textContent = `${formatted} IST (UTC+5:30)`;
    } catch (e) {
      clockEl.textContent = 'IST (UTC+5:30)';
    }
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* ==========================================================================
   5. Copy Email to Clipboard
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailAddress = 'panchalsunny785@gmail.com';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      
      const copyText = copyBtn.querySelector('.copy-text');
      const originalText = copyText.textContent;
      copyText.textContent = 'Copied!';
      copyBtn.style.color = 'var(--accent-emerald)';
      copyBtn.style.borderColor = 'var(--accent-emerald)';

      showToast('Email address copied to clipboard');

      setTimeout(() => {
        copyText.textContent = originalText;
        copyBtn.style.color = '';
        copyBtn.style.borderColor = '';
      }, 2000);
    } catch (err) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = emailAddress;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Email copied to clipboard');
    }
  });
}

/* ==========================================================================
   6. Contact Form Validation & Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.senderName.value.trim();
    const email = form.senderEmail.value.trim();
    const subject = form.senderSubject.value.trim();
    const message = form.senderMessage.value.trim();

    // Reset errors
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('subjectError').textContent = '';
    document.getElementById('messageError').textContent = '';
    feedback.textContent = '';
    feedback.className = 'form-feedback';

    let isValid = true;

    if (!name) {
      document.getElementById('nameError').textContent = 'Please enter your name.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      document.getElementById('emailError').textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!subject) {
      document.getElementById('subjectError').textContent = 'Please provide a subject.';
      isValid = false;
    }

    if (!message || message.length < 10) {
      document.getElementById('messageError').textContent = 'Please write a message (at least 10 characters).';
      isValid = false;
    }

    if (!isValid) return;

    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Opening Mail App...';

    const mailtoBody = encodeURIComponent(
      `Hello Sunny,\n\n${message}\n\nFrom: ${name} (${email})`
    );
    const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject}`);
    const mailtoUrl = `mailto:panchalsunny785@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    window.location.href = mailtoUrl;

    setTimeout(() => {
      feedback.textContent = 'Message ready! If your email client did not open, please reach out directly to panchalsunny785@gmail.com';
      feedback.classList.add('success');
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Send Message';
      showToast('Opening default email client...');
      form.reset();
    }, 1200);
  });
}

/* ==========================================================================
   7. Recruiter & Engineering FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');

      // Close all other items with smooth collapse
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isCurrentlyActive) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   8. Project Category Filters
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('filtered-out');
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });
}

/* ==========================================================================
   9. Project Details Modal
   ========================================================================== */
const projectData = {
  collabcrm: {
    kicker: 'Enterprise · Cloud Native',
    title: 'CollabCRM',
    subtitle: 'Customer Relationship Management & Real-Time Collaboration Platform',
    sections: [
      {
        heading: 'Architecture Overview',
        content: `Built a resilient, serverless backend to orchestrate complex CRM operations spanning employee onboarding, lead pipeline management, cross-functional sales tracking, and recruitment lifecycles.`
      },
      {
        heading: 'Key Engineering Highlights',
        bullets: [
          `Integrated <strong>AWS API Gateway WebSocket</strong> to power low-latency, bidirectional Kanban board updates and push notifications across distributed team members.`,
          `Designed decoupled microservices using <strong>AWS Lambda</strong> for event-driven compute and background task execution, eliminating idle server expenses.`,
          `Structured relational data with <strong>PostgreSQL and Sequelize ORM</strong> for ACID transaction guarantees, while leveraging <strong>DynamoDB</strong> for high-speed session tracking.`,
          `Automated infrastructure provisioning and deployments utilizing the <strong>Serverless Framework</strong> with strict IAM policies.`
        ]
      },
      {
        heading: 'Technology Stack',
        tech: ['Node.js', 'React.js', 'PostgreSQL', 'Sequelize', 'DynamoDB', 'AWS Lambda', 'AWS API Gateway WebSocket', 'Serverless Framework']
      }
    ]
  },
  loanorigination: {
    kicker: 'Fintech · Security & Risk',
    title: 'Loan Origination System',
    subtitle: 'Automated Lending Workflow & Real-Time Underwriting Engine',
    sections: [
      {
        heading: 'Architecture Overview',
        content: `Engineered an automated loan origination and risk verification engine designed to process borrower applications, conduct real-time credit checks, verify income streams, and dynamically generate tailor-made loan offers.`
      },
      {
        heading: 'Key Engineering Highlights',
        bullets: [
          `Integrated enterprise third-party <strong>credit-scoring APIs</strong> with automated retry strategies and fallback handling for mission-critical borrower eligibility decisions.`,
          `Secured sensitive financial documents, identity proofs, and transaction audit trails in <strong>Amazon S3 with Server-Side Encryption (SSE-KMS)</strong>.`,
          `Modeled high-integrity financial ledger records in <strong>PostgreSQL on Amazon RDS</strong> with multi-AZ failover and automated backups.`,
          `Designed RESTful endpoints with defensive input validation, JWT token checks, and custom security middleware to prevent tampering.`
        ]
      },
      {
        heading: 'Technology Stack',
        tech: ['Node.js', 'AWS Lambda', 'AWS S3 (SSE)', 'PostgreSQL', 'Amazon RDS', 'Credit Score API', 'RESTful APIs', 'JWT']
      }
    ]
  },
  schoolhouse: {
    kicker: 'EdTech · Real-Time Systems',
    title: 'The Modern Schoolhouse',
    subtitle: 'Comprehensive School Management & Interactive Communication Suite',
    sections: [
      {
        heading: 'Architecture Overview',
        content: `Architected a multi-role educational platform empowering school administrators, teachers, parents, and students with lesson plans, academic scheduling, performance grading, and instant messaging.`
      },
      {
        heading: 'Key Engineering Highlights',
        bullets: [
          `Engineered real-time parent-teacher chat and administrative announcements using <strong>Socket.IO and WebSockets</strong> with a <strong>Redis</strong> message pub/sub adapter for horizontal scaling.`,
          `Built a modular, testable backend using <strong>NestJS</strong> following clean architecture and SOLID design patterns.`,
          `Implemented hierarchical Role-Based Access Control (RBAC) to ensure strict data segregation between students, parents, and faculty.`,
          `Managed relational course, enrollment, and attendance records with <strong>PostgreSQL and Sequelize</strong>, deployed on scalable AWS infrastructure.`
        ]
      },
      {
        heading: 'Technology Stack',
        tech: ['NestJS', 'React.js', 'PostgreSQL', 'Sequelize', 'Socket.IO', 'Redis', 'AWS Cloud', 'Docker']
      }
    ]
  }
};

function initProjectModals() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalKicker = document.getElementById('modalKicker');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalBody = document.getElementById('modalBody');

  if (!modal) return;

  window.openProjectModal = function(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalKicker.textContent = data.kicker;
    modalTitle.textContent = data.title;
    modalSubtitle.textContent = data.subtitle;

    let bodyHtml = '';
    data.sections.forEach(sec => {
      bodyHtml += `<div class="modal-section"><h4>${sec.heading}</h4>`;
      if (sec.content) {
        bodyHtml += `<p>${sec.content}</p>`;
      }
      if (sec.bullets) {
        bodyHtml += `<ul>${sec.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`;
      }
      if (sec.tech) {
        bodyHtml += `<div class="modal-tech-list">${sec.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}</div>`;
      }
      bodyHtml += `</div>`;
    });

    modalBody.innerHTML = bodyHtml;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   10. Scroll Reveals (Intersection Observer)
   ========================================================================= */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   11. Toast Notification System
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  if (!toast || !toastMessage) return;

  clearTimeout(toastTimeout);
  toastMessage.textContent = message;
  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

/* ==========================================================================
   12. Interactive Architecture Blueprints (#blueprints)
   ========================================================================== */
function initBlueprintTabs() {
  const tabs = document.querySelectorAll('.blueprint-tab');
  const panels = document.querySelectorAll('.blueprint-panel');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-blueprint');
      if (!targetId) return;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(`bp-${targetId}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   13. Architecture Decision Matrix & Protocol Filter (#benchmarks)
   ========================================================================== */
function initMatrixFilter() {
  const filterBtns = document.querySelectorAll('.matrix-tab-btn');
  const rows = document.querySelectorAll('.matrix-table tbody tr');

  if (!filterBtns.length || !rows.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-matrix-cat');
      rows.forEach(row => {
        if (cat === 'all' || row.getAttribute('data-cat') === cat) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   14. Interactive System Design Scenario Solver (#benchmarks)
   ========================================================================== */
const scenarioSolutions = {
  fintech: {
    recommended: 'PostgreSQL (ACID) + Redis Distributed Locks + SQS FIFO',
    storage: 'Amazon RDS PostgreSQL (Multi-AZ with Read Replicas)',
    transport: 'RESTful API with mandatory X-Idempotency-Key headers',
    messaging: 'AWS SQS FIFO (Message Grouping & Deduplication ID)',
    latency: 'p50: 22ms | p99: 68ms',
    rationale: 'Financial lending workflows forbid race conditions and double underwriting offers. Enforcing strict database ACID isolation combined with atomic Redis locks (SET NX EX) guarantees zero duplicate charges even under retry storms.'
  },
  telemetry: {
    recommended: 'WebSockets (TCP Stream) + Redis Streams / Kafka + TimescaleDB',
    storage: 'TimescaleDB / Redis In-Memory Circular Buffer',
    transport: 'Persistent WebSockets with Binary / Protocol Buffers',
    messaging: 'Redis Streams / AWS Kinesis Partitioned Shards',
    latency: 'p50: 3ms (frame) | p99: 12ms',
    rationale: '50,000 GPS coordinate pings per second cannot sustain HTTP connection handshake overhead. Persistent bi-directional WebSockets combined with partitioned streaming buffers decouple real-time driver ingestion from relational archival.'
  },
  ecommerce: {
    recommended: 'ElastiCache Redis Read-Through + DynamoDB / PostgreSQL + Edge CDN',
    storage: 'Amazon ElastiCache Redis Cluster (Multi-AZ) + PostgreSQL',
    transport: 'REST / GraphQL with HTTP ETag & Cache-Control headers',
    messaging: 'AWS SQS Standard Queue for asynchronous checkout orders',
    latency: 'p50: 2ms (Cache Hit) | p99: 18ms',
    rationale: 'Flash sales experience an extreme 100:1 read-to-write ratio. Offloading 98% of catalog product queries to Redis clusters backed by CloudFront edge CDN protects the primary database for critical payment transactions.'
  },
  'async-docs': {
    recommended: 'Fast 202 Accepted REST API + S3 SSE + AWS SQS + Lambda Workers',
    storage: 'Amazon S3 (Server-Side Encryption KMS) + PostgreSQL Ledger',
    transport: 'REST API returning 202 Accepted + Job Polling / Webhook callback',
    messaging: 'AWS SQS Standard with Dead-Letter Queue (DLQ)',
    latency: 'Client Ack: 18ms | Async Worker Execution: 1.4s – 4.2s',
    rationale: 'OCR extraction and credit bureau checks take seconds and fluctuate wildly. Returning an immediate 202 Accepted with a correlation job ID shields the user from connection timeouts while background workers scale horizontally.'
  }
};

function initScenarioSolver() {
  const selector = document.getElementById('scenarioSelector');
  const resultPanel = document.getElementById('solverResult');
  if (!selector || !resultPanel) return;

  function renderScenario(key) {
    const data = scenarioSolutions[key] || scenarioSolutions.fintech;
    resultPanel.innerHTML = `
      <div class="solver-cell">
        <span class="solver-cell-label">Recommended Architecture</span>
        <span class="solver-cell-value" style="color: #3b82f6;">${data.recommended}</span>
      </div>
      <div class="solver-cell">
        <span class="solver-cell-label">Primary Data Store</span>
        <span class="solver-cell-value">${data.storage}</span>
      </div>
      <div class="solver-cell">
        <span class="solver-cell-label">API Transport &amp; Protocol</span>
        <span class="solver-cell-value">${data.transport}</span>
      </div>
      <div class="solver-cell">
        <span class="solver-cell-label">Queueing &amp; Buffering</span>
        <span class="solver-cell-value">${data.messaging}</span>
      </div>
      <div class="solver-cell">
        <span class="solver-cell-label">Expected Latency Profile</span>
        <span class="solver-cell-value" style="color: #10b981; font-family: var(--font-mono);">${data.latency}</span>
      </div>
      <div class="solver-cell">
        <span class="solver-cell-label">Fault-Tolerance Strategy</span>
        <span class="solver-cell-value">Automated Dead-Letter Queue &amp; Circuit Breaking</span>
      </div>
      <div class="solver-rationale-cell">
        <strong style="color: var(--text-primary);">Engineering Rationale:</strong> ${data.rationale}
      </div>
    `;
  }

  selector.addEventListener('change', (e) => {
    renderScenario(e.target.value);
  });

  renderScenario(selector.value || 'fintech');
}

/* ==========================================================================
   15. Technical Writing Articles Data & Reader Modal (#writing)
   ========================================================================== */
const articleData = {
  'postgres-indexing': {
    category: 'Database Performance',
    title: 'PostgreSQL Index Tuning: From 450ms Seq Scans to 12ms Index Conds',
    meta: 'October 2024 · 8 min read · Engineering Forensics',
    contentHtml: `
      <div class="modal-section">
        <h4>1. Production Incident Context</h4>
        <p>During an end-of-month financial reconciliation spike, our borrower portal began experiencing severe 504 gateway timeouts. Amazon CloudWatch surfaced an Amazon RDS PostgreSQL CPU spike to 92%, while median query latency on user transaction history endpoints surged from 45ms to over 450ms.</p>
      </div>

      <div class="modal-section">
        <h4>2. Forensics with EXPLAIN (ANALYZE, BUFFERS)</h4>
        <p>Running query execution plan diagnostics in our staging environment revealed the root problem:</p>
        <pre><code>EXPLAIN (ANALYZE, BUFFERS)
SELECT id, amount, status, created_at 
FROM transactions 
WHERE tenant_id = 'tenant_892' 
  AND status = 'COMPLETED' 
ORDER BY created_at DESC 
LIMIT 25;</code></pre>
        <p>The query planner output indicated a devastating Sequential Scan over 4.2 million rows: <code>Seq Scan on transactions (cost=0.00..184520.10 rows=25 width=48) (actual time=412.312..448.910 rows=25 loops=1)</code>. Buffer reads revealed <code>Buffers: shared hit=8940 read=74520</code>, saturating database disk I/O.</p>
      </div>

      <div class="modal-section">
        <h4>3. The Root Cause: Leftmost Prefix Indexing Rule</h4>
        <p>An index already existed on <code>transactions(created_at, status)</code>. However, because our query filtered by <code>tenant_id</code> as the primary partition filter, the PostgreSQL B-tree index could not be used efficiently without <code>tenant_id</code> in the leading position of the index composite key.</p>
      </div>

      <div class="modal-section">
        <h4>4. Engineering Solution: Zero-Downtime Compound Indexing</h4>
        <p>To eliminate table locking during production deployment, we executed a concurrent compound index migration:</p>
        <pre><code>CREATE INDEX CONCURRENTLY idx_transactions_tenant_status_created 
ON transactions (tenant_id, status, created_at DESC);</code></pre>
        <p>Post-migration execution plan output immediately transformed to an optimal <strong>Index Scan using idx_transactions_tenant_status_created</strong>:</p>
        <pre><code>Index Scan: actual time=0.082..11.890 rows=25 loops=1
Buffers: shared hit=42 read=0</code></pre>
      </div>

      <div class="modal-section">
        <h4>5. Key Architectural Takeaways</h4>
        <ul>
          <li><strong>Index Column Ordering:</strong> Always arrange compound B-tree index columns in order of equality conditions first, followed by range conditions, followed by ordering constraints: <code>(Equality, Equality, Sort)</code>.</li>
          <li><strong>Buffer Cache Hit Ratio:</strong> Monitor <code>shared hit</code> vs <code>read</code> to distinguish between RAM cache hits and expensive disk I/O reads.</li>
          <li><strong>Zero-Downtime Safe Migrations:</strong> Never run <code>CREATE INDEX</code> without <code>CONCURRENTLY</code> in production environments.</li>
        </ul>
      </div>
    `
  },

  'sqs-resilient-pipeline': {
    category: 'Distributed Systems',
    title: 'Zero-Data-Loss Background Processing with AWS SQS & Lambda',
    meta: 'January 2025 · 10 min read · Cloud Architecture',
    contentHtml: `
      <div class="modal-section">
        <h4>1. The Challenge of Synchronous Processing</h4>
        <p>In our loan origination engine, borrowers submit identity documentation and bank statements for automated credit scoring. Initially, credit checks were invoked synchronously within the HTTP POST request. When third-party credit bureau APIs experienced intermittent 10-second latency spikes, client requests timed out, triggering aggressive user retries and cascading downstream failures.</p>
      </div>

      <div class="modal-section">
        <h4>2. Decoupled Asynchronous Topology</h4>
        <p>We re-architected the underwriting pipeline into a decoupled event-driven model:</p>
        <ul>
          <li><strong>Ingestion Tier:</strong> Lightweight API Gateway + Lambda authenticates the request, writes an immutable audit record, and immediately replies with <code>202 Accepted</code> containing an <code>application_id</code> in under 25ms.</li>
          <li><strong>Buffer Tier:</strong> Message is pushed to an AWS SQS Standard Queue with an MD5 hash deduplication key.</li>
          <li><strong>Worker Tier:</strong> Consumer Lambdas poll SQS in batches of 10, executing the credit checks with exponential backoff.</li>
        </ul>
      </div>

      <div class="modal-section">
        <h4>3. Resiliency Mechanics &amp; DLQ Isolation</h4>
        <p>To guarantee zero data loss and prevent poison messages from wedging workers:</p>
        <pre><code>VisibilityTimeout: 6 * FunctionTimeout (e.g. 180s)
MaxReceiveCount: 3
DeadLetterTargetArn: arn:aws:sqs:us-east-1:xxx:underwriting-dlq</code></pre>
        <p>If an unhandled exception or third-party outage occurs, SQS retries the message 3 times with exponential backoff plus full jitter. If all attempts fail, the message is isolated in the Dead-Letter Queue (DLQ), and a CloudWatch alarm alerts the engineering on-call rotation.</p>
      </div>

      <div class="modal-section">
        <h4>4. Distributed Idempotency with Redis</h4>
        <p>Because SQS Standard offers <em>at-least-once</em> delivery, network partitions can cause message duplication. We engineered an atomic Redis lock guard:</p>
        <pre><code>const acquired = await redis.set(
  \`lock:application:\${appId}\`,
  workerInstanceId,
  'NX',
  'EX',
  120
);
if (!acquired) {
  logger.warn('Duplicate invocation detected, skipping duplicate processing');
  return;
}</code></pre>
      </div>

      <div class="modal-section">
        <h4>5. Production Impact</h4>
        <ul>
          <li><strong>Zero Data Loss:</strong> 100% of submitted applications were successfully queued and processed.</li>
          <li><strong>Client Response Time:</strong> Reduced from 4.8s synchronous wait down to 22ms instant acknowledgment.</li>
          <li><strong>Traffic Leveling:</strong> Absorb 5x traffic surges smoothly with zero database connection exhaustion.</li>
        </ul>
      </div>
    `
  },

  'nestjs-clean-architecture': {
    category: 'Backend Architecture',
    title: 'Clean Architecture & SOLID in Modular NestJS Microservices',
    meta: 'April 2025 · 9 min read · Software Craftsmanship',
    contentHtml: `
      <div class="modal-section">
        <h4>1. The Trap of Fat Controllers &amp; Tight Coupling</h4>
        <p>As enterprise backend codebases expand, controllers frequently become tangled with direct ORM queries, third-party payment calls, and business validation rules. Writing unit tests becomes an agonizing exercise requiring massive NestJS test modules, database containers, and hundreds of mock definitions.</p>
      </div>

      <div class="modal-section">
        <h4>2. Implementing Hexagonal / Clean Architecture in NestJS</h4>
        <p>We structured our microservices into three strict architectural boundaries following Dependency Inversion:</p>
        <ul>
          <li><strong>Domain Layer (Core):</strong> Pure TypeScript entities, domain events, and value objects with 0 external npm dependencies. Contains business invariants that never change regardless of database or framework.</li>
          <li><strong>Application Layer:</strong> Use Cases / Command Handlers (e.g. <code>ApproveLoanOfferUseCase</code>). Coordinates business flow, orchestrates domain entities, and communicates via abstract interfaces.</li>
          <li><strong>Infrastructure Layer (Adapters):</strong> PostgreSQL TypeORM repositories, AWS S3 uploaders, Redis caching adapters, and NestJS controllers.</li>
        </ul>
      </div>

      <div class="modal-section">
        <h4>3. Dependency Inversion via Custom Providers</h4>
        <p>Use cases never import concrete ORM entities. Instead, they depend on abstract Port interfaces:</p>
        <pre><code>// Domain Port
export interface ILoanRepository {
  findById(id: LoanId): Promise<Loan | null>;
  save(loan: Loan): Promise<void>;
}

// NestJS Provider Binding
@Module({
  providers: [
    ApproveLoanOfferUseCase,
    {
      provide: 'ILoanRepository',
      useClass: PostgresLoanRepository,
    },
  ],
})
export class LoanModule {}</code></pre>
      </div>

      <div class="modal-section">
        <h4>4. The Testing Payoff: 80% Faster Unit Tests</h4>
        <p>Because use cases depend purely on interfaces, testing business logic requires zero database spins or heavy test harnesses:</p>
        <pre><code>describe('ApproveLoanOfferUseCase', () => {
  it('should transition loan state to APPROVED when credit score meets threshold', async () => {
    const mockRepo = new InMemoryLoanRepository();
    const useCase = new ApproveLoanOfferUseCase(mockRepo);
    
    await useCase.execute({ loanId: '123' });
    expect((await mockRepo.findById('123')).status).toBe('APPROVED');
  });
});</code></pre>
        <p>Our entire unit test suite of 450+ tests runs in just 7.8 seconds with 98% coverage of core business rules.</p>
      </div>
    `
  },

  'api-security-hardening': {
    category: 'API Security',
    title: 'Hardening REST & GraphQL APIs: Defense-in-Depth & Token Revocation',
    meta: 'August 2025 · 7 min read · Security Engineering',
    contentHtml: `
      <div class="modal-section">
        <h4>1. The Stateless JWT Invalidation Paradox</h4>
        <p>JSON Web Tokens (JWT) are widely adopted because they are stateless and verifiable without database lookups. However, in security-critical fintech and healthcare platforms, statelessness becomes a vulnerability: if a user logs out, resets their password, or is suspended, their access token remains valid until expiration unless explicitly revoked.</p>
      </div>

      <div class="modal-section">
        <h4>2. Architectural Solution: Hybrid Token Revocation with Redis TTL</h4>
        <p>We solved this by generating a unique cryptographic <code>jti</code> (JWT ID) in every issued access token:</p>
        <pre><code>// On user logout or password change:
const remainingTtl = tokenExp - Math.floor(Date.now() / 1000);
if (remainingTtl > 0) {
  await redis.set(\`blacklist:\${jti}\`, 'revoked', 'EX', remainingTtl);
}</code></pre>
        <p>In our NestJS <code>JwtAuthGuard</code>, we perform a sub-millisecond in-memory Redis check:</p>
        <pre><code>const isRevoked = await redis.exists(\`blacklist:\${payload.jti}\`);
if (isRevoked) {
  throw new UnauthorizedException('Token has been revoked');
}</code></pre>
      </div>

      <div class="modal-section">
        <h4>3. Defending GraphQL Against Recursive Query Attacks</h4>
        <p>Unlike REST endpoints with fixed payload shapes, GraphQL allows clients to define arbitrary queries. Malicious actors can construct deeply nested queries (e.g. <code>author -> posts -> author -> posts</code>) that choke database resources.</p>
        <p>We mitigated this by implementing query depth limiting and query complexity scoring:</p>
        <pre><code>validationRules: [
  depthLimit(5),
  createComplexityLimitRule(1000)
]</code></pre>
      </div>

      <div class="modal-section">
        <h4>4. Sliding-Window Rate Limiting in Redis</h4>
        <p>To defend against credential stuffing and brute-force attacks, we deployed a sliding-window rate limiter utilizing Redis sorted sets (<code>ZADD</code>, <code>ZREMRANGEBYSCORE</code>, <code>ZCARD</code>), enforcing strict quotas of 60 requests/minute on authentication endpoints.</p>
      </div>
    `
  }
};

function initArticleModal() {
  const modal = document.getElementById('articleModal');
  const closeBtn = document.getElementById('articleCloseBtn');
  const modalCategory = document.getElementById('articleCategory');
  const modalTitle = document.getElementById('articleTitle');
  const modalMeta = document.getElementById('articleMeta');
  const modalBody = document.getElementById('articleBody');

  if (!modal) return;

  window.openArticleModal = function(articleId) {
    const data = articleData[articleId];
    if (!data) return;

    if (modalCategory) modalCategory.textContent = data.category;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalMeta) modalMeta.textContent = data.meta;
    if (modalBody) modalBody.innerHTML = data.contentHtml;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  function closeArticleModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeArticleModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeArticleModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeArticleModal();
    }
  });
}
