"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import MouseFollower from "mouse-follower";
import "mouse-follower/dist/mouse-follower.min.css";
export default function Theme({ children }) {
  useEffect(() => {
    // Prevent code from running on the server
    if (typeof window !== "undefined") {
      MouseFollower.registerGSAP(gsap);

      const cursor = new MouseFollower({
        container: document.body, // default
        speed: 0.4,
        className: "custom-cursor",
        visible: true,
        visibleOnState: "default",
        skewing: 3,
      });
    }
  }, []);
  return (
    <div className="w-full h-screen relative overflow-hidden">{children}</div>
  );
}
