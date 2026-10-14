
<nav class="faq-nav" aria-label="Secciones de preguntas frecuentes">
  <a href="#permissions">Permisos y configuración</a>
  <a href="#codecs">Códecs y compatibilidad</a>
  <a href="#privacy">Privacidad y datos</a>
  <a href="#usage">Uso y comportamiento</a>
</nav>

---

<h2 id="permissions">Permisos y configuración</h2>

<details data-umami-faq="special_permissions">
<summary>¿Por qué Lazulite necesita permisos especiales?</summary>
<div class="faq-body">
<p>Lazulite necesita permiso para leer los registros de audio de tu sistema Android y así mostrar información sobre códecs Bluetooth y la ruta de audio. Android restringe el acceso a estos registros por motivos de privacidad y seguridad, así que tendrás que conceder permiso usando uno de estos tres métodos:</p>

<h3>Opción 1: Shizuku (recomendado para la mayoría)</h3>
<p><strong>Ideal para:</strong> la mayoría de usuarios, especialmente quienes prefieren configurar Lazulite directamente desde el teléfono</p>
<p><a href="https://github.com/thedjchi/Shizuku">Shizuku</a> permite que Lazulite acceda a la información del sistema que necesita sin root. En Android 11 y versiones posteriores, puedes iniciar Shizuku mediante la depuración inalámbrica, sin conectar el teléfono a un ordenador. Después de reiniciar el dispositivo, tendrás que volver a iniciar Shizuku antes de abrir Lazulite.</p>
<p><a href="https://www.youtube.com/shorts/pnHNdU6LppA">▶ Guía en video: cómo habilitar Shizuku</a></p>

<h3>Opción 2: ADB (para usuarios familiarizados con ADB)</h3>
<p><strong>Ideal para:</strong> usuarios que ya saben utilizar ADB desde un ordenador</p>
<p>Instala <a href="https://developer.android.com/tools/releases/platform-tools">Android SDK Platform-Tools</a>, activa la depuración USB, conecta y autoriza el teléfono y, después, ejecuta:</p>
<pre><code>adb shell pm grant com.pedronveloso.lazulite android.permission.DUMP</code></pre>

<h3>Opción 3: Acceso root</h3>
<p><strong>Ideal para:</strong> usuarios avanzados con dispositivos rooteados</p>
<p>Si tu dispositivo está rooteado, Lazulite puede solicitar automáticamente los permisos necesarios. Es la opción más cómoda, pero solo si ya te sientes cómodo haciendo root en dispositivos Android.</p>
</div>
</details>

<details data-umami-faq="adb_permissions_help">
<summary>Estoy atascado en la pantalla de permisos de ADB</summary>
<div class="faq-body">
<p><strong>¿Es la primera vez que usas ADB?</strong> Te recomendamos utilizar Shizuku. La opción ADB está pensada para usuarios que ya se sienten cómodos ejecutando comandos desde un ordenador.</p>
<p>Si quieres continuar con ADB, instala <a href="https://developer.android.com/tools/releases/platform-tools">Android SDK Platform-Tools</a>, activa la depuración USB, conecta y autoriza el teléfono y, después, ejecuta:</p>
<pre><code>adb shell pm grant com.pedronveloso.lazulite android.permission.DUMP</code></pre>
<p><strong>¿Ya diste permiso pero no funciona?</strong> Asegúrate de que:</p>
<ul>
<li>Tu teléfono esté conectado por USB y la depuración USB esté activada</li>
<li>Hayas autorizado el ordenador en el teléfono cuando apareció el mensaje "¿Permitir depuración USB?"</li>
<li><code>adb devices</code> muestre el teléfono como <code>device</code> y no como <code>unauthorized</code></li>
<li>Hayas ejecutado el comando de concesión exactamente como aparece arriba</li>
</ul>
<p><strong>¿Usas Shizuku?</strong> Verifica que Shizuku esté en ejecución antes de abrir Lazulite.</p>
</div>
</details>

---

<h2 id="codecs">Códecs y compatibilidad</h2>

<details data-umami-faq="codec_support">
<summary>¿Qué códecs Bluetooth admite Lazulite?</summary>
<div class="faq-body">
<p>Lazulite puede detectar y mostrar todos los códecs de audio Bluetooth compatibles con tu dispositivo:</p>
<ul>
<li>LDAC, aptX, aptX HD, aptX Adaptive, aptX TWS, LC3, MIHC, Opus</li>
<li>LHDC (consulta las <a href="#lhdc-versions">versiones de LHDC compatibles</a> más abajo)</li>
<li>AAC, SBC</li>
<li>SSC, SSC UHQ (solo en dispositivos Samsung)</li>
</ul>
<p>Si tu teléfono y tu dispositivo de audio Bluetooth lo admiten y ambos acuerdan usarlo, Lazulite lo mostrará.</p>
</div>
</details>

<details id="lhdc-versions" data-umami-faq="lhdc_versions">
<summary>¿Qué versiones de LHDC admite Lazulite?</summary>
<div class="faq-body">
<p>Lazulite se ha probado con LHDC V2, V3 y V5. En teoría, debería admitir todas las versiones actuales y futuras de LHDC.</p>
</div>
</details>

<details data-umami-faq="bluetooth_audio_devices">
<summary>¿Lazulite solo funciona con auriculares Bluetooth?</summary>
<div class="faq-body">
<p>No. Lazulite funciona con dispositivos de audio Bluetooth, incluidos auriculares de diadema e intraaurales, altavoces, sistemas de audio del coche y receptores de audio Bluetooth. Conecta el dispositivo a tu teléfono Android y reproduce audio para consultar su códec Bluetooth y la ruta de audio indicada por Android. Los detalles disponibles dependen del teléfono y del dispositivo conectado.</p>
</div>
</details>

