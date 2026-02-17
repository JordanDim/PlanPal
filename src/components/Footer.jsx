import { useNavigate } from "react-router-dom";
import {
  AboutUs,
  GithubIcon,
  GithubIssues,
} from "../common/helpers/icons.jsx";
import { BASE } from "../common/constants.js";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-primary-800 text-white  ">
      <footer className="footer bg-base-300 text-base-content  bottom-0 p-3 flex justify-around backdrop-blur-lg bg-white/10">
        <nav>
          <h6 className=" font-semibold uppercase ">Team 03</h6>
          <div className="footer-icons grid grid-flow-col gap-4 mt-1">
            <button onClick={() => navigate(`${BASE}about`)}>
              <AboutUs />
            </button>
          </div>
        </nav>
        <nav>
          <h6 className="font-semibold uppercase ">Project</h6>
          <div className="footer-icons grid grid-flow-col gap-4 mt-1">
            <a href="https://github.com/JordanDim/PlanPal.git">
              <GithubIcon />
            </a>
            <a href="https://github.com/orgs/ReactProjectA58/projects/1">
              <GithubIssues />
            </a>
          </div>
        </nav>
      </footer>
    </footer>
  );
}
