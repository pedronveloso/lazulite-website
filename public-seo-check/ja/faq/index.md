
<nav class="faq-nav" aria-label="よくある質問のカテゴリ">
  <a href="#permissions">権限と設定</a>
  <a href="#codecs">使用中のコーデックを確認</a>
  <a href="#compatibility">対応機器とコーデック</a>
  <a href="#audio-path">音声経路と機器の詳細</a>
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

<h2 id="codecs">使用中のコーデックを確認</h2>

<details id="active_codec" data-umami-faq="active_codec">
<summary>Androidが使用中のBluetoothコーデックを確認するには？</summary>
<div class="faq-body">
<p>AndroidスマートフォンにBluetoothオーディオ機器を接続し、<strong>音声を再生</strong>してから<strong>Lazuliteを更新</strong>してください。<strong>現在の接続</strong>に表示されるコーデックを確認できます。</p>
<p>対応コーデックの一覧は、スマートフォンと受信機器がそれぞれ使える形式を示すもので、現在使用中の形式とは異なります。</p>
</div>
</details>

<details id="ldac_active" data-umami-faq="ldac_active">
<summary>LDACが使われているか確認するには？</summary>
<div class="faq-body">
<p>再生を始めてLazuliteを更新し、<strong>使用中のコーデックにLDAC</strong>と表示されるか確認してください。対応コーデックの一覧にLDACがあっても、使用中とは限りません。</p>
<p><strong>Androidから情報を取得できる場合</strong>は、ビットレートやエンコード品質の設定も表示します。確認できる詳細は機器によって異なります。</p>
</div>
</details>

<details id="supported_vs_active" data-umami-faq="supported_vs_active">
<summary>対応コーデックと使用中のコーデックは何が違いますか？</summary>
<div class="faq-body">
<p><strong>対応コーデック</strong>は、スマートフォンと受信機器がそれぞれ報告する対応形式です。</p>
<p><strong>使用中のコーデック</strong>は、現在のBluetooth接続で両方の機器が合意して選んだ形式です。</p>
<p>対応一覧にあるコーデックでも、再生時に選ばれているとは限りません。</p>
</div>
</details>

<details id="codec_control" data-umami-faq="codec_control">
<summary>LazuliteでBluetoothコーデックを変更できますか？</summary>
<div class="faq-body">
<p>Lazuliteは<strong>Bluetooth接続の情報を確認</strong>し、関連するシステム設定へのショートカットを提供します。</p>
<p>コーデックを自動で選択したり、スマートフォンや受信機器が対応していないコーデックを有効にしたりすることは<strong>できません</strong>。変更できる項目はシステム設定で操作してください。</p>
</div>
</details>

<h2 id="compatibility">対応機器とコーデック</h2>

<details id="tablet_support" data-umami-faq="tablet_support">
<summary>Androidタブレットでも使えますか？</summary>
<div class="faq-body">
<p>はい。Lazuliteはスマートフォンだけでなく<strong>Androidタブレット</strong>にも対応し、大きな画面に合わせてレイアウトが変わります。</p>
<p>タブレットのスピーカーや有線ヘッドホンで再生しているときも、<strong>再生アプリが報告する音声出力</strong>を確認できます。Bluetoothオーディオ機器を接続すると、コーデックや伝送の詳細も表示します。確認できる情報は、タブレットやAndroidのバージョン、再生アプリによって異なります。</p>
</div>
</details>

<details data-umami-faq="codec_support">
<summary>どのBluetoothコーデックに対応していますか？</summary>
<div class="faq-body">
<p><strong>端末が情報を公開している場合</strong>、次のBluetoothオーディオコーデックを検出・表示できます。</p>
<ul>
<li>LDAC、aptX、aptX HD、aptX Adaptive、aptX TWS、LC3、MIHC、Opus</li>
<li>LHDC（下の<a href="#lhdc-versions">LHDCバージョンの対応状況</a>をご覧ください）</li>
<li>AAC、SBC</li>
<li>SSC、SSC UHQ（<strong>Samsung端末のみ</strong>）</li>
</ul>
<p>スマートフォンと出力先の対応コーデックを別々に確認できます。両方が対応していても、その接続で使われるとは限りません。接続時に選ばれたコーデックは、使用中のコーデックとして表示します。</p>
</div>
</details>

<details id="lhdc-versions" data-umami-faq="lhdc_versions">
<summary>どのLHDCバージョンに対応していますか？</summary>
<div class="faq-body">
<p>Lazuliteは<strong>LHDC V2、V3、V5で動作確認済み</strong>です。<strong>理論上</strong>は現在および将来のすべてのLHDCバージョンに対応できるはずです。</p>
</div>
</details>

