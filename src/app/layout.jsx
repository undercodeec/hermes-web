import "./globals.css";

export const metadata = {
  title: "Hermes ARM | Conversaciones con supervisión humana",
  description:
    "Conozca Hermes ARM: conversaciones de WhatsApp y contexto comercial con asistencia conversacional y atención humana según cada caso.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
