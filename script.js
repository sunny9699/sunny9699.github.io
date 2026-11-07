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
