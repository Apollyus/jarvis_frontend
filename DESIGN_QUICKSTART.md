# 🎨 Design Quick Start

## Jak rychle změnit barvy v celé aplikaci

Všechny barvy jsou v souboru `src/index.css` - stačí upravit CSS proměnné!

### 1️⃣ Změna hlavní barvy (Primary)

```css
/* V src/index.css najděte: */
--color-primary-500: #10b981;  /* Změňte tuto hodnotu */
--color-primary-600: #059669;  /* A tuto */
--color-primary-700: #047857;  /* A tuto */
```

**Příklad - Modrá:**
```css
--color-primary-500: #3b82f6;
--color-primary-600: #2563eb;
--color-primary-700: #1d4ed8;
```

**Příklad - Fialová:**
```css
--color-primary-500: #8b5cf6;
--color-primary-600: #7c3aed;
--color-primary-700: #6d28d9;
```

### 2️⃣ Změna pozadí (Světlý režim)

```css
:root {
  --color-background: #f9fafb;  /* Hlavní pozadí */
  --color-surface: #ffffff;      /* Karty, sidebar */
}
```

### 3️⃣ Změna pozadí (Tmavý režim)

```css
.dark {
  --color-background: #1f2937;  /* Hlavní pozadí */
  --color-surface: #374151;      /* Karty, sidebar */
}
```

### 4️⃣ Změna textu

```css
:root {
  --color-text-primary: #111827;    /* Hlavní text */
  --color-text-secondary: #6b7280;  /* Sekundární text */
}

.dark {
  --color-text-primary: #f9fafb;    /* Hlavní text */
  --color-text-secondary: #d1d5db;  /* Sekundární text */
}
```

## 🎯 Předpřipravená barevná schémata

### ChatGPT styl (aktuální)
```css
--color-primary-500: #10b981; /* Zelená */
--color-background: #f9fafb;
```

### Notion styl
```css
--color-primary-500: #2563eb; /* Modrá */
--color-background: #ffffff;
```

### GitHub styl
```css
--color-primary-500: #0969da; /* GitHub modrá */
--color-background: #f6f8fa;
```

### Discord styl
```css
--color-primary-500: #5865f2; /* Discord fialová */
--color-background: #36393f; /* Tmavší */
```

## 📝 Kde najít co

| Co chcete změnit | Kde to je |
|------------------|-----------|
| Barvy | `src/index.css` - CSS proměnné |
| Tlačítka | `src/index.css` - `.btn-primary`, `.btn-secondary` |
| Input pole | `src/index.css` - `.input-field` |
| Layout | `src/components/layout/` |
| Chat zprávy | `src/components/chat/Message.tsx` |
| Sidebar | `src/components/layout/Sidebar.tsx` |

## 🚀 Hot reload

Aplikace automaticky aktualizuje změny v CSS! Prostě:
1. Otevřete `src/index.css`
2. Změňte hodnotu CSS proměnné
3. Uložte (Ctrl+S)
4. Změna se okamžitě projeví v browseru

## 💡 Tip

Chcete vyzkoušet barvy? Použijte DevTools:
1. Otevřete DevTools (F12)
2. Najděte element
3. V Styles najděte `var(--color-primary-500)`
4. Změňte hodnotu proměnné v `:root`
5. Uvidíte změnu okamžitě!
