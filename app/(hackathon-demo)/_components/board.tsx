"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Patrick_Hand } from "next/font/google";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const formSchema = z.object({
    answer: z
      .string()
      .min(4, { message: "Must be 4 or more characters long" })
      .max(200, { message: "Must be 200 characters or fewer" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: "",
    },
  });

  // const onSubmit = async (values: z.infer<typeof formSchema>) => {
  //   try {
  //     await sendEmail(
  //       values.name,
  //       values.email,
  //       values.subject,
  //       values.message,
  //       values.organization
  //     );
  //     setShowMessage(true);
  //     form.reset();
  //   } catch {
  //     setShowError(true);
  //   }
  // };

  return (
    <motion.div
      initial={{ scale: 1, backgroundColor: "rgba(255, 254, 248, 0.25)" }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0px 7px 12px rgba(0, 0, 0, 0.1)",
        backgroundColor: "rgba(255, 254, 248, 0.35)",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex flex-col items-center justify-between h-80 w-80 pt-10 px-6  pb-20 rounded-[4px] backdrop-blur-xl  cursor-pointer"
    >
      <p className="w-full pl-4 text-[20px]">{title}</p>
      {isFilled ? (
        <div
          className={`${patrick_hand.className} cursor-not-allowed bg-[#FFFEF8]/60 w-full h-28 rounded-[3px] shadow-sm p-4 text-[20px]`}
        >
          {message}
        </div>
      ) : (
        <div className="w-full">
          <Form {...form}>
            <form
            // onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <Textarea
                        className={`${patrick_hand.className} bg-[#FFFEF8]/60 w-full h-28 shadow-sm p-4 text-[20px] resize-none 
                      focus-visible:ring-0 focus-visible:ring-offset-0 border-none rounded-[3px] 
                     placeholder:text-[#9e9e9e] placeholder:font-['Raleway'] placeholder:text-[18px]`}
                        placeholder="Share your thoughts"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      )}

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
        {!isFilled && (
          <div className="p-2 rounded-[8px] hover:bg-[#fafafa]/25 transition-all">
            <Image src="/send.svg" alt="Background" width={20} height={20} />
          </div>
        )}
      </div>
    </motion.div>
  );
};
