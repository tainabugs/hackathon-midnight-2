"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { firstValueFrom } from "rxjs";

import {
  BrowserDeployedQuetionsManager,
  logger,
} from "@/lib/question-contract";
import { useShowToast } from "@/hooks/use-show-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { QuestionModal } from "./_components/question-modal";
import { Board } from "./_components/board";
import { NewBoard } from "./_components/new-board";
import { useMessageLoading } from "@/hooks/use-message-loading-map";
import { useToast } from "@/hooks/use-toast";

const Page = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isDisabled } = useShowToast();
  const { isLoading } = useMessageLoading();
  const data = useQuery(api.quetionsFunction.getTaskList, {});
  const mutateSomething = useMutation(api.quetionsFunction.createTask);
  const onCreateBoard = async (title: string) => {
    const quetionsApiProvider = new BrowserDeployedQuetionsManager(logger);
    const deployment$ = await quetionsApiProvider.resolveTitle(title);
    const deployment = await firstValueFrom(deployment$);
    toast({
      title: "Your question was successfully submitted!",
    });
    setIsDialogOpen(false);
    if (deployment.status === "deployed") {
      console.log("address", deployment.api.deployedContractAddress);
      mutateSomething({ address: deployment.api.deployedContractAddress });
    }
  };
  return (
    <div className="relative w-full h-screen overflow-y-auto flex pt-[210px] justify-center items-start ">
      <div className="grid grid-cols-4 gap-7 ">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <NewBoard onClick={setIsDialogOpen} />
          </DialogTrigger>
          <DialogContent>
            <div>
              <QuestionModal onCreateBoardCallback={onCreateBoard} />
            </div>
          </DialogContent>
        </Dialog>

        {data ? (
          data.map((item, index) => (
            <Board key={index} address={item.address} index={index} />
          ))
        ) : (
          <>
            <BoardSkeleton />
            <BoardSkeleton />
            <BoardSkeleton />
            <BoardSkeleton />
            <BoardSkeleton />
            <BoardSkeleton />
            <BoardSkeleton />
          </>
        )}
      </div>
      {(isDisabled || isLoading) && (
        <motion.div
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.25, 1, 0.5, 1] }}
          className="absolute z-50 bottom-6 right-6 bg-[#FFFEF8]/40 flex items-start justify-center p-6 rounded-[5px] shadow-lg backdrop-blur-lg"
        >
          <div className="flex flex-col animate-pulse">
            <span className="text-[15px] text-black font-semibold">
              Generating proof . . .
            </span>
            <span className="text-[12px]">
              This might take longer than explaining zero knowledge!
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Page;

const BoardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-64 w-64 rounded-[4px] bg-[#FFFEF8]/30 backdrop-blur-xl" />
    </div>
  );
};
