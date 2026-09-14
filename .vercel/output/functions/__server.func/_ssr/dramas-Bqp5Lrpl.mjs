import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Route$8 } from "./router-COSF6AoY.mjs";
import { t as AppShell } from "./title-card-CoApRYso.mjs";
import { t as BrowseGrid } from "./rows-CNsr2ytg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dramas-Bqp5Lrpl.js
var import_jsx_runtime = require_jsx_runtime();
function DramasPage() {
	const titles = Route$8.useLoaderData().filter((t) => t.kind === "drama");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrowseGrid, {
		heading: "Dramas",
		kicker: "Story",
		titles
	}) });
}
//#endregion
export { DramasPage as component };
