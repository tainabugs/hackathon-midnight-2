import Image from "next/image";
import Link from "next/link";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const Navbar = () => {
  return (
    <div className="flex items-center justify-between h-20 px-10 text-[16px]">
      <div className="flex gap-x-20">
        <Image
          src="/midnight-logo-black.svg"
          alt="info"
          width={100}
          height={50}
        />
        <h1>Hackathon demo - Next.js 14</h1>
      </div>

      <div className="flex gap-x-12">
        <Link
          href="https://github.com/tainabugs/hackathon-midnight-2/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="flex items-center gap-x-2 cursor-pointer">
            <Image src="/file.svg" alt="info" width={12} height={12} />
            <p>Documentation</p>
          </button>
        </Link>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-x-2 ">
              <Image src="/info.svg" alt="info" width={14} height={14} />
              <p>Features</p>
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="bg-white h-60 w-60"></div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
