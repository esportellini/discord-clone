import { createServer } from "@/lib/actions";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-md border-0 bg-zinc-200/70 px-3 py-2 text-sm text-black outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-zinc-800 dark:text-white";

export function CreateServerForm() {
  return (
    <form
      action={createServer}
      className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 text-black shadow-lg dark:bg-[#2B2D31] dark:text-white"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Crie seu servidor</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Dê um nome e, se quiser, uma imagem. Dá pra mudar depois.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400"
        >
          Nome do servidor
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={64}
          placeholder="Meu servidor"
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="imageUrl"
          className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400"
        >
          URL da imagem (opcional)
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://..."
          className={inputClass}
        />
      </div>

      <Button type="submit" className="w-full bg-indigo-500 text-white hover:bg-indigo-600">
        Criar
      </Button>
    </form>
  );
}
