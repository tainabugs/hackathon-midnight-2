import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";

export const QuestionModal = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="flex flex-col gap-y-8">
      <motion.p
        initial={{ opacity: 0, x: 150 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 1, ease: [0.25, 1, 0.5, 1] }}
        className="text-[20px]"
      >
        Create a new question
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1.5 }}
      >
        <Input
          className="pl-6 text-[18px] placeholder:text-[18px] h-12 shadow-md border-[0.5px] border-[#8D8D8D]/30 bg-[#FFFEF8] focus-visible:ring-[#8A37F8]/20"
          placeholder="what's on your mind?"
        />
      </motion.div>
      <div className="flex justify-end">
        <motion.button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1 }}
          transition={{ delay: isHovered ? 0 : 0.8, duration: isHovered ? 0.2 : 1.5 }}
          whileHover={{
            scale: 1.1,
            transition: { scale: { delay: 0, duration: 0.2 } },
          }}
         
          className="bg-[#8A37F8]/55 shadow-lg w-max px-5 h-10 rounded-[5px] text-[18px] text-white"
        >
          Send
        </motion.button>
      </div>
    </div>
  );
};
