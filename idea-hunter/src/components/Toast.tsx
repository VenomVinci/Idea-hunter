"use client";
import { useEffect } from 'react';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
};

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [onClose, duration]);

  const color = type === 'error' ? 'bg-red-500/90' : type === 'success' ? 'bg-emerald-500/90' : 'bg-brand-600/90';

  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-lg ${color} px-4 py-3 text-sm shadow-lg`}>{message}</div>
  );
}