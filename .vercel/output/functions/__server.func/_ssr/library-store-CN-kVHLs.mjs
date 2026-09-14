import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-store-CN-kVHLs.js
var useLibrary = create()(persist((set, get) => ({
	myList: [],
	progress: {},
	toggleList: (id) => set((s) => ({ myList: s.myList.includes(id) ? s.myList.filter((x) => x !== id) : [id, ...s.myList] })),
	inList: (id) => get().myList.includes(id),
	setProgress: (id, entry) => set((s) => ({ progress: {
		...s.progress,
		[id]: entry
	} })),
	clearProgress: (id) => set((s) => {
		const next = { ...s.progress };
		delete next[id];
		return { progress: next };
	})
}), { name: "velora-library" }));
var ADMIN_TOKEN_KEY = "velora-admin-token";
function getAdminToken() {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(ADMIN_TOKEN_KEY);
}
function setAdminToken(token) {
	localStorage.setItem(ADMIN_TOKEN_KEY, token);
}
function clearAdminToken() {
	localStorage.removeItem(ADMIN_TOKEN_KEY);
}
//#endregion
export { useLibrary as i, getAdminToken as n, setAdminToken as r, clearAdminToken as t };
