const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/SplashPage-Bd3dV4O5.js","assets/vendor-core-CFw98Jpq.js","assets/vendor-router-wGrc2b_U.js","assets/vendor-lucide-DwXPRU3z.js","assets/LandingPage-CMwgqo7L.js","assets/LoginPage-D7S8EG_L.js","assets/firebase-SwXpYWGj.js","assets/vendor-firebase-y3QPoY5d.js","assets/OtpPage-MGereIrd.js","assets/RegisterPage-BEhOTFLu.js","assets/HomeChoicePage-DLQ953QK.js","assets/QuizArenaPage-CwJ8xnUz.js","assets/StudyHomePage-DD6W0XdX.js","assets/StudyCategoryPage-C32zqKfy.js","assets/StudyQuizDetailPage-BZ7-pWnD.js","assets/StudyQuestionPage-eUIcGRQT.js","assets/StudyReviewPage-ujgJMFAR.js","assets/StudyResultPage-nB4BOsxF.js","assets/MatchListPage-DCUKhen8.js","assets/GameQuizDetailPage-DPdAjfwU.js","assets/GameQuestionPage-CcxWra3Y.js","assets/GameResultPage-DzF_I_D9.js","assets/GameReviewPage-B8QBUb7W.js","assets/ProfilePage-CBlcAeFC.js","assets/HistoryPage-BqQG52Ar.js","assets/ContestListPage-DhNPDfA8.js","assets/LeaderboardPage-CgA98PQK.js","assets/AdminDashboard-_kamVEPf.js","assets/vendor-tesseract-CF4-DoUn.js","assets/AdminLoginPage-C8UosASW.js","assets/MatchQuizRoom-Byh8QIjo.js","assets/LegalPage-CSFY6cNR.js","assets/HowItWorksPage-BFSxNe12.js","assets/BalancePage-GJx-4ybF.js","assets/VouchersPage-CeFe6J04.js","assets/QuizReviewPage-DPjmIrEM.js","assets/AboutUsPage-DogiqmAN.js","assets/SupportPage-YstzjlIC.js","assets/TransactionPage-M6vBVs6l.js"])))=>i.map(i=>d[i]);
import{r as a,j as e,R as q,c as V}from"./vendor-core-CFw98Jpq.js";import{u as S,a as N,B as Q,R as H,b as n,N as z}from"./vendor-router-wGrc2b_U.js";import{X as B,M as U,H as L,G as k,T,a as G,P as J,b as M,S as W,c as F,U as Y,L as Z,d as K,e as X}from"./vendor-lucide-DwXPRU3z.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))c(r);new MutationObserver(r=>{for(const h of r)if(h.type==="childList")for(const p of h.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&c(p)}).observe(document,{childList:!0,subtree:!0});function o(r){const h={};return r.integrity&&(h.integrity=r.integrity),r.referrerPolicy&&(h.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?h.credentials="include":r.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function c(r){if(r.ep)return;r.ep=!0;const h=o(r);fetch(r.href,h)}})();const ee="modulepreload",te=function(t){return"/"+t},A={},l=function(s,o,c){let r=Promise.resolve();if(o&&o.length>0){let p=function(m){return Promise.all(m.map(d=>Promise.resolve(d).then(b=>({status:"fulfilled",value:b}),b=>({status:"rejected",reason:b}))))};document.getElementsByTagName("link");const u=document.querySelector("meta[property=csp-nonce]"),j=(u==null?void 0:u.nonce)||(u==null?void 0:u.getAttribute("nonce"));r=p(o.map(m=>{if(m=te(m),m in A)return;A[m]=!0;const d=m.endsWith(".css"),b=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${b}`))return;const _=document.createElement("link");if(_.rel=d?"stylesheet":ee,d||(_.as="script"),_.crossOrigin="",_.href=m,j&&_.setAttribute("nonce",j),document.head.appendChild(_),d)return new Promise((C,$)=>{_.addEventListener("load",C),_.addEventListener("error",()=>$(new Error(`Unable to preload CSS for ${m}`)))})}))}function h(p){const u=new Event("vite:preloadError",{cancelable:!0});if(u.payload=p,window.dispatchEvent(u),!u.defaultPrevented)throw p}return r.then(p=>{for(const u of p||[])u.status==="rejected"&&h(u.reason);return s().catch(h)})},D="/assets/quzo%201-DSxhlcRc.jpeg",se=()=>{const[t,s]=a.useState(!1),[o,c]=a.useState(!1),[r,h]=a.useState(!1),p=S(),u=N();localStorage.getItem("user_mobile"),localStorage.getItem("user_name"),a.useEffect(()=>{const d=()=>c(window.scrollY>20);return window.addEventListener("scroll",d),()=>window.removeEventListener("scroll",d)},[]);const j=[{name:"Home",path:"/",icon:e.jsx(L,{size:18})},{name:"Quiz Arena",path:"/home-choice",icon:e.jsx(k,{size:18})},{name:"Leaderboard",path:"/leaderboard",icon:e.jsx(T,{size:18})}],m=d=>u.pathname===d;return e.jsxs("nav",{className:"topbar",children:[e.jsxs("div",{className:"topbar-inner",children:[e.jsx("div",{onClick:()=>p("/"),className:"header-logo-container",children:e.jsx("img",{src:D,alt:"QUZO",className:"header-logo-img"})}),e.jsx("div",{className:"desktop-nav",style:{display:"none"},children:j.map(d=>e.jsx("button",{onClick:()=>{d.path==="/home-choice"?p(d.path,{state:{tab:"All Rooms",reset:Date.now()}}):p(d.path)},className:`nav-link-btn ${m(d.path)?"active":""}`,children:d.name},d.path))}),e.jsx("button",{className:"menu-toggle",onClick:()=>s(!t),children:t?e.jsx(B,{size:24}):e.jsx(U,{size:24})})]}),t&&e.jsx("div",{className:"mobile-nav-overlay",children:e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:j.map(d=>e.jsxs("button",{onClick:()=>{d.path==="/home-choice"?p(d.path,{state:{tab:"All Rooms",reset:Date.now()}}):p(d.path),s(!1)},style:{background:m(d.path)?"rgba(59, 130, 246, 0.1)":"transparent",border:"none",padding:"1.25rem",borderRadius:"1.25rem",textAlign:"left",display:"flex",alignItems:"center",gap:"1rem",fontSize:"1.1rem",fontWeight:800,color:m(d.path)?"#38bdf8":"white"},children:[d.icon,d.name]},d.path))})}),e.jsx("style",{children:`
        @media (min-width: 961px) {
          .desktop-nav { display: flex !important; }
          .menu-toggle { display: none !important; }
        }
      `})]})},re=()=>{const t=S(),s=new Date().getFullYear();return e.jsxs("footer",{className:"site-footer",children:[e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:"footer-grid",children:[e.jsxs("div",{className:"footer-brand",children:[e.jsx("div",{onClick:()=>t("/"),className:"footer-logo-container",style:{cursor:"pointer",marginBottom:"1.25rem"},children:e.jsx("img",{src:D,alt:"QUZO",className:"footer-logo-img"})}),e.jsx("p",{className:"footer-desc",children:"The ultimate platform where knowledge meets competition. Master your academic goals and sports predictions in one elite arena."}),e.jsxs("div",{className:"social-row",children:[e.jsx("button",{className:"social-icon-btn",children:e.jsx(G,{size:18})}),e.jsx("button",{className:"social-icon-btn",children:e.jsx(J,{size:18})}),e.jsx("button",{className:"social-icon-btn",children:e.jsx(M,{size:18})}),e.jsx("button",{className:"social-icon-btn",children:e.jsx(k,{size:18})})]})]}),e.jsxs("div",{className:"footer-links-col",children:[e.jsx("h4",{children:"Explore Zones"}),e.jsxs("ul",{children:[e.jsx("li",{onClick:()=>t("/study-home"),children:"Study Arena"}),e.jsx("li",{onClick:()=>t("/quiz-arena/sport-zone"),children:"Game Arena"}),e.jsx("li",{onClick:()=>t("/history"),children:"History & Archives"})]})]}),e.jsxs("div",{className:"footer-links-col",children:[e.jsx("h4",{children:"Your Profile"}),e.jsxs("ul",{children:[e.jsx("li",{onClick:()=>t("/profile"),children:"Personal Stats"}),e.jsx("li",{onClick:()=>t("/login"),children:"Access Account"})]})]}),e.jsxs("div",{className:"footer-links-col",children:[e.jsx("h4",{children:"Company"}),e.jsxs("ul",{children:[e.jsx("li",{onClick:()=>t("/legal#privacy"),children:"Privacy Policy"}),e.jsx("li",{onClick:()=>t("/legal#refund"),children:"Refund Policy"}),e.jsx("li",{onClick:()=>t("/legal#terms"),children:"Terms of Use"}),e.jsx("li",{onClick:()=>t("/legal#refer"),children:"Refer & Earn"}),e.jsx("li",{onClick:()=>t("/legal#contact"),children:"Contact Us"}),e.jsx("li",{onClick:()=>t("/legal#disclaimer"),children:"Disclaimer"})]})]})]}),e.jsxs("div",{className:"footer-bottom-bar",children:[e.jsxs("div",{className:"copyright-flex",children:[e.jsx("div",{className:"spark-circle",children:e.jsx(W,{size:10,fill:"currentColor"})}),e.jsxs("span",{children:["© ",s," QUZO Global Arena. All Rights Reserved."]})]}),e.jsx("div",{className:"footer-info-tags",children:e.jsx("span",{children:"Secure Connection"})})]})]}),e.jsx("style",{children:`
        .footer-logo-container {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          height: 60px;
          width: 185px;
          transition: all 0.3s ease;
          margin-left: -40px;
        }
        
        .footer-logo-img {
          height: 140px;
          width: auto;
          object-fit: contain;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .site-footer {
          background: #0d1f3c; /* Navy Blue */
          color: #94a3b8;
          padding: 3.5rem 0 2rem;
          margin-top: 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        
        .footer-grid {
          display: grid;
          gap: 2.5rem;
          grid-template-columns: 1.5fr repeat(3, 1fr);
          margin-bottom: 3rem;
        }

        .footer-brand .footer-desc {
          color: #64748b;
          font-weight: 500;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          max-width: 320px;
        }

        .social-row { display: flex; gap: 0.75rem; }

        .social-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-icon-btn:hover { 
          background: rgba(255, 255, 255, 0.08);
          color: #38bdf8;
          transform: translateY(-3px);
        }

        .footer-links-col h4 {
          font-size: 0.95rem;
          font-weight: 800;
          margin-bottom: 1.25rem;
          color: #f8fafc;
          letter-spacing: 0.02em;
        }

        .footer-links-col ul { list-style: none; padding: 0; margin: 0; }
        
        .footer-links-col li {
          color: #64748b;
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 0.7rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .footer-links-col li:hover { color: #38bdf8; }

        .footer-bottom-bar {
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #475569;
        }

        .copyright-flex { display: flex; align-items: center; gap: 0.5rem; }
        
        .spark-circle {
          width: 20px; height: 20px;
          background: rgba(56, 189, 248, 0.1);
          color: #38bdf8;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer-info-tags { display: flex; gap: 1.5rem; }

        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 640px) {
          .site-footer { padding: 2.5rem 0 90px; }
          .footer-grid { 
            grid-template-columns: repeat(2, 1fr); 
            gap: 2rem 1rem; 
            margin-bottom: 2rem;
          }
          .footer-brand { 
            grid-column: 1 / -1; 
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .footer-logo-container { margin: 0 auto 1.25rem; }
          .social-row { justify-content: center; width: 100%; }
          .footer-brand .footer-desc { 
            margin-left: auto; 
            margin-right: auto;
            font-size: 0.85rem;
          }
          .footer-links-col h4 { margin-bottom: 1rem; font-size: 0.9rem; }
          .footer-links-col li { font-size: 0.8rem; margin-bottom: 0.6rem; }
          .footer-bottom-bar { 
            flex-direction: column; 
            text-align: center; 
            padding-top: 1.5rem;
            gap: 1.5rem;
          }
          .footer-info-tags { justify-content: center; width: 100%; }
        }
        @media (max-width: 480px) {
           .footer-grid { gap: 1.5rem 0.75rem; }
           .footer-links-col { padding: 0 5px; }
        }
      `})]})},oe=()=>{const t=S(),s=N(),o=[{id:"home",icon:e.jsx(L,{size:18}),label:"Home",path:"/"},{id:"activity",icon:e.jsx(F,{size:18}),label:"Quiz",path:"/home-choice"},{id:"winners",icon:e.jsx(T,{size:18}),label:"Winners",path:"/leaderboard"},{id:"profile",icon:e.jsx(Y,{size:18}),label:"Profile",path:"/profile"}],c=r=>s.pathname===r;return e.jsx("nav",{className:"floating-nav",children:o.map(r=>e.jsxs("button",{onClick:()=>{r.path==="/home-choice"?t(r.path,{state:{tab:"All Rooms",reset:Date.now()}}):t(r.path)},style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",background:"none",border:"none",cursor:"pointer",padding:"4px",position:"relative",color:c(r.path)?"hsl(var(--primary))":"hsl(var(--muted-foreground))",transition:"all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",transform:c(r.path)?"translateY(-2px) scale(1.05)":"none"},children:[e.jsx("div",{style:{position:"relative",zIndex:1,filter:c(r.path)?"drop-shadow(0 0 8px hsla(var(--primary), 0.5))":"none"},children:q.cloneElement(r.icon,{strokeWidth:c(r.path)?2.5:2})}),e.jsx("span",{style:{fontSize:"0.6rem",fontWeight:800,opacity:c(r.path)?1:.7,letterSpacing:"0.01em",textTransform:"uppercase"},children:r.label}),c(r.path)&&e.jsx("div",{style:{position:"absolute",top:"-5px",width:"4px",height:"4px",background:"hsl(var(--primary))",borderRadius:"50%",boxShadow:"0 0 10px hsl(var(--primary))"}})]},r.id))})},i=({children:t,hideHeader:s=!1,hideFooter:o=!1,hideBottomNav:c=!1,hideNav:r=!1})=>r?e.jsx(e.Fragment,{children:t}):e.jsxs("div",{className:"layout-wrapper",style:{display:"flex",flexDirection:"column",minHeight:"100vh",position:"relative"},children:[!s&&e.jsx(se,{}),e.jsx("main",{className:"main-content",style:{flex:1,display:"flex",flexDirection:"column"},children:t}),!c&&e.jsx(oe,{}),!o&&e.jsx(re,{})]});a.lazy(()=>l(()=>import("./SplashPage-Bd3dV4O5.js"),__vite__mapDeps([0,1,2,3])));const ae=a.lazy(()=>l(()=>import("./LandingPage-CMwgqo7L.js"),__vite__mapDeps([4,1,2,3]))),ne=a.lazy(()=>l(()=>import("./LoginPage-D7S8EG_L.js"),__vite__mapDeps([5,1,6,7,2,3]))),ie=a.lazy(()=>l(()=>import("./OtpPage-MGereIrd.js"),__vite__mapDeps([8,1,2,3]))),le=a.lazy(()=>l(()=>import("./RegisterPage-BEhOTFLu.js"),__vite__mapDeps([9,1,6,7,2,3]))),ce=a.lazy(()=>l(()=>import("./HomeChoicePage-DLQ953QK.js"),__vite__mapDeps([10,1,2,3]))),I=a.lazy(()=>l(()=>import("./QuizArenaPage-CwJ8xnUz.js"),__vite__mapDeps([11,1,2,3]))),de=a.lazy(()=>l(()=>import("./StudyHomePage-DD6W0XdX.js"),__vite__mapDeps([12,1,2,3]))),he=a.lazy(()=>l(()=>import("./StudyCategoryPage-C32zqKfy.js"),__vite__mapDeps([13,1,3,2]))),ue=a.lazy(()=>l(()=>import("./StudyQuizDetailPage-BZ7-pWnD.js"),__vite__mapDeps([14,1,2,3]))),me=a.lazy(()=>l(()=>import("./StudyQuestionPage-eUIcGRQT.js"),__vite__mapDeps([15,1,2,3]))),pe=a.lazy(()=>l(()=>import("./StudyReviewPage-ujgJMFAR.js"),__vite__mapDeps([16,1,2,3]))),ge=a.lazy(()=>l(()=>import("./StudyResultPage-nB4BOsxF.js"),__vite__mapDeps([17,1,2]))),xe=a.lazy(()=>l(()=>import("./MatchListPage-DCUKhen8.js"),__vite__mapDeps([18,1,3,2]))),fe=a.lazy(()=>l(()=>import("./GameQuizDetailPage-DPdAjfwU.js"),__vite__mapDeps([19,1,2,3]))),je=a.lazy(()=>l(()=>import("./GameQuestionPage-CcxWra3Y.js"),__vite__mapDeps([20,1,2,3]))),ye=a.lazy(()=>l(()=>import("./GameResultPage-DzF_I_D9.js"),__vite__mapDeps([21,1,2]))),_e=a.lazy(()=>l(()=>import("./GameReviewPage-B8QBUb7W.js"),__vite__mapDeps([22,1,2,3]))),ve=a.lazy(()=>l(()=>import("./ProfilePage-CBlcAeFC.js"),__vite__mapDeps([23,1,2,3]))),be=a.lazy(()=>l(()=>import("./HistoryPage-BqQG52Ar.js"),__vite__mapDeps([24,1,2,3]))),ze=a.lazy(()=>l(()=>import("./ContestListPage-DhNPDfA8.js"),__vite__mapDeps([25,1,2,3]))),R=a.lazy(()=>l(()=>import("./LeaderboardPage-CgA98PQK.js"),__vite__mapDeps([26,1,2,3]))),we=a.lazy(()=>l(()=>import("./AdminDashboard-_kamVEPf.js"),__vite__mapDeps([27,1,28,3,2]))),Pe=a.lazy(()=>l(()=>import("./AdminLoginPage-C8UosASW.js"),__vite__mapDeps([29,1,2,3]))),Se=a.lazy(()=>l(()=>import("./MatchQuizRoom-Byh8QIjo.js"),__vite__mapDeps([30,1,2,3]))),Ee=a.lazy(()=>l(()=>import("./LegalPage-CSFY6cNR.js"),__vite__mapDeps([31,1,2]))),Ae=a.lazy(()=>l(()=>import("./HowItWorksPage-BFSxNe12.js"),__vite__mapDeps([32,1,2,3]))),Ie=a.lazy(()=>l(()=>import("./BalancePage-GJx-4ybF.js"),__vite__mapDeps([33,1,2,3]))),Re=a.lazy(()=>l(()=>import("./VouchersPage-CeFe6J04.js"),__vite__mapDeps([34,1,2,3]))),Oe=a.lazy(()=>l(()=>import("./QuizReviewPage-DPjmIrEM.js"),__vite__mapDeps([35,1,2,3]))),Ne=a.lazy(()=>l(()=>import("./AboutUsPage-DogiqmAN.js"),__vite__mapDeps([36,1,2,3]))),Le=a.lazy(()=>l(()=>import("./SupportPage-YstzjlIC.js"),__vite__mapDeps([37,1,2,3]))),ke=a.lazy(()=>l(()=>import("./TransactionPage-M6vBVs6l.js"),__vite__mapDeps([38,1,2,3]))),Te=({children:t})=>localStorage.getItem("play11_admin_session")?t:e.jsx(z,{to:"/admin/login",replace:!0}),E=({children:t})=>{if(localStorage.getItem("play11_user")||localStorage.getItem("play11_session"))return t;const o=window.location.pathname;return localStorage.setItem("auth_redirect",o),localStorage.getItem("play11_has_account")==="true"?e.jsx(z,{to:"/login",replace:!0}):e.jsx(z,{to:"/register",replace:!0})},De=()=>{const t=S(),s=o=>{localStorage.setItem("auth_redirect",window.location.pathname),t(o==="login"?"/login":"/register")};return e.jsx("div",{style:{minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"4rem 1.5rem",fontFamily:"'Lexend', sans-serif"},children:e.jsxs("div",{className:"bento-card",style:{maxWidth:"480px",width:"100%",padding:"3rem 2rem",textAlign:"center",background:"white",border:"1px solid hsl(var(--card-border))",borderRadius:"2rem",boxShadow:"0 20px 40px rgba(0,0,0,0.02)",display:"flex",flexDirection:"column",alignItems:"center",gap:"1.5rem"},children:[e.jsx("div",{style:{width:"80px",height:"80px",borderRadius:"50%",background:"rgba(59, 130, 246, 0.05)",color:"hsl(var(--primary))",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(59, 130, 246, 0.1)"},children:e.jsx(Z,{size:36})}),e.jsxs("div",{children:[e.jsx("h2",{style:{fontSize:"1.8rem",fontWeight:900,color:"#0f172a",marginBottom:"0.75rem"},children:"Access Restricted"}),e.jsx("p",{style:{fontSize:"0.95rem",color:"#64748b",fontWeight:600,lineHeight:"1.5"},children:"You are not registered or logged in first. Please register or login to view your profile, leaderboard standings, and quiz activities!"})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",width:"100%",marginTop:"0.5rem"},children:[e.jsxs("button",{className:"btn-elite btn-elite-primary",style:{width:"100%",height:"56px",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem"},onClick:()=>s("register"),children:[e.jsx(K,{size:18})," Register Now (Signup)"]}),e.jsxs("button",{className:"btn-elite",style:{width:"100%",height:"56px",fontSize:"1rem",background:"white",border:"2px solid #e2e8f0",color:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",boxShadow:"none"},onClick:()=>s("login"),children:[e.jsx(X,{size:18})," Login to Account"]})]})]})})},v=({children:t})=>localStorage.getItem("play11_user")||localStorage.getItem("play11_session")?t:e.jsx(i,{children:e.jsx(De,{})}),Ce=()=>(a.useEffect(()=>{if(!localStorage.getItem("play11_guest_id")){const t="guest-"+Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15);localStorage.setItem("play11_guest_id",t)}},[]),e.jsx(Q,{children:e.jsxs("div",{className:"app-shell",style:{minHeight:"100vh",position:"relative"},children:[e.jsxs("div",{className:"mesh-bg-premium",children:[e.jsx("div",{className:"bg-blob blob-1"}),e.jsx("div",{className:"bg-blob blob-2"}),e.jsx("div",{className:"bg-blob blob-3"})]}),e.jsx(a.Suspense,{fallback:null,children:e.jsxs(H,{children:[e.jsx(n,{path:"/",element:e.jsx(i,{hideNav:!0,children:e.jsx(ae,{})})}),e.jsx(n,{path:"/login",element:e.jsx(i,{hideNav:!0,children:e.jsx(ne,{})})}),e.jsx(n,{path:"/otp",element:e.jsx(i,{hideNav:!0,children:e.jsx(ie,{})})}),e.jsx(n,{path:"/register",element:e.jsx(i,{hideNav:!0,children:e.jsx(le,{})})}),e.jsx(n,{path:"/home-choice",element:e.jsx(i,{children:e.jsx(ce,{})})}),e.jsx(n,{path:"/study-home",element:e.jsx(i,{children:e.jsx(de,{})})}),e.jsx(n,{path:"/quiz-arena/:zoneId",element:e.jsx(i,{children:e.jsx(I,{})})}),e.jsx(n,{path:"/study-arena",element:e.jsx(i,{children:e.jsx(I,{})})}),e.jsx(n,{path:"/game-home",element:e.jsx(z,{to:"/quiz-arena/sport-zone",replace:!0})}),e.jsx(n,{path:"/study-category/:id",element:e.jsx(i,{children:e.jsx(he,{})})}),e.jsx(n,{path:"/study-quiz-detail/:id",element:e.jsx(i,{children:e.jsx(ue,{})})}),e.jsx(n,{path:"/study-quiz-play/:id",element:e.jsx(E,{children:e.jsx(i,{hideNav:!0,children:e.jsx(me,{})})})}),e.jsx(n,{path:"/study-review/:id",element:e.jsx(i,{children:e.jsx(pe,{})})}),e.jsx(n,{path:"/study-result/:id",element:e.jsx(i,{children:e.jsx(ge,{})})}),e.jsx(n,{path:"/match-list",element:e.jsx(i,{children:e.jsx(xe,{})})}),e.jsx(n,{path:"/game-quiz-detail/:id",element:e.jsx(i,{children:e.jsx(fe,{})})}),e.jsx(n,{path:"/game-quiz-play/:id",element:e.jsx(E,{children:e.jsx(i,{hideNav:!0,children:e.jsx(je,{})})})}),e.jsx(n,{path:"/game-review/:id",element:e.jsx(i,{children:e.jsx(_e,{})})}),e.jsx(n,{path:"/game-result/:id",element:e.jsx(i,{children:e.jsx(ye,{})})}),e.jsx(n,{path:"/match-quiz-room/:id",element:e.jsx(E,{children:e.jsx(i,{children:e.jsx(Se,{})})})}),e.jsx(n,{path:"/contests",element:e.jsx(i,{children:e.jsx(ze,{})})}),e.jsx(n,{path:"/leaderboard",element:e.jsx(v,{children:e.jsx(i,{children:e.jsx(R,{})})})}),e.jsx(n,{path:"/leaderboard/:id",element:e.jsx(v,{children:e.jsx(i,{children:e.jsx(R,{})})})}),e.jsx(n,{path:"/profile",element:e.jsx(v,{children:e.jsx(i,{children:e.jsx(ve,{})})})}),e.jsx(n,{path:"/history",element:e.jsx(v,{children:e.jsx(i,{children:e.jsx(be,{})})})}),e.jsx(n,{path:"/balance",element:e.jsx(v,{children:e.jsx(i,{children:e.jsx(Ie,{})})})}),e.jsx(n,{path:"/vouchers",element:e.jsx(v,{children:e.jsx(i,{children:e.jsx(Re,{})})})}),e.jsx(n,{path:"/quiz-review/:id",element:e.jsx(i,{children:e.jsx(Oe,{})})}),e.jsx(n,{path:"/transaction/:type",element:e.jsx(v,{children:e.jsx(i,{children:e.jsx(ke,{})})})}),e.jsx(n,{path:"/admin/login",element:e.jsx(i,{hideNav:!0,children:e.jsx(Pe,{})})}),e.jsx(n,{path:"/admin",element:e.jsx(Te,{children:e.jsx(i,{hideNav:!0,children:e.jsx(we,{})})})}),e.jsx(n,{path:"/legal",element:e.jsx(i,{children:e.jsx(Ee,{})})}),e.jsx(n,{path:"/about",element:e.jsx(i,{children:e.jsx(Ne,{})})}),e.jsx(n,{path:"/support",element:e.jsx(i,{children:e.jsx(Le,{})})}),e.jsx(n,{path:"/how-it-works",element:e.jsx(i,{children:e.jsx(Ae,{})})}),e.jsx(n,{path:"*",element:e.jsx(z,{to:"/",replace:!0})})]})})]})})),g="/api",w={get(t){try{const s=sessionStorage.getItem(`play11_cache:${t}`);if(!s)return null;const{data:o,expiry:c}=JSON.parse(s);return Date.now()>c?(sessionStorage.removeItem(`play11_cache:${t}`),null):o}catch{return null}},set(t,s,o=6e4){try{sessionStorage.setItem(`play11_cache:${t}`,JSON.stringify({data:s,expiry:Date.now()+o}))}catch{}},invalidate(){try{Object.keys(sessionStorage).filter(t=>t.startsWith("play11_cache:")).forEach(t=>sessionStorage.removeItem(t))}catch{}}},P={store:new Map,get(t,s=8e3){const o=this.store.get(t);return o?Date.now()-o.timestamp>s?(this.store.delete(t),null):o.data:null},set(t,s){this.store.set(t,{data:s,timestamp:Date.now()})},invalidate(){this.store.clear()}},x=async(t,s={},o=8e3)=>{if((s.method||"GET").toUpperCase()!=="GET")return P.invalidate(),fetch(t,s);const r=s.headers?s.headers.Authorization:"",h=`${t}:${r||""}`,p=P.get(h,o);if(p)return{ok:!0,status:200,json:async()=>JSON.parse(JSON.stringify(p)),_fromCache:!0};const u=await fetch(t,s);if(u.ok){const j=u.clone();try{const m=await j.json();P.set(h,m)}catch{}}return u},y=()=>{const t=localStorage.getItem("play11_session")||localStorage.getItem("play11_admin_session");if(t)try{const s=JSON.parse(t);return{Authorization:`Bearer ${typeof s=="object"&&s.token||t}`}}catch{return{Authorization:`Bearer ${t}`}}return{}},f=async t=>{if(t.status===401)throw localStorage.removeItem("play11_session"),localStorage.removeItem("play11_admin_session"),new Error("Session expired. Please login again.");if(!t.ok){let o="API request failed";try{const c=await t.json();o=c.message||c.error||o}catch{}throw new Error(o)}const s=await t.json();return s.history||s.categories||s.quizzes||s.questions||s.quiz||s.user||s.stats||s.users||s},O={sendOtp:async t=>{const s=await x(`${g}/auth/send-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:t})});return f(s)},verifyOtp:async(t,s,o)=>{const c=await x(`${g}/auth/verify-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:t,otp_code:s,firebaseToken:o})}),r=await f(c);return r.token&&localStorage.setItem("play11_session",JSON.stringify({token:r.token,user:r.user})),r},updateProfile:async t=>{const s=await x(`${g}/auth/update-profile`,{method:"POST",headers:{"Content-Type":"application/json",...y()},body:JSON.stringify({name:t})});return f(s)},getHistory:async()=>{const t=await x(`${g}/auth/history`,{headers:{...y()}});return f(t)},logout:()=>{P.invalidate(),w.invalidate(),localStorage.removeItem("play11_session"),localStorage.removeItem("play11_admin_session")}},Be={getStudyCategories:async()=>{const t=await x(`${g}/categories/study`);return await f(t)},getGameCategories:async()=>{const t=await x(`${g}/categories/game`);return await f(t)},getQuizzesByZone:async t=>{const s=await x(`${g}/quizzes/zone/${t}`,{headers:{...y()}});return await f(s)},getAllQuizzes:async()=>{const t=await x(`${g}/quizzes`,{headers:{...y()}});return await f(t)},getJoinedQuizzes:async()=>{const t=await x(`${g}/quizzes/joined`,{headers:{...y()}});return await f(t)},getQuizzes:async t=>{const s=await x(`${g}/quizzes/category/${t}`);return await f(s)},getQuizById:async t=>{const s=await x(`${g}/quizzes/${t}`,{headers:{...y()}});return f(s)},getQuestions:async t=>{const s=await x(`${g}/quizzes/${t}/questions`,{headers:{...y()}});return f(s)},submitQuiz:async(t,s)=>{const o=await x(`${g}/quizzes/${t}/submit`,{method:"POST",headers:{"Content-Type":"application/json",...y()},body:JSON.stringify({answers:s})});return f(o)},registerQuiz:async t=>{const s=await x(`${g}/quizzes/${t}/register`,{method:"POST",headers:{"Content-Type":"application/json",...y()}});return f(s)}},Ue={getSetting:async t=>{const s=await x(`${g}/settings/${t}`);return f(s)},getBatchSettings:async(t=[])=>{const s="settings_batch_"+(t.length?t.sort().join(","):"all"),o=w.get(s);if(o)return{success:!0,settings:o};const c=t.length?`?keys=${t.join(",")}`:"",h=await(await fetch(`${g}/settings/batch${c}`)).json();return h.success&&w.set(s,h.settings,6e4),h},updateSetting:async(t,s)=>{const o=await x(`${g}/settings/update`,{method:"POST",headers:{"Content-Type":"application/json",...y()},body:JSON.stringify({key:t,value:s})});return w.invalidate(),f(o)}},$e=a.createContext(null),qe=({children:t})=>{const[s,o]=a.useState(null),[c,r]=a.useState(!0);a.useEffect(()=>{const u=localStorage.getItem("play11_session"),j=localStorage.getItem("play11_user");if(u&&j)try{o(JSON.parse(j))}catch(m){console.error("Session user parsing error",m),localStorage.removeItem("play11_user")}r(!1)},[]);const h=async(u,j)=>{const m=await O.verifyOtp(u,j);return m.success&&o(m.user),m},p=()=>{O.logout(),o(null)};return e.jsx($e.Provider,{value:{user:s,loading:c,login:h,logout:p},children:t})};V.createRoot(document.getElementById("root")).render(e.jsx(a.StrictMode,{children:e.jsx(qe,{children:e.jsx(Ce,{})})}));export{se as H,D as l,Be as q,Ue as s};
