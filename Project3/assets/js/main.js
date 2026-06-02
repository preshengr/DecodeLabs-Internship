/**
 * =============================================================================
 * SMART TECH LIMITED — main.js
 * Project 3: Interactive Web Elements
 * DecodeLabs Industrial Training Kit | Batch 2026
 * =============================================================================
 *
 * ARCHITECTURE OVERVIEW (IPO Model — Slide 7):
 * ─────────────────────────────────────────────
 *   INPUT   → User events (clicks, keypresses, scroll, page load)
 *   PROCESS → JavaScript functions that evaluate state and apply logic
 *   OUTPUT  → DOM mutations: class toggles, textContent updates, style changes
 *
 * ENGINEERING STANDARDS (Slide 17 — Decoupling):
 * ─────────────────────────────────────────────
 *   - "js-" prefix classes:  used ONLY as JavaScript hooks (never styled in CSS)
 *   - "is-" prefix classes:  used ONLY to represent visual state (CSS handles look)
 *   - const by default, let only when value must mutate (Slide 12)
 *   - No innerHTML for user data — use textContent (Slide 14, XSS security)
 *   - Keep functions small and single-purpose (Slide 13)
 *   - All listeners attached after DOMContentLoaded
 *
 * FILE SECTIONS:
 * ─────────────────────────────────────────────
 *   §1  Utility helpers
 *   §2  Hamburger / Mobile Navigation (all pages)
 *   §3  Sticky nav scroll behaviour (all pages)
 *   §4  Typing effect — hero-eyebrow-text (index.html)
 *   §5  Animated counter — hero-stat-number (index.html)
 *   §6  Scroll-triggered reveal animations (all pages)
 *   §7  Accordion FAQ (contact.html)
 *   §8  Accordion Price Table (services.html)
 *   §9  Repair form: client-side validation + confirmation (services.html)
 *   §10 Contact form: client-side validation + confirmation (contact.html)
 *   §11 Active nav link highlighter (all pages)
 *   §12 Back-to-top button (all pages)
 *   §13 Init — DOMContentLoaded orchestrator
 * =============================================================================
 */

"use strict"; // Enforce strict mode — catches silent errors

/* =============================================================================
   §1 — UTILITY HELPERS
   Small, reusable single-purpose functions (Slide 13: keep functions small)
   ============================================================================= */

/**
 * Safe DOM query — returns element or null without throwing.
 * @param {string} selector - CSS selector string
 * @param {Element} [context=document] - Search root
 * @returns {Element|null}
 */
const $ = (selector, context = document) => context.querySelector(selector);

/**
 * Safe DOM query all — returns NodeList (may be empty).
 * @param {string} selector
 * @param {Element} [context=document]
 * @returns {NodeList}
 */
const $$ = (selector, context = document) => context.querySelectorAll(selector);

/**
 * Add event listener with automatic null-guard.
 * INPUT: element + event type + handler
 * PROCESS: checks element exists before attaching
 * OUTPUT: attached listener or silent skip
 * @param {Element|null} el
 * @param {string} event
 * @param {Function} handler
 */
const on = (el, event, handler) => {
  if (el) el.addEventListener(event, handler);
};

/**
 * Clamp a number between min and max.
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Linear interpolation — used for smooth counter animations.
 * @param {number} start
 * @param {number} end
 * @param {number} t  - progress 0→1
 * @returns {number}
 */
const lerp = (start, end, t) => start + (end - start) * t;

/**
 * Easing function: easeOutQuart — decelerates toward end.
 * @param {number} t - progress 0→1
 * @returns {number}
 */
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

/* =============================================================================
   §2 — HAMBURGER / MOBILE NAVIGATION
   IPO: click hamburger → toggle is-open on panel → panel slides in/out
   Uses classList.toggle() — "Dynamic Content & Classes" (Slide 15)
   Decoupled: js-hamburger, js-mobile-panel, js-nav-close are JS hooks only.
   ============================================================================= */

/**
 * initMobileNav
 * Wires the hamburger button and close button to the mobile nav panel.
 * State variable: isMenuOpen (let — it mutates on toggle)
 */
