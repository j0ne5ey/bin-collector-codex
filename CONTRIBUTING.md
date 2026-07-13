# Contributing

## Development workflow

1. Create a focused branch from `main`.
2. Run `npm install` and `npm test`.
3. Serve the root directory and test at a narrow mobile viewport.
4. Do not commit a real postcode, UPRN, full residential address, or captured council session data.
5. Update `CHANGELOG.md` for user-visible changes.

## Pull requests

Describe the user outcome, testing performed, and any effect on the council data contract. Include screenshots for visual changes, but ensure they contain no private address information.

Changes to the updater must preserve the rule that an empty or invalid upstream response cannot overwrite the last known valid schedule.
