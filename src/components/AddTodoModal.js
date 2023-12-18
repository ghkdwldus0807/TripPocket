import React, { useState } from "react";
import Modal from "react-modal";

const AddTodoModal = ({ isOpen, onClose, onSave }) => {
  const [time, setTime] = useState("");
  const [plan, setPlan] = useState("");

  const handleSubmit = () => {
    onSave(time, plan);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Add New Schedule</h2>
      <input
        type="text"
        placeholder="Time (HH:MM)"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <input
        type="text"
        placeholder="Schedule Detail"
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
      />
      <button onClick={handleSubmit}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
};

export default AddTodoModal;
