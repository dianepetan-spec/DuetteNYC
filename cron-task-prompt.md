# DuetteNYC Competitor Dashboard — Weekly Refresh Task

You are running the Monday morning refresh of the DuetteNYC competitor intelligence dashboard.

## What this task does

1. Refresh weekly fields for 16 competitor brands
2. Snapshot the result to `history/competitors-YYYY-MM-DD.json`
3. Commit and push to GitHub — Netlify auto-deploys within ~2 minutes
4. Send a summary notification with the biggest week-over-week changes and SEO alerts

## Repo and paths

- **GitHub repo**: `github.com/dianepetan-spec/DuetteNYC` (branch `main`)
- **Local workspace**: The repo may not exist yet in this sandbox. If `/home/user/workspace/duette-dash` is missing, clone it: `cd /home/user/workspace && git clone https://github.com/dianepetan-spec/DuetteNYC.git duette-dash` (use `api_credentials=["github"]` on the git push, but clone works without auth).
- **Data files**:
  - `client/public/competitors.json` — top-level array of 16 brand objects
  - `client/public/competitors-meta.json` — companion with `lastUpdated`, `duetteGscBaseline`, `seoOpportunities`
  - `history/competitors-YYYY-MM-DD.json` — dated snapshot per weekly run
- **Live dashboard**: https://duettenyccompetitoranalysis.netlify.app

## The 16 brands (order matters — matches JSON row order)

| # | id | Name | Tier | URL | Notes |
|---|---|---|---|---|---|
| 1 | duettenyc | DuetteNYC | self | duettenyc.com | Ours |
| 2 | lysse | Lyssé | 1 | lysse.com | |
| 3 | spanx | Spanx | 2 | spanx.com | |
| 4 | eileen-fisher | Eileen Fisher | 3 | eileenfisher.com | |
| 5 | jcrew | J.Crew | 3 | jcrew.com | |
| 6 | ann-taylor | Ann Taylor | 3 | anntaylor.com | PDPs often PerimeterX-blocked |
| 7 | theory | Theory | 2 | theory.com | |
| 8 | commando | Commando | 2 | wearcommando.com | |
| 9 | vince | Vince | 3 | vince.com | |
| 10 | helmut-lang | Helmut Lang | 3 | helmutlang.com | |
| 11 | wardrobe-nyc | Wardrobe.NYC | 3 | wardrobe.nyc | |
| 12 | wolford | Wolford | 3 | us.wolford.com (hero), wolford.com (traffic) | |
| 13 | ripley-rader | Ripley Rader | 1 | ripleyrader.com | |
| 14 | ayr | AYR | 1 | ayr.com | Pants/bottoms only |
| 15 | blackstrad | Blackstrad | 1 | blackstrad.com | Concert black for musicians |
| 16 | quince | Quince | 1 | quince.com | Pants/bottoms only |

**Tier meaning**: Tier 1 = same product, same buyer. Tier 2 = pricing/SERP reference. Tier 3 = positioning only.

## Fields to refresh WEEKLY (change on every run)

For each brand, refresh these fields from its current homepage + hero PDP:

- `heroProductUrl` — URL of the featured/first-position pants or bottom
- `heroProductName` — product name
- `heroProductPrice` — price with currency, e.g. "$128"
- `priceRange` — brand's core pants price range, e.g. "$98–$168"
- `reviewCount` — integer count of reviews on hero PDP (null if no widget)
- `rating` — average rating out of 5 (null if not shown)
- `hasBestseller` — boolean: is a bestseller/top-seller badge shown?
- `heroHeadline` — current homepage hero headline
- `heroCta` — current hero CTA button text
- `promoOffer` — active promo bar or banner text (null if none)
- `trustSignals` — array of visible trust signals (e.g. ["Free shipping", "Free returns", "150k+ reviews"])
- `seoKeywords` — array of 3-6 keywords the hero PDP + homepage target (based on title/H1/meta)
- `monthlyVisits` — from Similarweb (or Semrush if connected)
- `authorityScore` — from Semrush if connected, else Similarweb Global Rank
- `globalRank` — Similarweb global rank
- `usRank` — Similarweb US rank
- `conversionScore` — 1-10 score based on trust signals, promo clarity, PDP quality, review social proof
- `weekChange` — short natural-language note on what changed vs last week (e.g. "New Fall promo bar", "No change", "Hero product swapped to The Marlow")
- `notes` — any caveat (blocked, out of stock, etc.)
- `lastUpdated` — today's date in YYYY-MM-DD

