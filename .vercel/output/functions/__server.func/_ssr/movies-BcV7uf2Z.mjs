import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Route$7 } from "./router-COSF6AoY.mjs";
import { t as AppShell } from "./title-card-CoApRYso.mjs";
import { t as BrowseGrid } from "./rows-CNsr2ytg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/movies-BcV7uf2Z.js
var import_jsx_runtime = require_jsx_runtime();
function MoviesPage() {
	const titles = Route$7.useLoaderData().filter((t) => t.kind === "movie");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrowseGrid, {
		heading: "Movies",
		kicker: "Film",
		titles
	}) });
}
//#endregion
export { MoviesPage as component };
