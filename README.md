# Bin Collection

Bin Collection is an installable, mobile-first web app that shows the next two household bin collection days for one Scottish Borders address. It is designed for GitHub Pages and updates itself from the Scottish Borders Council collection calendar.

## What it does

- Shows the imminent collection and the following collection, grouping bins collected on the same day.
- Removes a collection at midday on collection day, using the `Europe/London` time zone.
- Refreshes from a visible footer button or a pull gesture with down, up, and refresh indicators.
- Works as a Progressive Web App with offline app-shell support and installable icons.
- Refreshes council data every six hours with GitHub Actions.
- Keeps the scheduled workflow active with a monthly repository activity safeguard.
- Keeps the postcode and UPRN in GitHub Actions secrets rather than publishing them in source code.

This is an independent helper and is not affiliated with or endorsed by Scottish Borders Council.

## Set up your address

1. In the GitHub repository, open **Settings → Secrets and variables → Actions**.
2. Add a secret named `SBC_POSTCODE` containing the real postcode.
3. Add a secret named `SBC_UPRN` containing the neighbour UPRN that has the complete collection data.
4. Open **Actions → Update collections → Run workflow**.
5. Confirm that `data/collections.json` is updated by the workflow.

The updater verifies that the UPRN is returned for the configured postcode. It never writes the postcode or UPRN into the public JSON file.

## Publish with GitHub Pages

In **Settings → Pages**, set the source to **GitHub Actions**. A push to `main` will run the Pages deployment workflow. The app supports project-site paths, so it works at URLs such as `https://username.github.io/repository-name/`.

## Local development

```bash
npm install
npm test
npm run serve
```

Open `http://localhost:4173`. Until the address workflow runs, the app deliberately displays its setup state instead of showing invented collection dates.

To test the live updater locally:

```bash
npx playwright install chromium
SBC_POSTCODE="YOUR POSTCODE" SBC_UPRN="YOUR UPRN" npm run fetch
```

## Data reliability

The updater reads the live calendar used by [Scottish Borders Council](https://www.scotborders.gov.uk/bincollections). If the source returns no events or changes incompatibly, the workflow fails and preserves the last known schedule. The app’s refresh controls reload the latest published JSON; they do not send a residential identifier from the phone to the council portal.

## Project documents

- [Requirements](docs/REQUIREMENTS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Operations guide](docs/OPERATIONS.md)
- [Changelog](CHANGELOG.md)
- [Contributing](CONTRIBUTING.md)

## Licence

No licence has been granted yet. Add a licence before accepting third-party contributions or redistributing the project.
