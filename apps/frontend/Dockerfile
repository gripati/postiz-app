FROM node:20

# 1. Monorepo köküne geç
WORKDIR /app

# 2. Kökten lock ve workspace dosyalarını kopyala
COPY ../../pnpm-lock.yaml ../../package.json ../../pnpm-workspace.yaml ./

# 3. Tüm monorepo içeriğini kopyala
COPY ../../ ./

# 4. Sadece frontend dizinine geç
WORKDIR /app/apps/frontend

# 5. Bağımlılıkları yükle (tüm monorepo için, cache için)
RUN pnpm install --frozen-lockfile

# 6. Build al (Next.js .next klasörü burada oluşur)
RUN pnpm build

# 7. Production başlat
CMD ["pnpm", "start"] 