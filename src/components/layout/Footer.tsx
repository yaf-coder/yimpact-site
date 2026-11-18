import { asset } from '../../lib/asset';

interface FooterProps {
  contactEmail: string;
  sponsorEmail: string;
}

// The logo, the two addresses as plain text a reader can copy, and the year.
export function Footer({ contactEmail, sponsorEmail }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-line bg-ink-50">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-7 gap-y-3 py-7 text-sm text-ink-500">
        <img src={asset('/brand/impex.png')} alt="Yale Impact Expo" width={82} height={30} className="h-[30px] w-auto" />
        <p className="flex flex-wrap gap-x-6 gap-y-1 select-all">
          {[...new Set([contactEmail, sponsorEmail])].map((address) => (
            <span key={address}>{address}</span>
          ))}
        </p>
        <p>© {year} Yale Impact Expo</p>
      </div>
    </footer>
  );
}
