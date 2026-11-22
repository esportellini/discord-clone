import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

/** Busca o perfil do usuário logado, criando-o no primeiro acesso. */
export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: { userId: user.id },
  });

  if (profile) return profile;

  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    "Usuário";

  return db.profile.create({
    data: {
      userId: user.id,
      name,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0]?.emailAddress ?? "",
    },
  });
};
