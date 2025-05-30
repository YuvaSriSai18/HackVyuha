import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

export const Button = ({ children, variant = "primary", ...props }: ButtonProps) => {
  // eslint-disable-next-line prefer-const
  let baseClasses = "px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2";

  let variantClasses = "";

  switch (variant) {
    case "secondary":
      variantClasses = "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400";
      break;
    case "outline":
      variantClasses = "border border-gray-500 text-gray-700 hover:bg-gray-100 focus:ring-gray-400";
      break;
    default:
      variantClasses = "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400";
  }

  return (
    <button className={`${baseClasses} ${variantClasses}`} {...props}>
      {children}
    </button>
  );
};
