import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { subscribeToCollection } from "../services/firestoreService";
import RichTextDisplay from "../components/RichTextDisplay";
import ProjectFlipCard from "../components/ProjectFlipCard";
import { Sparkles } from "lucide-react";

function HomePage() {
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [academics, setAcademics] = useState([]);
  const [personal, setPersonal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from Firestore collections
  useEffect(() => {
    const unsubscribers = [];

    // Subscribe to projects
    unsubscribers.push(
      subscribeToCollection(
        "projects",
        (data) => {
          setProjects(data.sort((a, b) => (b.order || 0) - (a.order || 0)));
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching projects:", err);
          setError(err.message);
          setLoading(false);
        }
      )
    );

    // Subscribe to experience
    unsubscribers.push(
      subscribeToCollection(
        "experience",
        (data) => {
          setExperience(data);
        },
        (err) => console.error("Error fetching experience:", err)
      )
    );

    // Subscribe to skills
    unsubscribers.push(
      subscribeToCollection(
        "skills",
        (data) => {
          setSkills(data);
        },
        (err) => console.error("Error fetching skills:", err)
      )
    );

    // Subscribe to academics
    unsubscribers.push(
      subscribeToCollection(
        "academics",
        (data) => {
          setAcademics(data);
        },
        (err) => console.error("Error fetching academics:", err)
      )
    );

    // Subscribe to personal profile (first record)
    unsubscribers.push(
      subscribeToCollection(
        "personal",
        (data) => {
          setPersonal(data[0] ?? null);
        },
        (err) => console.error("Error fetching personal info:", err)
      )
    );

    return () => {
      unsubscribers.forEach((unsubscriber) => unsubscriber());
    };
  }, []);

  // Hero section text stagger animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Float animation for skills
  const floatVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
    whileInView: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        delay: Math.random() * 0.5,
      },
    },
  };

  // Projects hover animation
  const projectHoverVariants = {
    initial: { y: 0, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)" },
    whileHover: { y: -8, boxShadow: "0 30px 60px rgba(59, 130, 246, 0.4)" },
  };

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springTiltX = useSpring(tiltX, { stiffness: 130, damping: 18, mass: 0.45 });
  const springTiltY = useSpring(tiltY, { stiffness: 130, damping: 18, mass: 0.45 });
  const profileTransform = useTransform(
    [springTiltX, springTiltY],
    ([latestX, latestY]) => `perspective(1200px) rotateX(${latestX}deg) rotateY(${latestY}deg)`
  );

  const handleProfileMouseMove = (event) => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

    tiltX.set(-offsetY * 8);
    tiltY.set(offsetX * 10);
  };

  const handleProfileMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20">
      {/* Hero Section with Text Stagger */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mb-20 grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-start md:gap-12"
      >
        {/* Left Side - Main Content */}
        <div>
          <motion.div
            variants={textVariants}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/10 px-3 py-1"
          >
            <Sparkles size={14} className="text-blue-300" />
            <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
              Premium Portfolio
            </p>
          </motion.div>

          <motion.h1
            variants={textVariants}
            className="text-balance text-5xl font-bold leading-tight text-zinc-100 md:text-6xl"
          >
            {personal?.fullName || "Crafted with Motion"}
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
              {personal?.headline || "and Purpose"}
            </span>
          </motion.h1>

          <motion.p
            variants={textVariants}
            className="mt-6 max-w-xl text-lg text-zinc-400"
          >
            {personal?.bio ||
              "A dark, kinetic portfolio showcasing projects, experience, and skills with smooth animations and real-time Firestore data."}
          </motion.p>

          <motion.div variants={textVariants} className="mt-8 flex flex-wrap gap-4">
            {personal?.github && (
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-glow inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-600"
              >
                GitHub
              </a>
            )}
            {personal?.linkedin && (
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-glow inline-flex items-center gap-2 rounded-lg border border-zinc-600 px-6 py-3 font-medium text-zinc-300 transition hover:border-zinc-400 hover:bg-zinc-900/50"
              >
                LinkedIn
              </a>
            )}
          </motion.div>
        </div>

        {/* Right Side - Profile Showcase */}
        <motion.div
          variants={textVariants}
          className="space-y-4 md:pl-8"
        >
          <motion.div
            onMouseMove={handleProfileMouseMove}
            onMouseLeave={handleProfileMouseLeave}
            whileHover={{ y: -4, scale: 1.01 }}
            style={{ transform: profileTransform }}
            className="relative h-full overflow-hidden rounded-3xl border border-blue-500/40 bg-zinc-900/60 p-3 shadow-neon md:min-h-[28rem]"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/15 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-blue-500/15 blur-2xl" />
            {personal?.avatar ? (
              <img
                src={personal.avatar}
                alt={personal.fullName || "Profile avatar"}
                className="h-[22rem] w-full rounded-2xl border border-blue-500/40 object-cover sm:h-[24rem] md:h-full md:min-h-[28rem]"
              />
            ) : (
              <div className="flex h-[22rem] w-full items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 text-zinc-400 sm:h-[24rem] md:h-full md:min-h-[28rem]">
                Upload profile image in admin
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Experience Timeline */}
      {experience.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20"
        >
          <h2 className="mb-12 text-3xl font-bold text-zinc-100">
            Experience
          </h2>
          <div className="space-y-8">
            {experience.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="border-l-2 border-blue-500/30 pl-6 hover:border-blue-500 transition-colors"
              >
                <p className="text-sm font-semibold text-blue-400">
                  {item.duration || "Duration not set"}
                </p>
                <h3 className="mt-2 text-xl font-bold text-zinc-100">
                  {item.role}
                </h3>
                <p className="text-zinc-400">{item.company}</p>
                {item.description && (
                  <div className="mt-3">
                    <RichTextDisplay html={item.description} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Projects Grid with Hover */}
      {projects.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20"
        >
          <h2 className="mb-12 text-3xl font-bold text-zinc-100">
            Featured Projects
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.slice(0, 6).map((project, index) => (
              <motion.div
                key={project.id}
                variants={projectHoverVariants}
                initial={{ opacity: 0, y: 20 }}
                whileHover="whileHover"
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true, margin: "-100px" }}
                className="group"
              >
                <ProjectFlipCard project={project} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Skills Float Animation */}
      {skills.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20"
        >
          <h2 className="mb-12 text-3xl font-bold text-zinc-100">
            Skills & Expertise
          </h2>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                variants={floatVariants}
                viewport={{ once: true, margin: "-100px" }}
                className="group rounded-lg border border-zinc-700 bg-gradient-to-br from-zinc-900/60 to-zinc-800/40 p-4 backdrop-blur transition hover:border-blue-500/50"
              >
                <h3 className="font-semibold text-zinc-100">{skill.name}</h3>
                {skill.category && (
                  <p className="mt-2 text-xs text-zinc-400">{skill.category}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Academics Section */}
      {academics.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20"
        >
          <h2 className="mb-12 text-3xl font-bold text-zinc-100">
            Education
          </h2>
          <div className="space-y-6">
            {academics.map((academic, index) => (
              <motion.div
                key={academic.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="rounded-lg border border-zinc-700 bg-zinc-900/30 p-6 backdrop-blur hover:border-blue-500/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-100">
                      {academic.degree}
                    </h3>
                    <p className="mt-1 text-blue-400">{academic.institution}</p>
                    {academic.gpa && (
                      <p className="mt-1 text-zinc-400">GPA: {academic.gpa}</p>
                    )}
                  </div>
                  {academic.duration && (
                    <p className="mt-4 text-sm font-semibold text-zinc-500 md:mt-0">
                      {academic.duration}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
        className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-cyan-950/40 p-12 text-center backdrop-blur"
      >
        <h2 className="mb-4 text-3xl font-bold text-zinc-100">
          Ready to work together?
        </h2>
        <p className="mb-8 text-lg text-zinc-400">
          {personal?.location
            ? `${personal.location} | Let's create something extraordinary. Get in touch for collaborations or inquiries.`
            : "Let's create something extraordinary. Get in touch for collaborations or inquiries."}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          {personal?.email && (
            <a
              href={`mailto:${personal.email}`}
              className="rounded-lg bg-blue-500 px-8 py-3 font-medium text-white transition hover:bg-blue-600"
            >
              Send Email
            </a>
          )}
          {personal?.resumeLink && (
            <a
              href={personal.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-zinc-600 px-8 py-3 font-medium text-zinc-300 transition hover:border-zinc-400"
            >
              View Resume
            </a>
          )}
          {personal?.github && (
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-zinc-600 px-8 py-3 font-medium text-zinc-300 transition hover:border-zinc-400"
            >
              GitHub
            </a>
          )}
          {personal?.linkedin && (
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-zinc-600 px-8 py-3 font-medium text-zinc-300 transition hover:border-zinc-400"
            >
              LinkedIn
            </a>
          )}
        </div>
      </motion.section>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 rounded-full border-2 border-zinc-700 border-t-blue-500"
          />
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400"
        >
          Error loading data: {error}
        </motion.div>
      )}
    </main>
  );
}

export default HomePage;
