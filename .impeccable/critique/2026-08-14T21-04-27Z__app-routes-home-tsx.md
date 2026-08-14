---
target: critique - noch eine Runde (extern verbessert)
total_score: 25
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
timestamp: 2026-08-14T21-04-27Z
slug: app-routes-home-tsx
---
Method: dual-agent (A: critique_design · B: critique_detector)

# Ferramenta homepage critique — Runde 2 (nach externen Verbesserungen)

## Design Health Score

| # | Heuristik | Score | Key Issue |
|---|---|---|---|
| 1 | Systemstatus | 3 | Anker-Sprung verschluckt Ziel-Überschrift |
| 2 | Match System/Welt | 4 | Hardware-Metapher lückenlos; „Hunspell oracle" einziges Insider-Wort |
| 3 | Kontrolle & Freiheit | 3 | „Compare the tools" teleportiert ~4000px, Ziel verdeckt |
| 4 | Konsistenz & Standards | 3 | Doppelte CTA-Labels, ferrugo-Duplikat, Partner-h2 auf voller Größe |
| 5 | Fehlerprävention | 2 | scroll-margin-top 0 bei 66px Sticky-Header; externe Ziele unmarkiert |
| 6 | Wiedererkennen | 4 | Alles gelabelt |
| 7 | Flexibilität | n/a | Persuade ohne Wiederkehr-Workflow |
| 8 | Ästhetik & Minimalismus | 3 | 9 Interaktiva im Hero, 7 Datenpunkte je Reihe |
| 9 | Fehler-Recovery | 3 | Nur die Anker-Falle |
| 10 | Hilfe & Doku | n/a | Tiefe auf Projektseiten |
| **Total** | | **25/32** | Good (78%) |

## Spezifität

Nicht übertragbar — größte Stärke. CLI-Scan clean (0). Overlay: 34 Treffer, Kontrast-Treffer = Messartefakte (Gradient/Textur-Hintergründe; canvas-aufgelöst 6.2:1–17.4:1 in beiden Themes), echt: 21× Kleinstschrift.

## Vorrunde verifiziert erledigt

Flyout mobil bündig (0px Überstand), Header-Targets 44×44, ARIA sauber (0 Findings über img/Links/SVGs), 3-Stufen-Theme korrekt gelabelt.

## Priority Issues

- [P1] Anker-Sprung: section[id] ohne scroll-margin-top bei 66px Sticky-Header — trifft „Browse the tools" UND „Compare the tools". Fix: eine CSS-Zeile.
- [P1] Fokus-Ring 2.83:1 im Light-Theme (Ember auf hell; 1.4.11 will 3:1). Fix: Light-Fokus auf --rust oder Zwei-Farb-Ring.
- [P2] Kleinstschriften 10.56px (7 Flyout-Untertitel) + 10.88px (14 Contract/Evidence/Purpose-Labels) → auf 12–13px.
- [P2] Ledger-Reihen ohne Tap-Affordance mobil; .go-Pfeil 1.42:1, <40rem entfernt.
- [P2] Evidence nicht klickbar; keine Lizenzzeile; registries ungerendert (Morgan-Blocker).
- [P2] Partner-h2-Spezifitäts-Bug: 54px statt 32px (auch im Comp). Fix: :where()-Wrapper.
- [P3] ferrugo: Purpose dupliziert Job-Zeile wortgleich (kein compat-Feld).

## Persona-Red-Flags

Jordan: erster Klick verdeckt; Alpha-Tools landen auf nackten Repos. Riley: Fokus-Ring <3:1; 11 Tab-Stops vor Inhalt, kein Skip-Link; font-display block. Casey: 9.549px mobil; Reihen ohne Tap-Signal; 10.6px-Sublabels. Morgan: kein klickbarer Beweis, keine Lizenz, keine Release-Daten; registries im Modell, aber unsichtbar.

## Minor

Board 3/3/1 vs. Gruppenlogik 3/2/2; Flyout ungruppiert; kein og:image; x-design-contract-Script im Prod-Markup; DESIGN.md-Hover-Lift nicht implementiert; GitHub-CTAs zielen auf Org (Familie geht unter 16+ Projekten unter); Flyout-Schatten + Pull-Quote-Leading = gewollte Welt-Entscheidungen (Overlay-False-Positives by design).

## Fragen

1. Poliert ihr nach Auge oder nach Hand (0,0px-Schrauben vs. 66px-Fehlsprung)?
2. Wäre eine klickbare Differential-Suite nicht mehr wert als weitere Copy?
3. Pegboard: Navigation oder Ikonografie — und wo bleibt die Gruppenlogik?
4. Brauchen die Alpha-Tools Mini-Landings statt Repo-Absprung?
