
<nav class="faq-nav" aria-label="常见问题分区">
  <a href="#permissions">权限与设置</a>
  <a href="#codecs">编解码器与兼容性</a>
  <a href="#privacy">隐私与数据</a>
  <a href="#usage">使用与行为</a>
</nav>

---

<h2 id="permissions">权限与设置</h2>

<details data-umami-faq="special_permissions">
<summary>为什么 Lazulite 需要特殊权限？</summary>
<div class="faq-body">
<p>Lazulite 需要读取 Android 系统的音频日志，才能显示蓝牙编解码器和音频路径信息。出于隐私和安全原因，Android 会限制这些日志的访问，因此你需要通过以下三种方式之一授予权限：</p>

<h3>方式 1：Shizuku（推荐大多数用户使用）</h3>
<p><strong>适合：</strong>大多数用户，尤其是希望直接在手机上设置 Lazulite 的用户</p>
<p><a href="https://github.com/thedjchi/Shizuku">Shizuku</a> 无需 root，即可让 Lazulite 访问所需的系统信息。在 Android 11 及更高版本上，你可以通过无线调试启动 Shizuku，无需将手机连接到电脑。设备重启后，你需要先重新启动 Shizuku，再打开 Lazulite。</p>
<p><a href="https://www.youtube.com/shorts/pnHNdU6LppA">▶ 视频指南：如何启用 Shizuku</a></p>

<h3>方式 2：ADB（适合熟悉 ADB 的用户）</h3>
<p><strong>适合：</strong>已经知道如何在电脑上使用 ADB 的用户</p>
<p>安装 <a href="https://developer.android.com/tools/releases/platform-tools">Android SDK Platform-Tools</a>，启用 USB 调试，连接并授权手机，然后运行：</p>
<pre><code>adb shell pm grant com.pedronveloso.lazulite android.permission.DUMP</code></pre>

<h3>方式 3：Root 权限</h3>
<p><strong>适合：</strong>已经 root 设备的高级用户</p>
<p>如果你的设备已经 root，Lazulite 可以自动请求所需权限。这是最省事的方法，但前提是你本来就熟悉 Android root 操作。</p>
</div>
</details>

<details data-umami-faq="adb_permissions_help">
<summary>我卡在 ADB 权限页面了</summary>
<div class="faq-body">
<p><strong>第一次使用 ADB？</strong>我们建议改用 Shizuku。ADB 选项适合已经熟悉在电脑上运行命令的用户。</p>
<p>如果你仍想使用 ADB，请安装 <a href="https://developer.android.com/tools/releases/platform-tools">Android SDK Platform-Tools</a>，启用 USB 调试，连接并授权手机，然后运行：</p>
<pre><code>adb shell pm grant com.pedronveloso.lazulite android.permission.DUMP</code></pre>
<p><strong>已经授予权限但还是不工作？</strong> 请确认：</p>
<ul>
<li>手机已通过 USB 连接，并启用了 USB 调试</li>
<li>手机弹出“允许 USB 调试？”提示时，你已经授权这台电脑</li>
<li><code>adb devices</code> 将手机显示为 <code>device</code>，而不是 <code>unauthorized</code></li>
<li>你已完全按照上方内容运行授权命令</li>
</ul>
<p><strong>使用 Shizuku？</strong> 请确保在启动 Lazulite 之前，Shizuku 已经在运行。</p>
</div>
</details>

---

<h2 id="codecs">编解码器与兼容性</h2>

<details data-umami-faq="codec_support">
<summary>Lazulite 支持哪些蓝牙编解码器？</summary>
<div class="faq-body">
<p>Lazulite 可以检测并显示你的设备支持的所有蓝牙音频编解码器：</p>
<ul>
<li>LDAC、aptX、aptX HD、aptX Adaptive、aptX TWS、LC3、MIHC、Opus</li>
<li>LHDC（请参阅下方的<a href="#lhdc-versions">LHDC 版本支持说明</a>）</li>
<li>AAC、SBC</li>
<li>SSC、SSC UHQ（仅限三星设备）</li>
</ul>
<p>只要你的手机和蓝牙音频设备都支持，并且最终协商使用该格式，Lazulite 就会显示出来。</p>
</div>
</details>

<details id="lhdc-versions" data-umami-faq="lhdc_versions">
<summary>Lazulite 支持哪些 LHDC 版本？</summary>
<div class="faq-body">
<p>Lazulite 已通过 LHDC V2、V3 和 V5 的测试。理论上，它应能支持所有当前及未来的 LHDC 版本。</p>
</div>
</details>

