---
title: "Preguntas frecuentes"
seoTitle: "FAQ de Lazulite: permisos, códecs Bluetooth, configuración y compatibilidad"
description: "Respuestas sobre permisos de Lazulite, configuración con ADB, Shizuku, compatibilidad con códecs Bluetooth, monitoreo de pérdida de paquetes y audio en Android."
date: 2023-12-25T16:18:23-07:00
draft: false
showMetadata: false
schemaType: "FAQPage"
faqSchema:
  - question: "¿Por qué Lazulite necesita permisos especiales?"
    answer: "Lazulite lee los registros de audio del sistema Android para mostrar información en tiempo real sobre códecs Bluetooth y datos de transmisión. Android restringe esos registros, por lo que el permiso debe concederse con ADB, Shizuku o acceso root."
  - question: "¿Qué códecs Bluetooth admite Lazulite?"
    answer: "Lazulite puede detectar los códecs Bluetooth que tu dispositivo admite y negocia, incluidos LDAC, aptX, aptX HD, aptX Adaptive, LC3, variantes de LHDC, AAC, SBC y los códecs Samsung SSC cuando están disponibles."
  - question: "¿Puedo usar Lazulite con auriculares con cable?"
    answer: "No. Lazulite supervisa la pila de audio Bluetooth, incluida la negociación del códec y la calidad de transmisión. El audio por cable no usa Bluetooth, así que no hay datos de códec Bluetooth que inspeccionar."
  - question: "¿Lazulite consume mucha batería?"
    answer: "El impacto en batería es mínimo. Lazulite lee registros del sistema que ya existen y no crea procesamiento Bluetooth adicional cuando no estás usando la app."
---

# Preguntas frecuentes

<nav class="faq-nav" aria-label="Secciones de preguntas frecuentes">
  <a href="#permissions">Permisos y configuración</a>
  <a href="#codecs">Códecs y compatibilidad</a>
  <a href="#privacy">Privacidad y datos</a>
  <a href="#usage">Uso y comportamiento</a>
</nav>

---

<h2 id="permissions">Permisos y configuración</h2>

<details>
<summary>¿Por qué Lazulite necesita permisos especiales?</summary>
<div class="faq-body">
<p>Lazulite necesita permiso para leer los registros de audio de tu sistema Android y así mostrar información en tiempo real sobre códecs y transmisión Bluetooth. Android restringe el acceso a estos registros por motivos de privacidad y seguridad, así que tendrás que conceder permiso usando uno de estos tres métodos:</p>

<h3>Opción 1: ADB (recomendado para la mayoría)</h3>
<p><strong>Ideal para:</strong> usuarios que lo configuran por primera vez y personas sin experiencia modificando Android</p>
<p>Este es el método más sencillo para la mayoría. Conectarás tu teléfono al ordenador por USB y ejecutarás un comando simple. Lleva unos 5 minutos y no requiere conocimientos técnicos.</p>
<p><strong>Nota:</strong> tendrás que volver a conceder el permiso después de cada reinicio del dispositivo.</p>
<p><a href="https://pedronveloso.com/android-lazulite-how-to-run-adb-command/">📖 Tutorial paso a paso de ADB para Windows y macOS</a></p>

<h3>Opción 2: Shizuku</h3>
<p><strong>Ideal para:</strong> usuarios que quieren permisos persistentes sin repetir el proceso tras reiniciar</p>
<p><a href="https://shizuku.rikka.app/">Shizuku</a> es una app que ayuda a otras aplicaciones a acceder a permisos del sistema. Una vez configurada, los permisos se mantienen tras reiniciar. Requiere una configuración inicial con ADB, pero no tendrás que volver a conectar el teléfono después.</p>
<p><a href="https://www.youtube.com/shorts/pnHNdU6LppA">▶ Guía en video: cómo habilitar Shizuku</a></p>

<h3>Opción 3: Acceso root</h3>
<p><strong>Ideal para:</strong> usuarios avanzados con dispositivos rooteados</p>
<p>Si tu dispositivo está rooteado, Lazulite puede solicitar automáticamente los permisos necesarios. Es la opción más cómoda, pero solo si ya te sientes cómodo haciendo root en dispositivos Android.</p>
</div>
</details>

