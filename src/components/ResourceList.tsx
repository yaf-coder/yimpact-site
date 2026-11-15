import { ResourceTile } from './ResourceTile';
import { EmptyNote } from './ui/Status';
import type { Resource } from '../types/db';

interface ResourceListProps {
  resources: Resource[];
  // 2 when the list stands alone. 3 under a section heading. This keeps the
  // heading sequence correct in both places.
  headingLevel: 2 | 3;
}

// Presentation only: no Layout, no page heading and no page padding.
export function ResourceList({ resources, headingLevel }: ResourceListProps) {
  if (resources.length === 0) {
    return <EmptyNote>No resources in this group yet.</EmptyNote>;
  }

  return (
    <ul className="border-t border-line">
      {resources.map((resource) => (
        <li key={resource.id} className="border-b border-line">
          <ResourceTile resource={resource} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
