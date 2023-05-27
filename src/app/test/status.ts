import {Router} from "express";
import {cacheStatus} from "../../util/variables.js";
const router = Router();

// Documentation - START
// GET : /test/APIStatus
// body : false
// NPM : api.call.test.APIStatus()
// Expected Output : statusResponse[]
// Documentation - END
router.get("/APIStatus", async (req, res) => {
	res.status(200).json(cacheStatus);
});

export default router;
// Expected Output Interface - START
// interface statusResponse {
//     code: string;
//     message: string;
// }
// Expected Output Interface - END
