import Image from "next/image";

interface PageLayoutProps {
  children: React.ReactNode;
}


const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen h-screen ">
      <div className="absolute top-6 left-6 text-[22px]"> Hackathon demo - Next.js 14</div>
      <Image
        src="/gradient-bg.png" // Path to your image
        layout="fill" // Ensures the image covers the entire div
        objectFit="cover" // Ensures the image covers the area
        objectPosition="center" // Centers the image
        alt="Background"
        quality={100} // Adjust the quality as needed
        priority // Loads the image with higher priority
        className="absolute -z-10" // Ensures the image is behind other content
      />
      {children}
    </div>
  );
};

export default PageLayout;
