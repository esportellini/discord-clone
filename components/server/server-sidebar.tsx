import { redirect } from "next/navigation";
import { ChannelType, MemberRole } from "@prisma/client";
import { Plus } from "lucide-react";

import { db } from "@/lib/db";
import { createChannel } from "@/lib/actions";
import { currentProfile } from "@/lib/current-profile";
import { ChannelLink } from "@/components/server/channel-link";
import { InviteBox } from "@/components/server/invite-box";

const sections = [
  { type: ChannelType.TEXT, label: "Canais de texto" },
  { type: ChannelType.AUDIO, label: "Canais de voz" },
  { type: ChannelType.VIDEO, label: "Canais de vídeo" },
];

export async function ServerSidebar({ serverId }: { serverId: string }) {
  const profile = await currentProfile();
  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: { id: serverId },
    include: {
      channels: { orderBy: { createdAt: "asc" } },
      members: { where: { profileId: profile.id } },
    },
  });
  if (!server) return redirect("/");

  const role = server.members[0]?.role;
  const canManage = role === MemberRole.ADMIN || role === MemberRole.MODERATOR;

  return (
    <aside className="flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]">
      <header className="flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
        <span className="truncate">{server.name}</span>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
        {sections.map(({ type, label }) => {
          const channels = server.channels.filter((c) => c.type === type);
          if (channels.length === 0) return null;
          return (
            <section key={type} className="space-y-0.5">
              <p className="px-2 pb-1 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                {label}
              </p>
              {channels.map((channel) => (
                <ChannelLink
                  key={channel.id}
                  serverId={server.id}
                  id={channel.id}
                  name={channel.name}
                  type={channel.type}
                />
              ))}
            </section>
          );
        })}

        {canManage && (
          <details className="rounded-md">
            <summary className="flex cursor-pointer list-none items-center gap-x-2 px-2 py-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
              <Plus className="h-4 w-4" />
              Criar canal
            </summary>
            <form
              action={createChannel.bind(null, server.id)}
              className="mt-2 space-y-2 px-2"
            >
              <input
                name="name"
                required
                maxLength={32}
                placeholder="novo-canal"
                aria-label="Nome do canal"
                className="w-full rounded bg-zinc-200/70 px-2 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-zinc-900"
              />
              <select
                name="type"
                defaultValue={ChannelType.TEXT}
                aria-label="Tipo do canal"
                className="w-full rounded bg-zinc-200/70 px-2 py-1.5 text-sm outline-none dark:bg-zinc-900"
              >
                <option value={ChannelType.TEXT}>Texto</option>
                <option value={ChannelType.AUDIO}>Voz</option>
                <option value={ChannelType.VIDEO}>Vídeo</option>
              </select>
              <button
                type="submit"
                className="w-full rounded bg-indigo-500 py-1.5 text-sm font-medium text-white hover:bg-indigo-600"
              >
                Criar
              </button>
            </form>
          </details>
        )}
      </div>

      {canManage && (
        <div className="border-t border-neutral-200 p-3 dark:border-neutral-800">
          <InviteBox inviteCode={server.inviteCode} />
        </div>
      )}
    </aside>
  );
}
