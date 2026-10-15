(function () {
  var STORAGE_KEY = "lazulite-theme";
  var root = document.documentElement;
  var timer;
  var listeners = [];

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
    var color = chrome && chrome.getAttribute("data-" + theme);
    if (color && color.trim()) {
      chrome.setAttribute("content", color);
      chrome.removeAttribute("media");
      var metas = document.querySelectorAll('meta[name="theme-color"]');
      for (var i = 1; i < metas.length; i += 1) metas[i].remove();
    }
    var scheme = document.querySelector('meta[name="color-scheme"]');
    if (scheme) scheme.setAttribute("content", theme);

    listeners.slice().forEach(function (listener) { listener(); });
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

  // One controller is shared by the inline startup and deferred menu wiring.
  window.LazuliteTheme = {
    getPreference: function () { return preference; },
    setPreference: savePreference,
    subscribe: function (listener) {
      listeners.push(listener);
      return function () { listeners = listeners.filter(function (entry) { return entry !== listener; }); };
    },
  };

  // Hugo inlines this core before the stylesheet; no startup download is needed.
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

}());
