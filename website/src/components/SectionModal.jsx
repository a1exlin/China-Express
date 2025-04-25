import React from "react";
import { motion } from "framer-motion";
import "../css/SectionModal.css";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modal = {
  hidden:   { y: "-50%", opacity: 0 },
  visible: { y: "0%",   opacity: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
  exit:    { y: "50%",  opacity: 0, transition: { duration: 0.2 } }
};

export default function SectionModal({ section, onClose }) {
  const { title, description, items = [], children = [] } = section;

  return (
    <motion.div
      className="modal-backdrop"
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="modal-window"
        variants={modal}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">{title}</h2>
        {description && <p className="modal-description">{description}</p>}

        {items.length > 0 && (
          <ul className="modal-item-list">
            {items.map(({ code, name, price, description }) => (
              <li key={code} className="modal-item">
                <div className="item-row">
                  <span className="item-code">{code}</span>
                  <span className="item-name">{name}</span>
                  <span className="item-price">${price.toFixed(2)}</span>
                </div>
                {description && <p className="item-desc">{description}</p>}
              </li>
            ))}
          </ul>
        )}

        {children.length > 0 && (
          <div className="modal-subsections">
            {children.map(sub => (
              <div
                key={sub.slug}
                className="modal-subsection"
                onClick={() => onClose(sub)}
              >
                {sub.title}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
