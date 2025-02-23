// Expense Parsing Function
function parseExpense(text: string) {
    const regex = /(?<amount>\d+(?:\.\d{1,2})?)\s*(?<currency>[\$€₦£¥]|(?:USD|EUR|NGN|GBP|JPY|CAD|AUD|INR|CNY|ZAR|KES|GHS|SGD|BRL|MXN))?\s*(?<category>.+)?/i;
    const match = text.match(regex);
    if (!match || !match.groups) return null;

    return {
        amount: parseFloat(match.groups.amount),
        currency: match.groups.currency?.toUpperCase() || "USD",
        category: match.groups.category?.trim() || "Uncategorized",
        date: new Date().toISOString().split("T")[0],
    };
}

export default parseExpense;
