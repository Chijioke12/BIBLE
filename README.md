# Backend (proxy) for Scripture API Bible

This small Express app proxies requests from a legacy frontend to https://api.scripture.api.bible.
It expects an environment variable `SCRIPTURE_API_BIBLE_KEY` containing your API key.

Endpoints:
- GET /api/proxy?path=<url-encoded-path>
  forwards to https://api.scripture.api.bible/v1/<path>

Examples:
- /api/proxy?path=bibles/{BIBLE_ID}/books

Deploy:
1. Create a new GitHub repository and push the `backend` folder.
2. In Vercel, import the repository and set the environment variable `SCRIPTURE_API_BIBLE_KEY`.
3. Deploy. The frontend needs the deployed URL (e.g. https://your-app.vercel.app).

Notes:
- This proxy is minimal. For production, add rate-limiting and stricter validation.