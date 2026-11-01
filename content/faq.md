---
title: "FAQ"
seoTitle: "Lazulite FAQ: Permissions, Bluetooth Codecs, Setup & Compatibility"
description: "Answers about Lazulite permissions, ADB setup, Shizuku, Bluetooth codec support, audio path inspection, and Android audio compatibility."
date: 2023-12-25T16:18:23-07:00
draft: false
showMetadata: false
schemaType: "FAQPage"
faqSchema:
  - question: "Why does Lazulite need special permissions?"
    answer: "Lazulite needs permission to read your Android system's audio logs to show Bluetooth codec and audio path information. Android restricts access to these logs for privacy and security reasons, so you'll need to grant permission using one of three methods: Option 1: Shizuku (Recommended for Most Users) Best for: Most users, especially those who prefer to set up Lazulite directly on their phone Shizuku lets Lazulite access the system information it needs without root. On Android 11 and newer, you can start Shizuku using Wireless debugging, without connecting your phone to a computer. After restarting your device, you'll need to start Shizuku again before opening Lazulite. ▶ Video guide: How to enable Shizuku Option 2: ADB (For Users Familiar with ADB) Best for: Users who already know how to use ADB from a computer Install Android SDK Platform-Tools, enable USB debugging, connect and authorize your phone, then run: adb shell pm grant com.pedronveloso.lazulite android.permission.DUMP Option 3: Root Access Best for: Power users with rooted devices If your device is rooted, Lazulite can automatically request the necessary permissions. This is the most convenient option, but only if you're already comfortable with rooting Android devices."
  - question: "How do I check which Bluetooth codec Android is using?"
    answer: "Connect a Bluetooth audio device to your Android phone, play audio, and refresh Lazulite. Read the codec shown for the active connection. The supported-codec lists describe what your phone and receiving device can support; they do not show which codec is currently in use."
  - question: "How can I tell whether LDAC is active?"
    answer: "Look for LDAC as the active codec in Lazulite after starting playback and refreshing. LDAC appearing in a supported-codec list does not mean it is active. When Android provides the information, Lazulite also shows the bitrate or encoding quality setting. Available details vary by device."
  - question: "What's the difference between supported codecs and the active codec?"
    answer: "Supported codecs describe the capabilities reported separately by your phone and receiving device. The active codec is the one they negotiated for the current Bluetooth connection. A codec can appear in a supported list without being selected for playback."
  - question: "Can Lazulite change my Bluetooth codec?"
    answer: "Lazulite inspects your Bluetooth connection and provides shortcuts to relevant system settings. It does not automatically select codecs or enable codecs your phone or receiving device does not support. Any available codec changes are made through your system settings."
  - question: "Does Lazulite support Android tablets?"
    answer: "Yes. Lazulite supports Android tablets as well as phones, with a layout that adapts to larger screens. You can inspect the playback app's reported output when listening through the tablet's speakers or wired headphones. Connecting a Bluetooth audio device adds codec and transmission details. Available information depends on the tablet, Android version, and playback app."
  - question: "Which Bluetooth codecs does Lazulite support?"
    answer: "Lazulite can detect and display all Bluetooth audio codecs your device supports: LDAC, aptX, aptX HD, aptX Adaptive, aptX TWS, LC3, MIHC, Opus LHDC (see supported LHDC versions below) AAC, SBC SSC, SSC UHQ (Samsung devices only) If your phone and Bluetooth audio device support it and agree to use it, Lazulite will show it."
  - question: "Which LHDC versions does Lazulite support?"
    answer: "Lazulite has been tested with LHDC V2, V3, and V5. In theory, it should support all current and future LHDC versions."
  - question: "Does Lazulite work only with Bluetooth headphones?"
    answer: "No. Lazulite works with Bluetooth audio devices, including headphones, earbuds, speakers, car audio systems, and Bluetooth audio receivers. Without a Bluetooth connection, it can still show the playback app's reported output while you use wired headphones or your phone or tablet's built-in speakers. Connect a Bluetooth audio device to also inspect its codec and transmission details. Available information depends on your Android device, playback app, and connected audio device."
  - question: "Can I use Lazulite with wired headphones?"
    answer: "Yes. Lazulite works with wired headphones, even without a Bluetooth connection. It shows the playback app's reported audio output, just as it does when playing through your phone or tablet's built-in speakers. Play audio and refresh to see available details such as sample rate and bit depth. These describe the app's output, not a measurement of the wired headphones or DAC. Bluetooth codec and transmission details only apply to Bluetooth playback."
  - question: "Will Lazulite drain my battery?"
    answer: "TL;DR: Nope, negligible impact. Lazulite only reads existing system logs that your device generates anyway. It doesn't create additional processes or run in the background when you're not using it. Note: Lazulite monitors your phone's logs, not your Bluetooth headphones. Your earbuds' battery is unaffected."
