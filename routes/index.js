// const fs = require("fs/promises");
// const path = require("path");
// const express = require("express");

// async function loadRoutes(app, options = {}) {
//   const {
//     basePath = path.join(process.cwd(), "src"),
//     exclude = [],
//     logger = console,
//   } = options;

//   const entries = await fs.readdir(basePath, { withFileTypes: true });

//   for (const entry of entries) {
//     if (!entry.isDirectory() || exclude.includes(entry.name)) continue;

//     const routeFile = path.join(basePath, entry.name, "route.js");

//     try {
//       await fs.access(routeFile); // Check if route.js exists
//       const routeModule = require(routeFile);
//       const route = routeModule.default || routeModule;

//       const isRouter =
//         route instanceof express.Router || typeof route === "function";

//       if (isRouter) {
//         const mountPath = `/${entry.name}`;
//         app.use(mountPath, route);
//         logger.info?.(`✅ Mounted ${mountPath} from ${routeFile}`);
//       } else {
//         logger.warn?.(`⛔ Skipped ${routeFile} - Not a valid Express router`);
//       }
//     } catch (err) {
//       if (err.code !== "ENOENT") {
//         logger.error?.(`⚠️ Failed to load ${routeFile}: ${err.message}`);
//       }
//     }
//   }
// }

// module.exports = loadRoutes;
const fs = require("fs/promises");
const path = require("path");
const express = require("express");

async function loadRoutes(app, options = {}) {
  const {
    basePath = path.join(process.cwd(), "src", "routes"),
    exclude = [],
    logger = console,
  } = options;

  async function traverseRoutes(dir, prefix = "") {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const newPrefix = path.join(prefix, entry.name);
        await traverseRoutes(fullPath, newPrefix);
      } else if (entry.name.endsWith(".routes.js")) {
        try {
          const routeModule = require(fullPath);
          const route = routeModule.default || routeModule;

          const isRouter =
            route instanceof express.Router || typeof route === "function";

          if (isRouter) {
            // Remove .routes.js and convert path to web-friendly
            const name = entry.name.replace(".routes.js", "");
            const routePath = "/" + path.join(prefix, name).replace(/\\/g, "/");

            app.use(routePath, route);
            logger.info?.(`✅ Mounted ${routePath} from ${fullPath}`);
          } else {
            logger.warn?.(`⛔ Skipped ${fullPath} - Not a valid Express router`);
          }
        } catch (err) {
          logger.error?.(`⚠️ Failed to load ${fullPath}: ${err.message}`);
        }
      }
    }
  }

  await traverseRoutes(basePath);
}

module.exports = loadRoutes;
