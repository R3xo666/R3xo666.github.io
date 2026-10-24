# Aditya Kumar’s portfolio

A static portfolio for my Python projects in automation, data collection, and Linux tooling.

The site uses HTML, CSS, and vanilla JavaScript. It loads public repository details from the GitHub API, with local project data available as a fallback. The contact form is handled by FormSubmit.

## Run locally

No build step or package installation is required.

~~~bash
git clone https://github.com/R3xo666/R3xo666.github.io.git
cd R3xo666.github.io
python3 -m http.server 8000
~~~

Open [http://localhost:8000](http://localhost:8000).

## Files

- `index.html` — page content and navigation
- `css/custom.css` — layout, colors, responsive styles, and motion
- `js/app.js` — rendering and page interactions
- `js/data.js` — project data used when GitHub is unavailable
- `js/github.js` — public repository fetch and cache

## Links

- [Live portfolio](https://r3xo666.github.io)
- [GitHub profile](https://github.com/R3xo666)
- [Email](mailto:r3xo666.dev@gmail.com)