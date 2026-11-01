"""Keep localized FAQ groups, rich answers, schema, and incoming links aligned."""

from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parent.parent / "public-seo-check"
LANGUAGES = ("en", "es", "it", "zh", "ja")
GROUPS = {
    "permissions": ("special_permissions", "adb_permissions_help"),
    "codecs": ("active_codec", "ldac_active", "supported_vs_active", "codec_control"),
    "compatibility": ("tablet_support", "codec_support", "lhdc_versions", "bluetooth_audio_devices", "wired_headphones"),
    "audio-path": ("codec_expectations", "hardware_offload", "vendor_lookup"),
    "privacy": ("mobile_data",),
    "usage": ("battery_impact",),
}
QUESTION_IDS = GROUPS["codecs"]
DEFINITION_TERMS = {
    "en": ("Supported codecs", "The active codec"),
    "es": ("Los códecs compatibles", "El códec activo"),
    "it": ("I codec supportati", "Il codec attivo"),
    "zh": ("支持的编解码器", "当前使用的编解码器"),
    "ja": ("対応コーデック", "使用中のコーデック"),
}


def normalized(text):
    return " ".join(text.split())


class DiscoveryMarkup(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids = Counter()
        self.analytics = Counter()
        self.questions = []
        self.links = []
        self.navigation = []
        self.schemas = []
        self.section = None
        self.question = None
        self.in_summary = False
        self.in_navigation = False
        self.in_strong = False
        self.script = None
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids[attrs["id"]] += 1
        if tag == "h2":
            self.section = attrs.get("id")
        if tag == "nav" and "faq-nav" in attrs.get("class", "").split():
            self.in_navigation = True
        if tag == "details":
            if "data-umami-faq" in attrs:
                self.analytics[attrs["data-umami-faq"]] += 1
            self.question = {
                "id": attrs.get("id"),
                "event": attrs.get("data-umami-faq"),
                "section": self.section,
                "summary": "",
                "answer": "",
                "strong": [],
                "paragraphs": 0,
            }
        if tag == "summary":
            self.in_summary = True
        if self.question is not None and not self.in_summary:
            if tag in ("p", "li", "h3", "pre", "br"):
                self.question["answer"] += "\n"
            if tag == "p":
                self.question["paragraphs"] += 1
            if tag == "strong":
                self.in_strong = True
                self.question["strong"].append("")
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.script = ""
        if tag == "a":
            self.links.append(attrs)
            if self.in_navigation:
                self.navigation.append(attrs.get("href"))

    def handle_endtag(self, tag):
        if tag == "summary":
            self.in_summary = False
        if tag == "nav":
            self.in_navigation = False
        if tag == "strong":
            self.in_strong = False
        if self.question is not None and tag in ("p", "li", "h3", "pre"):
            self.question["answer"] += "\n"
        if tag == "details" and self.question is not None:
            self.questions.append(self.question)
            self.question = None
        if tag == "script" and self.script is not None:
            self.schemas.append(json.loads(self.script))
            self.script = None

    def handle_data(self, text):
        if self.script is not None:
            self.script += text
        if self.question is not None:
            key = "summary" if self.in_summary else "answer"
            self.question[key] += text
            if self.in_strong:
                self.question["strong"][-1] += text


def faq(language):
    prefix = "" if language == "en" else language
    return DiscoveryMarkup((ROOT / prefix / "faq/index.html").read_text())


class DiscoveryFaqTest(unittest.TestCase):
    def test_group_order_navigation_and_preserved_question_identifiers(self):
        expected = [(section, event) for section, events in GROUPS.items() for event in events]
        for language in LANGUAGES:
            with self.subTest(language=language):
                page = faq(language)
                questions = [q for q in page.questions if q["event"] is not None]
                self.assertEqual([(q["section"], q["event"]) for q in questions], expected)
                self.assertEqual(page.navigation, ["#" + section for section in GROUPS])
                for section in GROUPS:
                    self.assertEqual(page.ids[section], 1)
                for question in questions:
                    self.assertEqual(page.analytics[question["event"]], 1)
                anchors = {q["event"]: q["id"] for q in questions if q["id"] is not None}
                self.assertEqual(anchors, {**{key: key for key in QUESTION_IDS},
                                           "tablet_support": "tablet_support",
                                           "lhdc_versions": "lhdc-versions"})
                for anchor in anchors.values():
                    self.assertEqual(page.ids[anchor], 1)

    def test_plain_schema_answers_match_visible_rich_answers_in_reading_order(self):
        for language in LANGUAGES:
            with self.subTest(language=language):
                page = faq(language)
                schemas = [s for s in page.schemas if s.get("@type") == "FAQPage"]
                self.assertEqual(len(schemas), 1)
                entities = schemas[0]["mainEntity"]
                self.assertEqual(len(entities), 11)
                questions = [q for q in page.questions if q["event"] is not None]
                positions = []
                for entity in entities:
                    matches = [i for i, q in enumerate(questions)
                               if normalized(q["summary"]) == normalized(entity["name"])]
                    self.assertEqual(len(matches), 1)
                    positions.extend(matches)
                    answer = entity["acceptedAnswer"]["text"]
                    self.assertNotRegex(answer, r"</?(?:p|strong|li|ol|ul|a|code)\b")
                    self.assertEqual(normalized(answer), normalized(questions[matches[0]]["answer"]))
                self.assertEqual(positions, sorted(set(positions)))

    def test_supported_and_active_definitions_have_separate_paragraphs_and_emphasis(self):
        for language, terms in DEFINITION_TERMS.items():
            with self.subTest(language=language):
                question = next(q for q in faq(language).questions if q["event"] == "supported_vs_active")
                self.assertEqual(question["paragraphs"], 3)
                self.assertEqual(question["strong"], list(terms))

    def test_text_extraction_preserves_inline_words_and_block_boundaries(self):
        page = DiscoveryMarkup('<details><summary>Question?</summary><div>'
                               '<p><strong>Supported codecs</strong> describe capabilities.</p>'
                               '<p>The <strong>active codec</strong> is selected.</p>'
                               '<ul><li>One</li><li>Two</li></ul></div></details>')
        self.assertEqual(normalized(page.questions[0]["answer"]),
                         "Supported codecs describe capabilities. The active codec is selected. One Two")

    def test_homepage_codec_help_links_to_its_localized_answer(self):
        for language in LANGUAGES:
            with self.subTest(language=language):
                prefix = "" if language == "en" else language
                home = DiscoveryMarkup((ROOT / prefix / "index.html").read_text())
                target = f"/{prefix + '/' if prefix else ''}faq/#active_codec"
                links = [link for link in home.links if link.get("href", "").endswith("#active_codec")]
                self.assertEqual([link["href"] for link in links], [target])


if __name__ == "__main__":
    unittest.main()