function initMobileNav() {
  const hamburger = $(".js-hamburger"); // INPUT trigger
  const panel = $(".js-mobile-panel"); // OUTPUT target
  const closeBtn = $(".js-nav-close"); // Secondary INPUT trigger
  const body = document.body;

  // Guard: exit silently if elements don't exist on this page
  if (!hamburger || !panel) return;

  // STATE — Slide 11: "To react properly, the system needs memory"
  let isMenuOpen = false;

  /**
   * openMenu — PROCESS function
   * Applies is-open state class → CSS transition animates panel in
   */
  const openMenu = () => {
    isMenuOpen = true;
    panel.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden"; // Prevent background scroll
    // Animate hamburger bars → X (CSS handles the visual via is-open)
    hamburger.classList.add("is-active");
  };

  /**
   * closeMenu — PROCESS function
   * Removes is-open state class → CSS transition animates panel out
   */
  const closeMenu = () => {
    isMenuOpen = false;
    panel.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
    body.style.overflow = "";
    hamburger.classList.remove("is-active");
  };

  // Wire INPUT → PROCESS (Slide 10: addEventListener)
  on(hamburger, "click", () => {
    isMenuOpen ? closeMenu() : openMenu();
  });

  on(closeBtn, "click", closeMenu);

  // Close on backdrop click (click outside panel content)
  on(panel, "click", (e) => {
    if (e.target === panel) closeMenu();
  });

  // Close on Escape key — keyboard accessibility
  on(document, "keydown", (e) => {
    if (e.key === "Escape" && isMenuOpen) closeMenu();
  });

  // Close when a nav link inside panel is clicked
  $$(".js-mobile-link", panel).forEach((link) => {
    on(link, "click", closeMenu);
  });
}

/* =============================================================================
   §3 — STICKY NAV SCROLL BEHAVIOUR
   IPO: scroll event → check position → toggle is-scrolled on nav
   ============================================================================= */

/**
 * initStickyNav
 * Adds visual shadow/background intensity to nav once user scrolls past 80px.
 */
function initStickyNav() {
  const nav = $(".js-nav");
  if (!nav) return;

  // PROCESS: check scroll position, mutate nav class
  const handleScroll = () => {
    if (window.scrollY > 80) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  };

  // INPUT: scroll system trigger (Slide 9)
  on(window, "scroll", handleScroll);
  handleScroll(); // Run once on load to set initial state
}

/* =============================================================================
   §4 — TYPING EFFECT — hero-eyebrow-text
   IPO: page load → cycle through phrases → update textContent character by character
   Uses textContent (not innerHTML) — XSS safety (Slide 14)
   ============================================================================= */

/**
 * initTypingEffect
 * Creates a continuous typewriter effect on .js-typing-text element.
 * Cycles through an array of phrases endlessly.
 */
function initTypingEffect() {
  const el = $(".js-typing-text");
  if (!el) return;

  // STATE: current phrase index and character position
  const phrases = [
    "Abuja's Premier Repair Hub",
    "Fast, Honest & Reliable",
    "Phones · Laptops · Tablets",
    "30-Day Repair Warranty",
    "Suite 200, Wuse Zone 6, Abuja",
  ];

  let phraseIndex = 0; // let — mutates as we cycle
  let charIndex = 0; // let — mutates as we type/delete
  let isDeleting = false; // let — tracks direction of typing

  // Timing constants (const — never reassigned)
  const TYPE_SPEED = 65; // ms per character typed
  const DELETE_SPEED = 35; // ms per character deleted
  const PAUSE_END = 2200; // ms pause at full phrase
  const PAUSE_START = 400; // ms pause before typing next phrase

  /**
   * tick — recursive PROCESS function
   * Evaluates state, updates textContent, schedules next tick.
   */
  const tick = () => {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      // DELETING: shorten the displayed text
      charIndex--;
      el.textContent = currentPhrase.slice(0, charIndex); // textContent = safe (Slide 14)

      if (charIndex === 0) {
        // Done deleting — advance to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    } else {
      // TYPING: grow the displayed text
      charIndex++;
      el.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === currentPhrase.length) {
        // Done typing — pause then start deleting
        isDeleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    }
  };

  tick(); // Kick off the loop
}

/* =============================================================================
   §5 — ANIMATED COUNTER — hero-stat-number
   IPO: element enters viewport → count from 0 to target → update textContent
   Uses IntersectionObserver to trigger when stat scrolls into view.
   ============================================================================= */

