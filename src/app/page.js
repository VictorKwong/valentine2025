"use client";

import { useState, useRef, useEffect } from "react";
import FloatingHearts from "./components/FloatingHearts";
import MouseHearts from "./components/MouseHearts";

export default function Home() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [noClickCount, setNoClickCount] = useState(0);
  const [hoverCount, setHoverCount] = useState(0);
  const [teleportEnabled, setTeleportEnabled] = useState(true);
  const [isNoButtonDisabled, setIsNoButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isNoButtonFading, setIsNoButtonFading] = useState(false);
  const [isNoButtonHidden, setIsNoButtonHidden] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [specialMessage, setSpecialMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false); 

  const noButtonRef = useRef(null);

  const questions = [
    "Would you like to celebrate this special day with me? 💖",
    "Are you absolutely, 100%, without a doubt sure? 🤔",
    "Wait, have you thought this through? 😳",
    "Are you really going to break my heart like this? 😭",
    "Okay, what if I give you a cookie? 🍪",
    "Hold on... are you even reading these questions? 👀",
    "What if I told you there's a surprise at the end? 🎁"
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Detect whether the device is mobile on mount or when the window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };
    checkIfMobile(); // Initial check
    window.addEventListener("resize", checkIfMobile); // Add resize listener
    return () => {
      window.removeEventListener("resize", checkIfMobile); // Cleanup
    };
  }, []);

  const handleAnswer = (answer) => {
    if (answer === "yes") {
      setShowCelebration(true);
    } else if (answer === "no") {
      if (questionIndex < questions.length - 1) {
        setQuestionIndex(questionIndex + 1);
        setNoClickCount(noClickCount + 1);
        setCountdown(null); // Reset countdown
      } else {
        setSpecialMessage("I coded this to make a special Valentine's Day for you! 💖🎉");
        setShowCelebration(false);
        setNoClickCount(0);
      }
    }
  };

  const isFirstThreeQuestions = questionIndex < 3;
  const getYesScale = isFirstThreeQuestions ? Math.min(1 + 0.1 * noClickCount, 1.5) : 1;
  const getNoScale = isFirstThreeQuestions ? Math.max(1 - 0.1 * noClickCount, 0.5) : 1;

  const isSwapped = questionIndex !== 0 && [2, 8].includes(questionIndex);
  const buttonContainerStyle = {
    display: "flex",
    flexDirection: isSwapped ? "row-reverse" : "row",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
  };

  const teleportNoButton = () => {
    // Check if teleportation is enabled and we are on the last question
    if (!teleportEnabled || questionIndex !== questions.length - 1) return;
  
    // Detect if the device is mobile
    const isMobile = window.innerWidth <= 768; // Adjust this based on your mobile breakpoint
  
    // If it's mobile, teleport the "No" button on click, not hover
    if (isMobile) {
      if (noButtonRef.current) {
        const randomX = Math.random() * (window.innerWidth - 150);
        const randomY = Math.random() * (window.innerHeight - 50);
  
        noButtonRef.current.style.position = "absolute";
        noButtonRef.current.style.left = `${randomX}px`;
        noButtonRef.current.style.top = `${randomY}px`;
      }
  
      // Disable teleporting after it happens
      setIsNoButtonDisabled(true);
      setHoverCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 5) setTeleportEnabled(false); // Disable teleport after a few clicks
        return newCount;
      });
      setTimeout(() => {
        setIsNoButtonDisabled(false);
      }, 300);
    }
  };
  
  useEffect(() => {
    // Make sure teleportation only happens on hover for desktop
    if (!isMobile) {
      // Attach hover effect only for non-mobile (desktop) devices
      const noButtonElement = noButtonRef.current;
      if (noButtonElement) {
        noButtonElement.addEventListener('mouseenter', teleportNoButton);
  
        // Clean up listener on unmount
        return () => {
          noButtonElement.removeEventListener('mouseenter', teleportNoButton);
        };
      }
    }
  }, [isMobile]);
  
  // Make sure teleportation on hover or click is only triggered when appropriate
  useEffect(() => {
    if (questionIndex === questions.length - 1) {
      if (!isMobile) {
        teleportNoButton();  // Trigger teleportation on hover if desktop
      }
    }
  }, [questionIndex, isMobile]);

  const fakeNoText = [3, 10].includes(questionIndex) ? "Maybe" : "No";

  useEffect(() => {
    if ([4].includes(questionIndex)) {
      let timeLeft = 5;
      setCountdown(timeLeft);
      const timer = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(timer);
          setIsNoButtonFading(true);
        }
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCountdown(null);
      setIsNoButtonFading(false);
    }
  }, [questionIndex]);

  useEffect(() => {
    if (isNoButtonFading) {
      const timer = setTimeout(() => {
        setIsNoButtonHidden(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isNoButtonFading]);

  useEffect(() => {
    if (questionIndex === questions.length - 1) {
      teleportNoButton();
    }
  }, [questionIndex]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="container" style={{ textAlign: "center", padding: "50px", fontFamily: "'Poppins', sans-serif" }}>
      <FloatingHearts />
      <MouseHearts />
      <h1 style={{ fontSize: "2.8rem", color: "#F56C99", marginBottom: "20px" }}>Happy Valentine's Day, My Love!</h1>
      <p style={{ fontSize: "1.3rem", color: "#F56C99", marginBottom: "30px", fontWeight: "bold"}}>每一次打開都能感受到溫暖，讓我們一起創造更多回憶，攜手走過每一個明天🌹✨</p>

      {questionIndex < questions.length && !showCelebration && (
        <div style={{ marginTop: "30px" }}>
          <p style={{ fontSize: "1.5rem", color: "#F56C99", fontWeight: "600" }}>{questions[questionIndex]}</p>
          {countdown !== null && (
            <p style={{ fontSize: "1.2rem", color: "red" }}>Timer: {countdown}s</p>
          )}
          <div style={buttonContainerStyle}>
            <button
              onClick={() => handleAnswer("yes")}
              className="yes"
              style={{
                transform: `scale(${getYesScale})`,
                borderRadius: "50px",
                cursor: "pointer",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
              }}
            >
              Yes
            </button>
            <button
              ref={noButtonRef}
              onClick={() => handleAnswer("no")}
              className="no"
              style={{
                transform: `scale(${getNoScale})`,
                opacity: isNoButtonFading ? 0 : 1,
                display: isNoButtonHidden ? "none" : "inline-block",
                borderRadius: "50px",
                cursor: "pointer",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
              }}
              onMouseEnter={teleportNoButton}
              disabled={isNoButtonDisabled}
            >
              {fakeNoText}
            </button>
          </div>
        </div>
      )}

      {specialMessage && !showCelebration && (
        <div className="special-message" style={{ marginTop: "30px", padding: "20px", backgroundColor: "#FFC1C1", borderRadius: "10px", color: "#333" }}>
          <h2 style={{ fontSize: "1.5rem", color: "#F56C99" }}>{specialMessage}</h2>
        </div>
      )}

      {showCelebration && (
        <div className="celebration" style={{ marginTop: "30px", padding: "30px", backgroundColor: "#FFEBEB", borderRadius: "10px", color: "#333", boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)" }}>
          <h2 style={{ fontSize: "2rem", color: "#F56C99" }}>🎉 Yay, we’re celebrating! 🎉</h2>
          <p style={{ fontSize: "1.2rem", color: "#F56C99" }}>I’m so happy :) to celebrate with you Claire! 💕🐝🦊</p>
        </div>
      )}
    </div>
  );
}
