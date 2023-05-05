import {Router} from "express";
const router = Router();

// GET : /test/
// body : false
// NPM : api.call.test()
// EOL
router.get("/", (req, res) => {
	res.status(200).json({message: "Hello World!"});
});


// POST : /test/bodyTest
// body : true
// bodyObject : {message:"ANYMESSAGE"}
// NPM : api.call.test.bodyTest(message)
// EOL
router.post("/bodyTest", (req, res) => {
	const {message} = req.body;
	if (!message) return res.status(400).json({message: "No message provided"});
	res.status(200).json({message: message});
});

export default router;