<details data-umami-faq="wired_headphones">
<summary>¿Puedo usar Lazulite con auriculares con cable?</summary>
<div class="faq-body">
<p>No se admite la inspección de audio por cable. Lazulite muestra el códec seleccionado por tu teléfono y tu dispositivo de audio Bluetooth, junto con la ruta de audio indicada por Android.</p>
<p>Las conexiones por cable no usan Bluetooth, así que no hay datos de códec Bluetooth que Lazulite pueda inspeccionar.</p>
</div>
</details>

<details data-umami-faq="codec_expectations">
<summary>¿Por qué las apps de streaming a veces muestran códecs distintos de lo esperado?</summary>
<div class="faq-body">
<p>Muchas apps de streaming prometen calidad "lossless" o "hi-fi", pero tu dispositivo o tus auriculares pueden forzar una recodificación a un códec de menor calidad antes de que el audio llegue a tus oídos.</p>
<p>Lazulite muestra el <strong>códec real usado para la transmisión Bluetooth</strong>, no lo que informa la app de streaming. Si pagas por audio hi-res pero Lazulite muestra AAC a 256 kbps, ahora sabes qué está pasando en realidad.</p>
</div>
</details>

<details data-umami-faq="hardware_offload">
<summary>¿Qué es la descarga de hardware A2DP, y la muestra Lazulite?</summary>
<div class="faq-body">
<p>Algunos dispositivos Android pueden trasladar la codificación de audio Bluetooth del procesador principal a hardware de audio o Bluetooth dedicado. Esto puede reducir el trabajo de la CPU y el consumo durante la reproducción.</p>
<p>Lazulite detecta cuándo la descarga de hardware A2DP está activa y muestra qué códecs admite el hardware de tu dispositivo para ella. Que un códec aparezca en esa lista no significa que se esté usando en tu conexión actual: eso depende del códec en uso, el dispositivo conectado, los ajustes del sistema y cómo lo implementó el fabricante.</p>
</div>
</details>

<details data-umami-faq="vendor_lookup">
<summary>¿Qué identifica la búsqueda del fabricante Bluetooth de Lazulite?</summary>
<div class="faq-body">
<p>Con "Buscar proveedor del destino" activado en Ajustes, Lazulite usa el prefijo de la dirección MAC del dispositivo de audio Bluetooth conectado para buscar el fabricante asociado, cuando está disponible. El resultado puede identificar al fabricante del chipset Bluetooth en lugar de la marca de tus auriculares, altavoz u otro dispositivo de audio. No siempre hay un resultado disponible, por ejemplo, si la dirección es aleatoria o la búsqueda no encuentra un registro coincidente.</p>
<p>Esta opción está activada de forma predeterminada si no hay una preferencia guardada; se respetan las elecciones existentes. Puedes desactivarla en Ajustes. Cuando está activada, Lazulite envía solo los tres primeros pares de la dirección MAC de destino a MACLookup para identificar el proveedor. No se envía ninguna otra parte de la dirección.</p>
</div>
</details>

---

<h2 id="privacy">Privacidad y datos</h2>

<details data-umami-faq="mobile_data">
<summary>¿Lazulite usa mis datos móviles?</summary>
<div class="faq-body">
<p>Lazulite realiza todo el análisis de audio localmente en tu dispositivo. No se envía ningún dato desde tu teléfono a menos que elijas compartirlo.</p>
<p><strong>Diagnósticos de fallos opcionales:</strong> Lazulite no recopila analíticas de uso de la app. Los diagnósticos de fallos están desactivados de forma predeterminada; si los activas, pueden enviarse informes de fallos y registros técnicos de diagnóstico a Google Firebase Crashlytics para mejorar la estabilidad. Los informes almacenados localmente pueden cargarse después de activar la opción.</p>
<p><strong>Búsqueda opcional de proveedor:</strong> cuando "Buscar proveedor del destino" está activado en Ajustes, Lazulite envía los tres primeros pares de la dirección MAC de tu dispositivo conectado a MACLookup para identificar su fabricante. No se envía ninguna otra parte de la dirección, y la opción está activada de forma predeterminada si no hay una preferencia guardada. Se respetan las elecciones existentes y puedes desactivarla en Ajustes.</p>
<p><strong>¿Quieres desactivarlo?</strong> Ve a Ajustes → Desactiva "Diagnósticos de fallos" o "Buscar proveedor del destino".</p>
</div>
</details>

---

<h2 id="usage">Uso y comportamiento</h2>

<details data-umami-faq="battery_impact">
<summary>¿Lazulite agota la batería?</summary>
<div class="faq-body">
<p><strong>Resumen:</strong> no, el impacto es insignificante.</p>
<p>Lazulite solo lee registros del sistema que tu dispositivo ya genera de todos modos. No crea procesos adicionales ni se ejecuta en segundo plano cuando no lo estás usando.</p>
<p><strong>Nota:</strong> Lazulite monitoriza los registros del teléfono, no los de tus auriculares Bluetooth. La batería de tus audífonos no se ve afectada.</p>
</div>
</details>

---

## ¿Más preguntas?

Si sigues atascado o tienes dudas que no están aquí, [escríbenos por correo](mailto:lazuliteapp@gmail.com) y te ayudaremos.

