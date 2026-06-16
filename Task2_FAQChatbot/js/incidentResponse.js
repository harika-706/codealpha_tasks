export function getIncidentResponse(query) {

    query = query.toLowerCase();

    // Instagram
    if (
    query.includes("instagram") &&
    (
        query.includes("hack") ||
        query.includes("hacked")
    )
) {
        return `📱 Instagram Account Hacked

1. Change your password immediately
2. Enable Two-Factor Authentication
3. Log out from all devices
4. Check recovery email and phone number
5. Contact Instagram support`;
    }

    // Gmail
    if (
        query.includes("gmail") &&
        query.includes("hack")
    ) {
        return `📧 Gmail Account Hacked

1. Change Gmail password
2. Check recent activity
3. Remove unknown devices
4. Enable Two-Factor Authentication
5. Review recovery settings`;
    }

    // WhatsApp
    if (
        query.includes("whatsapp") &&
        query.includes("hack")
    ) {
        return `💬 WhatsApp Account Hacked

1. Re-register using your phone number
2. Enable Two-Step Verification
3. Log out linked devices
4. Inform your contacts
5. Contact WhatsApp support if needed`;
    }

    // Facebook
    if (
        query.includes("facebook") &&
        query.includes("hack")
    ) {
        return `📘 Facebook Account Hacked

1. Change your password
2. Log out of unknown devices
3. Enable Two-Factor Authentication
4. Review account activity
5. Contact Facebook support`;
    }

    // OTP Shared
    if (
        query.includes("otp") &&
        (
            query.includes("share") ||
            query.includes("gave")
        )
    ) {
        return `⚠️ OTP Shared

1. Contact your bank immediately
2. Freeze suspicious transactions
3. Change banking passwords
4. Monitor account activity
5. Report fraud if money is lost`;
    }

    // UPI Fraud
    if (
        query.includes("upi") &&
        (
            query.includes("fraud") ||
            query.includes("scam")
        )
    ) {
        return `💳 UPI Fraud

1. Contact your bank immediately
2. Report through UPI app
3. Block further transactions
4. Save screenshots and evidence
5. Report cybercrime`;
    }

    if (
    query.includes("virus") ||
    query.includes("malware")
) {

    return `🚨 Possible Malware Infection

1. Disconnect from the internet
2. Run a full antivirus scan
3. Remove suspicious software
4. Update your operating system
5. Change important passwords`;
}

if (
    query.includes("card") &&
    (
        query.includes("stolen") ||
        query.includes("fraud")
    )
) {

    return `💳 Card Fraud

1. Block the card immediately
2. Contact your bank
3. Review recent transactions
4. Request a replacement card
5. File a fraud complaint if needed`;
}

if (
    query.includes("report cybercrime") ||
    query.includes("cyber complaint")
) {

    return `🚨 Reporting Cybercrime

1. Visit the National Cyber Crime Reporting Portal
2. Keep screenshots and evidence
3. Report the incident immediately
4. Contact your bank if financial fraud occurred`;
}

    return null;
}

