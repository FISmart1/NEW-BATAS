import React from "react";
import teamPhoto from "../assets/IQBAL.png"; // Ganti dengan gambar tim-mu

function TeamDeveloper() {
  return (
    <div className="container w-100 d-flex flex-column flex-lg-row align-items-center justify-content-center gap-5 p-5 mt-5">
      <div
        className=" text-justify text-Black px-3 "
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <h1 className="fw-bold mb-3" style={{ fontSize: "3rem" }}>
          Team Developer
        </h1>
        <p className="lead mb-4">
          Tim kreatif yang berperan penting dalam membangun platform{" "}
          <strong>BukaPorto</strong>. Kami adalah kombinasi dari desain,
          pengembangan, dan semangat inovasi.
        </p>
        <div className="bg-white text-dark rounded-4 py-3 px-4 d-inline-block shadow-lg">
          <p className="mb-1">
            <strong>Pembimbing:</strong> Ibu Billa
          </p>
          <p className="mb-1">
            <strong>Developer:</strong> Perdi Nuri Hardiansyah (Frontend &
            Backend)
          </p>
          <p className="mb-0">
            <strong>Designer:</strong> Iqbal (UI/UX)
          </p>
        </div>
      </div>
      <img
        src={teamPhoto}
        alt="Team Developer"
        className="w-50 rounded-4 shadow-lg"
        style={{
          height: "30vh",
          objectFit: "cover",
          filter: "brightness(60%)",
        }}
      />
    </div>
  );
}

export default TeamDeveloper;
