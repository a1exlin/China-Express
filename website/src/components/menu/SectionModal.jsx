import React from "react";
import { motion } from "framer-motion";
import "../../css/SectionModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modal = {
  hidden: { y: "-50%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { y: "50%", opacity: 0, transition: { duration: 0.2 } },
};

export default function SectionModal({ section, onClose, addToCart }) {
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
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-title">{title}</h2>
        {description && <p className="modal-description">{description}</p>}

        {items.length > 0 && (
          <ul className="modal-item-list">
            {items.map(({ code, name, price, description, _id }) => (
              <li key={code} className="modal-item">
                <div className="item-row">
                  <span className="item-code">{code}</span>
                  <span className="item-name">{name}</span>
                  <span className="item-price">${price.toFixed(2)}</span>

                  <FontAwesomeIcon
                    icon={faCartPlus}
                    className="add-cart"
                    onClick={() =>
                      addToCart({
                        ID: _id,
                        Code: code,
                        Name: name,
                        Price: price,
                        quantity: 1,
                        description: description || "",
                      })
                    }
                  />
                </div>
                {description && <p className="item-desc">{description}</p>}
              </li>
            ))}
          </ul>
        )}

        {children.length > 0 && (
          <div className="modal-subsections">
            {children.map((sub) => (
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
