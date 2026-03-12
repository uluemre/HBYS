const validateTC = (tc) => {
    if (tc.length !== 11 || tc[0] === '0') return false;
    const digits = tc.split('').map(Number);
    const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
    const digit10 = ((oddSum * 7) - evenSum) % 10;
    const totalSum = digits.slice(0, 10).reduce((a, b) => a + b, 0);
    const digit11 = totalSum % 10;
    return digits[9] === digit10 && digits[10] === digit11;
};

export default validateTC;