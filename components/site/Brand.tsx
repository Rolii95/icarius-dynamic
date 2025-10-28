// components/site/Brand.tsx
import Link from "next/link";
import Image from "next/image";

export default function Brand() {
  return (
    <Link
      href="/"
      aria-label="Icarius Consulting — home"
      className="flex items-center rounded-xl focus:outline-none focus-visible:ring-2 ring-sky-400/60"
    >
      {/* Full logo: doubled size from 180x126 to 360x252 */}
      <Image
        src="/brand/icarius_consulting_logo.svg"
        width={360}
        height={252}
        alt="Icarius Consulting"
        className="h-auto w-[360px]"
        priority
      />
    </Link>
  );
}
