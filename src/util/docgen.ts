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

			const splitedInterface = fileData.split("// Expected Output Interface - START");

			for (let i = 1; i < splitedInterface.length; i++) {
				const endpoints = parseEndpoints(splitedInterface[i]);
				console.log("[Tester] Router: " + folder + " File: " + file);
				console.log("[Tester] Endpoints found on " + file + ": " + endpoints.length);

				const filename = endpoints.split("{")[0].split("interface")[1].trim();
				fs.writeFileSync(`./docs/interfaces/${filename}.md`, endpoints.trim(), {encoding: "utf-8"});
			}
		}
	}
}


function parseEndpoints(code: string) {
	const text = code.split("// Expected Output Interface - END")[0].replaceAll("//", "");

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


	const expected = endpointData.match(/Expected Output\s+:\s+(\S+)/);
	if (expected) {
		endpoint.expected = expected[1];
	}
	if (paramsMatch) {
		const paramsInputTest = endpointData.match(/paramsTest\s+:\s+(\{[\s\S]+?\})/);
		if (paramsInputTest) {
			const text = paramsInputTest[1].replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, "\"$2\": ");
			endpoint.paramsTest = JSON.parse(text!.replaceAll("\\", ""));
		}
	}

	return endpoint;
}

async function startAPIDocs() {
	const dirs = readdirSync("./dist/app/", {
		withFileTypes: true,
	})
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);


	if (fs.existsSync("./docs/API")) {
		fs.rmSync("./docs/API", {recursive: true});
	}

	fs.mkdirSync("./docs/API");
	for (const folder of dirs) {
		for (const file of readdirSync(`./dist/app/${folder}`).filter(
			(file) => file.endsWith(".ts") || file.endsWith(".js"),
		)) {
			const fileData = readFileSync(`./dist/app/${folder}/${file}`, {
				encoding: "utf-8",
			});
			const endpoints = parseEndpointsAPI(fileData);
			for (const endpoint of endpoints) {
				const parsedData = await generateAPIDocs(endpoint);
				let text = `
# ${parsedData.method} ${parsedData.path}

-NPM: ${parsedData.npm}
-Body: ${parsedData.body}
-Params: ${parsedData.params}

				`;
				if (parsedData.bodyTestInput) {
					text += `
## Body Object
\`\`\`json
${JSON.stringify(parsedData.bodyTestInput, null, 2)}
\`\`\`
					`;
				}

				if (parsedData.paramsTest) {
					text += `
## Body Test Input
\`\`\`json
${JSON.stringify(parsedData.paramsTest, null, 2)}
\`\`\`
					`;

					if (parsedData.expected) {
						text += `
## Expected Output : ${parsedData.expected}

`;
					}
					const filename = parsedData.path!.replaceAll("/", "-");
					console.log("[Tester-API] Router: " + folder + " File: " + file);
					fs.writeFileSync(`./docs/API/${filename}.md`, text, {encoding: "utf-8"});
				}
			}
		}
	}
}

generateInterface();

interface FileInterface {
	expected?: string;
	method?: string;
	path?: string;
	body?: boolean;
	bodyObject?: object;
	params?: boolean;
	paramsTest?: object;
	npm?: string;
	bodyTestInput?: object;
}


startAPIDocs();
function parseEndpointsAPI(code: string) {
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
