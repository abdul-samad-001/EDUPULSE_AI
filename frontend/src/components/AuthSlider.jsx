import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function AuthSlider({ images }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [images]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          alt="team"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute bottom-10 left-10 text-white">
        <h1 className="text-5xl font-bold">
          EduPulse AI
        </h1>

        <p className="mt-3 text-lg text-gray-200">
          Track Skills. Stay Focused.
          Become Placement Ready.
        </p>
      </div>
    </div>
  );
}

export default AuthSlider;