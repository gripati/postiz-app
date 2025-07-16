FROM node:20

WORKDIR /app

# Kökten lock ve workspace dosyalarını kopyala
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

# Tüm monorepo içeriğini kopyala
COPY . .

# Bağımlılıkları yükle (tüm monorepo için)
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Frontend dizinine geç ve build al
WORKDIR /app/apps/frontend
RUN pnpm build

EXPOSE 4200

# Production başlat (her durumda doğru dizinde çalışır)
CMD ["pnpm", "--dir", "/app/apps/frontend", "start"] 