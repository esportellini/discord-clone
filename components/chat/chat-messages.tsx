import { Hash } from "lucide-react";

import { db } from "@/lib/db";

const MESSAGE_LIMIT = 50;

const timeFormat = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

interface ChatMessagesProps {
  channelId: string;
  channelName: string;
}

export async function ChatMessages({ channelId, channelName }: ChatMessagesProps) {
  const messages = (
    await db.message.findMany({
      where: { channelId },
      include: { member: { include: { profile: true } } },
      orderBy: { createdAt: "desc" },
      take: MESSAGE_LIMIT,
    })
  ).reverse();

  return (
    // flex-col-reverse mantém o scroll grudado no fim da conversa
    <div className="flex flex-1 flex-col-reverse overflow-y-auto py-4">
      <div>
        <div className="mb-4 space-y-2 px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-500 dark:bg-zinc-700">
            <Hash className="h-10 w-10 text-white" />
          </div>
          <p className="text-2xl font-bold">Bem-vindo a #{channelName}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Este é o começo do canal #{channelName}.
          </p>
        </div>

        {messages.map((message) => (
          <article
            key={message.id}
            className="flex gap-x-3 px-4 py-2 transition hover:bg-black/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={message.member.profile.imageUrl}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="flex items-baseline gap-x-2">
                <span className="text-sm font-semibold">
                  {message.member.profile.name}
                </span>
                <time
                  dateTime={message.createdAt.toISOString()}
                  className="text-xs text-zinc-500 dark:text-zinc-400"
                >
                  {timeFormat.format(message.createdAt)}
                </time>
              </p>
              <p className="whitespace-pre-wrap break-words text-sm text-zinc-700 dark:text-zinc-300">
                {message.deleted ? (
                  <em className="text-zinc-500">mensagem apagada</em>
                ) : (
                  message.content
                )}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
