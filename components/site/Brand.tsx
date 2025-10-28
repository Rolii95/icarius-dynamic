// components/site/Brand.tsx
import Link from "next/link";
import Image from "next/image";

export default function Brand() {
  return (
    <Link
      href="/"
      aria-label="Icarius Consulting — home"
      className="flex flex-col md:flex-row items-center gap-2 md:gap-3 rounded-xl focus:outline-none focus-visible:ring-2 ring-sky-400/60"
      data-brand-scale="2"
    >
      {/* mark: 56x56 (was 28x28) */}
      <Image
        src="/brand/icarius_mark.svg"
        width={56}
        height={56}
        alt=""
        aria-hidden="true"
        className="w-[56px] h-[56px]"
        priority
      />
  <div className="leading-none text-center md:text-left">
        {/* name: ~32px (was ~16px) */}
        <div className="font-bold tracking-[0.02em] text-white text-[32px]">
          Icarius
        </div>
        {/* tag: ~24px (was ~12px) */}
        <div className="font-semibold tracking-[0.16em] text-white/80 text-[24px]">
          CONSULTING
        </div>
      </div>
    </Link>
  );
}
