import { useEffect } from "react";

export default function Modal({ title, onClose,onConfirm, children  }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-lg rounded-2xl bg-white p-7 text-black shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 rounded-lg font-bold hover:bg-slate-300 bg-slate-100 text-red-600"
          >
            ×
          </button>
        </div>
        {children}

        {onConfirm ? <button className='mt-5 flex cursor-pointer justify-center rounded-xl bg-red-500 p-1 pl-2 pr-2 text-white hover:bg-red-600' onClick={onConfirm}>Confirm</button> : ""}
      </div>
    </div>
  );
}