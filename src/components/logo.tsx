import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <Image 
        src="/logo.png" 
        alt="STMS OWN Logo" 
        width={120} 
        height={40}
        className="h-10 w-auto"
      />
    </Link>
  );
}
