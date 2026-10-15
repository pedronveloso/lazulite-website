(function () {
  var controller = window.LazuliteTheme;
  var switcher = document.querySelector("[data-theme-switcher]");
  if (!controller || !switcher) return;
  var options = switcher.querySelectorAll('input[name="theme-preference"]');

  function syncPreference() {
    for (var i = 0; i < options.length; i += 1) {
      var selected = options[i].value === controller.getPreference();
      options[i].checked = selected;
      if (selected) {
        switcher.querySelector("[data-theme-label]").textContent = options[i].getAttribute("data-label");
      }
    }
  }

  controller.subscribe(syncPreference);
  syncPreference();

  function closeThemeMenu() {
    switcher.removeAttribute("open");
    switcher.querySelector("summary").focus();
  }

  switcher.addEventListener("change", function (event) {
    if (event.target.matches('input[name="theme-preference"]')) {
      controller.setPreference(event.target.value);
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
  // Reveal only after labels and event handlers are ready; space is already reserved.
  switcher.parentElement.setAttribute("data-theme-ready", "");
}());
