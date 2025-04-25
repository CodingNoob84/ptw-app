import Link from "next/link";

import { Notifications } from "./notifications";
import { UserComponent } from "./user";

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Permit to Work
        </Link>

        <div className="flex items-center gap-4">
          <Notifications />
          <UserComponent />
        </div>
      </div>
    </header>
  );
}
