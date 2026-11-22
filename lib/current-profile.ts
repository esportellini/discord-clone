import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

/** Perfil do usuário logado, ou null se não houver sessão/perfil. */
export const currentProfile = async () => {
  const { userId } = auth();
  if (!userId) return null;

  return db.profile.findUnique({ where: { userId } });
};
