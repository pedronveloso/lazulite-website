+++
author = "Pedro Veloso"
description = "适用于 Android 的蓝牙音频检查工具。查看当前编解码器、编码质量、播放应用输出，以及 Android 近期报告的播放问题。"
+++

<div class="homepage">

<section class="hero-section">
  <img src="/images/lazulite-logo-500.png" alt="Lazulite 应用标志" class="hero-logo" width="270" height="270">

  <h1 class="hero-title">
    <span class="accent-text">LAZULITE</span>
  </h1>

  <p class="hero-subtitle">
    流媒体应用宣称无损。你的耳机却未必如此。<br>
    Lazulite 会把实际传输到耳机的内容直接展示出来。
  </p>

  <div class="cta-buttons">
    <a href="https://play.google.com/store/apps/details?id=com.pedronveloso.lazulite" class="btn btn-primary" data-umami-event="download_intent" data-umami-event-placement="hero">
      立即下载
    </a>
    <a href="#features" class="btn btn-secondary">
      查看功能
    </a>
  </div>
</section>

<section id="features" class="section">
  <h2 class="section-title">为什么发烧友选择 <span class="accent-text">Lazulite</span></h2>
  <p class="section-subtitle">
    准确了解你的设备究竟对音频做了什么。
  </p>

  <div class="two-column">
    <div class="column">
      {{< app-media role="home" alt="Lazulite 主页，显示当前 aptX Adaptive 编解码器和蓝牙音频路径" >}}
    </div>
    <div class="column">
      <h2 class="section-title section-title--left">实时音频分析</h2>
      <p class="feature-body">
        查看手机和耳机协商使用的编解码器：LDAC、aptX HD、AAC、SBC 或其他支持的格式。刷新即可查看最新报告的配置。
      </p>
      <p class="feature-body">
        查看采样率、位深，以及设备提供的比特率或编码质量设置。
      </p>
      <p class="feature-body">
        打开音频路径详情，对比播放应用输出和蓝牙传输格式，了解 Android 在哪个环节转换了音频格式。
      </p>
    </div>
  </div>
</section>

<section class="section">
  <div class="two-column reverse">
    <div class="column">
      <h2 class="section-title section-title--left">蓝牙故障，还是连接太差？</h2>
      <p class="feature-body">
        播放健康状态会在每次刷新时对比 Android 诊断信息。查看新报告的音频欠载、输出缓冲区丢弃，以及可归属于当前播放设备的连接问题。
      </p>
      <ul class="feature-body feature-list">
        <li>音频缓冲区数据不足</li>
        <li>输出音频缓冲区丢弃</li>
        <li>播放期间近期报告的连接问题</li>
        <li>检查范围取决于设备提供的诊断信息</li>
      </ul>
      <p class="feature-body">
        这些信息有助于排查播放问题，但无法确定原因，也不能证明是否出现了可听见的中断。
      </p>
    </div>
    <div class="column">
      {{< app-media role="playback-health" alt="播放健康状态卡片，显示新报告的音频欠载和输出缓冲区丢弃" >}}
    </div>
  </div>
</section>

<section class="section section-alt">
  <h2 class="section-title">智能建议</h2>
  <p class="section-subtitle">
    获取适合当前配置的设置建议，并快速打开相关系统设置。
  </p>
  <div class="improve-section">
    <div class="improve-section__image">
      {{< app-media role="setup-tips" alt="高解析度设置建议，附有蓝牙设置快捷入口" >}}
    </div>
  </div>
</section>

<section class="section app-showcase">
  <h2 class="section-title">实际效果一目了然</h2>
  <div class="screenshot-mockup">
    {{< app-media role="home-video" alt="带 Pixel 8 设备边框的 Lazulite 主页录像，显示 LDAC 详情" >}}
  </div>
</section>

<section class="section download-section">
  <h2 class="section-title">听见真正正在播放的内容</h2>
  <p class="section-subtitle">
    已上架 Google Play。无订阅，不玩虚的。
  </p>
  <a href="https://play.google.com/store/apps/details?id=com.pedronveloso.lazulite" data-umami-event="download_intent" data-umami-event-placement="footer">
    <img src="/images/google-play-badge.png" alt="在 Google Play 获取 Lazulite" width="200" height="77" loading="lazy">
  </a>
</section>

</div>
