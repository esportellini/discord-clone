"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { ServerAvatar } from "@/components/server-avatar";

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

export function NavigationItem({ id, name, imageUrl }: NavigationItemProps) {
  const params = useParams<{ serverId?: string }>();
  const active = params?.serverId === id;

  return (
    <Link href={`/servers/${id}`} title={name} className="group relative flex items-center">
      <span
        className={cn(
          "absolute left-0 w-1 rounded-r-full bg-primary transition-all",
          active ? "h-9" : "h-2 opacity-0 group-hover:h-5 group-hover:opacity-100"
        )}
      />
      <span
        className={cn(
          "relative mx-3 flex h-12 w-12 overflow-hidden rounded-3xl transition-all group-hover:rounded-2xl",
          active && "rounded-2xl"
        )}
      >
        <ServerAvatar name={name} imageUrl={imageUrl} />
      </span>
    </Link>
  );
}
