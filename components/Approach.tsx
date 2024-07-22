import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "./ui/CanvasRevealEffect";
import { useTranslation } from "react-i18next";

const Approach = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full py-20">
      <h1 className="heading text-black text-4xl font-bold text-center mb-12">
        {t("what_else_leadai_offers")}
      </h1>
      <div className="my-20 flex flex-col lg:flex-row items-center justify-center w-full gap-4">
        <Card
          titleKey="free_university_selection_title"
          desKey="free_university_selection_des"
        >
          <CanvasRevealEffect
            animationSpeed={5.1}
            containerClassName="bg-red-900 rounded-3xl overflow-hidden"
          />
        </Card>
        <Card
          titleKey="personalized_study_advice_title"
          desKey="personalized_study_advice_des"
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
          titleKey="tailored_applicant_assistance_title"
          desKey="tailored_applicant_assistance_des"
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
  titleKey,
  children,
  desKey,
}: {
  titleKey: string;
  children?: React.ReactNode;
  desKey: string;
}) => {
  const [hovered, setHovered] = React.useState(false);
  const { t } = useTranslation();

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
        <h2 className="text-white text-3xl font-bold mb-4">{t(titleKey)}</h2>
        <b className="text-base text-white mt-4 opacity-100">{t(desKey)}</b>
      </motion.div>
    </div>
  );
};
