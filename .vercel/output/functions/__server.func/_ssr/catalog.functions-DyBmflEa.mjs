import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as boolean, o as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog.functions-DyBmflEa.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
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
var listTitles = createServerFn({ method: "GET" }).handler(createSsrRpc("bc2f9ab18eff87733836f9d8234b372929bd3e7bd9db60565dd168619fde047e"));
var getTitle = createServerFn({ method: "GET" }).validator(object({ id: string().min(1) })).handler(createSsrRpc("d00e51401425ec1b7b52b55a9a9f38d414d5be211bbaf2ae92dff2b6b0d3f94c"));
var adminLogin = createServerFn({ method: "POST" }).validator(object({
	username: string(),
	password: string()
})).handler(createSsrRpc("c6a93e39ea705eeec24d3095072a36400facf9c39965fa990fe708357c8e0cd5"));
var createTitle = createServerFn({ method: "POST" }).validator(object({
	token: string(),
	title: titleInputSchema
})).handler(createSsrRpc("eef13b1b9f541133b5038a05a4c97ed5b672dc30335764eec443986676bd0e48"));
var updateTitle = createServerFn({ method: "POST" }).validator(object({
	token: string(),
	id: string().min(1),
	title: titleInputSchema
})).handler(createSsrRpc("235701b5f1b275080365c727bc67ef883c8a87d3b59ceafb314b53beebe9ead9"));
var removeTitle = createServerFn({ method: "POST" }).validator(object({
	token: string(),
	id: string().min(1)
})).handler(createSsrRpc("d2f027314a5b91a0ea16e17fce9e9765a1744e89d933e4b4e8f9b304b714c4b5"));
//#endregion
export { removeTitle as a, listTitles as i, createTitle as n, updateTitle as o, getTitle as r, adminLogin as t };
