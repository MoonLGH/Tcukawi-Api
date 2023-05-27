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
//     lastUpdated: Date; /c=Date of last time the api tested
// 	   results: Result[];
// }
// Expected Output Interface - END

// Expected Output Interface - START
// interface Result {
//     code: number;
//     message: object;
//     configuration: object;
// }
// Expected Output Interface - END
