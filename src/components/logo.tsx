import Link from "next/link";
import { Zap } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <div className="bg-primary p-2 rounded-md">
        <Zap className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold tracking-tighter text-foreground">
        STMS
      </span>
    </Link>
  );
}
