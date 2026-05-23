import{r,j as e}from"./vendor-core-754eFBWZ.js";import{u as b}from"./vendor-router-DpCHN5bO.js";import{X as m,M as f}from"./vendor-lucide-Czx_Sl3Z.js";const v=()=>{const[t,u]=r.useState(""),o=b(),[l,d]=r.useState(!1),[p,s]=r.useState(null),[c,i]=r.useState(!1),h=n=>{const a=n.target.value.replace(/\D/g,"");a.length<=10&&(u(a),s(null))},x=t.length!==10,g=async()=>{if(!x){d(!0),s(null);try{const a=await(await fetch("/api/auth/send-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:t})})).json();a.success?(localStorage.setItem("temp_mobile",t),o("/otp")):s(a.error||"Failed to send OTP. Please try again.")}catch(n){console.error(n),s("Network error. Please check your connection.")}finally{d(!1)}}};return e.jsxs("div",{className:"leadnius-auth-wrapper",children:[e.jsx("header",{className:"topbar",children:e.jsxs("div",{className:"topbar-inner",children:[e.jsxs("div",{className:"logo-boxes",onClick:()=>o("/"),style:{cursor:"pointer"},children:[e.jsx("div",{className:"logo-box",children:"Q"}),e.jsx("div",{className:"logo-box",children:"U"}),e.jsx("div",{className:"logo-box",children:"Z"}),e.jsx("div",{className:"logo-box",children:"O"})]}),e.jsxs("nav",{className:`nav-links ${c?"open":""}`,children:[e.jsx("a",{href:"#home",onClick:n=>{n.preventDefault(),o("/"),i(!1)},children:"Home"}),e.jsx("a",{href:"/how-it-works",onClick:n=>{n.preventDefault(),o("/how-it-works"),i(!1)},children:"How it works"}),e.jsx("a",{href:"#contests",onClick:n=>{n.preventDefault(),o("/"),i(!1)},children:"Contests"}),e.jsx("a",{href:"#faq",onClick:n=>{n.preventDefault(),o("/"),i(!1)},children:"FAQ"})]}),e.jsxs("div",{className:"header-actions",children:[e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"secondary-btn desktop-only",style:{padding:"10px 18px",borderRadius:"12px",fontSize:"14px"},onClick:()=>o("/register"),children:"Signup"}),e.jsx("button",{className:"login-btn desktop-only",onClick:()=>o("/login"),children:"Login"})]}),e.jsx("button",{className:"menu-toggle",onClick:()=>i(!c),children:c?e.jsx(m,{size:24}):e.jsx(f,{size:24})})]})]})}),e.jsx("main",{className:"auth-main-content",children:e.jsxs("div",{className:"join-card",children:[e.jsx("h1",{className:"card-title",children:"Your Quzo Journey Starts Here"}),e.jsx("p",{className:"card-subtitle",children:"Get early access to live quizzes and join 50,000+ serious aspirants."}),e.jsxs("form",{onSubmit:n=>{n.preventDefault(),g()},className:"auth-form",children:[e.jsx("div",{className:`input-group ${t.length===10?"active":""}`,children:e.jsx("input",{type:"tel",placeholder:"Enter mobile number",value:t,onChange:h,disabled:l,autoFocus:!0})}),p&&e.jsx("div",{className:"error-text",children:p}),e.jsx("button",{type:"submit",className:"join-btn",disabled:x||l,children:l?"Sending...":"Join Now →"})]}),e.jsxs("p",{className:"footer-link",children:["Already a member? ",e.jsx("span",{className:"link-text",onClick:()=>o("/register"),children:"Sign In"})]})]})}),e.jsx("style",{children:`
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
      `})]})};export{v as default};
