import express from "express";
import {readdirSync} from "fs";
import cors from "cors";
import {Collection} from "@discordjs/collection";
const port = 8089;
const app = express();
// app cors allow all

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// loop ./**/x.ts and app.use xRouter from x.ts

async function loadRouters() {
	const routers = new Collection();
	const dirs = readdirSync("./dist/app/", {
		withFileTypes: true,
	}).filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);

	for (const folder of dirs) {
		for (const file of readdirSync("./dist/app/" + folder).filter((file) => file.endsWith(".ts") || file.endsWith(".js"))) {
			const router = await import(`../app/${folder}/${file}`);
			routers.set(folder, router.default);
			app.use(`/${folder}`, router.default);
			const stack= router.default.stack;
			for (const route of stack) {
				if (route.route) {
					console.log(`[Handler] Endpoint path: /${folder}${route.route.path} Loaded`);
				}
			}
			console.log(`[Handler] Router ${folder} Loaded `+ stack.filter((r:express.Router) => r.route).length + " Endpoints");
		}
	}
	console.log("[Handler] "+ routers.size + " Routes Loaded");
}


async function start() {
	await loadRouters();
	app.listen(port, () => console.log(`[Express] Server started on port ${port}`));
}

export {start};
