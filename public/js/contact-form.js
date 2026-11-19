/*
 * Netec – Kontaktformular
 * -----------------------------------------------------------------------------
 * Vorbereitet für Zoho (CRM "Web-to-Lead" oder Zoho Forms).
 *
 * So wird Zoho angebunden:
 *   1. In Zoho das Web-Formular erzeugen (CRM: Einstellungen > Webformulare,
 *      oder Zoho Forms > Teilen > "Embed" > HTML).
 *   2. Aus dem erzeugten HTML übernehmen:
 *        - die action-URL            -> ZOHO_CONFIG.endpoint
 *        - alle <input type="hidden"> -> ZOHO_CONFIG.hiddenFields
 *        - die Feldnamen (name="…")  -> ZOHO_CONFIG.fieldMap
 *   3. Fertig. Das Formular schickt die Daten dann per normalem POST an Zoho
 *      (kein CORS-Problem, kein eigenes Backend nötig).
 *
 * Solange endpoint leer ist, öffnet das Formular eine vorausgefüllte E-Mail an
 * FALLBACK_EMAIL, damit keine Anfrage verloren geht.
 */
(function () {
  "use strict";

  var ZOHO_CONFIG = {
    // z. B. "https://crm.zoho.eu/crm/WebToLeadForm"
    endpoint: "",

    // Hidden-Felder aus dem Zoho-Snippet, z. B.
    // { xnQsjsdp: "…", xmIwtLD: "…", actionType: "TGVhZHM=", returnURL: "https://netec-mosquiteras.es/gracias/" }
    hiddenFields: {},

    // Lokaler Feldname -> Zoho-Feldname.
    // Voreinstellung passt zu Zoho CRM Web-to-Lead (Leads-Modul).
    fieldMap: {
      first_name: "First Name",
      last_name: "Last Name",
      email: "Email",
      phone: "Phone",
      city: "City",
      product: "Description_product", // in Zoho ggf. eigenes Feld (LEADCF…)
      message: "Description",
    },

    // Lead-Quelle, falls das Zoho-Formular ein Feld dafür hat (sonst leer lassen)
    leadSourceField: "Lead Source",
    leadSourceValue: "Web netec-mosquiteras.es",
  };

  var FALLBACK_EMAIL = "info@netec-mosquiteras.com";

  var MESSAGES = {
    invalid: "Por favor, rellene los campos obligatorios marcados con *.",
    sending: "Enviando…",
    success: "¡Gracias! Hemos recibido su solicitud y le contestaremos lo antes posible.",
    fallback: "Se abrirá su programa de correo con la solicitud preparada. Solo tiene que enviarla.",
  };

  var form = document.getElementById("contact-form");
  if (!form) return;
  var statusEl = document.getElementById("cf-status");

  function showStatus(text, kind) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.className =
      "mt-5 rounded-xl px-4 py-3 text-sm " +
      (kind === "error" ? "bg-red-50 text-red-800" : "bg-netec-50 text-netec-800");
  }

  function value(name) {
    var el = form.elements[name];
    if (!el) return "";
    if (el.type === "checkbox") return el.checked ? "on" : "";
    return (el.value || "").trim();
  }

  function submitToZoho() {
    // Ziel-iframe, damit der Besucher auf der Seite bleibt
    var frameName = "zoho-target";
    var frame = document.querySelector('iframe[name="' + frameName + '"]');
    if (!frame) {
      frame = document.createElement("iframe");
      frame.name = frameName;
      frame.title = "Envío del formulario";
      frame.hidden = true;
      document.body.appendChild(frame);
    }

    var out = document.createElement("form");
    out.method = "post";
    out.action = ZOHO_CONFIG.endpoint;
    out.acceptCharset = "UTF-8";
    out.target = frameName;
    out.hidden = true;

    function add(name, val) {
      if (!name) return;
      var i = document.createElement("input");
      i.type = "hidden";
      i.name = name;
      i.value = val;
      out.appendChild(i);
    }

    Object.keys(ZOHO_CONFIG.hiddenFields).forEach(function (k) {
      add(k, ZOHO_CONFIG.hiddenFields[k]);
    });
    Object.keys(ZOHO_CONFIG.fieldMap).forEach(function (local) {
      add(ZOHO_CONFIG.fieldMap[local], value(local));
    });
    if (ZOHO_CONFIG.leadSourceField) add(ZOHO_CONFIG.leadSourceField, ZOHO_CONFIG.leadSourceValue);

    document.body.appendChild(out);
    out.submit();
    setTimeout(function () { out.remove(); }, 1000);
  }

  function submitViaMail() {
    var lines = [
      "Nombre: " + value("first_name") + " " + value("last_name"),
      "Correo: " + value("email"),
      "Teléfono: " + value("phone"),
      "Municipio: " + value("city"),
      "Me interesa: " + value("product"),
      "",
      value("message"),
    ];
    var href =
      "mailto:" + FALLBACK_EMAIL +
      "?subject=" + encodeURIComponent("Solicitud de presupuesto – web") +
      "&body=" + encodeURIComponent(lines.join("\n"));
    window.location.href = href;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Honeypot gefüllt -> still verwerfen
    if (value("website")) return;

    if (!form.checkValidity()) {
      showStatus(MESSAGES.invalid, "error");
      var firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (ZOHO_CONFIG.endpoint) {
      showStatus(MESSAGES.sending);
      submitToZoho();
      form.reset();
      showStatus(MESSAGES.success);
    } else {
      showStatus(MESSAGES.fallback);
      submitViaMail();
    }
  });

  // Jahr im Footer aktuell halten
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = String(new Date().getFullYear());
})();
