import { cn } from "@/lib/utils";

interface ServerAvatarProps {
  name: string;
  imageUrl?: string | null;
  className?: string;
}

/** Imagem do servidor, ou as iniciais quando não houver imagem. */
export function ServerAvatar({ name, imageUrl, className }: ServerAvatarProps) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  const initials = name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <span
      className={cn(
        "flex h-full w-full items-center justify-center bg-indigo-500 text-sm font-semibold text-white",
        className
      )}
    >
      {initials}
    </span>
  );
}
