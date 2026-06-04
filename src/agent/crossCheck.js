export function checkIncomeConsistency(itrIncome, bankInferredIncome) {
  if (itrIncome == null || bankInferredIncome == null) {
    return null;
  }

  const gap = Math.abs(itrIncome - bankInferredIncome) / itrIncome;
  const tolerance = 0.2;

  if (gap > tolerance) {
    return `Income mismatch: ITR shows ₹${itrIncome.toLocaleString()}, but bank statement suggests ₹${bankInferredIncome.toLocaleString()} (${(gap * 100).toFixed(0)}% difference). Please confirm which is correct.`;
  }

  return null;
}

export function checkNameConsistency(panName, bankAccountName) {
  if (!panName || !bankAccountName) {
    return null;
  }

  const panWords = panName.toLowerCase().split(" ");
  const bankWords = bankAccountName.toLowerCase().split(" ");

  let matchCount = 0;
  for (const panWord of panWords) {
    if (bankWords.some(bankWord => bankWord.includes(panWord) || panWord.includes(bankWord))) {
      matchCount++;
    }
  }

  if (matchCount < 2) {
    return `Name mismatch: PAN shows "${panName}" but bank account shows "${bankAccountName}". Please confirm the correct name.`;
  }

  return null;
}

export function validateGstFormat(gstin) {
  if (!gstin || gstin === "Not available") {
    return null;
  }

  const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  if (!gstinPattern.test(gstin)) {
    return `GSTIN format appears invalid: ${gstin}. Please verify.`;
  }

  return null;
}

export function runAllCrossChecks(data) {
  const flags = [];

  if (data.itrIncome && data.bankInferredIncome) {
    const incomeFlag = checkIncomeConsistency(data.itrIncome, data.bankInferredIncome);
    if (incomeFlag) flags.push(incomeFlag);
  }

  if (data.fullName && data.bankAccountName) {
    const nameFlag = checkNameConsistency(data.fullName, data.bankAccountName);
    if (nameFlag) flags.push(nameFlag);
  }

  if (data.gstin) {
    const gstFlag = validateGstFormat(data.gstin);
    if (gstFlag) flags.push(gstFlag);
  }

  return flags;
}