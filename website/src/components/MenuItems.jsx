import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SubMenuCard } from "./menuCards";
import SectionModal from "./SectionModal";

export default function MenuItems() {
  const [sections, setSections] = useState([]);
  const [activeSection, setActive] = useState(null);

  useEffect(() => {
    fetch(import.meta.env.VITE_SERVER_URI + "/api/menu")
      .then((res) => res.json())
      .then(setSections)
      .catch(console.error);
  }, []);

  return (
    <div className="menuItems">
      <AnimatePresence mode="wait">
        {activeSection && (
          <SectionModal
            key={activeSection.slug}
            section={activeSection}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>

      {sections.map((sec) => {
        const hasChildren = sec.children?.length > 0;
        const hasItems    = sec.items?.length > 0;

        return (
          <SubMenuCard
            key={sec.slug}
            image={sec.imageUrl}
            title={sec.title}
            description={sec.description}
            expandable={hasChildren}
            onClick={() => {
              if (hasChildren || hasItems) setActive(sec);
            }}
          >
            {hasChildren && (
              <div className="subsections">
                {sec.children.map((child) => (
                  <div
                    key={child.slug}
                    style={{ cursor: "pointer", padding: "4px 0" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(child);
                    }}
                  >
                    {child.title}
                  </div>
                ))}
              </div>
            )}
          </SubMenuCard>
        );
      })}
    </div>
  );
}
