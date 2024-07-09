import Link from 'next/link';

export const projects = [
  {
    id: 1,
    title: "Listening Section",
    des: "Learn to recognize English speech in IELTS by ear",
    img: "/aud.jpeg",
    iconLists: [],
    link: "/ielts",
  },
  {
    id: 2,
    title: "Reading Section",
    des: "Learn to practice scanning text for Reading IELTS",
    img: "/rea.jpeg",
    iconLists: [],
    link: "/ielts",
  },
  {
    id: 3,
    title: "Writing Section",
    des: "Learn to write essays and text for the IELTS Writing",
    img: "/wri.jpeg",
    iconLists: [],
    link: "/ielts",
  },
  {
    id: 4,
    title: "Speaking IELTS",
    des: "Learn to understand questions and formulate answers in practice.",
    img: "/spe.jpeg",
    iconLists: [],
    link: "/ielts",
  },
  {
    id: 5,
    title: "IELTS Recommendations",
    des: "Get high-quality assessments and recommendations for IELTS from AI",
    img: "/rec.jpeg",
    iconLists: [],
    link: "/ielts",
  },
  {
    id: 6,
    title: "Applying to university",
    des: "Get tips and advice for applying to universities with your IELTS level",
    img: "/apu.jpeg",
    iconLists: [],
    link: "/ielts",
  },
];

const RecentProjects = () => {
  return (
    <section id="recent-projects" className="pt-20 pb-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-purple">
        What can LeadAI{" "}
        <span className="text-purple">offer You?</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Link key={project.id} href={project.link} passHref>
            <div
              className="cursor-pointer transform hover:scale-105 transition-transform duration-300 p-6 rounded-lg shadow-lg"
              style={{ backgroundColor: "#cbacf9" }}
            >
              <img
                src={project.img}
                alt={project.title}
                className="mb-4 w-full h-48 object-cover rounded"
              />
              <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
              <p>{project.des}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecentProjects;
