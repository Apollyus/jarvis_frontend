# Implementační plán - Krok za krokem

Tento dokument poskytuje podrobný plán implementace MCP Agent Chat UI aplikace v doporučeném pořadí.

---

## Fáze 1: Příprava prostředí ✅

### 1.1 Instalace závislostí
```bash
# Základní závislosti
npm install zustand uuid
npm install -D @types/uuid

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Volitelné utility
npm install clsx
npm install -D @tailwindcss/forms
```

### 1.2 Konfigurace Tailwind
- [ ] Nakonfigurovat [`tailwind.config.js`](tailwind.config.js)
- [ ] Aktualizovat [`src/index.css`](src/index.css) s Tailwind direktivami
- [ ] Otestovat že Tailwind funguje

### 1.3 Environment variables
- [ ] Vytvořit [`.env.development`](.env.development)
- [ ] Vytvořit [`.env.example`](.env.example)
- [ ] Přidat do [`.gitignore`](.gitignore)

---

## Fáze 2: Základní struktura (Day 1)

### 2.1 Vytvořit složky
```bash
src/
├── components/
│   ├── auth/
│   ├── chat/
│   ├── session/
│   ├── common/
│   └── layout/
├── services/
├── stores/
├── hooks/
├── types/
├── utils/
└── config/
```

### 2.2 TypeScript typy
Vytvořit v tomto pořadí:
1. [ ] [`types/auth.types.ts`](src/types/auth.types.ts) - Auth interfaces
2. [ ] [`types/websocket.types.ts`](src/types/websocket.types.ts) - WebSocket interfaces
3. [ ] [`types/chat.types.ts`](src/types/chat.types.ts) - Chat message interfaces
4. [ ] [`types/session.types.ts`](src/types/session.types.ts) - Session interfaces

### 2.3 Konfigurace
1. [ ] [`config/api.config.ts`](src/config/api.config.ts) - API endpoints a konstanty
2. [ ] [`utils/constants.ts`](src/utils/constants.ts) - Globální konstanty

---

## Fáze 3: Service vrstva (Day 1-2)

### 3.1 Storage Service
- [ ] [`services/storage.service.ts`](src/services/storage.service.ts)
- **Funkcionalita**:
  - saveApiKey / getApiKey / clearApiKey
  - saveSessions / getSessions
  - saveMessages / getMessages
- **Test**: Zkusit uložit a načíst data z localStorage

### 3.2 Auth Service
- [ ] [`services/auth.service.ts`](src/services/auth.service.ts)
- **Funkcionalita**:
  - login(credentials)
  - validateApiKey(apiKey)
  - Integrace s StorageService
- **Test**: Zkusit zavolat login endpoint (mock nebo skutečný)

### 3.3 WebSocket Service
- [ ] [`services/websocket.service.ts`](src/services/websocket.service.ts)
- **Funkcionalita**:
  - connect(apiKey)
  - disconnect()
  - sendMessage(message)
  - onMessage callback
  - Auto-reconnect logika
- **Test**: Připojit se k backendu a odeslat testovací zprávu

---

## Fáze 4: State Management (Day 2)

### 4.1 Auth Store
- [ ] [`stores/authStore.ts`](src/stores/authStore.ts)
- **State**: isAuthenticated, apiKey, username, error
- **Actions**: login, loginWithApiKey, logout, restoreSession
- **Integrace**: AuthService, StorageService

### 4.2 WebSocket Store
- [ ] [`stores/websocketStore.ts`](src/stores/websocketStore.ts)
- **State**: status, error, reconnectAttempts
- **Actions**: connect, disconnect, sendMessage
- **Integrace**: WebSocketService

### 4.3 Session Store
- [ ] [`stores/sessionStore.ts`](src/stores/sessionStore.ts)
- **State**: sessions, activeSessionId
- **Actions**: createSession, setActiveSession, deleteSession
- **Integrace**: StorageService

### 4.4 Chat Store
- [ ] [`stores/chatStore.ts`](src/stores/chatStore.ts)
- **State**: messages, isAgentTyping, error
- **Actions**: addMessage, updateMessageStatus, setAgentTyping
- **Integrace**: StorageService

---

## Fáze 5: Custom Hooks (Day 2-3)

### 5.1 useAuth
- [ ] [`hooks/useAuth.ts`](src/hooks/useAuth.ts)
- **Return**: isAuthenticated, login, logout, error
- **Použití**: LoginForm, ProtectedRoute

### 5.2 useWebSocket
- [ ] [`hooks/useWebSocket.ts`](src/hooks/useWebSocket.ts)
- **Return**: status, sendMessage, isConnected
- **Použití**: ChatContainer

### 5.3 useSession
- [ ] [`hooks/useSession.ts`](src/hooks/useSession.ts)
- **Return**: sessions, activeSession, createSession, switchSession
- **Použití**: SessionList, Sidebar

### 5.4 useChat
- [ ] [`hooks/useChat.ts`](src/hooks/useChat.ts)
- **Return**: messages, isAgentTyping, sendMessage
- **Použití**: ChatContainer, ChatInput

