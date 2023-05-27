import axios from "axios";
import {readdirSync, readFileSync} from "fs";
import {cacheStatus} from "./variables.js";


export async function endpointTest() {
	const response: {[key: string]: {
		[key: string]: string | number | boolean
	}} = {};
	const dirs = readdirSync("./dist/app/", {
		withFileTypes: true,
	})
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	for (const folder of dirs) {
		for (const file of readdirSync(`./dist/app/${folder}`).filter(
			(file) => file.endsWith(".ts") || file.endsWith(".js"),
		)) {
			const fileData = readFileSync(`./dist/app/${folder}/${file}`, {
				encoding: "utf-8",
			});
			const endpoints = parseEndpoints(fileData);
			for (const endpoint of endpoints) {
				const parsedData = parseEndpoint(endpoint);
				if (parsedData.params) {
					// loop through paramsTest and append to path
					let paramsAppend = "?";
					for (const key in parsedData.paramsTest) {
						// eslint-disable-next-line no-prototype-builtins
						if (parsedData.paramsTest!.hasOwnProperty(key)) {
							const value:string = parsedData.paramsTest![key as keyof typeof parsedData.paramsTest];
							paramsAppend += key + "=" + `${value}` + "&";
						}
					}
					paramsAppend = paramsAppend.slice(0, -1);
					parsedData.path += paramsAppend;
				}
				try {
					if (parsedData.path?.includes("/APIStatus")) {
						response[(parsedData.path as string)] = {code: 200, message: "OK"};
					} else {
						const res = await axios.request({
							method: parsedData.method,
							url: "http://localhost:3000/" + parsedData.path,
							headers: {
								"Content-Type": "application/json",
							},
							data: parsedData.bodyTestInput,
						});
						if (res.status >= 400) {
							console.error(
								"[Tester-Response] Error on " +
                                parsedData.path +
                                ": Received HTTP status " +
                                res.status,
							);
							response[(parsedData.path as string)] = {code: res.status, message: res.data};
						} else {
							response[(parsedData.path as string)] = {code: res.status, message: res.data};
						}
					}
				} catch (err) {
					console.log(
						"[Tester-Response] Error on " + parsedData.path + ": " + err,
					);
					response[(parsedData.path as string)] = {code: 500, message: ((err as Error).message)};
				}
			}
		}
	}
	cacheStatus["results"] = response;
	console.log("[Cache] Cache status refreshed");
	cacheStatus["lastUpdated"] = new Date();
	console.log("[Cache] Cache last updated at " + cacheStatus["lastUpdated"]);

	// refresh cache every 1 hour
	setTimeout(endpointTest, 3600000);
}


function parseEndpoint(code: string) {
	const endpointData = code;
	const endpoint:FileInterface = {};

	const methodMatch = endpointData.match(/(GET|POST)\s+:\s+\/(\S+)/);
	if (methodMatch) {
		endpoint.method = methodMatch[1];
		endpoint.path = methodMatch[2];
	}
	const bodyMatch = endpointData.match(/body\s+:\s+(\S+)/);
	if (bodyMatch) {
		endpoint.body = bodyMatch[1] === "true";
	}

	const bodyObjectMatch = endpointData.match(/bodyObject\s+:\s+(\{[\s\S]+?\})/);
	if (bodyObjectMatch) {
		const bodyObjectString = bodyObjectMatch[1].replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, "\"$2\": ");
		endpoint.bodyObject = JSON.parse(bodyObjectString);
	}

	const npmMatch = endpointData.match(/NPM\s+:\s+(\S+)/);
	if (npmMatch) {
		endpoint.npm = npmMatch[1];
	}

	const testInputMatch = endpointData.match(/bodyTestInput\s+:\s+(\{[\s\S]+?\})/);
	if (testInputMatch) {
		endpoint.bodyTestInput = JSON.parse(testInputMatch[1].replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, "\"$2\": "));
	}

	const paramsMatch = endpointData.match(/params\s+:\s+(\S+)/);
	if (paramsMatch) {
		endpoint.params = paramsMatch[1] === "true";
	}

	const paramsInputTest = endpointData.match(/paramsTest\s+:\s+(\{[\s\S]+?\})/);
	if (paramsInputTest) {
		const text = paramsInputTest[1].replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, "\"$2\": ");
		endpoint.paramsTest = JSON.parse(text!.replaceAll("\\", ""));
	}

	return endpoint;
}

function parseEndpoints(code: string) {
	const endpoints = code.split("// Documentation - START");
	endpoints.shift();
	let data = endpoints.map((endpoint) => {
		const endpointData = endpoint.split("// Documentation - END")[0];
		return endpointData;
	});	// return code.split("// EOL");

	// prettify data. like remove \n and \t and \\
	data = data.map((endpoint) => {
		return endpoint.split("\n").join(" ");
	});

	return data;
}

interface FileInterface {
	method?: string;
	path?: string;
	body?: boolean;
	bodyObject?: object;
	params?: boolean;
	paramsTest?: object;
	npm?: string;
	bodyTestInput?: object;
}
