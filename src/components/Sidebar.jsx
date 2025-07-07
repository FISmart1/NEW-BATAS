import React from "react";
import { Link } from "react-router-dom";
import bazmaLogo from "../assets/logo-bazma.png";
import iconHome from "../assets/icon-home.svg";
import iconStudent from "../assets/icon-student.png";
import iconTeam from "../assets/icon-team.svg";

export default function Sidebar({ show, onClose }) {
  return (
    <div
      className={`sidebar-custom position-fixed top-0 start-0 ${
        show ? "d-block" : "d-none"
      }`}
    >
      <div className="d-flex flex-column h-100">
        {/* Header */}
        <div className="d-flex align-items-center mb-4 border-bottom border-white padding-top px-3">
          <button
            className="btn btn-link text-white p-0 me-2"
            onClick={onClose}
            style={{ fontSize: "1.5rem" }}
          >
            ←
          </button>
        </div>

        {/* Title */}
        <h5 className="mb-4 mt-3 text-center jua-regular text-white">Buka Porto</h5>

        {/* Navigation */}
        <ul className="nav flex-column px-3 my-4">
          <li className="nav-item mb-3">
            <Link
              to="/"
              className="nav-link text-white d-flex align-items-center"
              onClick={onClose}
            >
              <img
                src={iconHome}
                alt="Home"
                className="me-2"
                style={{ width: "24px", filter: "invert(1)" }}
              />
              Home
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link
              to="/angkatan/1"
              className="nav-link text-white d-flex align-items-center"
              onClick={onClose}
            >
              <img
                src={iconStudent}
                alt="Student"
                className="me-2"
                style={{ width: "24px", filter: "invert(1)" }}
              />
              Student
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link
              to="/tim-dev"
              className="nav-link text-white d-flex align-items-center"
              onClick={onClose}
            >
              <img
                src={iconTeam}
                alt="Team Dev"
                className="me-2"
                style={{ width: "24px", filter: "invert(1)" }}
              />
              Team Dev
            </Link>
          </li>
        </ul>

        {/* Footer Logo */}
        <div className="mt-auto bottom-logo position-absolute bottom-0 start-0 w-100 d-flex flex-column justify-content-center align-items-center py-3">
          <img
            src={bazmaLogo}
            alt="Logo SMK TI BAZMA"
            style={{ width: "40px", marginBottom: "5px", filter: "invert(1)" }}
          />
          <span className="text-white">SMK TI BAZMA</span>
        </div>
      </div>
    </div>
  );
}
