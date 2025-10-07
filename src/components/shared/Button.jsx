const Button = ({ onClick, children, type = "default", disabled = false }) => {
  const styles = {
    default: "text-slate-50 bg-slate-500 hover:bg-slate-700",
    edit: "text-amber-50 bg-amber-500 hover:bg-amber-700",
    add: "text-blue-50 bg-blue-500 hover:bg-blue-700",
    cancel: "text-red-50 bg-red-500 hover:bg-red-700",
    "default-outline":
      "text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 ",
    "edit-outline":
      "text-amber-700 bg-white border border-amber-300 hover:bg-amber-50",
    "add-outline":
      "text-blue-700 bg-white border border-blue-300 hover:bg-blue-50",
    "cancel-outline":
      "text-red-700 bg-white border border-red-300 hover:bg-red-50",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer border-none rounded-md inline-flex items-center justify-center p-2 text-sm font-medium  outline-none focus:border-none focus:outline-none ring-0 focus:ring-0  transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[type]}`}
      aria-label="Cancelar edición del sindicato"
    >
      {children}
    </button>
  );
};

export default Button;
