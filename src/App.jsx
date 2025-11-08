import React, { useState, useEffect } from "react";

// Transaction edit modal (inline)
function EditModal({ transaction, onSave, onClose }) {
  const [text, setText] = useState(transaction.text);
  const [amount, setAmount] = useState(transaction.amount);
  const [type, setType] = useState(transaction.type);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-sm flex flex-col gap-3 shadow-xl">
        <h2 className="text-lg font-bold text-cyan-400 mb-1">Edit Transaction</h2>
        <label htmlFor="text-edit" className="text-gray-300">Description:</label>
        <input
          id="text-edit"
          className="bg-gray-800 text-white p-2 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-400"
          value={text}
          autoFocus
          onChange={e => setText(e.target.value)}
        />
        <label htmlFor="amount-edit" className="text-gray-300">Amount:</label>
        <input
          id="amount-edit"
          className="bg-gray-800 text-white p-2 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-400"
          value={amount}
          min={0}
          type="number"
          onChange={e => setAmount(e.target.value)}
        />
        <label htmlFor="type-edit" className="text-gray-300">Type:</label>
        <select
          id="type-edit"
          value={type}
          className="bg-gray-800 text-white p-2 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-400"
          onChange={e => setType(e.target.value)}
        >
          <option>Income</option>
          <option>Expense</option>
        </select>
        <div className="flex gap-3 mt-2 justify-end">
          <button
            className="bg-gray-700 text-white py-1 px-3 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-cyan-500 hover:bg-cyan-600 text-white py-1 px-3 rounded font-bold"
            onClick={() => onSave({ ...transaction, text, amount: parseFloat(amount), type })}
            disabled={!text || amount <= 0}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");
  const [error, setError] = useState("");
  const [editingTx, setEditingTx] = useState(null);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    if (!text) {
      setError("Description cannot be empty.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    setError("");
    const newTx = {
      id: Date.now(),
      text,
      amount: parseFloat(amount),
      type,
    };
    setTransactions([newTx, ...transactions]);
    setText("");
    setAmount("");
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  const openEdit = (tx) => setEditingTx(tx);

  const saveEdit = (tx) => {
    setTransactions(transactions.map(t => t.id === tx.id ? tx : t));
    setEditingTx(null);
  };

  const income = transactions.filter((tx) => tx.type === "Income").reduce((sum, tx) => sum + tx.amount, 0);
  const expense = transactions.filter((tx) => tx.type === "Expense").reduce((sum, tx) => sum + tx.amount, 0);
  const balance = income - expense;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-black text-gray-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold text-cyan-400 mb-6 drop-shadow-lg text-center">
        💰 Finance Tracker
      </h1>

      <div className="bg-gray-900/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        {/* Accessible Balance Section */}
        <div className="mb-5 text-center" aria-live="polite">
          <h2 className="text-xl font-semibold text-gray-400">Your Balance</h2>
          <p className="text-3xl font-bold text-white mt-2">
            ₹{balance.toFixed(2)}
          </p>
        </div>

        {/* Income / Expense Summary */}
        <div className="flex justify-between mb-6 bg-gray-800 rounded-xl p-4">
          <div className="text-center flex-1 border-r border-gray-600">
            <p className="text-gray-400">Income</p>
            <p className="text-green-400 font-bold text-lg">
              +₹{income.toFixed(2)}
            </p>
          </div>
          <div className="text-center flex-1">
            <p className="text-gray-400">Expense</p>
            <p className="text-red-400 font-bold text-lg">
              -₹{expense.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Add Transaction */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-cyan-400">Add New Transaction</h3>
          {error && <p className="text-red-400 mb-2">{error}</p>}
          <div className="flex flex-col gap-3">
            <label htmlFor="desc-input" className="sr-only">Transaction Description</label>
            <input
              id="desc-input"
              type="text"
              placeholder="Description (e.g. Salary, Food)"
              className="bg-gray-800 text-white p-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <label htmlFor="amount-input" className="sr-only">Transaction Amount</label>
            <input
              id="amount-input"
              type="number"
              min={1}
              placeholder="Amount"
              className="bg-gray-800 text-white p-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <label htmlFor="type-select" className="sr-only">Transaction Type</label>
            <select
              id="type-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option>Income</option>
              <option>Expense</option>
            </select>
            <button
              onClick={addTransaction}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 rounded-xl shadow-lg transition-all"
              aria-label="Add transaction"
            >
              Add Transaction
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-cyan-400">Transaction History</h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto" aria-live="polite">
            {transactions.length === 0 && (
              <p className="text-gray-500 text-center italic">No transactions yet.</p>
            )}
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className={`flex justify-between items-center bg-gray-800 p-3 rounded-xl border-l-4 ${
                  tx.type === "Income"
                    ? "border-green-400"
                    : "border-red-400"
                }`}
              >
                <div>
                  <p className="font-medium">{tx.text}</p>
                  <p className="text-sm text-gray-500">{tx.type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${tx.type === "Income" ? "text-green-400" : "text-red-400"}`}>
                    {tx.type === "Income" ? "+" : "-"}₹{tx.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => openEdit(tx)}
                    className="text-cyan-400 hover:text-cyan-500 text-lg font-bold"
                    aria-label={`Edit ${tx.text}`}
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="text-red-500 hover:text-red-600 text-lg font-bold"
                    aria-label={`Delete ${tx.text}`}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTx && (
        <EditModal
          transaction={editingTx}
          onSave={saveEdit}
          onClose={() => setEditingTx(null)}
        />
      )}

      <footer className="text-sm text-gray-500 mt-6 flex flex-col items-center gap-1">
        Built by <span className="text-cyan-400 font-semibold">Mohammed Saad Shareef</span> | React + TailwindCSS
        <span className="italic">Accessibility & error handling added</span>
      </footer>
    </div>
  );
}
