
import { MOCK_CUSTOMERS, MOCK_GST_DATA, MOCK_ITR_DATA, MOCK_BANK_STATEMENTS, generateMockOtp, verifyMockOtp } from "./mockData.js";


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


export async function fetchByPan(pan) {
  await delay(900);
  const record = MOCK_CUSTOMERS[pan.trim().toUpperCase()] || null;
  return record;
}


export async function fetchGst(gstin) {
  await delay(800);
  const record = MOCK_GST_DATA[gstin.trim().toUpperCase()] || null;
  return record;
}


export async function sendOtp(mobile) {
  await delay(600);
  const otp = generateMockOtp();
  console.log(`[MOCK] OTP sent to ${mobile}: ${otp}`); // For testing
  return { sent: true, message: `OTP sent to ${mobile}` };
}


export async function verifyOtp(code) {
  await delay(400);
  const result = verifyMockOtp(code);
  return result;
}


export async function fetchItr(customerId) {
  await delay(1000);
  const record = MOCK_ITR_DATA[customerId] || null;
  return record;
}


export async function fetchBankStatement(customerId) {
  await delay(1100);
  const record = MOCK_BANK_STATEMENTS[customerId] || null;
  return record;
}
