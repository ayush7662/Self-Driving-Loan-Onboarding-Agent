
import { fetchByPan, fetchGst, sendOtp, verifyOtp, fetchItr, fetchBankStatement } from "../mock/mockApi.js";
import { checkIncomeConsistency, checkNameConsistency } from "./crossCheck.js";

// Helper to safely set field values
const safeSet = (value) => (value != null ? value : "Not available");


export const STATES = {
  
  INITIAL: {
    prompt: "Hi! I'll help you set up your loan application. To get started, please share your PAN number.",
    onReply: async (pan, setField, setFieldStatus, context) => {
      const record = await fetchByPan(pan);

      if (!record) {
        return {
          next: "INITIAL",
          say: "I couldn't find any record for that PAN. Could you please check and re-enter it?",
          context: { ...context },
        };
      }

      // Fill basic fields
      setField("fullName", safeSet(record.fullName));
      setField("dob", safeSet(record.dob));
      setField("mobile", safeSet(record.mobile));
      setField("gstin", safeSet(record.gstin));
      setField("businessName", safeSet(record.businessName));

      // Set statuses
      setFieldStatus("fullName", "filled");
      setFieldStatus("dob", "filled");
      setFieldStatus("mobile", "filled");
      setFieldStatus("gstin", record.gstin ? "filled" : "not-available");
      setFieldStatus("businessName", record.businessName ? "filled" : "not-available");

      return {
        next: "ASK_GST_CONSENT",
        say: `Thanks, ${record.fullName}! I've pre-filled your basic details. May I fetch your GST business details? (yes/no)`,
        context: { ...context, pan, customerData: record },
      };
    },
  },

  
  ASK_GST_CONSENT: {
    prompt: "May I fetch your GST business details? (yes/no)",
    onReply: async (reply, setField, setFieldStatus, context) => {
      const normalizedReply = reply.trim().toLowerCase();

      if (normalizedReply === "yes" || normalizedReply === "y") {
        if (!context.customerData.gstin || context.customerData.gstin === "Not available") {
          return {
            next: "ASK_OTP_CONSENT",
            say: "I see you don't have a GSTIN linked. That's fine - I've marked GST fields as 'Not available'. Let's proceed to mandatory mobile verification.",
            context: { ...context },
          };
        }

        const gstData = await fetchGst(context.customerData.gstin);

        if (!gstData) {
          setFieldStatus("gstin", "not-available");
          setFieldStatus("businessName", "not-available");
          setFieldStatus("businessType", "not-available");
          setFieldStatus("businessAddress", "not-available");
          setFieldStatus("gstRegDate", "not-available");

          return {
            next: "ASK_OTP_CONSENT",
            say: "I couldn't fetch your GST details. I've marked those fields as 'Not available'. Let's proceed to mandatory mobile verification.",
            context: { ...context },
          };
        }

        // Fill GST fields
        setField("businessName", safeSet(gstData.businessName));
        setField("businessType", safeSet(gstData.businessType));
        setField("businessAddress", safeSet(gstData.address));
        setField("gstRegDate", safeSet(gstData.regDate));

        // Set statuses
        setFieldStatus("businessName", gstData.businessName ? "filled" : "not-available");
        setFieldStatus("businessType", gstData.businessType ? "filled" : "not-available");
        setFieldStatus("businessAddress", gstData.address ? "filled" : "not-available");
        setFieldStatus("gstRegDate", gstData.regDate ? "filled" : "not-available");

        return {
          next: "ASK_OTP_CONSENT",
          say: "Great! I've fetched your GST business details. Now, for security, I'll send an OTP to your registered mobile. This is mandatory for your application security.",
          context: { ...context, gstData },
        };
      } else {
        // User declined GST - mark as not available and proceed to OTP (which is mandatory)
        setFieldStatus("businessType", "not-available");
        setFieldStatus("businessAddress", "not-available");
        setFieldStatus("gstRegDate", "not-available");
        return {
          next: "ASK_OTP_CONSENT",
          say: "No problem. I've marked GST fields as 'Not available'. Now, for security, I'll send an OTP to your registered mobile. This is mandatory for your application security.",
          context: { ...context },
        };
      }
    },
  },

  
  ASK_OTP_CONSENT: {
    prompt: "I'll send an OTP to your registered mobile for verification. This is mandatory for security.",
    onReply: async (reply, setField, setFieldStatus, context) => {
      const result = await sendOtp(context.customerData.mobile);
      return {
        next: "ASK_OTP",
        say: `${result.message}. Please enter the OTP you received. Check your browser console for the OTP (for testing).`,
        context: { ...context },
      };
    },
  },

  
  ASK_OTP: {
    prompt: "Please enter the OTP you received.",
    onReply: async (otp, setField, setFieldStatus, context) => {
      const result = await verifyOtp(otp.trim());

      if (result.verified) {
        setFieldStatus("mobile", "filled");
        return {
          next: "ASK_DOCUMENTS",
          say: "Mobile verified successfully! Now, I need your documents to complete your application. Please upload your ITR (Income Tax Return). Type 'upload' to simulate.",
          context: { ...context, otpVerified: true },
        };
      } else {
        return {
          next: "ASK_OTP",
          say: `${result.message}. Please try again. OTP verification is mandatory - you cannot proceed without it.`,
          context: { ...context },
        };
      }
    },
  },

 
  ASK_DOCUMENTS: {
    prompt: "Please upload your ITR (Income Tax Return). Type 'upload' to simulate.",
    onReply: async (reply, setField, setFieldStatus, context) => {
      const normalizedReply = reply.trim().toLowerCase();

      if (normalizedReply === "upload" || normalizedReply === "done") {
        const itrData = await fetchItr(context.pan);

        if (!itrData) {
          setFieldStatus("itrIncome", "not-available");
          setFieldStatus("itrFilingYear", "not-available");
          return {
            next: "ASK_BANK_STATEMENT",
            say: "I couldn't fetch your ITR data. I've marked income as 'Not available'. Now please upload your bank statement. Type 'upload' to simulate.",
            context: { ...context },
          };
        }

        setField("itrIncome", safeSet(itrData.annualIncome));
        setField("itrFilingYear", safeSet(itrData.filingYear));
        setFieldStatus("itrIncome", "filled");
        setFieldStatus("itrFilingYear", "filled");

        return {
          next: "ASK_BANK_STATEMENT",
          say: `Got your ITR! Annual income: ₹${itrData.annualIncome.toLocaleString()}. Now please upload your bank statement. Type 'upload' to simulate.`,
          context: { ...context, itrData, customerId: itrData.customerId },
        };
      } else {
        return {
          next: "ASK_DOCUMENTS",
          say: "Please type 'upload' to simulate uploading your ITR. ITR is required for your application.",
          context: { ...context },
        };
      }
    },
  },

  
  ASK_BANK_STATEMENT: {
    prompt: "Please upload your bank statement. Type 'upload' to simulate.",
    onReply: async (reply, setField, setFieldStatus, context) => {
      const normalizedReply = reply.trim().toLowerCase();

      if (normalizedReply === "upload" || normalizedReply === "done") {
        if (!context.customerId) {
          setFieldStatus("bankInferredIncome", "not-available");
          setFieldStatus("bankAccountName", "not-available");
          setFieldStatus("averageBalance", "not-available");
          return {
            next: "CROSS_CHECK",
            say: "I couldn't fetch bank statement data without customer ID. I've marked those fields as 'Not available'. Let me cross-check what we have.",
            context: { ...context },
          };
        }

        const bankData = await fetchBankStatement(context.customerId);

        if (!bankData) {
          setFieldStatus("bankInferredIncome", "not-available");
          setFieldStatus("bankAccountName", "not-available");
          setFieldStatus("averageBalance", "not-available");
          return {
            next: "CROSS_CHECK",
            say: "I couldn't fetch your bank statement. I've marked those fields as 'Not available'. Let me cross-check what we have.",
            context: { ...context },
          };
        }

        setField("bankInferredIncome", safeSet(bankData.inferredIncome));
        setField("bankAccountName", safeSet(bankData.accountName));
        setField("averageBalance", safeSet(bankData.averageBalance));
        setFieldStatus("bankInferredIncome", "filled");
        setFieldStatus("bankAccountName", "filled");
        setFieldStatus("averageBalance", "filled");

        return {
          next: "CROSS_CHECK",
          say: "Got your bank statement! Now let me cross-check all the documents for consistency.",
          context: { ...context, bankData },
        };
      } else {
        return {
          next: "ASK_BANK_STATEMENT",
          say: "Please type 'upload' to simulate uploading your bank statement. Bank statement is required for your application.",
          context: { ...context },
        };
      }
    },
  },

  
  CROSS_CHECK: {
    prompt: "Cross-checking documents...",
    onReply: async (reply, setField, setFieldStatus, context) => {
      const flags = [];

      // Check income consistency
      if (context.itrData && context.bankData) {
        const incomeFlag = checkIncomeConsistency(context.itrData.annualIncome, context.bankData.inferredIncome);
        if (incomeFlag) {
          flags.push(incomeFlag);
          setFieldStatus("itrIncome", "flagged");
          setFieldStatus("bankInferredIncome", "flagged");
        }
      }

      // Check name consistency
      if (context.customerData && context.bankData) {
        const nameFlag = checkNameConsistency(context.customerData.fullName, context.bankData.accountName);
        if (nameFlag) {
          flags.push(nameFlag);
          setFieldStatus("fullName", "flagged");
          setFieldStatus("bankAccountName", "flagged");
        }
      }

      if (flags.length > 0) {
        return {
          next: "RESOLVE_FLAGS",
          say: `I found ${flags.length} issue(s) that need review:\n\n${flags.map((f, i) => `${i + 1}. ${f}`).join("\n")}\n\nPlease provide the correct value or confirm if the data is accurate.`,
          context: { ...context, flags },
        };
      }

      // Only mark complete if OTP was verified
      if (!context.otpVerified) {
        return {
          next: "ASK_OTP",
          say: "Security check failed: OTP verification is required. Please complete OTP verification first.",
          context: { ...context },
        };
      }

      return {
        next: "COMPLETE",
        say: "All documents cross-checked successfully! Your application looks good and is ready for human review.",
        context: { ...context },
      };
    },
  },

 
  RESOLVE_FLAGS: {
    prompt: "Please provide the correct value or confirm if the data is accurate.",
    onReply: async (reply, setField, setFieldStatus, context) => {
      const normalizedReply = reply.trim().toLowerCase();

      // Check if this is an income mismatch case (MISMATCH5A scenario)
      const hasIncomeMismatch = context.flags && context.flags.some(f => f.includes("Income mismatch"));
      
      if (hasIncomeMismatch) {
        // For income mismatch, ask specific follow-up question
        if (normalizedReply === "confirmed") {
          setFieldStatus("itrIncome", "filled");
          setFieldStatus("bankInferredIncome", "filled");
          return {
            next: "COMPLETE",
            say: "You've confirmed the income values. Please note: ITR shows ₹20,00,000 and bank statement shows ₹12,00,000. This significant difference will be reviewed by a human underwriter. Your application is now ready for review.",
            context: { ...context },
          };
        } else {
          // User provided a specific value - update the field
          // For prototype, we'll assume they're confirming the ITR value
          setFieldStatus("itrIncome", "filled");
          setFieldStatus("bankInferredIncome", "filled");
          return {
            next: "COMPLETE",
            say: `Thanks for the clarification. I've noted your input: "${reply}". This will be reviewed by a human underwriter. Your application is now ready for review.`,
            context: { ...context },
          };
        }
      }

      // General flag resolution
      if (normalizedReply === "confirmed") {
        // Clear flags
        setFieldStatus("itrIncome", "filled");
        setFieldStatus("bankInferredIncome", "filled");
        setFieldStatus("fullName", "filled");
        setFieldStatus("bankAccountName", "filled");

        return {
          next: "COMPLETE",
          say: "Thanks for confirming. Your application is now complete and ready for human review.",
          context: { ...context },
        };
      } else {
        // User provided correction - accept it and clear flags
        setFieldStatus("itrIncome", "filled");
        setFieldStatus("bankInferredIncome", "filled");
        setFieldStatus("fullName", "filled");
        setFieldStatus("bankAccountName", "filled");

        return {
          next: "COMPLETE",
          say: `Thanks for the correction: "${reply}". I've updated the application. Your application is now complete and ready for human review.`,
          context: { ...context },
        };
      }
    },
  },

 
  COMPLETE: {
    prompt: "Application complete!",
    onReply: async (reply, setField, setFieldStatus, context) => {
      return {
        next: "COMPLETE",
        say: "Your application is complete and ready for human review. A reviewer will assess it shortly. Thank you!",
        context: { ...context },
      };
    },
  },
};

// Get the initial state
export function getInitialState() {
  return {
    currentState: "INITIAL",
    prompt: STATES.INITIAL.prompt,
    context: {},
  };
}
