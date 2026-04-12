# 🏘️ Mohelnice Marketplace — Setup Guide

Vítej! Projekt je připravený na vzhledové a funkční úrovni. Aby to všechno fungovalo, musíš udělat tyto manuální kroky:

## 1️⃣ Vytvoř si Supabase projekt

1. Jdi na [supabase.com](https://supabase.com) a přihlásit se
2. Klikni **+ Create a new project**
3. Vyplň:
   - **Project name**: `mohelnice-marketplace` (nebo jakékoli jméno)
   - **Database Password**: bezpečné heslo (ulož si ho!)
   - **Region**: Vyber **EU (Stockholm)** pro nejnižší latenci
4. Pondělím počka (cca 1-2 minuty) než se projekt vytvoří

## 2️⃣ Nainstaluj databázové schéma

1. V Supabase projektu jdi do **SQL Editor** levý panel
2. Klikni **+ New Query**
3. Zkopíruj obsah `supabase/schema.sql` do editoru
4. Klikni **Run** (zelené tlačítko)
5. Ověř, že tabulky `users`, `listings`, `ratings` se vytvořily
   - V levém panelu jdi na **Table Editor** a měly by tam být

## 3️⃣ Nakonfiguruj Environment Variables

1. V Supabase projektu jdi na **Settings** (levý panel, vespod)
2. Jdi na **API** -> **Project API keys**
3. Zkopíruj:
   - **Project URL** (začíná `https://xxx.supabase.co`)
   - **anon public key** (veřejný klíč)
4. Otevři `.env.local` v kořeni projektu
5. Nahraď:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
   ```
6. Ulož soubor

## 4️⃣ Nakonfiguruj Storage pro fotky

1. V Supabase jdi na **Storage** (levý panel)
2. Měl by tam být bucket s názvem `listings-photos` — pokud není, klikni **+ New bucket**
3. Jméno: `listings-photos`
4. Nastav na **Public** (aby byly fotky veřejně vidět)
5. Klikni **Create bucket**

## 5️⃣ Spusť dev server

```bash
npm run dev
```

Aplikace běží na `http://localhost:3000` 🚀

---

## 🧪 Test Drive

1. Jdi na http://localhost:3000
2. Klikni **Přihlásit** v pravém horním rohu
3. Klikni **Zaregistruj se zdarma**
4. Vyplň:
   - Jméno: `Jan Novák`
   - E-mail: `test@example.com`
   - Město: `Mohelnice`
   - Heslo: `testpassword123`
5. Klikni **Zaregistrovat se zdarma**

Měl bys být ihned přihlášený. Teď:

6. Klikni **+ Přidat inzerát** v horní liště
7. **Krok 1 — Fotografie**: Přetáhni nebo vyber jakýkoli obrázek
8. **Krok 2 — Popis**: Vyplň název, popis, zvol kategorii
9. **Krok 3 — Cena**: Vyber typ ceny (Zdarma, Symbolická, Pevná, Dohodou)
10. Klikni **✓ Zveřejnit inzerát**

Tvůj inzerát se měl objevit na hlavní stránce! 🎉

---

## 🚀 Deploy na Vercel

```bash
# Přihlásit se Vercelu
npm install -g vercel
vercel login

# Deploy
vercel
```

Při deployu Vercel řekne:
- Project name: `mohelnice-marketplace`
- Framework: `Next.js` (auto-detect)

Pak v Vercelu:
1. Jdi do **Settings** → **Environment Variables**
2. Přidej:
   - `NEXT_PUBLIC_SUPABASE_URL` — hodnota z Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — hodnota z Supabase
3. Klikni **Deploy** znovu

Hotovo! Aplikace běží na `https://your-project.vercel.app` ✨

---

## ❌ Troubleshooting

**Chyba: "Invalid supabaseUrl"**
- Zkontroluj, že `.env.local` má správné Supabase URL a klíč
- URL by měla vypadat jako `https://xxxxx.supabase.co`

**Registrace nefunguje**
- Zkontroluj v Supabase → **Authentication** → **Users**, jestli se uživatel vytvořil
- Zjistit, co se stalo v **Logs** sekci

**Fotky se neukazují po nahrání**
- Zkontroluj, že storage bucket `listings-photos` je nastavený na **Public**
- V Supabase → **Storage** → klikni na bucket → click ... → **Edit bucket** → zaškrtni **Public**

**Inzeráty se neukazují**
- Zkontroluj v Supabase → **Table Editor** → `listings`
- Měla by tam být alespoň jednu řádku s tvým inzerátem

---

## 📝 Další kroky (volitelně)

Co chceš dál? Nějáké nápady:

- 👤 **Profil uživatele** (`/profil`) — editace profilu, moje inzeráty, hodnocení
- ⭐ **Hodnocení** — po kontaktu si mohou dát hvězdy
- 💬 **Jednoduché oznámení** — e-mail když si někdo vezme tvůj inzerát
- 🔐 **Ověřování emailu** — povinné před zveřejněním prvního inzerátu
- 📱 **Responsive doladění** — testovat na mobilu

**Potřebuješ pomoct?** Jen řekni! 🎯
