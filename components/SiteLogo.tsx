'use client';

export default function SiteLogo() {
  return (
    <img
      src="/logo.png"
      alt="Logo"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}
