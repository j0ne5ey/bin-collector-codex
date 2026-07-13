# Operations guide

## First deployment

1. Add the `SBC_POSTCODE` and `SBC_UPRN` Actions secrets.
2. Enable GitHub Pages with GitHub Actions as its source.
3. Manually run **Update collections**.
4. Check that the updater committed a populated `data/collections.json` without the postcode or UPRN.
5. Confirm the **Deploy Pages** workflow completed.
6. Open the Pages URL on the target phone and add it to the home screen.

## Routine operation

The updater runs at minute 17 every six hours. GitHub may delay scheduled workflows during busy periods. Client refresh controls retrieve the latest committed file; they do not trigger a GitHub workflow.

The monthly keepalive workflow updates `.github/last-keepalive`. This creates repository activity before GitHub’s scheduled-workflow inactivity threshold is reached.

## Troubleshooting

### Address setup required

The initial placeholder file is still deployed. Check that both secrets exist and manually run the updater.

### UPRN not returned for postcode

Confirm the postcode and UPRN belong to the same address record. Secrets are whitespace-trimmed, and UPRN must contain digits only.

### No collection events

Open the official council calendar and verify that the selected record contains future events. If it does, the Bartec page structure may have changed and `scripts/fetch-collections.mjs` will need updating.

### Home-screen app looks stale

Use the footer refresh button, then fully close and reopen the home-screen app. If an app-shell change is still cached, increment the cache name in `service-worker.js`.

### Scheduled updater stopped

Run either scheduled workflow manually and inspect repository Actions permissions. The workflow requires permission to write repository contents.
