FROM node:20

WORKDIR /app

COPY ../../pnpm-lock.yaml ../../package.json ./
COPY ../../pnpm-workspace.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

CMD ["pnpm", "start"] 