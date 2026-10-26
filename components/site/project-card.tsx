import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { ProjectCard as ProjectCardData } from '@/lib/projects-data';

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gold/30 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.06em] text-gold-soft/90 uppercase">
      {children}
    </span>
  );
}

export function ProjectCard({
  project,
  guestsLabel,
  priority = false,
}: {
  project: ProjectCardData;
  guestsLabel: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-gold/25 bg-ink-800 transition-colors duration-500 hover:border-gold/60"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-ink-700">
        {project.cover ? (
          <Image
            src={project.cover.url}
            alt={project.cover.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.04]"
          />
        ) : (
          <span className="grid h-full place-items-center text-gold/40">
            <ImageOff className="size-8" aria-hidden />
          </span>
        )}
        {project.cover?.isPlaceholder ? (
          <span className="absolute top-3 left-3 rounded-full bg-ink/85 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.1em] text-marigold uppercase">
            Placeholder
          </span>
        ) : null}
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg leading-snug font-medium text-ivory transition-colors group-hover:text-marigold">
          {project.title}
        </h3>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.eventType ? <Meta>{project.eventType.name}</Meta> : null}
          {project.guests ? (
            <Meta>
              {project.guests.toLocaleString('en-IN')} {guestsLabel}
            </Meta>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