---

<nav class="faq-nav" aria-label="FAQ sections">
  <a href="#permissions">Permissions & Setup</a>
  <a href="#codecs">Checking Your Codec</a>
  <a href="#compatibility">Devices & Codec Support</a>
  <a href="#audio-path">Audio Path & Device Details</a>
  <a href="#privacy">Privacy & Data</a>
  <a href="#usage">Usage & Behavior</a>
</nav>

---

<h2 id="permissions">Permissions & Setup</h2>

<details data-umami-faq="special_permissions">
<summary>Why does Lazulite need special permissions?</summary>
<div class="faq-body">
<p>Lazulite needs permission to read your Android system's audio logs to show Bluetooth codec and audio path information. Android restricts access to these logs for privacy and security reasons, so you'll need to grant permission using one of three methods:</p>

<h3>Option 1: Shizuku (Recommended for Most Users)</h3>
<p><strong>Best for:</strong> Most users, especially those who prefer to set up Lazulite directly on their phone</p>
<p><a href="https://github.com/thedjchi/Shizuku">Shizuku</a> lets Lazulite access the system information it needs without root. On Android 11 and newer, you can start Shizuku using Wireless debugging, without connecting your phone to a computer. After restarting your device, you'll need to start Shizuku again before opening Lazulite.</p>
<p><a href="https://www.youtube.com/shorts/pnHNdU6LppA">▶ Video guide: How to enable Shizuku</a></p>

<h3>Option 2: ADB (For Users Familiar with ADB)</h3>
<p><strong>Best for:</strong> Users who already know how to use ADB from a computer</p>
<p>Install <a href="https://developer.android.com/tools/releases/platform-tools">Android SDK Platform-Tools</a>, enable USB debugging, connect and authorize your phone, then run:</p>
<pre><code>adb shell pm grant com.pedronveloso.lazulite android.permission.DUMP</code></pre>

<h3>Option 3: Root Access</h3>
<p><strong>Best for:</strong> Power users with rooted devices</p>
<p>If your device is rooted, Lazulite can automatically request the necessary permissions. This is the most convenient option, but only if you're already comfortable with rooting Android devices.</p>
</div>
</details>

<details data-umami-faq="adb_permissions_help">
<summary>I'm stuck at the ADB permissions screen</summary>
<div class="faq-body">
<p><strong>First time using ADB?</strong> We recommend using Shizuku instead. The ADB option is intended for users who are already comfortable running commands from a computer.</p>
<p>If you want to continue with ADB, install <a href="https://developer.android.com/tools/releases/platform-tools">Android SDK Platform-Tools</a>, enable USB debugging, connect and authorize your phone, then run:</p>
<pre><code>adb shell pm grant com.pedronveloso.lazulite android.permission.DUMP</code></pre>
<p><strong>Already granted permission but it's not working?</strong> Make sure:</p>
<ul>
<li>Your phone is connected via USB with USB debugging enabled</li>
<li>You've authorized the computer on your phone when the "Allow USB debugging?" prompt appeared</li>
<li><code>adb devices</code> lists your phone as <code>device</code>, not <code>unauthorized</code></li>
<li>You ran the grant command exactly as shown above</li>
</ul>
<p><strong>Using Shizuku?</strong> Ensure Shizuku is running before launching Lazulite.</p>
</div>
</details>

---

<h2 id="codecs">Checking Your Codec</h2>

