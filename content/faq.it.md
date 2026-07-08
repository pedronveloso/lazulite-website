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
    answer: "Lazulite può rilevare i codec audio Bluetooth supportati e negoziati dal tuo dispositivo, tra cui LDAC, aptX, aptX HD, aptX Adaptive, LC3, le varianti LHDC, AAC, SBC e i codec Samsung SSC, quando disponibili."
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

<details>
<summary>Perché Lazulite ha bisogno di permessi speciali?</summary>
<div class="faq-body">
<p>Lazulite ha bisogno del permesso di leggere i log audio di sistema di Android per mostrarti in tempo reale le informazioni sul codec e i dati di trasmissione Bluetooth. Android limita l'accesso a questi log per motivi di privacy e sicurezza, quindi dovrai concedere il permesso con uno di questi tre metodi:</p>

<h3>Opzione 1: ADB (consigliata per la maggior parte degli utenti)</h3>
<p><strong>Ideale per:</strong> chi usa l'app per la prima volta e chi non ha familiarità con la personalizzazione di Android</p>
<p>Questo è il metodo più semplice per la maggior parte delle persone. Collegherai il telefono al computer via USB ed eseguirai un semplice comando. Richiede circa 5 minuti e nessuna competenza tecnica particolare.</p>
<p><strong>Nota:</strong> dovrai concedere di nuovo il permesso dopo ogni riavvio del dispositivo.</p>
<p><a href="https://pedronveloso.com/android-lazulite-how-to-run-adb-command/">📖 Guida passo-passo ADB per Windows e MacOS</a></p>

<h3>Opzione 2: Shizuku</h3>
<p><strong>Ideale per:</strong> chi vuole permessi persistenti senza doverli concedere di nuovo dopo ogni riavvio</p>
<p><a href="https://shizuku.rikka.app/">Shizuku</a> è un'app che aiuta altre app ad accedere ai permessi di sistema. Una volta configurata, i permessi restano attivi anche dopo il riavvio. Richiede una configurazione ADB iniziale, ma non dovrai più ricollegare il telefono in seguito.</p>
<p><a href="https://www.youtube.com/shorts/pnHNdU6LppA">▶ Video guida: come attivare Shizuku</a></p>

<h3>Opzione 3: Accesso Root</h3>
<p><strong>Ideale per:</strong> utenti esperti con dispositivi con permessi di root</p>
<p>Se il tuo dispositivo è rootato, Lazulite può richiedere automaticamente i permessi necessari. È l'opzione più comoda, ma solo se hai già familiarità con il root su Android.</p>
</div>
</details>

<details>
<summary>Sono bloccato nella schermata dei permessi ADB</summary>
<div class="faq-body">
<p><strong>Prima volta che configuri l'app?</strong> Segui il nostro tutorial dettagliato che ti guida nell'installazione di ADB e nella concessione dei permessi:</p>
<p><a href="https://pedronveloso.com/android-lazulite-how-to-run-adb-command/">Configurazione di Lazulite semplificata: installare ADB su Windows e MacOS</a></p>
<p><strong>Hai già concesso il permesso ma non funziona?</strong> Verifica che:</p>
<ul>
<li>Il telefono sia collegato via USB con il debug USB attivato</li>
<li>Tu abbia autorizzato il computer sul telefono quando è comparsa la richiesta "Consentire debug USB?"</li>
<li>Stia eseguendo esattamente il comando ADB mostrato nel tutorial</li>
</ul>
<p><strong>Stai usando Shizuku?</strong> Assicurati che Shizuku sia in esecuzione prima di avviare Lazulite.</p>
</div>
</details>

---

<h2 id="codecs">Codec e compatibilità</h2>

<details>
<summary>Quali codec Bluetooth supporta Lazulite?</summary>
<div class="faq-body">
<p>Lazulite può rilevare e mostrare tutti i codec audio Bluetooth supportati dal tuo dispositivo:</p>
<ul>
<li>LDAC, aptX, aptX HD, aptX Adaptive, aptX TWS, LC3</li>
<li>LHDC V1, LHDC V2, LHDC V3, LHDC V4, LHDC V5</li>
<li>AAC, SBC</li>
<li>SSC, SSC UHQ (solo dispositivi Samsung)</li>
</ul>
<p>Se il tuo dispositivo e le tue cuffie lo supportano e si accordano per usarlo, Lazulite te lo mostrerà.</p>
</div>
</details>

<details>
<summary>Posso usare Lazulite con cuffie cablate?</summary>
<div class="faq-body">
<p>Lazulite monitora lo stack audio Bluetooth: su quale codec si sono accordati telefono e cuffie, la qualità della trasmissione, la perdita di pacchetti. Le connessioni cablate saltano tutto questo, quindi non c'è nulla da leggere per Lazulite.</p>
<p>Con le cuffie cablate, l'audio va direttamente dal DAC del tuo dispositivo alle tue orecchie. Nessuna codifica wireless, nessuna selezione del codec.</p>
</div>
</details>

<details>
<summary>Perché le app di streaming a volte mostrano codec diversi da quelli attesi?</summary>
<div class="faq-body">
<p>Molte app di streaming dichiarano qualità "lossless" o "hi-fi", ma il tuo dispositivo o le tue cuffie potrebbero forzare una ricodifica verso un codec di qualità inferiore prima che l'audio raggiunga le tue orecchie.</p>
<p>Lazulite mostra il <strong>codec effettivamente usato per la trasmissione Bluetooth</strong>, non quello dichiarato dall'app di streaming. Se stai pagando per audio hi-res ma vedi AAC 256kbps in Lazulite, ora sai cosa sta davvero succedendo.</p>
</div>
</details>

---

<h2 id="privacy">Privacy e dati</h2>

<details>
<summary>Lazulite usa i miei dati mobili?</summary>
<div class="faq-body">
<p>Lazulite esegue tutta l'analisi audio localmente sul tuo dispositivo. Nessun dato lascia il telefono, a meno che tu non scelga di condividerlo.</p>
<p><strong>Telemetria opzionale:</strong> l'app può raccogliere dati anonimi di utilizzo e crash tramite Google Firebase per aiutare a migliorare la stabilità. Utilizza dati minimi ed è conforme alle normative sulla privacy a livello globale.</p>
<p><strong>Vuoi disattivarla?</strong> Vai su Impostazioni → Disattiva "Dati di telemetria"</p>
</div>
</details>

---

<h2 id="usage">Utilizzo e comportamento</h2>

<details>
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
