import { google } from 'googleapis'
import dotenv from 'dotenv'
dotenv.config()

// Google Sheets Setup
const auth = new google.auth.GoogleAuth({
    // keyFile: "./hng12-telex-integration-436ad7397b76.json", // Store credentials here
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handling the private key's newline characters
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });


export default sheets