<details id="active_codec" data-umami-faq="active_codec">
<summary>How do I check which Bluetooth codec Android is using?</summary>
<div class="faq-body">
<p>Connect a Bluetooth audio device to your Android phone, <strong>play audio</strong>, and <strong>refresh Lazulite</strong>. Read the codec shown for the <strong>active connection</strong>.</p>
<p>The supported-codec lists describe what your phone and receiving device can support; they do not show which codec is currently in use.</p>
</div>
</details>

<details id="ldac_active" data-umami-faq="ldac_active">
<summary>How can I tell whether LDAC is active?</summary>
<div class="faq-body">
<p>Look for <strong>LDAC as the active codec</strong> in Lazulite after starting playback and refreshing. LDAC appearing in a supported-codec list does not mean it is active.</p>
<p><strong>When Android provides the information</strong>, Lazulite also shows the bitrate or encoding quality setting. Available details vary by device.</p>
</div>
</details>

<details id="supported_vs_active" data-umami-faq="supported_vs_active">
<summary>What's the difference between supported codecs and the active codec?</summary>
<div class="faq-body">
<p><strong>Supported codecs</strong> describe the capabilities reported separately by your phone and receiving device.</p>
<p><strong>The active codec</strong> is the one they negotiated for the current Bluetooth connection.</p>
<p>A codec can appear in a supported list without being selected for playback.</p>
</div>
</details>

<details id="codec_control" data-umami-faq="codec_control">
<summary>Can Lazulite change my Bluetooth codec?</summary>
<div class="faq-body">
<p>Lazulite <strong>inspects your Bluetooth connection</strong> and provides shortcuts to relevant system settings.</p>
<p>It <strong>does not automatically select codecs</strong> or enable codecs your phone or receiving device does not support. Any available codec changes are made through your system settings.</p>
</div>
</details>

<h2 id="compatibility">Devices & Codec Support</h2>

<details id="tablet_support" data-umami-faq="tablet_support">
<summary>Does Lazulite support Android tablets?</summary>
<div class="faq-body">
<p>Yes. Lazulite supports <strong>Android tablets</strong> as well as phones, with a layout that adapts to larger screens.</p>
<p>You can inspect the <strong>playback app's reported output</strong> when listening through the tablet's speakers or wired headphones. Connecting a Bluetooth audio device adds codec and transmission details. Available information depends on the tablet, Android version, and playback app.</p>
</div>
</details>

<details data-umami-faq="codec_support">
<summary>Which Bluetooth codecs does Lazulite support?</summary>
<div class="faq-body">
<p>Lazulite can detect and display all <strong>Bluetooth audio codecs</strong> your device supports:</p>
<ul>
<li>LDAC, aptX, aptX HD, aptX Adaptive, aptX TWS, LC3, MIHC, Opus</li>
<li>LHDC (see <a href="#lhdc-versions">supported LHDC versions</a> below)</li>
<li>AAC, SBC</li>
<li>SSC, SSC UHQ (<strong>Samsung devices only</strong>)</li>
</ul>
<p>If your phone and Bluetooth audio device support it and agree to use it, Lazulite will show it.</p>
</div>
</details>

<details id="lhdc-versions" data-umami-faq="lhdc_versions">
<summary>Which LHDC versions does Lazulite support?</summary>
<div class="faq-body">
<p>Lazulite has been <strong>tested with LHDC V2, V3, and V5</strong>. <strong>In theory</strong>, it should support all current and future LHDC versions.</p>
</div>
</details>

<details data-umami-faq="bluetooth_audio_devices">
<summary>Does Lazulite work only with Bluetooth headphones?</summary>
<div class="faq-body">
<p>No. Lazulite works with <strong>Bluetooth audio devices</strong>, including headphones, earbuds, speakers, car audio systems, and Bluetooth audio receivers.</p>
<p>Without a Bluetooth connection, it can still show the <strong>playback app's reported output</strong> while you use wired headphones or your phone or tablet's built-in speakers. Connect a Bluetooth audio device to also inspect its codec and transmission details. Available information depends on your Android device, playback app, and connected audio device.</p>
</div>
</details>

<details data-umami-faq="wired_headphones">
<summary>Can I use Lazulite with wired headphones?</summary>
<div class="faq-body">
<p>Yes. Lazulite works with <strong>wired headphones</strong>, even without a Bluetooth connection. It shows the <strong>playback app's reported audio output</strong>, just as it does when playing through your phone or tablet's built-in speakers.</p>
<p>Play audio and refresh to see available details such as sample rate and bit depth. These describe the app's output, not a measurement of the wired headphones or DAC. Bluetooth codec and transmission details only apply to Bluetooth playback.</p>
</div>
</details>

