import{r as i,j as e}from"./vendor-core-CFw98Jpq.js";import{u as N}from"./vendor-router-wGrc2b_U.js";import{R as I}from"./vendor-lucide-DwXPRU3z.js";const P=()=>{const[s,m]=i.useState(["","","","","",""]),[h,a]=i.useState(""),[l,b]=i.useState(30),c=i.useRef([]),d=N(),g=localStorage.getItem("temp_mobile")||"8009799550",[u,f]=i.useState(!1);i.useEffect(()=>{let t=null;return l>0&&(t=setInterval(()=>b(o=>o-1),1e3)),()=>clearInterval(t)},[l]);const j=(t,o)=>{if(isNaN(o))return;const n=[...s];n[t]=o.substring(o.length-1),m(n),a(""),o&&t<5&&c.current[t+1].focus()},k=(t,o)=>{o.key==="Backspace"&&!s[t]&&t>0&&c.current[t-1].focus()},v=async()=>{var w;const t=s.join("");if(t.length<6){a("Please enter the full 6-digit code");return}f(!0),a("");const o=localStorage.getItem("auth_flow")||"login",n=localStorage.getItem("reg_name")||"";try{if(!window.confirmationResult)throw new Error("No pending verification found. Please go back to login.");const S=await(await window.confirmationResult.confirm(t)).user.getIdToken(),y=await fetch("/api/auth/verify-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:g,firebaseToken:S,flow:o,name:n})}),r=await y.json();if(r.success&&r.token){localStorage.setItem("play11_session",JSON.stringify({token:r.token,user:r.user})),localStorage.setItem("user_name",((w=r.user)==null?void 0:w.name)||"Scholar"),localStorage.setItem("user_mobile",g),localStorage.setItem("play11_user",JSON.stringify(r.user)),localStorage.removeItem("temp_mobile"),localStorage.removeItem("reg_name"),localStorage.removeItem("auth_flow");const x=localStorage.getItem("auth_redirect");x?(localStorage.removeItem("auth_redirect"),d(x)):r.isNewUser?d("/register"):d("/home-choice")}else a(r.error||"Invalid OTP. Please try again."),f(!1),(y.status===404||r.error&&(r.error.toLowerCase().includes("not found")||r.error.toLowerCase().includes("sign up")))&&(a("User Account not found. Redirecting to Sign Up..."),setTimeout(()=>{localStorage.setItem("auth_flow","register"),d("/register")},2e3))}catch(p){console.error("OTP Verify error:",p),a(p.message==="Firebase: Error (auth/invalid-verification-code)."?"Invalid OTP code. Please check and try again.":p.message),f(!1)}};return e.jsxs("div",{className:"leadnius-auth-wrapper",children:[e.jsx("main",{className:"auth-main-content",children:e.jsxs("div",{className:"join-card",children:[e.jsx("h1",{className:"card-title",children:"Securing Your Access"}),e.jsxs("p",{className:"card-subtitle",children:["Enter the 6-digit code sent to ",e.jsxs("strong",{children:["+91 ",g]})," to finalize your entry."]}),e.jsxs("form",{onSubmit:t=>{t.preventDefault(),v()},className:"auth-form",children:[e.jsx("div",{className:"otp-input-container",children:s.map((t,o)=>e.jsx("div",{className:`otp-slot ${t?"filled":""}`,children:e.jsx("input",{ref:n=>c.current[o]=n,type:"tel",maxLength:1,value:t,onChange:n=>j(o,n.target.value),onKeyDown:n=>k(o,n),disabled:u})},o))}),h&&e.jsx("div",{className:"error-text",children:h}),e.jsx("button",{type:"submit",className:"join-btn",disabled:u||s.join("").length<6,children:u?"Decrypting...":"Verify & Join →"})]}),e.jsx("div",{style:{marginTop:"24px"},children:l>0?e.jsxs("p",{className:"timer-text",children:["Resend code in ",e.jsxs("strong",{children:[l,"s"]})]}):e.jsxs("button",{className:"resend-btn",onClick:()=>{b(30),m(["","","","","",""]),c.current[0].focus()},children:[e.jsx(I,{size:16}),e.jsx("span",{children:"Resend Code"})]})})]})}),e.jsx("style",{children:`
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
          gap: 16px;
        }
        .logo-boxes { display: flex; gap: 8px; }
        .logo-box {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #0c4a6e;
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #fff;
          font-weight: 800;
          font-size: 14px;
        }
        .nav-links {
          display: flex;
          gap: 24px;
          color: #64748b;
          font-size: 14px;
        }
        .nav-links a { 
          color: inherit; 
          text-decoration: none; 
          font-weight: 600;
        }
        .nav-links a:hover { color: #0f172a; }
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
        .card-top-logo {
          display: flex;
          gap: 6px;
          justify-content: center;
          margin-bottom: 32px;
        }
        .mini-box {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #0c4a6e;
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #fff;
          font-weight: 900;
          font-size: 14px;
        }
        .card-title {
          color: #0f172a;
          font-size: 38px;
          font-weight: 850;
          line-height: 1.1;
          margin-bottom: 16px;
          letter-spacing: -1px;
        }
        .card-subtitle {
          color: #64748b;
          font-size: 16px;
          line-height: 1.5;
          margin-bottom: 32px;
        }
        .otp-input-container {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
          margin-bottom: 24px;
        }
        .otp-slot {
          aspect-ratio: 1;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s;
        }
        .otp-slot.filled {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }
        .otp-slot input {
          width: 100%;
          text-align: center;
          border: none;
          outline: none;
          font-size: 24px;
          font-weight: 800;
          color: #1e293b; /* Dark text for white background */
          background: transparent;
        }
        .join-btn {
          width: 100%;
          background: #404eed;
          color: white;
          border: none;
          padding: 18px;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
          box-shadow: 0 4px 14px rgba(64, 78, 237, 0.3);
        }
        .join-btn:hover { background: #3641c8; transform: translateY(-1px); }
        .join-btn:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; transform: none; }
        .error-text {
          color: #ef4444;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
          text-align: center;
        }
        .timer-text { color: #64748b; font-size: 14px; font-weight: 500; }
        .resend-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 auto;
          background: transparent;
          border: none;
          color: #1a56db;
          font-weight: 700;
          cursor: pointer;
          font-size: 14px;
        }
        @media (max-width: 640px) {
          .nav-links { display: none; }
          .auth-main-content { padding-top: 80px; }
          .join-card { padding: 10px 20px 30px; }
          .card-title { font-size: 28px; }
        }
      `})]})};export{P as default};
