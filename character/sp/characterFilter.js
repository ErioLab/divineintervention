import { lib, game, ui, get, ai, _status } from "../../noname.js";

const characterFilters = {
	tianyu(mode) {
		return mode != "chess" && mode != "tafang" && mode != "stone";
	},
	ol_dongzhao(mode) {
		return mode == "identity" && ["normal", "zhong"].includes(_status.mode);
	},
	ol_mengda(mode) {
		return mode !== "guozhan";
	},
};

export default characterFilters;