<details data-umami-faq="bluetooth_audio_devices">
<summary>LazuliteはBluetoothヘッドホン以外でも使えますか？</summary>
<div class="faq-body">
<p>はい。Lazuliteは、ヘッドホンやイヤホンのほか、スピーカー、カーオーディオ、Bluetoothオーディオレシーバーなどの<strong>Bluetoothオーディオ機器</strong>で使えます。</p>
<p>Bluetooth接続がなくても、有線ヘッドホンやスマートフォン・タブレットの内蔵スピーカーで再生しながら、<strong>再生アプリが報告する音声出力</strong>を確認できます。Bluetoothオーディオ機器を接続すると、コーデックや伝送の詳細も確認できます。表示できる情報は、Android端末や再生アプリ、接続するオーディオ機器によって異なります。</p>
</div>
</details>

<details data-umami-faq="wired_headphones">
<summary>有線ヘッドホンでも使えますか？</summary>
<div class="faq-body">
<p>はい。<strong>有線ヘッドホン</strong>でも使えます。Bluetooth接続は必要ありません。スマートフォンやタブレットの内蔵スピーカーで再生するときと同じように、<strong>再生アプリが報告する音声出力</strong>を表示します。</p>
<p>音声を再生して更新すると、取得できるサンプリング周波数やビット深度などを確認できます。アプリの出力を示す情報であり、有線ヘッドホンやDACを測定したものではありません。Bluetoothコーデックや伝送の詳細は、Bluetoothで再生するときに表示されます。</p>
</div>
</details>

<h2 id="audio-path">音声経路と機器の詳細</h2>

<details data-umami-faq="codec_expectations">
<summary>ストリーミングアプリの表示と、コーデックが違うのはなぜ？</summary>
<div class="faq-body">
<p><strong>Hi-Fi</strong>は幅広い意味で使われる表現で、特定の音声形式を示すものではありません。サービスによっては、CD品質を下回る音声からスタジオ相当の解像度の音声まで含むことがあります。</p>
<p>「音声経路の詳細」では、<strong>アプリが報告する音声出力</strong>を表示します。取得できる場合はサンプリング周波数やビット深度も確認でき、アプリからどの形式で音声が出ているかがわかります。</p>
<p>Bluetoothで再生する場合、Androidは、その出力をスマートフォンやタブレットと接続機器が合意した<strong>Bluetoothコーデック</strong>で再エンコードして送信します。報告された形式から、元の録音の品質や実際に聞こえる音質を測定することはできません。</p>
</div>
</details>

<details data-umami-faq="hardware_offload">
<summary>A2DPハードウェアオフロードとは？Lazuliteで確認できますか？</summary>
<div class="faq-body">
<p>A2DPハードウェアオフロードは、Bluetooth音声のエンコード処理をメインプロセッサーから<strong>専用のオーディオ機能やBluetoothハードウェア</strong>に移す仕組みです。再生中のCPU負荷や消費電力を抑えられる場合があります。</p>
<p>Lazuliteは、端末が報告する設定と対応コーデックを表示します。システムの設定フラグがオンで、音声を再生中かつ使用中のコーデックが対応一覧にある場合は「有効」、フラグがオンでも再生が一時停止中かコーデックの一致を確認できない場合は「利用可能」、フラグがオフの場合は「無効」と表示します。</p>
<p>コーデックが一覧にあることや一致することだけでは、実際にハードウェアで処理されている証明にはなりません。実際の経路は接続機器やシステム設定、メーカーの実装にもよります。オフロードは<strong>処理効率</strong>を高める機能で、音質を向上させるものではありません。</p>
</div>
</details>

<details data-umami-faq="vendor_lookup">
<summary>LazuliteのBluetoothメーカー検索では何がわかりますか？</summary>
<div class="faq-body">
<p>設定の「出力先のメーカーを検索」を有効にすると、接続したBluetoothオーディオ機器の<strong>MACアドレスの先頭部分</strong>を使い、関連するメーカー情報があれば表示します。表示されるのは、ヘッドホンやスピーカーなどの製品ブランドではなく、<strong>Bluetoothチップセットのメーカー</strong>の場合があります。アドレスがランダム化されている場合や、一致する登録情報がない場合など、結果が得られないこともあります。</p>
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
<p>Lazuliteは、端末がすでに作成した<strong>システムログ</strong>を読み取ります。ホーム画面の自動更新は、アプリがバックグラウンドにある間は動作しません。</p>
<p>使用中の消費電力は、端末や更新頻度などによって変わります。自動更新を使う場合は、設定の<strong>更新間隔</strong>を調整してみてください。</p>
<p>Bluetooth機器へ追加の音声を送って測定する仕組みではありません。</p>
</div>
</details>

---

## ほかに気になることはありますか？

ここで解決しない場合や、ほかの質問がある場合は、[メールでお問い合わせください](mailto:lazulite@pnvdigital.com)。

