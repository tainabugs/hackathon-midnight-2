"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Patrick_Hand, Raleway } from "next/font/google";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { ContractAddress } from "@midnight-ntwrk/compact-runtime";

import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { BoardDeployment, BrowserDeployedQuetionsManager, logger } from "@/lib/question-contract";
import { BBoardDerivedState, DeployedBBoardAPI } from "@/lib/question-contract/api";
import { STATE } from "@/lib/question-contract/contract";
import { useShowToast } from "@/hooks/use-show-toast";

const patrick_hand = Patrick_Hand({
  subsets: ["latin"],
  weight: ["400"],
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

interface BoardProps {
  address: string;
}

export const Board = ({ address }: BoardProps) => {
  const {isDisabled, setIsDisabled, setNotDisabled} = useShowToast();
  const quetionsApiProvider = new BrowserDeployedQuetionsManager(logger);
  const [boardDeployment, setBoardDeployment] = useState<BoardDeployment>();
  const [deployedBoardAPI, setDeployedBoardAPI] = useState<DeployedBBoardAPI>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [boardState, setBoardState] = useState<BBoardDerivedState>();
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    const subscription = quetionsApiProvider.boardDeployment$.subscribe(setBoardDeployment);
    onJoinBoard(address);

    return () => {
      subscription.unsubscribe();
    };
  }, [address]);

  useEffect(() => {
    if (!boardDeployment) {
      return;
    }
    if (boardDeployment.status === "in-progress") {
      return;
    }

    setIsWorking(false);

    if (boardDeployment.status === "failed") {
      setErrorMessage(boardDeployment.error.message.length ? boardDeployment.error.message : "Encountered an unexpected error.");
      return;
    }

    setDeployedBoardAPI(boardDeployment.api);
    const subscription = boardDeployment.api.state$.subscribe(setBoardState);
    return () => {
      subscription.unsubscribe();
    };
  }, [boardDeployment, setIsWorking, setErrorMessage, setDeployedBoardAPI]);

  const formSchema = z.object({
    message: z.string().min(4, { message: "Must be 4 or more characters long" }).max(200, { message: "Must be 200 characters or fewer" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      onPostMessage(values.message);

    } catch {
      // setShowError(true);
    }
  };

  const onJoinBoard = (contractAddress: ContractAddress) => quetionsApiProvider.resolveAddress(contractAddress);

  const onPostMessage = useCallback(
    async (message: string) => {
      try {
        if (deployedBoardAPI) {
          setIsDisabled()
          setIsWorking(true);
          await deployedBoardAPI.post(message);
          setNotDisabled();
          form.reset()
        }
      } catch (error: unknown) {
        setErrorMessage(error instanceof Error ? error.message : String(error));
        setNotDisabled();
      } finally {
        setIsWorking(false);
      }
    },
    [deployedBoardAPI, setErrorMessage, setIsWorking]
  );

  const onDeleteMessage = useCallback(async () => {
    try {
      if (deployedBoardAPI) {
        setIsWorking(true);
        await deployedBoardAPI.takeDown();
      }
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsWorking(false);
    }
  }, [deployedBoardAPI, setErrorMessage, setIsWorking]);

  const onCopyContractAddress = useCallback(async () => {
    if (deployedBoardAPI) {
      await navigator.clipboard.writeText(deployedBoardAPI.deployedContractAddress);
    }
  }, [deployedBoardAPI]);

  return (
    <motion.div
      initial={{ scale: 1, backgroundColor: "rgba(255, 254, 248, 0.25)" }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0px 7px 12px rgba(0, 0, 0, 0.1)",
        backgroundColor: "rgba(255, 254, 248, 0.35)",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex flex-col items-center justify-between h-64 w-64 pt-6 px-6  pb-16 rounded-[4px] backdrop-blur-xl  cursor-pointer"
    >
      <p className="w-full pl-2 text-[16px] leading-tight">{boardState?.title}</p>
      {boardState?.state === STATE.occupied ? (
        <div className={`${patrick_hand.className} cursor-not-allowed bg-[#FFFEF8]/30 w-full h-28 rounded-[3px] shadow-sm p-4 text-[18px]`}>
          {boardState.message}
        </div>
      ) : (
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <Textarea
                        className={`${patrick_hand.className} bg-[#FFFEF8]/30 w-full h-28 shadow-sm p-4 text-[18px] resize-none 
                      focus-visible:ring-0 focus-visible:ring-offset-0 border-none rounded-[3px] focus:bg-[#FFFEF8]/70
                     placeholder:text-[#9e9e9e] placeholder:font-raleway placeholder:text-[16px]`}
                        placeholder="Share your thoughts"
                        style={{}}
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

      <div className="absolute flex items-end bottom-4 right-5 gap-x-2">
        {boardState?.state === STATE.occupied && boardState.isOwner && (
          <div className="p-2 rounded-[8px] hover:bg-[#fafafa]/35 transition-all" onClick={onDeleteMessage}>
            <Image src="/trash-bin.svg" alt="Background" width={18} height={18} />
          </div>
        )}
        {!(boardState?.state === STATE.occupied) && (
          <div className="p-2 rounded-[8px] hover:bg-[#fafafa]/25 transition-all" onClick={form.handleSubmit(onSubmit)}>
            <Image src="/send.svg" alt="Background" width={18} height={18} />
          </div>
        )}
      </div>
    </motion.div>
  );
};
