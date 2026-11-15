import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageHeader } from '../components/ui/PageHeader';
import { VideoEmbed } from '../components/VideoEmbed';
import { PlainList } from '../components/PlainList';
import { buttonClassNames } from '../components/ui/Button';
import { event } from '../content/event';
import { tracks } from '../content/tracks';
import { pathways } from '../content/pathways';
import { studentSteps, walkthroughTitle, walkthroughVideoId } from '../content/students';

export function Students() {
  return (
    <Layout
      title="Students · Yale Impact Expo"
      description="What the Yale Impact Expo is, what a semester looks like, and how any Yale student can take part."
    >
      <PageHeader
        title="For students"
        lede={`Bring a pitch to the Expo in ${event.expoSeason}. Open to Yale students in every year.`}
      />

      <div className="wrap pb-20 pt-10">
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <VideoEmbed videoId={walkthroughVideoId} title={walkthroughTitle} />
          <div>
            <h2 className="display-2">Start here</h2>
            <p className="mt-2 text-lg leading-[1.55] text-ink-500">
              A short video on what the Expo asks of you, how the semester runs, and what strong teams leave with.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/signup" className={buttonClassNames('primary')}>
                Register
              </Link>
              <a href={`mailto:${event.contactEmail}`} className={buttonClassNames('secondary')}>
                Ask a question
              </a>
            </div>
          </div>
        </div>

        <section className="mt-14 border-t border-line pt-8" aria-labelledby="semester-heading">
          <h2 id="semester-heading" className="display-2 mb-4">
            The semester
          </h2>
          <ol className="border-t border-line">
            {studentSteps.map((step) => (
              <li
                key={step.id}
                className="grid gap-1 border-b border-line py-3.5 md:grid-cols-[200px_130px_minmax(0,1fr)] md:items-baseline md:gap-6"
              >
                <span className="font-medium">{step.name}</span>
                <span className="text-sm text-ink-400">{step.timing}</span>
                <span className="text-[15px] leading-[1.55] text-ink-500">{step.summary}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14 border-t border-line pt-8" aria-labelledby="tracks-heading">
          <h2 id="tracks-heading" className="display-2 mb-4">
            Tracks
          </h2>
          <PlainList columns={2} items={tracks.map((track) => ({ id: track.id, title: track.name, text: track.focus }))} />
        </section>

        <section className="mt-14 border-t border-line pt-8" aria-labelledby="after-heading">
          <h2 id="after-heading" className="display-2 mb-4">
            After the Expo
          </h2>
          <PlainList
            columns={2}
            items={pathways.map((pathway) => ({ id: pathway.id, title: pathway.name, text: pathway.summary }))}
          />
        </section>
      </div>
    </Layout>
  );
}
