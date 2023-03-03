//Requires
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const { Deepgram } = require('@deepgram/sdk');
const fs = require('fs');

// Instances
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// The API key you created in step 1
const deepgramApiKey = process.env.DEEP_GRAM_API_KEY;

// Replace with your file path and audio mimetype
const pathToFile = 'D:/SEMESTER 9/CSE 491 Graduation Project 1/Grad Test Files/Honda/Honda/_- reading001.mp3';
const mimetype = 'audio/mpeg';

// Initializes the Deepgram SDK
const deepgram = new Deepgram(deepgramApiKey);

//To connect to database
const dbURI = process.env.MONGO_DB_URI;

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
app.get("/", (req, res) => {

    deepgram.transcription.preRecorded(
        { buffer: fs.readFileSync(pathToFile), mimetype },
        { punctuate: true, language: 'en-US' },
      )
      .then((transcription) => {
        console.dir(transcription, {depth: null});
      })
      .catch((err) => {
        console.log(err);
      });

  return res.status(200).send({
    success: "true"
  })
});


//Route the request to the Speech2Text service
app.get("/request/speech2text", (req, res) => {
    return res.status(200).send({
        success: "true"
      })
});
