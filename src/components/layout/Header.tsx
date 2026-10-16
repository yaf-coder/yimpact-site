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
    <header className="sticky top-0 z-40 border-b border-bar/25 bg-white">
      <div className="mx-auto flex h-[calc(var(--header-h)-1px)] max-w-[1200px] items-center justify-between gap-6 px-6 md:px-10">
        <NavLink
          to="/"
          className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
        >
          <img
            src={asset('/brand/impex.png')}
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
                    `label border-b-2 pb-0.5 transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 ${
                      isActive
                        ? 'border-bar text-ink-900'
                        : 'border-transparent text-ink-500 hover:border-bar/45 hover:text-ink-900'
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
