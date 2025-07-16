FROM node:20

WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY . .

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/frontend
RUN pnpm build

CMD ["pnpm", "--dir", "/app/apps/frontend", "start"] 