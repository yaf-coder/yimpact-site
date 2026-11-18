import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { buttonClassNames } from '../components/ui/Button';

export function NotFound() {
  return (
    <Layout title="Page not found · Yale Impact Expo" description="This page does not exist.">
      <div className="wrap py-24 md:py-32">
        <h1 className="display-1">Page not found</h1>
        <p className="mt-3 text-lg text-ink-500">The address may be wrong, or the page has moved.</p>
        <Link to="/" className={`${buttonClassNames('secondary')} mt-6`}>
          Go to the home page
        </Link>
      </div>
    </Layout>
  );
}
