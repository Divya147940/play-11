const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/SplashPage-BjD7D4ZH.js","assets/vendor-core-754eFBWZ.js","assets/vendor-router-DpCHN5bO.js","assets/vendor-lucide-Czx_Sl3Z.js","assets/LandingPage-xFUA2-hS.js","assets/LoginPage-DYAj_EAq.js","assets/OtpPage-Bnxa8_a_.js","assets/RegisterPage-D3U8CJy1.js","assets/HomeChoicePage-9WVyMKZe.js","assets/QuizArenaPage-BIlc866P.js","assets/StudyHomePage-CI6aU90i.js","assets/StudyCategoryPage-EGTyQVyk.js","assets/StudyQuizDetailPage-BCfp7uLq.js","assets/StudyQuestionPage-RXWBFFli.js","assets/StudyReviewPage-BgfKJyqz.js","assets/StudyResultPage-bW5jhW49.js","assets/MatchListPage-C6JeBywy.js","assets/GameQuizDetailPage-DzcJY2p1.js","assets/GameQuestionPage-D_EeiIP7.js","assets/GameResultPage-Az0cHdHU.js","assets/GameReviewPage-CW1wGTqD.js","assets/ProfilePage-DBv85W57.js","assets/HistoryPage-DGC1X_cn.js","assets/ContestListPage-D2l-VChE.js","assets/LeaderboardPage-uXuSLkuG.js","assets/AdminDashboard-BF9NWnQB.js","assets/vendor-tesseract-DR4Ucv4Y.js","assets/AdminLoginPage-B4wG9IaA.js","assets/MatchQuizRoom-DVQQg1TA.js","assets/DummyQuizFlow-CjaFP7uE.js","assets/LegalPage-D2pMZzdn.js","assets/HowItWorksPage-CPM-WgVE.js","assets/BalancePage-BOMHciqV.js","assets/VouchersPage-BNEFMRzx.js","assets/QuizReviewPage-DeQaeuZd.js","assets/AboutUsPage-CT9BV9QU.js","assets/SupportPage-DeEN342R.js","assets/TransactionPage-C00sPub3.js"])))=>i.map(i=>d[i]);
import{r as o,j as e,R as C,c as V}from"./vendor-core-754eFBWZ.js";import{u as P,a as N,B as $,R as q,b as n,N as w}from"./vendor-router-DpCHN5bO.js";import{U as E,X as Q,M as H,H as R,G as k,T as L,a as B,P as U,b as J,S as G,c as M}from"./vendor-lucide-Czx_Sl3Z.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))c(r);new MutationObserver(r=>{for(const m of r)if(m.type==="childList")for(const u of m.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&c(u)}).observe(document,{childList:!0,subtree:!0});function a(r){const m={};return r.integrity&&(m.integrity=r.integrity),r.referrerPolicy&&(m.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?m.credentials="include":r.crossOrigin==="anonymous"?m.credentials="omit":m.credentials="same-origin",m}function c(r){if(r.ep)return;r.ep=!0;const m=a(r);fetch(r.href,m)}})();const W="modulepreload",F=function(t){return"/"+t},S={},l=function(s,a,c){let r=Promise.resolve();if(a&&a.length>0){let u=function(h){return Promise.all(h.map(_=>Promise.resolve(_).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))};document.getElementsByTagName("link");const p=document.querySelector("meta[property=csp-nonce]"),d=(p==null?void 0:p.nonce)||(p==null?void 0:p.getAttribute("nonce"));r=u(a.map(h=>{if(h=F(h),h in S)return;S[h]=!0;const _=h.endsWith(".css"),v=_?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${h}"]${v}`))return;const y=document.createElement("link");if(y.rel=_?"stylesheet":W,_||(y.as="script"),y.crossOrigin="",y.href=h,d&&y.setAttribute("nonce",d),document.head.appendChild(y),_)return new Promise((T,D)=>{y.addEventListener("load",T),y.addEventListener("error",()=>D(new Error(`Unable to preload CSS for ${h}`)))})}))}function m(u){const p=new Event("vite:preloadError",{cancelable:!0});if(p.payload=u,window.dispatchEvent(p),!p.defaultPrevented)throw u}return r.then(u=>{for(const p of u||[])p.status==="rejected"&&m(p.reason);return s().catch(m)})},Y=()=>{const[t,s]=o.useState(!1),[a,c]=o.useState(!1),r=P(),m=N();localStorage.getItem("user_mobile"),localStorage.getItem("user_name"),o.useEffect(()=>{const d=()=>c(window.scrollY>20);return window.addEventListener("scroll",d),()=>window.removeEventListener("scroll",d)},[]);const u=[{name:"Home",path:"/",icon:e.jsx(R,{size:18})},{name:"Quiz Arena",path:"/home-choice",icon:e.jsx(k,{size:18})},{name:"Leaderboard",path:"/leaderboard",icon:e.jsx(L,{size:18})}],p=d=>m.pathname===d;return e.jsxs("nav",{className:"topbar",children:[e.jsxs("div",{className:"topbar-inner",children:[e.jsxs("div",{className:"logo-boxes",onClick:()=>r("/"),style:{cursor:"pointer",display:"flex",alignItems:"center",gap:"4px"},children:[e.jsx("div",{className:"logo-box",children:"Q"}),e.jsx("div",{className:"logo-box",children:"U"}),e.jsx("div",{className:"logo-box",children:"Z"}),e.jsx("div",{className:"logo-box",children:"O"})]}),e.jsxs("div",{className:"desktop-nav",style:{display:"none"},children:[u.map(d=>e.jsx("button",{onClick:()=>r(d.path),className:`nav-link-btn ${p(d.path)?"active":""}`,children:d.name},d.path)),e.jsx("div",{style:{width:"1px",height:"20px",background:"rgba(255,255,255,0.1)",margin:"0 0.5rem"}}),e.jsx("div",{style:{display:"flex",alignItems:"center",gap:"0.8rem"},children:e.jsxs("button",{onClick:()=>r("/history"),className:"user-profile-btn",children:[e.jsx("div",{style:{width:"28px",height:"28px",borderRadius:"50%",background:"linear-gradient(135deg, #38bdf8, #1d4ed8)",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(E,{size:14,color:"white"})}),e.jsx("span",{style:{fontWeight:800,fontSize:"0.8rem"},children:"My Activity"})]})})]}),e.jsx("button",{className:"menu-toggle",onClick:()=>s(!t),children:t?e.jsx(Q,{size:24}):e.jsx(H,{size:24})})]}),t&&e.jsx("div",{className:"mobile-nav-overlay",style:{position:"fixed",top:"66px",left:0,right:0,bottom:0,background:"#0d1f3c",backdropFilter:"blur(20px)",zIndex:999,padding:"2rem"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[u.map(d=>e.jsxs("button",{onClick:()=>{r(d.path),s(!1)},style:{background:p(d.path)?"rgba(59, 130, 246, 0.1)":"transparent",border:"none",padding:"1.25rem",borderRadius:"1.25rem",textAlign:"left",display:"flex",alignItems:"center",gap:"1rem",fontSize:"1.1rem",fontWeight:800,color:p(d.path)?"#38bdf8":"white"},children:[d.icon,d.name]},d.path)),e.jsx("hr",{style:{border:"none",height:"1px",background:"rgba(255,255,255,0.1)",margin:"1rem 0"}}),e.jsxs("button",{onClick:()=>{r("/history"),s(!1)},style:{background:"rgba(255,255,255,0.05)",border:"none",padding:"1.25rem",borderRadius:"1.25rem",display:"flex",alignItems:"center",gap:"1rem",fontSize:"1.1rem",fontWeight:800,color:"white"},children:[e.jsx(E,{size:20})," My Activity"]})]})}),e.jsx("style",{children:`
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          .menu-toggle { display: none !important; }
        }
      `})]})},Z=()=>{const t=P(),s=new Date().getFullYear();return e.jsxs("footer",{className:"site-footer",children:[e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:"footer-grid",children:[e.jsxs("div",{className:"footer-brand",children:[e.jsxs("div",{className:"logo-boxes",onClick:()=>t("/"),style:{cursor:"pointer",marginBottom:"1.25rem"},children:[e.jsx("div",{className:"logo-box",children:"Q"}),e.jsx("div",{className:"logo-box",children:"U"}),e.jsx("div",{className:"logo-box",children:"Z"}),e.jsx("div",{className:"logo-box",children:"O"})]}),e.jsx("p",{className:"footer-desc",children:"The ultimate platform where knowledge meets competition. Master your academic goals and sports predictions in one elite arena."}),e.jsxs("div",{className:"social-row",children:[e.jsx("button",{className:"social-icon-btn",children:e.jsx(B,{size:18})}),e.jsx("button",{className:"social-icon-btn",children:e.jsx(U,{size:18})}),e.jsx("button",{className:"social-icon-btn",children:e.jsx(J,{size:18})}),e.jsx("button",{className:"social-icon-btn",children:e.jsx(k,{size:18})})]})]}),e.jsxs("div",{className:"footer-links-col",children:[e.jsx("h4",{children:"Explore Zones"}),e.jsxs("ul",{children:[e.jsx("li",{onClick:()=>t("/study-home"),children:"Study Arena"}),e.jsx("li",{onClick:()=>t("/game-home"),children:"Game Arena"}),e.jsx("li",{onClick:()=>t("/history"),children:"History & Archives"})]})]}),e.jsxs("div",{className:"footer-links-col",children:[e.jsx("h4",{children:"Your Profile"}),e.jsxs("ul",{children:[e.jsx("li",{onClick:()=>t("/profile"),children:"Personal Stats"}),e.jsx("li",{onClick:()=>t("/login"),children:"Access Account"})]})]}),e.jsxs("div",{className:"footer-links-col",children:[e.jsx("h4",{children:"Company"}),e.jsxs("ul",{children:[e.jsx("li",{onClick:()=>t("/legal#privacy"),children:"Privacy Policy"}),e.jsx("li",{onClick:()=>t("/legal#refund"),children:"Refund Policy"}),e.jsx("li",{onClick:()=>t("/legal#terms"),children:"Terms of Use"}),e.jsx("li",{onClick:()=>t("/legal#refer"),children:"Refer & Earn"}),e.jsx("li",{onClick:()=>t("/legal#contact"),children:"Contact Us"}),e.jsx("li",{onClick:()=>t("/legal#disclaimer"),children:"Disclaimer"})]})]})]}),e.jsxs("div",{className:"footer-bottom-bar",children:[e.jsxs("div",{className:"copyright-flex",children:[e.jsx("div",{className:"spark-circle",children:e.jsx(G,{size:10,fill:"currentColor"})}),e.jsxs("span",{children:["© ",s," QUZO Global Arena. All Rights Reserved."]})]}),e.jsx("div",{className:"footer-info-tags",children:e.jsx("span",{children:"Secure Connection"})})]})]}),e.jsx("style",{children:`
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
          .site-footer { padding: 2.5rem 0 1.5rem; }
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
      `})]})},K=()=>{const t=P(),s=N(),a=[{id:"home",icon:e.jsx(R,{size:18}),label:"Home",path:"/"},{id:"activity",icon:e.jsx(M,{size:18}),label:"Quiz",path:"/home-choice"},{id:"winners",icon:e.jsx(L,{size:18}),label:"Winners",path:"/leaderboard"},{id:"profile",icon:e.jsx(E,{size:18}),label:"Profile",path:"/profile"}],c=r=>s.pathname===r;return e.jsx("nav",{className:"floating-nav",children:a.map(r=>e.jsxs("button",{onClick:()=>t(r.path),style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",background:"none",border:"none",cursor:"pointer",padding:"4px",position:"relative",color:c(r.path)?"hsl(var(--primary))":"hsl(var(--muted-foreground))",transition:"all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",transform:c(r.path)?"translateY(-2px) scale(1.05)":"none"},children:[e.jsx("div",{style:{position:"relative",zIndex:1,filter:c(r.path)?"drop-shadow(0 0 8px hsla(var(--primary), 0.5))":"none"},children:C.cloneElement(r.icon,{strokeWidth:c(r.path)?2.5:2})}),e.jsx("span",{style:{fontSize:"0.6rem",fontWeight:800,opacity:c(r.path)?1:.7,letterSpacing:"0.01em",textTransform:"uppercase"},children:r.label}),c(r.path)&&e.jsx("div",{style:{position:"absolute",top:"-5px",width:"4px",height:"4px",background:"hsl(var(--primary))",borderRadius:"50%",boxShadow:"0 0 10px hsl(var(--primary))"}})]},r.id))})},i=({children:t,hideHeader:s=!1,hideFooter:a=!1,hideBottomNav:c=!1,hideNav:r=!1})=>r?e.jsx(e.Fragment,{children:t}):e.jsxs("div",{className:"layout-wrapper",style:{display:"flex",flexDirection:"column",minHeight:"100vh",position:"relative"},children:[!s&&e.jsx(Y,{}),e.jsx("main",{className:"main-content",style:{flex:1,paddingBottom:c?"0":"calc(80px + env(safe-area-inset-bottom, 0px))",display:"flex",flexDirection:"column"},children:t}),!c&&e.jsx(K,{}),!a&&e.jsx(Z,{})]});o.lazy(()=>l(()=>import("./SplashPage-BjD7D4ZH.js"),__vite__mapDeps([0,1,2,3])));const X=o.lazy(()=>l(()=>import("./LandingPage-xFUA2-hS.js"),__vite__mapDeps([4,1,2,3]))),ee=o.lazy(()=>l(()=>import("./LoginPage-DYAj_EAq.js"),__vite__mapDeps([5,1,2,3]))),te=o.lazy(()=>l(()=>import("./OtpPage-Bnxa8_a_.js"),__vite__mapDeps([6,1,2,3]))),se=o.lazy(()=>l(()=>import("./RegisterPage-D3U8CJy1.js"),__vite__mapDeps([7,1,2,3]))),re=o.lazy(()=>l(()=>import("./HomeChoicePage-9WVyMKZe.js"),__vite__mapDeps([8,1,2,3]))),I=o.lazy(()=>l(()=>import("./QuizArenaPage-BIlc866P.js"),__vite__mapDeps([9,1,2,3]))),oe=o.lazy(()=>l(()=>import("./StudyHomePage-CI6aU90i.js"),__vite__mapDeps([10,1,2,3]))),ae=o.lazy(()=>l(()=>import("./StudyCategoryPage-EGTyQVyk.js"),__vite__mapDeps([11,1,3,2]))),ne=o.lazy(()=>l(()=>import("./StudyQuizDetailPage-BCfp7uLq.js"),__vite__mapDeps([12,1,2,3]))),ie=o.lazy(()=>l(()=>import("./StudyQuestionPage-RXWBFFli.js"),__vite__mapDeps([13,1,2,3]))),le=o.lazy(()=>l(()=>import("./StudyReviewPage-BgfKJyqz.js"),__vite__mapDeps([14,1,2,3]))),ce=o.lazy(()=>l(()=>import("./StudyResultPage-bW5jhW49.js"),__vite__mapDeps([15,1,2]))),de=o.lazy(()=>l(()=>import("./MatchListPage-C6JeBywy.js"),__vite__mapDeps([16,1,3,2]))),me=o.lazy(()=>l(()=>import("./GameQuizDetailPage-DzcJY2p1.js"),__vite__mapDeps([17,1,2,3]))),pe=o.lazy(()=>l(()=>import("./GameQuestionPage-D_EeiIP7.js"),__vite__mapDeps([18,1,2,3]))),he=o.lazy(()=>l(()=>import("./GameResultPage-Az0cHdHU.js"),__vite__mapDeps([19,1,2]))),ue=o.lazy(()=>l(()=>import("./GameReviewPage-CW1wGTqD.js"),__vite__mapDeps([20,1,2,3]))),xe=o.lazy(()=>l(()=>import("./ProfilePage-DBv85W57.js"),__vite__mapDeps([21,1,2,3]))),ge=o.lazy(()=>l(()=>import("./HistoryPage-DGC1X_cn.js"),__vite__mapDeps([22,1,2,3]))),je=o.lazy(()=>l(()=>import("./ContestListPage-D2l-VChE.js"),__vite__mapDeps([23,1,2,3]))),A=o.lazy(()=>l(()=>import("./LeaderboardPage-uXuSLkuG.js"),__vite__mapDeps([24,1,2,3]))),fe=o.lazy(()=>l(()=>import("./AdminDashboard-BF9NWnQB.js"),__vite__mapDeps([25,1,26,3,2]))),ye=o.lazy(()=>l(()=>import("./AdminLoginPage-B4wG9IaA.js"),__vite__mapDeps([27,1,2,3]))),_e=o.lazy(()=>l(()=>import("./MatchQuizRoom-DVQQg1TA.js"),__vite__mapDeps([28,1,2,3]))),ve=o.lazy(()=>l(()=>import("./DummyQuizFlow-CjaFP7uE.js"),__vite__mapDeps([29,1]))),be=o.lazy(()=>l(()=>import("./LegalPage-D2pMZzdn.js"),__vite__mapDeps([30,1,2]))),ze=o.lazy(()=>l(()=>import("./HowItWorksPage-CPM-WgVE.js"),__vite__mapDeps([31,1,2,3]))),we=o.lazy(()=>l(()=>import("./BalancePage-BOMHciqV.js"),__vite__mapDeps([32,1,2,3]))),Ee=o.lazy(()=>l(()=>import("./VouchersPage-BNEFMRzx.js"),__vite__mapDeps([33,1,2,3]))),Pe=o.lazy(()=>l(()=>import("./QuizReviewPage-DeQaeuZd.js"),__vite__mapDeps([34,1,2,3]))),Se=o.lazy(()=>l(()=>import("./AboutUsPage-CT9BV9QU.js"),__vite__mapDeps([35,1,2,3]))),Ie=o.lazy(()=>l(()=>import("./SupportPage-DeEN342R.js"),__vite__mapDeps([36,1,2,3]))),Ae=o.lazy(()=>l(()=>import("./TransactionPage-C00sPub3.js"),__vite__mapDeps([37,1,2,3]))),Oe=({children:t})=>localStorage.getItem("play11_admin_session")?t:e.jsx(w,{to:"/admin/login",replace:!0}),Ne=({children:t})=>t,Re=()=>(o.useEffect(()=>{if(!localStorage.getItem("play11_guest_id")){const t="guest-"+Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15);localStorage.setItem("play11_guest_id",t)}},[]),e.jsx($,{children:e.jsxs("div",{className:"app-shell",style:{minHeight:"100vh",position:"relative"},children:[e.jsxs("div",{className:"mesh-bg-premium",children:[e.jsx("div",{className:"bg-blob blob-1"}),e.jsx("div",{className:"bg-blob blob-2"}),e.jsx("div",{className:"bg-blob blob-3"})]}),e.jsx(o.Suspense,{fallback:null,children:e.jsxs(q,{children:[e.jsx(n,{path:"/",element:e.jsx(i,{hideNav:!0,children:e.jsx(X,{})})}),e.jsx(n,{path:"/login",element:e.jsx(i,{hideNav:!0,children:e.jsx(ee,{})})}),e.jsx(n,{path:"/otp",element:e.jsx(i,{hideNav:!0,children:e.jsx(te,{})})}),e.jsx(n,{path:"/register",element:e.jsx(i,{hideNav:!0,children:e.jsx(se,{})})}),e.jsx(n,{path:"/home-choice",element:e.jsx(i,{children:e.jsx(re,{})})}),e.jsx(n,{path:"/study-home",element:e.jsx(i,{children:e.jsx(oe,{})})}),e.jsx(n,{path:"/quiz-arena/:zoneId",element:e.jsx(i,{children:e.jsx(I,{})})}),e.jsx(n,{path:"/study-arena",element:e.jsx(i,{children:e.jsx(I,{})})}),e.jsx(n,{path:"/game-home",element:e.jsx(w,{to:"/quiz-arena/sport-zone",replace:!0})}),e.jsx(n,{path:"/study-category/:id",element:e.jsx(i,{children:e.jsx(ae,{})})}),e.jsx(n,{path:"/study-quiz-detail/:id",element:e.jsx(i,{children:e.jsx(ne,{})})}),e.jsx(n,{path:"/study-quiz-play/:id",element:e.jsx(i,{hideNav:!0,children:e.jsx(ie,{})})}),e.jsx(n,{path:"/study-review/:id",element:e.jsx(i,{children:e.jsx(le,{})})}),e.jsx(n,{path:"/study-result/:id",element:e.jsx(i,{children:e.jsx(ce,{})})}),e.jsx(n,{path:"/match-list",element:e.jsx(i,{children:e.jsx(de,{})})}),e.jsx(n,{path:"/game-quiz-detail/:id",element:e.jsx(i,{children:e.jsx(me,{})})}),e.jsx(n,{path:"/game-quiz-play/:id",element:e.jsx(i,{hideNav:!0,children:e.jsx(pe,{})})}),e.jsx(n,{path:"/game-review/:id",element:e.jsx(i,{children:e.jsx(ue,{})})}),e.jsx(n,{path:"/game-result/:id",element:e.jsx(i,{children:e.jsx(he,{})})}),e.jsx(n,{path:"/match-quiz-room/:id",element:e.jsx(Ne,{children:e.jsx(i,{children:e.jsx(_e,{})})})}),e.jsx(n,{path:"/dummy-quiz-flow",element:e.jsx(i,{children:e.jsx(ve,{})})}),e.jsx(n,{path:"/contests",element:e.jsx(i,{children:e.jsx(je,{})})}),e.jsx(n,{path:"/leaderboard",element:e.jsx(i,{children:e.jsx(A,{})})}),e.jsx(n,{path:"/leaderboard/:id",element:e.jsx(i,{children:e.jsx(A,{})})}),e.jsx(n,{path:"/profile",element:e.jsx(i,{children:e.jsx(xe,{})})}),e.jsx(n,{path:"/history",element:e.jsx(i,{children:e.jsx(ge,{})})}),e.jsx(n,{path:"/balance",element:e.jsx(i,{children:e.jsx(we,{})})}),e.jsx(n,{path:"/vouchers",element:e.jsx(i,{children:e.jsx(Ee,{})})}),e.jsx(n,{path:"/quiz-review/:id",element:e.jsx(i,{children:e.jsx(Pe,{})})}),e.jsx(n,{path:"/transaction/:type",element:e.jsx(i,{children:e.jsx(Ae,{})})}),e.jsx(n,{path:"/admin/login",element:e.jsx(i,{hideNav:!0,children:e.jsx(ye,{})})}),e.jsx(n,{path:"/admin",element:e.jsx(Oe,{children:e.jsx(i,{hideNav:!0,children:e.jsx(fe,{})})})}),e.jsx(n,{path:"/legal",element:e.jsx(i,{children:e.jsx(be,{})})}),e.jsx(n,{path:"/about",element:e.jsx(i,{children:e.jsx(Se,{})})}),e.jsx(n,{path:"/support",element:e.jsx(i,{children:e.jsx(Ie,{})})}),e.jsx(n,{path:"/how-it-works",element:e.jsx(i,{children:e.jsx(ze,{})})}),e.jsx(n,{path:"*",element:e.jsx(w,{to:"/",replace:!0})})]})})]})})),x="/api",b={get(t){try{const s=sessionStorage.getItem(`play11_cache:${t}`);if(!s)return null;const{data:a,expiry:c}=JSON.parse(s);return Date.now()>c?(sessionStorage.removeItem(`play11_cache:${t}`),null):a}catch{return null}},set(t,s,a=6e4){try{sessionStorage.setItem(`play11_cache:${t}`,JSON.stringify({data:s,expiry:Date.now()+a}))}catch{}},invalidate(){try{Object.keys(sessionStorage).filter(t=>t.startsWith("play11_cache:")).forEach(t=>sessionStorage.removeItem(t))}catch{}}},z={store:new Map,get(t,s=8e3){const a=this.store.get(t);return a?Date.now()-a.timestamp>s?(this.store.delete(t),null):a.data:null},set(t,s){this.store.set(t,{data:s,timestamp:Date.now()})},invalidate(){this.store.clear()}},g=async(t,s={},a=8e3)=>{if((s.method||"GET").toUpperCase()!=="GET")return z.invalidate(),fetch(t,s);const r=s.headers?s.headers.Authorization:"",m=`${t}:${r||""}`,u=z.get(m,a);if(u)return{ok:!0,status:200,json:async()=>JSON.parse(JSON.stringify(u)),_fromCache:!0};const p=await fetch(t,s);if(p.ok){const d=p.clone();try{const h=await d.json();z.set(m,h)}catch{}}return p},f=()=>{const t=localStorage.getItem("play11_session")||localStorage.getItem("play11_admin_session");if(t)try{const s=JSON.parse(t);return{Authorization:`Bearer ${typeof s=="object"&&s.token||t}`}}catch{return{Authorization:`Bearer ${t}`}}return{}},j=async t=>{if(t.status===401)throw localStorage.removeItem("play11_session"),localStorage.removeItem("play11_admin_session"),new Error("Session expired. Please login again.");if(!t.ok){let a="API request failed";try{const c=await t.json();a=c.message||c.error||a}catch{}throw new Error(a)}const s=await t.json();return s.history||s.categories||s.quizzes||s.questions||s.quiz||s.user||s.stats||s.users||s},O={sendOtp:async t=>{const s=await g(`${x}/auth/send-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:t})});return j(s)},verifyOtp:async(t,s,a)=>{const c=await g(`${x}/auth/verify-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:t,otp_code:s,firebaseToken:a})}),r=await j(c);return r.token&&localStorage.setItem("play11_session",JSON.stringify({token:r.token,user:r.user})),r},updateProfile:async t=>{const s=await g(`${x}/auth/update-profile`,{method:"POST",headers:{"Content-Type":"application/json",...f()},body:JSON.stringify({name:t})});return j(s)},getHistory:async()=>{const t=await g(`${x}/auth/history`,{headers:{...f()}});return j(t)},logout:()=>{z.invalidate(),b.invalidate(),localStorage.removeItem("play11_session"),localStorage.removeItem("play11_admin_session")}},Ve={getStudyCategories:async()=>{const t=await g(`${x}/categories/study`);return await j(t)},getGameCategories:async()=>{const t=await g(`${x}/categories/game`);return await j(t)},getQuizzesByZone:async t=>{const s=await g(`${x}/quizzes/zone/${t}`,{headers:{...f()}});return await j(s)},getAllQuizzes:async()=>{const t=await g(`${x}/quizzes`,{headers:{...f()}});return await j(t)},getJoinedQuizzes:async()=>{const t=await g(`${x}/quizzes/joined`,{headers:{...f()}});return await j(t)},getQuizzes:async t=>{const s=await g(`${x}/quizzes/category/${t}`);return await j(s)},getQuizById:async t=>{const s=await g(`${x}/quizzes/${t}`,{headers:{...f()}});return j(s)},getQuestions:async t=>{const s=await g(`${x}/quizzes/${t}/questions`,{headers:{...f()}});return j(s)},submitQuiz:async(t,s)=>{const a=await g(`${x}/quizzes/${t}/submit`,{method:"POST",headers:{"Content-Type":"application/json",...f()},body:JSON.stringify({answers:s})});return j(a)}},$e={getSetting:async t=>{const s=await g(`${x}/settings/${t}`);return j(s)},getBatchSettings:async(t=[])=>{const s="settings_batch_"+(t.length?t.sort().join(","):"all"),a=b.get(s);if(a)return{success:!0,settings:a};const c=t.length?`?keys=${t.join(",")}`:"",m=await(await fetch(`${x}/settings/batch${c}`)).json();return m.success&&b.set(s,m.settings,6e4),m},updateSetting:async(t,s)=>{const a=await g(`${x}/settings/update`,{method:"POST",headers:{"Content-Type":"application/json",...f()},body:JSON.stringify({key:t,value:s})});return b.invalidate(),j(a)}},ke=o.createContext(null),Le=({children:t})=>{const[s,a]=o.useState(null),[c,r]=o.useState(!0);o.useEffect(()=>{const p=localStorage.getItem("play11_session"),d=localStorage.getItem("play11_user");if(p&&d)try{a(JSON.parse(d))}catch(h){console.error("Session user parsing error",h),localStorage.removeItem("play11_user")}r(!1)},[]);const m=async(p,d)=>{const h=await O.verifyOtp(p,d);return h.success&&a(h.user),h},u=()=>{O.logout(),a(null)};return e.jsx(ke.Provider,{value:{user:s,loading:c,login:m,logout:u},children:t})};V.createRoot(document.getElementById("root")).render(e.jsx(o.StrictMode,{children:e.jsx(Le,{children:e.jsx(Re,{})})}));export{Y as H,Ve as q,$e as s};
