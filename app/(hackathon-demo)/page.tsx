"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { QuestionModal } from "./_components/question-modal";
import { userData } from "@/mockup-db/database";
import { Board } from "./_components/board";
import { NewBoard } from "./_components/new-board";

const Page = () => {
  return (
    <div className="relative w-full h-screen overflow-y-auto flex pt-64 justify-center items-start ">
      <div className="grid grid-cols-4 gap-10 ">
        <Dialog>
          <DialogTrigger>
            <NewBoard />
          </DialogTrigger>
          <DialogContent>
            <div>
              <QuestionModal />
            </div>
          </DialogContent>
        </Dialog>
        {userData.map((item, index) => (
          <Board
            key={index}
            title={item.title}
            message={item.message}
            isFilled={item.isFilled}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
