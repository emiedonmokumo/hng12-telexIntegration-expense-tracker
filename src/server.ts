import app from "./app";
import cors from 'cors';
import path from 'path'
import dotenv from 'dotenv';
import express, { Request, Response } from "express";
import parseExpense from "./utils/parseExpense";
import sheets from "./config/googleSheet";
import bodyParser from "body-parser";
import { HfInference } from "@huggingface/inference";
dotenv.config()

const PORT = process.env.PORT || 8080;
const hf = new HfInference(process.env.HUGGING_FACE_TOKEN);

// const allowedOrigins = [
//     "https://telex.im",
//     "https://staging.telex.im",
//     "http://telextest.im",
//     "http://staging.telextest.im",
// ];

// app.use(
//     cors({
//         origin: (origin, callback) => {
//             if (!origin || allowedOrigins.includes(origin)) {
//                 callback(null, true);
//             } else {
//                 callback(new Error("Not allowed by CORS"));
//             }
//         },
//         credentials: true,
//     })
// );

app.use(cors());
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(bodyParser.json()); // Redundant but ensures JSON parsing
app.use(bodyParser.urlencoded({ extended: true })); // Redundant but ensures URL-encoded parsing

app.post('/test', async (req: Request, res: Response) => {
    const result = await hf.textGeneration({
        model: "gpt2",
        inputs: "Hello world",
    });

    res.status(200).json({ message: result });
})


const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Telex Webhook Endpoint
app.post('/webhook', async (req: Request, res: Response): Promise<any> => {
    try {
        const { message, sender } = req.body;
        const expense = parseExpense(message);
        if (!expense) return res.status(400).send("No expense detected.");

        // Save to Google Sheets
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "Expenses!A:D",
            valueInputOption: "RAW",
            requestBody: {
                values: [[expense.date, expense.amount, expense.currency, expense.category, sender]],
            },
        });

        res.status(200).send("Expense logged successfully");
    } catch (error) {
        console.error("Error logging expense:", error);
        res.status(500).send("Internal Server Error");
    }
});


// Serve the Telex JSON file
app.get("/telex-integration.json", (req, res) => {
    const baseUrl = process.env.BASE_URL;
    const integration = {
        data: {
            date: {
                created_at: "2025-02-18",
                updated_at: "2025-02-18",
            },
            descriptions: {
                app_name: "Google Sheets Expense Logger",
                app_description: "Logs expenses from Telex messages into a Google Sheets spreadsheet.",
                app_logo: "https://static.sheetgo.com/wp-content/uploads/2020/05/icons-expense-tracker.svg",
                app_url: baseUrl,
                background_color: "#00454F",
            },
            is_active: true,
            integration_type: "output",
            key_features: ["- Logs expenses from Telex messages into Google Sheets"],
            integration_category: "Finance & Payments",
            author: "Emiedonmokumo Dick-Boro",
            website: baseUrl,
            settings: [
                {
                    label: "spreadsheet_id",
                    type: "string",
                    required: true,
                    description: "Google Sheets Spreadsheet ID where expenses will be logged.",
                },
            ],
            target_url: `${baseUrl}/webhook`,
        },
    };

    res.json(integration);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});