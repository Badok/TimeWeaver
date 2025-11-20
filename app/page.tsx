import Image from "next/image";
import Hero from "@/app/components/Landing/Hero/Hero";


export default function Home() {
    const handleSignUp = () => {
        alert('Signing up...');
    };
  return (
      <div className="">
          <Hero />
      </div>
  );
}