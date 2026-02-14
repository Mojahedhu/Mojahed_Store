const Message = ({
  variant,
  children,
  className,
}: {
  variant?: "error" | "succuss";
  children: string | string[];
  className?: string;
}) => {
  const variantStyle: { [key: string]: string; default: string } = {
    ["succuss"]: "bg-green-100 text-green-800",
    ["error"]: "bg-red-100 text-red-800",
    default: "bg-blue-100 text-blue-800",
  };
  return (
    <div
      className={`p-4 rounded-md  ${
        variantStyle[variant!] || variantStyle.default
      } ${className || ""}`}
    >
      {children}
    </div>
  );
};

export { Message };
