import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageHeader } from '../components/ui/PageHeader';
import { buttonClassNames } from '../components/ui/Button';
import { PlainList } from '../components/PlainList';
import { ChipDrawing, ConstitutionDrawing, ResearcherDrawing } from '../components/students/Drawings';
import { event } from '../content/event';
import { pathways } from '../content/pathways';
import { projectTypes, studentSteps } from '../content/students';
import type { ProjectType } from '../content/students';

const drawings: Record<ProjectType['id'], { Drawing: ComponentType<{ className?: string }>; width: string }> = {
  technical: { Drawing: ChipDrawing, width: 'max-w-[340px]' },
  policy: { Drawing: ConstitutionDrawing, width: 'max-w-[420px]' },
  research: { Drawing: ResearcherDrawing, width: 'max-w-[420px]' },
};

export function Students() {
  return (
    <Layout
      title="Students · Yale Impact Expo"
      description="The kinds of project Yale students bring to the Impact Expo, how the semester runs, and how to apply."
    >
      <PageHeader
        title="Students"
        lede="Every Yale student is welcome, with any kind of project. Bring the fields you care about together."
      />

      {/* One band per kind of project: a drawing on one side, the question
          and three example ideas on the other. The drawing alternates sides. */}
      {projectTypes.map((type, index) => {
        const { Drawing, width } = drawings[type.id];
        const drawingLast = index % 2 === 1;
        return (
          <section
            key={type.id}
            aria-labelledby={`type-${type.id}`}
            className={index > 0 ? 'border-t border-line' : undefined}
          >
            <div className="wrap grid items-center gap-8 py-14 md:grid-cols-2 md:gap-16 md:py-20">
              <div className={`flex justify-center ${drawingLast ? 'md:order-2' : ''}`}>
                <Drawing className={`w-full ${width}`} />
              </div>
              <div>
                <h2 id={`type-${type.id}`} className="display-2">
                  {type.heading}
                </h2>
                <ul className="mt-6 border-t border-line">
                  {type.examples.map((example) => (
                    <li key={example.name} className="grid gap-0.5 border-b border-line py-3.5">
                      <span className="font-bold">{example.name}</span>
                      <span className="text-[15px] leading-[1.55] text-ink-500">{example.summary}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        );
      })}

      <section className="border-t border-line" aria-labelledby="semester-heading">
        <div className="wrap py-14 md:py-16">
          <h2 id="semester-heading" className="display-2 mb-4">
            The semester
          </h2>
          <ol className="border-t border-line">
            {studentSteps.map((step, index) => (
              <li
                key={step.id}
                className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-2 gap-y-0.5 border-b border-line py-3.5 md:grid-cols-[28px_260px_minmax(0,1fr)] md:items-baseline md:gap-x-6"
              >
                <span className="text-ink-400">{index + 1}</span>
                <span className="font-bold">{step.name}</span>
                {step.summary ? (
                  <span className="col-start-2 text-[15px] leading-[1.55] text-ink-500 md:col-start-3">{step.summary}</span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line" aria-labelledby="support-heading">
        <div className="wrap py-14 md:py-16">
          <h2 id="support-heading" className="display-2">
            Mentors and resources
          </h2>
          <p className="mb-6 mt-2 max-w-[60ch] text-lg leading-[1.55] text-ink-500">
            Teams get help from mentors and partners during the semester, and strong teams keep getting it after the
            Expo.
          </p>
          <PlainList
            columns={2}
            items={pathways.map((pathway) => ({ id: pathway.id, title: pathway.name, text: pathway.summary }))}
          />
        </div>
      </section>

      <section className="border-t border-line bg-ink-50" aria-labelledby="apply-heading">
        <div className="wrap py-16 text-center md:py-20">
          <h2 id="apply-heading" className="display-2">
            Ready to apply?
          </h2>
          <p className="mt-2 text-lg text-ink-500">You don&rsquo;t need a team or any experience to get started.</p>
          <div className="mt-6 flex justify-center">
            <Link to="/signup" className={buttonClassNames('primary')}>
              Apply
            </Link>
          </div>
          <p className="mt-5 text-ink-500">
            Questions: <span className="select-all text-blue-700">{event.contactEmail}</span>
          </p>
        </div>
      </section>
    </Layout>
  );
}
