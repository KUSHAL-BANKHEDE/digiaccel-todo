import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="sheet"
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close dialog"
            onClick={onClose}
            className="absolute inset-0 block h-full w-full cursor-default bg-ink/45 backdrop-blur-[2px]"
          />
          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="sheet-title"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="flex max-h-[92dvh] w-full max-w-[430px] flex-col rounded-t-[28px] bg-white shadow-soft"
            >
              <div className="flex items-center justify-between px-5 pb-3 pt-4">
                <h2 id="sheet-title" className="font-display text-lg font-semibold text-ink">
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="safe-bottom overflow-y-auto px-5 pb-6">{children}</div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
