# SZE Teszt Alkalmazás - Fejlesztői Dokumentáció

## Projekt Áttekintés

A projekt két fő részből áll:
1. **Mobil Alkalmazás (sze-dui)**: Adatgyűjtő alkalmazás, amely a tesztek lebonyolítását és az adatok rögzítését végzi
2. **Web Alkalmazás (sze-react)**: Adminisztrációs felület, amely az összegyűjtött adatok megjelenítését és exportálását teszi lehetővé

## Alkalmazások Indítása

### Mobil Alkalmazás (sze-dui)
```bash
cd sze-dui
npm install
npx expo start
```

### Web Alkalmazás (sze-react)
```bash
cd sze-react
npm install
npm run dev
```

## Technológiai Stack

### Mobil Alkalmazás
- React Native: 0.72.6
- Expo: ~49.0.15
- TypeScript: ^5.2.2
- NativeWind: ^2.0.11
- Firebase: ^10.5.2
- Expo Router: ^2.0.0

### Web Alkalmazás
- React: 18.2.0
- TypeScript: ^5.0.2
- TailwindCSS: ^3.3.3
- Firebase: ^10.5.2

## Mobil Alkalmazás Struktúra

```
sze-dui/
├── app/                        # Fő képernyők
│   ├── index.tsx              # Kezdőképernyő
│   ├── groups/                # Csoport kezelés
│   ├── participants/          # Résztvevő kezelés
│   └── tests/                 # Teszt modulok
│       ├── [participantId].tsx    # Teszt vezérlő
│       ├── config/               # Teszt konfiguráció
│       └── testModules/          # Teszt implementációk
│
├── components/                # Újrafelhasználható komponensek
│   ├── Header.tsx            # Fejléc komponens
│   ├── TestIntro.tsx         # Teszt bevezető képernyő
│   └── TestComplete.tsx      # Teszt befejező képernyő
│
├── firebase/                 # Backend szolgáltatások
│   ├── firebaseConfig.ts     # Firebase konfiguráció
│   ├── groupService.ts       # Csoport műveletek
│   ├── participantService.ts # Résztvevő műveletek
│   ├── testService.ts        # Teszt eredmény műveletek
│   └── types.ts              # TypeScript típusdefiníciók
│
└── config/                   # Alkalmazás konfiguráció
    └── testConfig.ts         # Teszt paraméterek
```

## Teszt Konfiguráció

A `testConfig.ts` fájl tartalmazza az összes teszt modul konfigurációs értékét. Itt állíthatók be:
- Képernyőméretek és pozíciók
- Időzítések és késleltetések
- Próbálkozások száma
- Egyéb konstans értékek

A fájl részletes kommentekkel van ellátva, amelyek magyarázzák az egyes értékek funkcióját.

## Backend Szolgáltatások

A `firebase` könyvtárban találhatók a backend műveletek implementációi:

- **firebaseConfig.ts**: Firebase kapcsolat konfigurációja
- **groupService.ts**: Csoportok kezelése (létrehozás, lekérdezés, törlés)
- **participantService.ts**: Résztvevők kezelése (hozzáadás, módosítás, törlés)
- **testService.ts**: Teszteredmények kezelése (mentés, lekérdezés)
- **types.ts**: TypeScript típusdefiníciók az adatmodellekhez

## Adatstruktúra

### Csoportok
```typescript
interface Group {
  id: string;
  name: string;
  createdAt: Timestamp;
}
```

### Résztvevők
```typescript
interface Participant {
  id: string;
  name: string;
  birthYear: number;
  groupId: string;
  hasCompletedTest: boolean;
  lastTestDate?: Timestamp;
}
```

### Teszteredmények
```typescript
interface TestResults {
  participantId: string;
  timestamp: Timestamp;
  tests: {
    reaction: ReactionTestResults;
    memory: MemoryTestResults;
    balance: BalanceTestResults;
    choice: ChoiceTestResults;
  }
}
```

## Firebase Műveletek

A backend szolgáltatások a következő műveleteket teszik lehetővé:
- Csoportok és résztvevők kezelése
- Teszteredmények mentése
- Adatok lekérdezése és szűrése
- Eredmények exportálása (web felületen)

A részletes implementációk a megfelelő service fájlokban találhatók.

## Navigációs Flow

### Alkalmazás Indítása
1. Kezdőképernyő: Csoport lista
2. Csoport kiválasztása → Résztvevők listája
3. Résztvevő kiválasztása → Résztvevő adatlap
4. "Start Test" gomb → Tesztsorozat indítása

### Tesztsorozat Flow
1. **Reakcióidő Teszt**
   - Bevezető képernyő instrukciókkal
   - Teszt végrehajtása
   - Automatikus továbblépés a Memória tesztre
   
2. **Memória Teszt**
   - Bevezető képernyő instrukciókkal
   - Teszt végrehajtása
   - Automatikus továbblépés az Egyensúly tesztre

3. **Egyensúly Teszt**
   - Kompatibilitás ellenőrzés
   - Bevezető képernyő instrukciókkal
   - Teszt végrehajtása
   - Automatikus továbblépés a Választásos tesztre

4. **Választásos Teszt**
   - Bevezető képernyő instrukciókkal
   - Teszt végrehajtása
   - Teszt befejezése → Eredmények mentése képernyő

### Kilépési Pontok
- **"Quit" Gomb**: Minden tesztképernyőn elérhető
  - Megerősítő dialógus
  - Igen → Vissza a résztvevő adatlapra (eredmények elvetése)
  - Nem → Teszt folytatása

- **Eredmények Mentése Képernyő**
  - "Save Results" → Mentés és visszatérés a résztvevő adatlapra
  - "Leave Without Saving" → Visszatérés mentés nélkül

### Navigációs Korlátozások
- Tesztsorozat közben a rendszer-szintű "vissza" navigáció le van tiltva
- Befejezett tesztre nem lehet visszalépni
- Mentés képernyőről nem lehet visszalépni az utolsó tesztre
- Tesztsorozat megszakítása csak a "Quit" gombbal lehetséges

### Állapot Kezelés
- Minden teszt menti a saját állapotát
- Tesztsorozat állapota központilag kezelve
- Résztvevő tesztelési állapota (hasCompletedTest) automatikusan frissül
