import app from "./app";
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
// import { HfInference } from "@huggingface/inference";
import { telexJson } from "./controllers/telexIntegration";
import { telexWebhook } from "./controllers/telexWebhook";
dotenv.config()

const PORT = process.env.PORT || 8080;
// const hf = new HfInference(process.env.HUGGING_FACE_TOKEN);

const allowedOrigins = [
    "https://telex.im",
    "https://staging.telex.im",
    "http://telextest.im",
    "http://staging.telextest.im",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

// app.use(cors());
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(bodyParser.json()); // Redundant but ensures JSON parsing
app.use(bodyParser.urlencoded({ extended: true })); // Redundant but ensures URL-encoded parsing

// app.post('/test', async (req: Request, res: Response) => {
//     const result = await hf.textGeneration({
//         model: "gpt2",
//         inputs: "Hello world",
//     });

//     res.status(200).json({ message: result });
// })


// Telex Webhook Endpoint
app.post('/webhook', telexWebhook);

// Serve the Telex JSON file
app.use("/telex-integration.json", telexJson);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});