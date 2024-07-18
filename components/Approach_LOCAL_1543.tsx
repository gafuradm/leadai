import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "./ui/CanvasRevealEffect";

const Approach = () => {
  return (
    <section className="w-full py-20">
      <h1 className="heading text-black text-4xl font-bold text-center mb-12">
        What else will you get using LeadAI?
      </h1>
      <div className="my-20 flex flex-col lg:flex-row items-center justify-center w-full gap-4">
        <Card
          title="Free university selection"
          des="Leverage the power of AI to find the perfect university for you based on your academic performance, personal preferences, and future career goals. Our system analyzes a wide range of factors to recommend institutions that align with your unique profile."
        >
          <CanvasRevealEffect
            animationSpeed={5.1}
            containerClassName="bg-red-900 rounded-3xl overflow-hidden"
          />
        </Card>
        <Card
          title="Personalized study advice"
          des="Take a comprehensive survey designed to assess your interests, strengths, and preferred study environments. Based on your responses, receive tailored recommendations for the best study destinations that match your profile and aspirations."
        >
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-pink-900 rounded-3xl overflow-hidden"
            colors={[
              [255, 166, 158],
              [221, 255, 247],
            ]}
            dotSize={2}
          />
        </Card>
        <Card
          title="Tailored applicant assistance"
          des="Receive detailed, personalized advice to enhance your application process. Our AI identifies your strengths and areas for improvement, offering guidance on how to showcase your abilities effectively and increase your chances of success."
        >
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-red-900 rounded-3xl overflow-hidden"
            colors={[[125, 211, 252]]}
          />
        </Card>
      </div>
    </section>
  );
};

export default Approach;

const Card = ({
  title,
  children,
  des,
}: {
  title: string;
  children?: React.ReactNode;
  des: string;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-black/[0.2] group/canvas-card flex flex-col items-center justify-center dark:border-white/[0.2] max-w-sm w-full mx-auto p-6 relative lg:h-[35rem] rounded-3xl overflow-hidden"
      style={{
        background: "rgb(128, 0, 32)",
        backgroundColor:
          "linear-gradient(90deg, rgba(128, 0, 32, 1) 0%, rgba(80, 0, 20, 1) 100%)",
      }}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-20 text-center"
        initial={{ y: 0 }}
        animate={{ y: hovered ? -20 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-white text-3xl font-bold mb-4">{title}</h2>
        <b className="text-base text-white mt-4 opacity-100">{des}</b>
      </motion.div>
    </div>
  );
};
