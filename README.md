# Morowa 17: Taśma Zerowa

Fanowska gra przeglądarkowa 3D (analog horror, VHS), prywatna. Three.js + Vite. Grafika, dźwięk i głos generowane proceduralnie — bez zewnętrznych mediów.

Jesteś bezimiennym Kamerzystą: nagrywasz sceny przez wizjer i między ujęciami obsługujesz dom. 20 odcinków na dwóch kasetach; postęp zapisuje się w przeglądarce (`localStorage`).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # statyczny build w dist/ (base './', działa z podkatalogu)
```

## Sterowanie
| | |
|---|---|
| PPM / Spacja (trzymaj) | wizjer — nagrywaj |
| LPM | użyj obiektu / wybranego przedmiotu |
| 1–5 | kamery |
| kółko | zoom |
| M | kasety (wybór odcinka) |
| H | legenda sterowania |

Parametry URL: `?ep=tasma1_ep01` (start od odcinka), `?tier=0..2` (wymuszenie jakości grafiki; domyślnie dobierana automatycznie), `?debug` (odblokowuje wszystkie odcinki).
