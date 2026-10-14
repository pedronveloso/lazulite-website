---
title: "よくある質問"
seoTitle: "Lazuliteのよくある質問：権限、設定、Bluetoothコーデックと対応機器"
description: "Lazuliteの権限設定、ShizukuやADBの使い方、対応Bluetoothコーデック、音声経路の確認、プライバシーについて紹介します。"
date: 2023-12-25T16:18:23-07:00
draft: false
showMetadata: false
schemaType: "FAQPage"
faqSchema:
  - question: "Lazuliteに追加の権限が必要なのはなぜ？"
    answer: "Lazuliteは、Androidのオーディオログを読み取り、Bluetoothコーデックや音声経路の情報を表示します。Androidはこのログへのアクセスを制限しているため、Shizuku、ADB、rootのいずれかで権限を許可する必要があります。"
  - question: "どのBluetoothコーデックに対応していますか？"
    answer: "端末が情報を公開している場合、LDAC、aptX、aptX HD、aptX Adaptive、aptX TWS、LC3、MIHC、Opus、LHDC各種、AAC、SBC、SamsungのSSCやSSC UHQなど、機器の対応コーデックと接続で使われているコーデックを確認できます。"
  - question: "どのLHDCバージョンに対応していますか？"
    answer: "LazuliteはLHDC V2、V3、V5で動作確認済みです。理論上は現在および将来のすべてのLHDCバージョンに対応できるはずです。"
  - question: "LazuliteはBluetoothヘッドホン以外でも使えますか？"
    answer: "はい。Lazuliteは、ヘッドホンやイヤホンのほか、スピーカー、カーオーディオ、BluetoothオーディオレシーバーなどのBluetoothオーディオ機器で使えます。Androidスマートフォンに機器を接続して音声を再生すると、BluetoothコーデックやAndroidが報告する音声経路を確認できます。表示できる詳細情報は、スマートフォンと接続機器によって異なります。"
  - question: "有線ヘッドホンでも使えますか？"
    answer: "有線オーディオの解析には対応していません。LazuliteはBluetooth接続のコーデックや音声経路を調べるアプリです。有線接続はBluetoothを使わないため、解析するBluetoothコーデック情報がありません。"
  - question: "バッテリーの消費は増えますか？"
    answer: "Lazuliteは端末がすでに作成したシステムログを読み取ります。ホーム画面の自動更新はバックグラウンドでは動作しません。使用中の消費電力は、端末や更新頻度などによって変わります。"
---

<nav class="faq-nav" aria-label="よくある質問のカテゴリ">
  <a href="#permissions">権限と設定</a>
  <a href="#codecs">コーデックと対応機器</a>
  <a href="#privacy">プライバシーとデータ</a>
  <a href="#usage">使い方と動作</a>
</nav>

---

<h2 id="permissions">権限と設定</h2>

<details data-umami-faq="special_permissions">
<summary>Lazuliteに追加の権限が必要なのはなぜ？</summary>
<div class="faq-body">
<p>Lazuliteは、Androidのオーディオログを読み取り、Bluetoothコーデックや音声経路の情報を表示します。Androidはプライバシーとセキュリティのためにログへのアクセスを制限しているので、次のいずれかの方法で許可する必要があります。</p>

<h3>方法1：Shizuku（おすすめ）</h3>
<p><strong>こんな方に：</strong>スマートフォンだけで設定したい方</p>
<p><a href="https://github.com/thedjchi/Shizuku">Shizuku</a>を使うと、root化せずに必要なシステム情報へアクセスできます。Android 11以降では、パソコンに接続せず「ワイヤレス デバッグ」でShizukuを起動できます。端末を再起動した後は、Lazuliteを開く前にShizukuをもう一度起動してください。</p>
<p><a href="https://www.youtube.com/shorts/pnHNdU6LppA">▶ Shizukuの有効化手順を動画で見る</a></p>

<h3>方法2：ADB</h3>
<p><strong>こんな方に：</strong>パソコンからADBコマンドを使い慣れている方</p>
<p><a href="https://developer.android.com/tools/releases/platform-tools">Android SDK Platform-Tools</a>をインストールし、USBデバッグを有効にしてください。端末を接続してパソコンからのアクセスを許可したら、次のコマンドを実行します。</p>
<pre><code>adb shell pm grant com.pedronveloso.lazulite android.permission.DUMP</code></pre>

