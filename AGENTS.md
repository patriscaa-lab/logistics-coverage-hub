# Logistics Coverage Hub — Codex Handoff

## Goal
Build and maintain an internal Logistics Coverage Hub for PT Prasetia Dwidharma's Logistics team. The app is intended for daily operational use, not as a public demo.

## Current architecture decision
- Production app: Google Apps Script Web App.
- Source of truth: Google Sheet `Logistics Coverage Hub - Central Master`.
- GitHub Pages is not the production app and must not be the user-facing operational URL.
- User-facing URL must not contain the user's personal name or GitHub branding.
- Preferred final URL: a branded custom domain/subdomain such as `logistics.prasetia.co.id` or another company-controlled domain.
- Google Apps Script remains the backend/frontend runtime unless explicitly changed later.

## Data model / source sheets
The Central Master contains at least:
- `Vendor Master`
- `Route & Rate Master`
- `Approved Rate Audit`
- `Data Quality`

Do not alter approved rates unless explicitly instructed. Preserve source values exactly; do not recalculate or round approved commercial values.

## Security rules
- Never expose KHS/rate columns to the browser unless the user explicitly asks for a role-based internal view.
- Public/static repositories must not contain vendor master snapshots, route snapshots, PIC contacts, phone numbers, email addresses, addresses, or commercial rates.
- Apps Script may read full Sheet data server-side, but client responses should be sanitized.
- Vendor names, capability, coverage, lead time, and operational status may be shown in the internal app.
- PIC/contact details are internal-only.
- Production should be restricted to the Logistics team as tightly as the available Google account/workspace configuration allows.

## Core product functions
1. Interactive Indonesia coverage map.
2. Search route: Origin → Destination.
3. Compare vendors.
4. Vendor detail.
5. Vendor directory/master data view.
6. Coverage gap insight / dashboard.
7. Distance estimate in km for selected routes.

## Search result behavior
For a route such as `Jakarta → Surabaya`, show vendors that have confirmed route evidence and display:
- Vendor name.
- Mode/service.
- Vehicle/armada.
- Lead time.
- Commercial readiness status.
- Distance estimate.

Do not show rates by default.

## Vendor capability vs commercial status
Do not require a KHS or price for a vendor to appear in the Vendor Directory.

Keep these concepts separate:
1. Capability — what the vendor does.
2. Coverage — where the vendor serves.
3. Commercial/KHS — whether a contract/quotation/negotiation exists.

Preferred commercial labels:
- `Available & Contracted`
- `Available — Partial Contract`
- `Available — Rate Pending`
- `Quotation Only`

Avoid using vague `Not Approved` labels in the UI when a clearer operational label is possible.

## Vendor grouping and status
Default Vendor List should focus on `Ekspedisi / Transport`.

Group filters:
- Ekspedisi / Transport
- Asuransi & Support
- Internal / Self Pickup / Mitra
- Semua Kelompok

Status filters:
- Semua Status
- Aktif
- Freeze
- Belum Pernah Kerja Sama
- Tidak Aktif

Asuransi, Mobil Operasional, customer/self pickup, implementation partners, and material-sale entities must not be mixed into normal route-search results unless they are genuinely transport providers for that route.

## Vendor List UX
- Vertical list/table, one vendor per row.
- Do not use dense multi-column cards for 100+ vendors.
- Font must be eye-friendly; avoid tiny 7–9 px body text.
- Target body/table text around 13–14 px on desktop.
- Table header must have its own row and stay sticky at top of the table container.
- Recommended columns:
  - Vendor
  - Status
  - Kelompok
  - Layanan
  - Base / Branch
  - Cakupan Area
  - KHS
  - Aksi
- `Base / Branch` and `Cakupan Area` are separate fields. Do not merge them.
- If `Cakupan Area` is blank, say `Belum diisi di Vendor Master`; do not infer that the vendor has no coverage.

## Visual direction
The user wants a polished internal logistics product, not a plain prototype.

Home/dashboard should feel like a professional logistics portal:
- Sidebar navigation only; do not duplicate the same navigation in the top bar.
- Top bar should contain branding, search/profile utilities only.
- KPI cards at the top.
- Large Indonesia map as the visual hero.
- Coverage density visualized by color/markers.
- Route search panel.
- Vendor result cards/list.
- City detail / coverage insight panel.
- Strong visual hierarchy, generous spacing, readable typography, blue/navy corporate palette.

## Map behavior
- Use real geographic map data, not schematic island shapes.
- Show coverage markers/density based on actual data only.
- Do not fabricate coverage for vendors with missing structured `Cakupan Area`/route evidence.
- Selected origin and destination should be visually distinct.
- Show route line and estimated km where possible.

## Current data-quality reality
Not every Vendor Master record has structured coverage information. The UI must make missing coverage data visible instead of inventing it.

Confirmed route evidence currently exists for only a subset of vendors; the Vendor Directory should still show non-contract/non-KHS vendors based on capability/status data.

## Google Apps Script implementation expectations
- `Code.gs` reads Central Master server-side.
- `Index.html` is the internal UI.
- Provide a Refresh Data action so updates in the Central Master can be re-read without rebuilding a static snapshot.
- Avoid sending rate fields to client JavaScript.
- Prefer server-side filtering/aggregation for sensitive data when practical.

## Naming / branding
Use `Logistics Coverage Hub` as the product name.
Do not use the user's personal GitHub username in the operational brand or final user-facing URL.
Do not present GitHub Pages as the production solution.

## Working style
- Keep changes incremental and testable.
- Do not change approved prices during UI/data migrations.
- When modifying route data, preserve the origin + destination model; do not infer routes from destination alone.
- Highlight data-quality weaknesses rather than silently filling gaps with guesses.
