import React, { useRef, useState, useEffect } from "react";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    margin: "20px auto",
    borderRadius: "24px",
    backgroundColor: "#fff7ed",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
    maxWidth: "60%",
    transition: "all 0.2s ease",
    overflow: "hidden",
  },
  subMenuCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "20px",
    padding: "20px 24px",
    cursor: "pointer",
  },
  imageBox: {
    position: "relative",
    flexShrink: 0,
    width: "100px",
    height: "100px",
    borderRadius: "16px",
    overflow: "hidden",
    background: "linear-gradient(135deg, #f4bd3a, #c34428)",
    padding: "3px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  image: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "93%",
    height: "93%",
    transform: "translate(-50%, -50%)",
    objectFit: "cover",
    borderRadius: "14px",
    border: "none",
  },
  contentBox: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  title: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#a9321c",
    marginBottom: "4px",
  },
  description: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#5a4033",
    marginBottom: "8px",
  },
  viewMore: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#c34428",
    textDecoration: "underline",
  },
  innerWrapper: {
    overflow: "hidden",
    transition: "max-height 0.35s ease, opacity 0.35s ease",
    backgroundColor: "#fff3df",
  },
  innerContent: {
    display: "flex",
    flexDirection: "column",
    padding: "12px 24px",
    gap: "12px",
  },
  subMenuCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "20px",
    padding: "20px 24px",
    cursor: "pointer",
    transform: "scale(1)",
    transition: "transform 0.05s ease-in-out",
  },
  subItem: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#842e1c",
    padding: "8px 0",
    borderBottom: "1px solid #f1dbbe",
  },
};

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
    <div style={styles.container}>
      <div
        style={styles.subMenuCard}
        onClick={handleClick}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <div style={styles.imageBox}>
          <img src={image} alt={title} style={styles.image} />
        </div>
        <div style={styles.contentBox}>
          <div style={styles.title}>{title}</div>
          <div style={styles.description}>{description}</div>
          <div style={styles.viewMore}>View Menu →</div>
        </div>
      </div>

      <div
        style={{
          ...styles.innerWrapper,
          maxHeight: height,
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        <div style={styles.innerContent} ref={contentRef}>
          {React.Children.map(children, (child) => (
            <div style={styles.subItem}>{child}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
