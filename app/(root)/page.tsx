import { Button } from "@/components/ui/button";
import { vocabularies } from "../../constant/index";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="text-4xl pb-20">Topic</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-3xl">
        {vocabularies.map((vocabulary, index) => (
          <Link href={`/${vocabulary.topic}`} key={index}>
            <Button className="w-full py-2 bg-[#ccc] text-black shadow-md hover:bg-[#ddd]">
              {vocabulary.topic}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
