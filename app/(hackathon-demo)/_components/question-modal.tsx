import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useShowToast } from "@/hooks/use-show-toast";

export interface QuestionModalProps {
  onCreateBoardCallback: (title: string) => Promise<void>;
}

export const QuestionModal = ({
  onCreateBoardCallback,
}: QuestionModalProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const {isDisabled, setIsDisabled, setNotDisabled} = useShowToast();
  const formSchema = z.object({
    title: z
      .string()
      .min(4, { message: "Must be 4 or more characters long" })
      .max(500, { message: "Must be 200 characters or fewer" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsDisabled();
      await onCreateBoardCallback(values.title);
      setNotDisabled();
      form.reset();
    } catch {
      setNotDisabled();
    }
  };

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="">
                  <FormControl>
                    <Input
                      className="pl-6 text-[18px] placeholder:text-[18px] h-12 shadow-md border-[0.5px] border-[#8D8D8D]/30 bg-[#FFFEF8] focus-visible:ring-[#8A37F8]/20"
                      placeholder="what's on your mind?"
                      disabled={isDisabled}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </motion.div>
      <div className="flex justify-end">
        {!isDisabled ? (
          <motion.button
            onClick={form.handleSubmit(onSubmit)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: isHovered ? 0 : 0.8,
              duration: isHovered ? 0.2 : 1.5,
            }}
            whileHover={{
              scale: 1.1,
              transition: { scale: { delay: 0, duration: 0.2 } },
            }}
            className="bg-[#8A37F8]/65 shadow-lg w-[90px] h-10 rounded-[5px] text-[18px] text-white"
          >
            Send
          </motion.button>
        ) : (
          <button
         className="flex justify-center items-center bg-[#8A37F8]/35 shadow-lg cursor-not-allowed h-10 w-[90px] rounded-[5px]"
          >
            <Image
            className="animate-spin" 
            src="/loading.svg"
            alt="loading"
            width={18}
            height={18}
            />
          </button>
        )}
      </div>
    </div>
  );
};
