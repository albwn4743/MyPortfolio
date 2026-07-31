import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import emailjs from "@emailjs/browser";
import "./Portfolio.css";
import { SkillIcon } from "./SkillIcons";
import { LinkedinIcon, GithubIcon, InstagramIcon } from "./assets/SocialIcons";
function MiniParticleLoader() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    const size = 160;
    canvas.width = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const particleCount = 20;
    const particles = [];
    const radius = 50;

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      particles.push({ x, y, z });
    }

    let angleX = 0.015;
    let angleY = 0.015;

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      
      const cx = size / 2;
      const cy = size / 2;
      const fov = 120;

      const projected = particles.map(p => {
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.x * sinY + p.z * cosY;

        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        let y1 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;

        p.x = x1;
        p.y = y1;
        p.z = z2;

        const scale = fov / (fov + z2 + 80);
        return {
          x: cx + x1 * scale,
          y: cy + y1 * scale,
          z: z2
        };
      });

      for (let i = 0; i < particleCount; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 2025) { // 45 * 45
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / 45) * 0.35;
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      projected.forEach(p => {
        const nodeSize = Math.max(1, 3 * (fov / (fov + p.z + 80)));
        ctx.fillStyle = "#00e5ff";
        ctx.shadowColor = "#00e5ff";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px var(--mono)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "#7b61ff";
      ctx.shadowBlur = 10;
      ctx.fillText("AJ", cx, cy);
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "rgba(123, 97, 255, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 72, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block", margin: "0 auto" }} />;
}

