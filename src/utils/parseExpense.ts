import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as any);

async function parseExpense(text: any): Promise<any> {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    Read and understand the following text to extract structured data from it.
    Extract structured expense details from the following text and return it as a JSON object with the following fields:
    - sender (string)
    - amount (number)
    - currency (string)
    - category (string)
    - date (YYYY-MM-DD format)
    
    Example Output:
    {"sender": "john doe", "amount": 150, "currency": "USD", "category": "Transportation", "date": "2022-04-15"}
  
    Text: """${text}"""
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonResponse: any = response.text();

        return JSON.parse(jsonResponse); // Ensure it's valid JSON
    } catch (error) {
        console.error("Error parsing expense:", error);
        return null;
    }
}


export default parseExpense;
