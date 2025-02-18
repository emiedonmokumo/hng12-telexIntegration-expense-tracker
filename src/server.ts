import app from "./app";
import cors from 'cors';
import path from 'path'
import dotenv from 'dotenv';
import { Request, Response } from "express";
import parseExpense from "./utils/parseExpense";
import sheets from "./config/googleSheet";
dotenv.config()

const PORT = process.env.PORT || 8080;

app.use(cors()) // configure when FE is connected

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Telex Webhook Endpoint
app.post('/webhook', async (req: Request, res: Response): Promise<any> => {
    try {
        const { text, sender } = req.body;
        const expense = parseExpense(text);
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
    res.sendFile(path.join(__dirname, 'config', 'telexIntegration.json'));
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});