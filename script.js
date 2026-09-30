(function () {
  "use strict";

  /* ================================================================
     GLOBAL MOTION PREFERENCE
  ================================================================ */

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* ================================================================
     MOBILE NAVIGATION
  ================================================================ */

  var navToggle = document.querySelector(".nav-toggle");
  var navList = document.getElementById("nav-list");

  function closeNav() {
    if (!navList || !navToggle) return;

    navList.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function openNav() {
    if (!navList || !navToggle) return;

    navList.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
  }

  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      var isOpen = navList.classList.contains("is-open");

      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    /* Close menu after selecting a section */
    navList.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeNav();
      });
    });

    /* Close menu with Escape */
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeNav();

        if (navToggle) {
          navToggle.focus();
        }
      }
    });

    /* Close menu when clicking outside the navigation */
    document.addEventListener("click", function (event) {
      var clickedInsideNav =
        navList.contains(event.target) ||
        navToggle.contains(event.target);

      if (!clickedInsideNav) {
        closeNav();
      }
    });
  }


  /* ================================================================
     SCROLL-TRIGGERED REVEAL
  ================================================================ */

  var revealTargets = document.querySelectorAll("[data-reveal]");

  if (
    !prefersReducedMotion &&
    "IntersectionObserver" in window &&
    revealTargets.length
  ) {
    document.documentElement.classList.add("is-ready");

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");

            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px"
      }
    );

    revealTargets.forEach(function (target) {
      revealObserver.observe(target);
    });
  }


  /* ================================================================
     HERO SCROLL CUE
  ================================================================ */

  var scrollCue = document.querySelector(".scroll-cue");

  if (scrollCue) {
    scrollCue.addEventListener("click", function () {
      var targetSelector =
        scrollCue.getAttribute("data-scroll-target");

      var target = targetSelector
        ? document.querySelector(targetSelector)
        : null;

      if (target) {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth"
        });
      }
    });
  }


  /* ================================================================
     ACTIVE NAVIGATION ON SCROLL
  ================================================================ */

  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-list a");

  if (
    "IntersectionObserver" in window &&
    sections.length &&
    navLinks.length
  ) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var id = entry.target.getAttribute("id");

          var activeLink = document.querySelector(
            '.nav-list a[href="#' + id + '"]'
          );

          if (!activeLink) return;

          navLinks.forEach(function (link) {
            link.removeAttribute("aria-current");
          });

          activeLink.setAttribute("aria-current", "true");
        });
      },
      {
        threshold: 0.35,
        rootMargin: "-10% 0px -55% 0px"
      }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }
})();