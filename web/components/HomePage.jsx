import React, { useRef, useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import VerificationForm from "./verification";
import ChatbotWidget from "./ChatbotWidget";


function HomePage() {
  const [previewSrc, setPreviewSrc] = useState("");
  const previewRef = useRef(null);
  const videoRef = useRef(null);
  const verificationVideoRef = useRef(null);
  
  useEffect(() => {
    const heroVideo = videoRef.current;
    const verificationVideo = verificationVideoRef.current;

    // Only proceed if at least one video exists
    if (!heroVideo && !verificationVideo) return;

    let rafId = null;
    const lastScrollY = {
      value: typeof window !== "undefined" ? window.scrollY : 0,
    };
    const lastTime = { value: performance.now() };
    const targetRate = { value: 1 };

    // clamp helper
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dy = y - lastScrollY.value;
      const dt = Math.max(now - lastTime.value, 1);
      const velocity = Math.abs(dy) / dt; // px per ms

      // Map velocity to playbackRate: base 1.0, add up to +2.0 depending on velocity
      const mapped = 1 + velocity * 120; // tuned multiplier
      targetRate.value = clamp(mapped, 0.5, 3.0);

      lastScrollY.value = y;
      lastTime.value = now;
    };

    const animate = () => {
      // Apply playback rate to both videos if they exist
      const current1 = heroVideo?.playbackRate || 1;
      const current2 = verificationVideo?.playbackRate || 1;
      const next1 = current1 + (targetRate.value - current1) * 0.12; // smoothing (lerp)
      const next2 = current2 + (targetRate.value - current2) * 0.12;

      if (heroVideo) heroVideo.playbackRate = Number(next1.toFixed(3));
      if (verificationVideo)
        verificationVideo.playbackRate = Number(next2.toFixed(3));

      rafId = requestAnimationFrame(animate);
    };

    // reset target rate slowly when no scroll activity
    let idleTimer = null;
    const resetIdle = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        targetRate.value = 1;
      }, 250);
    };

    const scrollHandler = () => {
      onScroll();
      resetIdle();
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    // start animation loop
    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scrollHandler);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

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

      {/* Hero section with confined background video */}
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Background video confined to hero section only */}
        <video
          ref={videoRef}
          src="/stellarium_final.mp4"
          muted
          autoPlay
          loop
          playsInline
          className="pointer-events-none absolute inset-0 w-full h-full object-cover -z-10"
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div className="flex flex-wrap items-center justify-center min-h-screen w-full box-border px-4 py-0 relative z-10">
          <div className="flex items-center justify-center flex-shrink-0 mx-4 p-2">
            <img
              src="zenoverse_logo.png"
              alt="Zenoverse Logo"
              className="rounded-full bg-gradient-to-br from-[#070838] to-[#7407b8] shadow-[0_0_32px_8px_#7407b8,0_0_0_12px_#070838_inset] p-4 object-cover transition-shadow duration-400 blur-[1px] w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64"
            />
          </div>
          <div className="flex flex-col items-center justify-center max-w-lg sm:max-w-xl text-center px-4 sm:px-6">
            <h1 className="bg-gradient-to-r from-[#7407b8] to-[#428cff] bg-clip-text text-transparent text-3xl md:text-4xl font-bold mb-3">
              Zenoverse
            </h1>
            <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed">
              Zenoverse empowers you to transform your own constellation images
              into unique, mintable NFTs. Simply upload your stargazing photos,
              and our advanced AI model will analyze and recognize the
              constellations, assigning each a confidence score. Discover,
              collect, and trade digital constellations - each NFT is as unique
              as the night sky you captured.
            </p>
          </div>
        </div>
      </div>

      {/* Image Verification section with background video */}
      <div className="relative py-6 px-4 sm:px-6 w-full min-h-screen overflow-hidden">
        {/* Background video confined to verification section only */}
        <video
          ref={verificationVideoRef}
          src="/video1.mp4"
          muted
          autoPlay
          loop
          playsInline
          className="pointer-events-none absolute inset-0 w-full h-full object-cover -z-10"
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div className="flex flex-col items-center w-full min-h-screen relative z-10 px-4 sm:px-6" id="verification">
          {/* <form
            className="flex flex-col items-center gap-4 w-full max-w-xl"
            id="image-upload-form"
          >
            <label
              htmlFor="myFile"
              className="text-white bg-[#7407b8] px-6 sm:px-11 py-4 sm:py-5 rounded-full text-base sm:text-lg cursor-pointer shadow-lg border-none transition-all duration-300 mb-2 hover:bg-[#428cff] hover:scale-105"
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

            <div className="w-full sm:w-[100%] max-w-[1800px] aspect-[1.5/1] bg-white/5 border border-white/15 rounded-2xl backdrop-blur-lg shadow-2xl flex items-center justify-center overflow-hidden relative transition-all duration-300 animate-fadeIn">
              {previewSrc ? (
                <img
                  id="image-preview"
                  ref={previewRef}
                  src={previewSrc}
                  alt="Image Preview"
                  className="w-full h-full object-cover block opacity-100 rounded-2xl transition-opacity duration-500"
                />
              ) : (
                <span className="text-white/60 text-lg">
                  Image preview will appear here
                </span>
              )}
            </div>

            <input
              type="submit"
              value="Submit"
              className="mt-4 px-6 sm:px-8 py-2 sm:py-3 border-2 border-[#7407b8] rounded-full bg-gradient-to-r from-[#7407b8] to-[#428cff] text-white text-base sm:text-lg tracking-wider shadow-[0_0_20px_#7407b8,0_0_6px_#fff2] transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:from-[#428cff] hover:to-[#7407b8]"
            />
          </form> */}
          <VerificationForm />
        </div>
      </div>
      <ChatbotWidget />
    </>
  );
}

export default HomePage;
