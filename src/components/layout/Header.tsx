import { NavLink } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { asset } from '../../lib/asset';

const navItems = [
  { to: '/sponsors', label: 'Partners' },
  { to: '/resources', label: 'Resources' },
  { to: '/alumni', label: 'Alumni' },
  { to: '/students', label: 'Students' },
  { to: '/team', label: 'Team' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/blog', label: 'The Record' },
];

export function Header() {
  const { status } = useAuth();
  // The last item changes with the session. The markup does not.
  const items = [
    ...navItems,
    status === 'signedIn' ? { to: '/portal', label: 'Portal' } : { to: '/login', label: 'Log in' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-bar">
      <div className="mx-auto flex h-[calc(var(--header-h)-1px)] max-w-[1200px] items-center justify-between gap-6 px-6 md:px-10">
        <NavLink
          to="/"
          className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {/* The full-colour logo cannot be read on the maroon bar, so the
              header carries the white version. */}
          <img
            src={asset('/brand/impex-white.png')}
            alt="Yale Impact Expo"
            width={92}
            height={34}
            className="h-[34px] w-auto"
          />
        </NavLink>
        <nav aria-label="Main" className="min-w-0">
          <ul className="flex items-center gap-x-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((item) => (
              <li key={item.to} className="shrink-0">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `label border-b-2 pb-0.5 text-white transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                      isActive ? 'border-white' : 'border-transparent hover:border-white/60'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
