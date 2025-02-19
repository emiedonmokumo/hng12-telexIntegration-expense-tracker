import { Response, Request } from "express";
import dotenv from 'dotenv';
dotenv.config();

export const telexJson = (req: Request, res: Response) => {
    const baseUrl = process.env.BASE_URL || "http://localhost:8080";

    try {
        const integration = {
            data: {
                date: {
                    created_at: "2025-02-18",
                    updated_at: "2025-02-18"
                },
                descriptions: {
                    app_name: "Google Sheets Expense Logger",
                    app_description: "Logs expenses from Telex messages into a Google Sheets spreadsheet.",
                    app_logo: "https://static.sheetgo.com/wp-content/uploads/2020/05/icons-expense-tracker.svg",
                    app_url: baseUrl,
                    background_color: "#00454F"
                },
                is_active: true,
                integration_type: "output",
                integration_category: "Finance & Payments",
                author: "Emiedonmokumo Dick-Boro",
                key_features: [
                    "Logs expenses from Telex messages into Google Sheets"
                ],
                output: [
                    {
                        label: "Google Sheets Logging",
                        value: true
                    }
                ],
                settings: [
                    {
                        label: "Spreadsheet ID",
                        type: "text",
                        required: true,
                        default: "your-spreadsheet-id",
                        description: "Google Sheets Spreadsheet ID where expenses will be logged."
                    }
                ],
                target_url: `${baseUrl}/webhook`
            }
        };

        res.status(200).json(integration);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}