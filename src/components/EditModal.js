import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../css/EditModal.css";

function EditModal({
  isOpen,
  onClose,
  type,
  time,
  plan,
  onSave,
  onDelete,
  amount,
  currency,
  description,
  onSaveExpense, // 지출 저장 함수
  onDeleteExpense, // 지출 삭제 함수
  expenseId, // 지출 항목의 식별자
}) {
  // 일정 및 지출에 대한 상태
  const [newTime, setNewTime] = useState(time);
  const [newPlan, setNewPlan] = useState(plan);
  const [newAmount, setNewAmount] = useState(amount);
  const [newCurrency, setNewCurrency] = useState(currency);
  const [newDescription, setNewDescription] = useState(description);

  useEffect(() => {
    if (type === "schedule") {
      setNewTime(time);
      setNewPlan(plan);
    } else if (type === "expense") {
      setNewAmount(amount);
      setNewCurrency(currency);
      setNewDescription(description);
    }
  }, [type, time, plan, amount, currency, description, expenseId]);

  const handleSave = () => {
    if (type === "schedule") {
      onSave(newTime, newPlan);
    } else if (type === "expense") {
      onSaveExpense(expenseId, newAmount, newCurrency, newDescription);
    }
  };

  const handleDelete = () => {
    if (type === "schedule") {
      onDelete();
    } else if (type === "expense") {
      onDeleteExpense(expenseId);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={`${
        type === "schedule" ? "Edit Schedule" : "Edit Expense"
      } Modal`}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>{type === "schedule" ? "일정 수정" : "지출 수정"}</h2>
      {type === "schedule" ? (
        <>
          <input
            type="text"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
          <textarea
            value={newPlan}
            onChange={(e) => setNewPlan(e.target.value)}
          />
        </>
      ) : (
        <>
          <input
            type="text"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
          <input
            type="text"
            value={newCurrency}
            onChange={(e) => setNewCurrency(e.target.value)}
            placeholder="화폐"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="설명"
          />
        </>
      )}
      <button onClick={handleSave}>저장</button>
      <button onClick={handleDelete}>삭제</button>
      <button onClick={onClose}>닫기</button>
    </Modal>
  );
}

export default EditModal;
