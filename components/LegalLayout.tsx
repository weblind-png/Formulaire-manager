import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './legal.module.css';

// Affiche une valeur de lib/legal-config.ts ; surlignée en jaune si elle
// n'a pas encore été complétée.
export function Field({ value }: { value: string }) {
  const missing = value.startsWith('[À COMPLÉTER');
  return <span className={missing ? styles.todo : undefined}>{value}</span>;
}

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className={styles.legal}>
      <Link href="/" className={styles.back}>← Retour à l'application</Link>
      <h1>{title}</h1>
      <p className={styles.legalMeta}>Dernière mise à jour : {updated}</p>
      {children}
    </main>
  );
}

