"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Patrick_Hand } from "next/font/google";

const patrick_hand = Patrick_Hand({
  subsets: ["latin"],
  weight: ["400"],
});

interface BoardProps {
  title: string;
  message: string;
  isFilled: boolean;
}

export const Board = ({ title, message, isFilled }: BoardProps) => {
  return (
    <motion.div
      initial={{ scale: 1, backgroundColor: "rgba(255, 254, 248, 0.25)" }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0px 7px 12px rgba(0, 0, 0, 0.1)",
        backgroundColor: "rgba(255, 254, 248, 0.35)",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex flex-col items-center justify-between h-80 w-80 pt-10 px-8 pb-20 rounded-[4px] backdrop-blur-xl  cursor-pointer"
    >
      <p className="w-full pl-4 text-[20px]">{title}</p>
      <div
        className={`${patrick_hand.className} bg-[#FFFEF8]/60 w-full h-28 rounded-[3px] shadow-sm p-5 text-[20px]`}
      >
        {message}
      </div>
      <div className="absolute flex items-end bottom-5 right-6 gap-x-2">
        {isFilled && (
          <div className="p-2 rounded-[8px] hover:bg-[#fafafa]/35 transition-all">
            <Image
              src="/trash-bin.svg"
              alt="Background"
              width={20}
              height={20}
            />
          </div>
        )}
      {!isFilled &&
      <div className="p-2 rounded-[8px] hover:bg-[#fafafa]/25 transition-all">
      <Image
        src="/create-note.svg"
        alt="Background"
        width={20}
        height={20}
      />
    </div>
      }
        
      </div>
    </motion.div>
  );
};
