// src/utils/seed.js
export const demoTransactions = [
    { id: Date.now() + 1, text: "Salary", amount: 70000, type: "Income" },
    { id: Date.now() + 2, text: "Dinner", amount: 500, type: "Expense" },
    { id: Date.now() + 3, text: "Groceries", amount: 1200, type: "Expense" },
  ];
  
  export function seedDemo(currentTransactions, dispatch) {
    // If there is already data, do nothing (keeps user data safe)
    if (currentTransactions && currentTransactions.length > 0) return;
    dispatch({ type: "SET", payload: [...demoTransactions] });
  }
  