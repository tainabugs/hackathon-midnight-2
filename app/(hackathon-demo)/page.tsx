"use client";

import { userData } from "@/mockup-db/database";
import { Board } from "./board";
import { NewBoard } from "./new-board";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuestionModal } from "./question-modal";

const Page = () => {
  return (
    <div className="relative w-full h-screen overflow-y-scroll flex pt-64 justify-center items-start ">
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