## Fields to KEEP as-is unless it's a quarterly review

Do NOT change these on the weekly run (copy them forward from the previous JSON):

- `segment`, `garmentFocus`, `targetCustomer`, `annualRevenue`, `priceTier`
- `marketingStrategy`, `primaryChannels`, `bestPractices`, `replicableInsights`
- `hasSustainability`, `hasPetiteTall`
- `tier`

## Execution steps

1. **Ensure repo is present**:
   ```bash
   [ -d /home/user/workspace/duette-dash ] || git clone https://github.com/dianepetan-spec/DuetteNYC.git /home/user/workspace/duette-dash
   cd /home/user/workspace/duette-dash && git pull origin main
   ```

2. **Read the previous week's JSON** (`client/public/competitors.json`) to preserve static fields.

3. **Research the weekly fields for all 16 brands.** Use `pplx_sdk.content.fetch(urls, prompt="...")` in batches to pull homepage + hero PDP + Similarweb data. Preserve source URLs for each value.

4. **Build the new competitors.json** in-place. Write the top-level array of 16 brand objects, preserving order.

5. **Update `competitors-meta.json`** — bump `lastUpdated` to today; leave `duetteGscBaseline` unchanged (revisit quarterly); refresh `seoOpportunities` narrative only if a significant SERP shift is observed (Tier 1/2 brand entered page 1 for a tracked query, or a Duette page moved ≥3 positions).

6. **Snapshot**: copy the new `competitors.json` to `history/competitors-YYYY-MM-DD.json`.

7. **Commit and push**:
   ```bash
   cd /home/user/workspace/duette-dash
   git config user.email "diane@duettenyc.com" && git config user.name "Diane Petan"
   git add client/public/competitors.json client/public/competitors-meta.json history/
   git commit -m "Weekly refresh $(date +%Y-%m-%d)"
   git push origin main
   ```
   Use `api_credentials=["github"]` on the push.

8. **Send notification** via `send_notification`:
   - Email to dianepetan@mac.com AND in-app notification
   - Subject: "DuetteNYC weekly refresh — [date]"
   - Body: 5-8 bullets covering:
     - Biggest weekChange notes (top 3-5 across brands)
     - New promos launched by Tier 1 competitors
     - Any conversionScore movements ≥1 point
     - Any Duette SERP position change ≥3 positions (if GSC data available)
     - Link to https://duettenyccompetitoranalysis.netlify.app
     - Link to the commit on GitHub

## Data-quality reminders

- Some brands may be PerimeterX-blocked (Ann Taylor especially). If a fetch fails, keep the previous value and set `notes` to "Fetch blocked YYYY-MM-DD".
- Blackstrad's hero pant (Scala) is frequently out of stock — price may be null.
- Vince, Helmut Lang, Wardrobe.NYC, Wolford, Ripley Rader have no review widgets → `reviewCount: 0, rating: null`.
- Wolford: use `us.wolford.com` for hero fields, `wolford.com` for Similarweb traffic.

## Schema contract (client depends on this)

- `id`: string slug (never a number)
- `reviewCount`: integer or null (never a string)
- `rating`: number or null (never the string "N/A")
- `hasBestseller`, `semrushUpdated`: boolean (never 0/1)
- `hasSustainability`, `hasPetiteTall`: 0 or 1 (kept as legacy ints)
- Array fields (`primaryChannels`, `bestPractices`, `replicableInsights`, `trustSignals`, `seoKeywords`): real JSON arrays (never JSON-encoded strings)

If the client build breaks after a refresh, the schema was violated — check the last commit's JSON.
