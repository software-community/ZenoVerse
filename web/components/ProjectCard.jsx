import React from "react";
import Link from "next/link";

const statusMap = {
  completed: "Completed",
  in_progress: "In Progress",
  not_started: "Not Started",
};

const ProjectCard = ({ title, description, image, status, imageLink }) => {
  return (
    <Link
      href={imageLink?.href || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white/90 rounded-2xl shadow-xl p-6 flex flex-col items-center w-[320px] min-h-[420px] mx-4 my-6 transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#7407b8] group"
      tabIndex={0}
    >
      <div className="flex items-center justify-between w-full mb-2">
        <span
          className={`px-3 py-1 rounded-md text-xs font-semibold ${
            status === "Completed"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          Status: {statusMap[status] || status}
        </span>
      </div>
      <div className="w-full flex justify-center mb-4">
        <img
          src={image}
          alt={title}
          className="rounded-xl w-full h-40 object-cover bg-gray-200"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mt-2 mb-1 text-center">
        {title}
      </h3>
      <p className="text-gray-700 text-center text-sm mb-2 line-clamp-2">
        {description.trim().length < 25
          ? description
          : description.trim().substring(0, 100) + "..."}
      </p>
    </Link>
  );
};

export default ProjectCard;
