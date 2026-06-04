

export const MOCK_CUSTOMERS = {
 
  "ABCDE1234F": {
    fullName: "Ravi Kumar Sharma",
    dob: "1988-05-14",
    mobile: "9876543210",
    gstin: "29ABCDE1234F1Z5",
    businessName: "Sharma Distributors",
  },
  
  "ZZZZZ9999Z": {
    fullName: "Anita Desai",
    dob: "1992-11-02",
    mobile: "9765432109",
    gstin: null,
    businessName: null,
  },
  
  "MISMATCH5A": {
    fullName: "Priya Patel",
    dob: "1985-08-22",
    mobile: "9876512345",
    gstin: "27MISMATCH5A1Z9",
    businessName: "Patel Enterprises",
  },
};

export const MOCK_GST_DATA = {
  "29ABCDE1234F1Z5": {
    businessName: "Sharma Distributors",
    businessType: "Proprietorship",
    address: "123, Main Market, Mumbai - 400001",
    regDate: "2015-03-10",
  },
  "27MISMATCH5A1Z9": {
    businessName: "Patel Enterprises",
    businessType: "Partnership",
    address: "456, Industrial Area, Pune - 411045",
    regDate: "2018-07-15",
  },
  
  "INCOMPLETE7G": {
    businessName: "Test Business",
    businessType: null,
    address: null,
    regDate: "2020-01-01",
  },
};

export const MOCK_ITR_DATA = {
  "ABCDE1234F": {
    customerId: "CUST001",
    annualIncome: 1500000,
    filingYear: "2023-24",
  },
  "ZZZZZ9999Z": {
    customerId: "CUST002",
    annualIncome: 800000,
    filingYear: "2023-24",
  },
  "MISMATCH5A": {
    customerId: "CUST003",
    annualIncome: 2000000, 
    filingYear: "2023-24",
  },
};

export const MOCK_BANK_STATEMENTS = {
  "CUST001": {
    accountName: "Ravi Kumar Sharma",
    accountNumber: "****1234",
    inferredIncome: 1450000, 
    averageBalance: 250000,
  },
  "CUST002": {
    accountName: "Anita Desai",
    accountNumber: "****5678",
    inferredIncome: 750000,
    averageBalance: 120000,
  },
  "CUST003": {
    accountName: "Priya Patel",
    accountNumber: "****9012",
    inferredIncome: 1200000, 
    averageBalance: 180000,
  },
};


let mockOtpStorage = {
  currentOtp: null,
  expiresAt: null,
};

export function generateMockOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  mockOtpStorage = {
    currentOtp: otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  };
  return otp;
}

export function verifyMockOtp(inputOtp) {
  if (!mockOtpStorage.currentOtp) {
    return { verified: false, message: "No OTP was sent" };
  }
  if (Date.now() > mockOtpStorage.expiresAt) {
    return { verified: false, message: "OTP expired" };
  }
  if (inputOtp === mockOtpStorage.currentOtp) {
    return { verified: true, message: "OTP verified successfully" };
  }
  return { verified: false, message: "Incorrect OTP" };
}
