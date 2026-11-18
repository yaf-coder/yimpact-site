import { Layout } from '../components/layout/Layout';
import { PageHeader } from '../components/ui/PageHeader';
import { ScheduleTable } from '../components/ScheduleTable';
import { schedule } from '../content/schedule';

export function Schedule() {
  return (
    <Layout
      title="Schedule · Yale Impact Expo"
      description="The Expo weekend agenda: track showcases, judging, partner office hours, and the finalist announcements."
    >
      <PageHeader
        title="Schedule"
        lede="Saturday, April 17, 2027, the main day of Expo weekend. Rooms are confirmed closer to the date."
      />
      <div className="wrap pb-20 pt-10">
        <ScheduleTable items={schedule} />
      </div>
    </Layout>
  );
}
