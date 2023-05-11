import {Router} from "express";
const router = Router();

// Documentation - START
// GET : /test/
// body : false
// NPM : api.call.test()
// Expected Output : TestOutput
// Documentation - END
router.get("/", (req, res) => {
	res.status(200).json({message: "Hello World!"});
});


// Documentation - START
// POST : /test/bodyTest
// body : true
// bodyObject : {message:"ANYMESSAGE"}
// NPM : api.call.test.bodyTest(message)
// bodyTestInput : {message:"Test"}
// Expected Output : TestOutput
// Documentation - END
router.post("/bodyTest", (req, res) => {
	const {message} = req.body;
	if (!message) return res.status(400).json({message: "No message provided"});
	res.status(200).json({message: message});
});

// Documentation - START
// GET : /test/paramsTest
// body : false
// params : true
// paramsTest : {message:"Hello, World"}
// NPM : api.call.downloader.paramsTest(message)
// Expected Output : TestOutput
// Documentation - END
router.get("/paramsTest", (req, res) => {
	const {message} = req.query;
	if (!message) return res.status(400).json({message: "No message provided"});
	res.status(200).json({message: message});
});

export default router;


// Expected Output Interface - START
// interface TestOutput {
//     message: string;
// }
// Expected Output Interface - END

// Expected Output Interface - START
// interface TestOutput1 {
//     message: string;
// }
// Expected Output Interface - END
