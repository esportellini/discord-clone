import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

/** Entra no servidor pelo link de convite (ou só abre, se já for membro). */
const InvitePage = async ({ params }: { params: { inviteCode: string } }) => {
  const profile = await initialProfile();

  const server = await db.server.findUnique({
    where: { inviteCode: params.inviteCode },
  });
  if (!server) return redirect("/");

  await db.member.upsert({
    where: {
      profileId_serverId: { profileId: profile.id, serverId: server.id },
    },
    update: {},
    create: { profileId: profile.id, serverId: server.id },
  });

  return redirect(`/servers/${server.id}`);
};

export default InvitePage;
