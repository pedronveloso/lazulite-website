+++
author = "Pedro Veloso"
description = "AndroidのBluetoothオーディオを詳しく確認。Lazuliteで使用中のコーデックやサンプリング周波数、ビット深度、再生アプリから出力先までの音声経路を調べられます。"
+++

<div class="homepage">

<section class="hero-section">
  <img src="/images/lazulite-logo-500.png" alt="Lazuliteのロゴ" class="hero-logo animated-float" width="270" height="270">

  <h1 class="hero-title">
    <span class="gradient-text">LAZULITE</span>
  </h1>

  <p class="hero-subtitle">
    いつもの音楽、どう届いている？<br>
    再生アプリからBluetooth機器まで、音声経路を確認できます。
  </p>

  <div class="cta-buttons">
    <a href="https://play.google.com/store/apps/details?id=com.pedronveloso.lazulite&hl=ja" class="btn btn-cyan" data-umami-event="download_intent" data-umami-event-placement="hero">
      Google Playで入手
    </a>
    <a href="#features" class="btn btn-purple">
      機能を見る
    </a>
  </div>
</section>

<section id="features" class="section">
  <h2 class="section-title">オーディオ好きのための<span class="gradient-text">Lazulite</span></h2>
  <p class="section-subtitle">
    対応コーデックと、今使っている設定。その両方を確認できます。
  </p>

  <div class="two-column">
    <div class="column">
      <img src="/images/codecs-info-2.webp" alt="AACのコーデック情報を表示したLazuliteの画面（英語表示）" class="feature-img" loading="lazy" width="1088" height="1357">
    </div>
    <div class="column">
      <h2 class="section-title section-title--left">使用中のコーデック</h2>
      <p class="feature-body">
        LDAC、aptX HD、AAC、SBCなど、スマートフォンとヘッドホンが接続時に選んだコーデックを表示します。端末や機器が対応するコーデックと、実際に使われているものを比べてみてください。
      </p>
      <p class="feature-body">
        サンプリング周波数やビット深度、取得できる場合はビットレートやエンコード品質の設定も確認できます。
      </p>
      <p class="feature-body">
        「音声経路の詳細」では、再生アプリの音声出力とBluetooth伝送の形式を見比べられます。サンプリング周波数が変換されている可能性も表示します。元の音源の品質や、耳に届く音を測定するものではありません。
      </p>
    </div>
  </div>
</section>

<section class="section">
  <div class="two-column reverse">
    <div class="column">
      <h2 class="section-title section-title--left">音切れが気になるときに</h2>
      <p class="feature-body" style="text-align: center">
        「再生状態の診断」では、更新のたびにAndroidの診断情報を比較します。新たに報告された音声のアンダーラン、送信バッファーの音声データの破棄、再生中の機器に関する接続の問題を確認できます。
      </p>
      <ul class="feature-body" style="text-align: left; padding-left: 20px;">
        <li>音声バッファーのデータ不足を確認</li>
        <li>送信待ち音声データの破棄を確認</li>
        <li>再生中に報告された接続の問題を確認</li>
        <li>取得できる診断情報は端末によって異なります</li>
      </ul>
      <p class="feature-body">
        原因や実際に音切れが聞こえたかどうかは、この情報だけではわかりません。無線で失われたパケット数やWi-Fi干渉を測定するものではありません。
      </p>
    </div>
    <div class="column">
      <img src="/images/packet-loss-stats.webp" alt="LazuliteのBluetooth診断情報の表示例（旧バージョン・英語表示）" class="feature-img" loading="lazy" width="924" height="540">
    </div>
  </div>
</section>

<section class="section section-alt">
  <h2 class="section-title">設定を見直すヒント</h2>
  <p class="section-subtitle">
    接続中の機器やコーデックに合わせたヒントから、試したい設定を見つけてみてください。
  </p>
  <div class="improve-section">
    <div class="improve-section__image">
      <img src="/images/setup-tips.webp" alt="オーディオ設定のヒントを表示したLazuliteの画面（英語表示）" class="feature-img" loading="lazy" width="590" height="325">
    </div>
  </div>
</section>

<section class="section app-showcase">
  <h2 class="section-title">画面で使い方をチェック</h2>
  <div class="screenshot-mockup">
    <img src="/images/lazulite-preview.webp" alt="Lazuliteでコーデック情報を確認する操作例（旧バージョン・英語表示）" width="360" height="780">
  </div>
</section>

<section class="section download-section">
  <h2 class="section-title">いつものオーディオを、もう少し詳しく</h2>
  <p class="section-subtitle">
    Google Playで配信中。サブスクリプションはありません。
  </p>
  <a href="https://play.google.com/store/apps/details?id=com.pedronveloso.lazulite&hl=ja" class="btn btn-cyan" data-umami-event="download_intent" data-umami-event-placement="footer">
    Google Playで入手
  </a>
</section>

</div>
