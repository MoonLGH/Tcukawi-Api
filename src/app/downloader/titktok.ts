import axios from "axios";
import {Router} from "express";
const router = Router();

// Documentation - START
// GET : /downloader/tiktok
// body : false
// params : true
// paramsTest : {link:"https\\://www.tiktok.com/@ratherbebaby/video/7229359225141513499"}
// NPM : api.call.test()
// Expected Output : TikTokOutput
// Documentation - END
router.get("/tiktok", async (req, res) => {
	const {link} = req.query;
	if (!link) return res.status(400).json({message: "No link provided"});
	const query = link;
	try {
		const response = await axios("https://lovetik.com/api/ajax/search", {
			method: "POST",
			data: new URLSearchParams((Object.entries({query}) as unknown as string)),
		});

		const caption = `${response.data.desc} + ${response.data.author}`;

		return res.status(200).json({caption, noWM: response.data.links[0].a, WM: response.data.links[1].a});
	} catch (e) {
		return res.status(400).json({message: "Invalid link or Error"});
	}
});


export default router;


// Expected Output Interface - START
// interface TikTokOutput {
// 	caption: string;
// 	noWM: string;
// 	WM: string;
// }
// Expected Output Interface - END
