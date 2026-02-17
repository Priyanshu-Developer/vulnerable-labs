"use client";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  labNumber: number;
  title: string;
  message?: string;
}

export default function SuccessDialog({
  isOpen,
  onClose,
  labNumber,
  title,
  message,
}: SuccessDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="surface max-w-md w-full p-8 animate-bounce-in">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Content */}
          <h2
            className="text-2xl font-black mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            🎉 Challenge Complete!
          </h2>
          <p className="text-lg font-bold text-(--brand) mb-2">
            Lab {labNumber}: {title}
          </p>
          <p className="text-muted mb-6">
            {message ||
              "Great work! You've successfully exploited the vulnerability. Ready for the next challenge?"}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-white border-2 border-(--line) font-bold rounded-xl hover:bg-gray-50 transition"
            >
              Continue Practice
            </button>
            <button
              onClick={() => {
                onClose();
                window.location.href = `/lab${labNumber + 1}`;
              }}
              className="flex-1 py-3 px-4 bg-(--brand) text-white font-bold rounded-xl hover:bg-(--brand-strong) transition"
            >
              Next Lab →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