---

## Fáze 6: Common komponenty (Day 3)

### 6.1 UI primitives
1. [ ] [`components/common/LoadingSpinner.tsx`](src/components/common/LoadingSpinner.tsx)
2. [ ] [`components/common/ErrorBoundary.tsx`](src/components/common/ErrorBoundary.tsx)
3. [ ] [`components/common/Toast.tsx`](src/components/common/Toast.tsx)
4. [ ] [`components/common/ConnectionStatus.tsx`](src/components/common/ConnectionStatus.tsx)

**Test každé komponenty**: Vytvořit v Storybook nebo izolovaně

---

## Fáze 7: Auth komponenty (Day 3-4)

### 7.1 Login flow
1. [ ] [`components/auth/LoginForm.tsx`](src/components/auth/LoginForm.tsx)
   - Form pro username/password
   - Validace
   - Error handling
   
2. [ ] [`components/auth/ApiKeyInput.tsx`](src/components/auth/ApiKeyInput.tsx)
   - Input pro API klíč
   - Validace formátu
   
3. [ ] [`components/auth/ProtectedRoute.tsx`](src/components/auth/ProtectedRoute.tsx)
   - Guard pro protected routes
   - Redirect na login

### 7.2 Auth stránka
- [ ] Vytvořit login page s oběma možnostmi přihlášení
- [ ] Stylovat s Tailwind
- [ ] Test: Přihlásit se a zkontrolovat localStorage

---

## Fáze 8: Layout komponenty (Day 4)

### 8.1 Základní layout
1. [ ] [`components/layout/AppLayout.tsx`](src/components/layout/AppLayout.tsx)
   - Grid layout: Sidebar + Main
   - Responsive design
   
2. [ ] [`components/layout/Sidebar.tsx`](src/components/layout/Sidebar.tsx)
   - Sessions list
   - New session button
   - User info
   
3. [ ] [`components/layout/Header.tsx`](src/components/layout/Header.tsx)
   - Session title
   - Connection status
   - Logout button

**Test**: Zobrazit layout bez funkcionality

---

## Fáze 9: Session komponenty (Day 4-5)

### 9.1 Session management
1. [ ] [`components/session/SessionList.tsx`](src/components/session/SessionList.tsx)
   - List všech sessions
   - Highlight aktivní session
   
2. [ ] [`components/session/SessionItem.tsx`](src/components/session/SessionItem.tsx)
   - Single session item
   - Click to activate
   - Delete button
   
3. [ ] [`components/session/NewSessionButton.tsx`](src/components/session/NewSessionButton.tsx)
   - Button pro novou session
   - Automaticky aktivovat novou session

**Test**: Vytvořit, přepnout a smazat session

---

## Fáze 10: Chat komponenty (Day 5-6)

### 10.1 Chat UI
1. [ ] [`components/chat/ChatContainer.tsx`](src/components/chat/ChatContainer.tsx)
   - Hlavní chat container
   - Orchestrace sub-komponent
   
2. [ ] [`components/chat/ChatHeader.tsx`](src/components/chat/ChatHeader.tsx)
   - Session title
   - Actions
   
3. [ ] [`components/chat/MessageList.tsx`](src/components/chat/MessageList.tsx)
   - Scrollable seznam zpráv
   - Auto-scroll na novou zprávu
   
4. [ ] [`components/chat/Message.tsx`](src/components/chat/Message.tsx)
   - Single message component
   - User vs Agent styling
   - Timestamp
   
5. [ ] [`components/chat/ChatInput.tsx`](src/components/chat/ChatInput.tsx)
   - Textarea pro input
   - Send button
   - Enter to send
   - Shift+Enter new line
   
6. [ ] [`components/chat/TypingIndicator.tsx`](src/components/chat/TypingIndicator.tsx)
   - Animovaný indikátor
   - Show/hide based on isAgentTyping

**Test**: Poslat zprávu a přijmout odpověď

---

## Fáze 11: Integrace (Day 6-7)

### 11.1 Propojit komponenty
1. [ ] Implementovat WebSocket message flow
2. [ ] Propojit chat s sessions
3. [ ] Implementovat auto-reconnect
4. [ ] Persistence zpráv při přepnutí sessions

### 11.2 Error handling
1. [ ] Network errors
2. [ ] Auth errors
3. [ ] Validation errors
4. [ ] User-friendly chybové hlášky

### 11.3 Loading states
1. [ ] Login loading
2. [ ] Message sending loading
3. [ ] Session switching loading

---

## Fáze 12: Polish & Optimalizace (Day 7-8)

### 12.1 UX vylepšení
- [ ] Keyboard shortcuts (Ctrl+N pro novou session)
- [ ] Scroll to bottom v chat
- [ ] Focus management
- [ ] Loading states
- [ ] Empty states

### 12.2 Performance
- [ ] React.memo pro Message komponenty
- [ ] Virtual scrolling pro dlouhé chaty (optional)
- [ ] Debounce typing indicator
- [ ] Code splitting

