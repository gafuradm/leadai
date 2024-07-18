import React from "react";
import { AnimatePresence, motion } from "framer-motion";
<<<<<<< HEAD
=======
import { useTranslation } from 'react-i18next';

>>>>>>> 4314e5a712c40fd8c1f52997cf8dd82fe84ea29c
import { CanvasRevealEffect } from "./ui/CanvasRevealEffect";

const Approach = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full py-20">
<<<<<<< HEAD
      <h1 className="heading text-black text-4xl font-bold text-center mb-12">
        What else will you get using LeadAI?
      </h1>
      <div className="my-20 flex flex-col lg:flex-row items-center justify-center w-full gap-4">
        <Card
          title="Free university selection"
          des="Leverage the power of AI to find the perfect university for you based on your academic performance, personal preferences, and future career goals. Our system analyzes a wide range of factors to recommend institutions that align with your unique profile."
=======
      <h1 className="heading text-black">
        {t('what_else_will_you_get_using_leadai')} <span className="text-black">LeadAI?</span>
      </h1>
      <div className="my-20 flex flex-col lg:flex-row items-center justify-center w-full gap-4">
        <Card
          title={t("meet_the_new_free_opportunity")}
          icon={<AceternityIcon order={t("Free university selection")} />}
          des={t("leaderai_will_select_university_based_on_grades_exams_and_preferences")}
>>>>>>> 4314e5a712c40fd8c1f52997cf8dd82fe84ea29c
        >
          <CanvasRevealEffect
            animationSpeed={5.1}
            containerClassName="bg-red-900 rounded-3xl overflow-hidden"
          />
        </Card>
        <Card
<<<<<<< HEAD
          title="Personalized study advice"
          des="Take a comprehensive survey designed to assess your interests, strengths, and preferred study environments. Based on your responses, receive tailored recommendations for the best study destinations that match your profile and aspirations."
=======
          title={t("dont_know_where_to_go_or_study")}
          icon={<AceternityIcon order={t("Free country selection")} />}
          des={t("take_a_survey_from_leaderai_find_best_place_to_study")}
>>>>>>> 4314e5a712c40fd8c1f52997cf8dd82fe84ea29c
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
<<<<<<< HEAD
          title="Tailored applicant assistance"
          des="Receive detailed, personalized advice to enhance your application process. Our AI identifies your strengths and areas for improvement, offering guidance on how to showcase your abilities effectively and increase your chances of success."
=======
          title={t("meet_new_assistant_to_help_applicants")}
          icon={<AceternityIcon order={t("Free advice and estimates")} />}
          des={t("received_score_but_dont_know_strengths_weaknesses")}
>>>>>>> 4314e5a712c40fd8c1f52997cf8dd82fe84ea29c
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
<<<<<<< HEAD
      className="border border-black/[0.2] group/canvas-card flex flex-col items-center justify-center dark:border-white/[0.2] max-w-sm w-full mx-auto p-6 relative lg:h-[35rem] rounded-3xl overflow-hidden"
      style={{
=======
      className="border border-black/[0.2] group/canvas-card flex items-center justify-center
       dark:border-white/[0.2]  max-w-sm w-full mx-auto p-4 relative lg:h-[35rem] rounded-3xl "
       style={{
>>>>>>> 4314e5a712c40fd8c1f52997cf8dd82fe84ea29c
        background: "rgb(128, 0, 32)",
        backgroundColor:
          "linear-gradient(90deg, rgba(128, 0, 32, 1) 0%, rgba(80, 0, 20, 1) 100%)",
      }}
    >
<<<<<<< HEAD
=======
      <Icon className="absolute h-10 w-10 -top-3 -left-3 dark:text-white text-black opacity-30" />
      <Icon className="absolute h-10 w-10 -bottom-3 -left-3 dark:text-white text-black opacity-30" />
      <Icon className="absolute h-10 w-10 -top-3 -right-3 dark:text-white text-black opacity-30" />
      <Icon className="absolute h-10 w-10 -bottom-3 -right-3 dark:text-white text-black opacity-30" />

>>>>>>> 4314e5a712c40fd8c1f52997cf8dd82fe84ea29c
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

<<<<<<< HEAD
      <motion.div
        className="relative z-20 text-center"
        initial={{ y: 0 }}
        animate={{ y: hovered ? -20 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-white text-3xl font-bold mb-4">{title}</h2>
        <b className="text-base text-white mt-4 opacity-100">{des}</b>
      </motion.div>
=======
      <div className="relative z-20 px-10">
        <div
          className="text-center group-hover/canvas-card:-translate-y-4 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] 
        group-hover/canvas-card:opacity-0 transition duration-200 min-w-40 mx-auto flex items-center justify-center"
        >
          {icon}
        </div>
        <h2
          className="dark:text-white text-center text-3xl opacity-0 group-hover/canvas-card:opacity-100
         relative z-10 text-black mt-4  font-bold group-hover/canvas-card:text-white 
         group-hover/canvas-card:-translate-y-2 transition duration-200"
        >
          {title}
        </h2>
        <p
          className="text-sm opacity-0 group-hover/canvas-card:opacity-100
         relative z-10 mt-4 group-hover/canvas-card:text-white text-center
         group-hover/canvas-card:-translate-y-2 transition duration-200"
          style={{ color: "#E4ECFF" }}
        >
          {des}
        </p>
      </div>
>>>>>>> 4314e5a712c40fd8c1f52997cf8dd82fe84ea29c
    </div>
  );
};
