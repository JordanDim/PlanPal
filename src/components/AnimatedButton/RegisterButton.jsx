import "./AnimatedButton.css";
import { useGSAP } from "@gsap/react";

function RegisterButton({ onClick }) {
  useGSAP(() => {
    const rippleBtn = document.getElementById("home-ripple");
    let ripples = document.createElement("span");
    let cleartimeout;

    const handleMouseOver = (e) => {
      let x = e.clientX - e.target.offsetLeft;
      let y = e.clientY - e.target.offsetTop;
      ripples.style.left = x + "px";
      ripples.style.top = y + "px";
      rippleBtn.appendChild(ripples);

      cleartimeout = setTimeout(() => {
        ripples.remove();
      }, 1000);
    };

    const handleMouseOut = () => {
      ripples.remove();
      clearTimeout(cleartimeout);
    };

    rippleBtn.addEventListener("mouseover", handleMouseOver);
    rippleBtn.addEventListener("mouseout", handleMouseOut);

    return () => {
      rippleBtn.removeEventListener("mouseover", handleMouseOver);
      rippleBtn.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <button
      className="btn btn--hoverEffect2 m-auto"
      id="home-ripple"
      onClick={onClick}
    >
      Register
    </button>
  );
}

export default RegisterButton;
