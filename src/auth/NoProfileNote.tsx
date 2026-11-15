import { Layout } from '../components/layout/Layout';
import { ErrorNote } from '../components/ui/Status';
import { buttonClassNames } from '../components/ui/Button';
import { useAuth } from './useAuth';

// The account signed in, but it has no profile row. This happens when the
// account was made before the signup trigger existed. Say so plainly. Do not
// wait for a row that never arrives.
export function NoProfileNote() {
  const { session, signOut } = useAuth();

  return (
    <Layout
      title="Portal · Yale Impact Expo"
      description="The Yale Impact Expo portal."
    >
      <div className="wrap pb-20 pt-10">
        <div className="max-w-[760px]">
          <ErrorNote title="No profile">
            This account has no profile record, so the portal cannot open. The account was probably
            made before the database was set up. Write to the team, or register again with a new
            address.
          </ErrorNote>
          <p className="mt-4 text-xs text-ink-400">{session?.user.email}</p>
          <button
            type="button"
            onClick={() => void signOut()}
            className={`${buttonClassNames('secondary')} mt-6`}
          >
            Sign out
          </button>
        </div>
      </div>
    </Layout>
  );
}
