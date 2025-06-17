# JSON Chat Explorer – Prototípus

Ez a projekt egy egyszerű, böngészhető **chat-összegző felület**, amely JSON fájlokból származó adatokat jelenít meg. A cél egy strukturált és könnyen kezelhető UI, ahol a felhasználók dátum és ügynök (agent email) alapján szűrhetik a beszélgetések összefoglalóit.

---

## 🔧 Hogyan működik?

A projekt **Next.js** alapokra épül, a fájlrendszerből olvassa be az adatokat, majd UI-n keresztül lehet szűrni azokat:

- Alapértelmezetten **minden rekord megjelenik**.
- A felhasználó **agent email** és **dátum** alapján szűrhet.
- A szűrés **valós időben** történik, nincs szükség külön keresés gombra.
- A kártyák egyedileg az `id` alapján kerülnek megjelenítésre, ismétlődés kizárva.

---

## 📁 Könyvtárstruktúra és adatfeltöltés

Az alkalmazás működéséhez létre kell hozni egy `data` nevű mappát, ahová a JSON fájlokat kell tölteni az alábbi struktúrában:

```
/data
  └── 2024
      └── 06
          └── 13.json
```

### 🔸 JSON fájl formátuma

Egy fájl több chat összefoglalót tartalmazhat. A struktúra az alábbi szerint épül fel:

```json
[
  {
    "id": "abc123",
    "date": "2024-06-13",
    "agentEmails": ["example@domain.com", "support@domain.com"],
    "content": [
      {
        "sender": "Agent",
        "text": "Üdvözlöm, miben segíthetek?"
      },
      {
        "sender": "Customer",
        "text": "A problémám a következő..."
      }
    ]
  },
  {
    "id": "123abc",
    "date": "2024-06-11",
    "agentEmails": [],
    "content": [...]
  }
]
```

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
A cím nálad lehet más, ha futtatsz másik saját szervert

---

## ℹ️ Egyéb tudnivalók

- Az alkalmazás jelenleg **prototípus fázisban van**, így hibák vagy hiányosságok előfordulhatnak.
- A **`data` mappa nem kerül verziókövetés alá**, így neked kell feltölteni saját adatokat a használathoz.
- A projekt **szabadon felhasználható és módosítható** saját célokra.
- Az alkalmazás **offline fut**, nem küld adatokat külső szerverekre.

---

## 📬 Kapcsolat

Kérdés vagy javaslat esetén bátran írj:

📧 **gaborgarai@frontendguy.co.site**

---

Köszönöm, hogy kipróbálod a Chat Explorer prototípust! 🙌
