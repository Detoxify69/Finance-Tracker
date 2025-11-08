# 💰 Finance / Expense Tracker

A lightweight personal finance tracker built with **React** and **TailwindCSS**.  
This app helps you track your income, expenses, and balance — featuring localStorage persistence, edit modal accessibility, CSV export/import, and demo data seeding.

**Live demo:** https://financetracker-eight-sepia.vercel.app/ 

---

## ✅ Features

- ➕ Add / ✏️ Edit / ❌ Delete transactions (Income / Expense)
- 💵 Automatic balance, income, and expense calculations
- 💾 Persistent data using browser `localStorage`
- 📤 CSV **Export** and 📥 **Import** support (via PapaParse)
- 🧩 Demo data **Seed** button for quick preview
- ♿ Accessible Edit Modal (ESC to close, focus trapping)
- 📱 Responsive dark-themed UI with TailwindCSS
- ⚙️ Structured with `useReducer` for state management
- 🧠 Ready to extend into full **MERN** app (MongoDB + Express backend)

---

## 🚀 Quickstart

```bash
# Clone repository
git clone https://github.com/Detoxify69/finance-tracker.git
cd finance-tracker

# Install dependencies
npm install

# Run development server
npm start
# or, if using Vite:
npm run dev

Then open your browser → http://localhost:3000


🧾 Usage Guide

Enter a transaction description (e.g., “Salary” or “Groceries”).

Enter the amount (must be a positive number).

Choose Income or Expense.

Click Add Transaction.

View your balance and transaction history instantly.

Use:

✏️ Edit — modify transaction via modal.

❌ Delete — remove a transaction.

📤 Export CSV — download all data.

📥 Import CSV — upload a CSV with text,amount,type headers.

🧩 Seed Demo Data — instantly populate sample transactions.

📁 Folder Structure

finance-tracker/
├── src/
│   ├── components/
│   │   └── EditModal.jsx
│   ├── utils/
│   │   ├── csv.js
│   │   └── seed.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── public/
├── tailwind.config.js
├── package.json
└── README.md


⚙️ Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm start`     | Start dev server           |
| `npm run build` | Build production files     |
| `npm test`      | Run tests (if added)       |
| `npm run lint`  | Run ESLint (if configured) |



📸 Screenshots

Dashboard

image.png

Edit Modal

image.png

Exported CSV

image.png


🧠 Future Improvements

🔐 Add backend (MongoDB + Express) for multi-user support

📊 Integrate Chart.js analytics (spending by category)

🗓️ Add recurring transactions / monthly budget planner

☁️ Sync with cloud or Google Sheets API

🔎 Search and filter features


🧪 Manual Testing Checklist

| Test Case            | Expected Result                |
| -------------------- | ------------------------------ |
| Add new income       | Balance increases              |
| Add expense          | Balance decreases              |
| Edit entry           | Updated data persists          |
| Delete entry         | Removed from list and storage  |
| Refresh page         | Data persists via localStorage |
| Press `Esc` in modal | Closes modal                   |
| Tab navigation       | Cycles within modal            |
| Export CSV           | Downloads correct file         |
| Import CSV           | Adds valid rows to list        |



🧩 Tech Stack

| Technology           | Purpose                |
| -------------------- | ---------------------- |
| **React.js**         | Frontend framework     |
| **TailwindCSS**      | Styling and layout     |
| **PapaParse**        | CSV parsing            |
| **localStorage API** | Persistent data        |
| **Vercel**           | Deployment and hosting |


🧰 Recommended Dev Tools

To make your setup professional:

npm install papaparse
npm install -D eslint prettier vitest @testing-library/react @testing-library/jest-dom


⚖️ License

MIT License — free to use and modify.

👨‍💻 Built by: Mohammed Saad Shareef
Frontend Stack — React + TailwindCSS + LocalStorage

“Designed for simplicity, built for clarity.”