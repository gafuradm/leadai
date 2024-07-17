import Link from "next/link";

export const projects = [
  {
    id: 1,
    title: "Listening Section",
    des: "Learn to recognize English speech in IELTS by ear",
    img: "/mus.png",
    iconLists: [],
    link: "/ielts",
  },
  {
    id: 2,
    title: "Reading Section",
    des: "Learn to practice scanning text for Reading IELTS",
    img: "/books.png",
    iconLists: [],
    link: "/ielts",
  },
  {
    id: 3,
    title: "Writing Section",
    des: "Learn to write essays and text for the IELTS Writing",
    img: "/essa.png",
    iconLists: [],
    link: "/ielts",
  },
  {
    id: 4,
    title: "Speaking IELTS",
    des: "Learn to understand questions and formulate answers in practice.",
    img: "/voc.png",
    iconLists: [],
    link: "/ielts",
  },
  {
    id: 5,
    title: "IELTS Recommendations",
    des: "Get high-quality assessments and recommendations for IELTS from AI",
    img: "/tips.png",
    iconLists: [],
    link: "/ielts",
  },
  {
    id: 6,
    title: "Applying to university",
    des: "Get tips and advice for applying to universities with your IELTS level",
    img: "/univ.png",
    iconLists: [],
    link: "/ielts",
  },
];

const RecentProjects = () => {
  return (
    <section id="recent-projects" className="pt-20 pb-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-black">
        What can LeadAI <span className="text-black">offer You?</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Link key={project.id} href={project.link} passHref>
            <div
              className="cursor-pointer transform hover:scale-105 transition-transform duration-300 p-6 rounded-lg shadow-lg"
              style={{
                backgroundColor:
                  project.id === 2 || project.id === 4 || project.id === 6
                    ? "#000000"
                    : "#810021",
                height: "20rem",
              }}
            >
              <img
                src={project.img}
                alt={project.title}
                className="mb-4 w-20 h-20 object-cover rounded-lg mx-auto"
              />
              <h3 className="text-2xl font-semibold mb-2 text-center text-white">
                {project.title}
              </h3>
              <p className="text-sm text-center text-white">{project.des}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecentProjects;
