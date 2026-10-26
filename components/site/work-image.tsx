import Image, { getImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import type { WorkPhoto } from '@/lib/work-photos';

/**
 * next/image for a catalogue photograph, with the blur preview wired in so the
 * frame paints warm colour before the file lands rather than an empty box.
 *
 * `decorative` empties the alt: inside a card link the title already names the
 * destination, and a screen reader reading the photo description first only
 * delays it.
 */
export function WorkImage({
  photo,
  sizes,
  priority = false,
  decorative = false,
  className,
  quality,
}: {
  photo: WorkPhoto;
  sizes: string;
  priority?: boolean;
  decorative?: boolean;
  className?: string;
  quality?: number;
}) {
  return (
    <Image
      src={photo.src}
      alt={decorative ? '' : photo.alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={quality}
      placeholder="blur"
      blurDataURL={photo.blur}
      className={cn('object-cover', className)}
    />
  );
}

/**
 * A photograph laid behind a dark band. The overlays keep ivory text above
 * WCAG contrast on even the brightest daytime frame, and the maroon wash ties
 * every backdrop back to the site's palette.
 *
 * `align` follows the text: a left-aligned hero darkens from the left and lets
 * the photograph show on the right; a centred band darkens evenly.
 *
 * Pass `mobile` for art direction: phones get a portrait frame through
 * <picture>, so only the one file that matches the viewport is downloaded.
 */
export function PhotoBackdrop({
  photo,
  mobile,
  priority = false,
  align = 'left',
  visibility = 'medium',
  className,
}: {
  photo: WorkPhoto;
  mobile?: WorkPhoto;
  priority?: boolean;
  align?: 'left' | 'center';
  visibility?: 'low' | 'medium' | 'high';
  className?: string;
}) {
  const imgClass = cn(
    'absolute inset-0 size-full object-cover motion-safe:animate-[slow-zoom_28s_var(--ease-soft)_both]',
    { low: 'opacity-30', medium: 'opacity-60', high: 'opacity-90' }[visibility],
  );

  let picture;
  if (mobile) {
    const common = { fill: true, sizes: '100vw', quality: 70, priority, alt: '' };
    const {
      props: { srcSet: desktop },
    } = getImageProps({ ...common, src: photo.src });
    const {
      props: { srcSet: phone, ...rest },
    } = getImageProps({ ...common, src: mobile.src });
    picture = (
      <picture>
        <source media="(min-width: 48rem)" srcSet={desktop} />
        <source srcSet={phone} />
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img {...rest} className={imgClass} />
      </picture>
    );
  } else {
    picture = (
      <Image
        src={photo.src}
        alt=""
        fill
        sizes="100vw"
        quality={70}
        priority={priority}
        className={imgClass}
      />
    );
  }

  return (
    <div aria-hidden className={cn('absolute inset-0 overflow-hidden bg-ink', className)}>
      {picture}
      {align === 'left' ? (
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-ink)_0%,color-mix(in_oklab,var(--color-ink)_75%,transparent)_40%,color-mix(in_oklab,var(--color-ink)_15%,transparent)_85%)]" />
      ) : (
        <div className="absolute inset-0 bg-ink/55" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-maroon)_45%,transparent)_0%,transparent_32%,transparent_62%,var(--color-ink)_100%)]" />
    </div>
  );
}
