import React, { useState } from "react";
import "./modal.css";

function Modal() {
  const [onClose, setOnClose] = useState(true);

  const handleClick = () => {
    setOnClose(!onClose);
  };

  return (
    onClose && (
      <div className="modal" onClick={handleClick} aria-hidden="true">
        <div className="modal__un">
          <div className="modal__cross">
            <button type="button">
              <img src="/Cross.png" alt="" />
            </button>
          </div>

          <div className="modal__text">
            <img src="deway-logo.svg" alt="" />
            <p>
              En route pour trouver un job de Dev à <span>Toulouse</span>
            </p>
          </div>
        </div>
      </div>
    )
  );
}

export default Modal;
