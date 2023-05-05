
import axios from "axios";
import {readdirSync, readFileSync} from "fs";

async function startTest() {
	const dirs = readdirSync("./dist/app/", {
		withFileTypes: true,
	}).filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);

	for (const folder of dirs) {
		for (const file of readdirSync("./dist/app/" + folder).filter((file) => file.endsWith(".ts") || file.endsWith(".js"))) {
			const fileData = readFileSync(`./dist/app/${folder}/${file}`, {encoding: "utf-8"});
			const endpoints = parseEndpoints(fileData);
			console.log("[Tester] Router: " + folder + " File: " + file);
			console.log("[Tester] Endpoints found on " + file + ": " + endpoints.length);
			console.log("[Tester] Running tests...");
			for (const endpoint of endpoints) {
				const parsedData = parseEndpoint(endpoint);
				console.log("[Tester] Endpoint: " + parsedData.method + " " + parsedData.path);
				if (parsedData.body) {
					console.log("[Tester] TestInput: " + JSON.stringify(parsedData.testInput));
				}
				try {
					const res = await axios.request({
						method: parsedData.method,
						url: "http://localhost:3000/" + parsedData.path,
						headers: {
							"Content-Type": "application/json",
						},
						data: parsedData.testInput,
					});
					console.log(
						"[Tester-Response] Response: " + JSON.stringify(res.data),
					);
				} catch (err) {
					console.log(
						`[Tester-Response] Error on ${parsedData.path}: ` + err,
					);
				}
			}
		}
	}
}


interface FileInterface {
	method?: string;
	path?: string;
	body?: boolean;
	bodyObject?: object;
	npm?: string;
	testInput?: object;
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

	const testInputMatch = endpointData.match(/TestInput\s+:\s+(\{[\s\S]+?\})/);
	if (testInputMatch) {
		endpoint.testInput = JSON.parse(testInputMatch[1].replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, "\"$2\": "));
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

startTest();
