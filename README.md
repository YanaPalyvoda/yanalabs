# YanaLabs — Site Web

Copie fidèle du site [YanaLabs](https://breathtaking-ones-036619.framer.app), réalisée en HTML/CSS/JS vanilla.

## Structure du projet

```
yanalabs/
├── index.html          ← Page principale (toutes les sections)
├── css/
│   └── style.css       ← Styles complets (variables, layout, responsive)
├── js/
│   └── main.js         ← Interactions (navbar, accordion, scroll reveal, formulaires)
└── README.md
```

## Fonctionnalités

- **Navigation sticky** avec effet glassmorphism, liens ancres, CTA gradient
- **Menu hamburger** responsive (mobile)
- **Hero** avec gradients radiaux animés et badges flottants
- **Notre démarche** — 6 étapes en grille responsive avec scroll reveal
- **Features** — 3 sections alternées (workflow animé, dashboard, grille outils)
- **Formulaire de contact** avec validation et feedback visuel
- **À propos** avec photo et effets de survol
- **FAQ** accordéon interactif
- **Newsletter** avec formulaire inline
- **Footer** complet

## Palette de couleurs

| Variable                | Valeur                        |
|-------------------------|-------------------------------|
| `--color-primary`       | `rgb(87, 62, 105)`            |
| `--color-secondary`     | `rgb(72, 57, 83)`             |
| `--color-accent`        | `rgb(125, 95, 146)`           |
| `--gradient-accent`     | Violet → Lilas → Mauve        |
| `--color-cta-purple`    | `rgb(168, 85, 247)`           |

## Typographie

- **Police** : Onest (Google Fonts) — weights 400, 500, 600, 700
- **H1 Hero** : 62px desktop / 48px tablette / 36px mobile
- **H2 sections** : 48–64px
- **Corps** : 15–18px

## Technologies

- HTML5 sémantique
- CSS3 (variables, grid, flexbox, animations, `@keyframes`)
- JavaScript ES6 vanilla (pas de framework)
- Google Fonts (Onest)
- Images CDN Framer (chargées directement)

## Utilisation

Ouvrir `index.html` dans un navigateur moderne — aucune dépendance à installer.

Pour un déploiement en production, héberger les 3 fichiers sur n'importe quel hébergeur statique (Netlify, Vercel, GitHub Pages…).

---

© 2025 YanaLabs. Tous droits réservés.