<h3>方法3：root権限</h3>
<p><strong>こんな方に：</strong>すでにroot化した端末を使っている上級者</p>
<p>端末がroot化されている場合は、Lazuliteから必要な権限をリクエストできます。Lazuliteのために端末をroot化する必要はありません。通常はShizukuがおすすめです。</p>
</div>
</details>

<details data-umami-faq="adb_permissions_help">
<summary>ADBの権限設定から先に進めません</summary>
<div class="faq-body">
<p><strong>ADBを初めて使いますか？</strong>その場合はShizukuがおすすめです。ADBによる設定は、パソコンでのコマンド操作に慣れている方向けです。</p>
<p>ADBで続ける場合は、<a href="https://developer.android.com/tools/releases/platform-tools">Android SDK Platform-Tools</a>をインストールし、USBデバッグを有効にしてください。端末を接続してアクセスを許可したら、次のコマンドを実行します。</p>
<pre><code>adb shell pm grant com.pedronveloso.lazulite android.permission.DUMP</code></pre>
<p><strong>権限を許可しても動かない場合は、次の点を確認してください。</strong></p>
<ul>
<li>USBデバッグが有効で、端末がUSBで接続されていること</li>
<li>端末の「USBデバッグを許可しますか？」で、接続したパソコンを許可したこと</li>
<li><code>adb devices</code>で端末が<code>unauthorized</code>ではなく<code>device</code>と表示されること</li>
<li>上の権限付与コマンドをそのまま実行したこと</li>
</ul>
<p><strong>Shizukuを使っている場合：</strong>Lazuliteを開く前に、Shizukuが起動しているか確認してください。</p>
</div>
</details>

---

<h2 id="codecs">コーデックと対応機器</h2>

<details data-umami-faq="codec_support">
<summary>どのBluetoothコーデックに対応していますか？</summary>
<div class="faq-body">
<p>端末が情報を公開している場合、次のBluetoothオーディオコーデックを検出・表示できます。</p>
<ul>
<li>LDAC、aptX、aptX HD、aptX Adaptive、aptX TWS、LC3、MIHC、Opus</li>
<li>LHDC（下の<a href="#lhdc-versions">LHDCバージョンの対応状況</a>をご覧ください）</li>
<li>AAC、SBC</li>
<li>SSC、SSC UHQ（Samsung端末のみ）</li>
</ul>
<p>スマートフォンと出力先の対応コーデックを別々に確認できます。両方が対応していても、その接続で使われるとは限りません。接続時に選ばれたコーデックは、使用中のコーデックとして表示します。</p>
</div>
</details>

<details id="lhdc-versions" data-umami-faq="lhdc_versions">
<summary>どのLHDCバージョンに対応していますか？</summary>
<div class="faq-body">
<p>LazuliteはLHDC V2、V3、V5で動作確認済みです。理論上は現在および将来のすべてのLHDCバージョンに対応できるはずです。</p>
</div>
</details>

<details data-umami-faq="bluetooth_audio_devices">
<summary>LazuliteはBluetoothヘッドホン以外でも使えますか？</summary>
<div class="faq-body">
<p>はい。Lazuliteは、ヘッドホンやイヤホンのほか、スピーカー、カーオーディオ、BluetoothオーディオレシーバーなどのBluetoothオーディオ機器で使えます。Androidスマートフォンに機器を接続して音声を再生すると、BluetoothコーデックやAndroidが報告する音声経路を確認できます。表示できる詳細情報は、スマートフォンと接続機器によって異なります。</p>
</div>
</details>

<details data-umami-faq="wired_headphones">
<summary>有線ヘッドホンでも使えますか？</summary>
<div class="faq-body">
<p>有線オーディオの解析には対応していません。Lazuliteは、スマートフォンとBluetooth機器の接続で使われるコーデックや音声経路を調べるアプリです。</p>
<p>有線接続はBluetoothを使わないため、解析するBluetoothコーデック情報がありません。</p>
</div>
</details>

<details data-umami-faq="codec_expectations">
<summary>ストリーミングアプリの表示と、コーデックが違うのはなぜ？</summary>
<div class="faq-body">
<p>ストリーミングアプリの「ロスレス」や「ハイレゾ」は、配信される音源の形式を示すことがあります。一方、Bluetoothで送る音声は、端末や接続機器に合わせてAndroidが別のコーデックでエンコードします。</p>
<p>Lazuliteは、<strong>Bluetooth伝送で実際に使われているコーデック</strong>を表示します。「音声経路の詳細」では、取得できる場合にアプリの音声出力も確認できます。これらは元の音源の品質や、実際に聞こえる音質を測定したものではありません。</p>
</div>
</details>

