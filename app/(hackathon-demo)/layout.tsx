import Image from "next/image";

interface PageLayoutProps {
  children: React.ReactNode;
}


const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen h-screen ">
      <div className="absolute flex items-center justify-between h-24 w-full px-10 text-[20px]">
         <h1>Hackathon demo - Next.js 14</h1>
         <div className="flex items-center gap-x-2 text-[18px]">
          <p>Features</p>
          <Image 
          src="/info.svg"
          alt="info"
          width={15}
          height={15}
          />
        </div>
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
