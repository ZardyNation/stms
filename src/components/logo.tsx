import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <Image 
        src="/logo.jpg" 
        alt="STMS OWN Logo" 
        width={1200} 
        height={400}
        className="w-auto h-48 sm:h-64 md:h-80 lg:h-96"
      />
    </Link>
  );
}
