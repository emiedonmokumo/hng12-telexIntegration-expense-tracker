import { Request, Response } from "express";
import parseExpense from "../utils/parseExpense";
import dotenv from 'dotenv';
import sheets from "../config/googleSheet";
dotenv.config();

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

export const telexWebhook = async (req: Request, res: Response): Promise<any> => {
    try {
        const { message, sender } = req.body;
        const expense = parseExpense(message);
        if (!expense) return res.status(200).send("No expense detected.");

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
};