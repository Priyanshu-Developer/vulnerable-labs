"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type LabCompleteGreetingProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  username?: string;
  nextLabLink : string;
};

export default function LabCompleteGreeting({
  isOpen,
  onOpenChange,
  username,
  nextLabLink
}: LabCompleteGreetingProps) {
  const displayName = username?.trim() || "Researcher";
  const router = useRouter()

  const nextLab = (onClose: () => void) => {
    onClose()
    router.push(nextLabLink)
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      className="border border-[rgba(118,255,187,0.24)] bg-[linear-gradient(155deg,rgba(13,27,23,0.94),rgba(8,16,14,0.86))]"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-[#f2fff8]">Lab Complete</ModalHeader>
            <ModalBody>
              <div className="relative overflow-hidden rounded-xl border border-[rgba(124,255,187,0.22)] bg-[rgba(6,14,12,0.72)] px-4 py-4">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  {Array.from({ length: 14 }).map((_, index) => (
                    <motion.span
                      key={index}
                      className="absolute -top-3 h-2 w-2 rounded-full"
                      style={{
                        left: `${index * 7 + 2}%`,
                        backgroundColor: `hsl(${140 + index * 8} 95% 68%)`,
                      }}
                      animate={{ y: [0, 160], rotate: [0, 240], opacity: [0, 0.95, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                        delay: index * 0.11,
                      }}
                    />
                  ))}
                </div>
                <p className="m-0 font-semibold tracking-[0.03em] text-[#f2fff8]">Access Granted</p>
                <p className="mt-2 text-sm leading-6 text-[#b8d9cb]">
                  Great work, <strong>{displayName}</strong>. You just triggered the lab completion flow.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="success" radius="sm" onPress={() => nextLab(onClose)}>
                Continue
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
