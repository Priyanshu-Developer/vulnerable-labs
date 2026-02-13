"use client";

import * as Dialog from "@radix-ui/react-dialog";
import confetti from "canvas-confetti";
import React, { useEffect } from "react";

interface GreetingProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  link:string;
}

const Greeting: React.FC<GreetingProps> = ({ open, onOpenChange, link }) => {

  // 🎉 Trigger confetti when dialog opens
  useEffect(() => {
    if (open) {
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          spread: 70,
          origin: { y: 0.6 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [open]);

  const handleContinue = () => {
    onOpenChange(false);
    window.location.href = link; // Navigate to the provided link
   };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Dialog Content */}
        <Dialog.Content className="fixed left-1/2 top-1/2 w-87.5 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl text-center animate-in fade-in zoom-in-95">

          <Dialog.Title className="text-2xl font-bold text-green-600">
            🎉 Lab Completed!
          </Dialog.Title>

          <p className="mt-2 text-gray-600">
            Awesome work! Next lab is now unlocked.
          </p>

          <button
            onClick={handleContinue}
            className="mt-5 rounded-xl bg-green-500 px-5 py-2 text-white hover:bg-green-600 transition"
            type="button"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Continue 🚀
          </button>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Greeting;
