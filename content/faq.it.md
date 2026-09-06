---
title: "FAQ"
seoTitle: "FAQ Lazulite: permessi, codec Bluetooth, configurazione e compatibilità"
description: "Risposte sui permessi di Lazulite, la configurazione ADB, Shizuku, il supporto ai codec Bluetooth, il monitoraggio della perdita di pacchetti e la compatibilità audio Android."
date: 2023-12-25T16:18:23-07:00
draft: false
showMetadata: false
schemaType: "FAQPage"
faqSchema:
  - question: "Perché Lazulite ha bisogno di permessi speciali?"
    answer: "Lazulite legge i log di sistema audio di Android per mostrare in tempo reale le informazioni sui codec Bluetooth e sui dati di trasmissione. Android limita l'accesso a questi log, quindi il permesso va concesso tramite ADB, Shizuku o accesso root."
  - question: "Quali codec Bluetooth supporta Lazulite?"
    answer: "Lazulite può rilevare i codec audio Bluetooth supportati e negoziati dal tuo dispositivo, tra cui LDAC, aptX, aptX HD, aptX Adaptive, LC3, MIHC, Opus, le varianti LHDC, AAC, SBC e i codec Samsung SSC, quando disponibili."
  - question: "Posso usare Lazulite con cuffie cablate?"
    answer: "No. Lazulite monitora lo stack audio Bluetooth, inclusa la negoziazione del codec e la qualità della trasmissione. L'audio cablato non passa dal Bluetooth, quindi non ci sono dati sul codec Bluetooth da analizzare."
  - question: "Lazulite consuma batteria?"
    answer: "L'impatto sulla batteria è minimo. Lazulite legge log di sistema già esistenti e non genera elaborazione Bluetooth aggiuntiva quando non stai usando l'app."
---

# Domande frequenti

<nav class="faq-nav" aria-label="Sezioni FAQ">
  <a href="#permissions">Permessi e configurazione</a>
  <a href="#codecs">Codec e compatibilità</a>
  <a href="#privacy">Privacy e dati</a>
  <a href="#usage">Utilizzo e comportamento</a>
</nav>

---

<h2 id="permissions">Permessi e configurazione</h2>

<details data-umami-faq="special_permissions">
<summary>Perché Lazulite ha bisogno di permessi speciali?</summary>
<div class="faq-body">
<p>Lazulite ha bisogno del permesso di leggere i log audio di sistema di Android per mostrarti in tempo reale le informazioni sul codec e i dati di trasmissione Bluetooth. Android limita l'accesso a questi log per motivi di privacy e sicurezza, quindi dovrai concedere il permesso con uno di questi tre metodi:</p>

<h3>Opzione 1: Shizuku (consigliata per la maggior parte degli utenti)</h3>
<p><strong>Ideale per:</strong> la maggior parte degli utenti, in particolare per chi preferisce configurare Lazulite direttamente dal telefono</p>
<p><a href="https://github.com/thedjchi/Shizuku">Shizuku</a> consente a Lazulite di accedere alle informazioni di sistema necessarie senza root. Su Android 11 e versioni successive, puoi avviare Shizuku tramite il debug wireless, senza collegare il telefono a un computer. Dopo aver riavviato il dispositivo, dovrai avviare nuovamente Shizuku prima di aprire Lazulite.</p>
<p><a href="https://www.youtube.com/shorts/pnHNdU6LppA">▶ Video guida: come attivare Shizuku</a></p>

<h3>Opzione 2: ADB (per utenti che conoscono già ADB)</h3>
<p><strong>Ideale per:</strong> utenti che sanno già utilizzare ADB da un computer</p>
<p>Installa <a href="https://developer.android.com/tools/releases/platform-tools">Android SDK Platform-Tools</a>, attiva il debug USB, collega e autorizza il telefono, quindi esegui:</p>
<pre><code>adb shell pm grant com.pedronveloso.lazulite android.permission.DUMP</code></pre>

<h3>Opzione 3: Accesso Root</h3>
<p><strong>Ideale per:</strong> utenti esperti con dispositivi con permessi di root</p>
<p>Se il tuo dispositivo è rootato, Lazulite può richiedere automaticamente i permessi necessari. È l'opzione più comoda, ma solo se hai già familiarità con il root su Android.</p>
</div>
</details>

<details data-umami-faq="adb_permissions_help">
<summary>Sono bloccato nella schermata dei permessi ADB</summary>
<div class="faq-body">
<p><strong>È la prima volta che usi ADB?</strong> Ti consigliamo di utilizzare Shizuku. L'opzione ADB è pensata per gli utenti che hanno già familiarità con l'esecuzione di comandi da un computer.</p>
<p>Se vuoi continuare con ADB, installa <a href="https://developer.android.com/tools/releases/platform-tools">Android SDK Platform-Tools</a>, attiva il debug USB, collega e autorizza il telefono, quindi esegui:</p>
<pre><code>adb shell pm grant com.pedronveloso.lazulite android.permission.DUMP</code></pre>
<p><strong>Hai già concesso il permesso ma non funziona?</strong> Verifica che:</p>
<ul>
<li>Il telefono sia collegato via USB con il debug USB attivato</li>
<li>Tu abbia autorizzato il computer sul telefono quando è comparsa la richiesta "Consentire debug USB?"</li>
<li><code>adb devices</code> mostri il telefono come <code>device</code> e non come <code>unauthorized</code></li>
<li>Tu abbia eseguito il comando di concessione esattamente come indicato sopra</li>
</ul>
<p><strong>Stai usando Shizuku?</strong> Assicurati che Shizuku sia in esecuzione prima di avviare Lazulite.</p>
</div>
</details>

