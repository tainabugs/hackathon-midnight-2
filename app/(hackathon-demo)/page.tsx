"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { QuestionModal } from "./_components/question-modal";
import { userData } from "@/mockup-db/database";
import { Board } from "./_components/board";
import { NewBoard } from "./_components/new-board";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BrowserDeployedQuetionsManager, logger } from "@/lib/question-contract";
import { firstValueFrom } from "rxjs";

const Page = () => {
  const data = useQuery(api.quetionsFunction.getTaskList, {});
  const mutateSomething = useMutation(api.quetionsFunction.createTask);
  const onCreateBoard = async (title: string) => {
    const quetionsApiProvider = new BrowserDeployedQuetionsManager(logger);
    const deployment$ = await quetionsApiProvider.resolveTitle(title);
    const deployment = await firstValueFrom(deployment$);
    if (deployment.status === "deployed") {
      console.log("address", deployment.api.deployedContractAddress);
      mutateSomething({ address: deployment.api.deployedContractAddress });
    }
  };
  return (
    <div className="relative w-full h-screen overflow-y-auto flex pt-64 justify-center items-start ">
      <div className="grid grid-cols-4 gap-10 ">
        <Dialog>
          <DialogTrigger>
            <NewBoard />
          </DialogTrigger>
          <DialogContent>
            <div>
              <QuestionModal onCreateBoardCallback={onCreateBoard} />
            </div>
          </DialogContent>
        </Dialog>
        {data && data.map((item, index) => (
          <Board
            key={index}
            address={item.address}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
