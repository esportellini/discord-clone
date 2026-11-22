import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";
import { Hash, Mic, Video } from "lucide-react";

import { db } from "@/lib/db";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { AutoRefresh } from "@/components/chat/auto-refresh";

const icons = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

const ChannelPage = async ({
  params,
}: {
  params: { serverId: string; channelId: string };
}) => {
  // A checagem de membro já acontece no layout do servidor
  const channel = await db.channel.findUnique({
    where: { id: params.channelId, serverId: params.serverId },
  });
  if (!channel) return redirect(`/servers/${params.serverId}`);

  const Icon = icons[channel.type];

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <header className="flex h-12 shrink-0 items-center gap-x-2 border-b-2 border-neutral-200 px-4 font-semibold dark:border-neutral-800">
        <Icon className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
        {channel.name}
      </header>

      {channel.type === ChannelType.TEXT ? (
        <>
          <ChatMessages channelId={channel.id} channelName={channel.name} />
          <ChatInput channelId={channel.id} channelName={channel.name} />
          <AutoRefresh />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
          Canais de voz e vídeo ainda não foram implementados.
        </div>
      )}
    </div>
  );
};

export default ChannelPage;
