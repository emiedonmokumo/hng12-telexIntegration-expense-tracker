// Expense Parsing Function
function parseExpense(text: string) {
    const regex = /(?<amount>\d+(?:\.\d{1,2})?)\s*(?<currency>[\$€₦£¥])?(?<category>.+)?/i;
    const match: any = text.match(regex);
    if (!match) return null;

    return {
        amount: match.groups.amount,
        currency: match.groups.currency || "USD",
        category: match.groups.category?.trim() || "Uncategorized",
        date: new Date().toISOString().split("T")[0],
    };
}

export default parseExpense;