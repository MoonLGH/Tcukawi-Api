import {Router} from "express";
const router = Router();

// Documentation - START
// POST : /test/errorTest
// NPM : api.call.test.errorTest()
// Expected Output : Error[400]
// Documentation - END
router.post("/errorTest", (req, res) => {
	return res.status(400).json({message: "Error successfully thrown"});
});

export default router;
