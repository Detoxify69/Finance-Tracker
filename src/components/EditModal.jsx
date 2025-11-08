// src/components/EditModal.jsx
import React, { useEffect, useRef, useState } from "react";

export default function EditModal({ transaction, onSave, onClose, openerRef }) {
  const [text, setText] = useState(transaction?.text ?? "");
  const [amount, setAmount] = useState(transaction?.amount ?? "");
  const [type, setType] = useState(transaction?.type ?? "Income");
  const modalRef = useRef(null);

  useEffect(() => {
    // Focus first input when modal opens
    const first = modalRef.current && modalRef.current.querySelector("input, select, button");
    if (first) first.focus();

    const prevActive = document.activeElement;
    // copy the current value of openerRef to avoid stale-ref warning in cleanup
    const opener = openerRef && openerRef.current ? openerRef.current : null;

    return () => {
      // return focus to opener when closing
      if (opener && typeof opener.focus === "function") opener.focus();
      else if (prevActive && typeof prevActive.focus === "function") prevActive.focus();
    };
    // NOTE: we intentionally do NOT include openerRef as dependency because we copied its current value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount/unmount


  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Tab") {
        // simple focus trap
        const focusable = modalRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = () => {
    const amt = Number(amount);
    if (!text.trim()) return;
    if (!Number.isFinite(amt) || amt <= 0) return;
    onSave({ ...transaction, text: text.trim(), amount: Math.round(amt * 100) / 100, type });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="bg-gray-900 p-6 rounded-2xl w-full max-w-sm flex flex-col gap-3 shadow-xl"
      >
        <h2 className="text-lg font-bold text-cyan-400 mb-1">Edit Transaction</h2>

        <label htmlFor="edit-text" className="sr-only">Description</label>
        <input
          id="edit-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-400"
        />

        <label htmlFor="edit-amount" className="sr-only">Amount</label>
        <input
          id="edit-amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-400"
        />

        <label htmlFor="edit-type" className="sr-only">Type</label>
        <select
          id="edit-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-400"
        >
          <option>Income</option>
          <option>Expense</option>
        </select>

        <div className="flex gap-3 mt-2 justify-end">
          <button onClick={onClose} className="bg-gray-700 text-white py-1 px-3 rounded">Cancel</button>
          <button onClick={save} className="bg-cyan-500 text-white py-1 px-3 rounded font-bold">Save</button>
        </div>
      </div>
    </div>
  );
}
