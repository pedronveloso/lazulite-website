---
title: "常见问题"
seoTitle: "Lazulite 常见问题：权限、蓝牙编解码器、设置与兼容性"
description: "解答 Lazulite 的权限要求、ADB 设置、Shizuku、蓝牙编解码器支持、丢包监控以及 Android 音频兼容性等问题。"
date: 2023-12-25T16:18:23-07:00
draft: false
showMetadata: false
schemaType: "FAQPage"
faqSchema:
  - question: "为什么 Lazulite 需要特殊权限？"
    answer: "Lazulite 需要读取 Android 音频系统日志，才能显示实时蓝牙编解码器信息和传输数据。Android 会限制这些日志，因此必须通过 ADB、Shizuku 或 root 权限授予访问权限。"
  - question: "Lazulite 支持哪些蓝牙编解码器？"
    answer: "Lazulite 可以检测设备支持并实际协商使用的蓝牙音频编解码器，包括 LDAC、aptX、aptX HD、aptX Adaptive、LC3、各版本 LHDC、AAC、SBC，以及在支持设备上的三星 SSC 编解码器。"
  - question: "Lazulite 可以配合有线耳机使用吗？"
    answer: "不可以。Lazulite 监控的是蓝牙音频栈，包括编解码器协商和传输质量。有线音频不会经过蓝牙，因此没有蓝牙编解码器数据可供应用分析。"
  - question: "Lazulite 会明显耗电吗？"
    answer: "电量影响很小。Lazulite 读取的是系统已经生成的日志，在你不使用应用时不会额外增加蓝牙处理负担。"
---

# 常见问题

<nav class="faq-nav" aria-label="常见问题分区">
  <a href="#permissions">权限与设置</a>
  <a href="#codecs">编解码器与兼容性</a>
  <a href="#privacy">隐私与数据</a>
  <a href="#usage">使用与行为</a>
</nav>

---

<h2 id="permissions">权限与设置</h2>

<details>
<summary>为什么 Lazulite 需要特殊权限？</summary>
<div class="faq-body">
<p>Lazulite 需要读取 Android 系统的音频日志，才能实时显示编解码器信息和蓝牙传输数据。出于隐私和安全原因，Android 会限制这些日志的访问，因此你需要通过以下三种方式之一授予权限：</p>

<h3>方式 1：ADB（推荐大多数用户使用）</h3>
<p><strong>适合：</strong>首次设置的用户，以及不熟悉 Android 深度配置的人</p>
<p>这是大多数用户最简单的方式。你只需通过 USB 将手机连接到电脑，然后执行一条简单命令。整个过程大约 5 分钟，不需要技术背景。</p>
<p><strong>注意：</strong>每次设备重启后，你都需要重新授予权限。</p>
<p><a href="https://pedronveloso.com/android-lazulite-how-to-run-adb-command/">📖 Windows 和 macOS 的 ADB 分步教程</a></p>

<h3>方式 2：Shizuku</h3>
<p><strong>适合：</strong>希望权限在重启后仍然保留的用户</p>
<p><a href="https://shizuku.rikka.app/">Shizuku</a> 是一款帮助其他应用获取系统权限的工具。设置完成后，权限可以在重启后继续保留。它仍然需要先通过 ADB 进行初始设置，但以后就不必每次重启后再重新连接手机。</p>
<p><a href="https://www.youtube.com/shorts/pnHNdU6LppA">▶ 视频指南：如何启用 Shizuku</a></p>

<h3>方式 3：Root 权限</h3>
<p><strong>适合：</strong>已经 root 设备的高级用户</p>
<p>如果你的设备已经 root，Lazulite 可以自动请求所需权限。这是最省事的方法，但前提是你本来就熟悉 Android root 操作。</p>
</div>
</details>

