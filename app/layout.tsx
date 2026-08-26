import './globals.css';

export const metadata = {
  title: 'Guideline Manager de Transition',
  description: 'Générez votre plan d\'action de mission en quelques minutes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