---

<h2 id="codecs">Codec e compatibilità</h2>

<details data-umami-faq="codec_support">
<summary>Quali codec Bluetooth supporta Lazulite?</summary>
<div class="faq-body">
<p>Lazulite può rilevare e mostrare tutti i codec audio Bluetooth supportati dal tuo dispositivo:</p>
<ul>
<li>LDAC, aptX, aptX HD, aptX Adaptive, aptX TWS, LC3, MIHC, Opus</li>
<li>LHDC V1, LHDC V2, LHDC V3, LHDC V4, LHDC V5</li>
<li>AAC, SBC</li>
<li>SSC, SSC UHQ (solo dispositivi Samsung)</li>
</ul>
<p>Se il tuo dispositivo e le tue cuffie lo supportano e si accordano per usarlo, Lazulite te lo mostrerà.</p>
</div>
</details>

<details data-umami-faq="wired_headphones">
<summary>Posso usare Lazulite con cuffie cablate?</summary>
<div class="faq-body">
<p>Lazulite monitora lo stack audio Bluetooth: su quale codec si sono accordati telefono e cuffie, la qualità della trasmissione, la perdita di pacchetti. Le connessioni cablate saltano tutto questo, quindi non c'è nulla da leggere per Lazulite.</p>
<p>Con le cuffie cablate, l'audio va direttamente dal DAC del tuo dispositivo alle tue orecchie. Nessuna codifica wireless, nessuna selezione del codec.</p>
</div>
</details>

<details data-umami-faq="codec_expectations">
<summary>Perché le app di streaming a volte mostrano codec diversi da quelli attesi?</summary>
<div class="faq-body">
<p>Molte app di streaming dichiarano qualità "lossless" o "hi-fi", ma il tuo dispositivo o le tue cuffie potrebbero forzare una ricodifica verso un codec di qualità inferiore prima che l'audio raggiunga le tue orecchie.</p>
<p>Lazulite mostra il <strong>codec effettivamente usato per la trasmissione Bluetooth</strong>, non quello dichiarato dall'app di streaming. Se stai pagando per audio hi-res ma vedi AAC 256kbps in Lazulite, ora sai cosa sta davvero succedendo.</p>
</div>
</details>

<details data-umami-faq="hardware_offload">
<summary>Cos'è l'offload hardware A2DP, e Lazulite lo mostra?</summary>
<div class="faq-body">
<p>Alcuni dispositivi Android possono spostare la codifica audio Bluetooth dal processore principale a hardware audio o Bluetooth dedicato. Questo può ridurre il lavoro della CPU e il consumo energetico durante la riproduzione.</p>
<p>Lazulite rileva quando l'offload hardware A2DP è attivo e mostra quali codec supporta l'hardware del tuo dispositivo per questa funzione. Un codec presente in quell'elenco non significa che venga usato nella tua connessione attuale: dipende dal codec in uso, dal dispositivo connesso, dalle impostazioni di sistema e da come l'ha implementato il produttore.</p>
</div>
</details>

<details data-umami-faq="vendor_lookup">
<summary>Lazulite può dirmi la marca delle mie cuffie connesse?</summary>
<div class="faq-body">
<p>Sì. Attiva "Cerca il fornitore della destinazione" in Impostazioni e Lazulite mostrerà il produttore del tuo dispositivo Bluetooth connesso accanto agli altri dettagli.</p>
<p>Questa opzione è disattivata per impostazione predefinita. Quando la attivi, Lazulite invia solo le prime tre coppie dell'indirizzo MAC di destinazione a MACLookup per identificare il fornitore. Nessun'altra parte dell'indirizzo viene mai inviata.</p>
</div>
</details>

---

<h2 id="privacy">Privacy e dati</h2>

<details data-umami-faq="mobile_data">
<summary>Lazulite usa i miei dati mobili?</summary>
<div class="faq-body">
<p>Lazulite esegue tutta l'analisi audio localmente sul tuo dispositivo. Nessun dato lascia il telefono, a meno che tu non scelga di condividerlo.</p>
<p><strong>Telemetria opzionale:</strong> l'app può raccogliere dati anonimi di utilizzo e crash tramite Google Firebase per aiutare a migliorare la stabilità. Utilizza dati minimi ed è conforme alle normative sulla privacy a livello globale.</p>
<p><strong>Ricerca del fornitore opzionale:</strong> se attivi "Cerca il fornitore della destinazione" in Impostazioni, Lazulite invia le prime tre coppie dell'indirizzo MAC del tuo dispositivo connesso a MACLookup per identificarne il produttore. Nessun'altra parte dell'indirizzo viene inviata, e l'opzione resta disattivata finché non la attivi tu.</p>
<p><strong>Vuoi disattivarla?</strong> Vai su Impostazioni → Disattiva "Dati di telemetria" o "Cerca il fornitore della destinazione"</p>
</div>
</details>

---

<h2 id="usage">Utilizzo e comportamento</h2>

<details data-umami-faq="battery_impact">
<summary>Lazulite consuma batteria?</summary>
<div class="faq-body">
<p><strong>In breve:</strong> no, impatto trascurabile.</p>
<p>Lazulite legge solo i log di sistema che il tuo dispositivo genera comunque. Non crea processi aggiuntivi e non gira in background quando non lo stai usando.</p>
<p><strong>Nota:</strong> Lazulite monitora i log del tuo telefono, non le tue cuffie Bluetooth. La batteria degli auricolari non ne risente.</p>
</div>
</details>

---

## Altre domande?

Sei ancora bloccato o hai domande non trattate qui? [Scrivici una email](mailto:lazuliteapp@gmail.com) e ti aiuteremo.
