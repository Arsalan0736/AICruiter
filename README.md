# 🤖 AI Recruiter

AI Recruiter is an intelligent, Next.js-based recruitment assistant that leverages AI to help streamline the hiring process — from candidate screening to interview assistance.

🚀 **Live Demo:** [ai-cruiter-ten.vercel.app](https://ai-cruiter-ten.vercel.app)

---

## 🧠 About the Project

AI Recruiter is designed to revolutionize how hiring happens. It integrates modern AI APIs with a fast, scalable frontend built on **Next.js 14**, delivering real-time, smart recruitment solutions.

Built with:
- ⚛️ **Next.js** for a high-performance React framework  
- 💾 **Supabase** for backend database and authentication  
- 🤖 **Vapi AI** & **OpenRouter API** for intelligent chatbot capabilities  
- ☁️ **Vercel** for fast and reliable deployment  

---

## 🛠️ Getting Started

### 1️⃣ Clone the Repository
git clone https://github.com/Arsalan0736/AICruiter.git  
cd AICruiter

### 2️⃣ Install Dependencies
npm install  
# or  
yarn install

### 3️⃣ Set Environment Variables
Create a `.env.local` file in the root directory and add:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url  
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key  
OPENROUTER_API_KEY=your_openrouter_api_key  
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_key  
NEXT_PUBLIC_HOST_URL=http://localhost:3000  

### 4️⃣ Run the Development Server
npm run dev  

Then open [http://localhost:3000](http://localhost:3000) in your browser 🚀  

---

## ⚙️ CI/CD Pipeline (Automated Deployment)

This project includes a **fully automated CI/CD pipeline** using **GitHub Actions** and **Vercel**.

Every time you push to the `main` branch:
- 🏗️ The project automatically builds on GitHub Actions  
- 🌍 Successfully built code is deployed to Vercel  

You can view build history under the **Actions** tab in GitHub.

---

## 📁 Folder Structure

AICruiter/  
├── app/              # Main app directory (Next.js App Router)  
├── components/       # Reusable UI components  
├── public/           # Static files and assets  
├── styles/           # CSS and Tailwind configuration  
├── .github/workflows # CI/CD workflow for deployment  
└── package.json      # Project dependencies and scripts  

---

## 📸 Preview

Experience AI-driven hiring like never before.  
Visit 👉 [ai-cruiter-ten.vercel.app](https://ai-cruiter-ten.vercel.app)

---

## 🧩 Learn More

- [Next.js Documentation](https://nextjs.org/docs) — explore Next.js features and API  
- [Supabase Docs](https://supabase.com/docs) — backend and authentication setup  
- [Vercel Deployment Guide](https://vercel.com/docs) — continuous deployment  
- [Vapi AI](https://vapi.ai) — conversational AI integrations  

---

## 💼 Author

👨‍💻 **Arsalan Makhajankar**  
🌐 [GitHub](https://github.com/Arsalan0736) | 🔗 [Live Project](https://ai-cruiter-ten.vercel.app)

---

## 🛡️ License

This project is licensed under the **MIT License** — feel free to use and modify it as you wish.

---

⭐ If you found this project helpful, don’t forget to **star the repo!**
