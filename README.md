# Albin Joy - AI/ML Engineer Portfolio

A premium, highly interactive portfolio website for Albin Joy (AI/ML Engineer), featuring:
- **Responsive Loader**: Glowing rotating neon rings and loading message logs.
- **Interactive 3D Canvas**: Performance-optimized particle simulation system responsive to mouse sweeps.
- **About Section**: Professional profile details describing AI development lifecycles, ML pipeline models, and scalable tools.
- **Projects Showcase**: Interactive cards showcasing future-ready AI models and automation projects.
- **Education & Experience Timeline**: Interactive collapsible details of work history and academic background with official padding-optimized logos.
- **Capabilities Matrix**: Staggered fade-in tiles displaying skills and expertise.
- **Direct Connect**: Beautiful interactive form with success/error verification overlays.

## Technologies Used
- **Core**: React, Javascript, Vanilla CSS
- **Bundler**: Vite
- **Integrations**: EmailJS (Form sending), Lucide-React (Icons)
- **APIs & Observers**: IntersectionObserver (scroll reveals and active navbar highlighting)

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root directory and add your EmailJS configuration:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```
3. Start the local server:
   ```bash
   npm run dev
   ```
