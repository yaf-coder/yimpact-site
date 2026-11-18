interface VideoEmbedProps {
  videoId: string;
  title: string;
}

// The walkthrough player. Until the team sets a video id in
// `src/content/students.ts`, a plain frame holds the space so the page never
// renders a broken player.
export function VideoEmbed({ videoId, title }: VideoEmbedProps) {
  if (!videoId) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-ink-900 px-6 text-center text-sm text-white/75">
        The walkthrough video is coming soon.
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-ink-900">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className="h-full w-full"
      />
    </div>
  );
}
