import { useState } from "react"
import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Card } from "./card"
import { Icons } from "./icons"

export function Testimonials({
  testimonials,
  className,
  title = "What our clients say",
  description = "Thoughts from clients who value design, quality, and everyday wearability.",
  maxDisplayed = 6,
}) {
  const [showAll, setShowAll] = useState(false)

  const openInNewTab = (url) => {
    window.open(url, "_blank")?.focus()
  }

  return (
    <div className={className}>
      <div className="flex flex-col items-center justify-center pt-5">
        <div className="flex flex-col gap-5 mb-8">
          <h2 className="text-center text-4xl font-medium text-gray-900 dark:text-white">{title}</h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            {description.split("<br />").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i !== arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="relative">
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4",
            !showAll &&
              testimonials.length > maxDisplayed &&
              "max-h-[800px] overflow-hidden",
          )}
        >
          {testimonials
            .slice(0, showAll ? undefined : maxDisplayed)
            .map((testimonial, index) => (
              <Card
                key={index}
                className="p-6 relative bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex flex-col pl-4">
                    <span className="font-semibold text-base text-gray-900 dark:text-white">
                      {testimonial.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.username}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed">
                    {testimonial.text}
                  </p>
                </div>
                {/* <button
                  onClick={() => openInNewTab(testimonial.social)}
                  className="absolute top-6 right-6 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                >
                  <Icons.twitter className="h-5 w-5" aria-hidden="true" />
                </button>*/}
              </Card>
            ))}
        </div>

        {testimonials.length > maxDisplayed && !showAll && (
          <>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-black to-transparent" />
            <div className="absolute bottom-0 left-0 w-full flex justify-center pb-4">
              <Button 
                variant="secondary" 
                onClick={() => setShowAll(true)}
                className="bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 shadow-sm"
              >
                Load More
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
