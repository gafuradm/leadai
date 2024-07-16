import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export const projects = [
  {
    id: 1,
    title: "listening_section",
    des: "learn_to_recognize_english_speech_in_ielts_by_ear",
    img: "/aud.jpeg",
    iconLists: [],
    link: "/ielts",
  },
  {
    id: 2,
    title: "reading_section",
    des: "learn_to_practice_scanning_text_for_reading_ielts",
    img: "/rea.jpeg",
    iconLists: [],
    link: "/ielts",
  },
  {
    id: 3,
    title: "writing_section",
    des: "learn_to_write_essays_and_text_for_the_ielts_writing",
    img: "/wri.jpeg",
    iconLists: [],
    link: "/ielts",
  },
  {
    id: 4,
    title: "speaking_ielts",
    des: "learn_to_understand_questions_and_formulate_answers_in_practice",
    img: "/spe.jpeg",
    iconLists: [],
    link: "/ielts",
  },
  {
    id: 5,
    title: "ielts_recommendations",
    des: "get_high_quality_assessments_and_recommendations_for_ielts_from_ai",
    img: "/rec.jpeg",
    iconLists: [],
    link: "/ielts",
  },
  {
    id: 6,
    title: "applying_to_university",
    des: "get_tips_and_advice_for_applying_to_universities_with_your_ielts_level",
    img: "/apu.jpeg",
    iconLists: [],
    link: "/ielts",
  },
];

const RecentProjects = () => {
  const { t } = useTranslation();

  return (
    <section id="recent-projects" className="pt-20 pb-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-black">
        {t('what_can_leadai_offer_you')}
        <span className="text-black">{t('offer_you')}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Link key={project.id} href={project.link} passHref>
            <div
              className="cursor-pointer transform hover:scale-105 transition-transform duration-300 p-6 rounded-lg shadow-lg"
              style={{ backgroundColor: "#810021" }}
            >
              <img
                src={project.img}
                alt={project.title}
                className="mb-4 w-full h-48 object-cover rounded"
              />
              <h3 className="text-2xl font-semibold mb-2">{t(project.title)}</h3>
              <p>{t(project.des)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecentProjects;
