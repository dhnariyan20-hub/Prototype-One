import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const routesDir = path.join(__dirname, 'routes');
const anchestorDir = path.join(__dirname, '..', 'anchestor');

const homeHTML = path.join(anchestorDir, 'index.html');
const docsHTML = path.join(anchestorDir, 'docs.html');
const notFoundHTML = path.join(anchestorDir, '404.html');

let loadedRoutes = [];

async function loadRoutes() {
  const files = fs.readdirSync(routesDir);
  for (const file of files) {
    if (path.extname(file) === '.js') {
      const routeName = path.basename(file, '.js');
      try {
        const module = await import(`./routes/${file}`);
        app.use(`/${routeName}`, module.default);
        loadedRoutes.push(`/${routeName}`);
        console.log(`Loaded route: /${routeName}`);
      } catch (err) {
        console.error(`Error loading route ${file}:`, err);
      }
    }
  }
}

await loadRoutes();

app.get(['/', '/home'], (req, res) => {
  res.sendFile(homeHTML);
});

app.get('/docs', (req, res) => {
  let html = fs.readFileSync(docsHTML, 'utf8');
  const routesList = loadedRoutes.map(r => `<li><a href="${r}">${r}</a></li>`).join('');
  html = html.replace('{{routes}}', routesList);
  res.send(html);
});

app.use((req, res) => {
  res.status(404).sendFile(notFoundHTML);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