<details data-umami-faq="hardware_offload">
<summary>A2DPハードウェアオフロードとは？Lazuliteで確認できますか？</summary>
<div class="faq-body">
<p>A2DPハードウェアオフロードは、Bluetooth音声のエンコード処理をメインプロセッサーから専用のオーディオ機能やBluetoothハードウェアに移す仕組みです。再生中のCPU負荷や消費電力を抑えられる場合があります。</p>
<p>Lazuliteは、端末が報告する設定と対応コーデックを表示します。システムの設定フラグがオンで、音声を再生中かつ使用中のコーデックが対応一覧にある場合は「有効」、フラグがオンでも再生が一時停止中かコーデックの一致を確認できない場合は「利用可能」、フラグがオフの場合は「無効」と表示します。</p>
<p>コーデックが一覧にあることや一致することだけでは、実際にハードウェアで処理されている証明にはなりません。実際の経路は接続機器やシステム設定、メーカーの実装にもよります。オフロードは処理効率を高める機能で、音質を向上させるものではありません。</p>
</div>
</details>

<details data-umami-faq="vendor_lookup">
<summary>LazuliteのBluetoothメーカー検索では何がわかりますか？</summary>
<div class="faq-body">
<p>設定の「出力先のメーカーを検索」を有効にすると、接続したBluetoothオーディオ機器のMACアドレスの先頭部分を使い、関連するメーカー情報があれば表示します。表示されるのは、ヘッドホンやスピーカーなどの製品ブランドではなく、Bluetoothチップセットのメーカーの場合があります。アドレスがランダム化されている場合や、一致する登録情報がない場合など、結果が得られないこともあります。</p>
<p>この設定は、設定値がまだ保存されていない場合はオンです。保存済みの設定はそのまま引き継がれ、設定画面からオフにできます。有効な場合は、メーカーを調べるためにMACアドレスの先頭3組だけをMACLookupに送信します。残りのアドレスは送信しません。</p>
</div>
</details>

---

<h2 id="privacy">プライバシーとデータ</h2>

<details data-umami-faq="mobile_data">
<summary>モバイルデータ通信は使いますか？</summary>
<div class="faq-body">
<p>オーディオ情報の解析は端末内で行います。任意の外部サービスを有効にした場合や、ログやアンケートの回答を送信した場合は、通信が発生します。</p>
<p><strong>クラッシュ診断：</strong>アプリの利用状況の分析データは収集しません。クラッシュ診断は初期状態ではオフです。有効にすると、安定性の改善のためにクラッシュレポートと技術的な診断ログをGoogle Firebase Crashlyticsに送信する場合があります。有効にする前に端末に保存されたレポートも、後から送信される場合があります。</p>
<p><strong>メーカー検索：</strong>設定の「出力先のメーカーを検索」が有効な場合、接続機器のMACアドレスの先頭3組をMACLookupに送信します。残りのアドレスは送信しません。この設定は、設定値が未保存の場合はオンです。保存済みの設定は引き継がれます。</p>
<p><strong>送信を止めるには：</strong>設定から「クラッシュ診断」または「出力先のメーカーを検索」をオフにしてください。詳しくは<a href="/ja/privacy/">プライバシーポリシー</a>をご確認ください。</p>
</div>
</details>

---

<h2 id="usage">使い方と動作</h2>

<details data-umami-faq="battery_impact">
<summary>バッテリーの消費は増えますか？</summary>
<div class="faq-body">
<p>Lazuliteは、端末がすでに作成したシステムログを読み取ります。ホーム画面の自動更新は、アプリがバックグラウンドにある間は動作しません。</p>
<p>使用中の消費電力は、端末や更新頻度などによって変わります。自動更新を使う場合は、設定の更新間隔を調整してみてください。</p>
<p>Bluetooth機器へ追加の音声を送って測定する仕組みではありません。</p>
</div>
</details>

---

## ほかに気になることはありますか？

ここで解決しない場合や、ほかの質問がある場合は、[メールでお問い合わせください](mailto:lazuliteapp@gmail.com)。