/**
 * initCounters
 * Finds all .js-counter elements and animates them from 0 to their data-target.
 * data-target: the final number
 * data-suffix: any suffix like "+", "%", "hr"
 * data-prefix: any prefix (optional)
 */
function initCounters() {
  const counters = $$(".js-counter");
  if (!counters.length) return;

  const DURATION = 2000; // Animation duration in ms

  /**
   * animateCounter — PROCESS function
   * Uses requestAnimationFrame for smooth 60fps animation.
   * @param {Element} el - the counter element
   */
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target) || 0;
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const isDecimal = el.dataset.decimal === "true";
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = clamp(elapsed / DURATION, 0, 1);
      const eased = easeOutQuart(progress);
      const current = lerp(0, target, eased);

      // OUTPUT: update DOM using textContent (safe — Slide 14)
      el.textContent =
        prefix +
        (isDecimal
          ? current.toFixed(1)
          : Math.round(current).toLocaleString()) +
        suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Ensure exact final value
        el.textContent =
          prefix +
          (isDecimal ? target.toFixed(1) : target.toLocaleString()) +
          suffix;
      }
    };

    requestAnimationFrame(update);
  };

  // Use IntersectionObserver — trigger counter only when visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !entry.target.classList.contains("is-counted")
        ) {
          entry.target.classList.add("is-counted"); // STATE — prevent re-triggering
          animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((counter) => observer.observe(counter));
}

/* =============================================================================
   §6 — SCROLL-TRIGGERED REVEAL ANIMATIONS
   IPO: element enters viewport → add is-visible class → CSS fade-up transition
   IntersectionObserver replaces scroll event polling (more performant)
   ============================================================================= */

/**
 * initScrollReveal
 * Adds is-visible to any .js-reveal element once it enters the viewport.
 */
function initScrollReveal() {
  const revealEls = $$(".js-reveal");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // Animate once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* =============================================================================
   §7 — ACCORDION FAQ (contact.html)
   IPO: click FAQ item → toggle is-open → expand/collapse answer panel
   Uses classList.toggle() (Slide 15: Dynamic Content & Classes)
   Only one item open at a time (single-active state pattern)
   ============================================================================= */

/**
 * initFaqAccordion
 * Finds all .js-faq-item elements and makes them accordion-collapsible.
 * Clicking a header toggles its body panel open/closed.
 */
function initFaqAccordion() {
  const faqItems = $$(".js-faq-item");
  if (!faqItems.length) return;

  /**
   * closeAllExcept — PROCESS helper
   * Ensures only one FAQ is open at a time.
   * @param {Element} [except] - item to keep open
   */
  const closeAllExcept = (except) => {
    faqItems.forEach((item) => {
      if (item !== except) {
        item.classList.remove("is-open");
        const body = $(".js-faq-body", item);
        const icon = $(".js-faq-icon", item);
        if (body) body.style.maxHeight = "0px";
        if (icon) icon.textContent = "+";
        item.setAttribute("aria-expanded", "false");
      }
    });
  };

  faqItems.forEach((item) => {
    const trigger = $(".js-faq-trigger", item);
    const body = $(".js-faq-body", item);
    const icon = $(".js-faq-icon", item);

    if (!trigger || !body) return;

    // INPUT: click event
    on(trigger, "click", () => {
      const isCurrentlyOpen = item.classList.contains("is-open");

      // PROCESS: close all, then open this one if it was closed
      closeAllExcept(null); // close all

      if (!isCurrentlyOpen) {
        // OUTPUT: open this item
        item.classList.add("is-open");
        body.style.maxHeight = body.scrollHeight + "px"; // Fluid height
        if (icon) icon.textContent = "−";
        item.setAttribute("aria-expanded", "true");
      }
    });

    // Keyboard support — Enter/Space toggles
    on(trigger, "keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        trigger.click();
      }
    });
  });
}

/* =============================================================================
   §8 — ACCORDION PRICE TABLE (services.html)
   IPO: click price table header → toggle is-open → expand rows
   Each .js-price-table is independently collapsible.
   By default the first table is open, rest collapsed.
   ============================================================================= */

/**
 * initPriceAccordion
 * Makes each .js-price-table a collapsible accordion panel.
 * Click header to expand/collapse the price rows inside.
 */
