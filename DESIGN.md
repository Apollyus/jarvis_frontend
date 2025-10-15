# Design System - Jarvis Frontend

## 🎨 Barevná paleta

Design aplikace je inspirován moderními chat rozhraními (ChatGPT, NotebookLM) s důrazem na čitelnost a příjemnost pro oči.

### Světlý režim (Light Mode)
- **Pozadí**: `#f9fafb` - Velmi světle šedá (ne čistě bílá)
- **Povrch**: `#ffffff` - Bílá pro karty a panely
- **Povrch (hover)**: `#f3f4f6` - Světle šedá při najetí
- **Ohraničení**: `#e5e7eb` - Jemné šedé ohraničení
- **Text primární**: `#111827` - Téměř černá (ne úplně černá)
- **Text sekundární**: `#6b7280` - Středně šedá
- **Text terciární**: `#9ca3af` - Světle šedá

### Tmavý režim (Dark Mode)
- **Pozadí**: `#1f2937` - Tmavě šedá
- **Povrch**: `#374151` - Středně tmavá
- **Povrch (hover)**: `#4b5563` - Světlejší při najetí
- **Ohraničení**: `#4b5563` - Tmavé ohraničení
- **Text primární**: `#f9fafb` - Téměř bílá
- **Text sekundární**: `#d1d5db` - Světle šedá
- **Text terciární**: `#9ca3af` - Středně šedá

### Primary barvy (Akcent - Zelená)
Inspirováno ChatGPT zeleno-tyrkysovou barvou:
- `--color-primary-500`: `#10b981` - Hlavní akcent
- `--color-primary-600`: `#059669` - Tlačítka, hover
- `--color-primary-700`: `#047857` - Aktivní stavy

### Secondary barvy (Šedá škála)
- `--color-secondary-100` až `--color-secondary-900`
- Používá se pro neutrální prvky, pozadí tlačítek

## 🎯 Jak změnit barvy

Všechny barvy jsou definovány jako CSS proměnné v `src/index.css`:

```css
:root {
  --color-background: #f9fafb;
  --color-surface: #ffffff;
  --color-primary-500: #10b981;
  /* ... další */
}

.dark {
  --color-background: #1f2937;
  /* ... dark mode overrides */
}
```

### Rychlá změna primary barvy
Pro změnu hlavní barvy aplikace upravte tyto proměnné:
- `--color-primary-500` - hlavní barva
- `--color-primary-600` - tlačítka a hover
- `--color-primary-700` - aktivní stavy

### Rychlá změna schématu
Pro úplně jiné barevné schéma upravte hodnoty v `:root` a `.dark` blocích v `index.css`.

## 🧩 Komponenty

### Tlačítka
- **btn-primary**: Zelené tlačítko s hover efektem a shadow
- **btn-secondary**: Šedé neutrální tlačítko

### Input pole
- **input-field**: Zaoblené input pole s focus ring v primary barvě

### Karty
- **card**: Bílá/šedá karta s jemným stínem a hover efektem

## 📐 Layout

### Struktur a
```
┌─────────────┬──────────────────────────────┐
│   Sidebar   │         Chat Header          │
│  (280px)    │  (název, čas, status)        │
│             ├──────────────────────────────┤
│ - Nová      │                              │
│ - Sessions  │      Message List            │
│             │                              │
│             ├──────────────────────────────┤
│ - Theme     │      Chat Input              │
└─────────────┴──────────────────────────────┘
```

### Klíčové prvky

1. **Skrývatelný Sidebar**
   - Šířka: 280px (otevřený) / 0px (zavřený)
   - Obsahuje: Seznam konverzací, tlačítko nové konverzace, theme switcher

2. **Chat Header**
   - Minimalistický design
   - Větší nadpis session (text-2xl)
   - Čas zpracování (malý text pod nadpisem)
   - Connection status vpravo nahoře
   - Tlačítka: Nastavení, Odhlásit

3. **Message List**
   - Centrovaný obsah (max-w-4xl)
   - Avatar pro každou zprávu
   - Jméno (Vy/Asistent) a čas

4. **Chat Input**
   - Centrovaný (max-w-4xl)
   - Velké input pole (min-height: 56px)
   - Kulaté tlačítko odeslat s ikonou
   - Nápověda pod inputem

## ✨ Animace a přechody

- **Easing**: `cubic-bezier(0.2, 0, 0, 1)` - snappy
- **Duration**: 200-300ms pro většinu přechodů
- **Hover efekty**: Subtle scale, background change
- **Scrollbar**: Custom styled, tenký (8px)

## 🌓 Dark Mode

Dark mode se přepíná pomocí třídy `.dark` na root elementu. Všechny komponenty automaticky reagují díky CSS proměnným.

Přepínač je v sidebaru dole jako stylizované tlačítko s ikonami slunce/měsíce.

## 📱 Responsivita

- Sidebar: Skrývatelný na menších obrazovkách
- Chat: Max šířka 4xl pro lepší čitelnost na velkých displejích
- Input: Flexibilní, roste s obsahem (max-height: 160px)

## 🎨 Ikony

Používáme inline SVG ikony s stroke-based designem (podobné Feather Icons):
- Jednoduché, čisté čáry
- Strokewidth: 2
- Konzistentní velikost: 18-24px

## 💡 Tipy

1. **Změna celkového tónu**: Upravte hodnoty v `--color-background` a `--color-surface`
2. **Jiný akcent**: Změňte `--color-primary-*` hodnoty
3. **Více kontrastu**: Upravte `--color-text-primary` na tmavší/světlejší
4. **Vlastní dark mode**: Upravte hodnoty v `.dark` bloku
