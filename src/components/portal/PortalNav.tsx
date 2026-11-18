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

// A row of portal tabs under the header, with the account and a way out.
export function PortalNav() {
  const { role, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const visible = links.filter((link) => role && link.roles.includes(role));

  async function handleSignOut() {
    await signOut();
    navigate('/', { replace: true });
  }

  return (
    <div className="border-b border-line">
      <div className="wrap flex items-center gap-6">
        <nav aria-label="Portal" className="min-w-0 flex-1">
          <ul className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {visible.map((link) => (
              <li key={link.to} className="shrink-0">
                <NavLink
                  to={link.to}
                  end={link.to === '/portal/admin'}
                  className={({ isActive }) =>
                    `-mb-px block border-b-2 px-3.5 py-3 text-sm font-medium transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-700 ${
                      isActive ? 'border-blue-700 text-ink-900' : 'border-transparent text-ink-500 hover:text-ink-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-4 text-sm">
          <p className="hidden text-ink-400 sm:block">{profile?.email}</p>
          <button
            type="button"
            onClick={handleSignOut}
            className="py-3 text-ink-500 underline-offset-[3px] hover:text-ink-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
