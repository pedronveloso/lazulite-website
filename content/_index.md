+++
author = "Pedro Veloso"
description = "Bluetooth audio inspector for Android. Check the active codec, encoding quality, playback app output, and recent Android-reported playback issues."
+++

<div class="homepage">

<!-- Hero Section -->
<section class="hero-section">
  {{< audio-art kind="headphone" >}}
  <img src="/images/lazulite-logo-500.png" alt="Lazulite App logo" class="hero-logo" width="270" height="270">

  <h1 class="hero-title">
    <span class="accent-text">LAZULITE</span>
  </h1>

  <p class="hero-subtitle">
    Streaming apps claim lossless. Your headphones say otherwise.<br>
    Lazulite shows exactly what's being delivered.
  </p>

  <div class="cta-buttons">
    <a href="https://play.google.com/store/apps/details?id=com.pedronveloso.lazulite" class="btn btn-primary" data-umami-event="download_intent" data-umami-event-placement="hero">
      Download Now
    </a>
    <a href="#features" class="btn btn-secondary">
      See Features
    </a>
  </div>
</section>

<!-- Main Features Showcase -->
<section id="features" class="section">
  <h2 class="section-title">Why Audiophiles Choose <span class="accent-text">Lazulite</span></h2>
  <p class="section-subtitle">
    Know exactly what your gear is doing to your audio.
  </p>

  <div class="two-column">
    <div class="column">
      {{< app-media role="home" alt="Lazulite Home showing the active aptX Adaptive codec and Bluetooth audio path" >}}
    </div>
    <div class="column">
      <h2 class="section-title section-title--left">Real-Time Audio Analysis</h2>
      <p class="feature-body">
        Check the codec your phone and headphones selected: LDAC, aptX HD, AAC, SBC, or another supported format. Refresh to see the latest reported configuration.
      </p>
      <p class="feature-body">
        See the sample rate, bit depth, and available bitrate or encoding quality information for the active connection.
      </p>
      <p class="feature-body">
        Open Audio path details to compare playback app output with the Bluetooth format and see where Android changes the audio format.
      </p>
      {{< audio-art kind="wave" >}}
    </div>
  </div>
</section>

<!-- Playback health -->
<section class="section">
  <div class="two-column reverse">
    <div class="column">
      <h2 class="section-title section-title--left">Bluetooth Glitch or Bad Connection?</h2>
      <p class="feature-body">
        Playback health compares Android diagnostics when you refresh. Check newly reported audio underruns, outgoing buffer drops, and connection issues attributable to the device playing audio.
      </p>
      <ul class="feature-body feature-list">
        <li>Audio buffer underruns</li>
        <li>Outgoing audio buffer drops</li>
        <li>Recent connection issues during playback</li>
        <li>Coverage based on the diagnostics your device provides</li>
      </ul>
      <p class="feature-body">
        These observations help you investigate playback problems. They do not establish a cause or whether a disruption was audible.
      </p>
    </div>
    <div class="column">
      {{< app-media role="playback-health" alt="Playback health card showing newly reported audio underruns and outgoing buffer drops" >}}
    </div>
  </div>
</section>

<!-- Smart Suggestions -->
<section class="section section-alt">
  <h2 class="section-title">Smart Suggestions</h2>
  <p class="section-subtitle">
    Find contextual setup tips and shortcuts to relevant system settings.
  </p>
  <div class="improve-section">
    {{< audio-art kind="earbud" >}}
    <div class="improve-section__image">
      {{< app-media role="setup-tips" alt="High-resolution setup tip with a shortcut to Bluetooth settings" >}}
    </div>
  </div>
</section>

<!-- App Screenshots -->
<section class="section app-showcase">
  <h2 class="section-title">See It In Action</h2>
  <div class="screenshot-mockup">
    {{< app-media role="home-video" alt="Lazulite Home recording showing LDAC codec details in a Pixel 8 frame" >}}
  </div>
</section>

<!-- CTA Section -->
<section class="section download-section">
  <h2 class="section-title">Hear What's Actually Playing</h2>
  <p class="section-subtitle">
    Available on Google Play. No subscriptions. No BS.
  </p>
  <a href="https://play.google.com/store/apps/details?id=com.pedronveloso.lazulite" data-umami-event="download_intent" data-umami-event-placement="footer">
    <img src="/images/google-play-badge.png" alt="Get Lazulite on Google Play" width="200" height="77" loading="lazy">
  </a>
</section>

</div>
