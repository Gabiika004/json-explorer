# JSON Chat Explorer

Ez a projekt egy modern, böngészhető **chat-összegző felület**, amely JSON fájlokból származó adatokat jelenít meg. A cél egy strukturált, könnyen kezelhető UI, ahol a felhasználók többféle szűrési feltétellel böngészhetik a beszélgetések összefoglalóit.

---

## 🔧 Hogyan működik?

- **Next.js + Tailwind CSS** alapú SPA.
- Az adatok a projekt `data` mappájában lévő JSON fájlokból származnak.
- A backend egy `scripts/generate-index.ts` script segítségével összegyűjti és egységesíti az adatokat a `public/index.json` fájlba.
- Az alkalmazás frontendje mindig ezt az index.json-t olvassa be, és **kliensoldalon** szűri az adatokat.
- Ha nincs index.json, vagy hibás, a rendszer automatikusan megpróbálja legenerálni azt.
- Manuálisan is frissíthető az adatbázis az "Adatok beolvasása" gombbal.
- A keresőmezők egy fixen fennmaradó navbarban találhatók, amelynek háttere világos módban #888888, sötét módban #222.
- A teljes UI támogatja a **dark/light theme**-et, amelyet a jobb felső sarokban lévő gombbal lehet váltani (és megjegyzi a választást).

---

## 📁 Könyvtárstruktúra és adatfeltöltés

Az alkalmazás működéséhez hozz létre egy `data` nevű mappát a projekt gyökerében, ahová a JSON fájlokat kell tölteni, pl.:

```
/data
  └── 2025
      └── 06
          └── 12.json
```

A JSON fájlok lehetnek nyers chat exportok (pl. LiveChat formátum), a backend script automatikusan egységes ChatSummary objektumokká alakítja őket.

---

## 🔄 Adatbázis generálás/frissítés

Az adatok összegyűjtéséhez és egységesítéséhez a következő történik:

- A `scripts/generate-index.ts` script rekurzívan beolvassa a `data` mappában található összes .json fájlt.
- Minden beszélgetést egységes szerkezetű objektummá alakít (id, dátum, agent email(ek), ügyfél adatok, üzenetek, stb.).
- Az eredményt a `public/index.json` fájlba írja ki.
- A generálás automatikusan megtörténik, ha az index.json hiányzik vagy hibás, illetve manuálisan is indítható a kereső sávban lévő "Adatok beolvasása" gombbal.

---

## 🔍 Keresés és szűrés

A keresőmezők a lap tetején, egy fixen fennmaradó navbarban találhatók. Szűrhetsz:

- **Dátum** (naptárból választható)
- **Email** (agent vagy ügyfél emailcím részlete)
- **Ügyfél név**
- **Ticket ID**

A szűrés **valós időben** történik, minden változtatásra azonnal frissül a találati lista.

A "Szűrők törlése" gomb minden keresési feltételt visszaállít.

---

## 🌗 Dark/Light theme

- A teljes UI támogatja a világos és sötét témát.
- A jobb felső sarokban található gombbal bármikor átválthatsz.
- A választásod megmarad (localStorage), de az OS/böngésző preferenciát is figyelembe veszi első betöltéskor.
- A színek Tailwind változókon és CSS változókon alapulnak, minden komponens automatikusan igazodik a témához.

---

## 🚀 Telepítés és futtatás

### 1. Projekt klónozása

```bash
git clone <repo-url>
cd <projekt-mappa>
```

### 2. Függőségek telepítése

```bash
npm install
```

### 3. Fejlesztői szerver indítása

```bash
npm run dev
```

Ezután nyisd meg a böngészőt: [http://localhost:3000](http://localhost:3000)

### 4. (Opcionális) Tesztadatok generálása

Futtasd a teszt chat generáló scriptet, ha szeretnél sok tesztadatot:

```bash
npx tsx scripts/generate-test-chats.ts
```

Majd generáld újra az indexet:

```bash
npx tsx scripts/generate-index.ts
```

---

## ℹ️ Egyéb tudnivalók

- Az alkalmazás **offline fut**, nem küld adatokat külső szerverekre.
- A `data` mappa nem kerül verziókövetés alá, saját adatokat kell feltölteni.
- A projekt szabadon felhasználható és módosítható.
- A backend script csak saját szerveren, Node.js környezetben futtatható (Vercel/Netlify nem támogatja a child_process-t).

---

## 📬 Kapcsolat

Kérdés vagy javaslat esetén bátran írj:

📧 **gaborgarai@frontendguy.co.site**

---

Köszönöm, hogy kipróbálod a Chat Explorer prototípust! 🙌
