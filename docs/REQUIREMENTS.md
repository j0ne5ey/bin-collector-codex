# Requirements

## Product goal

Provide a single-purpose mobile experience that tells the resident which bins are next, and when, without requiring repeated postcode searches on the council website.

## Functional requirements

| ID | Requirement | Implementation |
|---|---|---|
| FR-01 | Automatically retrieve collection data for a configured Scottish Borders address. | Scheduled GitHub Action uses the SBC Bartec calendar and private postcode/UPRN secrets. |
| FR-02 | Show the next collection day and date prominently. | Primary dark collection card. |
| FR-03 | Show the following collection with meaningful emphasis. | Larger secondary card with gold accent and icon tile. |
| FR-04 | Remove a collection after midday on its collection day. | Council-time filtering in `lib/schedule.mjs`. |
| FR-05 | Refresh with a pull gesture. | Touch gesture uses down, up, and rotating refresh symbols. |
| FR-06 | Provide an always-visible conventional refresh control near the bottom. | Footer refresh button remains inside the app’s minimum viewport layout. |
| FR-07 | Support installation as a mobile app. | Web app manifest, icons, service worker, and Apple metadata. |
| FR-08 | Continue scheduled operation on repositories affected by inactivity disabling. | Monthly keepalive workflow creates repository activity. |
| FR-09 | Document notable changes. | `CHANGELOG.md`. |

## Non-functional requirements

- Address identifiers must not be committed to the public app or its generated data.
- The last valid collection file must be preserved when an update fails.
- The app must remain usable on narrow mobile screens and respect safe-area insets.
- Status and refresh state must be exposed as text, not colour alone.
- Animations must respect `prefers-reduced-motion`.
- The app must work from a GitHub Pages project subdirectory.

## Inputs still required

- `SBC_POSTCODE`: the user’s actual postcode.
- `SBC_UPRN`: the confirmed neighbour UPRN whose council record has complete data.

The historic design handoff is not present in this workspace. The current visual system therefore implements the described full lockup, icon tiles, and subtle waste/recycling backdrop as original project artwork rather than claiming to reproduce unavailable geometry.
