---
title: "FAQ"
date: 2023-12-25T16:18:23-07:00
draft: false
showMetadata: false
---

# Frequently Asked Questions

## Why does Lazulite need special permissions?

Lazulite needs permission to read your Android system's audio logs to show you real-time codec information and Bluetooth transmission data. Android restricts access to these logs for privacy and security reasons, so you'll need to grant permission using one of three methods:

### Option 1: ADB (Recommended for Most Users)
**Best for:** First-time users and anyone not familiar with Android customization

This is the easiest method for most people. You'll connect your phone to your computer via USB and run a simple command. It takes about 5 minutes and doesn't require any technical expertise.

**Note:** You'll need to re-grant permission after each device restart.

[📖 Step-by-Step ADB Tutorial for Windows and MacOS](https://pedronveloso.com/android-lazulite-how-to-run-adb-command/)

### Option 2: Shizuku
**Best for:** Users who want persistent permissions without restarting

[Shizuku](https://shizuku.rikka.app/) is an app that helps other apps access system permissions. Once set up, permissions persist across reboots. Requires initial ADB setup, but you won't need to reconnect your phone after restarts.

### Option 3: Root Access
**Best for:** Power users with rooted devices

If your device is rooted, Lazulite can automatically request the necessary permissions. This is the most convenient option, but only if you're already comfortable with rooting Android devices.

---

## I'm stuck at the ADB permissions screen

**First time setting up?** Follow our detailed tutorial that walks you through installing ADB and granting permissions:

[Lazulite Setup Simplified: Installing ADB on Windows and MacOS](https://pedronveloso.com/android-lazulite-how-to-run-adb-command/)

**Already granted permission but it's not working?** Make sure:
- Your phone is connected via USB with USB debugging enabled
- You've authorized the computer on your phone when the "Allow USB debugging?" prompt appeared
- You're running the correct ADB command exactly as shown in the tutorial

**Using Shizuku?** Ensure Shizuku is running before launching Lazulite.

---

## Will Lazulite drain my battery?

**TL;DR:** Nope, negligible impact.

Lazulite only reads existing system logs that your device generates anyway. It doesn't create additional processes or run in the background when you're not using it.

**Important:** Lazulite monitors your phone/tablet's logs, not your Bluetooth headphones. Your earbuds' battery life is completely unaffected.

---

## Does Lazulite use my mobile data?

Lazulite performs all audio analysis locally on your device—no data leaves your phone unless you choose to share it.

**Optional telemetry:** The app may collect anonymous usage and crash data via Google Firebase to help improve stability. This uses minimal data and is compliant with privacy regulations worldwide.

**Want to opt out?** Go to Settings → Disable "Telemetry data"

---

## Which Bluetooth codecs does Lazulite support?

Lazulite can detect and analyze all Bluetooth audio codecs your device supports, including:

- **High-quality codecs:** LDAC, LDAC Plus, aptX HD, aptX Adaptive, aptX Lossless, aptX, LC3, LC3 Plus
- **Standard codecs:** AAC, SBC
- **And many more** as Android adds new codec support

If your device and headphones support it, Lazulite can monitor it.

---

## Can I use Lazulite with wired headphones?

Lazulite is specifically designed for Bluetooth audio analysis. It monitors the Bluetooth audio stack, codec negotiation, and wireless transmission quality—none of which apply to wired connections.

For wired headphones, audio goes directly from your device's DAC to your ears without the complexity of wireless encoding and transmission.

---

## Why do streaming apps sometimes show different codecs than expected?

**This is exactly why Lazulite exists.** Many streaming apps claim "lossless" or "hi-fi" quality, but your device or Bluetooth headphones might force re-encoding to a lower-quality codec.

Lazulite shows you the **actual codec being used for Bluetooth transmission**, not what the streaming app claims to be sending. If you're paying for hi-res audio but seeing AAC 256kbps, now you know the truth.

---

## Further Questions?

Still stuck or have questions not covered here? [Drop us an email](mailto:lazuliteapp@gmail.com) and we'll help you out.
