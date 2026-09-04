# joshuawerlein.com

Personal portfolio for Joshua Werlein, full stack software engineer in west central Wisconsin. Live at [joshuawerlein.com](https://joshuawerlein.com).

## What it is

A single-page React app presenting client work, shipped projects, and contact info:

- **Experience**: contract work for Grayz'n Buffalo Bar & Grill (grayznbuffalo.com), Arkham Enterprises (arkhamsolar.com), KIL Construction (kilcon.work), Friends of Lake Henry (friendsoflakehenry.com), and Blair Sportsmen's Club (blairsportsmensclub.com)
- **Projects**: production deployments with real users, including Best By Manager on Google Play
- **llms.txt** at the site root for AI agent discoverability

## Stack

- React 19 + Vite
- Cloudflare Worker (`portfolio-worker.js`) serving the built assets at the edge
- Plain CSS, no UI framework

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
```

Deployed via Cloudflare Workers with static assets. Pushes to `main` deploy automatically.

## Related repositories

| Project | Repo |
|---|---|
| Best By Manager (Android) | [BestByManager](https://github.com/joshua-werlein/BestByManager) |
| Grayz'n Buffalo Bar & Grill | [grayzn-buffalo](https://github.com/joshua-werlein/grayzn-buffalo) |
| KIL Construction | [kilConstruction](https://github.com/joshua-werlein/kilConstruction) |
| Friends of Lake Henry | [friends-of-lake-henry](https://github.com/joshua-werlein/friends-of-lake-henry) |
| Arkham Enterprises | [arkham-solar](https://github.com/joshua-werlein/arkham-solar) |
