"use client"; // Ensure this is a Client Component

import { useEffect } from "react";

const MouseHearts = () => {
  useEffect(() => {
    const hearts = [];
    const NUM_HEARTS = window.innerWidth < 600 ? 15 : 30; // Reduce number of hearts on mobile
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseSpeed = 0;

    // Function to create a heart with random movement
    const createHeart = (x, y) => {
      const heart = document.createElement("div");
      heart.innerText = "❤️";
      heart.style.position = "absolute";
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      heart.style.fontSize = window.innerWidth < 600 ? "12px" : "18px"; // Adjust font size for mobile
      heart.style.pointerEvents = "none"; // Prevents interference with clicks
      heart.style.opacity = "0.8"; // Slightly transparent
      heart.style.zIndex = "-1";
      document.body.appendChild(heart);

      // Each heart starts with a random velocity (floating effect)
      const velocity = {
        x: (Math.random() - 0.5) * 2, // Random horizontal speed
        y: (Math.random() - 0.5) * 2, // Random vertical speed
      };

      hearts.push({ element: heart, velocity, isNearMouse: false });

      return heart;
    };

    // Initialize hearts in random positions with random movement
    for (let i = 0; i < NUM_HEARTS; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      createHeart(x, y);
    }

    // Function to update heart positions
    const updateHearts = (mouseX, mouseY) => {
      const deltaX = mouseX - lastMouseX;
      const deltaY = mouseY - lastMouseY;
      mouseSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      hearts.forEach((heart) => {
        const { element, velocity } = heart;
        let heartX = element.offsetLeft;
        let heartY = element.offsetTop;

        const dx = mouseX - heartX;
        const dy = mouseY - heartY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          // If the mouse moves slowly and is close, the heart follows the cursor
          if (!heart.isNearMouse) {
            // If the heart just entered the proximity, start accelerating
            heart.isNearMouse = true;
          }
          // Apply acceleration when the heart is close to the mouse
          velocity.x += dx * 0.02;
          velocity.y += dy * 0.02;
        } else {
          // If the heart is far from the mouse, it just moves with its own momentum
          if (heart.isNearMouse) {
            // If the heart was near the mouse and just left, stop applying acceleration
            heart.isNearMouse = false;
          }
        }

        // Apply velocity to move the heart
        heartX += velocity.x;
        heartY += velocity.y;

        // Keep hearts within screen bounds
        if (heartX > window.innerWidth) heartX = 0;
        if (heartY > window.innerHeight) heartY = 0;
        if (heartX < 0) heartX = window.innerWidth;
        if (heartY < 0) heartY = window.innerHeight;

        element.style.left = `${heartX}px`;
        element.style.top = `${heartY}px`;

        // Apply friction (so they slow down naturally)
        velocity.x *= 0.99;
        velocity.y *= 0.99;
      });

      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };

    // Mouse move listener to update heart movement
    const handleMouseMove = (e) => {
      updateHearts(e.clientX, e.clientY);
    };

    // Function to update the hearts every frame even when the mouse isn't moving
    const updateHeartsWithoutMouse = () => {
      hearts.forEach((heart) => {
        const { element, velocity } = heart;
        let heartX = element.offsetLeft;
        let heartY = element.offsetTop;

        // Apply smooth "floating" effect but don't override the existing velocity
        const floatingSpeedX = (Math.random() - 0.5) * 0.1; // Slow, random horizontal floating
        const floatingSpeedY = (Math.random() - 0.5) * 0.1; // Slow, random vertical floating

        // Apply the current velocity to the heart position
        heartX += velocity.x + floatingSpeedX;
        heartY += velocity.y + floatingSpeedY;

        // Keep hearts within screen bounds and create looping behavior
        if (heartX > window.innerWidth) heartX = 0;
        if (heartY > window.innerHeight) heartY = 0;
        if (heartX < 0) heartX = window.innerWidth;
        if (heartY < 0) heartY = window.innerHeight;

        element.style.left = `${heartX}px`;
        element.style.top = `${heartY}px`;

        // Apply minimal friction to make movement smooth without abrupt stops
        velocity.x *= 0.98;
        velocity.y *= 0.98;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Continuously update the hearts' movement even when the mouse isn't moving
    const animateHearts = () => {
      updateHeartsWithoutMouse();
      requestAnimationFrame(animateHearts); // Using requestAnimationFrame for smooth animation
    };

    animateHearts();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return null;
};

export default MouseHearts;
