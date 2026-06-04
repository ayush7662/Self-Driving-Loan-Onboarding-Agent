# Self-Driving Loan Onboarding Agent

A prototype of an AI-powered loan onboarding agent that takes initiative and never hallucinates. Built for the Neenv tech assignment.

### Live  URL: https://self-driving-loan-onboarding-agent.vercel.app/

## Overview

This prototype demonstrates a split-screen loan onboarding experience:
- **Left panel**: An intelligent chat agent that drives the conversation forward
- **Right panel**: A live application form that fills in real-time as the agent works

### Key Principles

1. **Agent takes initiative**: The agent always tells the user the next step. The user never has to guess what to do.
2. **Agent never hallucinates**: When data is missing, the agent outputs "Not available" instead of guessing. In lending, a made-up number is worse than a blank one.

## Tech Stack

- **React 18+** - UI framework
- **Vite** - Build tool and dev server
- **Plain CSS** - Styling
- **Mock data/APIs** - No real integrations

## Project Structure

```
loan-agent/
├── src/
│   ├── components/          # UI components
│   │   ├── ApplicationForm.jsx
│   │   ├── ChatPanel.jsx
│   │   ├── ChatInput.jsx
│   │   ├── FormField.jsx
│   │   └── MessageBubble.jsx
│   ├── agent/               # Agent logic
│   │   ├── agentEngine.js   # State machine
│   │   └── crossCheck.js    # Document validation
│   ├── mock/                # Fake data and APIs
│   │   ├── mockData.js      # Mock customers & documents
│   │   └── mockApi.js       # Simulated API calls
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── package.json
└── README.md
```

## How to Run

1. Install dependencies:
```bash
npm install
```

2. Start the dev server:
```bash
npm run dev
```

3. Open the URL shown in the terminal (typically `http://localhost:5173`)

## Test Scenarios

```
"ABCDE1234F": {
    fullName: "Ravi Kumar Sharma",
    dob: "1988-05-14",
    mobile: "9876543210",
    gstin: "29ABCDE1234F1Z5",
    businessName: "Sharma Distributors",
  },
```

### 1. Happy Path (Complete Data)
- Enter PAN: `ABCDE1234F`
- Follow the agent's prompts
- Expect: All fields fill correctly, no flags, clean hand-off

### 2. No Data Path (Missing GST)
- Enter PAN: `ZZZZZ9999Z`
- Follow the agent's prompts
- Expect: GST fields show "Not available", agent acknowledges the gap, no fabricated values

### 3. Mismatch Path (Document Disagreement)
- Enter PAN: `MISMATCH5A`
- Follow the agent's prompts
- Expect: Income fields flagged, agent asks for confirmation before proceeding

### 4. Unknown Identifier
- Enter any invalid PAN
- Expect: Agent reports it couldn't find the record and asks to re-enter

### 5. Manual Edit
- At any point, click any form field and edit its value
- Expect: Your edit persists, agent continues normally

## Key Features

- **Split-screen layout**: Chat panel on left, live form on right
- **Real-time form filling**: Watch fields populate as the agent fetches data
- **Editable fields**: User can override any field at any time
- **Cross-checking**: Agent compares documents (ITR vs bank statement) and flags mismatches
- **Honest blanks**: Missing data shows as "Not available", never a guess
- **Status indicators**: Visual distinction between filled, not-available, and flagged fields

## Mock Data

The prototype uses three test customers:

| PAN | Name | Scenario |
|-----|------|----------|
| ABCDE1234F | Ravi Kumar Sharma | Complete data (happy path) |
| ZZZZZ9999Z | Anita Desai | Missing GST data (no-data case) |
| MISMATCH5A | Priya Patel | ITR/bank income mismatch (flagging case) |

## Agent Flow

1. **Greeting + Ask PAN**: Agent introduces itself and asks for PAN
2. **Fetch Basics**: Looks up PAN and pre-fills name, DOB, mobile, GSTIN
3. **Ask GST Consent**: Requests permission to fetch GST details
4. **OTP Verification**: Simulates sending and verifying OTP
5. **Document Upload**: Requests ITR and bank statement (simulated)
6. **Cross-Check**: Compares documents and flags inconsistencies
7. **Resolution**: Asks user to confirm flagged values
8. **Hand-off**: Confirms application is complete and ready for review

## No Hallucination Guarantee

The agent never fabricates data:
- Mock APIs return `null` for unknown inputs
- Agent converts `null` to "Not available" before display
- Cross-checks flag disagreements instead of guessing
- User can always edit any field

## Build for Production

```bash
npm run build
```



