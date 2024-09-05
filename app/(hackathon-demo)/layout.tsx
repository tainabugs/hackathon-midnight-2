import Image from "next/image";
import { Navbar } from "./_components/navbar";

interface PageLayoutProps {
  children: React.ReactNode;
}


const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen h-screen relative ">
      <div className="absolute z-50 w-full ">
      <Navbar />
      </div>
      <Image
        src="/gradient-bg.png"
        layout="fill" 
        objectFit="cover" 
        objectPosition="center" 
        alt="Background"
        quality={100} 
        priority 
        className="absolute -z-10" 
      />
      {children}
    </div>
  );
};

export default PageLayout;
