import {readdirSync, readFileSync} from "fs";

export async function gatherInfo() {
	const dirs = readdirSync("../../dist/app/", {
		withFileTypes: true,
	})
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	for (const folder of dirs) {
		for (const file of readdirSync(`../../dist/app/${folder}`).filter(
			(file) => file.endsWith(".ts") || file.endsWith(".js"),
		)) {
			const fileData = readFileSync(`../../dist/app/${folder}/${file}`, {
				encoding: "utf-8",
			});
			const endpoints = parseEndpoints(fileData);
			console.log("[Tester] Router: " + folder + " File: " + file);
			console.log("[Tester] Endpoints found on " + file + ": " + endpoints.length);
			console.log(endpoints);
			console.log("\n");
		}
	}
}


function parseEndpoints(code: string) {
	const endpoints = code.split("// Expected Output Interface - START");
	return endpoints[1].split("// Expected Output Interface - END")[0].replace("interface", "export interface");
}


gatherInfo();
