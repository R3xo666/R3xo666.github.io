# Aditya Kumar’s portfolio

A static portfolio for my Python projects in automation, data collection, and Linux tooling.

## What’s on the site

- Overview, selected projects, about, and contact sections
- Responsive layout with CSS motion and reduced-motion support
- Project list loaded from the public GitHub API, with local project data as a fallback
- Contact form handled by FormSubmit

The site uses semantic HTML, custom CSS, and vanilla JavaScript. It has no build step or package dependencies.

## Run locally

~~~bash
git clone https://github.com/R3xo666/R3xo666.github.io.git
cd R3xo666.github.io
python3 -m http.server 8000
~~~

Open [http://localhost:8000](http://localhost:8000). A local HTTP server is useful because the project list uses `fetch` to read GitHub’s API.

## Project files

- `index.html` — page content, navigation, project and contact sections
- `css/custom.css` — layout, color tokens, responsive styles, animations, and reduced-motion rules
- `js/app.js` — project rendering, section navigation, and contact interactions
- `js/data.js` — curated project details used as fallback data
- `js/github.js` — public repository fetch and short browser cache
- `assets/` — profile image and favicon

## Contact form

Form submissions are handled by FormSubmit. The page also provides direct email and GitHub links.

## Deployment

The live site is published with GitHub Pages at [r3xo666.github.io](https://r3xo666.github.io).