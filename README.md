# Adwaid Portfolio

A static personal portfolio focused on Data Science, AI, and Web Development projects.

## Project Structure

```text
portfolio/
+-- index.html                  # Home page (hero, skills, featured projects, contact)
+-- projects/
¦   +-- index.html              # All projects page
¦   +-- beatbuff.html           # Case study
¦   +-- demand-forecasting.html # Case study
¦   +-- ipl-auction-analysis.html # Case study
¦   +-- assent.html             # Case study
+-- css/
¦   +-- styles.css              # Shared styles for all pages
+-- js/
¦   +-- script.js               # Navigation, animations, form logic
+-- assets/
¦   +-- profile.jpeg            # Profile image
¦   +-- resume.pdf              # Resume download file
+-- robots.txt
+-- sitemap.xml
```

## Run Locally

1. Open `index.html` directly in a browser, or
2. Use a local server (recommended), for example:

```powershell
python -m http.server 5500
```

Then open `http://localhost:5500`.

## Update Content

- Edit profile/about/skills in `index.html`
- Edit project cards in `index.html` and `projects/index.html`
- Edit detailed case studies in files under `projects/`
- Update theme/layout in `css/styles.css`

## Deployment

Optimized for GitHub Pages with base path:
`https://adwaidp23.github.io/portfolio/`

If the domain/path changes, update canonicals and sitemap URLs.
