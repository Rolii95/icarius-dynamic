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
      {/* Full logo: increased by 1.5x from 360x252 to 540x378 */}
      <Image
        src="/brand/icarius_consulting_logo.svg"
        width={540}
        height={378}
        alt="Icarius Consulting"
        className="h-auto w-[540px]"
        priority
      />
    </Link>
  );
}
