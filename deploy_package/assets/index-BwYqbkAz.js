const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/SplashPage-tOhb27b4.js","assets/vendor-core-754eFBWZ.js","assets/vendor-router-DpCHN5bO.js","assets/vendor-lucide-R5TnQarU.js","assets/LandingPage-DO6gIl0-.js","assets/LoginPage-Bv2KR4jy.js","assets/OtpPage-BD4YrKdF.js","assets/RegisterPage-Bu-sSfmz.js","assets/HomeChoicePage-DtXdGGAe.js","assets/QuizArenaPage-D6jORzXn.js","assets/StudyHomePage-BmrCTwVv.js","assets/StudyCategoryPage-_8YqI5kr.js","assets/StudyQuizDetailPage-Dd0MldS6.js","assets/StudyQuestionPage-ByOpUzeT.js","assets/StudyReviewPage-CWJ7YpyY.js","assets/StudyResultPage-CqPA455F.js","assets/MatchListPage-C9Ul1aTZ.js","assets/GameQuizDetailPage-yyE1BiBb.js","assets/GameQuestionPage-CtEicoHR.js","assets/GameResultPage-D4wVWfZz.js","assets/GameReviewPage-BrMQcoCm.js","assets/ProfilePage-DcVFAdzg.js","assets/HistoryPage-BuZ2CS2c.js","assets/ContestListPage-BE3JnxhZ.js","assets/LeaderboardPage-CwgyNvJD.js","assets/AdminDashboard-DGY3Zs2p.js","assets/vendor-tesseract-DR4Ucv4Y.js","assets/AdminLoginPage-D7xmg1VH.js","assets/MatchQuizRoom-CQVOnoDq.js","assets/DummyQuizFlow-CjaFP7uE.js","assets/LegalPage-D2pMZzdn.js","assets/HowItWorksPage-DSwi5PBL.js","assets/BalancePage-BPK9JFfs.js","assets/VouchersPage-CY81vREa.js","assets/QuizReviewPage-DyZVegdc.js","assets/AboutUsPage-Dq9zKeMT.js","assets/SupportPage-CLNsKXjz.js","assets/TransactionPage-DJ-D5IQ5.js"])))=>i.map(i=>d[i]);
import{r,j as e,R as C,c as V}from"./vendor-core-754eFBWZ.js";import{u as P,a as N,B as $,R as q,b as n,N as w}from"./vendor-router-DpCHN5bO.js";import{U as E,X as Q,M as H,H as R,G as k,T as L,a as B,P as U,b as J,S as G,c as M}from"./vendor-lucide-R5TnQarU.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))c(o);new MutationObserver(o=>{for(const d of o)if(d.type==="childList")for(const p of d.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&c(p)}).observe(document,{childList:!0,subtree:!0});function a(o){const d={};return o.integrity&&(d.integrity=o.integrity),o.referrerPolicy&&(d.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?d.credentials="include":o.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function c(o){if(o.ep)return;o.ep=!0;const d=a(o);fetch(o.href,d)}})();const F="modulepreload",W=function(t){return"/"+t},S={},l=function(s,a,c){let o=Promise.resolve();if(a&&a.length>0){let p=function(h){return Promise.all(h.map(u=>Promise.resolve(u).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))};document.getElementsByTagName("link");const m=document.querySelector("meta[property=csp-nonce]"),f=(m==null?void 0:m.nonce)||(m==null?void 0:m.getAttribute("nonce"));o=p(a.map(h=>{if(h=W(h),h in S)return;S[h]=!0;const u=h.endsWith(".css"),v=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${h}"]${v}`))return;const _=document.createElement("link");if(_.rel=u?"stylesheet":F,u||(_.as="script"),_.crossOrigin="",_.href=h,f&&_.setAttribute("nonce",f),document.head.appendChild(_),u)return new Promise((T,D)=>{_.addEventListener("load",T),_.addEventListener("error",()=>D(new Error(`Unable to preload CSS for ${h}`)))})}))}function d(p){const m=new Event("vite:preloadError",{cancelable:!0});if(m.payload=p,window.dispatchEvent(m),!m.defaultPrevented)throw p}return o.then(p=>{for(const m of p||[])m.status==="rejected"&&d(m.reason);return s().catch(d)})},Y="/assets/quzo-DOFL_O3I.png",Z=()=>{const[t,s]=r.useState(!1),[a,c]=r.useState(!1),[o,d]=r.useState(!1),p=P(),m=N();localStorage.getItem("user_mobile"),localStorage.getItem("user_name"),r.useEffect(()=>{const u=()=>c(window.scrollY>20);return window.addEventListener("scroll",u),()=>window.removeEventListener("scroll",u)},[]);const f=[{name:"Home",path:"/",icon:e.jsx(R,{size:18})},{name:"Quiz Arena",path:"/home-choice",icon:e.jsx(k,{size:18})},{name:"Leaderboard",path:"/leaderboard",icon:e.jsx(L,{size:18})}],h=u=>m.pathname===u;return e.jsxs("nav",{className:"topbar",children:[e.jsxs("div",{className:"topbar-inner",children:[e.jsx("div",{onClick:()=>p("/"),className:"header-logo-container",children:e.jsx("img",{src:Y,alt:"QUZO",className:"header-logo-img"})}),e.jsxs("div",{className:"desktop-nav",style:{display:"none"},children:[f.map(u=>e.jsx("button",{onClick:()=>p(u.path),className:`nav-link-btn ${h(u.path)?"active":""}`,children:u.name},u.path)),e.jsx("div",{style:{width:"1px",height:"20px",background:"rgba(255,255,255,0.1)",margin:"0 0.5rem"}}),e.jsx("div",{style:{display:"flex",alignItems:"center",gap:"0.8rem"},children:e.jsxs("button",{onClick:()=>p("/history"),className:"user-profile-btn",children:[e.jsx("div",{style:{width:"28px",height:"28px",borderRadius:"50%",background:"linear-gradient(135deg, #38bdf8, #1d4ed8)",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(E,{size:14,color:"white"})}),e.jsx("span",{style:{fontWeight:800,fontSize:"0.8rem"},children:"My Activity"})]})})]}),e.jsx("button",{className:"menu-toggle",onClick:()=>s(!t),children:t?e.jsx(Q,{size:24}):e.jsx(H,{size:24})})]}),t&&e.jsx("div",{className:"mobile-nav-overlay",children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[f.map(u=>e.jsxs("button",{onClick:()=>{p(u.path),s(!1)},style:{background:h(u.path)?"rgba(59, 130, 246, 0.1)":"transparent",border:"none",padding:"1.25rem",borderRadius:"1.25rem",textAlign:"left",display:"flex",alignItems:"center",gap:"1rem",fontSize:"1.1rem",fontWeight:800,color:h(u.path)?"#38bdf8":"white"},children:[u.icon,u.name]},u.path)),e.jsx("hr",{style:{border:"none",height:"1px",background:"rgba(255,255,255,0.1)",margin:"1rem 0"}}),e.jsxs("button",{onClick:()=>{p("/history"),s(!1)},style:{background:"rgba(255,255,255,0.05)",border:"none",padding:"1.25rem",borderRadius:"1.25rem",display:"flex",alignItems:"center",gap:"1rem",fontSize:"1.1rem",fontWeight:800,color:"white"},children:[e.jsx(E,{size:20})," My Activity"]})]})}),e.jsx("style",{children:`
        @media (min-width: 961px) {
          .desktop-nav { display: flex !important; }
          .menu-toggle { display: none !important; }
        }
      `})]})},K=()=>{const t=P(),s=new Date().getFullYear();return e.jsxs("footer",{className:"site-footer",children:[e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:"footer-grid",children:[e.jsxs("div",{className:"footer-brand",children:[e.jsxs("div",{className:"logo-boxes",onClick:()=>t("/"),style:{cursor:"pointer",marginBottom:"1.25rem"},children:[e.jsx("div",{className:"logo-box",children:"Q"}),e.jsx("div",{className:"logo-box",children:"U"}),e.jsx("div",{className:"logo-box",children:"Z"}),e.jsx("div",{className:"logo-box",children:"O"})]}),e.jsx("p",{className:"footer-desc",children:"The ultimate platform where knowledge meets competition. Master your academic goals and sports predictions in one elite arena."}),e.jsxs("div",{className:"social-row",children:[e.jsx("button",{className:"social-icon-btn",children:e.jsx(B,{size:18})}),e.jsx("button",{className:"social-icon-btn",children:e.jsx(U,{size:18})}),e.jsx("button",{className:"social-icon-btn",children:e.jsx(J,{size:18})}),e.jsx("button",{className:"social-icon-btn",children:e.jsx(k,{size:18})})]})]}),e.jsxs("div",{className:"footer-links-col",children:[e.jsx("h4",{children:"Explore Zones"}),e.jsxs("ul",{children:[e.jsx("li",{onClick:()=>t("/study-home"),children:"Study Arena"}),e.jsx("li",{onClick:()=>t("/game-home"),children:"Game Arena"}),e.jsx("li",{onClick:()=>t("/history"),children:"History & Archives"})]})]}),e.jsxs("div",{className:"footer-links-col",children:[e.jsx("h4",{children:"Your Profile"}),e.jsxs("ul",{children:[e.jsx("li",{onClick:()=>t("/profile"),children:"Personal Stats"}),e.jsx("li",{onClick:()=>t("/login"),children:"Access Account"})]})]}),e.jsxs("div",{className:"footer-links-col",children:[e.jsx("h4",{children:"Company"}),e.jsxs("ul",{children:[e.jsx("li",{onClick:()=>t("/legal#privacy"),children:"Privacy Policy"}),e.jsx("li",{onClick:()=>t("/legal#refund"),children:"Refund Policy"}),e.jsx("li",{onClick:()=>t("/legal#terms"),children:"Terms of Use"}),e.jsx("li",{onClick:()=>t("/legal#refer"),children:"Refer & Earn"}),e.jsx("li",{onClick:()=>t("/legal#contact"),children:"Contact Us"}),e.jsx("li",{onClick:()=>t("/legal#disclaimer"),children:"Disclaimer"})]})]})]}),e.jsxs("div",{className:"footer-bottom-bar",children:[e.jsxs("div",{className:"copyright-flex",children:[e.jsx("div",{className:"spark-circle",children:e.jsx(G,{size:10,fill:"currentColor"})}),e.jsxs("span",{children:["© ",s," QUZO Global Arena. All Rights Reserved."]})]}),e.jsx("div",{className:"footer-info-tags",children:e.jsx("span",{children:"Secure Connection"})})]})]}),e.jsx("style",{children:`
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
          .logo-boxes { justify-content: center; }
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
      `})]})},X=()=>{const t=P(),s=N(),a=[{id:"home",icon:e.jsx(R,{size:18}),label:"Home",path:"/"},{id:"activity",icon:e.jsx(M,{size:18}),label:"Quiz",path:"/home-choice"},{id:"winners",icon:e.jsx(L,{size:18}),label:"Winners",path:"/leaderboard"},{id:"profile",icon:e.jsx(E,{size:18}),label:"Profile",path:"/profile"}],c=o=>s.pathname===o;return e.jsx("nav",{className:"floating-nav",children:a.map(o=>e.jsxs("button",{onClick:()=>t(o.path),style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",background:"none",border:"none",cursor:"pointer",padding:"4px",position:"relative",color:c(o.path)?"hsl(var(--primary))":"hsl(var(--muted-foreground))",transition:"all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",transform:c(o.path)?"translateY(-2px) scale(1.05)":"none"},children:[e.jsx("div",{style:{position:"relative",zIndex:1,filter:c(o.path)?"drop-shadow(0 0 8px hsla(var(--primary), 0.5))":"none"},children:C.cloneElement(o.icon,{strokeWidth:c(o.path)?2.5:2})}),e.jsx("span",{style:{fontSize:"0.6rem",fontWeight:800,opacity:c(o.path)?1:.7,letterSpacing:"0.01em",textTransform:"uppercase"},children:o.label}),c(o.path)&&e.jsx("div",{style:{position:"absolute",top:"-5px",width:"4px",height:"4px",background:"hsl(var(--primary))",borderRadius:"50%",boxShadow:"0 0 10px hsl(var(--primary))"}})]},o.id))})},i=({children:t,hideHeader:s=!1,hideFooter:a=!1,hideBottomNav:c=!1,hideNav:o=!1})=>o?e.jsx(e.Fragment,{children:t}):e.jsxs("div",{className:"layout-wrapper",style:{display:"flex",flexDirection:"column",minHeight:"100vh",position:"relative"},children:[!s&&e.jsx(Z,{}),e.jsx("main",{className:"main-content",style:{flex:1,display:"flex",flexDirection:"column"},children:t}),!c&&e.jsx(X,{}),!a&&e.jsx(K,{})]});r.lazy(()=>l(()=>import("./SplashPage-tOhb27b4.js"),__vite__mapDeps([0,1,2,3])));const ee=r.lazy(()=>l(()=>import("./LandingPage-DO6gIl0-.js"),__vite__mapDeps([4,1,2,3]))),te=r.lazy(()=>l(()=>import("./LoginPage-Bv2KR4jy.js"),__vite__mapDeps([5,1,2,3]))),se=r.lazy(()=>l(()=>import("./OtpPage-BD4YrKdF.js"),__vite__mapDeps([6,1,2,3]))),re=r.lazy(()=>l(()=>import("./RegisterPage-Bu-sSfmz.js"),__vite__mapDeps([7,1,2,3]))),oe=r.lazy(()=>l(()=>import("./HomeChoicePage-DtXdGGAe.js"),__vite__mapDeps([8,1,2,3]))),I=r.lazy(()=>l(()=>import("./QuizArenaPage-D6jORzXn.js"),__vite__mapDeps([9,1,2,3]))),ae=r.lazy(()=>l(()=>import("./StudyHomePage-BmrCTwVv.js"),__vite__mapDeps([10,1,2,3]))),ne=r.lazy(()=>l(()=>import("./StudyCategoryPage-_8YqI5kr.js"),__vite__mapDeps([11,1,3,2]))),ie=r.lazy(()=>l(()=>import("./StudyQuizDetailPage-Dd0MldS6.js"),__vite__mapDeps([12,1,2,3]))),le=r.lazy(()=>l(()=>import("./StudyQuestionPage-ByOpUzeT.js"),__vite__mapDeps([13,1,2,3]))),ce=r.lazy(()=>l(()=>import("./StudyReviewPage-CWJ7YpyY.js"),__vite__mapDeps([14,1,2,3]))),de=r.lazy(()=>l(()=>import("./StudyResultPage-CqPA455F.js"),__vite__mapDeps([15,1,2]))),me=r.lazy(()=>l(()=>import("./MatchListPage-C9Ul1aTZ.js"),__vite__mapDeps([16,1,3,2]))),he=r.lazy(()=>l(()=>import("./GameQuizDetailPage-yyE1BiBb.js"),__vite__mapDeps([17,1,2,3]))),ue=r.lazy(()=>l(()=>import("./GameQuestionPage-CtEicoHR.js"),__vite__mapDeps([18,1,2,3]))),pe=r.lazy(()=>l(()=>import("./GameResultPage-D4wVWfZz.js"),__vite__mapDeps([19,1,2]))),ge=r.lazy(()=>l(()=>import("./GameReviewPage-BrMQcoCm.js"),__vite__mapDeps([20,1,2,3]))),xe=r.lazy(()=>l(()=>import("./ProfilePage-DcVFAdzg.js"),__vite__mapDeps([21,1,2,3]))),je=r.lazy(()=>l(()=>import("./HistoryPage-BuZ2CS2c.js"),__vite__mapDeps([22,1,2,3]))),fe=r.lazy(()=>l(()=>import("./ContestListPage-BE3JnxhZ.js"),__vite__mapDeps([23,1,2,3]))),A=r.lazy(()=>l(()=>import("./LeaderboardPage-CwgyNvJD.js"),__vite__mapDeps([24,1,2,3]))),ye=r.lazy(()=>l(()=>import("./AdminDashboard-DGY3Zs2p.js"),__vite__mapDeps([25,1,26,3,2]))),_e=r.lazy(()=>l(()=>import("./AdminLoginPage-D7xmg1VH.js"),__vite__mapDeps([27,1,2,3]))),ve=r.lazy(()=>l(()=>import("./MatchQuizRoom-CQVOnoDq.js"),__vite__mapDeps([28,1,2,3]))),be=r.lazy(()=>l(()=>import("./DummyQuizFlow-CjaFP7uE.js"),__vite__mapDeps([29,1]))),ze=r.lazy(()=>l(()=>import("./LegalPage-D2pMZzdn.js"),__vite__mapDeps([30,1,2]))),we=r.lazy(()=>l(()=>import("./HowItWorksPage-DSwi5PBL.js"),__vite__mapDeps([31,1,2,3]))),Ee=r.lazy(()=>l(()=>import("./BalancePage-BPK9JFfs.js"),__vite__mapDeps([32,1,2,3]))),Pe=r.lazy(()=>l(()=>import("./VouchersPage-CY81vREa.js"),__vite__mapDeps([33,1,2,3]))),Se=r.lazy(()=>l(()=>import("./QuizReviewPage-DyZVegdc.js"),__vite__mapDeps([34,1,2,3]))),Ie=r.lazy(()=>l(()=>import("./AboutUsPage-Dq9zKeMT.js"),__vite__mapDeps([35,1,2,3]))),Ae=r.lazy(()=>l(()=>import("./SupportPage-CLNsKXjz.js"),__vite__mapDeps([36,1,2,3]))),Oe=r.lazy(()=>l(()=>import("./TransactionPage-DJ-D5IQ5.js"),__vite__mapDeps([37,1,2,3]))),Ne=({children:t})=>localStorage.getItem("play11_admin_session")?t:e.jsx(w,{to:"/admin/login",replace:!0}),Re=({children:t})=>t,ke=()=>(r.useEffect(()=>{if(!localStorage.getItem("play11_guest_id")){const t="guest-"+Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15);localStorage.setItem("play11_guest_id",t)}},[]),e.jsx($,{children:e.jsxs("div",{className:"app-shell",style:{minHeight:"100vh",position:"relative"},children:[e.jsxs("div",{className:"mesh-bg-premium",children:[e.jsx("div",{className:"bg-blob blob-1"}),e.jsx("div",{className:"bg-blob blob-2"}),e.jsx("div",{className:"bg-blob blob-3"})]}),e.jsx(r.Suspense,{fallback:null,children:e.jsxs(q,{children:[e.jsx(n,{path:"/",element:e.jsx(i,{hideNav:!0,children:e.jsx(ee,{})})}),e.jsx(n,{path:"/login",element:e.jsx(i,{hideNav:!0,children:e.jsx(te,{})})}),e.jsx(n,{path:"/otp",element:e.jsx(i,{hideNav:!0,children:e.jsx(se,{})})}),e.jsx(n,{path:"/register",element:e.jsx(i,{hideNav:!0,children:e.jsx(re,{})})}),e.jsx(n,{path:"/home-choice",element:e.jsx(i,{children:e.jsx(oe,{})})}),e.jsx(n,{path:"/study-home",element:e.jsx(i,{children:e.jsx(ae,{})})}),e.jsx(n,{path:"/quiz-arena/:zoneId",element:e.jsx(i,{children:e.jsx(I,{})})}),e.jsx(n,{path:"/study-arena",element:e.jsx(i,{children:e.jsx(I,{})})}),e.jsx(n,{path:"/game-home",element:e.jsx(w,{to:"/quiz-arena/sport-zone",replace:!0})}),e.jsx(n,{path:"/study-category/:id",element:e.jsx(i,{children:e.jsx(ne,{})})}),e.jsx(n,{path:"/study-quiz-detail/:id",element:e.jsx(i,{children:e.jsx(ie,{})})}),e.jsx(n,{path:"/study-quiz-play/:id",element:e.jsx(i,{hideNav:!0,children:e.jsx(le,{})})}),e.jsx(n,{path:"/study-review/:id",element:e.jsx(i,{children:e.jsx(ce,{})})}),e.jsx(n,{path:"/study-result/:id",element:e.jsx(i,{children:e.jsx(de,{})})}),e.jsx(n,{path:"/match-list",element:e.jsx(i,{children:e.jsx(me,{})})}),e.jsx(n,{path:"/game-quiz-detail/:id",element:e.jsx(i,{children:e.jsx(he,{})})}),e.jsx(n,{path:"/game-quiz-play/:id",element:e.jsx(i,{hideNav:!0,children:e.jsx(ue,{})})}),e.jsx(n,{path:"/game-review/:id",element:e.jsx(i,{children:e.jsx(ge,{})})}),e.jsx(n,{path:"/game-result/:id",element:e.jsx(i,{children:e.jsx(pe,{})})}),e.jsx(n,{path:"/match-quiz-room/:id",element:e.jsx(Re,{children:e.jsx(i,{children:e.jsx(ve,{})})})}),e.jsx(n,{path:"/dummy-quiz-flow",element:e.jsx(i,{children:e.jsx(be,{})})}),e.jsx(n,{path:"/contests",element:e.jsx(i,{children:e.jsx(fe,{})})}),e.jsx(n,{path:"/leaderboard",element:e.jsx(i,{children:e.jsx(A,{})})}),e.jsx(n,{path:"/leaderboard/:id",element:e.jsx(i,{children:e.jsx(A,{})})}),e.jsx(n,{path:"/profile",element:e.jsx(i,{children:e.jsx(xe,{})})}),e.jsx(n,{path:"/history",element:e.jsx(i,{children:e.jsx(je,{})})}),e.jsx(n,{path:"/balance",element:e.jsx(i,{children:e.jsx(Ee,{})})}),e.jsx(n,{path:"/vouchers",element:e.jsx(i,{children:e.jsx(Pe,{})})}),e.jsx(n,{path:"/quiz-review/:id",element:e.jsx(i,{children:e.jsx(Se,{})})}),e.jsx(n,{path:"/transaction/:type",element:e.jsx(i,{children:e.jsx(Oe,{})})}),e.jsx(n,{path:"/admin/login",element:e.jsx(i,{hideNav:!0,children:e.jsx(_e,{})})}),e.jsx(n,{path:"/admin",element:e.jsx(Ne,{children:e.jsx(i,{hideNav:!0,children:e.jsx(ye,{})})})}),e.jsx(n,{path:"/legal",element:e.jsx(i,{children:e.jsx(ze,{})})}),e.jsx(n,{path:"/about",element:e.jsx(i,{children:e.jsx(Ie,{})})}),e.jsx(n,{path:"/support",element:e.jsx(i,{children:e.jsx(Ae,{})})}),e.jsx(n,{path:"/how-it-works",element:e.jsx(i,{children:e.jsx(we,{})})}),e.jsx(n,{path:"*",element:e.jsx(w,{to:"/",replace:!0})})]})})]})})),g="/api",b={get(t){try{const s=sessionStorage.getItem(`play11_cache:${t}`);if(!s)return null;const{data:a,expiry:c}=JSON.parse(s);return Date.now()>c?(sessionStorage.removeItem(`play11_cache:${t}`),null):a}catch{return null}},set(t,s,a=6e4){try{sessionStorage.setItem(`play11_cache:${t}`,JSON.stringify({data:s,expiry:Date.now()+a}))}catch{}},invalidate(){try{Object.keys(sessionStorage).filter(t=>t.startsWith("play11_cache:")).forEach(t=>sessionStorage.removeItem(t))}catch{}}},z={store:new Map,get(t,s=8e3){const a=this.store.get(t);return a?Date.now()-a.timestamp>s?(this.store.delete(t),null):a.data:null},set(t,s){this.store.set(t,{data:s,timestamp:Date.now()})},invalidate(){this.store.clear()}},x=async(t,s={},a=8e3)=>{if((s.method||"GET").toUpperCase()!=="GET")return z.invalidate(),fetch(t,s);const o=s.headers?s.headers.Authorization:"",d=`${t}:${o||""}`,p=z.get(d,a);if(p)return{ok:!0,status:200,json:async()=>JSON.parse(JSON.stringify(p)),_fromCache:!0};const m=await fetch(t,s);if(m.ok){const f=m.clone();try{const h=await f.json();z.set(d,h)}catch{}}return m},y=()=>{const t=localStorage.getItem("play11_session")||localStorage.getItem("play11_admin_session");if(t)try{const s=JSON.parse(t);return{Authorization:`Bearer ${typeof s=="object"&&s.token||t}`}}catch{return{Authorization:`Bearer ${t}`}}return{}},j=async t=>{if(t.status===401)throw localStorage.removeItem("play11_session"),localStorage.removeItem("play11_admin_session"),new Error("Session expired. Please login again.");if(!t.ok){let a="API request failed";try{const c=await t.json();a=c.message||c.error||a}catch{}throw new Error(a)}const s=await t.json();return s.history||s.categories||s.quizzes||s.questions||s.quiz||s.user||s.stats||s.users||s},O={sendOtp:async t=>{const s=await x(`${g}/auth/send-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:t})});return j(s)},verifyOtp:async(t,s,a)=>{const c=await x(`${g}/auth/verify-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:t,otp_code:s,firebaseToken:a})}),o=await j(c);return o.token&&localStorage.setItem("play11_session",JSON.stringify({token:o.token,user:o.user})),o},updateProfile:async t=>{const s=await x(`${g}/auth/update-profile`,{method:"POST",headers:{"Content-Type":"application/json",...y()},body:JSON.stringify({name:t})});return j(s)},getHistory:async()=>{const t=await x(`${g}/auth/history`,{headers:{...y()}});return j(t)},logout:()=>{z.invalidate(),b.invalidate(),localStorage.removeItem("play11_session"),localStorage.removeItem("play11_admin_session")}},$e={getStudyCategories:async()=>{const t=await x(`${g}/categories/study`);return await j(t)},getGameCategories:async()=>{const t=await x(`${g}/categories/game`);return await j(t)},getQuizzesByZone:async t=>{const s=await x(`${g}/quizzes/zone/${t}`,{headers:{...y()}});return await j(s)},getAllQuizzes:async()=>{const t=await x(`${g}/quizzes`,{headers:{...y()}});return await j(t)},getJoinedQuizzes:async()=>{const t=await x(`${g}/quizzes/joined`,{headers:{...y()}});return await j(t)},getQuizzes:async t=>{const s=await x(`${g}/quizzes/category/${t}`);return await j(s)},getQuizById:async t=>{const s=await x(`${g}/quizzes/${t}`,{headers:{...y()}});return j(s)},getQuestions:async t=>{const s=await x(`${g}/quizzes/${t}/questions`,{headers:{...y()}});return j(s)},submitQuiz:async(t,s)=>{const a=await x(`${g}/quizzes/${t}/submit`,{method:"POST",headers:{"Content-Type":"application/json",...y()},body:JSON.stringify({answers:s})});return j(a)}},qe={getSetting:async t=>{const s=await x(`${g}/settings/${t}`);return j(s)},getBatchSettings:async(t=[])=>{const s="settings_batch_"+(t.length?t.sort().join(","):"all"),a=b.get(s);if(a)return{success:!0,settings:a};const c=t.length?`?keys=${t.join(",")}`:"",d=await(await fetch(`${g}/settings/batch${c}`)).json();return d.success&&b.set(s,d.settings,6e4),d},updateSetting:async(t,s)=>{const a=await x(`${g}/settings/update`,{method:"POST",headers:{"Content-Type":"application/json",...y()},body:JSON.stringify({key:t,value:s})});return b.invalidate(),j(a)}},Le=r.createContext(null),Te=({children:t})=>{const[s,a]=r.useState(null),[c,o]=r.useState(!0);r.useEffect(()=>{const m=localStorage.getItem("play11_session"),f=localStorage.getItem("play11_user");if(m&&f)try{a(JSON.parse(f))}catch(h){console.error("Session user parsing error",h),localStorage.removeItem("play11_user")}o(!1)},[]);const d=async(m,f)=>{const h=await O.verifyOtp(m,f);return h.success&&a(h.user),h},p=()=>{O.logout(),a(null)};return e.jsx(Le.Provider,{value:{user:s,loading:c,login:d,logout:p},children:t})};V.createRoot(document.getElementById("root")).render(e.jsx(r.StrictMode,{children:e.jsx(Te,{children:e.jsx(ke,{})})}));export{Z as H,Y as l,$e as q,qe as s};
