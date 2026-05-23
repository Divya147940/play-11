import{r as a,j as e}from"./vendor-core-754eFBWZ.js";import{u as w}from"./vendor-router-DpCHN5bO.js";import{R as k}from"./vendor-lucide-Czx_Sl3Z.js";const z=()=>{const[i,f]=a.useState(["","","","","",""]),[u,s]=a.useState(""),[l,h]=a.useState(30),c=a.useRef([]),d=w(),p=localStorage.getItem("temp_mobile")||"8009799550",[x,g]=a.useState(!1);a.useEffect(()=>{let t=null;return l>0&&(t=setInterval(()=>h(o=>o-1),1e3)),()=>clearInterval(t)},[l]);const b=(t,o)=>{if(isNaN(o))return;const r=[...i];r[t]=o.substring(o.length-1),f(r),s(""),o&&t<5&&c.current[t+1].focus()},y=(t,o)=>{o.key==="Backspace"&&!i[t]&&t>0&&c.current[t-1].focus()},j=async()=>{var o;const t=i.join("");if(t.length<6){s("Please enter the full 6-digit code");return}g(!0),s("");try{const n=await(await fetch("/api/auth/verify-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:p,otp_code:t})})).json();if(n.success&&n.token){localStorage.setItem("play11_session",JSON.stringify({token:n.token,user:n.user})),localStorage.setItem("user_name",((o=n.user)==null?void 0:o.name)||"Scholar"),localStorage.setItem("user_mobile",p),localStorage.setItem("play11_user",JSON.stringify(n.user)),localStorage.removeItem("temp_mobile");const m=localStorage.getItem("auth_redirect");m?(localStorage.removeItem("auth_redirect"),d(m)):n.isNewUser?d("/register"):d("/home-choice")}else s(n.error||"Invalid OTP. Please try again."),g(!1)}catch(r){console.error("OTP Verify error:",r),s("Network error. Please check your connection."),g(!1)}};return e.jsxs("div",{className:"leadnius-auth-wrapper",children:[e.jsx("main",{className:"auth-main-content",children:e.jsxs("div",{className:"join-card",children:[e.jsx("h1",{className:"card-title",children:"Securing Your Access"}),e.jsxs("p",{className:"card-subtitle",children:["Enter the 6-digit code sent to ",e.jsxs("strong",{children:["+91 ",p]})," to finalize your entry."]}),e.jsxs("form",{onSubmit:t=>{t.preventDefault(),j()},className:"auth-form",children:[e.jsx("div",{className:"otp-input-container",children:i.map((t,o)=>e.jsx("div",{className:`otp-slot ${t?"filled":""}`,children:e.jsx("input",{ref:r=>c.current[o]=r,type:"tel",maxLength:1,value:t,onChange:r=>b(o,r.target.value),onKeyDown:r=>y(o,r),disabled:x})},o))}),u&&e.jsx("div",{className:"error-text",children:u}),e.jsx("button",{type:"submit",className:"join-btn",disabled:x||i.join("").length<6,children:x?"Decrypting...":"Verify & Join →"})]}),e.jsx("div",{style:{marginTop:"24px"},children:l>0?e.jsxs("p",{className:"timer-text",children:["Resend code in ",e.jsxs("strong",{children:[l,"s"]})]}):e.jsxs("button",{className:"resend-btn",onClick:()=>{h(30),f(["","","","","",""]),c.current[0].focus()},children:[e.jsx(k,{size:16}),e.jsx("span",{children:"Resend Code"})]})})]})}),e.jsx("style",{children:`
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
      `})]})};export{z as default};
