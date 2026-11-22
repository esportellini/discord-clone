"use client";

import { useRef } from "react";

import { sendMessage } from "@/lib/actions";

interface ChatInputProps {
  channelId: string;
  channelName: string;
}

export function ChatInput({ channelId, channelName }: ChatInputProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        formRef.current?.reset();
        await sendMessage(channelId, formData);
      }}
      className="px-4 pb-6"
    >
      <input
        name="content"
        autoComplete="off"
        maxLength={2000}
        aria-label="Mensagem"
        placeholder={`Conversar em #${channelName}`}
        className="w-full rounded-lg bg-zinc-200/90 px-4 py-3 text-sm text-zinc-700 outline-none placeholder:text-zinc-500 dark:bg-zinc-700/75 dark:text-zinc-200 dark:placeholder:text-zinc-400"
      />
    </form>
  );
}
