import './globals.css';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: 'Guideline Manager de Transition',
  description: 'Générez votre plan d\'action de mission en quelques minutes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
