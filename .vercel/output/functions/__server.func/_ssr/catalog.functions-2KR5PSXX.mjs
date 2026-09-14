import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as boolean, o as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog.functions-2KR5PSXX.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var kindSchema = _enum([
	"movie",
	"series",
	"drama"
]);
var titleInputSchema = object({
	name: string().min(1).max(120),
	synopsis: string().min(1).max(2e3),
	kind: kindSchema,
	genres: string().min(1).max(200),
	year: number().int().min(1888).max(2100),
	rating: string().min(1).max(16),
	durationMin: number().int().min(1).max(600),
	seasons: number().int().min(1).max(40),
	posterUrl: string().max(500),
	backdropUrl: string().max(500),
	videoUrl: string().max(1e3),
	featured: boolean(),
	trending: boolean(),
	isNew: boolean(),
	comingSoon: boolean(),
	original: boolean()
});
var listTitles_createServerFn_handler = createServerRpc({
	id: "bc2f9ab18eff87733836f9d8234b372929bd3e7bd9db60565dd168619fde047e",
	name: "listTitles",
	filename: "src/lib/catalog.functions.ts"
}, (opts) => listTitles.__executeServer(opts));
var listTitles = createServerFn({ method: "GET" }).handler(listTitles_createServerFn_handler, async () => {
	const { fetchTitles } = await import("./catalog.server-CYUxlA1i.mjs");
	return fetchTitles();
});
var getTitle_createServerFn_handler = createServerRpc({
	id: "d00e51401425ec1b7b52b55a9a9f38d414d5be211bbaf2ae92dff2b6b0d3f94c",
	name: "getTitle",
	filename: "src/lib/catalog.functions.ts"
}, (opts) => getTitle.__executeServer(opts));
var getTitle = createServerFn({ method: "GET" }).validator(object({ id: string().min(1) })).handler(getTitle_createServerFn_handler, async ({ data }) => {
	const { fetchTitle } = await import("./catalog.server-CYUxlA1i.mjs");
	return fetchTitle(data.id);
});
var adminLogin_createServerFn_handler = createServerRpc({
	id: "c6a93e39ea705eeec24d3095072a36400facf9c39965fa990fe708357c8e0cd5",
	name: "adminLogin",
	filename: "src/lib/catalog.functions.ts"
}, (opts) => adminLogin.__executeServer(opts));
var adminLogin = createServerFn({ method: "POST" }).validator(object({
	username: string(),
	password: string()
})).handler(adminLogin_createServerFn_handler, async ({ data }) => {
	const { checkAdminCredentials, signAdminToken } = await import("./catalog.server-CYUxlA1i.mjs");
	if (!checkAdminCredentials(data.username, data.password)) throw new Error("Invalid admin credentials");
	return { token: await signAdminToken() };
});
var createTitle_createServerFn_handler = createServerRpc({
	id: "eef13b1b9f541133b5038a05a4c97ed5b672dc30335764eec443986676bd0e48",
	name: "createTitle",
	filename: "src/lib/catalog.functions.ts"
}, (opts) => createTitle.__executeServer(opts));
var createTitle = createServerFn({ method: "POST" }).validator(object({
	token: string(),
	title: titleInputSchema
})).handler(createTitle_createServerFn_handler, async ({ data }) => {
	const { verifyAdminToken, createTitleRow } = await import("./catalog.server-CYUxlA1i.mjs");
	await verifyAdminToken(data.token);
	return createTitleRow(data.title);
});
var updateTitle_createServerFn_handler = createServerRpc({
	id: "235701b5f1b275080365c727bc67ef883c8a87d3b59ceafb314b53beebe9ead9",
	name: "updateTitle",
	filename: "src/lib/catalog.functions.ts"
}, (opts) => updateTitle.__executeServer(opts));
var updateTitle = createServerFn({ method: "POST" }).validator(object({
	token: string(),
	id: string().min(1),
	title: titleInputSchema
})).handler(updateTitle_createServerFn_handler, async ({ data }) => {
	const { verifyAdminToken, updateTitleRow } = await import("./catalog.server-CYUxlA1i.mjs");
	await verifyAdminToken(data.token);
	const next = await updateTitleRow(data.id, data.title);
	if (!next) throw new Error("Title not found");
	return next;
});
var removeTitle_createServerFn_handler = createServerRpc({
	id: "d2f027314a5b91a0ea16e17fce9e9765a1744e89d933e4b4e8f9b304b714c4b5",
	name: "removeTitle",
	filename: "src/lib/catalog.functions.ts"
}, (opts) => removeTitle.__executeServer(opts));
var removeTitle = createServerFn({ method: "POST" }).validator(object({
	token: string(),
	id: string().min(1)
})).handler(removeTitle_createServerFn_handler, async ({ data }) => {
	const { verifyAdminToken, deleteTitleRow } = await import("./catalog.server-CYUxlA1i.mjs");
	await verifyAdminToken(data.token);
	await deleteTitleRow(data.id);
	return { ok: true };
});
//#endregion
export { adminLogin_createServerFn_handler, createTitle_createServerFn_handler, getTitle_createServerFn_handler, listTitles_createServerFn_handler, removeTitle_createServerFn_handler, updateTitle_createServerFn_handler };