<h2 id="audio-path">Audio Path & Device Details</h2>

<details data-umami-faq="codec_expectations">
<summary>Why do streaming apps sometimes show different codecs than expected?</summary>
<div class="faq-body">
<p><strong>Hi-Fi</strong> is a broad label, not a precise audio format. Depending on the service, it can cover anything from below-CD-quality streams to studio-resolution audio.</p>
<p>In Audio path details, Lazulite shows the <strong>app's reported output</strong>, including sample rate and bit depth when available, so you can see the format leaving the app.</p>
<p>For Bluetooth playback, Android re-encodes that output using the <strong>Bluetooth codec</strong> negotiated by your phone and audio device. These reported formats do not verify the original recording's fidelity or measure perceived sound quality.</p>
</div>
</details>

<details data-umami-faq="hardware_offload">
<summary>What is A2DP hardware offload, and does Lazulite show it?</summary>
<div class="faq-body">
<p>Some Android devices can move Bluetooth audio encoding off the main processor and onto <strong>dedicated audio or Bluetooth hardware</strong>. That can reduce CPU work and power use during playback.</p>
<p>Lazulite detects when A2DP hardware offload is active and lists which codecs your device's hardware supports for it. A codec showing up in that list <strong>doesn't mean it's being offloaded right now</strong>: that depends on the codec in use, the connected device, your system settings, and how the manufacturer implemented it.</p>
</div>
</details>

<details data-umami-faq="vendor_lookup">
<summary>What does Lazulite's Bluetooth manufacturer lookup identify?</summary>
<div class="faq-body">
<p>With "Look up destination vendor" enabled in Settings, Lazulite uses the connected Bluetooth audio device's <strong>MAC address prefix</strong> to look up the associated manufacturer, when available. This may identify the <strong>Bluetooth chipset manufacturer</strong> rather than the brand of your headphones, speaker, or other audio device. A result is not always available, for example when the address is randomized or the lookup has no matching record.</p>
<p>This is on by default when no preference has been saved; existing choices are preserved. You can turn it off in Settings. When enabled, Lazulite sends only the first three pairs of the destination MAC address to MACLookup to identify the vendor. No other part of the address is ever sent.</p>
</div>
</details>

---

<h2 id="privacy">Privacy & Data</h2>

<details data-umami-faq="mobile_data">
<summary>Does Lazulite use my mobile data?</summary>
<div class="faq-body">
<p>Lazulite performs all audio analysis locally on your device. No data leaves your phone unless you choose to share it.</p>
<p><strong>Optional crash diagnostics:</strong> Lazulite does not collect app usage analytics. Crash diagnostics are off by default; if you enable them, crash reports and technical diagnostic logs may be sent to Google Firebase Crashlytics to help improve stability. Locally stored reports may upload after you opt in.</p>
<p><strong>Optional vendor lookup:</strong> When "Look up destination vendor" is enabled in Settings, Lazulite sends the first three pairs of your connected device's MAC address to MACLookup to identify its manufacturer. No other part of the address is sent, and the setting is on by default when no preference has been saved. Existing choices are preserved, and you can turn it off in Settings.</p>
<p><strong>Want to opt out?</strong> Go to Settings → Disable "Crash diagnostics" or "Look up destination vendor".</p>
</div>
</details>

---

<h2 id="usage">Usage & Behavior</h2>

<details data-umami-faq="battery_impact">
<summary>Will Lazulite drain my battery?</summary>
<div class="faq-body">
<p><strong>TL;DR:</strong> Nope, negligible impact.</p>
<p>Lazulite only reads <strong>existing system logs</strong> that your device generates anyway. It doesn't create additional processes or run in the background when you're not using it.</p>
<p><strong>Note:</strong> Lazulite monitors your phone's logs, not your Bluetooth headphones. Your earbuds' battery is unaffected.</p>
</div>
</details>

---

## Further Questions?

Still stuck or have questions not covered here? [Drop us an email](mailto:lazulite@pnvdigital.com) and we'll help you out.
