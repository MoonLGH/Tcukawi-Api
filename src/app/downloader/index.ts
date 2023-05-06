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
// TestInput : {message:"Test"}
// Expected Output : TestOutput
// Documentation - END
router.post("/bodyTest", (req, res) => {
	const {message} = req.body;
	if (!message) return res.status(400).json({message: "No message provided"});
	res.status(200).json({message: message});
});

export default router;


// Expected Output Interface - START
// interface TestOutput {
//     message: string;
// }
// Expected Output Interface - END
