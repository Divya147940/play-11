import{r as p,R as k,j as e}from"./vendor-core-CFw98Jpq.js";import{l as j}from"./index-CQI9lRDL.js";import{a as f}from"./firebase-SwXpYWGj.js";import{R as v,s as y}from"./vendor-firebase-y3QPoY5d.js";import{u as N}from"./vendor-router-wGrc2b_U.js";import{X as S,M as z,U as C,P as I,a as E,C as _,B as P,f as R,A as D}from"./vendor-lucide-DwXPRU3z.js";const B=()=>{const i=N(),[r,m]=p.useState({name:"",mobile:"",email:"",dob:"",profession:"",isEighteenPlus:!1}),[s,x]=p.useState(!1),[g,t]=p.useState(""),[h,l]=p.useState(!1);k.useEffect(()=>{const o=localStorage.getItem("temp_mobile")||"";o&&m(a=>({...a,mobile:o}));const n=new v(f,"recaptcha-container",{size:"invisible",callback:a=>{}});return window.recaptchaVerifier=n,()=>{if(n){try{n.clear()}catch(a){console.error("Error clearing recaptcha verifier:",a)}window.recaptchaVerifier=null}}},[]);const c=o=>{const{name:n,value:a,type:d,checked:u}=o.target;m(w=>({...w,[n]:d==="checkbox"?u:a})),t("")},b=async o=>{if(o.preventDefault(),!r.name.trim())return t("Please enter your full name");if(r.mobile.length!==10)return t("Please enter a valid 10-digit mobile number");if(!r.email.includes("@"))return t("Please enter a valid email address");if(!r.dob)return t("Please select your date of birth");if(!r.profession)return t("Please select your profession");if(!r.isEighteenPlus)return t("You must be 18+ to join");x(!0),t("");const n="+91"+r.mobile;try{if(r.mobile==="9876543210"){window.confirmationResult={confirm:async u=>{if(u!=="123456")throw new Error("Firebase: Error (auth/invalid-verification-code).");return{user:{getIdToken:async()=>"MOCK_TOKEN_9876543210"}}}},localStorage.setItem("reg_name",r.name),localStorage.setItem("temp_mobile",r.mobile),localStorage.setItem("user_name",r.name),localStorage.setItem("user_mobile",r.mobile),localStorage.setItem("user_profession",r.profession),localStorage.setItem("play11_has_account","true"),localStorage.setItem("auth_flow","register"),i("/otp");return}const a=window.recaptchaVerifier,d=await y(f,n,a);window.confirmationResult=d,localStorage.setItem("reg_name",r.name),localStorage.setItem("temp_mobile",r.mobile),localStorage.setItem("user_name",r.name),localStorage.setItem("user_mobile",r.mobile),localStorage.setItem("user_profession",r.profession),localStorage.setItem("play11_has_account","true"),localStorage.setItem("auth_flow","register"),i("/otp")}catch(a){console.error("Firebase Auth Error:",a),t(a.message||"Registration failed. Please try again."),window.recaptchaVerifier&&window.recaptchaVerifier.render().then(d=>{window.grecaptcha&&window.grecaptcha.reset(d)})}finally{x(!1)}};return e.jsxs("div",{className:"register-wrapper",children:[e.jsx("header",{className:"topbar",style:{zIndex:100},children:e.jsxs("div",{className:"topbar-inner",children:[e.jsx("div",{onClick:()=>i("/"),className:"header-logo-container",children:e.jsx("img",{src:j,alt:"QUZO",className:"header-logo-img"})}),e.jsxs("nav",{className:`nav-links ${h?"open":""}`,children:[e.jsx("a",{href:"#home",onClick:o=>{o.preventDefault(),i("/"),l(!1)},children:"Home"}),e.jsx("a",{href:"/how-it-works",onClick:o=>{o.preventDefault(),i("/how-it-works"),l(!1)},children:"How it works"}),e.jsx("a",{href:"/home-choice",onClick:o=>{o.preventDefault(),i("/home-choice"),l(!1)},children:"Contests"}),e.jsx("a",{href:"#faq",onClick:o=>{o.preventDefault(),i("/"),l(!1)},children:"FAQ"})]}),e.jsxs("div",{className:"header-actions",children:[e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"secondary-btn desktop-only",style:{padding:"10px 18px",borderRadius:"12px",fontSize:"14px",background:"rgba(255, 255, 255, 0.1)",color:"white",border:"1px solid rgba(255, 255, 255, 0.2)"},onClick:()=>i("/register"),children:"Signup"}),e.jsx("button",{className:"login-btn desktop-only",style:{background:"#3b82f6",color:"white",padding:"10px 24px",borderRadius:"12px",fontWeight:700,border:"none"},onClick:()=>i("/login"),children:"Login"})]}),e.jsx("button",{className:"menu-toggle",style:{background:"none",border:"none",color:"white"},onClick:()=>l(!h),children:h?e.jsx(S,{size:24}):e.jsx(z,{size:24})})]})]})}),e.jsxs("div",{className:"auth-mesh-bg",children:[e.jsx("div",{className:"auth-blob auth-blob-1"}),e.jsx("div",{className:"auth-blob auth-blob-2"})]}),e.jsx("div",{className:"auth-container",children:e.jsxs("div",{className:"registration-card animate-slide-up",children:[e.jsxs("div",{className:"card-header",children:[e.jsx("h1",{className:"card-title",children:"Your Quzo Journey Starts Here"}),e.jsx("p",{className:"card-subtitle",children:"Get early access to live quizzes and join 50,000+ serious aspirants."})]}),e.jsxs("form",{onSubmit:b,className:"register-form",children:[e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"input-group",children:[e.jsxs("label",{children:[e.jsx(C,{size:16})," Candidate Name"]}),e.jsx("input",{type:"text",name:"name",placeholder:"Enter full name",value:r.name,onChange:c,disabled:s})]}),e.jsxs("div",{className:"input-group",children:[e.jsxs("label",{children:[e.jsx(I,{size:16})," Mobile Number"]}),e.jsxs("div",{className:"mobile-input-wrapper",children:[e.jsx("span",{className:"prefix",children:"+91"}),e.jsx("input",{type:"tel",name:"mobile",placeholder:"Enter 10-digit number",value:r.mobile,onChange:o=>{const n=o.target.value.replace(/\D/g,"").slice(0,10);m(a=>({...a,mobile:n}))},disabled:s})]})]}),e.jsxs("div",{className:"input-group",children:[e.jsxs("label",{children:[e.jsx(E,{size:16})," Mail ID"]}),e.jsx("input",{type:"email",name:"email",placeholder:"name@example.com",value:r.email,onChange:c,disabled:s})]}),e.jsxs("div",{className:"input-group",children:[e.jsxs("label",{children:[e.jsx(_,{size:16})," Date of Birth"]}),e.jsx("input",{type:"date",name:"dob",value:r.dob,onChange:c,disabled:s,className:"date-input"})]}),e.jsxs("div",{className:"input-group full-width",children:[e.jsxs("label",{children:[e.jsx(P,{size:16})," Profession"]}),e.jsxs("select",{name:"profession",value:r.profession,onChange:c,disabled:s,className:"profession-select",children:[e.jsx("option",{value:"",disabled:!0,children:"Select your profession"}),e.jsx("option",{value:"College Student",children:"College Student"}),e.jsx("option",{value:"Government Employee",children:"Government Employee"}),e.jsx("option",{value:"Salaried",children:"Salaried"})]})]})]}),e.jsxs("div",{className:"verification-row",children:[e.jsxs("label",{className:"checkbox-container",children:[e.jsx("input",{type:"checkbox",name:"isEighteenPlus",checked:r.isEighteenPlus,onChange:c,disabled:s}),e.jsx("span",{className:"checkmark"}),e.jsx("span",{className:"checkbox-text",children:"I confirm that I am 18 years or older"})]}),e.jsxs("div",{className:"age-notice",children:[e.jsx(R,{size:14})," You must be 18+ only can login"]})]}),g&&e.jsx("div",{className:"error-message animate-fade-in",children:g}),e.jsx("button",{type:"submit",className:"submit-btn",disabled:s,children:s?e.jsx("span",{className:"loader"}):e.jsxs(e.Fragment,{children:["Join Now ",e.jsx(D,{size:20})]})})]}),e.jsx("div",{id:"recaptcha-container"}),e.jsxs("p",{className:"footer-text",children:["Already a member? ",e.jsx("span",{className:"link",onClick:()=>i("/login"),children:"Sign In"})]})]})}),e.jsx("style",{children:`
        .register-wrapper {
          min-height: 100vh;
          background: white;
          display: flex;
          flex-direction: column;
          padding: 100px 24px 40px;
          font-family: 'Lexend', 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .auth-container {
          width: 100%;
          display: flex;
          justify-content: center;
          margin: auto;
        }

        .auth-mesh-bg {
          display: none;
        }

        .auth-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.15;
          animation: morph-blob 20s infinite alternate ease-in-out;
        }

        .auth-blob-1 {
          width: 60vw;
          height: 60vw;
          background: #404eed;
          top: -20%;
          left: -10%;
        }

        .auth-blob-2 {
          width: 50vw;
          height: 50vw;
          background: #0369a1;
          bottom: -15%;
          right: -5%;
          animation-delay: -5s;
        }

        @keyframes morph-blob {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.1) translate(5%, 5%); }
        }

        .registration-card {
          width: 100%;
          max-width: 540px;
          background: white;
          border-radius: 32px;
          padding: 30px 40px 50px;
          position: relative;
          z-index: 10;
          box-shadow: none;
        }

        .close-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: #0d121f;
        }

        .card-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo-boxes {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 24px;
        }

        .logo-box {
          width: 42px;
          height: 42px;
          background: #0c4a6e;
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 16px;
        }

        .card-title {
          font-size: 32px;
          font-weight: 850;
          color: #0f172a;
          letter-spacing: -1px;
          line-height: 1.1;
          margin-bottom: 12px;
        }

        .card-subtitle {
          color: #64748b;
          font-size: 16px;
          font-weight: 500;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .full-width {
          grid-column: span 2;
        }

        .input-group label {
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .input-group input, 
        .input-group select {
          padding: 14px 18px;
          border: 2px solid #f1f5f9;
          border-radius: 12px;
          font-family: inherit;
          font-size: 15px;
          font-weight: 500;
          color: #0f172a;
          transition: all 0.2s;
          background: #f8fafc;
        }

        .input-group input:focus, 
        .input-group select:focus {
          outline: none;
          border-color: #404eed;
          background: white;
          box-shadow: 0 0 0 4px rgba(64, 78, 237, 0.1);
        }

        .mobile-input-wrapper {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 2px solid #f1f5f9;
          border-radius: 12px;
          overflow: hidden;
        }

        .prefix {
          padding: 0 14px;
          font-weight: 700;
          color: #64748b;
          border-right: 2px solid #f1f5f9;
        }

        .mobile-input-wrapper input {
          border: none !important;
          background: none !important;
          box-shadow: none !important;
          width: 100%;
        }

        .date-input {
          height: 100%;
        }

        .profession-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
        }

        .verification-row {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          position: relative;
          padding-left: 32px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          user-select: none;
        }

        .checkbox-container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 22px;
          width: 22px;
          background-color: #f1f5f9;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .checkbox-container:hover input ~ .checkmark {
          background-color: #e2e8f0;
        }

        .checkbox-container input:checked ~ .checkmark {
          background-color: #404eed;
          border-color: #404eed;
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        .checkbox-container input:checked ~ .checkmark:after {
          display: block;
        }

        .checkbox-container .checkmark:after {
          left: 6px;
          top: 2px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2.5px 2.5px 0;
          transform: rotate(45deg);
        }

        .age-notice {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
          padding: 8px 12px;
          border-radius: 8px;
          width: fit-content;
        }

        .error-message {
          color: #ef4444;
          font-size: 14px;
          font-weight: 700;
          text-align: center;
        }

        .submit-btn {
          margin-top: 10px;
          background: #404eed;
          color: white;
          border: none;
          padding: 18px;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 750;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 20px -5px rgba(64, 78, 237, 0.4);
        }

        .submit-btn:hover:not(:disabled) {
          background: #3641c8;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -10px rgba(64, 78, 237, 0.5);
        }

        .submit-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
        }

        .loader {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .footer-text {
          margin-top: 32px;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
        }

        .link {
          color: #404eed;
          font-weight: 800;
          cursor: pointer;
        }

        .link:hover {
          text-decoration: underline;
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slide-up {
          animation: slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @media (max-width: 640px) {
          .register-wrapper {
            padding-top: 80px;
          }
          .registration-card {
            padding: 10px 24px 30px;
            border-radius: 24px;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: span 1;
          }
          .card-title {
            font-size: 28px;
          }
        }
      `})]})};export{B as default};
