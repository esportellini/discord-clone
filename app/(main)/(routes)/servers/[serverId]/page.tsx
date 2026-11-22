import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";

import { db } from "@/lib/db";

/** Abrir um servidor leva direto ao primeiro canal de texto. */
const ServerIdPage = async ({ params }: { params: { serverId: string } }) => {
  const channel = await db.channel.findFirst({
    where: { serverId: params.serverId, type: ChannelType.TEXT },
    orderBy: { createdAt: "asc" },
  });

  if (channel) {
    return redirect(`/servers/${params.serverId}/channels/${channel.id}`);
  }

  return (
    <div className="flex h-full items-center justify-center text-sm text-zinc-500">
      Este servidor ainda não tem canais de texto.
    </div>
  );
};

export default ServerIdPage;
