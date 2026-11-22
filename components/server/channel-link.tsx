"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Hash, Mic, Video } from "lucide-react";
import { ChannelType } from "@prisma/client";

import { cn } from "@/lib/utils";

const icons = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

interface ChannelLinkProps {
  serverId: string;
  id: string;
  name: string;
  type: ChannelType;
}

export function ChannelLink({ serverId, id, name, type }: ChannelLinkProps) {
  const params = useParams<{ channelId?: string }>();
  const active = params?.channelId === id;
  const Icon = icons[type];

  return (
    <Link
      href={`/servers/${serverId}/channels/${id}`}
      className={cn(
        "group flex items-center gap-x-2 rounded-md px-2 py-1.5 text-sm font-medium text-zinc-500 transition hover:bg-zinc-700/10 dark:text-zinc-400 dark:hover:bg-zinc-700/50",
        active && "bg-zinc-700/20 text-primary dark:bg-zinc-700 dark:text-zinc-100"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{name}</span>
    </Link>
  );
}
