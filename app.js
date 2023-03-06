//Requires
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const { Deepgram } = require("@deepgram/sdk");
const TextModel = require("./resources/Text/text.model");

// Instances
const app = express();

const mimetype = "audio/mpeg";

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

// The API key you created in step 1
const deepgramApiKey = process.env.DEEP_GRAM_API_KEY;

// Initializes the Deepgram SDK
const deepgram = new Deepgram(deepgramApiKey);

// Connect to the database
mongoose
    .connect(process.env.MONGO_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((result) => {
        app.listen(process.env.PORT || 4001);
        console.log(`Example app listening on port ${process.env.PORT}`);
    })
    .catch((err) => console.log(err));

// Transform from speech to text
app.post("/request/speech2text", async (req, res) => {
    // Take user id
    const userid = req.body.userid;

    // Use deepgram to convert from audio to text
    const audioBuffer = Buffer.from(req.body.buffer.data, "binary");

    try {
        const transcription = await deepgram.transcription.preRecorded(
            { buffer: audioBuffer, mimetype },
            { punctuate: true, language: "en-US" }
        );

        // Extract the transcript
        const extractedText =
            transcription.results.channels[0].alternatives[0].transcript;

        // Save to database
        const text = new TextModel({
            textContent: extractedText,
            userID: userid,
        });

        // Save instance to mongoDB
        const textSaved = await text.save();

        return res.status(200).send({
            success: true,
            message: "Text created successfully.",
            text: {
                id: textSaved._id,
                userID: textSaved.userID,
            },
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error: err,
        });
    }
});
