import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Route$4 } from "./router-COSF6AoY.mjs";
import { t as AppShell } from "./title-card-CoApRYso.mjs";
import { t as BrowseGrid } from "./rows-CNsr2ytg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/series-B6k6RXs3.js
var import_jsx_runtime = require_jsx_runtime();
function SeriesPage() {
	const titles = Route$4.useLoaderData().filter((t) => t.kind === "series");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrowseGrid, {
		heading: "Series",
		kicker: "Binge",
		titles
	}) });
}
//#endregion
export { SeriesPage as component };
