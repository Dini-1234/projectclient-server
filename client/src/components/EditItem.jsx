import React, { useState } from "react";
import "../css/editItem.css";
import PropTypes from "prop-types";

const EditItem = ({ item, fields, type, setData, setIsEditing, setView = (x) => { } }) => {
  const [formData, setFormData] = useState(item);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/${type}/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      const updatedItem = await response.json();
      setData((prev) =>
        prev.map((dataItem) =>
          dataItem.id === item.id ? updatedItem : dataItem
        )

      );
      setView(updatedItem)
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-item-form">
      {fields.map(({ name, inputType }) => (
        <div key={name} className="form-group">
          <label htmlFor={name}>{name}</label>
          {inputType !== "textArea" ? (
            <input
              type={inputType}
              id={name}
              value={formData[name] || ""}
              onChange={(e) => handleChange(name, e.target.value)}
              className="input-underline"
            />
          ) : (
            <textarea
              id={name}
              value={formData[name] || ""}
              onChange={(e) => handleChange(name, e.target.value)}
              className="input-underline"
            ></textarea>
          )}
        </div>
      ))}

      <div className="form-actions">
        <button type="submit" className="submit-button">
          Save
        </button>
        <button
          type="button"
          className="cancel-button"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
EditItem.propTypes = {
  item: PropTypes.object.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      inputType: PropTypes.string.isRequired,
    })
  ).isRequired,
  type: PropTypes.string.isRequired,
  setData: PropTypes.func.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  setView: PropTypes.func,
};

export default EditItem;
