/* eslint-disable no-invalid-this */
import axios from "axios";
import {Router} from "express";
const router = Router();
import {load} from "cheerio";

// Documentation - START
// GET : /downloader/instagram
// body : false
// params : true
// paramsTest : {link:"https\\://www.instagram.com/p/CgTleJdOs4q/"}
// NPM : api.call.downloader.instagram(link)
// Expected Output : IGDLResponse
// Documentation - END

router.get("/instagram", async (req, res) => {
	const {link} = req.query;
	if (!link) return res.status(400).json({message: "No link provided"});
	try {
		const getData = await axios.get((link as string));
		const getResult = getData.data;
		const $ = load(getResult);
		const data = JSON.parse($("script").html()!);
		const media = [];
		for (const x of [...data.image, ...data.video]) media.push(x.url || x.contentUrl);
		return res.status(200).json({
			caption: data.articleBody, media,
		});
	} catch (e) {
		return res.status(400).json({message: "Invalid link"});
	}
});

export default router;


// Expected Output Interface - START
// interface IGDLResponse {
// 	caption: string;
// 	media: string[];
//   }
// Expected Output Interface - END
