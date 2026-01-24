import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";


const IMG_PADDING = 12;

const TextParallaxContent = ({ imgUrl, subheading, heading, children }) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      {/* TEXT FIRST */}
      {children}

      {/* IMAGE NEXT */}
      <div className="relative h-[150vh] mt-8">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
    </div>
  );
};

const StickyImage = ({ imgUrl }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

const OverlayCopy = ({ subheading, heading }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <p className="mb-2 text-center text-xl md:mb-4 md:text-3xl">
        {subheading}
      </p>
      <p className="text-center text-4xl font-bold md:text-7xl">{heading}</p>
    </motion.div>
  );
};

const ExampleContent = ({ title }) => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-12 pt-12 md:grid-cols-12">
    <h2 className="col-span-1 text-3xl font-bold md:col-span-4 text-gray-900 dark:text-white">{title}</h2>
    <div className="col-span-1 md:col-span-8">
      <p className="mb-4 text-xl text-gray-600 dark:text-gray-300 md:text-2xl">
        Our collections are designed with a focus on versatility, comfort, and considered detail. 
        Each piece is thoughtfully crafted to move effortlessly between environments, 
        without compromising on structure or refinement.
      </p>
      <p className="mb-8 text-xl text-gray-600 dark:text-gray-300 md:text-2xl">
        From tailored outerwear to everyday essentials, we balance form and function to create garments that feel natural to wear, 
        whether navigating the city or stepping away from it.
      </p>
      <button className="w-full rounded bg-gray-900 dark:bg-white px-9 py-4 text-xl text-white dark:text-black transition-colors hover:bg-gray-700 dark:hover:bg-gray-200 md:w-fit">
        Learn more <FiArrowUpRight className="inline" />
      </button>
    </div>
  </div>
);

export const TextParallaxContentExample = () => {
  return (
    <div className="bg-white dark:bg-gray-950">
      <TextParallaxContent
        imgUrl="/src/assets/assets/new_frontend_assets/par_trendy.jpg"
        subheading="Inclusive"
        heading="Designed for everyone."
      >
        <ExampleContent title="Refined comfort, designed for every setting" />
      </TextParallaxContent>

      <TextParallaxContent
        imgUrl="/src/assets/assets/new_frontend_assets/par_comfort.jpg"
        subheading="Sustainable"
        heading="Designed with intention."
      >
        <ExampleContent title="Sustainability meets style" />
      </TextParallaxContent>

      <TextParallaxContent
        imgUrl="/src/assets/assets/new_frontend_assets/par_sustainable.jpg"
        subheading="Timeless"
        heading="Elegance for modern living."
      >
        <ExampleContent title="Timeless elegance for modern living" />
      </TextParallaxContent>
    </div>
  );
};
