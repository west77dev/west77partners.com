# West77 Partners website

Plain HTML/CSS/JS site for west77partners.com. No build step: every page file is edited directly.

**Pushing to `main` publishes the live site immediately** (Netlify). Before committing, show the person what changed and get a clear OK.

## Where the copy lives

| Page | File |
|---|---|
| Home | `index.html` |
| About (history, philosophy, careers) | `about.html` |
| Team members (names, titles, bios) | `team.json` |
| Services | `services.html` |
| Projects (titles, locations, summaries) | `projects.json` (layout in `projects.html`) |
| Press | `press.html` |
| Contact | `contact.html` |

## Rules

- This is for copy edits. Change text only; leave classes, IDs, structure and styling alone unless asked.
- The header and footer are repeated in all six HTML pages. A menu or footer change must be made in every page so they stay identical.
- Keep `team.json` and `projects.json` valid JSON (watch commas and quotes). Check with `python -m json.tool team.json` or `node -e "JSON.parse(require('fs').readFileSync('team.json'))"`.
- Images are hosted on Cloudinary (`res.cloudinary.com/...` links). To change a photo, the new image must be uploaded to Cloudinary first; then swap the URL. Don't add image files to the repo.
- Preview by opening the HTML file in a browser. The team and projects sections load from JSON, which browsers block from a plain file; to preview those, run `python -m http.server` in this folder and open http://localhost:8000.
- Pull before starting work. Commit with a short message describing the copy change.
