import React from "react";
import ProjectCard from ".ProjectCard";
import { getAllProjects } from "@/app/actions/ProjectData";
import Link from "next/link";

const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const OurProjects = async () => {
  const projects = await getAllProjects(process.env.SUPER_ADMIN);
  const approvedProjects = projects.filter((project) => project.approved);

  return (
    <div className="w-full mx-auto py-12 pb-24   bg-black  flex flex-col  ">
      <h2 className="text-5xl font-semibold text-center mb-12 text-white">
        Our Projects
      </h2>
      <div className="gap-16 md:gap-10 flex flex-row flex-wrap justify-center items-stretch w-full">
        {approvedProjects.map((project, index) => {
          const projectSlug = slugify(project.title);
          return (
            <div key={index}>
              <div className="">
                <ProjectCard
                  title={project.title}
                  github={project.github}
                  website={project.website}
                  members={project.members}
                  status={project.status}
                  description={project.description}
                  image={project.image}
                  imageLink={{
                    href: `/projects-page/${projectSlug}?id=${project.id}`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OurProjects;