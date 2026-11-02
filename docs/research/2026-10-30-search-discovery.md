# Lazulite search discovery research

Research date: 2026-10-30. These findings informed the homepage and codec FAQ
revision. They are keyword hypotheses, not evidence of Google Play search demand
or a promise of improved rankings.

## Sources and method

The reviewed surfaces were the [English homepage](https://lazulite.app/) and
[English US Play listing](https://play.google.com/store/apps/details?id=com.pedronveloso.lazulite&hl=en&gl=US),
alongside the shared Android and website product references.

The initial direct Google Trends page request returned HTTP 429. The comparisons
below were subsequently retrieved through Firecrawl Alexandria's
`firecrawl-trends` provider, using `trends/interest_over_time` (workflow version
1.2.0). Provider result links are included in the table. This is intermediary
retrieval, not an independently verified Google CSV export. No raw weekly-series
export is committed with this note; the values record the provider's reported
rounded averages at research time, and a fresh sample may differ.

Settings: Google Web Search, all categories (`0`), search terms rather than topic
IDs, 2025-10-26 through 2026-10-24 inclusive, 52 complete weekly periods. The
incomplete week containing the research date was excluded. Country filters are
shown below; a country filter does not restrict the searcher's language.

| Market and provider result | Terms and average relative interest, in comparison order |
| --- | --- |
| [Worldwide](https://trends.firecrawl.dev/explore?q=LDAC%2CaptX%2CBluetooth+codec%2CBluetooth+audio%2CBluetooth+codec+checker&date=2025-10-26+2026-10-24) | LDAC 8; aptX 6; Bluetooth codec 8; Bluetooth audio 41; Bluetooth codec checker 0 |
| [US](https://trends.firecrawl.dev/explore?q=LDAC%2CaptX%2CBluetooth+codec%2CBluetooth+audio%2CBluetooth+codec+checker&geo=US&date=2025-10-26+2026-10-24) | LDAC 2; aptX 2; Bluetooth codec 4; Bluetooth audio 26; Bluetooth codec checker 0 |
| [UK](https://trends.firecrawl.dev/explore?q=LDAC%2CaptX%2CBluetooth+codec%2CBluetooth+audio%2CBluetooth+codec+checker&geo=GB&date=2025-10-26+2026-10-24) | LDAC 8; aptX 7; Bluetooth codec 12; Bluetooth audio 46; Bluetooth codec checker 0 |
| [Spain](https://trends.firecrawl.dev/explore?q=LDAC%2CaptX%2Cc%C3%B3dec+Bluetooth%2Ccodec+Bluetooth%2Caudio+Bluetooth&geo=ES&date=2025-10-26+2026-10-24) | LDAC 11; aptX 11; códec Bluetooth 0; codec Bluetooth 17; audio Bluetooth 56 |
| [Italy](https://trends.firecrawl.dev/explore?q=LDAC%2CaptX%2Ccodec+Bluetooth%2Caudio+Bluetooth%2Ccodec+Bluetooth+Android&geo=IT&date=2025-10-26+2026-10-24) | LDAC 7; aptX 6; codec Bluetooth 7; audio Bluetooth 62; codec Bluetooth Android 0 |
| [Japan](https://trends.firecrawl.dev/explore?q=LDAC%2CaptX%2CBluetooth+%E3%82%B3%E3%83%BC%E3%83%87%E3%83%83%E3%82%AF%2C%E3%82%B3%E3%83%BC%E3%83%87%E3%83%83%E3%82%AF+%E7%A2%BA%E8%AA%8D%2C%E9%9F%B3%E9%A3%9B%E3%81%B3&geo=JP&date=2025-10-26+2026-10-24) | LDAC 64; aptX 40; Bluetooth コーデック 11; コーデック 確認 1; 音飛び 18 |
| [Worldwide, including Simplified Chinese terms](https://trends.firecrawl.dev/explore?q=LDAC%2CLHDC%2C%E8%93%9D%E7%89%99%E7%BC%96%E8%A7%A3%E7%A0%81%E5%99%A8%2C%E8%93%9D%E7%89%99%E9%9F%B3%E9%A2%91%2C%E8%93%9D%E7%89%99%E7%BC%96%E7%A0%81&date=2025-10-26+2026-10-24) | LDAC 58; LHDC 8; 蓝牙编解码器 0; 蓝牙音频 2; 蓝牙编码 0 |

To reproduce the main comparison in Google's own interface, open
[Google Trends Explore](https://trends.google.com/trends/explore?date=2025-10-26%202026-10-24&q=LDAC,aptX,Bluetooth%20codec,Bluetooth%20audio,Bluetooth%20codec%20checker).
Use the terms and geography from each row for localized comparisons.

A [narrower worldwide comparison](https://trends.firecrawl.dev/explore?q=Bluetooth+audio+inspector%2CBluetooth+codec+checker%2CBluetooth+codec+changer%2CLDAC+checker%2CLazulite&date=2025-10-26+2026-10-24)
returned rounded averages of 0, 0, 4, 0, and 62 respectively. These are sparse
signals for app-specific phrases. "Lazulite" is also a mineral name, so its
unqualified searches must not be counted as app awareness.

A [five-year worldwide comparison](https://trends.firecrawl.dev/explore?q=LDAC%2CaptX%2CBluetooth+codec%2CBluetooth+audio%2CBluetooth+codec+checker&date=today+5-y)
showed higher average relative interest for the broad terms in the latest
complete 52 weeks than the first 52 weeks, with fluctuations. The relative
`today 5-y` link moves over time; the research-time span began in October 2021
and ended in October 2026, excluding the latest partial week for that comparison.
This is not evidence of steady growth or absolute search-volume growth.

Related-query requests for worldwide Bluetooth codec, LDAC, and 蓝牙音频, and
country-specific codec queries in Spain, Italy, and Japan returned empty top and
rising lists. No rising-keyword recommendations are inferred from those results.

## Interpretation and decisions

- Scores are normalized within each comparison. Do not compare scores across
  table rows or across different term groups, dates, or geographies. They are not
  monthly search counts, store popularity scores, or market-size estimates.
- A zero can reflect low volume or rounding. It does not establish no demand.
  Google also cautions against interpreting isolated low-volume spikes as real
  demand. See [Google's data explanation](https://support.google.com/trends/answer/4365533?hl=en).
- Broad Bluetooth-audio interest includes hardware, connection, and playback needs
  Lazulite does not serve. Favor capability fit over the largest score.
- Use active-codec and audio-path explanations as website entry points. The four
  added FAQ questions are product-fit hypotheses, not validated high-volume terms.
- Keep LDAC prominent in Japanese examples. Preserve natural Spanish spelling,
  regardless of the zero for the accented query. Do not infer a Chinese-speaking
  audience's preferences from worldwide codec-name searches or treat Google
  searches in one geography as representative of all Simplified Chinese users.
  Retain the established LHDC/MIHC emphasis.
- Keep the Play title and short description unchanged for this revision. Validate
  "Bluetooth codec" emphasis with Play evidence before proposing a store-title
  experiment. Do not advertise codec-changing capabilities.

[Google Play discovery guidance](https://support.google.com/googleplay/android-developer/answer/4448378?hl=en)
supports clear listing text, localization, and an effective app experience.
[Play acquisition reporting definitions](https://support.google.com/googleplay/android-developer/answer/9859173?hl=en)
explain the available search-term and acquisition dimensions. These sources do
not establish that rewriting the website will directly improve Play rankings.

## Measurement baseline and follow-up

No authenticated Search Console, Umami, or Play Console reports or exports were
available in this implementation session. All baseline metrics below are
**unavailable**, not zero. No experiment outcome or publication date is recorded.

| Source | Baseline to export | Current status |
| --- | --- | --- |
| Search Console | Web impressions, clicks, CTR, and position by query and landing page; segment by country and device where useful | Unavailable |
| Existing website analytics | Page views/visitors and `download_intent` counts by page/language and `hero`/`footer` placement; record the denominator used for any click rate | Unavailable |
| Play Console | Available listing visitors, acquisitions, and conversion rates by search term, country, and listing language where supported; retain source/referral distinctions | Unavailable |

The research-date reference window is **2026-10-02 through 2026-10-29**,
the preceding 28 complete days. Export this window if accessible. Before actual
publication, also establish the immediately preceding 28 complete days for the
rollout comparison. Record each source's reporting time zone, filters, reporting
lag, and any suppressed low-volume rows; never substitute zero for missing data.

Let `T` be the actual publication date in each reporting source's time zone:

- Baseline: `T - 28` through `T - 1`, inclusive.
- Follow-up: `T + 1` through `T + 28`, inclusive; exclude the partial rollout day.
- Record the deployed revision, publication timestamp, and date ranges before
  exporting. Wait for reporting to complete before comparing.
- Log overlapping advertising campaigns, price promotions, app releases, listing
  edits, and outages. The English listing had a price promotion at research time;
  record its actual dates when evaluating conversion.
- Compare the same segments and denominators. Website clicks indicate outbound
  interest, not installations; do not divide Play acquisitions by website clicks
  and call the result an attributed conversion rate.
- Report small counts and descriptive changes without claiming statistical
  significance or causation. Search indexing and seasonality can affect results.
  Reassess after more observations if the 28-day sample is inconclusive.

Use existing measurement only. This revision adds no new tracking integrations,
cookies, attribution parameters, or recurring automation. Missing console access
does not block the content changes.
