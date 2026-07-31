/* Brand logos via Simple Icons (jsDelivr); conceptual skills use custom SVGs */

const CONCEPT = "#00e5ff";

const brandSlugs = {
  LangChain: { slug: "langchain", color: "#1B9788" },
  "OpenAI API": { slug: "openai", color: "#10A37F" },
  "Hugging Face": { slug: "huggingface", color: "#FFD21E" },
  TensorFlow: { slug: "tensorflow", color: "#FF6F00" },
  PyTorch: { slug: "pytorch", color: "#EE4C2C" },
  OpenCV: { slug: "opencv", color: "#5C3EE8" },
  PostgreSQL: { slug: "postgresql", color: "#4169E1" },
  MongoDB: { slug: "mongodb", color: "#47A248" },
  Python: { slug: "python", color: "#3776AB" },
  FastAPI: { slug: "fastapi", color: "#009688" },
  React: { slug: "react", color: "#61DAFB" },
  HTML: { slug: "html5", color: "#E34F26" },
  CSS: { slug: "css", color: "#1572B6" },
  GitHub: { slug: "github", color: "#F0EEFF" },
  Docker: { slug: "docker", color: "#2496ED" },
  Kubernetes: { slug: "kubernetes", color: "#326CE5" },
};

/* Trademark-restricted icons inlined from Simple Icons v11 */
const inlineBrands = {
  Tableau: {
    color: "#E97627",
    path: "M11.654.174V2.377H9.682v.58h1.972V5.16h.696V2.957h1.97v-.58h-1.97V.174h-.348zm6.03 2.262l-.002 1.623v1.623h-2.957v.927h2.957v3.188H18.725l.011-1.582.02-1.576 1.465-.02 1.46-.01v-.927H18.728V2.436h-.522zm-12.407.06V5.686H2.291v.925H5.277V9.801h.985V6.61h3.013v-.925H6.262V2.496H5.77zm6.086 5.27v3.593H8.06v1.188h3.304v3.596h1.28v-3.596H15.953v-1.188H12.643V7.766h-.637zm9.721 1.55v2.221h-2.012v.811h2.012v2.261h.887v-2.261H24v-.811h-2.029V9.317h-.422zm-19.111.131V11.621H0v.621H1.973v2.194H2.64v-2.194h2v-.62H2.609V9.446h-.318zm15.709 4.516v3.254h-3.016v.927h3.016v3.217h1.072v-3.216H21.74v-.928H18.754v-3.254h-.533zm-12.463.008v3.246H2.262v.928h2.957v3.189H6.32v-3.189h2.955v-.928H6.32V13.97h-.55zm6.316 4.578l.002 1.103v1.1H9.566v.812h1.971v2.262h.928l.012-1.119.017-1.143H14.463v-.812h-2V18.549h-.465z",
  },
  "Power BI": {
    color: "#F2C811",
    path: "M10 12a1 1 0 0 1 1 1v11H4a1 1 0 0 1-1-1V13a1 1 0 0 1 1-1h6Zm-2-.5V7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v17h-4.5V13a1.5 1.5 0 0 0-1.5-1.5H8Zm5-6V1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v22a1 1 0 0 1-1 1h-3.5V7A1.5 1.5 0 0 0 15 5.5h-2Z",
  },
  "Microsoft Azure": {
    color: "#0078D4",
    path: "M22.379 23.343a1.62 1.62 0 0 0 1.536-2.14v.002L17.35 1.76A1.62 1.62 0 0 0 15.816.657H8.184A1.62 1.62 0 0 0 6.65 1.76L.086 21.204a1.62 1.62 0 0 0 1.536 2.139h4.741a1.62 1.62 0 0 0 1.535-1.103l.977-2.892 4.947 3.675c.28.208.618.32.966.32m-3.084-12.531 3.624 10.739a.54.54 0 0 1-.51.713v-.001h-.03a.54.54 0 0 1-.322-.106l-9.287-6.9h4.853m6.313 7.006c.116-.326.13-.694.007-1.058L9.79 1.76a1.722 1.722 0 0 0-.007-.02h6.034a.54.54 0 0 1 .512.366l6.562 19.445a.54.54 0 0 1-.338.684",
  },
};

function iconUrl(slug) {
  return `https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${slug}.svg`;
}

