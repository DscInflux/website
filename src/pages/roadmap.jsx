import React from "react";
import ProgressItemCard from "@/components/Layout/RoadMap/ProgressItemCard"; // Adjust the import path as needed

const RoadmapPage = () => (
  <div className="progress-page">
    <h1 className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent text-7xl text-center">
      Road Map
    </h1>
    <p className="mt-4 max-w-2xl text-xl text-neon-blue lg:mx-auto">
      <span className="text-neon-blue">
        RoadMap of the projects and features Influx been upto!
      </span>
    </p>
    <div className="progress-list">
      <ProgressItemCard title="Widget" percentage={60} />
      <ProgressItemCard title="API" percentage={80} />
      <ProgressItemCard title="Main Site" percentage={100} />
      <ProgressItemCard title="Ritono" percentage={20} />
      <ProgressItemCard title="Docs" percentage={20} />
      <ProgressItemCard title="Sysmanage" percentage={70} />
      <ProgressItemCard title="Admin" percentage={40} />
    </div>
    <style jsx>{`
      .progress-page {
        padding: 50px;
        text-align: center;
      }

      .page-title {
        margin-bottom: 5 0px;
      }

      .progress-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 2fr));
        justify-content: center; /* Align items horizontally */
        gap: 20px;
        margin-top: 30px;
      }
    `}</style>
  </div>
);

export default RoadmapPage;