### 12.3 Accessibility
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] Screen reader support

### 12.4 Responsive design
- [ ] Mobile layout
- [ ] Tablet layout
- [ ] Desktop layout

---

## Fáze 13: Testing (Day 8-9)

### 13.1 Unit tests
- [ ] Services (auth, websocket, storage)
- [ ] Stores
- [ ] Utils functions

### 13.2 Integration tests
- [ ] Auth flow
- [ ] Chat flow
- [ ] Session management

### 13.3 E2E tests
- [ ] Complete user journey
- [ ] Error scenarios

---

## Fáze 14: Documentation (Day 9)

### 14.1 Code documentation
- [ ] JSDoc komentáře
- [ ] README aktualizace
- [ ] API documentation

### 14.2 User documentation
- [ ] Setup guide
- [ ] User guide
- [ ] Troubleshooting

---

## Fáze 15: Deployment prep (Day 9-10)

### 15.1 Production build
- [ ] Environment variables pro production
- [ ] Build optimalizace
- [ ] Bundle size check

### 15.2 Security
- [ ] API key encryption (optional)
- [ ] WSS pro production
- [ ] CORS check

### 15.3 Monitoring
- [ ] Error logging setup (Sentry)
- [ ] Analytics (optional)

---

## Quick Start Checklist

**Pro okamžitý start implementace:**

1. ✅ Přečíst [`ARCHITEKTURA.md`](ARCHITEKTURA.md)
2. ✅ Přečíst [`ZAVISLOSTI.md`](ZAVISLOSTI.md)
3. ⬜ Nainstalovat závislosti
4. ⬜ Nakonfigurovat Tailwind
5. ⬜ Vytvořit strukturu složek
6. ⬜ Začít s TypeScript typy
7. ⬜ Implementovat Services
8. ⬜ Implementovat Stores
9. ⬜ Vytvořit komponenty postupně

---

## Odhad času

| Fáze | Odhad času | Priorita |
|------|-----------|----------|
| Příprava prostředí | 1-2h | 🔴 Kritická |
| Základní struktura | 2-3h | 🔴 Kritická |
| Service vrstva | 4-6h | 🔴 Kritická |
| State Management | 4-5h | 🔴 Kritická |
| Custom Hooks | 2-3h | 🟡 Vysoká |
| Common komponenty | 3-4h | 🟡 Vysoká |
| Auth komponenty | 4-5h | 🔴 Kritická |
| Layout komponenty | 3-4h | 🟡 Vysoká |
| Session komponenty | 4-5h | 🟡 Vysoká |
| Chat komponenty | 6-8h | 🔴 Kritická |
| Integrace | 4-6h | 🔴 Kritická |
| Polish & Optimalizace | 6-8h | 🟢 Střední |
| Testing | 8-10h | 🟡 Vysoká |
| Documentation | 2-3h | 🟢 Střední |
| Deployment prep | 3-4h | 🟡 Vysoká |

**Celkový odhad**: 56-76 hodin (7-10 pracovních dnů)

---

## Doporučené pořadí implementace

### MVP (Minimum Viable Product) - Priorita 1
1. Příprava prostředí
2. TypeScript typy
3. Services (Storage, Auth, WebSocket)
4. Stores (Auth, WebSocket, Chat)
5. Auth komponenty (LoginForm, ProtectedRoute)
6. Chat komponenty (ChatContainer, MessageList, Message, ChatInput)
7. Základní integrace

**Výsledek**: Funkční chat s autentizací

### Rozšíření - Priorita 2
1. Session management
2. Layout komponenty
3. Common komponenty (Loading, Error, Toast)
4. UX vylepšení

**Výsledek**: Plně funkční aplikace

### Polish - Priorita 3
1. Optimalizace
2. Testing
3. Documentation
4. Deployment

**Výsledek**: Production-ready aplikace

---

## Tipy pro efektivní implementaci

1. **Start Small**: Začít s nejjednodušší funkcionalitou a postupně rozšiřovat
2. **Test Early**: Testovat každou komponentu hned po vytvoření
3. **Commit Often**: Malé, časté commity s dobrými messages
4. **Stay Organized**: Držet se navržené struktury
5. **Document as You Go**: Psát dokumentaci průběžně, ne až na konci
6. **Ask for Help**: Konzultovat nejasnosti s týmem/dokumentací

---

## Nástroje a utility

### Development
- VS Code extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Hero

### Testing
- Vitest
- React Testing Library
- Playwright (E2E)

### Debugging
- React DevTools
- Redux DevTools (pro Zustand)
- Network tab (WebSocket messages)

---

## Další kroky

Po dokončení této implementace můžete přidat:
- 📱 PWA support
- 🌙 Dark mode
- 🎨 Theming system
- 📁 File upload
- 🎤 Voice input
- 🔍 Message search
- ⚡ Real-time collaboration

---

**Připraveno k implementaci! Přepněte se do Code módu a začněte s Fází 1.**