import axios from "axios";

import type { MongodbPage } from "qqlx-core/utils/database";
import type { ResponseREST } from "qqlx-core/utils/utils";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

declare global {
	interface Window {
		WxLogin: any;
		loginTimer: any;
	}
}

class Request {
	private localAxios;

	constructor() {
		this.localAxios = axios.create({});
		this.localAxios.interceptors.request.use(function (config) {
			config.headers["Content-Type"] = "application/json";
			config.headers["Authorization"] = localStorage.getItem("qqlx-token") || "";
			return config;
		});
		this.localAxios.interceptors.response.use(function (response) {
			if (response.status === 200 && ["40301", "40302"].includes(response.data?.code)) {
				setTimeout(() => {
					localStorage.setItem("qqlx-token", "");
					window.location.assign("/market/login");
				}, 2000);
			}
			return response;
		});
	}

	async get(url: string, body?: any) {
		let result = await this.localAxios.post(url + "/get", body);
		const responseREST = result.data as ResponseREST<any>;
		if (responseREST.code === "200") return responseREST.data;
		else {
			throw new Error(responseREST.message);
		}
	}

	async post(url: string, body?: any) {
		let result = await this.localAxios.post(url, body);
		const responseREST = result.data as ResponseREST<any>;
		if (responseREST.code === "200") return responseREST.data;
		else {
			throw new Error(responseREST.message);
		}
	}

	async patch(url: string, body?: any) {
		let result = await this.localAxios.patch(url, body);
		const responseREST = result.data as ResponseREST<any>;
		if (responseREST.code === "200") return responseREST.data;
		else {
			throw new Error(responseREST.message);
		}
	}

	async put(url: string, body?: any) {
		let result = await this.localAxios.put(url, body);
		const responseREST = result.data as ResponseREST<any>;
		if (responseREST.code === "200") return responseREST.data;
		else {
			throw new Error(responseREST.message);
		}
	}

	async delete(url: string, body?: any) {
		let result = await this.localAxios.post(url + "/delete", body);
		const responseREST = result.data as ResponseREST<any>;
		if (responseREST.code === "200") return responseREST.data;
		else {
			throw new Error(responseREST.message);
		}
	}
}

export const request = new Request();

export function getMongodbBase() {
	return {
		_id: "",
		timeCreate: 0,
		timeCreateString: "",
		timeUpdate: 0,
		timeUpdateString: "",
	};
}
export function getPage(pageSize = 20): MongodbPage {
	const page = {
		page: 1,
		pageSize,
		startTime: 0,
		endTime: Date.now() + 1000 * 60 * 60,
	};
	const date = new Date();
	const year = date.getFullYear();
	page.startTime = new Date(`${year}/01/01 00:00`).getTime();
	return page;
}

// 网上复制的，获取中文金额
export function getChineseMoney(n: number) {
	var fraction = ["角", "分"];
	var digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
	var unit = [
		["元", "万", "亿"],
		["", "拾", "佰", "仟"],
	];
	var head = n < 0 ? "欠" : "";
	n = Math.abs(n);

	var s = "";

	for (var i = 0; i < fraction.length; i++) {
		s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, "");
	}
	s = s || "整";
	n = Math.floor(n);

	for (var i = 0; i < unit[0].length && n > 0; i++) {
		var p = "";
		for (var j = 0; j < unit[1].length && n > 0; j++) {
			p = digit[n % 10] + unit[1][j] + p;
			n = Math.floor(n / 10);
		}
		s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
	}
	return (
		head +
		s
			.replace(/(零.)*零元/, "元")
			.replace(/(零.)+/g, "零")
			.replace(/^整$/, "零元整")
	);
}
