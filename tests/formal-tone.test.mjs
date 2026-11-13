import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CONVERSATIONS } from "../src/app/primary-preview-model.mjs";

test("illustrative replies consistently address the contact as usted", () => {
  const page = readFileSync(new URL("../src/app/page.jsx", import.meta.url), "utf8");
  assert.match(page, /Cuéntenos qué necesita su equipo y le orientamos/);
  assert.match(page, /Cuéntenos qué necesita su equipo\./);
  assert.doesNotMatch(page, /Cuéntanos qué necesita tu equipo/i);
  const outgoing = CONVERSATIONS.flatMap(conversation => conversation.messages.filter(message => message.direction === "outgoing"));
  assert.equal(outgoing.length, 12);
  for (const message of outgoing) assert.doesNotMatch(message.text, /\b(?:tu|te|tienes|colocarías|usarías|cuéntanos)\b/i);
});

test("the six illustrative customers and their incoming messages are preserved", () => {
  assert.deepEqual(CONVERSATIONS.map(conversation => conversation.name), ["Lucía", "Mateo", "Sofía", "Diego", "Valentina", "Andrés"]);
  assert.deepEqual(CONVERSATIONS.map(conversation => conversation.messages.filter(message => message.direction === "incoming").map(message => message.text)), [
    ["Hola, busco un sofá para una sala pequeña.", "Tengo unos 2 metros en la sala."],
    ["Hola, estoy buscando una mesa de comedor.", "Para cuatro, pero el espacio es reducido."],
    ["Hola, busco un escritorio.", "Un portátil y una pantalla."],
    ["Hola, estoy buscando una estantería.", "En una pared estrecha del estudio."],
    ["Hola, busco una cómoda.", "Tengo aproximadamente 1 metro de ancho."],
    ["Hola, estoy buscando una mesa auxiliar.", "Junto al sofá, para colocar una lámpara."],
  ]);
});
