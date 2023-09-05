import React from "react";
import JobCard from "@/components/Layout/Application/JobLayout";

const getRandomColor = () => {
  const colors = [
    "bg-gradient-neon-red",
    "bg-gradient-neon-blue",
    "bg-gradient-neon-green",
    "bg-gradient-neon-purple",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const jobCards = [
  {
    title: "Developer",
    desc: "Interested in becoming a developer at Influx? The door is wide open! Explore what Influx has to offer!",
    link1: "/devapp",
    link1Title: "Apply Now",
    link1Icon: "fa fa-globe",
  },
  {
    title: "Staff",
    desc: "Interested in becoming a moderator at Influx? The door is wide open! Explore what Influx has to offer! Your role will be to moderate the server and other tasks.",
    link1: "/staffapp",
    link1Title: "Apply Now",
    link1Icon: "fa fa-globe",
  },
  {
    title: "Verified",
    desc: "Interested in profile verification? Let us help you with the process to ensure accuracy. Apply now!",
    link1: "/getverified",
    link1Title: "Apply Now",
    link1Icon: "fa fa-globe",
  },
];

const Job = () => {
  const customBackground = getRandomColor();

  return (
    <div
      className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${customBackground}`}
    >
      <div className="text-center mt-16 lg:mt-32">
        <h2 className="text-4xl font-bold leading-tight text-cyber-cyan sm:text-5xl">
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent text-7xl text-center">
            Influx Application
          </span>
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-xl text-neon-blue">
          <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text">
            Have you heard about the opportunity to become verified as a
            developer or staff member at Discord Influx? Apply soon as positions
            might close soon!
          </span>
        </p>
      </div>
      <div className="mt-20 sm:mt-32">
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
          {jobCards.map((job, index) => (
            <JobCard
              key={index}
              title={job.title}
              desc={job.desc}
              link1={job.link1}
              link1Title={job.link1Title}
              link1Icon={job.link1Icon}
              alignLinksCenter={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Job;

export const getServerSideProps = async function (ctx) {
  return { props: {} };
};
