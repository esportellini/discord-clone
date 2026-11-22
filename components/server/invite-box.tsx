"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

export function InviteBox({ inviteCode }: { inviteCode: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}/invite/${inviteCode}`);
  }, [inviteCode]);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
        Link de convite
      </p>
      <div className="flex items-center gap-x-1">
        <input
          readOnly
          value={url}
          aria-label="Link de convite"
          className="min-w-0 flex-1 rounded bg-zinc-200/70 px-2 py-1 text-xs text-zinc-700 outline-none dark:bg-zinc-900 dark:text-zinc-300"
        />
        <button
          type="button"
          onClick={copy}
          title="Copiar"
          className="rounded p-1 text-zinc-500 hover:bg-zinc-700/10 dark:hover:bg-zinc-700"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
