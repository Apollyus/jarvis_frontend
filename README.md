# MCP Agent Chat - Frontend

Moderní React aplikace pro chatování s MCP Agentem s real-time WebSocket komunikací.

## 🚀 Technologie

- **React 19** + **TypeScript** - moderní UI framework
- **Vite** - rychlý build tool
- **Zustand** - lightweight state management
- **Tailwind CSS** - utility-first CSS framework
- **WebSocket API** - real-time komunikace
- **LocalStorage** - persistence dat

## 📋 Požadavky

- Node.js 18+ a npm
- Běžící backend na `http://localhost:8000`

## 🔧 Instalace

```bash
# Naklonovat repozitář (pokud ještě není)
# cd do projektu
cd jarvis_frontend

# Závislosti jsou již nainstalovány, ale pro jistotu:
npm install
```

## ⚙️ Konfigurace

### Environment Variables

Soubor `.env.development` je již vytvořen s výchozími hodnotami:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws/chat
VITE_MAX_RECONNECT_ATTEMPTS=5
VITE_RECONNECT_DELAY=1000
```

Pro produkci vytvořte `.env.production` s odpovídajícími hodnotami.

## 🏃 Spuštění

### Development mode

```bash
npm run dev
```

Aplikace poběží na `http://localhost:5173` (nebo jiném volném portu).

### Production build

```bash
npm run build
npm run preview
```

## 📁 Struktura projektu

```
src/
├── components/          # React komponenty
│   ├── auth/           # Autentizace (LoginForm, ApiKeyInput)
│   ├── chat/           # Chat UI (ChatContainer, Message, MessageList, ChatInput)
│   ├── session/        # Správa sessions (SessionList, SessionItem)
│   ├── common/         # Sdílené komponenty (LoadingSpinner, Toast, ErrorBoundary)
│   └── layout/         # Layout komponenty (AppLayout, Sidebar)
│
├── services/           # Business logika
│   ├── authService.ts      # HTTP autentizace
│   ├── websocketService.ts # WebSocket správa
│   └── storageService.ts   # LocalStorage persistence
│
├── stores/             # Zustand state management
│   ├── authStore.ts        # Autentizační stav
│   ├── chatStore.ts        # Chatové zprávy
│   ├── sessionStore.ts     # Správa sessions
│   └── websocketStore.ts   # WebSocket stav
│
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useChat.ts
│   ├── useSession.ts
│   └── useWebSocket.ts
│
├── types/              # TypeScript definice
│   ├── auth.types.ts
│   ├── chat.types.ts
│   ├── session.types.ts
│   └── websocket.types.ts
│
├── pages/              # Stránky
│   └── LoginPage.tsx
│
├── utils/              # Pomocné funkce
│   └── constants.ts
│
├── config/             # Konfigurace
│   └── api.config.ts
│
├── App.tsx             # Hlavní komponenta
├── main.tsx            # Entry point
└── index.css           # Tailwind + globální styly
```

## 🎯 Hlavní funkce

### ✅ Implementované funkce

- ✅ **Autentizace**
  - Přihlášení pomocí username/password
  - Přihlášení pomocí API klíče
  - Automatické obnovení session z LocalStorage
  - Bezpečné odhlášení

- ✅ **Real-time Chat**
  - WebSocket komunikace
  - Odesílání a přijímání zpráv
  - Indikátor "agent píše"
  - Statusy zpráv (odesílání, odesláno, chyba)

- ✅ **Session Management**
  - Vytváření nových konverzací
  - Přepínání mezi konverzacemi
  - Mazání konverzací
  - Persistence v LocalStorage

- ✅ **UI/UX**
  - Moderní, čistý design
  - Responsive layout
  - Loading states
  - Error handling
  - Auto-scroll v chatu
  - Connection status indikátor

- ✅ **WebSocket Features**
  - Auto-reconnect s exponenciálním backoff
  - Sledování stavu připojení
  - Graceful error handling

## 🔐 Přihlášení

Aplikace podporuje dva způsoby přihlášení:

### 1. Username/Password
```
POST /api/auth/login
{
  "username": "your_username",
  "password": "your_password"
}
```

### 2. Přímý API klíč
Zadejte API klíč získaný z backendu. Aplikace ověří jeho platnost připojením k WebSocket.

## 💾 Data Persistence

Aplikace ukládá do LocalStorage:
- API klíč
- Seznam sessions
- Zprávy pro každou session
- ID aktivní session

Data přežijí refresh stránky a zůstávají až do odhlášení.

## 🌐 WebSocket Komunikace

### Připojení
```
ws://localhost:8000/ws/chat?api_key=YOUR_API_KEY
```

### Formát zpráv

**Odchozí zpráva:**
```json
{
  "session_id": "uuid",
  "message": "text zprávy",
  "timestamp": 1234567890
}
```

**Příchozí zpráva:**
```json
{
  "type": "response" | "status" | "error",
  "content": "odpověď agenta",
  "error": "chybová zpráva (volitelné)",
  "timestamp": 1234567890
}
```

## 🎨 Tailwind CSS

Aplikace používá Tailwind CSS s custom konfigurací:

- Primary colors: Blue (primary-50 až primary-900)
- Custom komponenty: `.btn-primary`, `.input-field`, `.card`
- Responsive breakpoints
- Dark mode ready (připraveno pro budoucí implementaci)

## 🔧 Troubleshooting

### WebSocket se nepřipojuje

1. Zkontrolujte že backend běží na `http://localhost:8000`
2. Ověřte API klíč
3. Zkontrolujte CORS nastavení na backendu
4. Podívejte se do konzole na chyby

### Tailwind styly nefungují

1. Zkontrolujte že `postcss.config.js` a `tailwind.config.js` existují
2. Restartujte dev server: `Ctrl+C` a `npm run dev`
3. Vymažte cache: `rm -rf node_modules/.vite`

### TypeScript chyby

```bash
# Type check
npm run type-check

# Pokud přetrvávají, restart TS serveru v IDE
```

## 📝 Poznámky pro vývoj

### Přidání nové komponenty

1. Vytvořte komponentu v příslušné složce `src/components/`
2. Použijte TypeScript pro typy
3. Exportujte z komponenty
4. Importujte tam kde potřebujete

### Přidání nového store

1. Vytvořte soubor v `src/stores/`
2. Použijte Zustand `create()`
3. Definujte interface s state a actions
4. Exportujte hook

### Přidání nového hook

1. Vytvořte soubor v `src/hooks/`
2. Použijte existující stores/services
3. Vrátíte pouze potřebná data/funkce

## 🚀 Další kroky

Připraveno pro budoucí rozšíření:

- [ ] React Router pro routing
- [ ] Dark mode
- [ ] File upload support
- [ ] Message search
- [ ] Export konverzací
- [ ] PWA support
- [ ] Voice input
- [ ] Markdown rendering pro zprávy agenta

## 📄 Licence

Tento projekt je součástí MCP Agent Chat systému.

## 🤝 Podpora

Pro problémy nebo otázky:
1. Zkontrolujte dokumentaci v `ARCHITEKTURA.md`
2. Podívejte se do konzole prohlížeče
3. Ověřte že backend běží správně