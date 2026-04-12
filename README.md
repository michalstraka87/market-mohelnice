# 🏘️ Mohelnice Marketplace MVP

Komunitní online marketplace pro město Mohelnice a okolí. Lidi si výměňují věci, služby a zboží bez poplatků a bez prostředníků.

## 📦 Co je hotové

### ✅ Funkce
- 🏠 **Hlavní stránka** — grid inzerátů (responsive 3/2/1 sloupce), filtrování kategorií, vyhledávání
- 📝 **Detail inzerátu** — galerie fotek, popis, cena, profil prodávajícího s hodnocením, tlačítko „Mám zájem"
- ➕ **Přidání inzerátu** — 3-krokový wizard (fotky s drag&drop, popis, výběr ceny)
- 🔐 **Registrace & Přihlášení** — e-mail + heslo, povinná pole (město, jméno, telefon)
- 👤 **Profil** — přehled uživatele, jeho hodnocení, přihlášení/odhlášení
- 🔒 **Autentifikace** — Supabase Auth, chráněné routy (proxy middleware)
- 📦 **Storage** — nahrávání fotek na Supabase Storage (až 8 na inzerát)
- 🎨 **Design** — responsive mobile-first, primární barva #E84040, loading skeletons, toast notifikace

### 🗄️ Technologický stack
- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Hosting**: Vercel (free tier)
- **Database**: PostgreSQL s RLS (Row-Level Security)

## 🚀 Jak začít

**👉 ČÍTEJ NEJDŘÍV: `SETUP.md` — tam je step-by-step návod!**

Stručně:
1. Vytvoř projekt na supabase.com (zdarma)
2. Nahraje `supabase/schema.sql` do SQL Editor
3. Zkopíruj Supabase URL + API key do `.env.local`
4. Spusť `npm run dev` na http://localhost:3000
5. Deploy на Vercel (2 kliky, zdarma)

## 📁 Struktura projektu

```
├── app/
│   ├── layout.tsx              # Root layout + Navbar
│   ├── page.tsx                # Hlavní stránka (home)
│   ├── inzerat/[id]/page.tsx   # Detail inzerátu
│   ├── pridat/page.tsx         # 3-krokový wizard
│   ├── registrace/page.tsx     # Registrace
│   ├── prihlaseni/page.tsx     # Přihlášení
│   ├── profil/page.tsx         # Můj profil
│   └── auth/callback/          # OAuth callback
├── components/
│   ├── layout/Navbar.tsx       # Navigace + auth
│   ├── listings/               # Komponenty pro inzeráty
│   └── ui/ToastProvider.tsx    # Toast notifikace
├── lib/
│   ├── constants.ts            # Kategorie, města, ceny
│   └── supabase/               # Supabase klienti + typy
├── supabase/schema.sql         # Databázové schéma
├── proxy.ts                    # Auth middleware (Next.js 16)
├── SETUP.md                    # 👈 SETUP instrukce
└── .env.local                  # Secrets (Supabase URL + key)
```

## 📊 Databáze

### Tabulky
- **users** — Profily uživatelů (id, jméno, město, telefon, hodnocení)
- **listings** — Inzeráty (název, popis, fotky, cena, uživatel)
- **ratings** — Hodnocení (hvězdy za nákupy)

Automatické:
- ✅ Vytvoření profilu při registraci
- ✅ Aktualizace hodnocení po Review
- ✅ RLS policies pro bezpečnost

Čítej `supabase/schema.sql` pro detaily.

## 🎨 Design

- **Primární barva**: #E84040 (červená)
- **Responsive**: Mobile-first (1 sloupec → 2 → 3)
- **Komponenty**: Zaoblené karty, subtle shadows, loading skeletons, toast notifikace
- **Font**: System fonts (sans-serif) pro rychlost

## 📝 Kategorie & Města

### 11 Kategorií
Elektronika, Oblečení, Nábytek, Auto-moto, Dům a zahrada, Sport, Děti a hračky, Knihy, Zvířata, Služby, Ostatní

### 12 Měst
Mohelnice, Zábřeh, Šumperk, Postřelmov, Úsov, Loštice, Litovel, Moravičany, Mírov, Pavlov, Doubravice, Třeština

### Ceny (v inzerátu vybíráš 1 z těchto)
- **Zdarma** — Věc se dává zdarma
- **Symbolická** — Čokoláda / Káva / Pivo / 5 banánů / Vlastní text
- **Pevná cena** — Konkrétní Kč
- **Dohodou** — Cena se vyjednává

## 🔒 Security

✅ Row-Level Security (RLS) — každý vidí jen svá data  
✅ Supabase Auth — JWT, email verification optional  
✅ Validace na backendu — policies v Supabase  
✅ CORS pro Storage — public bucket pro fotky  

## 🧪 Test Drive

Po nastavení z `SETUP.md`:

```bash
npm run dev
```

Na http://localhost:3000:
1. Klikni Přihlásit → Zaregistruj se
2. Vyplň jméno, email, město, heslo
3. Klikni + Přidat inzerát
4. Přetáhni fotku, vyplň popis, zvol cenu
5. Klikni Zveřejnit
6. Inzerát vidíš na hlavní stránce

## 🚚 Deploy на Vercel

```bash
npm install -g vercel
vercel login
vercel
```

V Vercelu:
1. Jdi Settings → Environment Variables
2. Přidej `NEXT_PUBLIC_SUPABASE_URL` a `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy!

App běží na `https://your-name.vercel.app`

## ❌ Nechceš teď (zadáním vynecháno)

- 💬 Chat
- 💳 Platby
- 📱 Android app
- 🔔 Push notifikace
- 🛃 Admin panel

Až budete chtít, řekni!

## 📚 Resources

- **Next.js 16**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Tvůj MVP je hotový k deployu! 🎉**
