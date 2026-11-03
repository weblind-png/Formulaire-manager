import Link from 'next/link';
import styles from './legal.module.css';
import { LEGAL } from '@/lib/legal-config';

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.footerNav}>
        <Link href="/mentions-legales">Mentions légales</Link>
        <Link href="/cgv">CGV / CGU</Link>
        <Link href="/confidentialite">Politique de confidentialité</Link>
      </nav>
      <p className={styles.footerCopy}>
        © {new Date().getFullYear()} {LEGAL.brand} — Tous droits réservés
      </p>
    </footer>
  );
}
