import SiteLogo from './SiteLogo';

export default function HeroBanner({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <>
      <div className="hero-band">
        <div className="brand-badge">
          <SiteLogo />
        </div>
      </div>
      <div className="hero-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </>
  );
}
