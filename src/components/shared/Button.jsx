const Button = ({
  onClick,
  children,
  style = "default",
  disabled = false,
  type = "button",
}) => {
  const styles = {
    default:
      "text-slate-50 bg-slate-500 hover:bg-slate-700 border-none focus:border-none ",
    edit: "text-amber-50 bg-amber-500 hover:bg-amber-700 border-none focus:border-none",
    add: "text-blue-50 bg-blue-500 hover:bg-blue-700 border-none focus:border-none",
    cancel:
      "text-red-50 bg-red-500 hover:bg-red-700 border-none focus:border-none",
    check:
      "text-green-50 bg-green-500 hover:bg-green-700 border-none focus:border-none",
    "default-outline":
      "text-slate-700 bg-white border border-slate-500 hover:border-slate-500 hover:bg-slate-500 hover:text-slate-50  ",
    "edit-outline":
      "border-amber-500 text-amber-700 bg-white border hover:border-amber-500 hover:bg-amber-500 hover:text-amber-50",
    "add-outline":
      "text-blue-700 bg-white border border-blue-500 hover:border-blue-500 hover:bg-blue-500 hover:text-blue-50",
    "cancel-outline":
      "text-red-700 bg-white border border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-red-50",
    "check-outline":
      "text-green-700 bg-white border border-green-500 hover:border-green-500 hover:bg-green-500 hover:text-green-50",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer rounded-md inline-flex items-center justify-center p-2 outline-none focus:outline-none ring-0 focus:ring-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed aspect-square ${styles[style]}`}
      aria-label="Cancelar edición del sindicato"
    >
      {children}
    </button>
  );
};

export default Button;
