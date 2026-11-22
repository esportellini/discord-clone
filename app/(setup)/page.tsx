import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { CreateServerForm } from "@/components/server/create-server-form";

const SetupPage = async () => {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: { members: { some: { profileId: profile.id } } },
    orderBy: { createdAt: "asc" },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return (
    <main className="flex h-full items-center justify-center p-4">
      <CreateServerForm />
    </main>
  );
};

export default SetupPage;
