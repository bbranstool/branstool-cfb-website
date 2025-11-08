import React from "react";
import "./ScorigamiControlPanel.css";

export default function ScorigamiControlPanel({ filters, onFilterChange }) {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    onFilterChange({ ...filters, [name]: checked });
  };

  return (
    <div className="scorigami-control-panel">
      <label className="control-option">
        <input
          type="checkbox"
          name="allFBS"
          checked={filters.allFBS}
          onChange={handleCheckboxChange}
        />
        All FBS Games
      </label>
    </div>
  );
}