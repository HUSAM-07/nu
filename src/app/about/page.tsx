import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">

      {/* Main content with two columns */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-16">
        {/* Left column with image and metadata */}
        <div className="md:w-1/3">
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-6 sm:mb-10">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/bakery-image.png"
                alt="Cinnamon roll pastry"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: "contain" }}
                priority
                className="p-6"
              />
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Role</div>
              <div className="font-medium">Indie Project</div>
              <div className="text-sm">Learning Exploration</div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Date</div>
              <div className="font-medium">2023</div>
            </div>

            {/* Nutrition facts moved here with better responsive design */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8 justify-start">
              <div className="flex flex-col items-center">
                <div className="bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-1 text-center shadow-sm">
                  <span className="text-base sm:text-lg font-bold">320</span>
                </div>
                <span className="text-xs mt-1">Calories</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-1 text-center shadow-sm">
                  <span className="text-base sm:text-lg font-bold">17g</span>
                </div>
                <span className="text-xs mt-1">Fat</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-1 text-center shadow-sm">
                  <span className="text-base sm:text-lg font-bold">38g</span>
                </div>
                <span className="text-xs mt-1">Carbs</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-1 text-center shadow-sm">
                  <span className="text-base sm:text-lg font-bold">6g</span>
                </div>
                <span className="text-xs mt-1">Protein</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column with company description */}
        <div className="md:w-2/3 mt-8 md:mt-0">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            Nu. is an indie tool built as a personal exploration into multi-modal AI capabilities. Created as a side project to provide practical value while learning, it represents an experiment in bridging the gap between cutting-edge AI technology and everyday utility.
          </h1>
          
          <p className="text-gray-700 mb-8 sm:mb-12 leading-relaxed">
            This project was born from a simple curiosity: could I leverage multi-modal models to solve a real-world problem? The result is Nu., a tool that analyzes food images to provide nutritional insights. Under the hood, it&apos;s powered by state-of-the-art vision-language models, but on the surface, it&apos;s designed to be approachable and immediately useful.
          </p>

          <div className="mb-8 sm:mb-16">
            <h2 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">Learning Goals</h2>
            <p className="text-gray-700 leading-relaxed">
              Building Nu. has been an educational journey into the practical applications of multi-modal AI models. It&apos;s a hands-on exploration of how these powerful technologies can be harnessed to create intuitive user experiences that provide tangible benefits in everyday scenarios.
            </p>
          </div>
          
          <div className="mb-8 sm:mb-16">
            <h2 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">Why I Built This</h2>
            <p className="text-gray-700 leading-relaxed">
              As someone fascinated by both nutrition and AI, I wanted to create something that merged these interests while pushing my technical boundaries. This project has been a playground for experimenting with prompt engineering, image analysis techniques, and user experience design for AI-powered tools.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mt-8">
            <p className="text-gray-700 text-sm">
              Nu. represents my belief that innovative AI technology should be accessible and beneficial in everyday life. It demonstrates how independent developers can leverage powerful models to create practical applications. This project is open for feedback, contributions, and conversations about the intersection of AI and real-world utility.
            </p>
          </div>

          <div className="mt-8 sm:mt-12 flex justify-start">
            <Link href="/console">
              <Button 
                variant="outline" 
                className="rounded-none px-6 sm:px-8 py-4 sm:py-6 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 text-sm sm:text-base group flex items-center"
              >
                <span className="mr-2 sm:mr-3">Try It Now</span>
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
