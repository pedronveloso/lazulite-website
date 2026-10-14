# Lazulite Website Product Guidance

Use this document when writing or translating website copy. It adapts the shared
[Android product reference](../../android/lazulite-android/PRODUCT.md) for the web
audience and records website-specific decisions. The Android reference remains
the source of truth for shipped app capabilities and shared product identity.
Development workflows belong in [AGENTS.md](AGENTS.md); web visual specifications
belong in [DESIGN.md](DESIGN.md).

## Purpose and audience

Help Android audio enthusiasts understand what happens between their playback
app and their Bluetooth audio device, then give them a useful next step: download
Lazulite, understand a capability, complete setup, or find troubleshooting help.

Write for audiophiles, curious listeners checking their setup, and power users
comparing devices or investigating playback problems. Visitors may recognize
LDAC or AAC without understanding every metric or Android internals. Explain
technical concepts briefly and put deeper explanations in the FAQ.

Use **Lazulite** as the everyday product name and **Bluetooth audio inspector** as
the short descriptor. A suitable product description is:

> Lazulite shows which Bluetooth codecs your phone and audio device support,
> the codec and encoding quality in use, and the audio path from your playback
> app to your Bluetooth audio device.

Include headphones, earbuds, speakers, car audio systems, and Bluetooth audio
receivers in compatibility examples. Use "Bluetooth audio device" when speaking
generally, so visitors do not mistake Lazulite for a headphones-only tool.

## Product story and claim boundaries

Organize the homepage around what visitors can learn:

- Which codecs their phone and receiving device support, and which codec the
  current connection actually uses.
- The reported encoding quality, sample rate, bit depth, and available bitrate
  or quality-mode information.
- The audio path from playback app output through Android and Bluetooth to the
  receiving device, including reported format changes.
- Recent Android-reported playback issues and useful configuration tips.

Keep these distinctions in homepage copy, FAQs, captions, metadata, and release
notes:

- Lazulite inspects Bluetooth audio. Wired-audio inspection, audio playback,
  equalization, and automatic codec control are outside its functionality.
- Available details vary by Android version, manufacturer, playback app, codec,
  connected device, and hardware offload. Supported does not mean currently used.
- App output is not proof of an original recording's fidelity or a streaming
  subscription's quality. Technical format ratings do not measure perceived sound.
- Refreshes provide observations. Prefer "current" or "recently observed"; qualify
  "real-time" wording with the actual refresh behavior rather than suggesting
  continuous background monitoring.
- Playback health reports newly observed, attributable diagnostic evidence.
  Missing information is unavailable, not zero or a fault. A partial check must
  not read as a full all-clear.
- Do not claim measured wireless packet loss, detected Wi-Fi interference, a
  proven root cause, guaranteed audible disruption, or guaranteed sound-quality
  improvements. Reported latency is not measured end-to-end Bluetooth latency.
- Hardware offload concerns processing efficiency; a supported-codec list does
  not establish that the current connection uses offload.

For setup guidance, recommend Shizuku for most users. ADB is an alternative for
people comfortable with computer-based setup; root access is for already rooted
phones. Do not suggest that rooting is required. Keep detailed steps in the FAQ.

## Voice and terminology

Write like someone explaining the app to a curious listener: friendly, clear,
and direct. Use plain words, concrete examples, and short explanations of
technical terms. Say what visitors can see or do and make next steps specific.
Avoid stock marketing phrases, grand claims, exaggerated enthusiasm, repetitive
disclaimers, and language that belittles a user's setup.

