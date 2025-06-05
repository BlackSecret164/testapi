import React, { useState } from "react";
import { Dropdown, Form } from "react-bootstrap";
import "./CustomDropdown.scss";

const CustomDropdown = ({ label, options, onSelect }: { label: string, options: string[], onSelect: (selectedValue: string) => void }) => {
  const [value, setValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const handleClick = (selectedVal: string | null) => {
    if (!selectedVal) return;
    setSelectedValue(selectedVal);
    onSelect(selectedVal);
  };

  const handleClear = () => {
    setSelectedValue("");
    setValue("");
    onSelect("");
  };

  return (
    <>
      <label className="item-search-label"> {label}</label>
      <Dropdown className="dropdown-custom" onSelect={handleClick}>
        <Dropdown.Toggle id="dropdown-custom-components">
          <span>{selectedValue ? selectedValue : label}</span>
          {selectedValue && (
            <span className="text-danger" onClick={handleClear}>
              &nbsp; &times;
            </span>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Form.Control
            autoFocus
            className="my-1"
            placeholder="Search..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <ul className="list-unstyled">
            {options
              .filter(
                (option) =>
                  !value || option.toLowerCase().startsWith(value.toLowerCase())
              )
              .map((option, index) => (
                <li key={index}>
                  <Dropdown.Item eventKey={option}>{option}</Dropdown.Item>
                </li>
              ))}
          </ul>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default CustomDropdown;