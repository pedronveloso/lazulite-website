(function () {
  var STORAGE_KEY = "lazulite-language";

  function normalizeLanguage(value) {
    if (!value) {
      return "en";
    }

    var lower = String(value).toLowerCase();

    if (lower.indexOf("es") === 0) {
      return "es";
    }

    if (lower.indexOf("zh") === 0) {
      return "zh";
    }

    return "en";
  }

  function detectPreferredLanguage() {
    var preferred = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || "en"];

    for (var i = 0; i < preferred.length; i += 1) {
      var lang = String(preferred[i]).toLowerCase();

      if (lang.indexOf("es") === 0) {
        return "es";
      }

      if (
        lang.indexOf("zh") === 0 ||
        lang.indexOf("zh-cn") === 0 ||
        lang.indexOf("zh-sg") === 0 ||
        lang.indexOf("zh-hans") === 0
      ) {
        return "zh";
      }
    }

    return "en";
  }

  function getStoredLanguage() {
    try {
      var storedValue = window.localStorage.getItem(STORAGE_KEY);
      return storedValue ? normalizeLanguage(storedValue) : null;
    } catch (error) {
      return null;
    }
  }

  function setStoredLanguage(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, normalizeLanguage(value));
    } catch (error) {
      // Ignore storage failures and keep navigation working.
    }
  }

  function findSwitcher() {
    return document.querySelector("[data-language-switcher]");
  }

  function findOptions(switcher) {
    return switcher ? switcher.querySelectorAll("[data-language-option]") : [];
  }

  function findUrlForLanguage(switcher, language) {
    var options = findOptions(switcher);

    for (var index = 0; index < options.length; index += 1) {
      if (options[index].getAttribute("data-language") === language) {
        return options[index].getAttribute("data-url");
      }
    }

    return null;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var switcher = findSwitcher();

    if (!switcher) {
      return;
    }

    switcher.addEventListener("click", function (event) {
      var option = event.target.closest("[data-language-option]");

      if (!option) {
        return;
      }

      setStoredLanguage(option.getAttribute("data-language"));

      var menu = option.closest("details");

      if (menu) {
        menu.removeAttribute("open");
      }
    });

    var currentLanguage = normalizeLanguage(document.documentElement.lang);
    var storedLanguage = getStoredLanguage();
    var preferredLanguage = storedLanguage || detectPreferredLanguage();
    var isRootPath = window.location.pathname === "/";

    if (!isRootPath || !preferredLanguage || preferredLanguage === currentLanguage) {
      return;
    }

    var redirectUrl = findUrlForLanguage(switcher, preferredLanguage);

    if (redirectUrl) {
      window.location.replace(redirectUrl);
    }
  });
}());
