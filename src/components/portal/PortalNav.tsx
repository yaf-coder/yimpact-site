import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import type { UserRole } from '../../types/db';

interface PortalLink {
  to: string;
  label: string;
  roles: UserRole[];
}

const links: PortalLink[] = [
  { to: '/portal/profile', label: 'Application', roles: ['student'] },
  { to: '/portal/sponsor', label: 'Schedule', roles: ['sponsor'] },
  { to: '/portal/messages', label: 'Messages', roles: ['student', 'sponsor'] },
  { to: '/portal/admin', label: 'Applications', roles: ['admin'] },
  { to: '/portal/admin/messages', label: 'Inbox', roles: ['admin'] },
  { to: '/portal/admin/announcements', label: 'Post', roles: ['admin', 'announcements'] },
];

// A ruled strip under the header, in the pattern of DomainNav.
export function PortalNav() {
  const { role, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const visible = links.filter((link) => role && link.roles.includes(role));

  async function handleSignOut() {
    await signOut();
    navigate('/', { replace: true });
  }

  return (
    <div className="sticky top-[var(--header-h)] z-30 border-y border-bar/25 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center gap-6 px-6 md:px-10">
        <nav aria-label="Portal" className="min-w-0 flex-1">
          <ul className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {visible.map((link) => (
              <li key={link.to} className="shrink-0">
                <NavLink
                  to={link.to}
                  end={link.to === '/portal/admin'}
                  className={({ isActive }) =>
                    `label block border-b-2 px-4 py-3.5 transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-500 ${
                      isActive
                        ? 'border-bar text-ink-900'
                        : 'border-transparent text-ink-400 hover:text-ink-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <p className="label hidden text-ink-300 sm:block">{profile?.email}</p>
          <button
            type="button"
            onClick={handleSignOut}
            className="label py-3.5 text-ink-400 transition-colors duration-300 ease-out hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
