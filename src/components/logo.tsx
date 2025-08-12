import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <span className="text-2xl font-extrabold tracking-tight text-foreground">
        STMS OWN
      </span>
    </Link>
  );
}
