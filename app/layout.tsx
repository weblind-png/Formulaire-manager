import './globals.css';
import SiteLogo from '@/components/SiteLogo';

export const metadata = {
  title: 'Guideline Manager de Transition',
  description: 'Générez votre plan d\'action de mission en quelques minutes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <header className="site-header">
          {/* Une fois votre logo déposé dans /public/logo.png, il s'affichera automatiquement */}
          <SiteLogo />
          <span>Guideline Manager de Transition</span>
        </header>
        {children}
      </body>
    </html>
  );
}
