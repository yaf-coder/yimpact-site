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
    <header className="sticky top-0 z-40 bg-white">
      <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
        <NavLink
          to="/"
          className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
        >
          <img
            src={asset('/brand/impex.png')}
            alt="Yale Impact Expo"
            width={70}
            height={26}
            className="h-[26px] w-auto"
          />
        </NavLink>
        <nav aria-label="Main" className="min-w-0">
          <ul className="flex items-center gap-x-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((item) => (
              <li key={item.to} className="shrink-0">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `text-sm underline-offset-[6px] transition-colors duration-200 ease-out hover:text-ink-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 ${
                      isActive ? 'text-ink-900 underline' : 'text-ink-500'
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
