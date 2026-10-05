import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  hideClose = false,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClass =
    {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      full: 'max-w-full mx-4',
    }[size] || 'max-w-2xl';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${sizeClass} bg-white dark:bg-stone-900 rounded-3xl shadow-tactile-lg dark:shadow-tactile-dark-lg border-[1.5px] border-stone-300 dark:border-stone-800 animate-slide-up max-h-[90vh] flex flex-col`}
      >
        {(title || !hideClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b-[1.5px] border-stone-200 dark:border-stone-800 flex-shrink-0">
            {title && (
              <h2 className="text-base sm:text-lg font-black text-stone-950 dark:text-white font-display">
                {title}
              </h2>
            )}
            {!hideClose && (
              <button
                onClick={onClose}
                className="ml-auto p-2 rounded-xl border border-transparent hover:border-stone-300 dark:hover:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-all active:translate-y-[1px]"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
