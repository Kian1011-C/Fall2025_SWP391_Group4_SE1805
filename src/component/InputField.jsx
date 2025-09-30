import React from "react";

export default function InputField({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  style,
  ...props
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "12px 16px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "16px",
        backgroundColor: "white",
        transition: "border-color 0.2s, box-shadow 0.2s",
        outline: "none",
        fontFamily: "inherit",
        ...style,
      }}
      {...props}
    />
  );
}
