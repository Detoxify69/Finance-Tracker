// src/App.jsx
import React, { useEffect, useReducer, useRef, useState } from "react";
import EditModal from "./components/EditModal";
import { exportToCSV } from "./utils/csv";
import { seedDemo } from "./utils/seed";
import Papa from "papaparse";

const initialState = () => {
  try {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [action.payload, ...state];
    case "DELETE":
      return state.filter((tx) => tx.id !== action.payload);
    case "EDIT":
      return state.map((tx) => (tx.id === action.payload.id ? action.payload : tx));
    case "SET":
      return action.payload;
    default:
      return state;
  }
}

export default function App() {
  const [transactions, dispatch] = useReducer(reducer, [], initialState);
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");
  const [error, setError] = useState("");
  const [editingTx, setEditingTx] = useState(null);
  const editOpenerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    const amt = Number(amount);
    if (!text.trim()) {
      setError("Description cannot be empty.");
      return;
    }
    if (!Number.isFinite(amt) || amt <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    setError("");
    const newTx = { id: Date.now(), text: text.trim(), amount: Math.round(amt * 100) / 100, type };
    dispatch({ type: "ADD", payload: newTx });
    setText("");
    setAmount("");
  };

  const deleteTransaction = (id) => {
    dispatch({ type: "DELETE", payload: id });
  };

  const openEdit = (tx, openerRef) => {
    // store the openerRef if provided
    if (openerRef) editOpenerRef.current = openerRef.current || openerRef;
    setEditingTx(tx);
  };

  const saveEdit = (tx) => {
    dispatch({ type: "EDIT", payload: tx });
    setEditingTx(null);
  };

  const income = transactions.filter((tx) => tx.type === "Income").reduce((sum, tx) => sum + Number(tx.amount), 0);
  const expense = transactions.filter((tx) => tx.type === "Expense").reduce((sum, tx) => sum + Number(tx.amount), 0);
  const balance = income - expense;

  // CSV import (simple)
  const handleFile = (file) => {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data.map((r, i) => {
          const amt = Number(r.amount ?? r.Amount ?? r.AMOUNT ?? 0);
          return {
            id: Date.now() + i,
            text: r.text ?? r.description ?? r.Description ?? "Imported",
            amount: Math.round((Number.isFinite(amt) ? amt : 0) * 100) / 100,
            type: (r.type ?? r.Type ?? "").toLowerCase().includes("inc") ? "Income" : "Expense",
          };
        });
        const valid = rows.filter((r) => r.text && Number.isFinite(r.amount) && r.amount > 0);
        if (valid.length) {
          dispatch({ type: "SET", payload: [...valid, ...transactions] });
        }
      },
      error: (err) => {
        console.error("CSV parse error", err);
      }
    });
  };

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    handleFile(f);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-black text-gray-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold text-cyan-400 mb-6 drop-shadow-lg text-center">💰 Finance Tracker</h1>

      <div className="bg-gray-900/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        <div className="mb-5 text-center" aria-live="polite">
          <h2 className="text-xl font-semibold text-gray-400">Your Balance</h2>
          <p className="text-3xl font-bold text-white mt-2">₹{balance.toFixed(2)}</p>
        </div>

        <div className="flex justify-between mb-6 bg-gray-800 rounded-xl p-4">
          <div className="text-center flex-1 border-r border-gray-600">
            <p className="text-gray-400">Income</p>
            <p className="text-green-400 font-bold text-lg">+₹{income.toFixed(2)}</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-gray-400">Expense</p>
            <p className="text-red-400 font-bold text-lg">-₹{expense.toFixed(2)}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-cyan-400">Add New Transaction</h3>
          {error && <p className="text-red-400 mb-2">{error}</p>}
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Description (e.g. Salary, Food)" value={text} onChange={(e) => setText(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01"
              className="bg-gray-800 text-white p-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            <select value={type} onChange={(e) => setType(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400">
              <option>Income</option>
              <option>Expense</option>
            </select>
            <div className="flex gap-2">
              <button onClick={addTransaction} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 rounded-xl shadow-lg">Add Transaction</button>
              <button onClick={() => exportToCSV(transactions)} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-xl">Export CSV</button>
              <button onClick={() => seedDemo(transactions, dispatch)} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-xl">Seed Demo</button>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <input ref={fileInputRef} type="file" accept=".csv" onChange={onFileChange} className="text-sm" />
              <span className="text-xs text-gray-400">Import CSV (headers: text,amount,type)</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-cyan-400">Transaction History</h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto" aria-live="polite">
            {transactions.length === 0 && <p className="text-gray-500 text-center italic">No transactions yet.</p>}
            {transactions.map((tx) => (
              <li key={tx.id} className={`flex justify-between items-center bg-gray-800 p-3 rounded-xl border-l-4 ${tx.type === "Income" ? "border-green-400" : "border-red-400"}`}>
                <div>
                  <p className="font-medium">{tx.text}</p>
                  <p className="text-sm text-gray-500">{tx.type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${tx.type === "Income" ? "text-green-400" : "text-red-400"}`}>
                    {tx.type === "Income" ? "+" : "-"}₹{Number(tx.amount).toFixed(2)}
                  </span>
                  <EditButton tx={tx} openEdit={(tx, ref) => openEdit(tx, ref)} />
                  <button onClick={() => deleteTransaction(tx.id)} className="text-red-500 hover:text-red-600 text-lg font-bold" aria-label={`Delete ${tx.text}`}>✕</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {editingTx && <EditModal openerRef={editOpenerRef} transaction={editingTx} onSave={saveEdit} onClose={() => setEditingTx(null)} />}

      <footer className="text-sm text-gray-500 mt-6 flex flex-col items-center gap-1">
        Built by <span className="text-cyan-400 font-semibold">Mohammed Saad Shareef</span> | React + TailwindCSS
      </footer>
    </div>
  );
}

/** Small helper component to attach a ref per edit button so focus returns properly */
function EditButton({ tx, openEdit }) {
  const btnRef = useRef(null);
  return (
    <button
      ref={btnRef}
      onClick={() => openEdit(tx, btnRef)}
      className="text-cyan-400 hover:text-cyan-500 text-lg font-bold"
      aria-label={`Edit ${tx.text}`}
    >
      ✎
    </button>
  );
}
