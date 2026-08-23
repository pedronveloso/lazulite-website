---
title: "FAQ"
seoTitle: "Lazulite FAQ: Permissions, Bluetooth Codecs, Setup & Compatibility"
description: "Answers about Lazulite permissions, ADB setup, Shizuku, Bluetooth codec support, packet loss monitoring, and Android audio compatibility."
date: 2023-12-25T16:18:23-07:00
draft: false
showMetadata: false
schemaType: "FAQPage"
faqSchema:
  - question: "Why does Lazulite need special permissions?"
    answer: "Lazulite reads Android audio system logs to show real-time Bluetooth codec information and transmission data. Android restricts these logs, so permission must be granted with ADB, Shizuku, or root access."
  - question: "Which Bluetooth codecs does Lazulite support?"
    answer: "Lazulite can detect the Bluetooth audio codecs your device supports and negotiates, including LDAC, aptX, aptX HD, aptX Adaptive, LC3, MIHC, Opus, LHDC variants, AAC, SBC, and Samsung SSC codecs when available."
  - question: "Can I use Lazulite with wired headphones?"
    answer: "No. Lazulite monitors the Bluetooth audio stack, including codec negotiation and transmission quality. Wired audio bypasses Bluetooth, so there is no Bluetooth codec data for the app to inspect."
  - question: "Will Lazulite drain my battery?"
    answer: "Battery impact is minimal. Lazulite reads system logs that already exist and does not create extra Bluetooth processing when you are not using the app."
---

# Frequently Asked Questions

<nav class="faq-nav" aria-label="FAQ sections">
  <a href="#permissions">Permissions & Setup</a>
  <a href="#codecs">Codecs & Compatibility</a>
  <a href="#privacy">Privacy & Data</a>
  <a href="#usage">Usage & Behavior</a>
</nav>

---

<h2 id="permissions">Permissions & Setup</h2>

<details data-umami-faq="special_permissions">
<summary>Why does Lazulite need special permissions?</summary>
<div class="faq-body">
<p>Lazulite needs permission to read your Android system's audio logs to show you real-time codec information and Bluetooth transmission data. Android restricts access to these logs for privacy and security reasons, so you'll need to grant permission using one of three methods:</p>

<h3>Option 1: Shizuku (Recommended for Most Users)</h3>
<p><strong>Best for:</strong> Most users, especially those who prefer to set up Lazulite directly on their phone</p>
<p><a href="https://shizuku.rikka.app/">Shizuku</a> lets Lazulite access the system information it needs without root. On Android 11 and newer, you can start Shizuku using Wireless debugging, without connecting your phone to a computer. After restarting your device, you'll need to start Shizuku again before opening Lazulite.</p>
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

<h2 id="codecs">Codecs & Compatibility</h2>

<details data-umami-faq="codec_support">
<summary>Which Bluetooth codecs does Lazulite support?</summary>
<div class="faq-body">
<p>Lazulite can detect and display all Bluetooth audio codecs your device supports:</p>
<ul>
<li>LDAC, aptX, aptX HD, aptX Adaptive, aptX TWS, LC3, MIHC, Opus</li>
<li>LHDC V1, LHDC V2, LHDC V3, LHDC V4, LHDC V5</li>
<li>AAC, SBC</li>
<li>SSC, SSC UHQ (Samsung devices only)</li>
</ul>
<p>If your device and headphones support it and agree to use it, Lazulite will show it.</p>
</div>
</details>

<details data-umami-faq="wired_headphones">
<summary>Can I use Lazulite with wired headphones?</summary>
<div class="faq-body">
<p>Lazulite monitors the Bluetooth audio stack: which codec your phone and headphones agreed on, transmission quality, packet loss. Wired connections bypass all of that, so there is nothing for Lazulite to read.</p>
<p>With wired headphones, audio goes straight from your device's DAC to your ears. No wireless encoding, no codec selection.</p>
</div>
</details>

<details data-umami-faq="codec_expectations">
<summary>Why do streaming apps sometimes show different codecs than expected?</summary>
<div class="faq-body">
<p>Many streaming apps claim "lossless" or "hi-fi" quality, but your device or headphones may force re-encoding to a lower-quality codec before audio ever reaches your ears.</p>
<p>Lazulite shows the <strong>actual codec used for Bluetooth transmission</strong>, not what the streaming app reports. If you are paying for hi-res audio but seeing AAC 256kbps in Lazulite, you now know what is actually happening.</p>
</div>
</details>

---

<h2 id="privacy">Privacy & Data</h2>

<details data-umami-faq="mobile_data">
<summary>Does Lazulite use my mobile data?</summary>
<div class="faq-body">
<p>Lazulite performs all audio analysis locally on your device. No data leaves your phone unless you choose to share it.</p>
<p><strong>Optional telemetry:</strong> The app may collect anonymous usage and crash data via Google Firebase to help improve stability. This uses minimal data and is compliant with privacy regulations worldwide.</p>
<p><strong>Want to opt out?</strong> Go to Settings → Disable "Telemetry data"</p>
</div>
</details>

---

<h2 id="usage">Usage & Behavior</h2>

<details data-umami-faq="battery_impact">
<summary>Will Lazulite drain my battery?</summary>
<div class="faq-body">
<p><strong>TL;DR:</strong> Nope, negligible impact.</p>
<p>Lazulite only reads existing system logs that your device generates anyway. It doesn't create additional processes or run in the background when you're not using it.</p>
<p><strong>Note:</strong> Lazulite monitors your phone's logs, not your Bluetooth headphones. Your earbuds' battery is unaffected.</p>
</div>
</details>

---

## Further Questions?

Still stuck or have questions not covered here? [Drop us an email](mailto:lazuliteapp@gmail.com) and we'll help you out.