function Interactive3DBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ y: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX - width / 2;
      mouseRef.current.targetY = e.clientY - height / 2;
    };
    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const handleScroll = () => {
      scrollRef.current.targetY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);

    const particleCount = 80;
    const particles = [];
    const minDim = Math.min(width, height);
    const boxSize = minDim * 0.7;

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * boxSize;
      const y = (Math.random() - 0.5) * boxSize;
      const z = (Math.random() - 0.5) * boxSize;
      
      particles.push({
        x,
        y,
        z,
        ox: x,
        oy: y,
        oz: z,
        size: Math.random() * 2 + 1,
        color: i % 3 === 0 ? "123, 97, 255" : i % 3 === 1 ? "0, 229, 255" : "255, 107, 157",
      });
    }

    const fov = 400;
    let rx = 0;
    let ry = 0;
    let sweepY = 0;
    let sweepDirection = 1;

    const projectPoint = (x, y, z, cx, cy, cz, cosX, sinX, cosY, sinY, cosZ, sinZ) => {
      let x1 = x;
      let y1 = y * cosX - z * sinX;
      let z1 = y * sinX + z * cosX;

      let x2 = x1 * cosY + z1 * sinY;
      let y2 = y1;
      let z2 = -x1 * sinY + z1 * cosY;

      let x3 = x2 * cosZ - y2 * sinZ;
      let y3 = x2 * sinZ + y2 * cosZ;
      let z3 = z2;

      const distance = fov * 1.5;
      const projectedZ = z3 + distance;
      
      if (projectedZ > 50) {
        const scale = fov / projectedZ;
        return {
          x: x3 * scale + width / 2,
          y: y3 * scale + height / 2,
          z: projectedZ,
          scale,
        };
      }
      return null;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const scroll = scrollRef.current;
      scroll.y += (scroll.targetY - scroll.y) * 0.06;

      rx += 0.001;
      ry += 0.0015;

      const currentRx = rx + scroll.y * 0.0012;
      const currentRy = ry + mouse.x * 0.0003;
      const currentRz = mouse.y * 0.0003;

      const cosX = Math.cos(currentRx);
      const sinX = Math.sin(currentRx);
      const cosY = Math.cos(currentRy);
      const sinY = Math.sin(currentRy);
      const cosZ = Math.cos(currentRz);
      const sinZ = Math.sin(currentRz);

      sweepY += sweepDirection * 1.5;
      if (sweepY > boxSize / 2) {
        sweepY = boxSize / 2;
        sweepDirection = -1;
      } else if (sweepY < -boxSize / 2) {
        sweepY = -boxSize / 2;
        sweepDirection = 1;
      }

      const ringConfig = [
        { radius: boxSize * 0.4, color: "0, 229, 255", rxMult: 1.2, ryMult: 0.8 },
        { radius: boxSize * 0.42, color: "123, 97, 255", rxMult: 0.7, ryMult: 1.3 },
        { radius: boxSize * 0.44, color: "255, 107, 157", rxMult: 0.9, ryMult: 0.9 }
      ];

      ringConfig.forEach((ring) => {
        const points = 60;
        const ringPoints = [];
        const ringRx = rx * ring.rxMult + scroll.y * 0.001;
        const ringRy = ry * ring.ryMult + mouse.x * 0.0002;
        
        const rCosX = Math.cos(ringRx);
        const rSinX = Math.sin(ringRx);
        const rCosY = Math.cos(ringRy);
        const rSinY = Math.sin(ringRy);

        for (let a = 0; a <= points; a++) {
          const theta = (a / points) * Math.PI * 2;
          const px = Math.cos(theta) * ring.radius;
          const py = 0;
          const pz = Math.sin(theta) * ring.radius;

          const proj = projectPoint(px, py, pz, 0, 0, 0, rCosX, rSinX, rCosY, rSinY, cosZ, sinZ);
          if (proj) ringPoints.push(proj);
        }

        if (ringPoints.length > 1) {
          ctx.strokeStyle = `rgba(${ring.color}, 0.12)`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(ringPoints[0].x, ringPoints[0].y);
          for (let pIdx = 1; pIdx < ringPoints.length; pIdx++) {
            ctx.lineTo(ringPoints[pIdx].x, ringPoints[pIdx].y);
          }
          ctx.stroke();
        }
      });

      const scanPoints = [];
      const scanRadius = boxSize * 0.42;
      for (let a = 0; a <= 40; a++) {
        const theta = (a / 40) * Math.PI * 2;
        const px = Math.cos(theta) * scanRadius;
        const py = sweepY;
        const pz = Math.sin(theta) * scanRadius;

        const proj = projectPoint(px, py, pz, 0, 0, 0, cosX, sinX, cosY, sinY, cosZ, sinZ);
        if (proj) scanPoints.push(proj);
      }
      if (scanPoints.length > 1) {
        ctx.strokeStyle = "rgba(0, 229, 255, 0.08)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(scanPoints[0].x, scanPoints[0].y);
        for (let pIdx = 1; pIdx < scanPoints.length; pIdx++) {
          ctx.lineTo(scanPoints[pIdx].x, scanPoints[pIdx].y);
        }
        ctx.stroke();
      }

      const projected = [];
      let closestIdx = -1;
      let minMouseDist = Infinity;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        p.ox += Math.sin(rx * 0.5 + i) * 0.08;
        p.oy += Math.cos(ry * 0.5 + i) * 0.08;

        let rx1 = p.ox;
        let ry1 = p.oy * cosX - p.oz * sinX;
        let rz1 = p.oy * sinX + p.oz * cosX;

        let rx2 = rx1 * cosY + rz1 * sinY;
        let ry2 = ry1;
        let rz2 = -rx1 * sinY + rz1 * cosY;

        let rotX = rx2 * cosZ - ry2 * sinZ;
        let rotY = rx2 * sinZ + ry2 * cosZ;
        let rotZ = rz2;

        const screenX = rotX + width / 2;
        const screenY = rotY + height / 2;

        const dx = (mouse.x + width / 2) - screenX;
        const dy = (mouse.y + height / 2) - screenY;
        const distSq = dx * dx + dy * dy;
        let pushX = 0;
        let pushY = 0;
        let pushZ = 0;

        if (distSq < 32400) {
          const dist = Math.sqrt(distSq);
          const force = (180 - dist) / 180;
          pushX = -(dx / (dist + 1)) * force * 50;
          pushY = -(dy / (dist + 1)) * force * 50;
          pushZ = -force * 80;
        }

        p.x += (p.ox + pushX - p.x) * 0.08;
        p.y += (p.oy + pushY - p.y) * 0.08;
        p.z += (p.oz + pushZ - p.z) * 0.08;

        const proj = projectPoint(p.x, p.y, p.z, 0, 0, 0, cosX, sinX, cosY, sinY, cosZ, sinZ);
        
        if (proj) {
          const distToSweep = Math.abs(p.y - sweepY);
          let sizeMultiplier = 1;
          let sweepHighlight = false;

          if (distToSweep < 25) {
            sizeMultiplier = 1.8 - (distToSweep / 25) * 0.8;
            sweepHighlight = true;
          }

          const size = p.size * proj.scale * 1.2 * sizeMultiplier;
          
          projected.push({
            x: proj.x,
            y: proj.y,
            z: proj.z,
            size,
            color: p.color,
            sweepHighlight,
            orig3d: p,
          });

          const mx = mouse.x + width / 2;
          const my = mouse.y + height / 2;
          const mdx = proj.x - mx;
          const mdy = proj.y - my;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < minMouseDist) {
            minMouseDist = mDist;
            closestIdx = i;
          }
        } else {
          projected.push(null);
        }
      }

      ctx.lineWidth = 0.5;
      for (let i = 0; i < particleCount; i++) {
        const p1 = projected[i];
        if (!p1) continue;

        for (let j = i + 1; j < particleCount; j++) {
          const p2 = projected[j];
          if (!p2) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 10000) {
            const dist = Math.sqrt(distSq);
            let baseAlpha = 0.15;
            if (p1.sweepHighlight || p2.sweepHighlight) {
              baseAlpha = 0.35;
            }
            const alpha = (1 - dist / 100) * baseAlpha * (fov / p1.z);
            
            ctx.strokeStyle = p1.sweepHighlight || p2.sweepHighlight
              ? `rgba(0, 229, 255, ${alpha})`
              : `rgba(123, 97, 255, ${alpha})`;
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < particleCount; i++) {
        const p = projected[i];
        if (!p) continue;

        let alpha = Math.max(0.1, Math.min(0.85, (fov / p.z) * 1.5));
        if (p.sweepHighlight) {
          alpha = Math.min(1.0, alpha * 2);
        }

        ctx.fillStyle = p.sweepHighlight
          ? `rgba(0, 229, 255, ${alpha})`
          : `rgba(${p.color}, ${alpha})`;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.size > 2 || p.sweepHighlight) {
          ctx.fillStyle = p.sweepHighlight
            ? `rgba(0, 229, 255, ${alpha * 0.4})`
            : `rgba(${p.color}, ${alpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (closestIdx !== -1 && minMouseDist < 160) {
        const target = projected[closestIdx];
        const mx = mouse.x + width / 2;
        const my = mouse.y + height / 2;

        ctx.strokeStyle = "rgba(0, 229, 255, 0.35)";
        ctx.lineWidth = 0.75;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = "rgba(0, 229, 255, 0.6)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.size * 2 + 3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "rgba(0, 229, 255, 0.75)";
        ctx.font = "8px Space Mono, monospace";
        ctx.fillText(`[HUD_LOCK: NODE_${closestIdx}]`, target.x + 12, target.y - 12);
        ctx.fillText(`[X: ${target.orig3d.x.toFixed(0)}]`, target.x + 12, target.y - 4);
        ctx.fillText(`[Y: ${target.orig3d.y.toFixed(0)}]`, target.x + 12, target.y + 4);
        ctx.fillText(`[Z: ${target.orig3d.z.toFixed(0)}]`, target.x + 12, target.y + 12);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return <canvas ref={canvasRef} className="interactive-3d-bg" />;
}


/* ── DATA ── */
const projects = [
  {
    number: "01",
    tag: "NLP/RAG",
    title: "QuestBot",
    desc: "Agentic RAG chatbot that combines retrieval, reasoning, and tool usage to deliver context-aware answers, enabling personalized tutoring through dynamic knowledge grounding, multi-step decision making, and real-time adaptive guidance.",
    stack: ['OpenCV','HuggingFace','LangChain','Pyttsx3',"Weaviate", "Transformers", "CUDA", "FastAPI", "React"],
    featured: true,
  },
  {
    number: "02",
    tag: "Deep Learning",
    title: "AI-Sketch to Image",
    desc: "Sketch-to-image system using GAN architecture trained on diverse sketch–photo pairs. Generates high-fidelity, realistic images from rough inputs with consistent structure and style preservation.",
    stack: ["GAN",'Pix2Pix', "Pytorch",'OpenCV','Encoder-Decoder','FastAPI','React'],
    featured: false,
  },
  {
    number: "03",
    tag: "Machine Learning",
    title: "AI FORECASTING",
    desc: "Retail demand forecasting pipeline leveraging time-series and ML models (Linear Regression, XGBoost) on historical sales with external signals (weather, promotions). Achieved 87.64% accuracy with interactive Tableau dashboards for regional insights and decision support.",
    stack: ["XGboost", "Cross Validation", "ARIMA", "Hyper Parameter Tuning", "Tableau"],
    featured: false,
  },
  {
    number: "04",
    tag: "OpenCV",
    title: "Animal Repellent System",
    desc: "Real-time monitoring system using YOLO-based object detection to identify and track multiple animal species, enabling automated repelling actions through low-latency alerts and edge-deployed inference for continuous field surveillance.",
    stack: ["Raspberry PI", "Esp 32", "YOLO", "MLops", "OpenCV",'Telegram BOT'],
    featured: false,
  },
  {
  number: "05",
  tag: "Generative AI",
  title: "WEB-RAG-ASSISTANT",
  desc: "AI-powered contextual web assistant that enables users to interact with websites using natural language. Utilizes a Retrieval-Augmented Generation (RAG) pipeline for semantic search, contextual understanding, and intelligent question answering based on webpage content.",
  stack: [
    "FastAPI",
    "Playwright",
    "HuggingFace Embeddings",
    "Weaviate",
    "Groq LLM",
    "Chrome Extension",
    "RAG",
    "Python"
  ],
  featured: true,
}
];

const skillGroups = [
  {
    icon: "🤖",
    title: "AI / Machine Learning",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "Statistical Modelling",
      "Data Analysis",
      "Feature Engineering",
      "Model Evaluation",
      "Cross Validation",
      "Hyperparameter Tuning",
    ],
  },
  {
    icon: "🧠",
    title: "Generative AI & LLMs",
    skills: [
      "RAG",
      "Agentic AI",
      "MCP",
      "LangChain",
      "Embeddings",
      "Vector Databases",
      "OpenAI API",
      "Hugging Face",
    ],
  },
  {
    icon: "🔬",
    title: "Deep Learning & Computer Vision",
    skills: [
      "TensorFlow",
      "PyTorch",
      "OpenCV",
      "NLP",
      "Text Processing",
      "YOLO",
    ],
  },
  {
    icon: "📊",
    title: "Data Engineering & Analytics",
    skills: [
      "EDA",
      "SQL",
      "PostgreSQL",
      "MongoDB",
      "Tableau",
      "Power BI",
    ],
  },
  {
    icon: "💻",
    title: "Programming, Frameworks & Tools",
    skills: [
      "Python",
      "FastAPI",
      "React",
      "HTML",
      "CSS",
      "GitHub",
    ],
  },
  {
    icon: "☁️",
    title: "Cloud & DevOps",
    skills: [
      "Docker",
      "Kubernetes",
      "Microsoft Azure",
      "CI/CD",
    ],
  },
];

const experiences = [
  {
    logo: "/claysys_logo.png", // <-- Add your company logo image path here (e.g., "/company-logo.png" if placed in the public folder)
    date: "JUNE 2026 — Present",
    company: "ClaySys Technologies",
    title: "AI/ML Engineer",
    desc: "Designing and deploying production-ready machine learning solutions, custom deep learning pipelines, and generative AI features. Integrating large language models (LLMs) and agentic workflows to build intelligent enterprise systems with high performance and scalability.",
    tags: ["Python", "PyTorch", "Transformers", "LLMs", "Agentic AI", "MLOps", "System Design", "API Integration"],
    responsibilities: [
      "Architect core deep learning model interfaces and agentic retrieval pipelines.",
      "Deploy scalable RESTful ML APIs and containerized microservices in Docker.",
      "Collaborate with multi-functional engineering teams to implement production LLM features."
    ],
    achievements: [
      "Optimized query latency by 35% through custom key-value caching and quantization."
    ]
  },
  {
    logo: "/quest_logo.png", // <-- Add your company logo image path here
    date: "JULY 2025 — MAY 2026",
    company: "Quest Innovative Solutions",
    title: "Data Science Intern",
    desc: "Applied Python and machine learning for data analysis, preprocessing, and model building using Pandas, NumPy, and Scikit-learn. Developed predictive models, NLP solutions, and deep learning systems with TensorFlow/Keras. Built generative and agentic AI applications, including RAG chatbots, and deployed them using Flask and Streamlit.",
    tags: ["PyTorch", "Transformers", "Tensorflow", "NLP", "RAG", "Flask", "Vector DBs", "Data Modelling/Storytelling", "Tableau/PowerBI", "Gen AI", "Agentic AI"],
    responsibilities: [
      "Preprocessed massive telemetry datasets and trained ensembles (Linear Regression, Random Forest, XGBoost).",
      "Constructed interactive retrieval-augmented generation (RAG) assistant proof-of-concepts.",
      "Engineered automated script pipelines for periodic regional demand prediction reports."
    ],
    achievements: [
      "Designed sketch-to-image GAN architecture yielding an 87%+ structural fidelity evaluation index."
    ]
  }
];

const education = [
  {
    logo: "/college_logo.png", // <-- Add your institution logo image path here (e.g., "/college-logo.png")
    date: "2021 — 2025",
    company: "Viswajyothi College of Engineering and Technology",
    title: "B.Tech in Computer Science and Design",
    desc: "Focus on Software Engineering and Data Structures. Graduated with First Class honors in the major, along with a Minor Degree in Electronics and Communication, demonstrating strong academic performance and interdisciplinary expertise.",
    tags: ["Computer Networks", "Virtual Reality", "Machine Learning", "Algorithms", "Mathematics"],
    responsibilities: [
      "Academic focus on Object Oriented Programming, DBMS, and Algorithm Design.",
      "Completed Minor Program in Electronics and Communication engineering."
    ],
    achievements: [
      "Graduated with First Class Honors."
    ]
  },
  {
    logo: "/school_logo.png", // <-- Add your institution logo image path here
    date: "2019 — 2021",
    company: "St. Sebastian's Higher Secondary School",
    title: "Higher Secondary Education – Biology Science",
    desc: "Completed Higher Secondary education in Biology Science with 95% marks, achieving distinction and building a strong foundation in life sciences and analytical thinking.",
    tags: [],
    responsibilities: [
      "Core courses: Physics, Chemistry, Biology, and Mathematics."
    ],
    achievements: [
      "Graduated with 95% marks and earned Board Academic Distinction."
    ]
  }
];

/* ── COMPONENTS ── */
function ProjectCard({ project, index, onClick }) {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true);
        observer.disconnect();
      }
    }, { threshold: 0.05, rootMargin: "0px 0px -30px 0px" });

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  const style = index !== undefined ? { transitionDelay: `${index * 0.12}s` } : {};
  return (
    <div 
      ref={ref}
      className={`project-card scroll-reveal ${revealed ? "revealed" : ""}`} 
      style={style} 
      onClick={onClick}
    >
      <div className="project-card-header">
        <div className="project-card-info">
          <div className="project-card-meta">
            <span className="project-number">{project.number}</span>
            <span className="project-tag">{project.tag}</span>
          </div>
          <h3 className="project-card-title">{project.title}</h3>
        </div>
        <div className="project-card-arrow">↗</div>
      </div>
      <p className="project-card-excerpt">
        {project.desc.length > 120 ? project.desc.substring(0, 120) + "..." : project.desc}
      </p>
      <div className="project-card-footer">
        <span className="project-readmore">Read Details <span>→</span></span>
      </div>
    </div>
  );
}

function TimelineItem({ item, index, isExpanded, onToggle }) {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true);
        observer.disconnect();
      }
    }, { threshold: 0.05, rootMargin: "0px 0px -30px 0px" });

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  const style = index !== undefined ? { transitionDelay: `${index * 0.12}s` } : {};
  return (
    <div 
      ref={ref}
      className={`timeline-item scroll-reveal ${revealed ? "revealed" : ""} ${isExpanded ? "active" : ""}`} 
      style={style}
    >
      <div 
        className={`timeline-card ${isExpanded ? "active" : ""}`}
        onClick={onToggle}
      >
        <div className="timeline-card-header">
          <div className="timeline-card-brand">
            {item.logo ? (
              <img src={item.logo} alt={item.company} className="timeline-card-logo" />
            ) : (
              <div className="timeline-card-logo-placeholder">🏢</div>
            )}
          </div>
          <div className="timeline-card-info">
            <div className="timeline-card-meta">
              <span className="timeline-card-date">{item.date}</span>
              <span className="timeline-card-company">@ {item.company}</span>
            </div>
            <div className="timeline-card-title">{item.title}</div>
          </div>
          <div className="timeline-card-chevron">
            ▼
          </div>
        </div>

        <div className="timeline-card-body">
          <p className="timeline-card-desc">{item.desc}</p>
          
          {item.responsibilities && item.responsibilities.length > 0 && (
            <div className="timeline-details-section">
              <h4>Key Responsibilities</h4>
              <ul>
                {item.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {item.achievements && item.achievements.length > 0 && (
            <div className="timeline-details-section">
              <h4>Achievements</h4>
              <ul>
                {item.achievements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="timeline-card-tags" style={{ marginTop: "1.5rem" }}>
              {item.tags.map((t) => (
                <span key={t} className="timeline-card-tag">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── MAIN ── */
export default function Portfolio() {
  const scrollBarRef = useRef(null);
  const skillsRef = useRef(null);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [expandedExperience, setExpandedExperience] = useState(null);
  const [expandedEducation, setExpandedEducation] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [activeProjectModal, setActiveProjectModal] = useState(null);
  
  /* Loader States */
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [isLoaderFading, setIsLoaderFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [consoleLog, setConsoleLog] = useState("> Initializing system...");

  /* EmailJS Contact Form States */
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "email") {
      if (value && !emailRegex.test(value)) {
        setEmailError("Please enter a valid email address.");
      } else {
        setEmailError("");
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all fields.");
      return;
    }
    if (!emailRegex.test(formData.email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setIsSending(true);
    setSendResult(null);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";

    console.log("EmailJS Submission Config:", { serviceId, templateId, publicKey });

    emailjs.send(
  serviceId,
  templateId,
  {
    name: formData.name,
    email: formData.email,
    message: formData.message,
    time: new Date().toLocaleString(),
  },
  publicKey
)
    .then(() => {
      setIsSending(false);
      setSendResult("success");
      setShowSuccessModal(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSendResult(null), 5000);
    })
    .catch((error) => {
      console.error("EmailJS Error Status:", error?.status);
      console.error("EmailJS Error Text:", error?.text || error);
      setIsSending(false);
      setSendResult("error");
      setTimeout(() => setSendResult(null), 5000);
    });
  };

  /* Scroll reveal observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    );

    const elements = document.querySelectorAll(".scroll-reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  /* Loading screen logic */
  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 8) + 4;
      currentProgress = Math.min(100, currentProgress + increment);
      setProgress(currentProgress);

      if (currentProgress < 20) {
        setConsoleLog("> Booting neural layers...");
      } else if (currentProgress < 40) {
        setConsoleLog("> Loading core ML resources...");
      } else if (currentProgress < 60) {
        setConsoleLog("> Establishing 3D rendering workspace...");
      } else if (currentProgress < 85) {
        setConsoleLog("> Constructing dynamic components...");
      } else if (currentProgress < 100) {
        setConsoleLog("> Optimization check complete. Ready.");
      } else {
        setConsoleLog("> Systems online.");
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoaderFading(true);
          setTimeout(() => {
            setIsLoaderVisible(false);
          }, 600);
        }, 300);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  /* Block scroll when loading is active */
  useEffect(() => {
    if (isLoaderVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoaderVisible]);

  /* Scroll progress bar */
  useEffect(() => {
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = (window.scrollY / total) * 100;
      if (scrollBarRef.current) scrollBarRef.current.style.width = pct + "%";
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Skills intersection observer */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSkillsVisible(true); },
      { threshold: 0.2 }
    );
    if (skillsRef.current) obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, []);

  /* Scroll Spy using IntersectionObserver to prevent layout thrashing */
  useEffect(() => {
    const sections = ["about", "projects", "skills", "experience", "education", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {isLoaderVisible && (
        <div className={`loader-screen ${isLoaderFading ? "fade-out" : ""}`}>
          <div className="loader-bg-glow" />
          <div className="loader-container">
            <div className="loader-ring-wrapper">
              <MiniParticleLoader />
            </div>
            <div className="loader-progress-info">
              <span>Initializing Workspace</span>
              <span className="loader-percentage">{progress}%</span>
            </div>
            <div className="loader-progress-bar-track">
              <div className="loader-progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="loader-console">
              <div className="loader-log-line" key={consoleLog}>{consoleLog}</div>
            </div>
          </div>
        </div>
      )}
      <div ref={scrollBarRef} className="scroll-indicator" />
      <div className="noise" />
      <div className="grid-bg" />
      <Interactive3DBackground />


{/* NAV */}
<nav>
  <a href="#" className="nav-logo">
    ALBIN JOY
  </a>
  <ul className="nav-links">
    {["About", "Projects", "Skills", "Experience", "Education", "Contact"].map((l) => (
      <li key={l}>
        <a 
          href={`#${l.toLowerCase()}`}
          className={activeSection === l.toLowerCase() ? "active" : ""}
        >
          {l}
        </a>
      </li>
    ))}
  </ul>

  <div className="nav-socials">
    <a href="https://www.linkedin.com/in/albin-joy-110b6b351" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
      <LinkedinIcon size={18} />
    </a>
    <a href="https://github.com/albwn4743" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
      <GithubIcon size={18} />
    </a>
    <a href="https://www.instagram.com/_albwn?igsh=enp1ZGs0ZGVhMHYz&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
      <InstagramIcon size={18} />
    </a>
  </div>

  <button 
    className={`nav-mobile-toggle ${isMobileMenuOpen ? "open" : ""}`}
    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    aria-label="Toggle mobile menu"
  >
    ⋮
  </button>

  <div className={`nav-mobile-dropdown ${isMobileMenuOpen ? "open" : ""}`}>
    <ul>
      {["About", "Projects", "Skills", "Experience", "Education", "Contact"].map((l) => (
        <li key={l}>
          <a 
            href={`#${l.toLowerCase()}`}
            className={activeSection === l.toLowerCase() ? "active" : ""}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {l}
          </a>
        </li>
      ))}
    </ul>
    <div className="nav-mobile-divider" />
    <div className="nav-mobile-socials">
      <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <LinkedinIcon size={20} />
      </a>
      <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <GithubIcon size={20} />
      </a>
      <a href="https://instagram.com/your-username" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <InstagramIcon size={20} />
      </a>
    </div>
  </div>
