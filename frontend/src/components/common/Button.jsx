import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  return (
    <button
      className={clsx(
        "rounded-lg font-medium transition-colors disabled:opacity-50",
        {
          "bg-primary-600 text-white hover:bg-primary-700":
            variant === "primary",
          "bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600":
            variant === "secondary",
          "bg-red-600 text-white hover:bg-red-700": variant === "danger",
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2": size === "md",
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
