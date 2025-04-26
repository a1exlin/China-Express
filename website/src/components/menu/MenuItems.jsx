import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SubMenuCard } from "./menuCards";
import SectionModal from "./SectionModal";

export default function MenuItems({ addToCart }) {
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch(import.meta.env.VITE_SERVER_URI + "/api/menu");
        const data = await res.json();
        setSections(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load menu:", error);
      }
    }

    fetchMenu();
  }, []);

  const handleSectionClick = (section) => {
    const hasChildren = section.children?.length > 0;
    const hasItems = section.items?.length > 0;

    if (hasChildren || hasItems) {
      setActiveSection(section);
    }
  };

  const handleSubSectionClick = (child, event) => {
    event.stopPropagation();
    setActiveSection(child);
  };

  return (
    <div className="menuItems">
      <AnimatePresence mode="wait">
        {activeSection && (
          <SectionModal
            key={activeSection.slug}
            section={activeSection}
            onClose={() => setActiveSection(null)}
            addToCart={addToCart}
          />
        )}
      </AnimatePresence>

      {sections.map((section) => (
        <SubMenuCard
          key={section.slug}
          image={section.imageUrl}
          title={section.title}
          description={section.description}
          expandable={section.children?.length > 0}
          onClick={() => handleSectionClick(section)}
        >
          {section.children?.length > 0 && (
            <div className="subsections">
              {section.children.map((child) => (
                <div
                  key={child.slug}
                  className="subsection"
                  onClick={(e) => handleSubSectionClick(child, e)}
                >
                  {child.title}
                </div>
              ))}
            </div>
          )}
        </SubMenuCard>
      ))}
    </div>
  );
}
