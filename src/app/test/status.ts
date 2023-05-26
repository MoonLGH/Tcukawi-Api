import {Router} from "express";
const router = Router();
import {endpointTest} from "../../util/test.js";
import {ready} from "../index.js";

// Documentation - START
// GET : /test/APIStatus
// body : false
// NPM : api.call.test.APIStatus()
// Expected Output : statusResponse[]
// Documentation - END
router.get("/APIStatus", async (req, res) => {
	if (ready === true) {
		try {
			const result = await endpointTest();
			res.status(200).json(result);
		} catch (error) {
			res.status(500).json({code: "500", message: "Server not ready"});
		}
	} else {
		res.status(500).json({code: "500", message: "Server not ready"});
	}
});

export default router;
// Expected Output Interface - START
// interface statusResponse {
//     code: string;
//     message: string;
// }
// Expected Output Interface - END
