//Requires
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const { Deepgram } = require("@deepgram/sdk");

// Instances
const app = express();

const mimetype = 'audio/mpeg';

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

// The API key you created in step 1
const deepgramApiKey = process.env.DEEP_GRAM_API_KEY;

// Initializes the Deepgram SDK
const deepgram = new Deepgram(deepgramApiKey);

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

// Proxy request
app.post("/request/speech2text", (req, res) => {

  const audioBuffer = Buffer.from(req.body.buffer.data, 'binary');
    deepgram.transcription
        .preRecorded(
            { buffer: audioBuffer, mimetype },
            { punctuate: true, language: "en-US" }
        )
        .then((transcription) => {
            console.dir(transcription, { depth: null });
        })
        .catch((err) => {
            console.log(err);
        });

    return res.status(200).send({
        success: "true",
    });
});

