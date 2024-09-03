"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { userData } from "@/mockup-db/database";


export const NewBoard = () => {
  const testando = () => {   

    console.log(userData); // You can see the updated data here
  };
  return (
    <motion.div
      onClick={testando}
      initial={{ scale: 1, backgroundColor: "rgba(255, 254, 248, 0.25)" }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0px 7px 12px rgba(0, 0, 0, 0.1)",
        backgroundColor: "rgba(255, 254, 248, 0.35)",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex flex-col items-center gap-y-12 h-80 w-80 pt-16 px-6 rounded-[4px] backdrop-blur-xl  cursor-pointer"
    >
      <p className="text-[20px]">Create new question</p>
      <Image src="/new.svg" alt="Background" width={40} height={40} />
    </motion.div>
  );
};
