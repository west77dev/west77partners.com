// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav__list');

hamburger.addEventListener('click', () => {
  navList.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navList.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navList.classList.remove('active');
  });
});

// Section nav active state on scroll (about page)
const sectionNavLinks = document.querySelectorAll('.section-nav__link');
if (sectionNavLinks.length > 0) {
  const sections = [];
  sectionNavLinks.forEach(link => {
    const id = link.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (section) sections.push({ link, section });
  });

  const onScroll = () => {
    const scrollPos = window.scrollY + 200;
    let current = sections[0];
    sections.forEach(item => {
      if (item.section.offsetTop <= scrollPos) {
        current = item;
      }
    });
    sectionNavLinks.forEach(l => l.classList.remove('active'));
    if (current) current.link.classList.add('active');
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ========== Scroll-Triggered Reveal Animations ==========
// Inspired by tekta.ru's elegant scroll reveals

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

// Reveal individual elements
document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// Staggered grid reveals
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const children = entry.target.querySelectorAll('.reveal-item');
      children.forEach((child, i) => {
        child.style.transitionDelay = `${i * 100}ms`;
        child.classList.add('revealed');
      });
      staggerObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -20px 0px'
});

document.querySelectorAll('.reveal-stagger').forEach(el => {
  staggerObserver.observe(el);
});

// ========== Animated Number Counter ==========
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent.trim();
      const match = text.match(/^([~$]*)(\d[\d,]*)([+%KMB]*)/);
      if (!match) {
        el.classList.add('counted');
        counterObserver.unobserve(el);
        return;
      }
      const prefix = match[1];
      const target = parseInt(match[2].replace(/,/g, ''), 10);
      const suffix = match[3];
      const duration = 1600;
      const start = performance.now();
      const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = easeOutExpo(progress);
        const current = Math.round(target * eased);
        el.textContent = prefix + current.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count-up').forEach(el => {
  counterObserver.observe(el);
});

// ========== Parallax Hero ==========
const heroImg = document.querySelector('.hero__img');
if (heroImg) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          heroImg.style.transform = `translateY(${scrolled * 0.25}px) scale(1.05)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ========== Header Scroll Effect ==========
const header = document.querySelector('.header');
if (header && !header.classList.contains('header--solid')) {
  let headerTicking = false;
  window.addEventListener('scroll', () => {
    if (!headerTicking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 80) {
          header.classList.add('header--scrolled');
        } else {
          header.classList.remove('header--scrolled');
        }
        headerTicking = false;
      });
      headerTicking = true;
    }
  }, { passive: true });
}

// ========== Smooth Section Nav Scroll ==========
document.querySelectorAll('.section-nav__link').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 160;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});
