---
title: "FAQ"
date: 2023-12-25T16:18:23-07:00
draft: false
showMetadata: false
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

<details>
<summary>Why does Lazulite need special permissions?</summary>
<div class="faq-body">
<p>Lazulite needs permission to read your Android system's audio logs to show you real-time codec information and Bluetooth transmission data. Android restricts access to these logs for privacy and security reasons, so you'll need to grant permission using one of three methods:</p>

<h3>Option 1: ADB (Recommended for Most Users)</h3>
<p><strong>Best for:</strong> First-time users and anyone not familiar with Android customization</p>
<p>This is the easiest method for most people. You'll connect your phone to your computer via USB and run a simple command. It takes about 5 minutes and doesn't require any technical expertise.</p>
<p><strong>Note:</strong> You'll need to re-grant permission after each device restart.</p>
<p><a href="https://pedronveloso.com/android-lazulite-how-to-run-adb-command/">📖 Step-by-Step ADB Tutorial for Windows and MacOS</a></p>

<h3>Option 2: Shizuku</h3>
<p><strong>Best for:</strong> Users who want persistent permissions without restarting</p>
<p><a href="https://shizuku.rikka.app/">Shizuku</a> is an app that helps other apps access system permissions. Once set up, permissions persist across reboots. Requires initial ADB setup, but you won't need to reconnect your phone after restarts.</p>
<p><a href="https://www.youtube.com/shorts/pnHNdU6LppA">▶ Video guide: How to enable Shizuku</a></p>

<h3>Option 3: Root Access</h3>
<p><strong>Best for:</strong> Power users with rooted devices</p>
<p>If your device is rooted, Lazulite can automatically request the necessary permissions. This is the most convenient option, but only if you're already comfortable with rooting Android devices.</p>
</div>
</details>

<details>
<summary>I'm stuck at the ADB permissions screen</summary>
<div class="faq-body">
<p><strong>First time setting up?</strong> Follow our detailed tutorial that walks you through installing ADB and granting permissions:</p>
<p><a href="https://pedronveloso.com/android-lazulite-how-to-run-adb-command/">Lazulite Setup Simplified: Installing ADB on Windows and MacOS</a></p>
<p><strong>Already granted permission but it's not working?</strong> Make sure:</p>
<ul>
<li>Your phone is connected via USB with USB debugging enabled</li>
<li>You've authorized the computer on your phone when the "Allow USB debugging?" prompt appeared</li>
<li>You're running the correct ADB command exactly as shown in the tutorial</li>
</ul>
<p><strong>Using Shizuku?</strong> Ensure Shizuku is running before launching Lazulite.</p>
</div>
</details>

---

<h2 id="codecs">Codecs & Compatibility</h2>

<details>
<summary>Which Bluetooth codecs does Lazulite support?</summary>
<div class="faq-body">
<p>Lazulite can detect and display all Bluetooth audio codecs your device supports:</p>
<ul>
<li>LDAC, aptX, aptX HD, aptX Adaptive, aptX TWS, LC3</li>
<li>LHDC V1, LHDC V2, LHDC V3, LHDC V4, LHDC V5</li>
<li>AAC, SBC</li>
<li>SSC, SSC UHQ (Samsung devices only)</li>
</ul>
<p>If your device and headphones negotiate it, Lazulite will show it.</p>
</div>
</details>

<details>
<summary>Can I use Lazulite with wired headphones?</summary>
<div class="faq-body">
<p>Lazulite monitors the Bluetooth audio stack: codec negotiation, transmission quality, packet loss. Wired connections bypass all of that, so there is nothing for Lazulite to read.</p>
<p>With wired headphones, audio goes straight from your device's DAC to your ears. No wireless encoding, no codec negotiation.</p>
</div>
</details>

<details>
<summary>Why do streaming apps sometimes show different codecs than expected?</summary>
<div class="faq-body">
<p>Many streaming apps claim "lossless" or "hi-fi" quality, but your device or headphones may force re-encoding to a lower-quality codec before audio ever reaches your ears.</p>
<p>Lazulite shows the <strong>actual codec used for Bluetooth transmission</strong>, not what the streaming app reports. If you are paying for hi-res audio but seeing AAC 256kbps in Lazulite, you now know what is actually happening.</p>
</div>
</details>

---

<h2 id="privacy">Privacy & Data</h2>

<details>
<summary>Does Lazulite use my mobile data?</summary>
<div class="faq-body">
<p>Lazulite performs all audio analysis locally on your device. No data leaves your phone unless you choose to share it.</p>
<p><strong>Optional telemetry:</strong> The app may collect anonymous usage and crash data via Google Firebase to help improve stability. This uses minimal data and is compliant with privacy regulations worldwide.</p>
<p><strong>Want to opt out?</strong> Go to Settings → Disable "Telemetry data"</p>
</div>
</details>

---

<h2 id="usage">Usage & Behavior</h2>

<details>
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
