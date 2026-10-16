import { Link } from 'react-router-dom';
import { asset } from '../../lib/asset';

interface FooterProps {
  contactEmail: string;
  sponsorEmail: string;
}

const footerLinks = [
  { to: '/students', label: 'For students' },
  { to: '/sponsors', label: 'Partners' },
  { to: '/alumni', label: 'Alumni' },
  { to: '/team', label: 'Team' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/blog', label: 'The Record' },
];

export function Footer({ contactEmail, sponsorEmail }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10">
      <div className="mx-auto max-w-[1200px] px-4 py-2 pb-6 sm:px-6 md:px-10 md:py-3 md:pb-10">
        <div className="haze px-5 py-8 sm:px-7 md:px-10 md:py-10">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <img
              src={asset('/brand/impex.png')}
              alt="Yale Impact Expo"
              width={152}
              height={56}
              className="h-14 w-auto"
            />
            <p className="mt-5 text-lg leading-[1.4] tracking-[-0.02em] text-ink-700">
              Your <span className="accent-serif">impact</span> starts here
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid gap-1.5">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="label text-ink-400 transition-colors duration-300 ease-out hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-bar/25 pt-5 md:flex-row md:items-center md:justify-between">
          <p className="label text-ink-400">© {year} Yale Impact Expo</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <a
              href={`mailto:${contactEmail}`}
              className="label text-ink-500 transition-colors duration-300 ease-out hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
            >
              {contactEmail}
            </a>
            <a
              href={`mailto:${sponsorEmail}`}
              className="label text-ink-500 transition-colors duration-300 ease-out hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
            >
              Partner with us
            </a>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
