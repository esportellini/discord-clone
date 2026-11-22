# Discord Clone

Chat em equipe no estilo Discord: servidores, canais e mensagens de texto.

**Stack:** Next.js 14 (App Router + Server Actions) · Clerk (auth) · Prisma + Postgres (Supabase) · Tailwind + shadcn/ui

## O que já funciona

- Login/cadastro com Clerk; o perfil é criado no banco no primeiro acesso
- Criar servidor (nome + URL de imagem opcional) — já vem com o canal `#geral`
- Barra lateral com seus servidores e barra de canais por servidor
- Criar canais de texto, voz e vídeo (admins e moderadores)
- Chat de texto: últimas 50 mensagens, envio via Server Action, atualização a cada 4s
- Link de convite: quem abre `/invite/<código>` entra no servidor
- Tema claro/escuro

## Rodando localmente

1. Instale as dependências e gere o client do Prisma:

   ```bash
   npm install
   npx prisma generate
   ```

2. Copie `.env.example` para `.env` e preencha as chaves do Clerk e as URLs do Supabase
   (`DATABASE_URL` = pooler, `DIRECT_URL` = conexão direta).

3. Crie as tabelas no banco:

   ```bash
   npx prisma db push
   ```

   > Se você já tinha rodado o schema antigo: algumas colunas foram renomeadas
   > (`createAt` → `createdAt`, `profileid` → `profileId`). Em dev, o mais simples é
   > `npx prisma db push --force-reset` (apaga os dados).

4. `npm run dev` e abra http://localhost:3000

## Estrutura

```
app/
  (auth)/             sign-in / sign-up do Clerk
  (setup)/page.tsx    "/" → cria o perfil e manda pro primeiro servidor (ou pede pra criar um)
  (main)/             layout com a barra de servidores
    servers/new                         criar servidor
    servers/[serverId]                  layout com a barra de canais
    servers/[serverId]/channels/[id]    chat do canal
  (invite)/invite/[inviteCode]          entrar por convite
components/
  navigation/   barra de servidores
  server/       barra de canais, formulário de servidor, convite
  chat/         mensagens, input, auto-refresh
lib/
  actions.ts          Server Actions (criar servidor/canal, enviar mensagem)
  current-profile.ts  perfil do usuário logado
  initial-profile.ts  perfil (cria se não existir)
  db.ts               Prisma client
prisma/schema.prisma
```

## Próximos passos sugeridos

- Tempo real de verdade (Supabase Realtime ou Socket.IO) no lugar do polling
- Upload de imagem (UploadThing / Vercel Blob) em vez de URL
- Editar/apagar mensagens, gerenciar membros e cargos, editar/sair do servidor
- Navegação no mobile (hoje as barras laterais só aparecem a partir de `md`)
- Canais de voz/vídeo (LiveKit)
