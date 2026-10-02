/*
 * CraftMyFuture website: cookie consent + Google Analytics 4 (Consent Mode v2).
 * Loaded ONLY by the marketing and legal pages. Never include this file under /game/.
 *
 * Replace the measurement id below (the only place it appears).
 */
(function () {
  "use strict";

  var GA_MEASUREMENT_ID = "G-024MTB0BEQ";
  var STORAGE_KEY = "cmf-analytics-consent"; // "granted" | "denied"

  // Consent Mode v2: everything denied by default, before any Google tag runs.
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500
  });
  gtag("set", "ads_data_redaction", true);
  gtag("set", "url_passthrough", false);

  function readChoice() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function saveChoice(value) {
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* storage blocked: ask again next visit */ }
  }

  var loaded = false;
  // The Google tag is only downloaded after the visitor accepts (no requests to Google before consent).
  function loadAnalytics() {
    if (loaded || !/^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID) || GA_MEASUREMENT_ID === "G-" + "XXXXXXXXXX") { return; }
    loaded = true;
    gtag("consent", "update", { analytics_storage: "granted" }); // ads stay denied
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  }

  var TEXT = {
    en: {
      msg: "We would like to use analytics cookies (Google Analytics) to see how many people visit this website. No ads, and nothing in the game. Is that OK?",
      more: "Privacy", moreHref: "/privacy/",
      accept: "Accept", decline: "Decline", label: "Cookie choice"
    },
    tr: {
      msg: "Bu web sitesini kaç kişinin ziyaret ettiğini görmek için analiz çerezleri (Google Analytics) kullanmak istiyoruz. Reklam yok, oyunun içinde de yok. Uygun mu?",
      more: "Gizlilik", moreHref: "/tr/gizlilik/",
      accept: "Kabul et", decline: "Reddet", label: "Çerez tercihi"
    }
  };

  function showBanner() {
    if (document.getElementById("cmf-consent")) { return; }
    var lang = (document.documentElement.lang || "en").slice(0, 2) === "tr" ? "tr" : "en";
    var t = TEXT[lang];
    var box = document.createElement("div");
    box.id = "cmf-consent";
    box.className = "consent";
    box.setAttribute("role", "region");
    box.setAttribute("aria-label", t.label);
    var p = document.createElement("p");
    p.textContent = t.msg + " ";
    var a = document.createElement("a");
    a.href = t.moreHref; a.textContent = t.more;
    p.appendChild(a);
    var actions = document.createElement("div");
    actions.className = "actions";
    var decline = document.createElement("button");
    decline.type = "button"; decline.className = "btn btn-small btn-outline"; decline.textContent = t.decline;
    var accept = document.createElement("button");
    accept.type = "button"; accept.className = "btn btn-small btn-primary"; accept.textContent = t.accept;
    actions.appendChild(decline); actions.appendChild(accept);
    box.appendChild(p); box.appendChild(actions);
    document.body.appendChild(box);

    decline.addEventListener("click", function () {
      saveChoice("denied");
      if (loaded) { gtag("consent", "update", { analytics_storage: "denied" }); }
      box.remove();
    });
    accept.addEventListener("click", function () {
      saveChoice("granted");
      box.remove();
      loadAnalytics();
    });
  }

  function init() {
    var choice = readChoice();
    if (choice === "granted") { loadAnalytics(); }
    else if (choice !== "denied") { showBanner(); }
    // Footer "Cookie settings" button lets visitors change their mind.
    var btns = document.querySelectorAll("[data-cookie-settings]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", showBanner);
    }
  }

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); }
  else { init(); }
})();
