import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ServerSidebar } from "@/components/server/server-sidebar";

const ServerLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  // Só membros do servidor podem ver o conteúdo
  const member = await db.member.findUnique({
    where: {
      profileId_serverId: { profileId: profile.id, serverId: params.serverId },
    },
  });
  if (!member) return redirect("/");

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden w-60 md:flex md:left-[72px]">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <div className="h-full md:pl-60">{children}</div>
    </div>
  );
};

export default ServerLayout;
