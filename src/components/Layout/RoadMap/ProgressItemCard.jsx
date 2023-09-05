import React from "react";

const ProgressItemCard = ({ title, percentage }) => (
  <div className="progress-item-card">
    <h2 className="progress-item-title">{title}</h2>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
    </div>
    <p className="progress-percentage">{percentage}%</p>
    <style jsx>{`
      .progress-item-card {
        background-color: #000; /* Set the background color to black */
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .progress-item-title {
        font-size: 1.2rem;
        margin-bottom: 10px;
        color: #3498db; /* Set the title color to light blue */
      }

      .progress-bar {
        background-color: #f1f1f1;
        border-radius: 4px;
        height: 10px;
        position: relative;
      }

      .progress-fill {
        background-color: #3498db;
        border-radius: 4px;
        height: 100%;
      }

      .progress-percentage {
        margin-top: 8px;
        font-size: 0.9rem;
        color: #666;
      }
    `}</style>
  </div>
);

export default ProgressItemCard;
