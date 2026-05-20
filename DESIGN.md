# Saju ETF Service — Design Reference

Selected Refero style: Pirsch Analytics — Warm, grounded analytics

Source: https://styles.refero.design/style/e4b9d41a-8165-47dd-818a-5f6810046ea9

## Why This Style

The target audience is Korean users in their 50s who need a calm, readable, trustworthy financial guidance interface. This style uses a bright canvas, soft warm surfaces, clear black text, and restrained yellow/green accents, which fits an advisory product better than a dark trading dashboard or a trendy crypto-like visual system.

## Applied Direction

- Use a light canvas with warm card surfaces.
- Keep typography large, direct, and highly legible.
- Use yellow for the primary action and green for positive recommendation cues.
- Avoid heavy shadows, dense dashboards, and dark backgrounds.
- Use rounded grouped panels with generous spacing.
- Present recommendation output as simple buckets, not noisy market screens.

## Tokens

```css
:root {
  --color-ink: #000000;
  --color-muted: #707070;
  --color-card: #f8f5ed;
  --color-yellow: #ffda6e;
  --color-green: #6ece9d;
  --surface-canvas: #ffffff;
  --radius-input: 6px;
  --radius-button: 12px;
  --radius-card: 24px;
  --space-8: 8px;
  --space-16: 16px;
  --space-24: 24px;
  --space-32: 32px;
  --space-48: 48px;
}
```

## Korean Adaptation

Refero's source style uses DM Sans. For Korean readability, the app uses Pretendard, Noto Sans KR, Apple SD Gothic Neo, and system sans-serif fallbacks while preserving the same weight, spacing, and calm interface structure.

