import React from "react";
import classNames from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  scheme?:
    | "primary"
    | "secondary"
    | "close"
    | "tab"
    | "custom"
    | "reset"
    | "apply";
  size?: "small" | "medium" | "large" | "icon" | "semi";
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      scheme = "primary",
      size = "medium",
      isLoading = false,
      fullWidth = false,
      icon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyle =
      "inline-flex items-center justify-center font-semibold rounded transition-colors duration-200";

    const schemeStyle = {
      primary:
        "bg-primary1 text-white border border-primary1 hover:bg-primary5 hover:border-primary5",
      secondary:
        "bg-white text-primary5 border border-primary5 hover:bg-primary5 hover:border-primary5 hover:text-white",
      close: "text-gray-400 hover:text-primary5",
      tab: "bg-transparent text-gray-400 hover:text-primary5 border-b-2 border-transparent",
      custom: "",
      apply:
        "bg-primary5 text-white border border-primary5 shadow-none hover:shadow-none hover:text-white hover:brightness-95",
      reset:
        "bg-white text-primary5 border border-primary5 hover:bg-primary4 hover:text-primary5 hover:border-primary5",
    };

    const sizeStyle = {
      small: "px-3 py-1 text-sm",
      medium: "px-4 py-2 text-base",
      large: "px-5 py-3 text-xl",
      semi: "px-4 py-1.5 text-sm",
      icon: "p-2 text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={classNames(
          baseStyle,
          schemeStyle[scheme],
          sizeStyle[size],
          fullWidth && "w-full",
          isLoading && "opacity-60 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {isLoading ? (
          "로딩중..."
        ) : (
          <>
            {icon && <span className="mr-2 flex items-center">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
