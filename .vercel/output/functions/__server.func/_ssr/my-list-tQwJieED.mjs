import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as Route$6 } from "./router-COSF6AoY.mjs";
import { i as useLibrary } from "./library-store-CN-kVHLs.mjs";
import { t as AppShell } from "./title-card-CoApRYso.mjs";
import { t as BrowseGrid } from "./rows-CNsr2ytg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/my-list-tQwJieED.js
var import_jsx_runtime = require_jsx_runtime();
function MyListPage() {
	const titles = Route$6.useLoaderData();
	const mine = useLibrary((s) => s.myList).map((id) => titles.find((t) => t.id === id)).filter((t) => Boolean(t));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrowseGrid, {
		heading: "My List",
		kicker: "Saved",
		titles: mine
	}), mine.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-4 text-muted sm:px-8",
		children: "Add titles from any row — they live here on this device."
	}) : null] });
}
//#endregion
export { MyListPage as component };