<details>
<summary>Estoy atascado en la pantalla de permisos de ADB</summary>
<div class="faq-body">
<p><strong>¿Es la primera vez que lo configuras?</strong> Sigue nuestro tutorial detallado para instalar ADB y conceder permisos:</p>
<p><a href="https://pedronveloso.com/android-lazulite-how-to-run-adb-command/">Lazulite simplificado: instalar ADB en Windows y macOS</a></p>
<p><strong>¿Ya diste permiso pero no funciona?</strong> Asegúrate de que:</p>
<ul>
<li>Tu teléfono esté conectado por USB y la depuración USB esté activada</li>
<li>Hayas autorizado el ordenador en el teléfono cuando apareció el mensaje "¿Permitir depuración USB?"</li>
<li>Estés ejecutando exactamente el comando ADB correcto que aparece en el tutorial</li>
</ul>
<p><strong>¿Usas Shizuku?</strong> Verifica que Shizuku esté en ejecución antes de abrir Lazulite.</p>
</div>
</details>

---

<h2 id="codecs">Códecs y compatibilidad</h2>

<details>
<summary>¿Qué códecs Bluetooth admite Lazulite?</summary>
<div class="faq-body">
<p>Lazulite puede detectar y mostrar todos los códecs de audio Bluetooth compatibles con tu dispositivo:</p>
<ul>
<li>LDAC, aptX, aptX HD, aptX Adaptive, aptX TWS, LC3</li>
<li>LHDC V1, LHDC V2, LHDC V3, LHDC V4, LHDC V5</li>
<li>AAC, SBC</li>
<li>SSC, SSC UHQ (solo en dispositivos Samsung)</li>
</ul>
<p>Si tu dispositivo y tus auriculares lo admiten y ambos acuerdan usarlo, Lazulite lo mostrará.</p>
</div>
</details>

<details>
<summary>¿Puedo usar Lazulite con auriculares con cable?</summary>
<div class="faq-body">
<p>Lazulite supervisa la pila de audio Bluetooth: qué códec acordaron usar tu teléfono y tus auriculares, la calidad de transmisión y la pérdida de paquetes. Las conexiones con cable evitan todo eso, así que Lazulite no tiene nada que leer.</p>
<p>Con auriculares con cable, el audio va directamente del DAC de tu dispositivo a tus oídos. No hay codificación inalámbrica ni selección de códec.</p>
</div>
</details>

<details>
<summary>¿Por qué las apps de streaming a veces muestran códecs distintos de lo esperado?</summary>
<div class="faq-body">
<p>Muchas apps de streaming prometen calidad "lossless" o "hi-fi", pero tu dispositivo o tus auriculares pueden forzar una recodificación a un códec de menor calidad antes de que el audio llegue a tus oídos.</p>
<p>Lazulite muestra el <strong>códec real usado para la transmisión Bluetooth</strong>, no lo que informa la app de streaming. Si pagas por audio hi-res pero Lazulite muestra AAC a 256 kbps, ahora sabes qué está pasando en realidad.</p>
</div>
</details>

---

<h2 id="privacy">Privacidad y datos</h2>

<details>
<summary>¿Lazulite usa mis datos móviles?</summary>
<div class="faq-body">
<p>Lazulite realiza todo el análisis de audio localmente en tu dispositivo. No se envía ningún dato desde tu teléfono a menos que elijas compartirlo.</p>
<p><strong>Telemetría opcional:</strong> la app puede recopilar datos anónimos de uso y fallos mediante Google Firebase para mejorar la estabilidad. Esto usa una cantidad mínima de datos y cumple con normativas de privacidad a nivel mundial.</p>
<p><strong>¿Quieres desactivarlo?</strong> Ve a Ajustes → Desactiva "Datos de telemetría"</p>
</div>
</details>

---

<h2 id="usage">Uso y comportamiento</h2>

<details>
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
