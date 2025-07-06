import React, { useRef, useState } from "react";
import ProjectCard from "./ProjectCard";

const otherProjects = [
  {
    title: "BoST Portal",
    description:
      "The public website of the Board of Science and Technology (BoST), IIT Ropar....",
    image: "/Bost logo.png",
    status: "in_progress",
    id: 1,
    imageLink: {
      href: "https://iitrpr.ac.in/bost/softcom/projects/bost-portal?id=668971e5827584596f7f4c55",
    },
  },
  {
    title: "Trader’s Arena",
    description: "Admin Portal for FinCOM’s signature event: Trader’s Arena...",
    image: "/Traders Arena.png",
    status: "completed",
    id: 2,
    imageLink: {
      href: "https://iitrpr.ac.in/bost/softcom/projects/trader-s-arena?id=66995c5ffd013a22f1887447",
    },
  },
  {
    title: "SkyConnect",
    description:
      "The easiest and safest network tunneling tool, made by IIT Ropar for the World!...",
    image: "/skyconnect.webp",
    status: "in_progress",
    id: 3,
    imageLink: {
      href: "https://iitrpr.ac.in/bost/softcom/projects/skyconnect?id=67a52fe014bba142f3591b1c",
    },
  },
];

function HomePage() {
  const [previewSrc, setPreviewSrc] = useState("");
  const previewRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewSrc("");
    }
  };

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Zenoverse HomePage</title>

      <div className="flex flex-wrap items-center justify-center gap-6 min-h-screen w-full box-border px-4 py-0 bg-gradient-to-br from-[#070838] to-[#1c1a44]">
        <div className="flex items-center justify-center flex-shrink-0">
          <img
            src="zenoverse_logo.png"
            alt="Zenoverse Logo"
            className="rounded-full bg-gradient-to-br from-[#070838] to-[#7407b8] shadow-[0_0_32px_8px_#7407b8,0_0_0_12px_#070838_inset] p-5 object-cover transition-shadow duration-400 blur-[1px]"
            style={{
              width: "320px",
              height: "320px",
              maxWidth: "30vw",
              maxHeight: "30vw",
            }}
          />
        </div>
        <div className="flex flex-col items-center justify-center max-w-xl text-center mx-0">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-3">
            Zenoverse
          </h1>
          <p className="text-[#e0e0ff] text-lg md:text-xl leading-relaxed">
            Zenoverse empowers you to transform your own constellation images
            into unique, mintable NFTs. Simply upload your stargazing photos,
            and our advanced AI model will analyze and recognize the
            constellations, assigning each a confidence score. Discover,
            collect, and trade digital constellations - each NFT is as unique as
            the night sky you captured.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center py-6 px-4 mt-6 w-full bg-[#1c1a44]">
        <form
          className="flex flex-col items-center gap-4 w-full max-w-xl"
          id="image-upload-form"
        >
          <label
            htmlFor="myFile"
            className="text-white bg-[#7407b8] px-11 py-5 rounded-full text-lg cursor-pointer shadow-lg border-none transition-all duration-300 mb-2 hover:bg-[#428cff] hover:scale-105"
            style={{}}
          >
            Upload Constellation Image
          </label>
          <input
            type="file"
            id="myFile"
            name="filename"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {previewSrc && (
            <>
              <div className="w-[90%] max-w-[800px] h-[450px] bg-white/5 border border-white/15 rounded-2xl backdrop-blur-lg shadow-2xl flex items-center justify-center overflow-hidden relative transition-all duration-300 animate-fadeIn">
                <img
                  id="image-preview"
                  ref={previewRef}
                  src={previewSrc}
                  alt="Image Preview"
                  className="w-full h-full object-cover block opacity-100 rounded-2xl transition-opacity duration-500"
                />
              </div>
              <input
                type="submit"
                value="Submit"
                className="mt-4 px-8 py-3 border-2 border-[#7407b8] rounded-full bg-gradient-to-r from-[#7407b8] to-[#428cff] text-white text-lg tracking-wider shadow-[0_0_20px_#7407b8,0_0_6px_#fff2] transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:from-[#428cff] hover:to-[#7407b8]"
              />
            </>
          )}
        </form>
      </div>

      <div className="flex flex-col items-center my-12">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
          Other SoftCom Projects
        </h1>
        <div className="gap-8 md:gap-10 flex flex-row flex-wrap justify-center items-stretch w-full max-w-7xl mx-auto">
          {otherProjects.map((project, idx) => (
            <ProjectCard
              key={project.id || idx}
              title={project.title}
              status={project.status}
              description={project.description}
              image={project.image}
              imageLink={project.imageLink}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default HomePage;
