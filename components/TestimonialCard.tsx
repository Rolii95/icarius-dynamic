import Image from "next/image";
import Link from "next/link";

import { createInitialsAvatar } from "@/lib/avatar";

export type Testimonial = {
  quote: string;
  author: string;
  role?: string;
  href?: string;
  avatarSrc?: string;
};

export default function TestimonialCard({ quote, author, role, href, avatarSrc }: Testimonial) {
  const avatarUrl = avatarSrc ?? createInitialsAvatar(author);

  return (
    <figure className="rounded-2xl border p-6 shadow-sm bg-white/70 dark:bg-zinc-900/60">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-zinc-200">
          <Image
            src={avatarUrl}
            alt={author}
            width={56}
            height={56}
            className="h-full w-full object-cover"
            unoptimized
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

      {href && (
        <Link
          href={href}
          className="mt-4 inline-block text-sm underline decoration-dotted underline-offset-4 text-zinc-600 hover:text-zinc-900"
        >
          View full case study →
        </Link>
      )}
    </figure>
  );
}
