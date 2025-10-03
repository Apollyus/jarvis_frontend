# Závislosti a instalace

Tento dokument obsahuje seznam všech potřebných závislostí pro MCP Agent Chat UI aplikaci a pokyny k jejich instalaci.

---

## 1. Aktuální závislosti (již nainstalované)

### Runtime Dependencies
- `react` - ^19.1.1
- `react-dom` - ^19.1.1

### Dev Dependencies
- `@types/node` - ^24.6.0
- `@types/react` - ^19.1.16
- `@types/react-dom` - ^19.1.9
- `@vitejs/plugin-react` - ^5.0.4
- `eslint` - ^9.36.0
- `typescript` - ~5.9.3
- `vite` - ^7.1.7

---

## 2. Nové závislosti k instalaci

### 2.1 State Management

#### Zustand
```bash
npm install zustand
```

**Účel**: Lightweight state management  
**Verze**: Latest (^5.0.0+)  
**Použití**: Stores pro auth, chat, sessions, websocket

---

### 2.2 Styling

#### Tailwind CSS + PostCSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Účel**: Utility-first CSS framework  
**Verze**: Latest (^3.4.0+)  
**Konfigurace**: Vyžaduje tailwind.config.js a postcss.config.js

#### Tailwind Forms (volitelné)
```bash
npm install -D @tailwindcss/forms
```

**Účel**: Lepší výchozí styly pro formulářové elementy  
**Použití**: Login formuláře, chat input

---

### 2.3 Utility knihovny

#### UUID
```bash
npm install uuid
npm install -D @types/uuid
```

**Účel**: Generování unikátních ID pro zprávy a sessions  
**Použití**: `uuid.v4()` pro message.id, session.id

#### clsx (volitelné)
```bash
npm install clsx
```

**Účel**: Podmíněné CSS třídy  
**Použití**: Dynamické styly komponent

---

### 2.4 Routing (volitelné - doporučené pro budoucnost)

#### React Router
```bash
npm install react-router-dom
npm install -D @types/react-router-dom
```

**Účel**: Client-side routing  
**Použití**: /login, /chat routes  
**Poznámka**: Prozatím volitelné, lze implementovat později

---

### 2.5 Development Tools (volitelné)

#### Prettier
```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

**Účel**: Code formatting  
**Použití**: Konzistentní formátování kódu

---

## 3. Kompletní instalační příkaz

Pro rychlou instalaci všech základních závislostí:

```bash
# State management
npm install zustand

# Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Utilities
npm install uuid
npm install -D @types/uuid

# Optional: Better form styles
npm install -D @tailwindcss/forms

# Optional: Class name utility
npm install clsx
```

---

## 4. Konfigurace Tailwind CSS

### 4.1 tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'), // uncomment if installed
  ],
}
```

### 4.2 src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

/* Custom component styles */
@layer components {
  .btn-primary {
    @apply bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors;
  }
  
  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500;
  }
}
```

---

## 5. Konfigurace TypeScript pro path aliases (volitelné)

### 5.1 tsconfig.app.json

Přidat do `compilerOptions`:

```json
{
  "compilerOptions": {
    // ... existing config
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@services/*": ["./src/services/*"],
      "@stores/*": ["./src/stores/*"],
      "@types/*": ["./src/types/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}
```

### 5.2 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@types': path.resolve(__dirname, './src/types'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
})
```

---

## 6. Environment Variables Setup

### 6.1 Vytvořit .env soubory

#### .env.development
```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws/chat
VITE_MAX_RECONNECT_ATTEMPTS=5
VITE_RECONNECT_DELAY=1000
```

#### .env.production
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com/ws/chat
VITE_MAX_RECONNECT_ATTEMPTS=3
VITE_RECONNECT_DELAY=2000
```

### 6.2 Přidat do .gitignore
```
.env.local
.env.*.local
```

### 6.3 Vytvořit .env.example
```bash
VITE_API_BASE_URL=
VITE_WS_URL=
VITE_MAX_RECONNECT_ATTEMPTS=
VITE_RECONNECT_DELAY=
```

---

## 7. Package.json scripts (rozšíření)

Doporučené přidání do `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 8. Kontrolní seznam instalace

- [ ] Nainstalovat Zustand: `npm install zustand`
- [ ] Nainstalovat Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer`
- [ ] Inicializovat Tailwind: `npx tailwindcss init -p`
- [ ] Nakonfigurovat tailwind.config.js
- [ ] Aktualizovat src/index.css s Tailwind direktivami
- [ ] Nainstalovat UUID: `npm install uuid @types/uuid`
- [ ] (Volitelné) Nainstalovat clsx: `npm install clsx`
- [ ] (Volitelné) Nainstalovat @tailwindcss/forms: `npm install -D @tailwindcss/forms`
- [ ] (Volitelné) Nainstalovat React Router: `npm install react-router-dom`
- [ ] Vytvořit .env soubory
- [ ] (Volitelné) Nakonfigurovat path aliases v tsconfig a vite.config

---

## 9. Verifikace instalace

Po instalaci všech závislostí:

```bash
# Kontrola závislostí
npm list zustand
npm list tailwindcss
npm list uuid

# Kontrola TypeScript
npm run type-check

# Spustit dev server
npm run dev
```

---

## 10. Velikost bundle (očekávaná)

### Production build size (odhad):
- **React + React-DOM**: ~130 KB (gzipped)
- **Zustand**: ~3 KB (gzipped)
- **UUID**: ~5 KB (gzipped)
- **Tailwind CSS**: ~10-50 KB (gzipped, záleží na použití)
- **App Code**: ~20-40 KB (gzipped)

**Celková velikost**: ~170-230 KB (gzipped)

---

## 11. Troubleshooting

### Problém: Tailwind styly nefungují
**Řešení**: 
1. Zkontrolovat import v src/index.css
2. Zkontrolovat content paths v tailwind.config.js
3. Restartovat dev server

### Problém: TypeScript path aliases nefungují
**Řešení**:
1. Zkontrolovat tsconfig.app.json
2. Zkontrolovat vite.config.ts
3. Restartovat TypeScript server v IDE

### Problém: WebSocket nepřipojuje
**Řešení**:
1. Zkontrolovat .env soubory
2. Ověřit že backend běží na správném portu
3. Zkontrolovat CORS nastavení na backendu

---

## Závěr

Po instalaci všech závislostí je projekt připraven k implementaci podle navržené architektury v [ARCHITEKTURA.md](./ARCHITEKTURA.md).

**Další krok**: Přepnout do Code módu a začít s implementací struktury složek a základních komponent.