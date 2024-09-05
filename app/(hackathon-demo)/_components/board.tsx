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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  BoardDeployment,
  BrowserDeployedQuetionsManager,
  logger,
} from "@/lib/question-contract";
import {
  BBoardDerivedState,
  DeployedBBoardAPI,
} from "@/lib/question-contract/api";
import { STATE } from "@/lib/question-contract/contract";
import { useShowToast } from "@/hooks/use-show-toast";
import { useMessageLoading } from "@/hooks/use-message-loading-map";
import { useToast } from "@/hooks/use-toast";
import { loadBindings } from "next/dist/build/swc";

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
  index: number;
}

export const Board = ({ address, index }: BoardProps) => {
  const { toast } = useToast();
  const { isLoading, setIsLoading, setNotLoading, indexLoading } =
    useMessageLoading();
  const quetionsApiProvider = new BrowserDeployedQuetionsManager(logger);
  const [boardDeployment, setBoardDeployment] = useState<BoardDeployment>();
  const [deployedBoardAPI, setDeployedBoardAPI] = useState<DeployedBBoardAPI>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [boardState, setBoardState] = useState<BBoardDerivedState>();
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    setIsWorking(true);
    const subscription =
      quetionsApiProvider.boardDeployment$.subscribe(setBoardDeployment);
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

    if (boardDeployment.status === "failed") {
      setErrorMessage(
        boardDeployment.error.message.length
          ? boardDeployment.error.message
          : "Encountered an unexpected error."
      );
      return;
    }

    setDeployedBoardAPI(boardDeployment.api);
    const subscription = boardDeployment.api.state$.subscribe(setBoardState);
    setIsWorking(false);
    return () => {
      subscription.unsubscribe();
    };
  }, [boardDeployment, setIsWorking, setErrorMessage, setDeployedBoardAPI]);

  const formSchema = z.object({
    message: z
      .string()
      .min(4, { message: "Must be 4 or more characters long" })
      .max(200, { message: "Must be 200 characters or fewer" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof formSchema>,
    index: number
  ) => {
    try {
      onPostMessage(values.message, index);
    } catch {
      // setShowError(true);
    }
  };

  const onJoinBoard = (contractAddress: ContractAddress) =>
    quetionsApiProvider.resolveAddress(contractAddress);

  const onPostMessage = useCallback(
    async (message: string, index: number) => {
      try {
        if (deployedBoardAPI) {
          setIsLoading(index);
          await deployedBoardAPI.post(message);
          toast({
            title: "Message sent!",
          });
          setNotLoading();
          form.reset();
        }
      } catch (error: unknown) {
        setErrorMessage(error instanceof Error ? error.message : String(error));
        setNotLoading();
      }
    },
    [deployedBoardAPI, setErrorMessage]
  );

  const onDeleteMessage = useCallback(async () => {
    try {
      if (deployedBoardAPI) {
        setIsLoading(index);
        await deployedBoardAPI.takeDown();
        toast({
          title: "Your message was successfully deleted.",
        });
        setNotLoading();
      }
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
      setNotLoading();
    }
  }, [deployedBoardAPI, setErrorMessage]);

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
      <p className="w-full pl-2 text-[17px] leading-tight">
        {boardState ? boardState.title : <TitleSkeleton/>}
      </p>
      {boardState?.state === STATE.occupied ? (
        <button
          disabled={isLoading && indexLoading === index}
          className={`${patrick_hand.className} relative flex items-start cursor-not-allowed bg-[#FFFEF8]/30 w-full h-28 rounded-[3px] shadow-sm p-4 text-[18px]
          disabled:text-[#383838]/30 disabled:bg-[#FFFEF8]/15`}
        >
          <p>{boardState.message}</p>
          {isLoading && indexLoading === index && (
            <div className="absolute bottom-3 right-3">
              <Image
                className="animate-spin"
                src="/loading.svg"
                alt="loading"
                width={18}
                height={18}
              />
            </div>
          )}
        </button>
      ) : (
        <div className="relative w-full">
          {isLoading && indexLoading === index && (
            <div className="absolute bottom-3 right-3">
              <Image
                className="animate-spin"
                src="/loading.svg"
                alt="loading"
                width={18}
                height={18}
              />
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => onSubmit(values, index))}
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <Textarea
                        className={`${patrick_hand.className} bg-[#FFFEF8]/30 w-full h-28 shadow-sm p-4 text-[18px] resize-none 
                      focus-visible:ring-0 focus-visible:ring-offset-0 border-none rounded-[3px] focus:bg-[#FFFEF8]/70
                     placeholder:text-[#9e9e9e] placeholder:font-raleway placeholder:text-[15px]`}
                        placeholder="Share your thoughts"
                        disabled={isLoading && indexLoading === index}
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
      {/* {isWorking && <div >loading board</div>} */}

      <div className="absolute flex items-end bottom-4 right-5 gap-x-2">
        {boardState?.state === STATE.occupied &&
          boardState.isOwner &&
          (isLoading && indexLoading === index ? (
            <div
              className="p-2 rounded-[8px] cursor-not-allowed"
              onClick={onDeleteMessage}
            >
              <Image
                src="/trash-bin-disabled.svg"
                alt="Background"
                width={18}
                height={18}
              />
            </div>
          ) : (
            <div
              className="p-2 rounded-[8px] hover:bg-[#fafafa]/35 transition-all"
              onClick={onDeleteMessage}
            >
              <Image
                src="/trash-bin.svg"
                alt="Background"
                width={18}
                height={18}
              />
            </div>
          ))}
        {!(boardState?.state === STATE.occupied) &&
          (isLoading && indexLoading === index ? (
            <div
              className="p-2 rounded-[8px] cursor-not-allowed"
              onClick={form.handleSubmit((values) => onSubmit(values, index))}
            >
              <Image
                src="/send-disabled.svg"
                alt="Background"
                width={18}
                height={18}
              />
            </div>
          ) : (
            <div
              className="p-2 rounded-[8px] hover:bg-[#fafafa]/25 transition-all"
              onClick={form.handleSubmit((values) => onSubmit(values, index))}
            >
              <Image src="/send.svg" alt="Background" width={18} height={18} />
            </div>
          ))}
      </div>
    </motion.div>
  );
};

const TitleSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-full rounded-[4px] bg-[#FFFEF8]/30 backdrop-blur-xl" />
    </div>
  );
};