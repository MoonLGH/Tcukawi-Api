import express from "express";
import {readdirSync} from "fs";
import cors from "cors";
import {globalRoutes} from "../util/variables.js";
import {endpointTest} from "../util/tester.js";
const port = 3000;
const app = express();
// app cors allow all

app.use(cors());
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true}));

// loop ./**/x.ts and app.use xRouter from x.ts

async function loadRouters() {
	const dirs = readdirSync("./dist/app/", {
		withFileTypes: true,
	}).filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);

	for (const folder of dirs) {
		for (const file of readdirSync("./dist/app/" + folder).filter((file) => file.endsWith(".ts") || file.endsWith(".js"))) {
			const router = await import(`../app/${folder}/${file}`);
			globalRoutes.set(folder, router.default);
			app.use(`/${folder}`, router.default);
			const stack= router.default.stack;
			for (const route of stack) {
				if (route.route) {
					console.log(`[Handler] Endpoint path: /${folder}${route.route.path} on ${file} Loaded`);
				}
			}
			console.log(`[Handler] Router ${folder} Loaded `+ stack.filter((r:express.Router) => r.route).length + " Endpoints");
		}
	}
	console.log("[Handler] "+ globalRoutes.size + " Routes Loaded");
}


async function start() {
	await loadRouters();
	app.listen(port, () => console.log(`[Express] Server started on port ${port}`));

	// init cache of status
	await endpointTest();
}

export {start};
