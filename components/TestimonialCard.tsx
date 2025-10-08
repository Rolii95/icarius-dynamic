"use client";

import Image from "next/image";
import Link from "next/link";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";

import { createInitialsAvatar } from "@/lib/avatar";

export type Testimonial = {
  quote: string;
  author: string;
  role?: string;
  href?: string; // "/case-studies/slug" or full https:// URL
  avatarSrc?: string; // may be data: URL or /img/...
};

const FALLBACK_AVATAR_SRC = "/img/avatar-fallback.webp";

const isInternal = (url?: string) => typeof url === "string" && url.trim().startsWith("/");
const isExternalHttp = (url?: string) =>
  typeof url === "string" && /^(https?:)?\/\//i.test(url.trim());

export default function TestimonialCard({ quote, author, role, href, avatarSrc }: Testimonial) {
  const placeholder = useMemo(() => createInitialsAvatar(author), [author]);

  const normalizedAvatarSrc = useMemo(() => {
    const trimmed = (avatarSrc ?? "").trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }, [avatarSrc]);

  const [currentSrc, setCurrentSrc] = useState<string>(normalizedAvatarSrc ?? FALLBACK_AVATAR_SRC);

  useEffect(() => {
    setCurrentSrc(normalizedAvatarSrc ?? FALLBACK_AVATAR_SRC);
  }, [normalizedAvatarSrc]);

  const handleImageError = (e: SyntheticEvent<HTMLImageElement>) => {
    if (currentSrc !== FALLBACK_AVATAR_SRC) {
      e.preventDefault();
      setCurrentSrc(FALLBACK_AVATAR_SRC);
    }
  };

  const internal = isInternal(href);
  const external = isExternalHttp(href);

  if (process.env.NODE_ENV !== "production" && href && !internal && !external) {
    // eslint-disable-next-line no-console
    console.warn(`[TestimonialCard] Invalid href: "${href}". Use "/path" or a full http(s) URL.`);
  }

  const Content = (
    <figure className="rounded-2xl border p-6 shadow-sm bg-white/70 dark:bg-zinc-900/60">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-zinc-200">
          <Image
            src={currentSrc}
            alt={author}
            width={56}
            height={56}
            className="h-full w-full object-cover"
            unoptimized
            onError={handleImageError}
            placeholder="blur"
            blurDataURL={placeholder}
          />
        </div>

        <figcaption className="flex flex-col">
          <span className="font-medium leading-tight">{author}</span>
          {role && <span className="text-sm text-zinc-500">{role}</span>}
        </figcaption>
      </div>

      <blockquote className="mt-4 text-zinc-700 dark:text-zinc-200">
        <p>“{quote}”</p>
      </blockquote>

      {internal && (
        <Link
          href={href!}
          prefetch={false}
          className="mt-4 inline-block text-sm underline decoration-dotted underline-offset-4 text-zinc-600 hover:text-zinc-900"
          aria-label="View full case study"
        >
          View full case study →
        </Link>
      )}

      {external && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm underline decoration-dotted underline-offset-4 text-zinc-600 hover:text-zinc-900"
          aria-label="Open external case study"
        >
          View full case study ↗
        </a>
      )}
    </figure>
  );

  return Content;
}
