import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <Image 
        src="/logo.png" 
        alt="STMS OWN Logo" 
        width={240} 
        height={80}
        className="h-20 w-auto"
      />
    </Link>
  );
}
