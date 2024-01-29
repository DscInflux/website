import React from "react";

const Layout = ({ children }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "gray.100",
      }}
    >
      <div style={{ maxWidth: "container.md" }}>{children}</div>
    </div>
  );
};

export default Layout;
