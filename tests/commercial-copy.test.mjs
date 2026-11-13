import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../src/app/page.jsx", import.meta.url), "utf8");
const layout = readFileSync(new URL("../src/app/layout.jsx", import.meta.url), "utf8");
const navigation = readFileSync(new URL("../src/app/navigation.jsx", import.meta.url), "utf8");
const preview = readFileSync(new URL("../src/app/primary-preview.jsx", import.meta.url), "utf8");
const board = readFileSync(new URL("../src/app/reference-board.jsx", import.meta.url), "utf8");

test("commercial copy explains the workflow and retains qualification boundaries", () => {
  assert.match(page, /De WhatsApp/);
  assert.match(page, /De WhatsApp\{" "\}\s*<br\s*\/>/);
  assert.match(page, /experiencia comercial de UnderCodeEC/);
  assert.match(page, /asistencia conversacional y\s+atención humana/);
  assert.match(page, /alcance de la asistencia depende de la\s+configuración/);
  assert.match(page, /Si no hay evidencia suficiente, el\s+origen permanece desconocido/);
  assert.match(page, /Todas las interfaces son ilustrativas y no contienen datos reales/);
  assert.match(page, /const contactUrl = "https:\/\/undercodeec\.com\/contacto\/"/);
  assert.doesNotMatch(page, /\b(?:multiempresa|multitenant|multi-tenant|ROAS|Calendar)\b/i);
});

test("metadata remains non-indexable and describes only the supported scope", () => {
  assert.match(layout, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
  assert.match(layout, /WhatsApp/);
  assert.match(layout, /asistencia conversacional y atención humana/);
  assert.doesNotMatch(layout, /\b(?:multiempresa|multitenant|multi-tenant|ROAS|Calendar)\b/i);
});

test("ARM is explained as an approach with human oversight and qualified potential", () => {
  assert.match(page, /ARM \(Agentic Relationship Management\)/);
  assert.match(page, /supervisión humana/);
  assert.match(page, /uso de agentes para otras tareas es una posibilidad, no una\s+capacidad garantizada/);
  assert.match(page, /https:\/\/consultordemarketing\.mx\/del-crm-al-arm-agentic-relationship-management/);
  assert.match(page, /Leer sobre ARM en una fuente externa/);
});

test("Hermes ARM positioning covers public identity, metadata and illustrative interfaces", () => {
  assert.match(page, /src="\/favicon\.ico"\s+alt=""/);
  assert.match(page, /<span>Hermes ARM<\/span>/);
  assert.match(page, /<Brand\s*\/>/);
  assert.match(page, /<Brand footer\s*\/>/);
  assert.doesNotMatch(page, /aria-label="Hermes (?:CRM|ARM), volver al inicio"/);
  assert.doesNotMatch(page, /hermes-crm-logo\.png/);
  assert.match(page, /Hermes ARM conecta conversaciones/);
  assert.match(layout, /title: "Hermes ARM/);
  assert.match(layout, /Conozca Hermes ARM/);
  assert.match(navigation, /Acceso al espacio de trabajo/);
  assert.match(preview, /Hermes ARM · UnderCodeEC/);
  assert.match(preview, /Datos ficticios · Sin conexión a un sistema en vivo/);
  assert.match(board, /Sin conexión a un sistema en vivo/);
  for (const source of [page, layout, navigation, preview, board]) {
    assert.doesNotMatch(source, /Hermes CRM|Acceso CRM/);
    assert.doesNotMatch(source, /(?:totalmente autónom[oa]s?|certificad[oa] ARM|garantiza(?:mos)? resultados|disponible para todos)/i);
  }
  assert.match(page, /reglas y configuración de cada caso/);
  assert.match(page, /disponibilidad para su caso/);
});
