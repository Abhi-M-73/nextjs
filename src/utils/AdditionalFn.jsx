export const dateFormatter = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

export const maskEmail = (email = "") => {
    if (typeof email !== "string" || !email.includes("@")) return email;
    const [local, domain] = email.split("@");
    const visibleCount = Math.min(local.length, 3);
    const visible = local.slice(0, visibleCount);
    const masked = "*".repeat(local.length - visibleCount);
    return `${visible}${masked}@${domain}`;
};


export const maskPhoneNumber = (phoneNumber) => {
    if (phoneNumber.length < 4) return phoneNumber;
    const startDigits = phoneNumber.slice(0, 2);
    const endDigits = phoneNumber.slice(-2);
    const maskedSection = "*".repeat(phoneNumber.length - 4);
    return `${startDigits}${maskedSection}${endDigits}`;
};

export const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(amount);
}

export const formatPercentage = (value) => {
    return `${value}%`;
}

export const legButton = (leg) => {
    return (
        <button className={`${leg === "left" ? "bg-blue-600" : leg === "right" ? "bg-green-600" : "bg-red-500"} text-white px-3 py-1 rounded-full capitalize text-xs`}>
            {leg ? leg : "N/A"}
        </button>
    )
}

export const levelButton = (level) => {
    if (!level) return null;
    let bgColor = 'bg-gray-500';
    if (level === '1') return bgColor = 'bg-gray-600';
    if (level === '2') return bgColor = 'bg-blue-500';
    if (level === '3') return bgColor = 'bg-green-500';
    if (level === '4') return bgColor = 'bg-yellow-500';
    if (level === '5') return bgColor = 'bg-purple-500';
    return (
        <button className={`${bgColor} text-white px-3 py-1 rounded-full capitalize text-xs`}>
            Level {level}
        </button>
    )
}