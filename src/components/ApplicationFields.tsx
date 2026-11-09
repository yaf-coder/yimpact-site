import { Field } from './ui/Field';
import { Input, Select, Textarea } from './ui/Input';
import { yaleSchools, isYaleSchool } from '../content/schools';
import { maxGradYear, minGradYear } from '../lib/application';

interface ApplicationFieldsProps {
  school?: string | null;
  program?: string | null;
  gradYear?: number | null;
  bio?: string | null;
}

// The required application fields. The signup page and the profile page both
// render this component, so the two forms stay the same.
export function ApplicationFields({ school, program, gradYear, bio }: ApplicationFieldsProps) {
  // An old free-text school is not in the list. Show the empty option, and the
  // student must pick a school before the next save.
  const schoolValue = school && isYaleSchool(school) ? school : '';

  return (
    <>
      <Field label="School">
        {({ id }) => (
          <Select id={id} name="school" defaultValue={schoolValue} required>
            <option value="" disabled>
              Select your school
            </option>
            {yaleSchools.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Degree programme or major" hint="Example: B.S. Computer Science, or MBA.">
          {({ id, describedBy }) => (
            <Input
              id={id}
              name="program"
              defaultValue={program ?? ''}
              required
              aria-describedby={describedBy}
            />
          )}
        </Field>

        <Field label="Graduation year">
          {({ id }) => (
            <Input
              id={id}
              name="grad_year"
              type="number"
              inputMode="numeric"
              min={minGradYear}
              max={maxGradYear}
              step={1}
              placeholder={String(minGradYear + 2)}
              defaultValue={gradYear ?? ''}
              required
            />
          )}
        </Field>
      </div>

      <Field
        label="About you"
        hint="Two or three sentences. The problem you care about is more useful than a list of courses."
      >
        {({ id, describedBy }) => (
          <Textarea
            id={id}
            name="bio"
            rows={5}
            defaultValue={bio ?? ''}
            required
            aria-describedby={describedBy}
          />
        )}
      </Field>
    </>
  );
}

// The file control for the resume. `required` is for the signup form, where a
// resume is not optional.
export function ResumeInput({ required = false, hint }: { required?: boolean; hint?: string }) {
  return (
    <Field label="Resume" hint={hint ?? 'A PDF of 5 MB or less.'}>
      {({ id, describedBy }) => (
        <Input
          id={id}
          name="resume"
          type="file"
          accept="application/pdf,.pdf"
          required={required}
          aria-describedby={describedBy}
          className="file:label file:mr-4 file:border-0 file:bg-ink-50 file:px-3 file:py-1.5 file:text-ink-900"
        />
      )}
    </Field>
  );
}
