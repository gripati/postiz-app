FROM node:20

WORKDIR /app

# Sadece frontend context'iyle çalışıyoruz!
COPY . .

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

RUN pnpm build

CMD ["pnpm", "start"] 