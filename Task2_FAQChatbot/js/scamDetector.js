export function detectScam(text) {

    text = text.toLowerCase();

    const indicators = {
        "otp": 2,
        "click here": 3,
        "urgent": 2,
        "winner": 3,
        "lottery": 3,
        "claim prize": 3,
        "verify account": 2,
        "password": 2,
        "bank account": 2,
        "free money": 3,
        "gift card": 2
    };

    let score = 0;
    let reasons = [];

    for (const key in indicators) {

        if (text.includes(key)) {
            score += indicators[key];
            reasons.push(key);
        }

    }

    if (score >= 8) {

        return {
            risk: "HIGH 🔴",
            reasons
        };

    }

    if (score >= 4) {

        return {
            risk: "MEDIUM 🟠",
            reasons
        };

    }

    return null;
}
