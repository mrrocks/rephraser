const express = require("express");
const router = express.Router();

const rephraseController = require("../controllers/rephraseController");

router.post("/", rephraseController.rephrase);

module.exports = router;
