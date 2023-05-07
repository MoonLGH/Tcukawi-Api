import {readdirSync, readFileSync} from "fs";
import fs from "fs";
import prettier from "prettier";

async function generateInterface() {
	const dirs = readdirSync("./dist/app/", {
		withFileTypes: true,
	})
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	if (fs.existsSync("./docs/interfaces")) {
		fs.rmSync("./docs/interfaces", {recursive: true});
	}

	fs.mkdirSync("./docs/interfaces");

	for (const folder of dirs) {
		for (const file of readdirSync(`./dist/app/${folder}`).filter(
			(file) => file.endsWith(".ts") || file.endsWith(".js"),
		)) {
			const fileData = readFileSync(`./dist/app/${folder}/${file}`, {
				encoding: "utf-8",
			});
			const endpoints = parseEndpoints(fileData);
			console.log("[Tester] Router: " + folder + " File: " + file);
			console.log("[Tester] Endpoints found on " + file + ": " + endpoints.length);

			fs.writeFileSync(`./docs/interfaces/${file.replace(".js", "")}.md`, endpoints.trim(), {encoding: "utf-8"});
		}
	}
}


function parseEndpoints(code: string) {
	const endpoints = code.split("// Expected Output Interface - START");
	const text = endpoints[1].split("// Expected Output Interface - END")[0].replaceAll("//", "");

	const returnedText = prettier.format(text, {
		parser: "typescript",
		semi: true,
		singleQuote: true,
		trailingComma: "all",
		tabWidth: 2,
	});

	return returnedText;
}


async function generateAPIDocs(code: string) {
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


generateInterface();

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


generateAPIDocs("");
