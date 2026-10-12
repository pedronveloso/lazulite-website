+++
author = "Pedro Veloso"
description = "Inspector audio Bluetooth per Android. Controlla codec attivo, qualità di codifica, uscita dell'app e problemi di riproduzione recenti riportati da Android."
+++

<div class="homepage">

<!-- Hero Section -->
<section class="hero-section">
  <img src="/images/lazulite-logo-500.png" alt="Logo dell'app Lazulite" class="hero-logo animated-float" width="270" height="270">

  <h1 class="hero-title">
    <span class="gradient-text">LAZULITE</span>
  </h1>

  <p class="hero-subtitle">
    Le app di streaming promettono audio lossless. Le tue cuffie raccontano un'altra storia.<br>
    Lazulite ti mostra esattamente cosa ti sta arrivando.
  </p>

  <div class="cta-buttons">
    <a href="https://play.google.com/store/apps/details?id=com.pedronveloso.lazulite" class="btn btn-cyan" data-umami-event="download_intent" data-umami-event-placement="hero">
      Scarica ora
    </a>
    <a href="#features" class="btn btn-purple">
      Scopri le funzioni
    </a>
  </div>
</section>

<!-- Main Features Showcase -->
<section id="features" class="section">
  <h2 class="section-title">Perché gli audiofili scelgono <span class="gradient-text">Lazulite</span></h2>
  <p class="section-subtitle">
    Scopri esattamente cosa fa il tuo equipaggiamento al tuo audio.
  </p>

  <div class="two-column">
    <div class="column">
      {{< app-media role="home" alt="Home di Lazulite con codec aptX Adaptive attivo e percorso audio Bluetooth" >}}
    </div>
    <div class="column">
      <h2 class="section-title section-title--left">Analisi audio in tempo reale</h2>
      <p class="feature-body">
        Controlla il codec scelto dal telefono e dalle cuffie: LDAC, aptX HD, AAC, SBC o un altro formato supportato. Aggiorna per vedere l'ultima configurazione riportata da Android.
      </p>
      <p class="feature-body">
        Consulta frequenza di campionamento, profondità di bit e, quando disponibili, bitrate e impostazioni della qualità di codifica.
      </p>
      <p class="feature-body">
        Apri i dettagli del percorso audio per confrontare l'uscita dell'app di riproduzione con il formato Bluetooth e vedere dove Android modifica il formato audio.
      </p>
    </div>
  </div>
</section>

<!-- Playback health -->
<section class="section">
  <div class="two-column reverse">
    <div class="column">
      <h2 class="section-title section-title--left">Problema col Bluetooth o connessione debole?</h2>
      <p class="feature-body">
        Lo stato di riproduzione confronta la diagnostica di Android a ogni aggiornamento. Controlla nuovi underrun audio, scarti dei buffer in uscita e problemi di connessione attribuibili al dispositivo che sta riproducendo audio.
      </p>
      <ul class="feature-body" style="text-align: left; padding-left: 20px;">
        <li>Dati insufficienti nel buffer audio</li>
        <li>Scarti dei buffer audio in uscita</li>
        <li>Problemi di connessione recenti durante la riproduzione</li>
        <li>Copertura basata sulla diagnostica disponibile sul dispositivo</li>
      </ul>
      <p class="feature-body">
        Queste osservazioni aiutano a indagare sui problemi di riproduzione. Non stabiliscono la causa né se un'interruzione sia stata udibile.
      </p>
    </div>
    <div class="column">
      {{< app-media role="playback-health" alt="Scheda dello stato di riproduzione con nuovi underrun audio e scarti dei buffer in uscita" >}}
    </div>
  </div>
</section>

<!-- Smart Suggestions -->
<section class="section section-alt">
  <h2 class="section-title">Suggerimenti intelligenti</h2>
  <p class="section-subtitle">
    Trova suggerimenti in base alla configurazione e collegamenti alle impostazioni di sistema pertinenti.
  </p>
  <div class="improve-section">
    <div class="improve-section__image">
      {{< app-media role="setup-tips" alt="Suggerimento per l'alta risoluzione con accesso alle impostazioni Bluetooth" >}}
    </div>
  </div>
</section>

<!-- App Screenshots -->
<section class="section app-showcase">
  <h2 class="section-title">Guardala in azione</h2>
  <div class="screenshot-mockup">
    {{< app-media role="home-video" alt="Registrazione della Home di Lazulite con dettagli LDAC e cornice Pixel 8" >}}
  </div>
</section>

<!-- CTA Section -->
<section class="section download-section">
  <h2 class="section-title">Ascolta cosa sta davvero suonando</h2>
  <p class="section-subtitle">
    Disponibile su Google Play. Nessun abbonamento. Nessuna fregatura.
  </p>
  <a href="https://play.google.com/store/apps/details?id=com.pedronveloso.lazulite" data-umami-event="download_intent" data-umami-event-placement="footer">
    <img src="/images/google-play-badge.png" alt="Scarica Lazulite su Google Play" width="200" height="77" loading="lazy">
  </a>
</section>

</div>
