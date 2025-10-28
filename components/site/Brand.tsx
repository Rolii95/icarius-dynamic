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
      {/* Cropped logo: optimized dimensions for the horizontal layout */}
      <Image
        src="/brand/icarius_consulting_logo.svg"
        width={426}
        height={138}
        alt="Icarius Consulting"
        className="h-auto w-[426px]"
        priority
      />
    </Link>
  );
}
