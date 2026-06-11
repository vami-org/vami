import { create } from "zustand";

/**
 * Zustand store for managing dynamic global toast alerts.
 */
export const useToastStore = create((set) => ({
  toasts: [],
  /**
   * Add a new toast alert message to the state queue.
   *
   * @param {string} message - Notification text
   * @param {'success'|'error'|'warning'|'info'} [variant='info'] - Severity variant
   * @param {number} [duration=3000] - Timer offset before auto dismissal
   */
  addToast: (message, variant = "info", duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, variant }],
    }));

    // Auto-remove toast after duration timeout
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },
  /**
   * Manually dismiss a specific toast message.
   *
   * @param {string} id - The unique toast ID
   */
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

/**
 * Custom Hook helper exposing helper methods to interact with ToastStore events.
 */
export function useToast() {
  const addToast = useToastStore((state) => state.addToast);
  const removeToast = useToastStore((state) => state.removeToast);
  const toasts = useToastStore((state) => state.toasts);

  return { toasts, toast: addToast, dismiss: removeToast };
}
