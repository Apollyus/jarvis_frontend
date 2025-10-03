# Testovací Dokumentace - MCP Agent Chat Frontend

## Obsah
1. [Checklist pro manuální testování](#checklist-pro-manuální-testování)
2. [Testovací scénáře](#testovací-scénáře)
3. [Příprava backendu pro testování](#příprava-backendu-pro-testování)
4. [Běžné problémy a jejich řešení](#běžné-problémy-a-jejich-řešení)
5. [Automatizované testování (budoucnost)](#automatizované-testování-budoucnost)

---

## Checklist pro manuální testování

### ✅ Autentizace
- [ ] **Login s validními údaji**
  - Úspěšné přihlášení s existujícím uživatelským jménem a heslem
  - Přesměrování na chat po úspěšném přihlášení
  - Uložení auth tokenu do localStorage
  
- [ ] **Login s nevalidními údaji**
  - Zobrazení chybové hlášky při neplatném hesle
  - Zobrazení chybové hlášky při neexistujícím uživateli
  - Formulář zůstane zobrazený a nevymaže heslo
  
- [ ] **API klíč**
  - Možnost vložit API klíč místo hesla
  - Validace formátu API klíče
  - Úspěšné přihlášení s platným API klíčem
  
- [ ] **Logout**
  - Odhlášení ze systému
  - Vymazání auth tokenu z localStorage
  - Přesměrování na login stránku
  - Odpojení WebSocket spojení

### ✅ WebSocket Připojení
- [ ] **Úspěšné připojení**
  - Automatické připojení po přihlášení
  - Zobrazení "Connected" status indikátoru (zelená barva)
  - Možnost odesílat zprávy
  
- [ ] **Odpojení**
  - Manuální odpojení tlačítkem
  - Zobrazení "Disconnected" status indikátoru (červená barva)
  - Nemožnost odesílat zprávy
  
- [ ] **Auto-reconnect**
  - Automatické znovupřipojení při ztrátě spojení
  - Zobrazení "Reconnecting" status indikátoru (žlutá barva)
  - Úspěšné obnovení spojení do 5 sekund
  - Maximálně 5 pokusů o znovupřipojení
  
- [ ] **Chybové stavy**
  - Zobrazení error message při selhání připojení
  - Možnost manuálního znovupřipojení po selhání

### ✅ Odesílání/Přijímání Zpráv
- [ ] **Odesílání zpráv**
  - Odeslání textové zprávy pomocí Enter
  - Odeslání zprávy pomocí tlačítka Send
  - Vyprázdnění input fieldu po odeslání
  - Zobrazení loading spinner během odesílání
  - Nemožnost odeslat prázdnou zprávu
  
- [ ] **Přijímání zpráv**
  - Zobrazení vlastních zpráv (user message)
  - Zobrazení odpovědí asistenta (assistant message)
  - Správné formátování a časové značky
  - Automatické scrollování na nejnovější zprávu
  
- [ ] **Typing indicator**
  - Zobrazení "Agent is typing..." při čekání na odpověď
  - Zmizení typing indicator po přijetí zprávy
  
- [ ] **Markdown podpora**
  - Správné renderování kódu s syntax highlighting
  - Formátování textu (tučné, kurzíva, nadpisy)
  - Seznamy a odkazy

### ✅ Session Management
- [ ] **Vytvoření nové session**
  - Tlačítko "New Chat" vytvoří novou session
  - Automatické přepnutí na novou session
  - Generování jedinečného session ID
  - Prázdný seznam zpráv v nové session
  
- [ ] **Přepínání mezi sessions**
  - Kliknutí na session v sidebaru přepne zobrazení
  - Načtení historických zpráv vybrané session
  - Zvýraznění aktivní session
  
- [ ] **Mazání sessions**
  - Smazání session pomocí delete ikony
  - Potvrzovací dialog před smazáním
  - Přepnutí na jinou session po smazání aktivní
  - Ošetření smazání poslední session
  
- [ ] **Session metadata**
  - Zobrazení názvu session (nebo prvních slov první zprávy)
  - Timestamp vytvoření session
  - Počet zpráv v session

### ✅ LocalStorage Persistence
- [ ] **Uložení dat**
  - Auth token se ukládá do localStorage
  - Sessions se ukládají do localStorage
  - Zprávy se ukládají do localStorage
  - WebSocket stav se ukládá
  
- [ ] **Načtení dat**
  - Obnovení auth tokenu po refreshi stránky
  - Obnovení všech sessions po refreshi
  - Obnovení zpráv ve všech sessions
  - Zachování aktivní session
  
- [ ] **Vymazání dat**
  - Vymazání všech dat při odhlášení
  - Možnost vymazat jednotlivé sessions

### ✅ Error Handling
- [ ] **Network errors**
  - Zobrazení toast notifikace při network chybě
  - Možnost retry operace
  - Graceful degradation při offline režimu
  
- [ ] **Validační chyby**
  - Validace formulářových polí (required fields)
  - Zobrazení inline error messages
  - Prevence odeslání nevalidních dat
  
- [ ] **WebSocket errors**
  - Handling connection timeout
  - Handling server errors (500, 502, 503)
  - Zobrazení uživatelsky přívětivých error zpráv
  
- [ ] **Error boundary**
  - Zachycení runtime errors v React komponentách
  - Zobrazení fallback UI místo bílé obrazovky
  - Možnost reportovat chybu

### ✅ UI/UX
- [ ] **Responsive design**
  - Správné zobrazení na desktop (1920x1080)
  - Správné zobrazení na tablet (768x1024)
  - Správné zobrazení na mobile (375x667)
  - Sidebar collapse na mobilních zařízeních
  
- [ ] **Loading states**
  - Loading spinner při načítání dat
  - Skeleton screens pro sessions
  - Disabled state tlačítek během operací
  
- [ ] **Animace a transitions**
  - Plynulé přechody mezi stavy
  - Fade in/out pro toast notifikace
  - Smooth scroll v message listu
  
- [ ] **Accessibility**
  - Keyboard navigation funguje správně
  - Focus states jsou viditelné
  - ARIA labels pro screen readery
  - Color contrast splňuje WCAG 2.1 AA

---

## Testovací Scénáře

### Scénář 1: Úspěšné přihlášení a základní chat

**Předpoklady:**
- Backend je spuštěný na `http://localhost:8000`
- Existuje testovací uživatel (viz sekce Příprava backendu)

**Kroky:**
1. Otevřete aplikaci v prohlížeči (`http://localhost:5173`)
2. Na login stránce zadejte:
   - Username: `test_user`
   - Password: `test_password`
3. Klikněte na "Login" tlačítko
4. **Očekávaný výsledek:** 
   - Přesměrování na chat interface
   - Zobrazení "Connected" status (zelený)
   - Prázdný chat s možností napsat zprávu

5. Napište zprávu: "Ahoj, jak se máš?"
6. Stiskněte Enter nebo klikněte na Send
7. **Očekávaný výsledek:**
   - Zpráva se zobrazí v chatu s vaším avatarem
   - Objeví se "Agent is typing..." indikátor
   - Za cca 1-3 sekundy přijde odpověď od agenta

8. Napište další zprávu: "Jaké je dnes počasí?"
9. **Očekávaný výsledek:**
   - Konverzace pokračuje
   - Všechny zprávy jsou správně časově seřazeny
   - Automatické scrollování na nejnovější zprávu

**Screenshot lokace:**
- `docs/screenshots/scenario-1-login.png` - Login formulář
- `docs/screenshots/scenario-1-chat.png` - Úspěšný chat

---

### Scénář 2: Přihlášení s neplatnými údaji

**Kroky:**
1. Otevřete aplikaci (`http://localhost:5173`)
2. Zadejte neexistující údaje:
   - Username: `neexistujici_uzivatel`
   - Password: `spatne_heslo`
3. Klikněte na "Login"
4. **Očekávaný výsledek:**
   - Toast notifikace: "Invalid credentials"
   - Formulář zůstane zobrazený
   - Heslo pole se nevymaže (security best practice)
   - Žádné přesměrování

5. Zadejte správné username, ale špatné heslo:
   - Username: `test_user`
   - Password: `spatne_heslo`
6. Klikněte na "Login"
7. **Očekávaný výsledek:**
   - Toast notifikace: "Invalid password"
   - Stejné chování jako v kroku 4

**Screenshot lokace:**
- `docs/screenshots/scenario-2-invalid-login.png` - Error stav

---

### Scénář 3: Ztráta WebSocket spojení a auto-reconnect

**Předpoklady:**
- Uživatel je přihlášený a WebSocket je připojený

**Kroky:**
1. V chatu napište zprávu pro ověření, že spojení funguje
2. Zastavte backend server (Ctrl+C v terminálu backendu)
3. **Očekávaný výsledek:**
   - Status indikátor změní barvu na červenou "Disconnected"
   - Toast notifikace: "WebSocket connection lost"
   - Chat input je disabled
   - Tlačítko "Reconnect" se zobrazí

4. Počkejte 5 sekund
5. **Očekávaný výsledek:**
   - Automatický pokus o znovupřipojení
   - Status indikátor: "Reconnecting..." (žlutá)
   - Pokus se opakuje až 5x

6. Spusťte backend znovu
7. **Očekávaný výsledek:**
   - WebSocket se automaticky připojí
   - Status indikátor: "Connected" (zelená)
   - Toast notifikace: "Connection restored"
   - Chat input je opět aktivní

8. Napište testovací zprávu
9. **Očekávaný výsledek:**
   - Zpráva se úspěšně odešle
   - Obdržíte odpověď od agenta

**Screenshot lokace:**
- `docs/screenshots/scenario-3-disconnected.png` - Disconnected stav
- `docs/screenshots/scenario-3-reconnecting.png` - Reconnecting stav
- `docs/screenshots/scenario-3-reconnected.png` - Obnovené spojení

---

### Scénář 4: Práce s více sessions

**Kroky:**
1. V přihlášeném stavu klikněte na "New Chat" tlačítko
2. **Očekávaný výsledek:**
   - Vytvoří se nová session (Session 2)
   - Zobrazí se prázdný chat
   - Session 2 je zvýrazněná v sidebaru

3. Napište zprávu: "Tohle je druhá konverzace"
4. Obdržíte odpověď od agenta
5. Klikněte na první session v sidebaru (Session 1)
6. **Očekávaný výsledek:**
   - Načtou se zprávy z první session
   - Session 1 je nyní zvýrazněná
   - Zprávy jsou chronologicky seřazené

7. Vytvořte další novou session (Session 3)
8. Napište zprávu v Session 3
9. Přepněte zpět na Session 2
10. **Očekávaný výsledek:**
    - Session 2 obsahuje původní zprávy
    - Každá session má svou vlastní historii

11. Klikněte na delete ikonu u Session 2
12. **Očekávaný výsledek:**
    - Potvrzovací dialog: "Are you sure you want to delete this session?"
    - Po potvrzení se session smaže
    - Automatické přepnutí na jinou dostupnou session

**Screenshot lokace:**
- `docs/screenshots/scenario-4-multiple-sessions.png` - Více sessions v sidebaru
- `docs/screenshots/scenario-4-delete-confirm.png` - Delete potvrzení

---

### Scénář 5: Persistence test (refresh stránky)

**Kroky:**
1. Přihlaste se a vytvořte 2-3 sessions s různými zprávami
2. Otevřete DevTools (F12) → Application → Local Storage
3. **Ověřte uložená data:**
   - `mcp_auth_token` - přítomen
   - `mcp_sessions` - obsahuje všechny sessions
   - `mcp_active_session` - ID aktuální session

4. Refreshněte stránku (F5)
5. **Očekávaný výsledek:**
   - Zůstanete přihlášení (žádné přesměrování na login)
   - Všechny sessions se načtou
   - Aktivní session je správně vybrána
   - Zprávy v každé session jsou zachované
   - WebSocket se automaticky připojí

6. Klikněte na Logout
7. Refreshněte stránku
8. **Očekávaný výsledek:**
   - Přesměrování na login stránku
   - LocalStorage je prázdný
   - Žádné sessions nejsou dostupné

**Screenshot lokace:**
- `docs/screenshots/scenario-5-localstorage.png` - DevTools view
- `docs/screenshots/scenario-5-after-refresh.png` - Stav po refreshi

---

### Scénář 6: Testování na mobilním zařízení

**Kroky:**
1. Otevřete DevTools → Toggle device toolbar (Ctrl+Shift+M)
2. Vyberte iPhone 12 Pro (390x844)
3. Refreshněte stránku
4. **Očekávaný výsledek:**
   - Sidebar je skrytý (hamburger menu)
   - Chat interface zabírá celou šířku
   - Login formulář je správně centrovaný

5. Klikněte na hamburger menu ikonu
6. **Očekávaný výsledek:**
   - Sidebar se vysune zleva
   - Overlay pokrývá chat
   - Možnost kliknout mimo pro zavření

7. Vytvořte novou session z mobilního sidebaru
8. Napište a odešlete zprávu
9. **Očekávaný výsledek:**
   - Virtual keyboard nevyvolá layout shift
   - Zpráva se správně zobrazí
   - Scrolling funguje plynule

**Screenshot lokace:**
- `docs/screenshots/scenario-6-mobile-login.png`
- `docs/screenshots/scenario-6-mobile-chat.png`
- `docs/screenshots/scenario-6-mobile-sidebar.png`

---

## Příprava backendu pro testování

### Spuštění backendu

#### Požadavky:
- Python 3.9+
- FastAPI
- WebSocket podpory

#### Kroky:

```bash
# 1. Klonování/navigace do backend repozitáře
cd path/to/mcp-agent-backend

# 2. Vytvoření virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# 3. Instalace závislostí
pip install -r requirements.txt

# 4. Nastavení environment variables (viz níže)

# 5. Spuštění serveru
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Environment Variables:

Vytvořte soubor `.env` v root složce backendu:

```env
# Backend Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true

# Database
DATABASE_URL=sqlite:///./test_database.db

# Security
SECRET_KEY=your-secret-key-min-32-characters-long-for-jwt
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# WebSocket
WS_HEARTBEAT_INTERVAL=30
WS_MESSAGE_QUEUE_SIZE=100

# MCP Configuration
MCP_SERVER_URL=http://localhost:3001
MCP_API_KEY=your-mcp-api-key

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/app.log
```

### Vytvoření testovacího uživatele

#### Metoda 1: Přes API endpoint (pokud existuje registrace)

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "password": "test_password",
    "email": "test@example.com"
  }'
```

#### Metoda 2: Přes Python skript

Vytvořte soubor `create_test_user.py` v backendu:

```python
import sys
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import User
from app.utils.security import get_password_hash

def create_test_user():
    db: Session = SessionLocal()
    try:
        # Zkontrolujte, jestli uživatel již neexistuje
        existing_user = db.query(User).filter(
            User.username == "test_user"
        ).first()
        
        if existing_user:
            print("Test user already exists!")
            return
        
        # Vytvoření testovacího uživatele
        user = User(
            username="test_user",
            email="test@example.com",
            hashed_password=get_password_hash("test_password"),
            is_active=True,
            is_admin=False
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        print(f"Test user created successfully!")
        print(f"Username: test_user")
        print(f"Password: test_password")
        print(f"User ID: {user.id}")
        
    except Exception as e:
        print(f"Error creating test user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
```

Spusťte skript:

```bash
python create_test_user.py
```

#### Metoda 3: API klíč pro testování

Pokud chcete testovat API klíč autentizaci:

```python
# V backendu vytvořte API klíč pro test_user
def create_api_key_for_test_user():
    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(
            User.username == "test_user"
        ).first()
        
        if not user:
            print("Test user not found!")
            return
        
        # Vygenerování API klíče
        api_key = secrets.token_urlsafe(32)
        
        # Uložení do databáze
        user.api_key = api_key
        db.commit()
        
        print(f"API Key for test_user: {api_key}")
        
    finally:
        db.close()
```

### Ověření backendu

Po spuštění backendu ověřte:

```bash
# Health check
curl http://localhost:8000/health

# Expected response:
# {"status": "healthy", "timestamp": "2024-01-01T12:00:00Z"}

# WebSocket endpoint (v prohlížeči nebo pomocí wscat)
wscat -c ws://localhost:8000/ws
```

---

## Běžné problémy a jejich řešení

### 🔴 Problém: Backend není dostupný

**Symptomy:**
- Toast notifikace: "Network Error"
- Login selže s "Failed to fetch"
- Console error: `ERR_CONNECTION_REFUSED`

**Řešení:**

1. **Ověřte, že backend běží:**
   ```bash
   # Zkontrolujte běžící procesy
   netstat -ano | findstr :8000
   
   # Nebo přístup přes curl
   curl http://localhost:8000/health
   ```

2. **Zkontrolujte CORS nastavení:**
   - Backend musí mít v CORS allowed origins: `http://localhost:5173`
   - Zkontrolujte soubor backendu: `main.py` nebo `config.py`

3. **Zkontrolujte API URL ve frontendu:**
   - Soubor: [`src/config/api.config.ts`](src/config/api.config.ts)
   - Ověřte: `API_BASE_URL` odpovídá běžícímu backendu

4. **Firewall/Antivirus:**
   - Dočasně vypněte firewall
   - Přidejte výjimku pro port 8000

---

### 🔴 Problém: WebSocket se nepřipojuje

**Symptomy:**
- Status indikátor trvale "Disconnected" nebo "Reconnecting"
- Console error: `WebSocket connection failed`
- Zprávy nejdou odeslat

**Řešení:**

1. **Zkontrolujte WebSocket URL:**
   ```typescript
   // src/config/api.config.ts
   export const WS_URL = 'ws://localhost:8000/ws'; // Ne 'wss://' pro local
   ```

2. **Ověřte WebSocket endpoint v backendu:**
   ```bash
   # Testování pomocí wscat
   npm install -g wscat
   wscat -c ws://localhost:8000/ws
   ```

3. **Zkontrolujte auth token:**
   - DevTools → Application → Local Storage
   - Klíč: `mcp_auth_token`
   - Musí obsahovat validní JWT token

4. **Backend logy:**
   - Zkontrolujte logy backendu pro WebSocket errors
   - Hledejte: "WebSocket connection rejected" nebo podobné

5. **Proxy/Reverse proxy:**
   - Pokud používáte nginx/Apache, zkontrolujte WebSocket proxy nastavení

---

### 🔴 Problém: Zprávy se neukládají do localStorage

**Symptomy:**
- Po refreshi stránky zmizí zprávy
- Sessions nejsou persistentní
- Console error: `QuotaExceededError`

**Řešení:**

1. **Zkontrolujte localStorage kvótu:**
   ```javascript
   // V browser console
   let total = 0;
   for (let key in localStorage) {
     total += localStorage[key].length;
   }
   console.log(`LocalStorage usage: ${(total / 1024).toFixed(2)} KB`);
   ```

2. **Vymažte localStorage:**
   ```javascript
   // DevTools Console
   localStorage.clear();
   ```
   - Poté se znovu přihlaste

3. **Private/Incognito režim:**
   - Některé prohlížeče omezují localStorage v private mode
   - Zkuste v normálním okně prohlížeče

4. **Zkontrolujte storage service:**
   - Soubor: [`src/services/storageService.ts`](src/services/storageService.ts)
   - Ověřte, že metody `saveMessages()` a `loadMessages()` fungují

---

### 🔴 Problém: Auto-reconnect nefunguje

**Symptomy:**
- Po ztrátě spojení se WebSocket nepřipojí automaticky
- Pouze manuální reconnect funguje

**Řešení:**

1. **Zkontrolujte reconnect logiku:**
   ```typescript
   // src/services/websocketService.ts
   // Ověřte: shouldReconnect, reconnectAttempts, maxReconnectAttempts
   ```

2. **Zvyšte reconnect interval:**
   ```typescript
   // src/utils/constants.ts
   export const WS_RECONNECT_DELAY = 3000; // Zvyšte na 5000ms
   export const WS_MAX_RECONNECT_ATTEMPTS = 10; // Zvyšte počet pokusů
   ```

3. **Browser throttling:**
   - Chrome může throttlovat reconnect pokusy na pozadí
   - Zkuste mít tab aktivní během testování

---

### 🔴 Problém: Markdown se nerenderuje správně

**Symptomy:**
- Kód není zvýrazněný
- Formátování textu nefunguje
- Zprávy jsou plain text

**Řešení:**

1. **Zkontrolujte markdown knihovnu:**
   ```bash
   npm list react-markdown
   # Měla by být nainstalovaná
   ```

2. **Nainstalujte chybějící závislosti:**
   ```bash
   npm install react-markdown remark-gfm rehype-highlight
   ```

3. **Syntax highlighting:**
   ```bash
   npm install highlight.js
   # A importujte CSS v src/main.tsx
   ```

4. **Zkontrolujte Message komponentu:**
   - Soubor: [`src/components/chat/Message.tsx`](src/components/chat/Message.tsx)
   - Ověřte použití ReactMarkdown s pluginy

---

### 🔴 Problém: Přihlášení funguje, ale chat se nezobrazí

**Symptomy:**
- Úspěšný login
- Bílá/prázdná obrazovka místo chatu
- Console error v React

**Řešení:**

1. **Zkontrolujte browser console:**
   - F12 → Console
   - Hledejte React errors nebo warnings

2. **Error Boundary:**
   - Zkontrolujte, zda [`ErrorBoundary`](src/components/common/ErrorBoundary.tsx) nezachytil chybu
   - Měla by zobrazit fallback UI s error detaily

3. **Protected Route:**
   - Soubor: [`src/components/auth/ProtectedRoute.tsx`](src/components/auth/ProtectedRoute.tsx)
   - Ověřte, že autentizace proběhla správně

4. **Zkontrolujte routing:**
   ```typescript
   // src/App.tsx
   // Ověřte správné nastavení routes
   ```

---

### 🔴 Problém: Mobile layout je rozbitý

**Symptomy:**
- Sidebar překrývá chat i po zavření
- Layout shift při otevření keyboard
- Elementy přetékají z obrazovky

**Řešení:**

1. **Zkontrolujte viewport meta tag:**
   ```html
   <!-- index.html -->
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. **Tailwind responsive classes:**
   - Použijte: `md:`, `lg:` prefixy pro breakpointy
   - Zkontrolujte [`tailwind.config.js`](tailwind.config.js)

3. **Sidebar overlay:**
   ```typescript
   // src/components/layout/Sidebar.tsx
   // Ověřte: z-index, position: fixed, backdrop
   ```

4. **Virtual keyboard:**
   - Používejte `vh` units opatrně
   - Zvažte použití `dvh` (dynamic viewport height) pro moderní prohlížeče

---

### 🔴 Problém: Toast notifikace se nezobrazují

**Symptomy:**
- Žádné error/success messages
- Akce proběhnou bez feedbacku

**Řešení:**

1. **Zkontrolujte Toast provider:**
   ```typescript
   // src/App.tsx nebo src/main.tsx
   // Musí být <ToastProvider> wrapper
   ```

2. **Zkontrolujte z-index:**
   ```css
   /* Toast container musí mít vysoký z-index */
   .toast-container {
     z-index: 9999;
   }
   ```

3. **Toast služba:**
   - Ověřte import a použití v komponentách
   - Zkuste manuální trigger v console:
   ```javascript
   toast.success('Test message');
   ```

---

## Automatizované testování (budoucnost)

### Navrhované test cases

#### Unit testy

**Services:**
```typescript
// src/services/__tests__/authService.test.ts
describe('AuthService', () => {
  it('should login with valid credentials', async () => {
    // Test implementation
  });
  
  it('should throw error on invalid credentials', async () => {
    // Test implementation
  });
  
  it('should logout and clear token', () => {
    // Test implementation
  });
});
```

**Stores (Zustand):**
```typescript
// src/stores/__tests__/chatStore.test.ts
describe('ChatStore', () => {
  it('should add message to active session', () => {
    // Test implementation
  });
  
  it('should clear messages on logout', () => {
    // Test implementation
  });
});
```

**Hooks:**
```typescript
// src/hooks/__tests__/useWebSocket.test.ts
describe('useWebSocket', () => {
  it('should connect on mount', () => {
    // Test implementation
  });
  
  it('should reconnect on connection loss', () => {
    // Test implementation
  });
});
```

#### Integration testy

```typescript
// src/__tests__/integration/chat-flow.test.tsx
describe('Chat Flow Integration', () => {
  it('should complete full chat cycle', async () => {
    // 1. Login
    // 2. Connect WebSocket
    // 3. Send message
    // 4. Receive response
    // 5. Verify persistence
  });
});
```

#### E2E testy (Playwright/Cypress)

```typescript
// e2e/chat.spec.ts
describe('MCP Agent Chat E2E', () => {
  it('should login and chat successfully', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.fill('[name="username"]', 'test_user');
    await page.fill('[name="password"]', 'test_password');
    await page.click('button:has-text("Login")');
    
    await page.waitForSelector('[data-testid="chat-container"]');
    await page.fill('[data-testid="message-input"]', 'Hello');
    await page.click('[data-testid="send-button"]');
    
    await page.waitForSelector('[data-testid="assistant-message"]');
    // Assertions...
  });
});
```

### Nástroje a setup

#### 1. Vitest (Unit & Integration)

**Instalace:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event jsdom
```

**Konfigurace (`vite.config.ts`):**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

#### 2. React Testing Library

**Setup soubor (`src/test/setup.ts`):**
```typescript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
```

#### 3. Mock Service Worker (MSW)

Pro mockování API requests:

```bash
npm install -D msw
```

```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.post('http://localhost:8000/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        access_token: 'mock-token',
        user: { id: 1, username: 'test_user' }
      })
    );
  }),
];
```

#### 4. Playwright (E2E)

**Instalace:**
```bash
npm install -D @playwright/test
npx playwright install
```

**Konfigurace (`playwright.config.ts`):**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### CI/CD Pipeline návrh

**GitHub Actions (`.github/workflows/test.yml`):**
```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm run test:unit
        
      - name: Run integration tests
        run: npm run test:integration
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        
  e2e:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright
        run: npx playwright install --with-deps
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### Test coverage cíle

- **Unit testy:** ≥ 80% coverage
- **Integration testy:** Kritické user flows
- **E2E testy:** Happy paths + error scenarios

### Pravidelné testování

**Package.json scripts:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run src/**/*.test.ts",
    "test:integration": "vitest run src/**/*.integration.test.ts",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

---

## Checklist před release

- [ ] Všechny manuální testovací scénáře proběhly úspěšně
- [ ] Unit testy mají ≥80% coverage
- [ ] Integration testy pokrývají main user flows
- [ ] E2E testy prošly na Chrome, Firefox, Safari
- [ ] Mobile responsive testování dokončeno
- [ ] Accessibility audit (Lighthouse score ≥90)
- [ ] Performance testing (load time <3s)
- [ ] Security audit (OWASP top 10)
- [ ] Error handling ověřen ve všech scénářích
- [ ] LocalStorage persistence funguje
- [ ] WebSocket reconnection ověřena
- [ ] Cross-browser compatibility check
- [ ] Documentation je aktuální

---

## Užitečné odkazy

- [React Testing Library - Best Practices](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [WebSocket Testing Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Poslední aktualizace:** 2025-10-03  
**Verze dokumentace:** 1.0  
**Kontakt:** V případě problémů vytvořte issue v GitHub repository