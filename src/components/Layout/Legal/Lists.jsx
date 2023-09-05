import React from "react";

const ListWithoutHeader = function ({ values }) {
  return (
    <>
      <ul>
        {values?.map((v, index) => (
          <li key={index}>
            <p className="text-sm text-white/70 mb-4">
              <strong className="text-primary">{`${v.delimiter}`}</strong>{" "}
              {v.text}
            </p>
          </li>
        ))}
      </ul>
      <style jsx>{`
        p {
          font-size: 1.125rem;
          line-height: 1.75rem;
        }
        ul {
          background: var(--4);
          border-radius: 10px;
          padding: 20px;
        }
      `}</style>
    </>
  );
};

const ListWithHeader = function ({ header, values }) {
  return (
    <>
      <h1
        className="mt-10 text-2xl text-white/80 font-bold"
        style={{ fontSize: "2.5rem", lineHeight: "1" }}
      >
        {header}
      </h1>
      <ul>
        {values?.map((v, index) => (
          <li key={index}>
            <p className="text-sm text-white/70 mb-4">
              <strong className="text-primary">{`${v.delimiter}`}</strong>{" "}
              {v.text}
            </p>
          </li>
        ))}
      </ul>
      <style jsx>{`
        p {
          font-size: 1.125rem;
          line-height: 1.75rem;
        }
        ul {
          background: var(--4);
          border-radius: 10px;
          padding: 20px;
        }
        h1 {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  );
};

const ListWithHeaderAndLink = function ({ header, values }) {
  return (
    <>
      <h1
        className="mt-10 text-2xl text-white/80 font-bold"
        style={{ fontSize: "2.5rem", lineHeight: "1" }}
      >
        {header}
      </h1>
      <ul>
        {values?.map((v, index) => (
          <li key={index}>
            <p className="text-sm text-white/70 mb-4">
              <strong className="text-primary">{`${v.delimiter}`}</strong>{" "}
              {v.text}
              <a
                href={v.linkUrl}
                className="text-primary hover:text-primary/70"
              >
                {v.linkName}
              </a>
            </p>
          </li>
        ))}
      </ul>
      <style jsx>{`
        p {
          font-size: 1.125rem;
          line-height: 1.75rem;
        }
        ul {
          background: var(--4);
          border-radius: 10px;
          padding: 20px;
        }
        a {
          color: var(--primary);
          text-decoration: none;
        }
        a:hover {
          color: var(--primary/70);
        }
        h1 {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  );
};

const ListWithHeaderAndSubtitle = function ({ header, subtitle, values }) {
  return (
    <>
      <h1
        className="mt-10 text-2xl text-white/80 font-bold"
        style={{ fontSize: "2.5rem", lineHeight: "1" }}
      >
        {header}
      </h1>
      <p className="text-white/50 text-md">{subtitle}</p>
      <ul>
        {values?.map((v, index) => (
          <li key={index}>
            <p className="text-sm text-white/70 mb-4">
              <strong className="text-primary">{`${v.delimiter}`}</strong>{" "}
              {v.text}
            </p>
          </li>
        ))}
      </ul>
      <style jsx>{`
        p {
          font-size: 1.125rem;
          line-height: 1.75rem;
        }
        ul {
          background: var(--4);
          border-radius: 10px;
          padding: 20px;
        }
        p.text-md {
          font-size: 1.25rem;
          line-height: 1.75rem;
          color: rgba(255, 255, 255, 0.7);
        }
        h1 {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  );
};

export {
  ListWithoutHeader,
  ListWithHeader,
  ListWithHeaderAndSubtitle,
  ListWithHeaderAndLink,
};
