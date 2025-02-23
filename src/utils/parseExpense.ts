import currencySymbolMap from "currency-symbol-map";
import OpenAI from "openai";

function parseExpense(text: string) {
    console.log("Received message:", JSON.stringify(text)); // Debugging log

    text = text.normalize("NFC"); // Normalize Unicode

    const regex = /(?<currency>[\$\€\u20A6\£\¥])?\s*(?<amount>\d+(?:[.,]\d{1,2})?)\s*(?<category>.+)?/i;
    const match = text.match(regex);
    if (!match || !match.groups) return null;

    const detectedCurrency = text.includes("₦") ? "₦" : match.groups.currency || "USD"; // Force Naira check

    return {
        amount: parseFloat(match.groups.amount.replace(',', '')),
        currency: detectedCurrency,
        category: match.groups.category?.trim() || "Uncategorized",
        date: new Date().toISOString().split("T")[0],
    };
}




// const openaiKey = process.env.OPENAI_API_KEY

// const openai = new OpenAI({
//   apiKey: openaiKey,
// });

// async function parseExpense(text: string) {
//   try {
//     // Call the OpenAI API using the library
//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',  // Updated model name
//       messages: [
//         {
//           role: 'user',
//           content: `testing to see if the api key is valid`,
//         },
//       ],
//     });

//     // Extract the relevant content from the response

//     return response;
//   } catch (err: any) {
//     console.error('Error:', err.message);
//     return null;
//   }
// }

export default parseExpense;
