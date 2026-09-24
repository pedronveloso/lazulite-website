(function () {
  function trackEvent(name, data) {
    if (!window.umami || typeof window.umami.track !== "function") {
      return;
    }

    window.umami.track(name, data);
  }

  function trackLinkClicks(selector, name, data) {
    document.querySelectorAll(selector).forEach(function (link) {
      link.addEventListener("click", function () {
        trackEvent(name, data);
      });
    });
  }

  function trackSetupAndContactClicks() {
    trackLinkClicks(
      'a[href="https://developer.android.com/tools/releases/platform-tools"]',
      "setup_resource_click",
      { resource: "adb_platform_tools" }
    );
    trackLinkClicks(
      'a[href="https://shizuku.rikka.app/"]',
      "setup_resource_click",
      { resource: "shizuku_site" }
    );
    trackLinkClicks(
      'a[href="https://www.youtube.com/shorts/pnHNdU6LppA"]',
      "setup_resource_click",
      { resource: "shizuku_video" }
    );
    trackLinkClicks(
      'a[href="mailto:lazuliteapp@gmail.com"]',
      "contact_intent",
      { source: "faq" }
    );
  }

  function trackFaqAnswerOpens() {
    var trackedQuestions = new Set();
    var questions = document.querySelectorAll("[data-umami-faq]");

    questions.forEach(function (question) {
      question.addEventListener("toggle", function () {
        var questionId = question.getAttribute("data-umami-faq");

        if (
          !question.open ||
          !questionId ||
          trackedQuestions.has(questionId) ||
          !window.umami ||
          typeof window.umami.track !== "function"
        ) {
          return;
        }

        trackedQuestions.add(questionId);
        trackEvent("faq_answer_open", { question: questionId });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    trackSetupAndContactClicks();
    trackFaqAnswerOpens();
  });
}());
