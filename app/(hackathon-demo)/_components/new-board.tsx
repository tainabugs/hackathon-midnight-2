"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface NewBoardProps {
  onClick: (state: boolean) => void;
}

export const NewBoard = ({ onClick }: NewBoardProps) => {
  return (
    <motion.div
      onClick={() => onClick(true)}
      initial={{ scale: 1, backgroundColor: "rgba(255, 254, 248, 0.25)" }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0px 7px 12px rgba(0, 0, 0, 0.1)",
        backgroundColor: "rgba(255, 254, 248, 0.35)",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex flex-col items-center gap-y-12 h-64 w-64 pt-12 px-6 rounded-[4px] backdrop-blur-xl  cursor-pointer"
    >
      <p className="text-[17px]">Create new question</p>
      <Image src="/plus.svg" alt="new question" width={35} height={35} />
    </motion.div>
  );
};