Use straight apostrophes (') and quotation marks (") in Latin-script copy.
Avoid em dashes and curly apostrophes. Use natural local punctuation in
translations.

| Term | Website meaning |
| --- | --- |
| Source device | The Android phone or sending device; distinguish it from playback app output. |
| Playback app output | The format the app sends to Android, where reported; not necessarily the original file's format. |
| Bluetooth transport | The codec and configuration used to encode and transmit audio over Bluetooth. |
| Destination | The connected Bluetooth audio device receiving playback. |
| Active codec | The codec selected for the current Bluetooth connection. |
| Supported codecs | Separately reported capabilities of the phone and receiver; not proof of current use. |
| Encoding quality | A reported codec quality mode or bitrate setting, not a measurement of perceived sound. |
| Playback health | Recent, attributable diagnostic evidence evaluated across refreshes. |
| Audio underrun | An audio buffer running short of data; its cause and audible effect are unproven. |
| Outgoing buffer drop | Android discarding outgoing audio data; not measured wireless packet loss. |
| Reported latency | Android-reported track or output-path latency, not measured end-to-end latency. |

Prefer wording such as "Android reported new audio underruns", "No new issues
observed", "No new issues in the checks available", "Rate conversion likely",
and "Unavailable" when it matches the evidence.

## Languages and localization

The website supports English (`en`), Spanish (`es`), Italian (`it`), Simplified
Chinese (`zh`, corresponding to the app's `zh-CN`), and Japanese (`ja`).
Use English as the source for shared meaning and claims, while adapting examples
and emphasis to each audience.

Translate meaning into natural local phrasing rather than copying English
sentence structure. Preserve distinctions between playback app output, Bluetooth
transport, and the receiving device, along with uncertainty in diagnostics.
Do not carry an existing overstatement into a new translation.

Preserve official product and codec spellings, including Lazulite, Shizuku, aptX,
LDAC, LHDC, MIHC, and Opus. Keep commands, technical identifiers, placeholders,
and units such as kbps, kHz, and ms intact. Translate descriptive terms such as
bit depth and channel counts naturally and consistently.

Use short action labels and specific recovery steps. Permission and privacy
copy must distinguish required access, optional choices, and data sharing.
Shared FAQ capabilities and qualifications should remain aligned across all
five languages; homepage examples may differ for a documented audience reason.

### Japanese

Use concise labels and friendly, lightly polite explanations in です・ます form,
rather than formal customer-service language. Keep required permission steps
direct. Avoid slang, forced familiarity, excessive exclamation marks, repeated
あなた, and stiff phrasing such as 「ご確認いただけますと幸いです」.

Use Japanese punctuation, including 「」 for UI labels and 。 for complete
sentences. Labels usually need no final punctuation. Avoid inserting spaces
between every Japanese and Latin word; keep spaces within technical values such
as `990 kbps`. Use familiar audio terminology and explain specialist diagnostics
on first use.

| Concept | Preferred Japanese |
| --- | --- |
| Codec / supported codecs | コーデック / 対応コーデック |
| Sample rate | サンプリング周波数 |
| Bit depth / bitrate | ビット深度 / ビットレート |
| Hi-Res audio | ハイレゾ音源 |
| Source device / destination | 送信元 / 出力先 |
| Playback app output | アプリの音声出力 |
| Audio path / Bluetooth transport | 音声経路 / Bluetooth伝送 |
| Encoding quality | エンコード品質 |
| Playback health | 再生状態の診断 |
| Audio underrun | 音声のアンダーラン; explain the buffer running short of data |
| Outgoing buffer drop | 送信バッファーの音声データを破棄 |
| Reported latency | 報告遅延; explain that Android reports it |
| Hardware offload | ハードウェアオフロード |

Use natural prompts such as 「再生を始めてから更新してみてください。」 and
「Bluetooth設定を開く」. For partial coverage, prefer
「確認できた範囲では新たな問題はありません」. Android setting labels can vary by
version and manufacturer; include recognizable alternatives when necessary.

## Simplified Chinese codec emphasis

The Simplified Chinese homepage intentionally leads the codec examples in its
"实时音频分析" feature paragraph with **LHDC and MIHC**, ahead of LDAC, aptX HD,
AAC, and SBC.

LHDC and MIHC are particularly relevant to the Chinese audience and more common
in China than in other markets. Naming them on the homepage helps visitors
recognize that Lazulite supports inspecting the codecs used by their devices,
without needing to open the FAQ first. Preserve this emphasis when revising or
translating homepage copy; the Chinese page need not use the same codec examples
or ordering as the English page.

This is a difference in emphasis, not functionality. Lazulite's codec support is
the same across languages. Keep LHDC, MIHC, and Opus explicitly named in every
language's supported-codecs FAQ. The LHDC-version answer distinguishes testing
with V2, V3, and V5 from theoretical support for all current and future versions.
Keep this distinction without adding a separate disclaimer about untested versions.

Codec support means inspecting the Bluetooth codec and information reported by
Android. It does not mean enabling a codec that the phone or connected Bluetooth
audio device does not support.

## Visual and information style

Carry the app's mineral navy ground, lapis accent, Sora typography, restrained
borders, and deliberate spacing into the website. The website mirrors the app's
dark theme and is dark-only; use [DESIGN.md](DESIGN.md) for web tokens, CJK font
fallbacks, components, and responsive behavior.

Keep the homepage scannable and reveal technical depth through FAQ answers.
Make the playback app, phone, Bluetooth transport, and receiving device easy to
distinguish. Use consistent units and readable measurements. Use color by
semantic role with text or icons, never as the only explanation of a status.
Motion should explain an interaction or state change.

## Privacy and trust

Core app inspection and decoding happen locally. Optional crash diagnostics,
destination-vendor lookup, and user-initiated log sharing have separate data
flows. Avoid blanket promises that no information ever leaves the phone.

Crash diagnostics can send reports and technical logs to Firebase Crashlytics
after consent, including reports stored locally before opting in. Vendor lookup
sends the first three pairs of the destination MAC address to MACLookup and is on
by default when no preference has been saved; existing choices are preserved.

Describe vendor lookup as identifying the manufacturer associated with the
Bluetooth audio device's MAC address prefix, when available. It may identify the
Bluetooth chipset manufacturer rather than the device's retail brand. Do not
promise headphone-brand identification or a result for every device; randomized
addresses and missing lookup records can prevent identification.

Diagnostic logs may contain device names, addresses, playback details, and other
identifiers, so sharing must be intentional.

Keep website analytics distinct from app diagnostics. Link to the relevant
privacy policy for full details instead of treating this document as a policy.

## Website surfaces and maintenance

The homepage introduces the product and provides a download entry point. The FAQ
covers setup, permissions, compatibility, and usage. What's New records
user-facing releases; the privacy page explains data handling. Use
lazuliteapp@gmail.com as the public support address.

Keep changing prices, ratings, and download counts on their authoritative
surfaces rather than duplicating them in this reference.

Update this document when accepted changes alter website positioning,
terminology, localization, or product claims. Verify capability changes against
the Android product reference and shipped behavior. Keep audience-specific copy
decisions here and engineering procedures in AGENTS.md. These guidelines direct
future edits; documenting them does not imply that all existing website copy has
already been audited or aligned.
