'use client';

export default function SidebarButton({ 
  icon: Icon, 
  children, 
  onClick,
  className = "",
  variant = "default" 
}) {
  const baseClasses = "w-full flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/30 p-3 rounded-lg transition-all duration-200 text-left border border-transparent hover:border-slate-300 dark:hover:border-slate-600/30";
  const variantClasses = {
    default: "",
    small: "text-sm py-2",
    multiline: "text-sm"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