<details data-umami-faq="bluetooth_audio_devices">
<summary>Lazulite 只能用于蓝牙耳机吗？</summary>
<div class="faq-body">
<p>不是。Lazulite 适用于各类蓝牙音频设备，包括头戴式耳机、入耳式耳机、音箱、车载音响系统和蓝牙音频接收器。将设备连接到 Android 手机并播放音频，即可查看其蓝牙编解码器和 Android 报告的音频路径。可显示的详细信息取决于手机和所连接的设备。</p>
</div>
</details>

<details data-umami-faq="wired_headphones">
<summary>我可以把 Lazulite 用在有线耳机上吗？</summary>
<div class="faq-body">
<p>不支持有线音频检查。Lazulite 显示手机与蓝牙音频设备协商使用的编解码器，以及 Android 报告的音频路径。</p>
<p>有线连接不使用蓝牙，因此没有蓝牙编解码器数据可供 Lazulite 检查。</p>
</div>
</details>

<details data-umami-faq="codec_expectations">
<summary>为什么流媒体应用显示的编解码器有时和预期不一样？</summary>
<div class="faq-body">
<p>很多流媒体应用会宣称提供“无损”或“Hi-Fi”音质，但在声音真正传到你耳朵之前，设备或耳机可能已经被迫重新编码成更低质量的编解码器。</p>
<p>Lazulite 显示的是<strong>蓝牙传输实际使用的编解码器</strong>，而不是流媒体应用声称的结果。如果你为高解析音频付费，但 Lazulite 显示的却是 256 kbps AAC，你就能立刻知道真实情况。</p>
</div>
</details>

<details data-umami-faq="hardware_offload">
<summary>什么是 A2DP 硬件卸载？Lazulite 会显示它吗？</summary>
<div class="faq-body">
<p>部分 Android 设备可以把蓝牙音频编码从主处理器转移到专用的音频或蓝牙硬件上处理，从而减少播放时的 CPU 负担和功耗。</p>
<p>Lazulite 能检测到 A2DP 硬件卸载是否启用，并显示你设备的硬件支持哪些编解码器进行卸载。某个编解码器出现在列表中，并不代表当前连接一定在使用硬件卸载，这取决于所选编解码器、连接的设备、系统设置以及制造商的具体实现。</p>
</div>
</details>

<details data-umami-faq="vendor_lookup">
<summary>Lazulite 的蓝牙制造商查询能识别什么？</summary>
<div class="faq-body">
<p>在“设置”中开启“查询目标设备供应商”后，Lazulite 会根据所连接蓝牙音频设备的 MAC 地址前缀查询关联的制造商（如果有相关信息）。查询结果可能是蓝牙芯片制造商，而不是耳机、音箱或其他音频设备的品牌。并非每次都能查到结果，例如设备使用随机地址，或查询数据库中没有匹配记录时。</p>
<p>如果尚未保存偏好设置，该功能默认开启；已保存的选择会保留。你可以在“设置”中关闭此功能。开启时，Lazulite 只会把目标 MAC 地址的前三对字符发送给 MACLookup 用于识别供应商，地址的其他部分不会被发送。</p>
</div>
</details>

---

<h2 id="privacy">隐私与数据</h2>

<details data-umami-faq="mobile_data">
<summary>Lazulite 会使用我的移动数据吗？</summary>
<div class="faq-body">
<p>Lazulite 的所有音频分析都在你的设备本地完成。除非你主动选择分享，否则不会有任何数据从你的手机发出。</p>
<p><strong>可选崩溃诊断信息：</strong>Lazulite 不收集应用使用情况分析数据。崩溃诊断信息默认关闭；如果你开启该选项，崩溃报告和技术诊断日志可能会发送给 Google Firebase Crashlytics，以帮助提高稳定性。启用后，本地存储的报告可能会上传。</p>
<p><strong>可选的供应商查询：</strong>当“设置”中的“查询目标设备供应商”开启时，Lazulite 会将已连接设备 MAC 地址的前三对字符发送给 MACLookup，以识别其制造商。地址的其他部分不会被发送，如果尚未保存偏好设置，该功能默认开启。已保存的选择会保留，你可以在“设置”中关闭此功能。</p>
<p><strong>想关闭？</strong> 前往“设置” → 关闭“崩溃诊断信息”或“查询目标设备供应商”。</p>
</div>
</details>

---

<h2 id="usage">使用与行为</h2>

<details data-umami-faq="battery_impact">
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

