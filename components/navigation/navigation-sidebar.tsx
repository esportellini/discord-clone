import Link from "next/link";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ModeToggle } from "@/components/mode-toggle";
import { NavigationItem } from "@/components/navigation/navigation-item";

export async function NavigationSidebar() {
  const profile = await currentProfile();
  if (!profile) return redirect("/");

  const servers = await db.server.findMany({
    where: { members: { some: { profileId: profile.id } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <nav className="flex h-full w-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 dark:bg-[#1E1F22]">
      <Link
        href="/servers/new"
        title="Criar servidor"
        className="group mx-3 flex h-12 w-12 items-center justify-center rounded-3xl bg-background transition-all hover:rounded-2xl hover:bg-emerald-500 dark:bg-neutral-700"
      >
        <Plus className="h-6 w-6 text-emerald-500 transition group-hover:text-white" />
      </Link>

      <div className="mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />

      <div className="w-full flex-1 space-y-3 overflow-y-auto">
        {servers.map((server) => (
          <NavigationItem
            key={server.id}
            id={server.id}
            name={server.name}
            imageUrl={server.imageUrl}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-y-4 pb-1">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{ elements: { avatarBox: "h-12 w-12" } }}
        />
      </div>
    </nav>
  );
}
