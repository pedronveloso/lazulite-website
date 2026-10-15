(function () {
  var STORAGE_KEY = "lazulite-theme";
  var root = document.documentElement;
  var timer;
  var switcher;
  var options;

  function normalize(value) {
    return value === "light" || value === "dark" ? value : "system";
  }

  function readPreference() {
    try {
      return normalize(window.localStorage.getItem(STORAGE_KEY));
    } catch (error) {
      return "system";
    }
  }

  function query(scheme) {
    try {
      return window.matchMedia("(prefers-color-scheme: " + scheme + ")");
    } catch (error) {
      return null;
    }
  }

  var preference = readPreference();
  var darkQuery = query("dark");
  var lightQuery = query("light");

  function applyTheme() {
    window.clearTimeout(timer);
    var theme = preference;
    if (preference === "system") {
      if (darkQuery && darkQuery.matches) {
        theme = "dark";
      } else if (lightQuery && lightQuery.matches) {
        theme = "light";
      } else {
        var now = new Date();
        var hour = now.getHours();
        theme = hour >= 7 && hour < 19 ? "light" : "dark";
        var boundary = new Date(now.getTime());
        boundary.setHours(hour < 7 ? 7 : hour < 19 ? 19 : 31, 0, 0, 0);
        timer = window.setTimeout(applyTheme, boundary.getTime() - now.getTime());
      }
    }
    root.setAttribute("data-theme", theme);
    var chrome = document.querySelector('meta[name="theme-color"]');
    if (chrome) {
      chrome.removeAttribute("media");
      chrome.setAttribute("content", chrome.getAttribute("data-" + theme));
    }
    var scheme = document.querySelector('meta[name="color-scheme"]');
    if (scheme) scheme.setAttribute("content", theme);

    if (options) {
      for (var i = 0; i < options.length; i += 1) {
        var selected = options[i].value === preference;
        options[i].checked = selected;
        if (selected) {
          switcher.querySelector("[data-theme-label]").textContent = options[i].getAttribute("data-label");
        }
      }
    }
  }

  function savePreference(value) {
    preference = normalize(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, preference);
    } catch (error) {
      // Keep this page's selection even when persistence is unavailable.
    }
    applyTheme();
  }

  // This script runs synchronously in the head, before the stylesheet.
  applyTheme();
  [darkQuery, lightQuery].forEach(function (media) {
    if (!media) return;
    if (media.addEventListener) media.addEventListener("change", applyTheme);
    else if (media.addListener) media.addListener(applyTheme);
  });
  window.addEventListener("pageshow", applyTheme);
  window.addEventListener("focus", applyTheme);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) applyTheme();
  });
  window.addEventListener("storage", function (event) {
    if (event.key === STORAGE_KEY || event.key === null) {
      preference = readPreference();
      applyTheme();
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    switcher = document.querySelector("[data-theme-switcher]");
    if (!switcher) return;
    options = switcher.querySelectorAll('input[name="theme-preference"]');
    applyTheme();
    switcher.parentElement.hidden = false;

    function closeThemeMenu() {
      switcher.removeAttribute("open");
      switcher.querySelector("summary").focus();
    }

    switcher.addEventListener("change", function (event) {
      if (event.target.matches('input[name="theme-preference"]')) {
        savePreference(event.target.value);
      }
    });
    switcher.addEventListener("click", function (event) {
      if (event.target.matches('input[name="theme-preference"]')) closeThemeMenu();
    });
    switcher.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && event.target.matches('input[name="theme-preference"]')) {
        event.preventDefault();
        closeThemeMenu();
      }
    });

    var menus = document.querySelectorAll("[data-theme-switcher], [data-language-switcher]");
    for (var i = 0; i < menus.length; i += 1) {
      menus[i].addEventListener("toggle", function (event) {
        if (!event.target.open) return;
        for (var j = 0; j < menus.length; j += 1) {
          if (menus[j] !== event.target) menus[j].removeAttribute("open");
        }
      });
    }
    document.addEventListener("click", function (event) {
      for (var i = 0; i < menus.length; i += 1) {
        if (!menus[i].contains(event.target)) menus[i].removeAttribute("open");
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      for (var i = 0; i < menus.length; i += 1) {
        if (menus[i].open) {
          menus[i].removeAttribute("open");
          menus[i].querySelector("summary").focus();
          event.preventDefault();
        }
      }
    });
  });
}());
