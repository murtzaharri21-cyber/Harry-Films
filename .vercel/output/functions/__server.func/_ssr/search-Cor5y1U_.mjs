import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Route$5 } from "./router-COSF6AoY.mjs";
import { t as AppShell } from "./title-card-CoApRYso.mjs";
import { t as BrowseGrid } from "./rows-CNsr2ytg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-Cor5y1U_.js
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const { q } = Route$5.useSearch();
	const titles = Route$5.useLoaderData();
	const needle = q.trim().toLowerCase();
	const matches = needle ? titles.filter((t) => {
		return `${t.name} ${t.synopsis} ${t.genres.join(" ")} ${t.kind}`.toLowerCase().includes(needle);
	}) : titles;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrowseGrid, {
		heading: needle ? `Results for “${q}”` : "Search the catalog",
		kicker: "Find",
		titles: matches
	}) });
}
//#endregion
export { SearchPage as component };
