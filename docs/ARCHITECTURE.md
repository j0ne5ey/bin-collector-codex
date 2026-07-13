# Architecture

```text
SBC Bartec calendar
        │ scheduled browser lookup (postcode + UPRN secrets)
        ▼
GitHub Actions updater
        │ validates and normalises
        ▼
data/collections.json
        │ commit triggers Pages deployment
        ▼
Static PWA on GitHub Pages
        │ network-first schedule, offline app shell
        ▼
Resident's phone
```

## Components

- `scripts/fetch-collections.mjs` follows the live council postcode and UPRN selection flow with a headless browser. It extracts Syncfusion schedule events, normalises names and dates, rejects an empty update, and writes public collection information only.
- `data/collections.json` is the app’s small, generated data contract. It contains collection type, display name, date, source, and update time. It never includes the postcode, UPRN, or selected address.
- `lib/schedule.mjs` owns deterministic council-time filtering, grouping, and date labels.
- `app.js` renders the two collection days and controls refresh interactions.
- `service-worker.js` caches the app shell and treats the collection JSON as network-first data.
- GitHub Actions update the schedule, protect scheduled activity, test the code, and deploy the static site.

## Failure behaviour

An empty or invalid upstream response causes the updater to fail before writing. The prior JSON remains in the repository and the deployed app continues to display it. A client refresh failure leaves the current DOM in place and presents an error status.
