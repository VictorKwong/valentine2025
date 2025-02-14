"use client"; // Ensures useEffect works in Next.js

import { useEffect } from "react";
import styles from "../styles/FloatingHearts.module.css";

const FloatingHearts = () => {
  useEffect(() => {
    const createHeart = () => {
      const heart = document.createElement("div");
      heart.classList.add(styles.heart);

      // Ensure hearts spawn inside viewport without overflow
      const maxWidth = window.innerWidth - 60; // 60px offset to prevent overflow
      const maxHeight = window.innerHeight - 60; // 60px offset for bottom

      heart.style.left = `${Math.random() * maxWidth}px`;
      heart.style.top = `${Math.random() * maxHeight}px`;
      heart.style.setProperty("--direction", Math.random() < 0.5 ? "-1" : "1"); // Random float direction

      document.body.appendChild(heart);

      // Remove heart AFTER animation completes (match animation duration)
      setTimeout(() => {
        heart.remove();
      }, 3000);
    };

    const interval = setInterval(createHeart, 600); // Generate hearts every 0.6 sec
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default FloatingHearts;
