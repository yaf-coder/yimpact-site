import { Layout } from '../components/layout/Layout';
import { PageHeader } from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { VideoEmbed } from '../components/VideoEmbed';
import { buttonClassNames } from '../components/ui/Button';
import { event } from '../content/event';
import { tracks } from '../content/tracks';
import { pathways } from '../content/pathways';
import { studentSteps, walkthroughSummary, walkthroughTitle, walkthroughVideoId } from '../content/students';

export function Students() {
  return (
    <Layout
      pattern="students"
      title="Students · Yale Impact Expo"
      description="What the Yale Impact Expo is, what a semester looks like, and how any Yale student can take part."
    >
      <PageHeader
        eyebrow="For students"
        title={
          <>
            Have an idea? Work with the best to <span className="accent-serif">build</span> it.
          </>
        }
        meta={`Bring your pitch to Impact Expo in ${event.expoSeason}. You'll have the opportunity to work alongside and network with some of the biggest leaders in the industry. Open to Yale students of all grade levels!`}
      />

      <div className="mx-auto max-w-[1200px] px-4 pb-8 sm:px-6 md:px-10">
        <div className="haze px-5 py-8 sm:px-7 md:px-10 md:py-12">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-10">
            <div>
              <VideoEmbed videoId={walkthroughVideoId} title={walkthroughTitle} />
              <p className="label mt-3 text-ink-400">Watch first · {walkthroughTitle}</p>
            </div>
            <div className="flex flex-col">
              <h2 className="display-2 max-w-[18ch]">Start here</h2>
              <p className="mt-4 text-base leading-[1.6] text-ink-700">{walkthroughSummary}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`mailto:${event.contactEmail}`} className={buttonClassNames('primary')}>
                  Ask a question
                </a>
                <a href="#the-semester" className={buttonClassNames('secondary')}>
                  See the semester
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <section id="the-semester" className="mt-16 border-t border-bar/25 pt-8" aria-labelledby="semester-heading">
          <Reveal>
            <h2 id="semester-heading" className="display-2">
              The semester, week by week
            </h2>
            <ol className="mt-6 border-t border-bar/25">
              {studentSteps.map((step, index) => (
                <li
                  key={step.id}
                  className="grid gap-1 border-b border-bar/25 py-4 sm:grid-cols-[40px_180px_120px_minmax(0,1fr)] sm:gap-6"
                >
                  <span className="label text-ink-300">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-base leading-[1.35] tracking-[-0.025em] text-ink-900">{step.name}</span>
                  <span className="label text-blue-500">{step.timing}</span>
                  <span className="text-sm leading-[1.55] text-ink-500">{step.summary}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        <section className="mt-16 border-t border-bar/25 pt-8" aria-labelledby="tracks-heading">
          <Reveal>
            <h2 id="tracks-heading" className="display-2">
              Pick a track
            </h2>
            <p className="mt-4 max-w-[68ch] text-base leading-[1.6] text-ink-700">
              Tracks are organizing tools, not boundaries. Projects do not need to be technical — a policy memo, a
              bias study, a nonprofit proposal, and a working prototype are judged against the same standard.
            </p>
            <ul className="haze-inner mt-6 grid gap-px overflow-hidden border border-bar/25 bg-bar/25 sm:grid-cols-2 lg:grid-cols-4">
              {tracks.map((track) => (
                <li key={track.id} className="bg-white p-4">
                  <h3 className="text-sm font-medium leading-[1.3] tracking-[-0.028em] text-ink-900">{track.name}</h3>
                  <p className="mt-2 text-xs leading-[1.55] text-ink-500">{track.focus}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section className="mt-16 border-t border-bar/25 pt-8" aria-labelledby="leave-with-heading">
          <Reveal>
            <h2 id="leave-with-heading" className="display-2">
              How good work keeps going
            </h2>
            <p className="mt-4 max-w-[68ch] text-base leading-[1.6] text-ink-700">
              These pathways exist to carry a project further than a weekend. They advance the students behind it as
              a consequence, which we are glad about — but every one of them is judged on whether the work reaches
              the people it was built for.
            </p>
            <ul className="haze-inner mt-6 grid gap-px overflow-hidden border border-bar/25 bg-bar/25 sm:grid-cols-2 lg:grid-cols-3">
              {pathways.map((pathway) => (
                <li key={pathway.id} className="bg-white p-4">
                  <h3 className="text-sm font-medium leading-[1.3] tracking-[-0.028em] text-ink-900">
                    {pathway.name}
                  </h3>
                  <p className="mt-2 text-xs leading-[1.55] text-ink-500">{pathway.summary}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[68ch] text-sm leading-[1.6] text-ink-500">
              Opportunity terms are stated plainly. You will always know the difference between a guaranteed
              placement, a finalist conversation, and a non-binding review.
            </p>
          </Reveal>
        </section>
        </div>
      </div>
    </Layout>
  );
}