<details>
<summary>我卡在 ADB 权限页面了</summary>
<div class="faq-body">
<p><strong>第一次设置？</strong> 请参考我们的详细教程，里面包含安装 ADB 和授予权限的完整步骤：</p>
<p><a href="https://pedronveloso.com/android-lazulite-how-to-run-adb-command/">Lazulite 简明设置指南：在 Windows 和 macOS 上安装 ADB</a></p>
<p><strong>已经授予权限但还是不工作？</strong> 请确认：</p>
<ul>
<li>手机已通过 USB 连接，并启用了 USB 调试</li>
<li>手机弹出“允许 USB 调试？”提示时，你已经授权这台电脑</li>
<li>你执行的 ADB 命令与教程中给出的内容完全一致</li>
</ul>
<p><strong>使用 Shizuku？</strong> 请确保在启动 Lazulite 之前，Shizuku 已经在运行。</p>
</div>
</details>

---

<h2 id="codecs">编解码器与兼容性</h2>

<details>
<summary>Lazulite 支持哪些蓝牙编解码器？</summary>
<div class="faq-body">
<p>Lazulite 可以检测并显示你的设备支持的所有蓝牙音频编解码器：</p>
<ul>
<li>LDAC、aptX、aptX HD、aptX Adaptive、aptX TWS、LC3</li>
<li>LHDC V1、LHDC V2、LHDC V3、LHDC V4、LHDC V5</li>
<li>AAC、SBC</li>
<li>SSC、SSC UHQ（仅限三星设备）</li>
</ul>
<p>只要你的设备和耳机都支持，并且最终协商使用该格式，Lazulite 就会显示出来。</p>
</div>
</details>

<details>
<summary>我可以把 Lazulite 用在有线耳机上吗？</summary>
<div class="faq-body">
<p>Lazulite 监控的是蓝牙音频栈：包括手机和耳机协商使用的编解码器、传输质量以及丢包情况。有线连接会绕过这一整套流程，因此 Lazulite 没有任何可读取的数据。</p>
<p>使用有线耳机时，音频会直接从设备 DAC 传到你的耳朵，中间没有无线编码，也没有编解码器选择。</p>
</div>
</details>

<details>
<summary>为什么流媒体应用显示的编解码器有时和预期不一样？</summary>
<div class="faq-body">
<p>很多流媒体应用会宣称提供“无损”或“Hi-Fi”音质，但在声音真正传到你耳朵之前，设备或耳机可能已经被迫重新编码成更低质量的编解码器。</p>
<p>Lazulite 显示的是<strong>蓝牙传输实际使用的编解码器</strong>，而不是流媒体应用声称的结果。如果你为高解析音频付费，但 Lazulite 显示的却是 256 kbps AAC，你就能立刻知道真实情况。</p>
</div>
</details>

---

<h2 id="privacy">隐私与数据</h2>

<details>
<summary>Lazulite 会使用我的移动数据吗？</summary>
<div class="faq-body">
<p>Lazulite 的所有音频分析都在你的设备本地完成。除非你主动选择分享，否则不会有任何数据从你的手机发出。</p>
<p><strong>可选遥测：</strong>应用可能会通过 Google Firebase 收集匿名使用数据和崩溃数据，以帮助提升稳定性。这只会消耗极少的数据量，并符合全球隐私法规要求。</p>
<p><strong>想关闭？</strong> 前往“设置” → 关闭“遥测数据”</p>
</div>
</details>

---

<h2 id="usage">使用与行为</h2>

<details>
<summary>Lazulite 会不会很耗电？</summary>
<div class="faq-body">
<p><strong>简短回答：</strong>不会，影响几乎可以忽略不计。</p>
<p>Lazulite 只是读取设备本来就会生成的系统日志。它不会额外创建进程，也不会在你不用时偷偷在后台运行。</p>
<p><strong>注意：</strong>Lazulite 监控的是手机日志，不是蓝牙耳机本身，因此不会影响耳机电池。</p>
</div>
</details>

---

## 还有其他问题？

如果你仍然卡住，或者有这里没有覆盖的问题，可以[给我们发邮件](mailto:lazuliteapp@gmail.com)，我们会帮你处理。