</nav>
      {/* HERO */}
      <section className="hero" id="about">
        <div className="hero-glow" />
        <div className="hero-glow2" />
        <div className="hero-container">
          <div className="hero-content">
            {/* <div className="hero-tag fade-up fade-up-1">
              Available for new opportuni
            </div> */}
            <h1>
              <span className="name fade-up fade-up-2">Albin Joy</span>
              <span className="role fade-up fade-up-3">AI/ML Engineer.</span>
            </h1>
            <p className="hero-desc fade-up fade-up-4">
              I build intelligent systems at the intersection of <strong style={{ color: "var(--accent2)" }}>deep learning</strong>, scalable infrastructure, and real-world product impact.
            </p>
            <div 
              className="hero-actions fade-up fade-up-5"
              onAnimationEnd={(e) => {
                e.currentTarget.classList.remove("fade-up", "fade-up-5");
              }}
            >
              <a href="#projects" className="btn-primary">
                <span className="btn-skew-bg"></span>
                <span>View my work</span>
              </a>
              <a href="#contact" className="btn-secondary">
                <span>↓</span> My Resume
              </a>
            </div>
            {/* 
            <div className="hero-stats fade-up fade-up-5">
              {[
                { n: "5+", l: "Years experience" },
                { n: "20+", l: "Models shipped" },
                { n: "3", l: "Papers published" },
              ].map(({ n, l }) => (
                <div key={l}>
                  <div className="stat-num">{n}<span>_</span></div>
                  <div className="stat-label">{l}</div>
                </div>
              ))}
            </div> 
            */}
          </div>
          <div className="hero-image fade-up fade-up-4">
            <div className="hero-image-circle">
              <img src="/IMG_1844.PNG" alt="Albin Joy" />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT EXTENDED */}
      <section className="about">
        <div className="section-header scroll-reveal">
          <div className="section-tag">About me</div>
          <h2 className="section-title">Turning data<br />into decisions.</h2>
        </div>
        <div className="about-grid">
          <div className="scroll-reveal">
            <div className="about-card">
              <p> I'm currently working as an AI Engineer with a strong focus on Artificial Intelligence, Machine Learning, and Generative AI. I enjoy building intelligent applications, solving real-world problems, and developing AI-powered solutions using modern technologies. </p>
              <p> I have experience across the AI development lifecycle, from data preprocessing and model development to building LLM-based applications, RAG systems, and AI agents. I work with PyTorch, TensorFlow, Hugging Face, LangChain, and LangGraph to create scalable and efficient AI solutions. </p>
              <p> I've developed projects including AI-powered applications, retail demand forecasting, computer vision systems, and intelligent automation solutions. I'm passionate about continuous learning, innovation, and building impactful AI solutions. </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="projects" id="projects">
        <div className="section-header">
          <div className="section-tag">Selected work</div>
          <h2 className="section-title">Future Ready<br />Builds.</h2>
        </div>
        <div className="projects-grid">
          {projects.map((p, index) => (
            <ProjectCard 
              key={p.number} 
              project={p} 
              index={index}
              onClick={() => setActiveProjectModal(p)}
            />
          ))}
        </div>
      </section>

      {activeProjectModal && createPortal(
        <div 
          className="project-modal-overlay"
          onClick={() => setActiveProjectModal(null)}
          onAnimationEnd={(e) => {
            e.currentTarget.style.animation = "none";
          }}
        >
          <div 
            className="project-modal-card"
            onClick={(e) => e.stopPropagation()}
            onAnimationEnd={(e) => {
              e.currentTarget.style.animation = "none";
            }}
          >
            <button 
              className="project-modal-close"
              onClick={() => setActiveProjectModal(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
            
            <div className="project-modal-header">
              <div className="project-modal-meta">
                <span className="project-modal-number">{activeProjectModal.number}</span>
                <span className="project-modal-tag">{activeProjectModal.tag}</span>
              </div>
              <h2 className="project-modal-title">{activeProjectModal.title}</h2>
            </div>

            <div className="project-modal-body">
              <p className="project-modal-desc">{activeProjectModal.desc}</p>
              
              {activeProjectModal.stack && activeProjectModal.stack.length > 0 && (
                <div className="project-modal-stack-section">
                  <div className="project-modal-stack-title">Technologies Used</div>
                  <div className="project-modal-stack-tags">
                    {activeProjectModal.stack.map((s) => (
                      <span key={s} className="stack-chip">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="project-modal-footer">
              <a 
                href="#" 
                className="project-modal-link-btn"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Launch Application <span>→</span>
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* SKILLS */}
      <section
        className={`skills${skillsVisible ? " skills-visible" : ""}`}
        id="skills"
        ref={skillsRef}
      >
        <div className="section-header">
          <div className="section-tag">Capabilities</div>
          <h2 className="section-title">Skills &<br />expertise.</h2>
        </div>
        <div className="skills-categories">
          {skillGroups.map((group, index) => (
            <div key={group.title} className="skill-group scroll-reveal" style={{ transitionDelay: `${index * 0.12}s` }}>
              <div className="skill-group-header">
                <div className="skill-group-icon" aria-hidden="true">
                  {group.icon}
                </div>
                <h4>{group.title}</h4>
              </div>
              <div className="skills-tiles">
                {group.skills.map((skill) => (
                  <div key={skill} className="skill-tile">
                    <div className="skill-tile-icon">
                      <SkillIcon name={skill} />
                    </div>
                    <span className="skill-tile-name">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="experience" id="experience">
        <div className="section-header">
          <div className="section-tag">Career</div>
          <h2 className="section-title">Where I've<br />worked.</h2>
        </div>
        <div className="timeline">
          {experiences.map((e, index) => (
            <TimelineItem 
              key={e.company + e.title} 
              item={e} 
              index={index}
              isExpanded={expandedExperience === index}
              onToggle={() => setExpandedExperience(expandedExperience === index ? null : index)}
            />
          ))}
        </div>
      </section>

      {/* EDUCATION */}
      <section className="experience" id="education">
        <div className="section-header">
          <div className="section-tag">Academics</div>
          <h2 className="section-title">Where I've<br />studied.</h2>
        </div>
        <div className="timeline">
          {education.map((e, index) => (
            <TimelineItem 
              key={e.company + e.title} 
              item={e} 
              index={index}
              isExpanded={expandedEducation === index}
              onToggle={() => setExpandedEducation(expandedEducation === index ? null : index)}
            />
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <div className="contact-inner">
          <div className="section-tag">Get in touch</div>
          <h2 className="contact-lead">Let's Connect !</h2>
          <form onSubmit={handleFormSubmit} className="contact-form">
            <div className="form-row">
              <div className="field-group">
                <label className="field-label">Name</label>
                <input 
                  className="field-input" 
                  type="text" 
                  placeholder="Your Name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="field-group">
                <label className="field-label">Email</label>
                <input 
                  className="field-input" 
                  type="email" 
                  placeholder="email@company.com" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                />
                {emailError && <span className="field-error">{emailError}</span>}
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Content</label>
              <textarea 
                className="field-textarea" 
                placeholder="Let's cook something..." 
                name="message" 
                value={formData.message} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <button type="submit" disabled={isSending} className="form-submit">
              {isSending ? "Sending..." : "Send message →"}
            </button>
            {sendResult === "success" && (
              <div className="form-status success">
                ✓ Message sent successfully! I'll get back to you soon.
              </div>
            )}
            {sendResult === "error" && (
              <div className="form-status error">
                ✗ Failed to send message. Please check config or email directly.
              </div>
            )}
          </form>

        </div>
      </section>

      <footer>
        <p>© 2026 Albin Joy — Built with React</p>
        <div className="footer-socials">
          <a href="https://www.linkedin.com/in/albin-joy-110b6b351" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <LinkedinIcon size={16} />
          </a>
          <a href="https://github.com/albwn4743" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <GithubIcon size={16} />
          </a>
        </div>
      </footer>
      {showSuccessModal && (
        <div className="contact-modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="contact-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="contact-modal-icon">✓</div>
            <h3>Message Sent!</h3>
            <p>Thank you for reaching out. Albin Joy will get back to you soon.</p>
            <button className="contact-modal-btn" onClick={() => setShowSuccessModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
