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

  const handleAnswer = (answer) => {
    if (answer === "yes") {
      setShowCelebration(true);
    } else if (answer === "no") {
      if (questionIndex < questions.length - 1) {
        setQuestionIndex(questionIndex + 1);
        setNoClickCount(noClickCount + 1);
        setCountdown(null); // Reset countdown
      } else {
        setSpecialMessage("I coded this to make a special Valentine's Day for you, Claire! 約翰一書4章19節 - 我們愛， 因為神先愛我們。🦊");
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
    const isMobile = window.innerWidth <= 768;  // Consider width <= 768px as mobile
    if (!teleportEnabled || questionIndex !== questions.length - 1) return;
  
    if (!isMobile) {
      // For desktop: teleport the button randomly
      if (noButtonRef.current) {
        const randomX = Math.random() * (window.innerWidth - 150);
        const randomY = Math.random() * (window.innerHeight - 50);
        noButtonRef.current.style.position = "absolute";
        noButtonRef.current.style.left = `${randomX}px`;
        noButtonRef.current.style.top = `${randomY}px`;
      }
    } else {
      // For mobile: avoid teleportation or provide a simpler behavior
      noButtonRef.current.blur();
      setIsNoButtonDisabled(true);
      setTimeout(() => {
        setIsNoButtonDisabled(false);  // Allow button click after a short delay
      }, 200);
    }

    setHoverCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5) setTeleportEnabled(false);
      return newCount;
    });
  };

  const handleNoButtonClick = (event) => {
    event.preventDefault(); // Prevent default to avoid weird tap behavior on mobile
    teleportNoButton();
  };

    // Attach event listeners
    useEffect(() => {
      const button = noButtonRef.current;
      if (button) {
        button.addEventListener("click", handleNoButtonClick);
      }
      return () => {
        if (button) {
          button.removeEventListener("click", handleNoButtonClick);
        }
      };
    }, [teleportEnabled, questionIndex]);

  const fakeNoText = [3].includes(questionIndex) ? "Maybe" : "No";

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
      <h1 style={{ fontSize: "2.8rem", color: "#F56C99", marginBottom: "20px" }}>Victor🤖: Happy Valentine's Day, Claire!</h1>
      <p style={{ fontSize: "1.3rem", color: "#F56C99", marginBottom: "30px", fontWeight: "bold"}}>每一次打開都能感受到溫暖，願我們在耶穌🙏的帶領下，一起創造更多美好的回憶，勇敢迎接每一個明天。🌹✨</p>

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
              onTouchStart={teleportNoButton}
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
          <h2 style={{ fontSize: "2rem", color: "#F56C99" }}>🎉 Celebrate with you Claire! 💕🐝🦊 🎉</h2>
          <p style={{ fontSize: "1.2rem", color: "#F56C99" }}>哥林多前書 - 13章4節📖</p>
          <p style={{ fontSize: "1.2rem", color: "#F56C99" }}>愛 是 恆 久 忍 耐 ， 又 有 恩 慈 ； 愛 是 不 嫉 妒 ； 愛 是 不 自 誇 ， 不 張 狂 ，</p>
        </div>
      )}
    </div>
  );
}
