export default function Avatar({ name, src, size = "md" }) {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-16 h-16 text-xl",
  };
  const initial = name?.[0]?.toUpperCase() || "?";

  if (src)
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    );
  return (
    <div
      className={`${sizes[size]} rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold`}
    >
      {initial}
    </div>
  );
}
