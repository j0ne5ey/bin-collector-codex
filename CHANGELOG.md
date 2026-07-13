# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project intends to use semantic versioning.

## [Unreleased]

### Fixed

- Preserve SBC collection dates in the `Europe/London` time zone instead of shifting every BST event to the preceding UTC date.

## [1.0.1] - 2026-07-13

### Changed

- Replaced the provisional branding with the supplied high-fidelity Bin Collection logo.
- Applied the specified Space Grotesk wordmark, OKLCH palette, compact header lockup, and 5% corner watermark.
- Regenerated the favicon, Apple touch icon, standard PWA icons, and maskable icon from the supplied vector geometry.
- Bumped the offline app-shell cache so installed copies receive the new identity immediately.

## [1.0.0] - 2026-07-13

### Added

- Mobile-first, installable collection PWA for GitHub Pages.
- Primary “next collection” card and emphasised “then” card.
- Grouping for multiple bin types collected on the same date.
- Midday collection-day expiry in the `Europe/London` time zone.
- Pull-to-refresh interaction with down, up, and refresh symbols.
- Footer refresh button positioned inside the minimum viewport layout.
- Original full lockup, bin icon tiles, subtle circular backdrop, and PWA icons.
- Scheduled SBC Bartec calendar updater using private GitHub secrets.
- GitHub Pages deployment and scheduled-workflow keepalive safeguards.
- Offline app shell, updater failure preservation, automated tests, and project documentation.

[Unreleased]: https://github.com/OWNER/REPOSITORY/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/OWNER/REPOSITORY/releases/tag/v1.0.0
