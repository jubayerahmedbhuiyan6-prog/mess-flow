/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

export interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface ToastContainerProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const typeStyles = {
            success: "border-emerald-500/30 bg-emerald-950/40 text-emerald-200 shadow-emerald-950/50",
            error: "border-rose-500/30 bg-rose-950/40 text-rose-200 shadow-rose-950/50",
            warning: "border-[#FF9500]/30 bg-amber-950/40 text-amber-200 shadow-amber-950/50",
            info: "border-[#8B5CF6]/30 bg-purple-950/40 text-purple-200 shadow-purple-950/50",
          };

          const Icon = {
            success: CheckCircle2,
            error: XCircle,
            warning: AlertTriangle,
            info: Info,
          }[toast.type];

          const glowColor = {
            success: "bg-emerald-500",
            error: "bg-rose-500",
            warning: "bg-[#FF9500]",
            info: "bg-[#8B5CF6]",
          }[toast.type];

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-lg relative overflow-hidden ${typeStyles[toast.type]}`}
            >
              {/* Mini glow accent */}
              <div className={`absolute top-0 bottom-0 left-0 w-1 ${glowColor}`} />

              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm font-medium pr-1 text-left">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-0.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                aria-label="Close toast"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
