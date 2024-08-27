import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Resolve current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Function to load all route files dynamically
function loadRoutes() {
  const routesPath = path.join(__dirname, 'routes');

  // Check if routes directory exists
  if (!fs.existsSync(routesPath)) {
    console.error('Routes directory does not exist.');
    process.exit(1);
  }

  // Read and load each route file
  fs.readdirSync(routesPath).forEach(file => {
    if (path.extname(file) === '.js') {
      const routeName = path.basename(file, '.js');
      try {
        const route = import(`./routes/${file}`);
        route.then(module => {
          app.use(`/${routeName}`, module.default);
          console.log(`Loaded route: /${routeName}`);
        });
      } catch (error) {
        console.error(`Error loading route ${file}:`, error);
      }
    }
  });
}

// Call the function to load routes
loadRoutes();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