function initPriceAccordion() {
  const priceTables = $$(".js-price-table");
  if (!priceTables.length) return;

  priceTables.forEach((table, index) => {
    const header = $(".js-price-header", table);
    const body = $(".js-price-body", table);
    const icon = $(".js-price-icon", table);

    if (!header || !body) return;

    // STATE: first table open by default
    if (index === 0) {
      table.classList.add("is-open");
      body.style.maxHeight = body.scrollHeight + "px";
      if (icon) icon.textContent = "−";
      header.setAttribute("aria-expanded", "true");
    } else {
      body.style.maxHeight = "0px";
      if (icon) icon.textContent = "+";
      header.setAttribute("aria-expanded", "false");
    }

    // INPUT: click header
    on(header, "click", () => {
      const isOpen = table.classList.contains("is-open");

      // PROCESS: toggle state
      if (isOpen) {
        // OUTPUT: collapse
        table.classList.remove("is-open");
        body.style.maxHeight = "0px";
        if (icon) icon.textContent = "+";
        header.setAttribute("aria-expanded", "false");
      } else {
        // OUTPUT: expand
        table.classList.add("is-open");
        body.style.maxHeight = body.scrollHeight + "px";
        if (icon) icon.textContent = "−";
        header.setAttribute("aria-expanded", "true");
      }
    });

    // Keyboard support
    on(header, "keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        header.click();
      }
    });
  });
}

/* =============================================================================
   §9 — REPAIR FORM VALIDATION & CONFIRMATION (services.html)
   IPO: submit click → validate fields → show error or success state
   Uses textContent for safe output (Slide 14)
   Decoupled: js- hooks for JS, is- classes for state
   ============================================================================= */

/**
 * initRepairForm
 * Handles the gadget repair request form on services.html.
 * Validates required fields and shows an inline confirmation message.
 */
