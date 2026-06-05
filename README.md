# 🍷 Registro Cantina · Weingut Loacker (WL)

App web per la registrazione dei lavori in cantina al **Weingut Loacker**.

**URL pubblico** → https://loackerwineestates.github.io/registro-cantina-WL/

## Cos'è

Mobile-first PWA (Progressive Web App) che gira nel browser, installabile su iPhone e Android come una vera app. Funziona anche offline grazie al service worker. Le registrazioni vengono salvate localmente nel telefono e sincronizzate al **Google Sheet** centrale con un tap.

## Funzionalità principali

- **Registrazione operazioni** in cantina (travasi, scarichi, aggiunte, ecc.) con 32 codici operazione e 19 stati di lavorazione
- **Picker vasche** con tutte le 193 vasche Loacker, filtri per ubicazione e tipo, badge di stato (vuota/scolma/piena)
- **Wizard codice origine** per la composizione guidata dei codici interni Loacker
- **Aggregato multi-vasca**: quando si scaricano più vasche, vino/annata/codice origine vengono calcolati automaticamente dal mix (dominante per quantità, codici aggregati per famiglia con percentuali)
- **Tabella di taratura geometrica** per 56 vasche: bottone 📏 calcola altezza↔volume in tempo reale durante il carico (formule per 5 forme: cilindro verticale, parallelepipedo, cilindro orizzontale, tronco di cono verticale, cilindro semprepieno)
- **Tab Giacenza** con stato real-time della cantina, calcolato dal log
- **Tab Storico** con filtro per data e ordine cronologico decrescente
- **Sincronizzazione bidirezionale** con il Google Sheet condiviso (anche cancellazioni cross-device)
- **Email di notifica** automatica a ogni nuova registrazione e cancellazione
- **Modifica e cancellazione** propagate al cloud
- **Backup JSON** locale e ripristino in qualsiasi momento
- **Indicatore sync** delle geometrie sempre visibile nell'header

## Struttura repository

| File | Cosa contiene |
|---|---|
| `index.html` | L'app completa (HTML + CSS + JS in un unico file) |
| `sw.js` | Service worker per il caching offline |
| `manifest.json` | PWA manifest (icona, colori, nome installazione) |
| `README.md` | Questo file |

## Backend

Il backend è un **Google Apps Script** deployato come Web App che riceve POST JSON dall'app e scrive sul Google Sheet "Registro Cantina WL". Endpoint disponibili:

- `POST /` (default) → inserisce nuove registrazioni
- `POST { action: 'delete', ids }` → cancella per id, con email audit
- `POST { action: 'updateGeometria', vasca, fields }` → aggiorna geometria vasca
- `GET ?action=list` → scarica tutte le registrazioni
- `GET ?action=geometrie` → scarica le 56 geometrie vasche

Sorgente del `Code.gs` nel Drive interno Loacker, file locale `Code-WL.gs`.

## Architettura multi-cantina

Questo repository ospita la versione **Weingut Loacker (WL)**.  
Le altre cantine del gruppo hanno repository paralleli:

- `registro-cantina-WL` (questo) → Weingut Loacker
- `registro-cantina-CP` → Corte Pavone *(in arrivo)*
- `registro-cantina-VF` → Valdifalco *(in arrivo)*

I 9 dataset specifici per cantina (vasche, linee prodotti, vitigni, unità produttive, campi/vigneti, operatori, email notifiche, nome PWA, theme color) sono marcati nel codice con commenti `// === CANTINA-DATA:WL:<NOME>:START/END ===` per facilitarne la sostituzione tra le varianti.

## Aggiornamenti

Per aggiornare l'app:

1. Modifica `index.html` (sorgente in `registro-cantina-WL.html` locale)
2. Incrementa `CACHE_VERSION` in `sw.js` (es. `rc-v2` → `rc-v3`)
3. Commit
4. Sui telefoni: chiudi e riapri l'app per scaricare la nuova versione

## Contatti

Manutenzione e modifiche: **Hayo Loacker** · hayolo@cker.it
