import{r as s,j as e}from"./vendor-core-CFw98Jpq.js";import{l as w}from"./index-CQI9lRDL.js";import{a as f}from"./firebase-SwXpYWGj.js";import{R as j,s as k}from"./vendor-firebase-y3QPoY5d.js";import{u as v}from"./vendor-router-wGrc2b_U.js";import{X as y,M as N}from"./vendor-lucide-DwXPRU3z.js";const D=()=>{const[i,x]=s.useState(""),o=v(),[c,u]=s.useState(!1),[h,d]=s.useState(null),[p,a]=s.useState(!1);s.useEffect(()=>{const t=localStorage.getItem("user_mobile")||localStorage.getItem("temp_mobile")||"";t&&x(t),localStorage.getItem("auth_flow")!=="register"&&localStorage.setItem("auth_flow","login");const r=new j(f,"recaptcha-container",{size:"invisible",callback:l=>{}});return window.recaptchaVerifier=r,()=>{if(r){try{r.clear()}catch(l){console.error("Error clearing recaptcha verifier:",l)}window.recaptchaVerifier=null}}},[]);const m=t=>{const n=t.target.value.replace(/\D/g,"");n.length<=10&&(x(n),d(null))},g=i.length!==10,b=async()=>{if(g)return;u(!0),d(null);const t="+91"+i;try{if(i==="9876543210"){window.confirmationResult={confirm:async l=>{if(l!=="123456")throw new Error("Firebase: Error (auth/invalid-verification-code).");return{user:{getIdToken:async()=>"MOCK_TOKEN_9876543210"}}}},localStorage.setItem("temp_mobile",i),o("/otp");return}const n=window.recaptchaVerifier,r=await k(f,t,n);window.confirmationResult=r,localStorage.setItem("temp_mobile",i),o("/otp")}catch(n){console.error("Firebase Auth Error:",n),d(n.message||"Failed to send OTP. Please try again."),window.recaptchaVerifier&&window.recaptchaVerifier.render().then(r=>{window.grecaptcha&&window.grecaptcha.reset(r)})}finally{u(!1)}};return e.jsxs("div",{className:"leadnius-auth-wrapper",children:[e.jsx("header",{className:"topbar",children:e.jsxs("div",{className:"topbar-inner",children:[e.jsx("div",{onClick:()=>o("/"),className:"header-logo-container",children:e.jsx("img",{src:w,alt:"QUZO",className:"header-logo-img"})}),e.jsxs("nav",{className:`nav-links ${p?"open":""}`,children:[e.jsx("a",{href:"#home",onClick:t=>{t.preventDefault(),o("/"),a(!1)},children:"Home"}),e.jsx("a",{href:"/how-it-works",onClick:t=>{t.preventDefault(),o("/how-it-works"),a(!1)},children:"How it works"}),e.jsx("a",{href:"/home-choice",onClick:t=>{t.preventDefault(),o("/home-choice"),a(!1)},children:"Contests"}),e.jsx("a",{href:"#faq",onClick:t=>{t.preventDefault(),o("/"),a(!1)},children:"FAQ"})]}),e.jsxs("div",{className:"header-actions",children:[e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"secondary-btn desktop-only",style:{padding:"10px 18px",borderRadius:"12px",fontSize:"14px"},onClick:()=>o("/register"),children:"Signup"}),e.jsx("button",{className:"login-btn desktop-only",onClick:()=>o("/login"),children:"Login"})]}),e.jsx("button",{className:"menu-toggle",onClick:()=>a(!p),children:p?e.jsx(y,{size:24}):e.jsx(N,{size:24})})]})]})}),e.jsx("main",{className:"auth-main-content",children:e.jsxs("div",{className:"join-card",children:[e.jsx("h1",{className:"card-title",children:"Your Quzo Journey Starts Here"}),e.jsx("p",{className:"card-subtitle",children:"Get early access to live quizzes and join 50,000+ serious aspirants."}),e.jsxs("form",{onSubmit:t=>{t.preventDefault(),b()},className:"auth-form",children:[e.jsx("div",{className:`input-group ${i.length===10?"active":""}`,children:e.jsx("input",{type:"tel",placeholder:"Enter mobile number",value:i,onChange:m,disabled:c,autoFocus:!0})}),h&&e.jsx("div",{className:"error-text",children:h}),e.jsx("button",{type:"submit",className:"join-btn",disabled:g||c,children:c?"Sending...":"Join Now →"})]}),e.jsx("div",{id:"recaptcha-container"}),e.jsxs("p",{className:"footer-link",children:["Don't have an account? ",e.jsx("span",{className:"link-text",onClick:()=>{localStorage.setItem("auth_flow","register"),o("/register")},children:"Sign Up"})]})]})}),e.jsx("style",{children:`
        .leadnius-auth-wrapper {
          min-height: 100vh;
          background: white;
          display: flex;
          flex-direction: column;
          font-family: 'Lexend', sans-serif;
        }
        .auth-topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(255, 255, 255, 0.96);
          border-bottom: 1px solid #e2e8f0;
          width: 100%;
        }
        .topbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo-boxes { display: flex; gap: 8px; }
        .logo-box {
          width: 38px;
          height: 38px;
          background: #0c4a6e;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
        }
        .nav-links { display: flex; gap: 24px; }
        .nav-links a { color: #64748b; text-decoration: none; font-weight: 600; font-size: 14px; }
        .auth-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 100px 20px 40px;
        }
        .join-card {
          background: white;
          width: 100%;
          max-width: 480px;
          margin: auto;
          border-radius: 32px;
          padding: 40px 40px 48px;
          position: relative;
          text-align: center;
          box-shadow: none;
        }
        .close-btn { position: absolute; top: 24px; right: 24px; border: none; background: none; font-size: 24px; color: #94a3b8; cursor: pointer; }
        .mini-box { width: 38px; height: 38px; background: #0c4a6e; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; }
        .card-top-logo { display: flex; gap: 6px; justify-content: center; margin-bottom: 32px; }
        .card-title { color: #0f172a; font-size: 38px; font-weight: 850; letter-spacing: -1px; margin-bottom: 20px; }
        .card-subtitle { color: #64748b; font-size: 17px; margin-bottom: 40px; }
        .input-group { border: 2px solid #e2e8f0; border-radius: 16px; margin-bottom: 16px; overflow: hidden; }
        .input-group.active { border-color: #3b82f6; }
        .input-group input { 
          width: 100%; 
          padding: 18px 24px; 
          border: none; 
          outline: none; 
          font-size: 16px;
          color: #0f172a; /* Dark text for white background */
          background: transparent;
        }
        .join-btn { width: 100%; background: #404eed; color: white; border: none; padding: 18px; border-radius: 16px; font-size: 18px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
        .join-btn:hover { background: #3641c8; }
        .join-btn:disabled { background: #94a3b8; cursor: not-allowed; }
        .error-text { color: #ef4444; font-size: 13px; font-weight: 600; margin-bottom: 12px; text-align: center; }
        .footer-link { margin-top: 32px; color: #64748b; font-size: 14px; }
        .link-text { color: #1a56db; font-weight: 700; cursor: pointer; }

        @media (max-width: 768px) {
          .auth-main-content {
            padding-top: 80px;
          }
          .join-card {
            padding: 10px 20px 30px;
          }
          .card-title {
            font-size: 28px;
          }
        }
      `})]})};export{D as default};
