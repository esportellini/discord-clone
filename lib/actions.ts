"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ChannelType, MemberRole } from "@prisma/client";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

async function requireProfile() {
  const profile = await currentProfile();
  if (!profile) throw new Error("Não autorizado");
  return profile;
}

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function channelSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

export async function createServer(formData: FormData) {
  const profile = await requireProfile();

  const name = text(formData, "name");
  const imageUrl = text(formData, "imageUrl");
  if (!name) throw new Error("O nome do servidor é obrigatório");

  const server = await db.server.create({
    data: {
      profileId: profile.id,
      name: name.slice(0, 64),
      imageUrl,
      inviteCode: randomUUID(),
      channels: { create: [{ name: "geral", profileId: profile.id }] },
      members: { create: [{ profileId: profile.id, role: MemberRole.ADMIN }] },
    },
  });

  revalidatePath("/", "layout");
  redirect(`/servers/${server.id}`);
}

export async function createChannel(serverId: string, formData: FormData) {
  const profile = await requireProfile();

  const name = channelSlug(text(formData, "name"));
  const type = text(formData, "type") as ChannelType;
  if (!name) throw new Error("Nome de canal inválido");

  const member = await db.member.findUnique({
    where: { profileId_serverId: { profileId: profile.id, serverId } },
  });
  if (!member || member.role === MemberRole.GUEST) {
    throw new Error("Sem permissão para criar canais");
  }

  const channel = await db.channel.create({
    data: {
      name,
      type: Object.values(ChannelType).includes(type) ? type : ChannelType.TEXT,
      serverId,
      profileId: profile.id,
    },
  });

  revalidatePath(`/servers/${serverId}`, "layout");
  redirect(`/servers/${serverId}/channels/${channel.id}`);
}

export async function sendMessage(channelId: string, formData: FormData) {
  const profile = await requireProfile();

  const content = text(formData, "content").slice(0, 2000);
  if (!content) return;

  const channel = await db.channel.findUnique({ where: { id: channelId } });
  if (!channel) throw new Error("Canal não encontrado");

  const member = await db.member.findUnique({
    where: {
      profileId_serverId: { profileId: profile.id, serverId: channel.serverId },
    },
  });
  if (!member) throw new Error("Você não é membro deste servidor");

  await db.message.create({
    data: { content, channelId, memberId: member.id },
  });

  revalidatePath(`/servers/${channel.serverId}/channels/${channelId}`);
}
