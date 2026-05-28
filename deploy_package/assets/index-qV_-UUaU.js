const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/SplashPage-tOhb27b4.js","assets/vendor-core-754eFBWZ.js","assets/vendor-router-DpCHN5bO.js","assets/vendor-lucide-R5TnQarU.js","assets/LandingPage-CuuuuFi9.js","assets/LoginPage-K40tzPg4.js","assets/OtpPage-BD4YrKdF.js","assets/RegisterPage-B7Mcb05V.js","assets/HomeChoicePage-Bnd-sbU8.js","assets/QuizArenaPage-Bx0vOXmW.js","assets/StudyHomePage-BmrCTwVv.js","assets/StudyCategoryPage-_8YqI5kr.js","assets/StudyQuizDetailPage-8yGS_ly3.js","assets/StudyQuestionPage-gppiSdP6.js","assets/StudyReviewPage-CWJ7YpyY.js","assets/StudyResultPage-CqPA455F.js","assets/MatchListPage-C9Ul1aTZ.js","assets/GameQuizDetailPage-C5-T8mua.js","assets/GameQuestionPage-BiGtHdMO.js","assets/GameResultPage-D4wVWfZz.js","assets/GameReviewPage-BrMQcoCm.js","assets/ProfilePage-s9KMJSGW.js","assets/HistoryPage-BuZ2CS2c.js","assets/ContestListPage-CyygDGwB.js","assets/LeaderboardPage-CwgyNvJD.js","assets/AdminDashboard-CQBo-KGW.js","assets/vendor-tesseract-DR4Ucv4Y.js","assets/AdminLoginPage-D7xmg1VH.js","assets/MatchQuizRoom-DUMcB8Up.js","assets/DummyQuizFlow-CjaFP7uE.js","assets/LegalPage-D2pMZzdn.js","assets/HowItWorksPage-DSwi5PBL.js","assets/BalancePage-BPK9JFfs.js","assets/VouchersPage-CY81vREa.js","assets/QuizReviewPage-DyZVegdc.js","assets/AboutUsPage-Dq9zKeMT.js","assets/SupportPage-CLNsKXjz.js","assets/TransactionPage-DJ-D5IQ5.js"])))=>i.map(i=>d[i]);
import{r as o,j as e,R as V,c as $}from"./vendor-core-754eFBWZ.js";import{u as P,a as N,B as q,R as Q,b as n,N as w}from"./vendor-router-DpCHN5bO.js";import{X as H,M as B,H as R,G as L,T as k,a as U,P as J,b as G,S as M,c as F,U as W}from"./vendor-lucide-R5TnQarU.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))c(r);new MutationObserver(r=>{for(const d of r)if(d.type==="childList")for(const p of d.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&c(p)}).observe(document,{childList:!0,subtree:!0});function a(r){const d={};return r.integrity&&(d.integrity=r.integrity),r.referrerPolicy&&(d.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?d.credentials="include":r.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function c(r){if(r.ep)return;r.ep=!0;const d=a(r);fetch(r.href,d)}})();const Y="modulepreload",Z=function(t){return"/"+t},S={},l=function(s,a,c){let r=Promise.resolve();if(a&&a.length>0){let p=function(u){return Promise.all(u.map(h=>Promise.resolve(h).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))};document.getElementsByTagName("link");const m=document.querySelector("meta[property=csp-nonce]"),f=(m==null?void 0:m.nonce)||(m==null?void 0:m.getAttribute("nonce"));r=p(a.map(u=>{if(u=Z(u),u in S)return;S[u]=!0;const h=u.endsWith(".css"),v=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${v}`))return;const _=document.createElement("link");if(_.rel=h?"stylesheet":Y,h||(_.as="script"),_.crossOrigin="",_.href=u,f&&_.setAttribute("nonce",f),document.head.appendChild(_),h)return new Promise((D,C)=>{_.addEventListener("load",D),_.addEventListener("error",()=>C(new Error(`Unable to preload CSS for ${u}`)))})}))}function d(p){const m=new Event("vite:preloadError",{cancelable:!0});if(m.payload=p,window.dispatchEvent(m),!m.defaultPrevented)throw p}return r.then(p=>{for(const m of p||[])m.status==="rejected"&&d(m.reason);return s().catch(d)})},T="/assets/quzo-DOFL_O3I.png",K=()=>{const[t,s]=o.useState(!1),[a,c]=o.useState(!1),[r,d]=o.useState(!1),p=P(),m=N();localStorage.getItem("user_mobile"),localStorage.getItem("user_name"),o.useEffect(()=>{const h=()=>c(window.scrollY>20);return window.addEventListener("scroll",h),()=>window.removeEventListener("scroll",h)},[]);const f=[{name:"Home",path:"/",icon:e.jsx(R,{size:18})},{name:"Quiz Arena",path:"/home-choice",icon:e.jsx(L,{size:18})},{name:"Leaderboard",path:"/leaderboard",icon:e.jsx(k,{size:18})}],u=h=>m.pathname===h;return e.jsxs("nav",{className:"topbar",children:[e.jsxs("div",{className:"topbar-inner",children:[e.jsx("div",{onClick:()=>p("/"),className:"header-logo-container",children:e.jsx("img",{src:T,alt:"QUZO",className:"header-logo-img"})}),e.jsx("div",{className:"desktop-nav",style:{display:"none"},children:f.map(h=>e.jsx("button",{onClick:()=>p(h.path),className:`nav-link-btn ${u(h.path)?"active":""}`,children:h.name},h.path))}),e.jsx("button",{className:"menu-toggle",onClick:()=>s(!t),children:t?e.jsx(H,{size:24}):e.jsx(B,{size:24})})]}),t&&e.jsx("div",{className:"mobile-nav-overlay",children:e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:f.map(h=>e.jsxs("button",{onClick:()=>{p(h.path),s(!1)},style:{background:u(h.path)?"rgba(59, 130, 246, 0.1)":"transparent",border:"none",padding:"1.25rem",borderRadius:"1.25rem",textAlign:"left",display:"flex",alignItems:"center",gap:"1rem",fontSize:"1.1rem",fontWeight:800,color:u(h.path)?"#38bdf8":"white"},children:[h.icon,h.name]},h.path))})}),e.jsx("style",{children:`
        @media (min-width: 961px) {
          .desktop-nav { display: flex !important; }
          .menu-toggle { display: none !important; }
        }
      `})]})},X=()=>{const t=P(),s=new Date().getFullYear();return e.jsxs("footer",{className:"site-footer",children:[e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:"footer-grid",children:[e.jsxs("div",{className:"footer-brand",children:[e.jsx("div",{onClick:()=>t("/"),className:"footer-logo-container",style:{cursor:"pointer",marginBottom:"1.25rem"},children:e.jsx("img",{src:T,alt:"QUZO",className:"footer-logo-img"})}),e.jsx("p",{className:"footer-desc",children:"The ultimate platform where knowledge meets competition. Master your academic goals and sports predictions in one elite arena."}),e.jsxs("div",{className:"social-row",children:[e.jsx("button",{className:"social-icon-btn",children:e.jsx(U,{size:18})}),e.jsx("button",{className:"social-icon-btn",children:e.jsx(J,{size:18})}),e.jsx("button",{className:"social-icon-btn",children:e.jsx(G,{size:18})}),e.jsx("button",{className:"social-icon-btn",children:e.jsx(L,{size:18})})]})]}),e.jsxs("div",{className:"footer-links-col",children:[e.jsx("h4",{children:"Explore Zones"}),e.jsxs("ul",{children:[e.jsx("li",{onClick:()=>t("/study-home"),children:"Study Arena"}),e.jsx("li",{onClick:()=>t("/game-home"),children:"Game Arena"}),e.jsx("li",{onClick:()=>t("/history"),children:"History & Archives"})]})]}),e.jsxs("div",{className:"footer-links-col",children:[e.jsx("h4",{children:"Your Profile"}),e.jsxs("ul",{children:[e.jsx("li",{onClick:()=>t("/profile"),children:"Personal Stats"}),e.jsx("li",{onClick:()=>t("/login"),children:"Access Account"})]})]}),e.jsxs("div",{className:"footer-links-col",children:[e.jsx("h4",{children:"Company"}),e.jsxs("ul",{children:[e.jsx("li",{onClick:()=>t("/legal#privacy"),children:"Privacy Policy"}),e.jsx("li",{onClick:()=>t("/legal#refund"),children:"Refund Policy"}),e.jsx("li",{onClick:()=>t("/legal#terms"),children:"Terms of Use"}),e.jsx("li",{onClick:()=>t("/legal#refer"),children:"Refer & Earn"}),e.jsx("li",{onClick:()=>t("/legal#contact"),children:"Contact Us"}),e.jsx("li",{onClick:()=>t("/legal#disclaimer"),children:"Disclaimer"})]})]})]}),e.jsxs("div",{className:"footer-bottom-bar",children:[e.jsxs("div",{className:"copyright-flex",children:[e.jsx("div",{className:"spark-circle",children:e.jsx(M,{size:10,fill:"currentColor"})}),e.jsxs("span",{children:["© ",s," QUZO Global Arena. All Rights Reserved."]})]}),e.jsx("div",{className:"footer-info-tags",children:e.jsx("span",{children:"Secure Connection"})})]})]}),e.jsx("style",{children:`
        .footer-logo-container {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          height: 72px;
          width: 250px;
          transition: all 0.3s ease;
          margin-left: -40px;
        }
        
        .footer-logo-img {
          height: 170px;
          width: auto;
          object-fit: contain;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .site-footer {
          background: #020617; /* Deep Black */
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
      `})]})},ee=()=>{const t=P(),s=N(),a=[{id:"home",icon:e.jsx(R,{size:18}),label:"Home",path:"/"},{id:"activity",icon:e.jsx(F,{size:18}),label:"Quiz",path:"/home-choice"},{id:"winners",icon:e.jsx(k,{size:18}),label:"Winners",path:"/leaderboard"},{id:"profile",icon:e.jsx(W,{size:18}),label:"Profile",path:"/profile"}],c=r=>s.pathname===r;return e.jsx("nav",{className:"floating-nav",children:a.map(r=>e.jsxs("button",{onClick:()=>t(r.path),style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",background:"none",border:"none",cursor:"pointer",padding:"4px",position:"relative",color:c(r.path)?"hsl(var(--primary))":"hsl(var(--muted-foreground))",transition:"all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",transform:c(r.path)?"translateY(-2px) scale(1.05)":"none"},children:[e.jsx("div",{style:{position:"relative",zIndex:1,filter:c(r.path)?"drop-shadow(0 0 8px hsla(var(--primary), 0.5))":"none"},children:V.cloneElement(r.icon,{strokeWidth:c(r.path)?2.5:2})}),e.jsx("span",{style:{fontSize:"0.6rem",fontWeight:800,opacity:c(r.path)?1:.7,letterSpacing:"0.01em",textTransform:"uppercase"},children:r.label}),c(r.path)&&e.jsx("div",{style:{position:"absolute",top:"-5px",width:"4px",height:"4px",background:"hsl(var(--primary))",borderRadius:"50%",boxShadow:"0 0 10px hsl(var(--primary))"}})]},r.id))})},i=({children:t,hideHeader:s=!1,hideFooter:a=!1,hideBottomNav:c=!1,hideNav:r=!1})=>r?e.jsx(e.Fragment,{children:t}):e.jsxs("div",{className:"layout-wrapper",style:{display:"flex",flexDirection:"column",minHeight:"100vh",position:"relative"},children:[!s&&e.jsx(K,{}),e.jsx("main",{className:"main-content",style:{flex:1,display:"flex",flexDirection:"column"},children:t}),!c&&e.jsx(ee,{}),!a&&e.jsx(X,{})]});o.lazy(()=>l(()=>import("./SplashPage-tOhb27b4.js"),__vite__mapDeps([0,1,2,3])));const te=o.lazy(()=>l(()=>import("./LandingPage-CuuuuFi9.js"),__vite__mapDeps([4,1,2,3]))),se=o.lazy(()=>l(()=>import("./LoginPage-K40tzPg4.js"),__vite__mapDeps([5,1,2,3]))),oe=o.lazy(()=>l(()=>import("./OtpPage-BD4YrKdF.js"),__vite__mapDeps([6,1,2,3]))),re=o.lazy(()=>l(()=>import("./RegisterPage-B7Mcb05V.js"),__vite__mapDeps([7,1,2,3]))),ae=o.lazy(()=>l(()=>import("./HomeChoicePage-Bnd-sbU8.js"),__vite__mapDeps([8,1,2,3]))),A=o.lazy(()=>l(()=>import("./QuizArenaPage-Bx0vOXmW.js"),__vite__mapDeps([9,1,2,3]))),ne=o.lazy(()=>l(()=>import("./StudyHomePage-BmrCTwVv.js"),__vite__mapDeps([10,1,2,3]))),ie=o.lazy(()=>l(()=>import("./StudyCategoryPage-_8YqI5kr.js"),__vite__mapDeps([11,1,3,2]))),le=o.lazy(()=>l(()=>import("./StudyQuizDetailPage-8yGS_ly3.js"),__vite__mapDeps([12,1,2,3]))),ce=o.lazy(()=>l(()=>import("./StudyQuestionPage-gppiSdP6.js"),__vite__mapDeps([13,1,2,3]))),de=o.lazy(()=>l(()=>import("./StudyReviewPage-CWJ7YpyY.js"),__vite__mapDeps([14,1,2,3]))),me=o.lazy(()=>l(()=>import("./StudyResultPage-CqPA455F.js"),__vite__mapDeps([15,1,2]))),ue=o.lazy(()=>l(()=>import("./MatchListPage-C9Ul1aTZ.js"),__vite__mapDeps([16,1,3,2]))),he=o.lazy(()=>l(()=>import("./GameQuizDetailPage-C5-T8mua.js"),__vite__mapDeps([17,1,2,3]))),pe=o.lazy(()=>l(()=>import("./GameQuestionPage-BiGtHdMO.js"),__vite__mapDeps([18,1,2,3]))),ge=o.lazy(()=>l(()=>import("./GameResultPage-D4wVWfZz.js"),__vite__mapDeps([19,1,2]))),xe=o.lazy(()=>l(()=>import("./GameReviewPage-BrMQcoCm.js"),__vite__mapDeps([20,1,2,3]))),je=o.lazy(()=>l(()=>import("./ProfilePage-s9KMJSGW.js"),__vite__mapDeps([21,1,2,3]))),fe=o.lazy(()=>l(()=>import("./HistoryPage-BuZ2CS2c.js"),__vite__mapDeps([22,1,2,3]))),ye=o.lazy(()=>l(()=>import("./ContestListPage-CyygDGwB.js"),__vite__mapDeps([23,1,2,3]))),I=o.lazy(()=>l(()=>import("./LeaderboardPage-CwgyNvJD.js"),__vite__mapDeps([24,1,2,3]))),_e=o.lazy(()=>l(()=>import("./AdminDashboard-CQBo-KGW.js"),__vite__mapDeps([25,1,26,3,2]))),ve=o.lazy(()=>l(()=>import("./AdminLoginPage-D7xmg1VH.js"),__vite__mapDeps([27,1,2,3]))),be=o.lazy(()=>l(()=>import("./MatchQuizRoom-DUMcB8Up.js"),__vite__mapDeps([28,1,2,3]))),ze=o.lazy(()=>l(()=>import("./DummyQuizFlow-CjaFP7uE.js"),__vite__mapDeps([29,1]))),we=o.lazy(()=>l(()=>import("./LegalPage-D2pMZzdn.js"),__vite__mapDeps([30,1,2]))),Ee=o.lazy(()=>l(()=>import("./HowItWorksPage-DSwi5PBL.js"),__vite__mapDeps([31,1,2,3]))),Pe=o.lazy(()=>l(()=>import("./BalancePage-BPK9JFfs.js"),__vite__mapDeps([32,1,2,3]))),Se=o.lazy(()=>l(()=>import("./VouchersPage-CY81vREa.js"),__vite__mapDeps([33,1,2,3]))),Ae=o.lazy(()=>l(()=>import("./QuizReviewPage-DyZVegdc.js"),__vite__mapDeps([34,1,2,3]))),Ie=o.lazy(()=>l(()=>import("./AboutUsPage-Dq9zKeMT.js"),__vite__mapDeps([35,1,2,3]))),Oe=o.lazy(()=>l(()=>import("./SupportPage-CLNsKXjz.js"),__vite__mapDeps([36,1,2,3]))),Ne=o.lazy(()=>l(()=>import("./TransactionPage-DJ-D5IQ5.js"),__vite__mapDeps([37,1,2,3]))),Re=({children:t})=>localStorage.getItem("play11_admin_session")?t:e.jsx(w,{to:"/admin/login",replace:!0}),E=({children:t})=>localStorage.getItem("play11_user")||localStorage.getItem("play11_session")?t:e.jsx(w,{to:"/login",replace:!0}),Le=()=>(o.useEffect(()=>{if(!localStorage.getItem("play11_guest_id")){const t="guest-"+Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15);localStorage.setItem("play11_guest_id",t)}},[]),e.jsx(q,{children:e.jsxs("div",{className:"app-shell",style:{minHeight:"100vh",position:"relative"},children:[e.jsxs("div",{className:"mesh-bg-premium",children:[e.jsx("div",{className:"bg-blob blob-1"}),e.jsx("div",{className:"bg-blob blob-2"}),e.jsx("div",{className:"bg-blob blob-3"})]}),e.jsx(o.Suspense,{fallback:null,children:e.jsxs(Q,{children:[e.jsx(n,{path:"/",element:e.jsx(i,{hideNav:!0,children:e.jsx(te,{})})}),e.jsx(n,{path:"/login",element:e.jsx(i,{hideNav:!0,children:e.jsx(se,{})})}),e.jsx(n,{path:"/otp",element:e.jsx(i,{hideNav:!0,children:e.jsx(oe,{})})}),e.jsx(n,{path:"/register",element:e.jsx(i,{hideNav:!0,children:e.jsx(re,{})})}),e.jsx(n,{path:"/home-choice",element:e.jsx(i,{children:e.jsx(ae,{})})}),e.jsx(n,{path:"/study-home",element:e.jsx(i,{children:e.jsx(ne,{})})}),e.jsx(n,{path:"/quiz-arena/:zoneId",element:e.jsx(i,{children:e.jsx(A,{})})}),e.jsx(n,{path:"/study-arena",element:e.jsx(i,{children:e.jsx(A,{})})}),e.jsx(n,{path:"/game-home",element:e.jsx(w,{to:"/quiz-arena/sport-zone",replace:!0})}),e.jsx(n,{path:"/study-category/:id",element:e.jsx(i,{children:e.jsx(ie,{})})}),e.jsx(n,{path:"/study-quiz-detail/:id",element:e.jsx(i,{children:e.jsx(le,{})})}),e.jsx(n,{path:"/study-quiz-play/:id",element:e.jsx(E,{children:e.jsx(i,{hideNav:!0,children:e.jsx(ce,{})})})}),e.jsx(n,{path:"/study-review/:id",element:e.jsx(i,{children:e.jsx(de,{})})}),e.jsx(n,{path:"/study-result/:id",element:e.jsx(i,{children:e.jsx(me,{})})}),e.jsx(n,{path:"/match-list",element:e.jsx(i,{children:e.jsx(ue,{})})}),e.jsx(n,{path:"/game-quiz-detail/:id",element:e.jsx(i,{children:e.jsx(he,{})})}),e.jsx(n,{path:"/game-quiz-play/:id",element:e.jsx(E,{children:e.jsx(i,{hideNav:!0,children:e.jsx(pe,{})})})}),e.jsx(n,{path:"/game-review/:id",element:e.jsx(i,{children:e.jsx(xe,{})})}),e.jsx(n,{path:"/game-result/:id",element:e.jsx(i,{children:e.jsx(ge,{})})}),e.jsx(n,{path:"/match-quiz-room/:id",element:e.jsx(E,{children:e.jsx(i,{children:e.jsx(be,{})})})}),e.jsx(n,{path:"/dummy-quiz-flow",element:e.jsx(i,{children:e.jsx(ze,{})})}),e.jsx(n,{path:"/contests",element:e.jsx(i,{children:e.jsx(ye,{})})}),e.jsx(n,{path:"/leaderboard",element:e.jsx(i,{children:e.jsx(I,{})})}),e.jsx(n,{path:"/leaderboard/:id",element:e.jsx(i,{children:e.jsx(I,{})})}),e.jsx(n,{path:"/profile",element:e.jsx(i,{children:e.jsx(je,{})})}),e.jsx(n,{path:"/history",element:e.jsx(i,{children:e.jsx(fe,{})})}),e.jsx(n,{path:"/balance",element:e.jsx(i,{children:e.jsx(Pe,{})})}),e.jsx(n,{path:"/vouchers",element:e.jsx(i,{children:e.jsx(Se,{})})}),e.jsx(n,{path:"/quiz-review/:id",element:e.jsx(i,{children:e.jsx(Ae,{})})}),e.jsx(n,{path:"/transaction/:type",element:e.jsx(i,{children:e.jsx(Ne,{})})}),e.jsx(n,{path:"/admin/login",element:e.jsx(i,{hideNav:!0,children:e.jsx(ve,{})})}),e.jsx(n,{path:"/admin",element:e.jsx(Re,{children:e.jsx(i,{hideNav:!0,children:e.jsx(_e,{})})})}),e.jsx(n,{path:"/legal",element:e.jsx(i,{children:e.jsx(we,{})})}),e.jsx(n,{path:"/about",element:e.jsx(i,{children:e.jsx(Ie,{})})}),e.jsx(n,{path:"/support",element:e.jsx(i,{children:e.jsx(Oe,{})})}),e.jsx(n,{path:"/how-it-works",element:e.jsx(i,{children:e.jsx(Ee,{})})}),e.jsx(n,{path:"*",element:e.jsx(w,{to:"/",replace:!0})})]})})]})})),g="/api",b={get(t){try{const s=sessionStorage.getItem(`play11_cache:${t}`);if(!s)return null;const{data:a,expiry:c}=JSON.parse(s);return Date.now()>c?(sessionStorage.removeItem(`play11_cache:${t}`),null):a}catch{return null}},set(t,s,a=6e4){try{sessionStorage.setItem(`play11_cache:${t}`,JSON.stringify({data:s,expiry:Date.now()+a}))}catch{}},invalidate(){try{Object.keys(sessionStorage).filter(t=>t.startsWith("play11_cache:")).forEach(t=>sessionStorage.removeItem(t))}catch{}}},z={store:new Map,get(t,s=8e3){const a=this.store.get(t);return a?Date.now()-a.timestamp>s?(this.store.delete(t),null):a.data:null},set(t,s){this.store.set(t,{data:s,timestamp:Date.now()})},invalidate(){this.store.clear()}},x=async(t,s={},a=8e3)=>{if((s.method||"GET").toUpperCase()!=="GET")return z.invalidate(),fetch(t,s);const r=s.headers?s.headers.Authorization:"",d=`${t}:${r||""}`,p=z.get(d,a);if(p)return{ok:!0,status:200,json:async()=>JSON.parse(JSON.stringify(p)),_fromCache:!0};const m=await fetch(t,s);if(m.ok){const f=m.clone();try{const u=await f.json();z.set(d,u)}catch{}}return m},y=()=>{const t=localStorage.getItem("play11_session")||localStorage.getItem("play11_admin_session");if(t)try{const s=JSON.parse(t);return{Authorization:`Bearer ${typeof s=="object"&&s.token||t}`}}catch{return{Authorization:`Bearer ${t}`}}return{}},j=async t=>{if(t.status===401)throw localStorage.removeItem("play11_session"),localStorage.removeItem("play11_admin_session"),new Error("Session expired. Please login again.");if(!t.ok){let a="API request failed";try{const c=await t.json();a=c.message||c.error||a}catch{}throw new Error(a)}const s=await t.json();return s.history||s.categories||s.quizzes||s.questions||s.quiz||s.user||s.stats||s.users||s},O={sendOtp:async t=>{const s=await x(`${g}/auth/send-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:t})});return j(s)},verifyOtp:async(t,s,a)=>{const c=await x(`${g}/auth/verify-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:t,otp_code:s,firebaseToken:a})}),r=await j(c);return r.token&&localStorage.setItem("play11_session",JSON.stringify({token:r.token,user:r.user})),r},updateProfile:async t=>{const s=await x(`${g}/auth/update-profile`,{method:"POST",headers:{"Content-Type":"application/json",...y()},body:JSON.stringify({name:t})});return j(s)},getHistory:async()=>{const t=await x(`${g}/auth/history`,{headers:{...y()}});return j(t)},logout:()=>{z.invalidate(),b.invalidate(),localStorage.removeItem("play11_session"),localStorage.removeItem("play11_admin_session")}},$e={getStudyCategories:async()=>{const t=await x(`${g}/categories/study`);return await j(t)},getGameCategories:async()=>{const t=await x(`${g}/categories/game`);return await j(t)},getQuizzesByZone:async t=>{const s=await x(`${g}/quizzes/zone/${t}`,{headers:{...y()}});return await j(s)},getAllQuizzes:async()=>{const t=await x(`${g}/quizzes`,{headers:{...y()}});return await j(t)},getJoinedQuizzes:async()=>{const t=await x(`${g}/quizzes/joined`,{headers:{...y()}});return await j(t)},getQuizzes:async t=>{const s=await x(`${g}/quizzes/category/${t}`);return await j(s)},getQuizById:async t=>{const s=await x(`${g}/quizzes/${t}`,{headers:{...y()}});return j(s)},getQuestions:async t=>{const s=await x(`${g}/quizzes/${t}/questions`,{headers:{...y()}});return j(s)},submitQuiz:async(t,s)=>{const a=await x(`${g}/quizzes/${t}/submit`,{method:"POST",headers:{"Content-Type":"application/json",...y()},body:JSON.stringify({answers:s})});return j(a)}},qe={getSetting:async t=>{const s=await x(`${g}/settings/${t}`);return j(s)},getBatchSettings:async(t=[])=>{const s="settings_batch_"+(t.length?t.sort().join(","):"all"),a=b.get(s);if(a)return{success:!0,settings:a};const c=t.length?`?keys=${t.join(",")}`:"",d=await(await fetch(`${g}/settings/batch${c}`)).json();return d.success&&b.set(s,d.settings,6e4),d},updateSetting:async(t,s)=>{const a=await x(`${g}/settings/update`,{method:"POST",headers:{"Content-Type":"application/json",...y()},body:JSON.stringify({key:t,value:s})});return b.invalidate(),j(a)}},ke=o.createContext(null),Te=({children:t})=>{const[s,a]=o.useState(null),[c,r]=o.useState(!0);o.useEffect(()=>{const m=localStorage.getItem("play11_session"),f=localStorage.getItem("play11_user");if(m&&f)try{a(JSON.parse(f))}catch(u){console.error("Session user parsing error",u),localStorage.removeItem("play11_user")}r(!1)},[]);const d=async(m,f)=>{const u=await O.verifyOtp(m,f);return u.success&&a(u.user),u},p=()=>{O.logout(),a(null)};return e.jsx(ke.Provider,{value:{user:s,loading:c,login:d,logout:p},children:t})};$.createRoot(document.getElementById("root")).render(e.jsx(o.StrictMode,{children:e.jsx(Te,{children:e.jsx(Le,{})})}));export{K as H,T as l,$e as q,qe as s};
