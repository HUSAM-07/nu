import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        <div className="flex-1">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mt-4 sm:mt-8 mb-8 sm:mb-16">
            <span className="block text-xl sm:text-2xl mb-2 sm:mb-4 text-gray-800">Nu.</span>
            Know what&apos;s in it.
          </h1>
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Button variant="outline" className="rounded-full px-6 sm:px-8 py-1.5 sm:py-2 border-gray-400 text-sm sm:text-base">
              Eat.
            </Button>
            <Button variant="outline" className="rounded-full px-6 sm:px-8 py-1.5 sm:py-2 border-gray-400 text-sm sm:text-base">
             Track.
            </Button>
            <Button variant="outline" className="rounded-full px-6 sm:px-8 py-1.5 sm:py-2 border-gray-400 text-sm sm:text-base">
              Breathe.
            </Button>
          </div>
        </div>
        <div className="flex-1 mt-8 lg:mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 grid-rows-3 gap-3 sm:gap-6 relative">
            <div className="col-span-1 sm:col-span-2 row-span-2">
              <Image
                src="/bakery-image.png"
                alt="Freshly baked croissant"
                width={400}
                height={400}
                className="object-contain w-full h-auto"
                priority
              />
            </div>
            <div className="col-span-1 sm:col-span-2 row-span-2 sm:col-start-3 sm:row-start-2">
              <Image
                src="/bakery-image.png"
                alt="Fresh artisan bread"
                width={400}
                height={400}
                className="object-contain w-full h-auto"
                priority
              />
            </div>
            <div className="col-span-1 sm:col-span-2 row-span-2 sm:col-start-3">
              <Image
                src="/bakery-image.png"
                alt="Cinnamon roll"
                width={300}
                height={300}
                className="object-contain w-full h-auto"
                priority
              />
            </div>
            <div className="col-span-1 sm:col-span-2 row-span-1 sm:row-start-3">
              <Image
                src="/bakery-image.png"
                alt="Chocolate chip cookies"
                width={300}
                height={300}
                className="object-contain w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
