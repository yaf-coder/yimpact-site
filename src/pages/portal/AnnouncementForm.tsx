import { useActionState, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { PageHeader } from '../../components/ui/PageHeader';
import { PortalNav } from '../../components/portal/PortalNav';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { ErrorNote, PendingLabel } from '../../components/ui/Status';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../auth/useAuth';
import type { BlogCategory } from '../../types/content';

const categories: BlogCategory[] = [
  'Announcements',
  'Campus',
  'Partners',
  'Research',
  'New Haven',
  'Opinion',
];

const maxBytes = 5 * 1024 * 1024;
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

interface PostState {
  error: string | null;
}

export function AnnouncementForm() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  const [state, submit, isPending] = useActionState<PostState, FormData>(
    async (_previous, form) => {
      const title = String(form.get('title') ?? '').trim();
      const author = String(form.get('author') ?? '').trim();
      const bodyText = String(form.get('body_text') ?? '').trim();
      const category = String(form.get('category') ?? 'Announcements');
      const coverAlt = String(form.get('cover_alt') ?? '').trim();
      const file = form.get('cover') as File | null;

      if (!title || !author || !bodyText) {
        return { error: 'Write a title, a name, and the story.' };
      }

      // Check the file before the upload. The bucket rejects a bad file too,
      // but the reader gets a clearer message here.
      if (file && file.size > 0) {
        if (!allowedTypes.includes(file.type)) {
          return { error: 'Use a JPEG, PNG, WebP, or AVIF image.' };
        }
        if (file.size > maxBytes) {
          return { error: 'The image must be 5 MB or smaller.' };
        }
        if (!coverAlt) {
          return { error: 'Describe the image for a reader who cannot see it.' };
        }
      }

      // Make the row first. The object path needs the post id.
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title,
          author,
          author_role: profile?.role === 'announcements' ? 'Expo newsroom' : 'Expo team',
          body_text: bodyText,
          category,
          cover_alt: coverAlt,
        })
        .select('id,slug')
        .single();

      if (error) return { error: error.message };

      const row = data as { id: string; slug: string };

      if (file && file.size > 0) {
        setIsUploading(true);
        const path = `posts/${row.id}/${file.name}`;
        const upload = await supabase.storage
          .from('blog-images')
          .upload(path, file, { upsert: true });
        setIsUploading(false);

        if (upload.error) {
          return { error: `The story is saved, but the image did not upload: ${upload.error.message}` };
        }

        const patch = await supabase.from('posts').update({ cover_path: path }).eq('id', row.id);
        if (patch.error) return { error: patch.error.message };
      }

      navigate(`/blog/${row.slug}`);
      return { error: null };
    },
    { error: null },
  );

  return (
    <Layout
      title="Post a story · Yale Impact Expo"
      description="Publish a story to the Yale Impact Expo blog."
    >
      <PortalNav />
      <PageHeader title="Post a story" lede="It appears on The Impact Record straight away." />

      <div className="wrap pb-20 pt-10">
        <div>
          <form action={submit} className="max-w-[680px] rounded-lg border border-line-strong p-[26px]">
            <div className="grid gap-5">
              <Field label="Title">
                {({ id }) => <Input id={id} name="title" required />}
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Your name">
                  {({ id }) => (
                    <Input
                      id={id}
                      name="author"
                      required
                      defaultValue={profile?.full_name ?? ''}
                    />
                  )}
                </Field>

                <Field label="Section">
                  {({ id }) => (
                    <Select id={id} name="category" defaultValue="Announcements">
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
              </div>

              <Field label="Image" hint="One image for the tile. JPEG, PNG, WebP, or AVIF, up to 5 MB.">
                {({ id, describedBy }) => (
                  <input
                    id={id}
                    name="cover"
                    type="file"
                    accept={allowedTypes.join(',')}
                    aria-describedby={describedBy}
                    className="w-full rounded-md border border-line-strong bg-[#fffdf8] p-2.5 text-sm text-ink-700 file:mr-3 file:border file:border-line-strong file:bg-ink-50 file:px-3 file:py-1.5 file:text-xs file:text-ink-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-700"
                  />
                )}
              </Field>

              <Field
                label="Image description"
                hint="What the image shows. A reader with a screen reader needs this."
              >
                {({ id, describedBy }) => (
                  <Input id={id} name="cover_alt" aria-describedby={describedBy} />
                )}
              </Field>

              <Field label="Story" hint="Leave a blank line between paragraphs.">
                {({ id, describedBy }) => (
                  <Textarea id={id} name="body_text" rows={14} required aria-describedby={describedBy} />
                )}
              </Field>

              {state.error ? <ErrorNote>{state.error}</ErrorNote> : null}
              {isUploading ? <PendingLabel>Uploading the image</PendingLabel> : null}

              <div>
                <Button type="submit" isDisabled={isPending}>
                  {isPending ? 'Publishing' : 'Publish'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
