import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <Image 
        src="/logo.png" 
        alt="STMS OWN Logo" 
        width={1200} 
        height={400}
        className="h-96 w-auto"
      />
    </Link>
  );
}
