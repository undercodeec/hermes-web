import "./globals.css";

export const metadata = {
  title: "Hermes CRM | Conversaciones que avanzan",
  description:
    "Conoce Hermes CRM: conversaciones de WhatsApp, oportunidades comerciales y seguimiento en un mismo espacio de trabajo.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
