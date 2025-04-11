"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Theme({ children }) {
  const ballRef = useRef();
  const wrapperRef = useRef();

  useEffect(() => {
    const ball = ballRef.current;
    const wrapper = wrapperRef.current;

    const showBall = () => {
      gsap.to(ball, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const hideBall = () => {
      gsap.to(ball, {
        opacity: 0,
        scale: 0.5,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const moveBall = (e) => {
      const target = e.target;

      // Check if the target or any parent has data-hide-cursor
      const shouldHide = target.closest("[data-hide-cursor]");
      if (shouldHide) {
        hideBall();
        return;
      }

      showBall();
      gsap.to(ball, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    // Set initial hidden state
    gsap.set(ball, { opacity: 0, scale: 0.5 });

    // Attach listeners
    wrapper.addEventListener("mousemove", moveBall);
    wrapper.addEventListener("mouseleave", hideBall);

    return () => {
      wrapper.removeEventListener("mousemove", moveBall);
      wrapper.removeEventListener("mouseleave", hideBall);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="w-full h-screen relative overflow-hidden">
      <div
        ref={ballRef}
        className="fixed top-0 left-0 w-2 h-2 bg-black rounded-full pointer-events-none z-[9999]"
      />
      {children}
    </div>
  );
}
