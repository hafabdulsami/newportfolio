"use client";
import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef(null); // animated background circle
  const iconRef = useRef(null); // animated icon wrapper
  const wrapperRef = useRef(null);
  const blackLetterRefs = useRef([]);
  const fillRef = useRef(null);
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleMouseMove = (e) => {
    const button = buttonRef.current;
    const wrapper = wrapperRef.current;
    const icon = iconRef.current;
    if (!button || !wrapper || !icon) return;

    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    // Animate background circle
    gsap.to(button, {
      scaleX: 1 + Math.abs(deltaX) * 0.3,
      scaleY: 1 + Math.abs(deltaY) * 0.3,
      x: deltaX * 5,
      y: deltaY * 5,
      duration: 0.2,
      ease: "power2.out",
    });

    // Move icon slightly (without scale)
    gsap.to(icon, {
      x: deltaX * 5,
      y: deltaY * 5,
      duration: 0.2,
      ease: "power2.out",
    });

    // Detect overlap and toggle black letter visibility
    const circle = button.getBoundingClientRect();
    blackLetterRefs.current.forEach((el) => {
      if (!el) return;
      const letterRect = el.getBoundingClientRect();
      const isOverlapping = !(
        circle.right < letterRect.left ||
        circle.left > letterRect.right ||
        circle.bottom < letterRect.top ||
        circle.top > letterRect.bottom
      );
      el.style.opacity = isOverlapping ? "0" : "1";
    });
  };

  const handleMouseEnter = (e) => {
    const wrapper = wrapperRef.current;
    const fill = fillRef.current;
    if (!wrapper || !fill) return;

    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set transform origin to mouse position
    fill.style.transformOrigin = `${x}px ${y}px`;

    gsap.fromTo(
      fill,
      { scale: 0 },
      {
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      }
    );
  };

  const handleMouseLeave = (e) => {
    const wrapper = wrapperRef.current;
    const fill = fillRef.current;
    const button = buttonRef.current;
    const icon = iconRef.current;
    if (!wrapper || !fill || !button || !icon) return;

    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Reset transform origin to exit point
    fill.style.transformOrigin = `${x}px ${y}px`;

    // Shrink back into point
    gsap.to(fill, {
      scale: 0,
      duration: 0.4,
      ease: "power3.inOut",
    });

    // Reset button & icon transform
    gsap.to(button, {
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(icon, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    });

    // Reset black letters
    blackLetterRefs.current.forEach((el) => {
      if (el) el.style.opacity = "1";
    });
  };

  return (
    <nav className="text-black px-4 py-3 flex items-center justify-between relative z-50">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Image
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          alt="Logo"
          width={32}
          height={32}
        />
        <span className="text-lg font-semibold">MySite</span>
      </div>

      {/* Hover Target */}
      <div
        ref={wrapperRef}
        className="flex items-center space-x-2 group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        data-hide-cursor
      >
        {/* Animated Button */}
        <button
          onClick={toggleMenu}
          ref={buttonRef}
          className="relative w-12 h-12 focus:outline-none group"
        >
          <div className="relative w-full h-full">
            {/* Background circle (animates scale + position) */}
            <div className="absolute inset-0  rounded-full overflow-hidden">
              <div
                ref={fillRef}
                className="w-full h-full group-hover:bg-black scale-0 rounded-full"
                style={{ transformOrigin: "center center" }}
              ></div>
            </div>

            {/* Icon (animates position only) */}
            <div
              ref={iconRef}
              className="relative z-10 flex items-center justify-center w-full h-full group-hover:text-white pointer-events-none"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="2" y1="9" x2="22" y2="9" />
                  <line x1="2" y1="15" x2="22" y2="15" />
                </svg>
              )}
            </div>
          </div>
        </button>

        {/* Text (menu hover animation) */}
        <div className="relative">
          {/* White text behind */}
          <div className="absolute top-0 left-0 flex pointer-events-none">
            {"menu".split("").map((char, i) => (
              <span key={`white-${i}`} className="text-white">
                {char}
              </span>
            ))}
          </div>

          {/* Black text on top */}
          <div className="relative z-10 flex pointer-events-none">
            {"menu".split("").map((char, i) => (
              <span
                key={`black-${i}`}
                ref={(el) => (blackLetterRefs.current[i] = el)}
                className="text-black transition-opacity duration-150"
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute top-full right-4 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 transition-all duration-300 ease-out">
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">
            Dashboard
          </a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">
            Team
          </a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">
            Projects
          </a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">
            Calendar
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
