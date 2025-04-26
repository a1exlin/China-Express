import React, { useRef, useState, useEffect } from "react";
import "../../css/menuCards.css";

export function SubMenuCard({
  image,
  title,
  description,
  onClick,
  children,
  expandable = false,
}) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState("0px");
  const [visible, setVisible] = useState(false);
  const contentRef = useRef(null);

  const handleClick = () => {
    if (expandable) {
      setOpen((prev) => !prev);
    } else {
      onClick?.();
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      if (open) {
        setVisible(true);
        requestAnimationFrame(() => setHeight(`${scrollHeight}px`));
      } else {
        setHeight("0px");
        setTimeout(() => setVisible(false), 350);
      }
    }
  }, [open]);

  return (
    <div className="menu-card-container">
      <div
        className="menu-card"
        onClick={handleClick}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <div className="menu-image-box">
          <img src={image} alt={title} className="menu-image" />
        </div>
        <div className="menu-content-box">
          <div className="menu-title">{title}</div>
          <div className="menu-description">{description}</div>
          <div className="menu-view-more">View Menu →</div>
        </div>
      </div>

      <div
        className="menu-inner-wrapper"
        style={{
          maxHeight: height,
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        <div className="menu-inner-content" ref={contentRef}>
          {React.Children.map(children, (child) => (
            <div className="menu-subitem">{child}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
