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
      {/* Full logo: scale to appropriate header size */}
      <Image
        src="/brand/icarius_consulting_logo.svg"
        width={180}
        height={126}
        alt="Icarius Consulting"
        className="h-auto w-[180px]"
        priority
      />
    </Link>
  );
}