function initRepairForm() {
  const form = $(".js-repair-form");
  const submitBtn = $(".js-repair-submit");
  const feedback = $(".js-repair-feedback");

  if (!form || !submitBtn) return;

  /**
   * validateField — PROCESS helper
   * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field
   * @returns {boolean} true if valid
   */
  const validateField = (field) => {
    const value = field.value.trim();
    const wrapper = field.closest(".js-field-group") || field.parentElement;

    if (!value) {
      field.classList.add("is-error");
      wrapper.classList.add("is-error");
      return false;
    }
    field.classList.remove("is-error");
    wrapper.classList.remove("is-error");
    return true;
  };

  // Clear error state on input (real-time feedback)
  $$(".js-required", form).forEach((field) => {
    on(field, "input", () => validateField(field));
    on(field, "change", () => validateField(field));
  });

  // INPUT: form submit click
  on(submitBtn, "click", (e) => {
    e.preventDefault();

    const requiredFields = $$(".js-required", form);
    let allValid = true;

    // PROCESS: validate all required fields
    requiredFields.forEach((field) => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      // OUTPUT: show error summary
      if (feedback) {
        feedback.textContent =
          "⚠️ Please fill in all required fields before submitting.";
        feedback.className =
          "js-repair-feedback form-feedback form-feedback--error is-visible";
        feedback.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // PROCESS: get values (textContent-safe reads from .value)
    const name = ($(".js-first-name", form)?.value || "").trim();
    const device = ($(".js-device-type", form)?.value || "").trim();
    const date = ($(".js-appt-date", form)?.value || "").trim();

    // OUTPUT: show success message (using textContent — XSS safe)
    if (feedback) {
      feedback.className =
        "js-repair-feedback form-feedback form-feedback--success is-visible";
      feedback.textContent = ""; // Clear first

      const icon = document.createElement("span");
      icon.textContent = "✅ ";

      const msg = document.createElement("span");
      msg.textContent = `Thank you${name ? ", " + name : ""}! Your ${device || "device"} repair request has been received. We'll confirm your ${date ? date + " " : ""}appointment within 2 hours.`;

      feedback.appendChild(icon);
      feedback.appendChild(msg);
      feedback.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // OUTPUT: disable submit to prevent double-submission (state mutation)
    submitBtn.disabled = true;
    submitBtn.classList.add("is-loading");
    submitBtn.textContent = "⏳ Submitting…";
  });
}

/* =============================================================================
   §10 — CONTACT FORM VALIDATION & CONFIRMATION (contact.html)
   Same IPO pattern as §9, adapted for the general enquiry form.
   ============================================================================= */

/**
 * initContactForm
 * Handles the general contact form on contact.html.
 */
function initContactForm() {
  const form = $(".js-contact-form");
  const submitBtn = $(".js-contact-submit");
  const feedback = $(".js-contact-feedback");

  if (!form || !submitBtn) return;

  const validateField = (field) => {
    const value = field.value.trim();
    const wrapper = field.closest(".js-field-group") || field.parentElement;

    // Email-specific validation
    if (field.type === "email" && value) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!emailOk) {
        field.classList.add("is-error");
        wrapper.classList.add("is-error");
        return false;
      }
    }

    if (!value) {
      field.classList.add("is-error");
      wrapper.classList.add("is-error");
      return false;
    }

    field.classList.remove("is-error");
    wrapper.classList.remove("is-error");
    return true;
  };

  $$(".js-required", form).forEach((field) => {
    on(field, "input", () => validateField(field));
    on(field, "change", () => validateField(field));
  });

  on(submitBtn, "click", (e) => {
    e.preventDefault();

    const requiredFields = $$(".js-required", form);
    let allValid = true;

    requiredFields.forEach((field) => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      if (feedback) {
        feedback.textContent = "⚠️ Please complete all required fields.";
        feedback.className =
          "js-contact-feedback form-feedback form-feedback--error is-visible";
        feedback.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const name = ($(".js-c-first-name", form)?.value || "").trim();

    if (feedback) {
      feedback.className =
        "js-contact-feedback form-feedback form-feedback--success is-visible";
      feedback.textContent = ""; // Clear

      const icon = document.createElement("span");
      icon.textContent = "✅ ";

      const msg = document.createElement("span");
      msg.textContent = `Message received${name ? ", " + name : ""}! Our team will respond within 2 business hours.`;

      feedback.appendChild(icon);
      feedback.appendChild(msg);
      feedback.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    submitBtn.disabled = true;
    submitBtn.classList.add("is-loading");
    submitBtn.textContent = "⏳ Sending…";
  });
}

/* =============================================================================
   §11 — ACTIVE NAV LINK HIGHLIGHTER
   IPO: page load → compare current URL to link href → add is-active class
   ============================================================================= */

/**
 * initActiveNav
 * Marks the correct nav link as active based on the current page URL.
 */
function initActiveNav() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  $$(".js-nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.includes(currentPath)) {
      link.classList.add("is-active");
    }
  });
}

/* =============================================================================
   §12 — BACK-TO-TOP BUTTON
   IPO: scroll past threshold → show button; click → smooth scroll to top
   ============================================================================= */

/**
 * initBackToTop
 * Shows a back-to-top floating button after scrolling 400px.
 */
function initBackToTop() {
  const btn = $(".js-back-to-top");
  if (!btn) return;

  // INPUT: scroll system trigger
  on(window, "scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.add("is-visible");
    } else {
      btn.classList.remove("is-visible");
    }
  });

  // INPUT: click the button
  on(btn, "click", () => {
    // OUTPUT: smooth scroll to top (behaviour change = DOM mutation)
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =============================================================================
   §13 — INIT ORCHESTRATOR
   DOMContentLoaded ensures DOM is fully parsed before any queries run (Slide 8).
   Each init function is self-contained and guards against missing elements,
   so all functions run safely on every page.
   ============================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ── §2 Mobile Navigation (all pages) ── */
  initMobileNav();

  /* ── §3 Sticky Nav (all pages) ── */
  initStickyNav();

  /* ── §4 Typing Effect (index.html — guards internally) ── */
  initTypingEffect();

  /* ── §5 Animated Counters (index.html — guards internally) ── */
  initCounters();

  /* ── §6 Scroll Reveal (all pages) ── */
  initScrollReveal();

  /* ── §7 FAQ Accordion (contact.html — guards internally) ── */
  initFaqAccordion();

  /* ── §8 Price Table Accordion (services.html — guards internally) ── */
  initPriceAccordion();

  /* ── §9 Repair Form (services.html — guards internally) ── */
  initRepairForm();

  /* ── §10 Contact Form (contact.html — guards internally) ── */
  initContactForm();

  /* ── §11 Active Nav Link (all pages) ── */
  initActiveNav();

  /* ── §12 Back-to-top (all pages) ── */
  initBackToTop();
});
