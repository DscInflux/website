const LegalSectionWithLink = function ({ title, text, linkName, linkUrl }) {
  return (
    <>
      <h1
        className="mt-10 text-2xl text-white/80 font-bold"
        style={{ fontSize: "2.5rem", lineHeight: "1" }}
      >
        {title}
      </h1>
      <p className="mt-2 text-white/80">
        {text}{" "}
        <a className="text-primary hover:text-primary/70" href={linkUrl}>
          {linkName}
        </a>
        .
      </p>
    </>
  );
};

const LegalSectionBase = function ({ title, text }) {
  return (
    <>
      <h1
        className="mt-10 text-2xl text-white/80 font-bold"
        style={{ fontSize: "2.5rem", lineHeight: "1" }}
      >
        {title}
      </h1>
      <p className="mt-2 text-white/80">{text}</p>
    </>
  );
};

export { LegalSectionWithLink, LegalSectionBase };