function SvgIcon({ children }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill={CONCEPT}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const conceptualIcons = {
  "Machine Learning": (
    <SvgIcon>
      <path d="M12 2L4 6.5v11L12 22l8-4.5v-11L12 2zm0 2.2l5.8 3.25v1.9l-5.8 3.25-5.8-3.25v-1.9L12 4.2zm-6.5 6.4l5.5 3.1v6.05l-5.5-3.1V10.6zm7.5 9.15v-6.05l5.5-3.1v6.05l-5.5 3.1z" />
    </SvgIcon>
  ),
  "Deep Learning": (
    <SvgIcon>
      <circle cx="5" cy="6" r="1.5" />
      <circle cx="12" cy="4" r="1.5" />
      <circle cx="19" cy="6" r="1.5" />
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
      <circle cx="5" cy="18" r="1.5" />
      <circle cx="12" cy="20" r="1.5" />
      <circle cx="19" cy="18" r="1.5" />
      <g fill="none" stroke={CONCEPT} strokeWidth="1.15">
        <path d="M6.3 6.9l4.1-1.7M13.6 5.2l4.1 1.7M6.3 11.3l4.2.5M13.5 11.8l4.2-.5M6.3 17.1l4.1 1.7M13.6 18.8l4.1-1.7M5 7.5v3M12 5.5v5M19 7.5v3M5 13.5v3M12 13.5v5M19 13.5v3" />
      </g>
    </SvgIcon>
  ),
  "Statistical Modelling": (
    <SvgIcon>
      <path d="M3 19h18v1.5H3V19zm2.5-2.5h2V10h-2v6.5zm4.5 0h2V6h-2v10.5zm4.5 0h2V8.5h-2v8zm4.5 0h2V4h-2v12.5z" />
    </SvgIcon>
  ),
  "Data Analysis": (
    <SvgIcon>
      <path d="M4 18V6h1.5v12H4zm3.5 0l4-5.5 3 3.5 5.5-7.5.9.7-6.2 8.5-3.1-3.6L7.5 18z" />
    </SvgIcon>
  ),
  "Feature Engineering": (
    <SvgIcon>
      <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96a7.2 7.2 0 00-1.62-.94l-.36-2.54A.48.48 0 0014 2h-4a.48.48 0 00-.48.41l-.36 2.54c-.58.23-1.12.54-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.64 8.47a.49.49 0 00.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.76 14.1a.49.49 0 00-.12.61l1.92 3.32c.13.22.4.31.61.22l2.39-.96c.5.4 1.04.72 1.62.94l.36 2.54c.05.24.25.41.48.41h4c.24 0 .43-.17.48-.41l.36-2.54c.58-.22 1.12-.54 1.62-.94l2.39.96c.22.09.48 0 .61-.22l1.92-3.32a.49.49 0 00-.12-.61l-2.03-1.58zM12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" />
    </SvgIcon>
  ),
  "Model Evaluation": (
    <SvgIcon>
      <path d="M9.5 16.5L5 12l1.4-1.4 3.1 3.1 7.1-7.1L18 8l-8.5 8.5zM4 20h16v1.5H4V20z" />
    </SvgIcon>
  ),
  "Cross Validation": (
    <SvgIcon>
      <path d="M4 4h7v7H4V4zm1.5 1.5v4h4v-4h-4zM13 4h7v7h-7V4zm1.5 1.5v4h4v-4h-4zM4 13h7v7H4v-7zm1.5 1.5v4h4v-4h-4zM13 13h7v7h-7v-7zm1.5 1.5v4h4v-4h-4z" />
    </SvgIcon>
  ),
  "Hyperparameter Tuning": (
    <SvgIcon>
      <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 1.5a7.5 7.5 0 110 15 7.5 7.5 0 010-15zM12 7v5.2l3.5 2.1-.75 1.25L10.5 13V7H12z" />
    </SvgIcon>
  ),
  RAG: (
    <SvgIcon>
      <path d="M4 5h10v2H4V5zm0 4h16v2H4V9zm0 4h12v2H4v-2zm0 4h8v2H4v-2zm14.5-1.5l2.5 2.5-1.1 1.1-2.5-2.5a3.5 3.5 0 111.1-1.1zM17 14.5a2 2 0 100 4 2 2 0 000-4z" />
    </SvgIcon>
  ),
  "Agentic AI": (
    <SvgIcon>
      <path d="M12 2a4 4 0 014 4v1h1.5A2.5 2.5 0 0120 9.5v5A2.5 2.5 0 0117.5 17H16v1a4 4 0 01-8 0v-1H6.5A2.5 2.5 0 014 14.5v-5A2.5 2.5 0 016.5 7H8V6a4 4 0 014-4zm0 1.5A2.5 2.5 0 009.5 6v1h5V6A2.5 2.5 0 0012 3.5zM9 11.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zm6 0a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM10 18a2 2 0 004 0v-1h-4v1z" />
    </SvgIcon>
  ),
  MCP: (
    <SvgIcon>
      <path d="M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zm1.5 1.5v13h11v-13h-11zm2 2h7v1.5h-7V7.5zm0 3.5h7V12.5h-7V11zm0 3.5h4.5V16h-4.5v-1.5z" />
    </SvgIcon>
  ),
  Embeddings: (
    <SvgIcon>
      <path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5v-9zm1.6 1.1v6.7L12 19.1l7.4-3.8V8.6L12 12.4 4.6 8.6zM12 4.7L6.2 7.6 12 10.5l5.8-2.9L12 4.7z" />
    </SvgIcon>
  ),
  "Vector Databases": (
    <SvgIcon>
      <path d="M12 2l8 4v5.5c0 4.6-3.1 8.8-8 10.5-4.9-1.7-8-5.9-8-10.5V6l8-4zm0 1.7L5.5 7v4.5c0 3.7 2.5 7.1 6.5 8.6 4-1.5 6.5-4.9 6.5-8.6V7L12 3.7zm0 3.3l3.5 1.8v2.7L12 13.3l-3.5-1.8V8.8L12 7z" />
    </SvgIcon>
  ),
  NLP: (
    <SvgIcon>
      <path d="M4 5h16v10H8.5L4 19.5V5zm1.5 1.5v10.2l2.2-2.2H18.5v-8H5.5zm2 2h9V10h-9V8.5zm0 3h6V13h-6v-1.5z" />
    </SvgIcon>
  ),
  "Text Processing": (
    <SvgIcon>
      <path d="M5 4h14v2H5V4zm0 4h10v2H5V8zm0 4h14v2H5v-2zm0 4h8v2H5v-2z" />
    </SvgIcon>
  ),
  YOLO: (
    <SvgIcon>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1.8c4.52 0 8.2 3.68 8.2 8.2s-3.68 8.2-8.2 8.2-8.2-3.68-8.2-8.2 3.68-8.2 8.2-8.2zM8.2 7.5L12 14.2l3.8-6.7h1.9L12.9 16h-1.8L6.3 7.5h1.9z" />
    </SvgIcon>
  ),
  EDA: (
    <SvgIcon>
      <path d="M3 19h18v1.5H3V19zM5 16l3.5-5 2.8 3.5L16 7.5l1.2.9-5.5 8-2.7-3.4L6.2 16.8 5 16zm13.5-9a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </SvgIcon>
  ),
  SQL: (
    <SvgIcon>
      <path d="M12 2C7.5 2 4 3.5 4 5.5v13c0 2 3.5 3.5 8 3.5s8-1.5 8-3.5v-13C20 3.5 16.5 2 12 2zm0 1.5c3.7 0 6.5 1.1 6.5 2s-2.8 2-6.5 2-6.5-1.1-6.5-2 2.8-2 6.5-2zM5.5 8.7c1.5.8 3.7 1.3 6.5 1.3s5-.5 6.5-1.3v2.6c-1.5.8-3.7 1.3-6.5 1.3s-5-.5-6.5-1.3V8.7zm0 5c1.5.8 3.7 1.3 6.5 1.3s5-.5 6.5-1.3v2.6c-1.5.8-3.7 1.3-6.5 1.3s-5-.5-6.5-1.3v-2.6z" />
    </SvgIcon>
  ),
  "CI/CD": (
    <SvgIcon>
      <path d="M7 4h2v4.2l3 2 3-2V4h2v5l-4 2.7V14h4.5v2H13v4h-2v-4H6.5v-2H11v-2.3L7 9V4zm10.5 9.5l2.5 2.5-1.1 1.1-1.4-1.4V20h-1.5v-4.3l-1.4 1.4-1.1-1.1 2.5-2.5.75-.2.75.2z" />
    </SvgIcon>
  ),
};

function BrandIcon({ name }) {
  if (inlineBrands[name]) {
    const { color, path } = inlineBrands[name];
    return (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill={color}
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
    );
  }

  const { slug, color } = brandSlugs[name];
  const url = iconUrl(slug);
  return (
    <span
      className="skill-brand-icon"
      style={{
        backgroundColor: color,
        WebkitMaskImage: `url(${url})`,
        maskImage: `url(${url})`,
      }}
      role="img"
      aria-label={name}
    />
  );
}

export function SkillIcon({ name }) {
  if (brandSlugs[name] || inlineBrands[name]) {
    return <BrandIcon name={name} />;
  }
  if (conceptualIcons[name]) {
    return conceptualIcons[name];
  }
  return (
    <SvgIcon>
      <circle cx="12" cy="12" r="8" fill="none" stroke={CONCEPT} strokeWidth="1.5" />
      <text x="12" y="15.5" textAnchor="middle" fontSize="9" fill={CONCEPT}>
        {name.charAt(0)}
      </text>
    </SvgIcon>
  );
}
