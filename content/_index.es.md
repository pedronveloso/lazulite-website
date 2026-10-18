+++
author = "Pedro Veloso"
description = "Inspector de audio Bluetooth para Android. Consulta el códec activo, la calidad de codificación, la salida de la app y problemas de reproducción recientes indicados por Android."
+++

<div class="homepage">

<section class="hero-section">
  {{< audio-art kind="headphone" >}}
  {{< audio-art kind="headphone-right" >}}
  {{< hero-brand alt="Logotipo de la app Lazulite" >}}

  <p class="hero-subtitle">
    Las apps de streaming prometen audio sin pérdida. Tus auriculares pueden contar otra historia.<br>
    Lazulite te muestra exactamente qué te está llegando.
  </p>

  <div class="cta-buttons">
    <a href="https://play.google.com/store/apps/details?id=com.pedronveloso.lazulite" class="btn btn-primary" data-umami-event="download_intent" data-umami-event-placement="hero">
      Descargar ahora
    </a>
    <a href="#features" class="btn btn-secondary">
      Ver funciones
    </a>
  </div>
</section>

<section id="features" class="section">
  <h2 class="section-title feature-intro-title"><span data-intro-word>Por</span> <span data-intro-word>qué</span> <span data-intro-word>los</span> <span data-intro-word>audiófilos</span> <span data-intro-word>eligen</span> <span class="accent-text" data-intro-word>Lazulite</span></h2>
  <p class="section-subtitle">
    Descubre exactamente qué hace tu equipo con tu audio.
  </p>

  <div class="two-column">
    <div class="column">
      {{< app-media role="home" alt="Inicio de Lazulite con el códec aptX Adaptive activo y la ruta de audio Bluetooth" >}}
    </div>
    <div class="column">
      <h2 class="section-title section-title--left">Análisis de audio en tiempo real</h2>
      <p class="feature-body">
        Comprueba el códec que han seleccionado tu móvil y tus auriculares: LDAC, aptX HD, AAC, SBC u otro formato compatible. Actualiza para ver la última configuración indicada por Android.
      </p>
      <p class="feature-body">
        Consulta la frecuencia de muestreo, la profundidad de bits y, cuando estén disponibles, la tasa de bits o los ajustes de calidad de codificación.
      </p>
      <p class="feature-body">
        Abre los detalles de la ruta de audio para comparar la salida de la app de reproducción con el formato Bluetooth y ver dónde Android transforma el audio.
      </p>
      {{< audio-art kind="wave" >}}
    </div>
  </div>
</section>

<section class="section">
  <div class="two-column reverse">
    <div class="column">
      <h2 class="section-title section-title--left">¿Fallo de Bluetooth o mala conexión?</h2>
      <p class="feature-body">
        El estado de reproducción compara los diagnósticos de Android cada vez que actualizas. Consulta nuevos underruns de audio, descartes de búferes de salida y problemas de conexión atribuibles al dispositivo que está reproduciendo audio.
      </p>
      <ul class="feature-body feature-list">
        <li>Falta de datos en el búfer de audio</li>
        <li>Descartes de búferes de audio de salida</li>
        <li>Problemas de conexión recientes durante la reproducción</li>
        <li>Cobertura según los diagnósticos disponibles en tu dispositivo</li>
      </ul>
      <p class="feature-body">
        Estas observaciones te ayudan a investigar problemas de reproducción. No determinan la causa ni si se oyó un corte de audio.
      </p>
    </div>
    <div class="column">
      {{< app-media role="playback-health" alt="Tarjeta de estado de reproducción con nuevos underruns de audio y descartes de búferes de salida" >}}
    </div>
  </div>
</section>

<section class="section section-alt">
  <h2 class="section-title">Sugerencias inteligentes</h2>
  <p class="section-subtitle">
    Encuentra consejos según tu configuración y accesos a los ajustes del sistema correspondientes.
  </p>
  <div class="improve-section">
    {{< audio-art kind="earbud" >}}
    <div class="improve-section__image">
      {{< app-media role="setup-tips" alt="Consejo de alta resolución con acceso a los ajustes de Bluetooth" >}}
    </div>
  </div>
</section>

<section class="section app-showcase">
  <h2 class="section-title">Mírala en acción</h2>
  <div class="screenshot-mockup">
    {{< app-media role="home-video" alt="Grabación del inicio de Lazulite con detalles de LDAC y un marco de Pixel 8" >}}
  </div>
</section>

<section class="section download-section">
  <h2 class="section-title">Escucha lo que realmente se está reproduciendo</h2>
  <p class="section-subtitle">
    Disponible en Google Play. Sin suscripciones. Sin rodeos.
  </p>
  <a href="https://play.google.com/store/apps/details?id=com.pedronveloso.lazulite" data-umami-event="download_intent" data-umami-event-placement="footer">
    <img src="/images/google-play-badge.png" alt="Consigue Lazulite en Google Play" width="200" height="77" loading="lazy">
  </a>
</section>

</div>
