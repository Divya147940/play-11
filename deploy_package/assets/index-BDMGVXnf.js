const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/SplashPage-BjD7D4ZH.js","assets/vendor-core-754eFBWZ.js","assets/vendor-router-DpCHN5bO.js","assets/vendor-lucide-Czx_Sl3Z.js","assets/LandingPage-xFUA2-hS.js","assets/LoginPage-DYAj_EAq.js","assets/OtpPage-Bnxa8_a_.js","assets/RegisterPage-D3U8CJy1.js","assets/HomeChoicePage-Dd5RZXa5.js","assets/QuizArenaPage-NRoGMoqH.js","assets/StudyHomePage-CI6aU90i.js","assets/StudyCategoryPage-EGTyQVyk.js","assets/StudyQuizDetailPage-TzWNDlbV.js","assets/StudyQuestionPage-GrGHEtkQ.js","assets/StudyReviewPage-BgfKJyqz.js","assets/StudyResultPage-bW5jhW49.js","assets/MatchListPage-C6JeBywy.js","assets/GameQuizDetailPage-Cx3HQ50D.js","assets/GameQuestionPage-DvWzHjH7.js","assets/GameResultPage-Az0cHdHU.js","assets/GameReviewPage-CW1wGTqD.js","assets/ProfilePage-BOtunGaH.js","assets/HistoryPage-Duub-XY2.js","assets/ContestListPage-D3DZSjrv.js","assets/LeaderboardPage-uXuSLkuG.js","assets/AdminDashboard-DgjVygDc.js","assets/vendor-tesseract-DR4Ucv4Y.js","assets/AdminLoginPage-B4wG9IaA.js","assets/MatchQuizRoom-CYpyI6Si.js","assets/DummyQuizFlow-CjaFP7uE.js","assets/LegalPage-D2pMZzdn.js","assets/HowItWorksPage-CPM-WgVE.js","assets/BalancePage-B8bwhzGm.js","assets/VouchersPage-BNEFMRzx.js","assets/QuizReviewPage-BetxLo2r.js","assets/AboutUsPage-CT9BV9QU.js","assets/SupportPage-DeEN342R.js"])))=>i.map(i=>d[i]);
import{r,j as e,R as D,c as C}from"./vendor-core-754eFBWZ.js";import{u as E,a as O,B as V,R as $,b as a,N as z}from"./vendor-router-DpCHN5bO.js";import{U as w,X as q,M as Q,H as N,G as k,T as R,a as H,P as U,b as B,S as M,c as G}from"./vendor-lucide-Czx_Sl3Z.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))d(o);new MutationObserver(o=>{for(const p of o)if(p.type==="childList")for(const h of p.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&d(h)}).observe(document,{childList:!0,subtree:!0});function i(o){const p={};return o.integrity&&(p.integrity=o.integrity),o.referrerPolicy&&(p.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?p.credentials="include":o.crossOrigin==="anonymous"?p.credentials="omit":p.credentials="same-origin",p}function d(o){if(o.ep)return;o.ep=!0;const p=i(o);fetch(o.href,p)}})();const J="modulepreload",W=function(t){return"/"+t},S={},l=function(s,i,d){let o=Promise.resolve();if(i&&i.length>0){let h=function(u){return Promise.all(u.map(_=>Promise.resolve(_).then(b=>({status:"fulfilled",value:b}),b=>({status:"rejected",reason:b}))))};document.getElementsByTagName("link");const m=document.querySelector("meta[property=csp-nonce]"),c=(m==null?void 0:m.nonce)||(m==null?void 0:m.getAttribute("nonce"));o=h(i.map(u=>{if(u=W(u),u in S)return;S[u]=!0;const _=u.endsWith(".css"),b=_?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${b}`))return;const y=document.createElement("link");if(y.rel=_?"stylesheet":J,_||(y.as="script"),y.crossOrigin="",y.href=u,c&&y.setAttribute("nonce",c),document.head.appendChild(y),_)return new Promise((L,T)=>{y.addEventListener("load",L),y.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${u}`)))})}))}function p(h){const m=new Event("vite:preloadError",{cancelable:!0});if(m.payload=h,window.dispatchEvent(m),!m.defaultPrevented)throw h}return o.then(h=>{for(const m of h||[])m.status==="rejected"&&p(m.reason);return s().catch(p)})},F=()=>{const[t,s]=r.useState(!1),[i,d]=r.useState(!1),o=E(),p=O();localStorage.getItem("user_mobile"),localStorage.getItem("user_name"),r.useEffect(()=>{const c=()=>d(window.scrollY>20);return window.addEventListener("scroll",c),()=>window.removeEventListener("scroll",c)},[]);const h=[{name:"Home",path:"/",icon:e.jsx(N,{size:18})},{name:"Quiz Arena",path:"/home-choice",icon:e.jsx(k,{size:18})},{name:"Leaderboard",path:"/leaderboard",icon:e.jsx(R,{size:18})}],m=c=>p.pathname===c;return e.jsxs("nav",{className:"topbar",children:[e.jsxs("div",{className:"topbar-inner",children:[e.jsxs("div",{className:"logo-boxes",onClick:()=>o("/"),style:{cursor:"pointer",display:"flex",alignItems:"center",gap:"4px"},children:[e.jsx("div",{className:"logo-box",children:"Q"}),e.jsx("div",{className:"logo-box",children:"U"}),e.jsx("div",{className:"logo-box",children:"Z"}),e.jsx("div",{className:"logo-box",children:"O"})]}),e.jsxs("div",{className:"desktop-nav",style:{display:"none"},children:[h.map(c=>e.jsx("button",{onClick:()=>o(c.path),className:`nav-link-btn ${m(c.path)?"active":""}`,children:c.name},c.path)),e.jsx("div",{style:{width:"1px",height:"20px",background:"rgba(255,255,255,0.1)",margin:"0 0.5rem"}}),e.jsx("div",{style:{display:"flex",alignItems:"center",gap:"0.8rem"},children:e.jsxs("button",{onClick:()=>o("/history"),className:"user-profile-btn",children:[e.jsx("div",{style:{width:"28px",height:"28px",borderRadius:"50%",background:"linear-gradient(135deg, #38bdf8, #1d4ed8)",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(w,{size:14,color:"white"})}),e.jsx("span",{style:{fontWeight:800,fontSize:"0.8rem"},children:"My Activity"})]})})]}),e.jsx("button",{className:"menu-toggle",onClick:()=>s(!t),children:t?e.jsx(q,{size:24}):e.jsx(Q,{size:24})})]}),t&&e.jsx("div",{className:"mobile-nav-overlay",style:{position:"fixed",top:"66px",left:0,right:0,bottom:0,background:"#0d1f3c",backdropFilter:"blur(20px)",zIndex:999,padding:"2rem"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[h.map(c=>e.jsxs("button",{onClick:()=>{o(c.path),s(!1)},style:{background:m(c.path)?"rgba(59, 130, 246, 0.1)":"transparent",border:"none",padding:"1.25rem",borderRadius:"1.25rem",textAlign:"left",display:"flex",alignItems:"center",gap:"1rem",fontSize:"1.1rem",fontWeight:800,color:m(c.path)?"#38bdf8":"white"},children:[c.icon,c.name]},c.path)),e.jsx("hr",{style:{border:"none",height:"1px",background:"rgba(255,255,255,0.1)",margin:"1rem 0"}}),e.jsxs("button",{onClick:()=>{o("/history"),s(!1)},style:{background:"rgba(255,255,255,0.05)",border:"none",padding:"1.25rem",borderRadius:"1.25rem",display:"flex",alignItems:"center",gap:"1rem",fontSize:"1.1rem",fontWeight:800,color:"white"},children:[e.jsx(w,{size:20})," My Activity"]})]})}),e.jsx("style",{children:`
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          .menu-toggle { display: none !important; }
        }
      `})]})},Y=()=>{const t=E(),s=new Date().getFullYear();return e.jsxs("footer",{className:"site-footer",children:[e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:"footer-grid",children:[e.jsxs("div",{className:"footer-brand",children:[e.jsxs("div",{className:"logo-boxes",onClick:()=>t("/"),style:{cursor:"pointer",marginBottom:"1.25rem"},children:[e.jsx("div",{className:"logo-box",children:"Q"}),e.jsx("div",{className:"logo-box",children:"U"}),e.jsx("div",{className:"logo-box",children:"Z"}),e.jsx("div",{className:"logo-box",children:"O"})]}),e.jsx("p",{className:"footer-desc",children:"The ultimate platform where knowledge meets competition. Master your academic goals and sports predictions in one elite arena."}),e.jsxs("div",{className:"social-row",children:[e.jsx("button",{className:"social-icon-btn",children:e.jsx(H,{size:18})}),e.jsx("button",{className:"social-icon-btn",children:e.jsx(U,{size:18})}),e.jsx("button",{className:"social-icon-btn",children:e.jsx(B,{size:18})}),e.jsx("button",{className:"social-icon-btn",children:e.jsx(k,{size:18})})]})]}),e.jsxs("div",{className:"footer-links-col",children:[e.jsx("h4",{children:"Explore Zones"}),e.jsxs("ul",{children:[e.jsx("li",{onClick:()=>t("/study-home"),children:"Study Arena"}),e.jsx("li",{onClick:()=>t("/game-home"),children:"Game Arena"}),e.jsx("li",{onClick:()=>t("/history"),children:"History & Archives"})]})]}),e.jsxs("div",{className:"footer-links-col",children:[e.jsx("h4",{children:"Your Profile"}),e.jsxs("ul",{children:[e.jsx("li",{onClick:()=>t("/profile"),children:"Personal Stats"}),e.jsx("li",{onClick:()=>t("/login"),children:"Access Account"})]})]}),e.jsxs("div",{className:"footer-links-col",children:[e.jsx("h4",{children:"Company"}),e.jsxs("ul",{children:[e.jsx("li",{onClick:()=>t("/legal#privacy"),children:"Privacy Policy"}),e.jsx("li",{onClick:()=>t("/legal#refund"),children:"Refund Policy"}),e.jsx("li",{onClick:()=>t("/legal#terms"),children:"Terms of Use"}),e.jsx("li",{onClick:()=>t("/legal#refer"),children:"Refer & Earn"}),e.jsx("li",{onClick:()=>t("/legal#contact"),children:"Contact Us"}),e.jsx("li",{onClick:()=>t("/legal#disclaimer"),children:"Disclaimer"})]})]})]}),e.jsxs("div",{className:"footer-bottom-bar",children:[e.jsxs("div",{className:"copyright-flex",children:[e.jsx("div",{className:"spark-circle",children:e.jsx(M,{size:10,fill:"currentColor"})}),e.jsxs("span",{children:["© ",s," QUZO Global Arena. All Rights Reserved."]})]}),e.jsx("div",{className:"footer-info-tags",children:e.jsx("span",{children:"Secure Connection"})})]})]}),e.jsx("style",{children:`
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
      `})]})},Z=()=>{const t=E(),s=O(),i=[{id:"home",icon:e.jsx(N,{size:18}),label:"Home",path:"/"},{id:"activity",icon:e.jsx(G,{size:18}),label:"Quiz",path:"/home-choice"},{id:"winners",icon:e.jsx(R,{size:18}),label:"Winners",path:"/leaderboard"},{id:"profile",icon:e.jsx(w,{size:18}),label:"Profile",path:"/profile"}],d=o=>s.pathname===o;return e.jsx("nav",{className:"floating-nav",children:i.map(o=>e.jsxs("button",{onClick:()=>t(o.path),style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",background:"none",border:"none",cursor:"pointer",padding:"4px",position:"relative",color:d(o.path)?"hsl(var(--primary))":"hsl(var(--muted-foreground))",transition:"all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",transform:d(o.path)?"translateY(-2px) scale(1.05)":"none"},children:[e.jsx("div",{style:{position:"relative",zIndex:1,filter:d(o.path)?"drop-shadow(0 0 8px hsla(var(--primary), 0.5))":"none"},children:D.cloneElement(o.icon,{strokeWidth:d(o.path)?2.5:2})}),e.jsx("span",{style:{fontSize:"0.6rem",fontWeight:800,opacity:d(o.path)?1:.7,letterSpacing:"0.01em",textTransform:"uppercase"},children:o.label}),d(o.path)&&e.jsx("div",{style:{position:"absolute",top:"-5px",width:"4px",height:"4px",background:"hsl(var(--primary))",borderRadius:"50%",boxShadow:"0 0 10px hsl(var(--primary))"}})]},o.id))})},n=({children:t,hideHeader:s=!1,hideFooter:i=!1,hideBottomNav:d=!1,hideNav:o=!1})=>o?e.jsx(e.Fragment,{children:t}):e.jsxs("div",{className:"layout-wrapper",style:{display:"flex",flexDirection:"column",minHeight:"100vh",position:"relative"},children:[!s&&e.jsx(F,{}),e.jsx("main",{className:"main-content",style:{flex:1,paddingBottom:d?"0":"calc(80px + env(safe-area-inset-bottom, 0px))",display:"flex",flexDirection:"column"},children:t}),!d&&e.jsx(Z,{}),!i&&e.jsx(Y,{})]});r.lazy(()=>l(()=>import("./SplashPage-BjD7D4ZH.js"),__vite__mapDeps([0,1,2,3])));const K=r.lazy(()=>l(()=>import("./LandingPage-xFUA2-hS.js"),__vite__mapDeps([4,1,2,3]))),X=r.lazy(()=>l(()=>import("./LoginPage-DYAj_EAq.js"),__vite__mapDeps([5,1,2,3]))),ee=r.lazy(()=>l(()=>import("./OtpPage-Bnxa8_a_.js"),__vite__mapDeps([6,1,2,3]))),te=r.lazy(()=>l(()=>import("./RegisterPage-D3U8CJy1.js"),__vite__mapDeps([7,1,2,3]))),se=r.lazy(()=>l(()=>import("./HomeChoicePage-Dd5RZXa5.js"),__vite__mapDeps([8,1,2,3]))),A=r.lazy(()=>l(()=>import("./QuizArenaPage-NRoGMoqH.js"),__vite__mapDeps([9,1,2,3]))),oe=r.lazy(()=>l(()=>import("./StudyHomePage-CI6aU90i.js"),__vite__mapDeps([10,1,2,3]))),re=r.lazy(()=>l(()=>import("./StudyCategoryPage-EGTyQVyk.js"),__vite__mapDeps([11,1,3,2]))),ae=r.lazy(()=>l(()=>import("./StudyQuizDetailPage-TzWNDlbV.js"),__vite__mapDeps([12,1,2,3]))),ne=r.lazy(()=>l(()=>import("./StudyQuestionPage-GrGHEtkQ.js"),__vite__mapDeps([13,1,2,3]))),ie=r.lazy(()=>l(()=>import("./StudyReviewPage-BgfKJyqz.js"),__vite__mapDeps([14,1,2,3]))),le=r.lazy(()=>l(()=>import("./StudyResultPage-bW5jhW49.js"),__vite__mapDeps([15,1,2]))),ce=r.lazy(()=>l(()=>import("./MatchListPage-C6JeBywy.js"),__vite__mapDeps([16,1,3,2]))),de=r.lazy(()=>l(()=>import("./GameQuizDetailPage-Cx3HQ50D.js"),__vite__mapDeps([17,1,2,3]))),me=r.lazy(()=>l(()=>import("./GameQuestionPage-DvWzHjH7.js"),__vite__mapDeps([18,1,2,3]))),pe=r.lazy(()=>l(()=>import("./GameResultPage-Az0cHdHU.js"),__vite__mapDeps([19,1,2]))),ue=r.lazy(()=>l(()=>import("./GameReviewPage-CW1wGTqD.js"),__vite__mapDeps([20,1,2,3]))),he=r.lazy(()=>l(()=>import("./ProfilePage-BOtunGaH.js"),__vite__mapDeps([21,1,2,3]))),xe=r.lazy(()=>l(()=>import("./HistoryPage-Duub-XY2.js"),__vite__mapDeps([22,1,2,3]))),ge=r.lazy(()=>l(()=>import("./ContestListPage-D3DZSjrv.js"),__vite__mapDeps([23,1,2,3]))),I=r.lazy(()=>l(()=>import("./LeaderboardPage-uXuSLkuG.js"),__vite__mapDeps([24,1,2,3]))),je=r.lazy(()=>l(()=>import("./AdminDashboard-DgjVygDc.js"),__vite__mapDeps([25,1,26,3,2]))),fe=r.lazy(()=>l(()=>import("./AdminLoginPage-B4wG9IaA.js"),__vite__mapDeps([27,1,2,3]))),ye=r.lazy(()=>l(()=>import("./MatchQuizRoom-CYpyI6Si.js"),__vite__mapDeps([28,1,2,3]))),_e=r.lazy(()=>l(()=>import("./DummyQuizFlow-CjaFP7uE.js"),__vite__mapDeps([29,1]))),be=r.lazy(()=>l(()=>import("./LegalPage-D2pMZzdn.js"),__vite__mapDeps([30,1,2]))),ve=r.lazy(()=>l(()=>import("./HowItWorksPage-CPM-WgVE.js"),__vite__mapDeps([31,1,2,3]))),ze=r.lazy(()=>l(()=>import("./BalancePage-B8bwhzGm.js"),__vite__mapDeps([32,1,2,3]))),we=r.lazy(()=>l(()=>import("./VouchersPage-BNEFMRzx.js"),__vite__mapDeps([33,1,2,3]))),Pe=r.lazy(()=>l(()=>import("./QuizReviewPage-BetxLo2r.js"),__vite__mapDeps([34,1,2,3]))),Ee=r.lazy(()=>l(()=>import("./AboutUsPage-CT9BV9QU.js"),__vite__mapDeps([35,1,2,3]))),Se=r.lazy(()=>l(()=>import("./SupportPage-DeEN342R.js"),__vite__mapDeps([36,1,2,3]))),Ae=({children:t})=>localStorage.getItem("play11_admin_session")?t:e.jsx(z,{to:"/admin/login",replace:!0}),Ie=({children:t})=>t,Oe=()=>(r.useEffect(()=>{if(!localStorage.getItem("play11_guest_id")){const t="guest-"+Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15);localStorage.setItem("play11_guest_id",t)}},[]),e.jsx(V,{children:e.jsxs("div",{className:"app-shell",style:{minHeight:"100vh",position:"relative"},children:[e.jsxs("div",{className:"mesh-bg-premium",children:[e.jsx("div",{className:"bg-blob blob-1"}),e.jsx("div",{className:"bg-blob blob-2"}),e.jsx("div",{className:"bg-blob blob-3"})]}),e.jsx(r.Suspense,{fallback:null,children:e.jsxs($,{children:[e.jsx(a,{path:"/",element:e.jsx(n,{hideNav:!0,children:e.jsx(K,{})})}),e.jsx(a,{path:"/login",element:e.jsx(n,{hideNav:!0,children:e.jsx(X,{})})}),e.jsx(a,{path:"/otp",element:e.jsx(n,{hideNav:!0,children:e.jsx(ee,{})})}),e.jsx(a,{path:"/register",element:e.jsx(n,{hideNav:!0,children:e.jsx(te,{})})}),e.jsx(a,{path:"/home-choice",element:e.jsx(n,{children:e.jsx(se,{})})}),e.jsx(a,{path:"/study-home",element:e.jsx(n,{children:e.jsx(oe,{})})}),e.jsx(a,{path:"/quiz-arena/:zoneId",element:e.jsx(n,{children:e.jsx(A,{})})}),e.jsx(a,{path:"/study-arena",element:e.jsx(n,{children:e.jsx(A,{})})}),e.jsx(a,{path:"/game-home",element:e.jsx(z,{to:"/quiz-arena/sport-zone",replace:!0})}),e.jsx(a,{path:"/study-category/:id",element:e.jsx(n,{children:e.jsx(re,{})})}),e.jsx(a,{path:"/study-quiz-detail/:id",element:e.jsx(n,{children:e.jsx(ae,{})})}),e.jsx(a,{path:"/study-quiz-play/:id",element:e.jsx(n,{hideNav:!0,children:e.jsx(ne,{})})}),e.jsx(a,{path:"/study-review/:id",element:e.jsx(n,{children:e.jsx(ie,{})})}),e.jsx(a,{path:"/study-result/:id",element:e.jsx(n,{children:e.jsx(le,{})})}),e.jsx(a,{path:"/match-list",element:e.jsx(n,{children:e.jsx(ce,{})})}),e.jsx(a,{path:"/game-quiz-detail/:id",element:e.jsx(n,{children:e.jsx(de,{})})}),e.jsx(a,{path:"/game-quiz-play/:id",element:e.jsx(n,{hideNav:!0,children:e.jsx(me,{})})}),e.jsx(a,{path:"/game-review/:id",element:e.jsx(n,{children:e.jsx(ue,{})})}),e.jsx(a,{path:"/game-result/:id",element:e.jsx(n,{children:e.jsx(pe,{})})}),e.jsx(a,{path:"/match-quiz-room/:id",element:e.jsx(Ie,{children:e.jsx(n,{children:e.jsx(ye,{})})})}),e.jsx(a,{path:"/dummy-quiz-flow",element:e.jsx(n,{children:e.jsx(_e,{})})}),e.jsx(a,{path:"/contests",element:e.jsx(n,{children:e.jsx(ge,{})})}),e.jsx(a,{path:"/leaderboard",element:e.jsx(n,{children:e.jsx(I,{})})}),e.jsx(a,{path:"/leaderboard/:id",element:e.jsx(n,{children:e.jsx(I,{})})}),e.jsx(a,{path:"/profile",element:e.jsx(n,{children:e.jsx(he,{})})}),e.jsx(a,{path:"/history",element:e.jsx(n,{children:e.jsx(xe,{})})}),e.jsx(a,{path:"/balance",element:e.jsx(n,{children:e.jsx(ze,{})})}),e.jsx(a,{path:"/vouchers",element:e.jsx(n,{children:e.jsx(we,{})})}),e.jsx(a,{path:"/quiz-review/:id",element:e.jsx(n,{children:e.jsx(Pe,{})})}),e.jsx(a,{path:"/admin/login",element:e.jsx(n,{hideNav:!0,children:e.jsx(fe,{})})}),e.jsx(a,{path:"/admin",element:e.jsx(Ae,{children:e.jsx(n,{hideNav:!0,children:e.jsx(je,{})})})}),e.jsx(a,{path:"/legal",element:e.jsx(n,{children:e.jsx(be,{})})}),e.jsx(a,{path:"/about",element:e.jsx(n,{children:e.jsx(Ee,{})})}),e.jsx(a,{path:"/support",element:e.jsx(n,{children:e.jsx(Se,{})})}),e.jsx(a,{path:"/how-it-works",element:e.jsx(n,{children:e.jsx(ve,{})})}),e.jsx(a,{path:"*",element:e.jsx(z,{to:"/",replace:!0})})]})})]})})),x="/api",v={store:new Map,get(t,s=8e3){const i=this.store.get(t);return i?Date.now()-i.timestamp>s?(this.store.delete(t),null):i.data:null},set(t,s){this.store.set(t,{data:s,timestamp:Date.now()})},invalidate(){this.store.clear()}},g=async(t,s={},i=8e3)=>{if((s.method||"GET").toUpperCase()!=="GET")return v.invalidate(),fetch(t,s);const o=s.headers?s.headers.Authorization:"",p=`${t}:${o||""}`,h=v.get(p,i);if(h)return{ok:!0,status:200,json:async()=>JSON.parse(JSON.stringify(h)),_fromCache:!0};const m=await fetch(t,s);if(m.ok){const c=m.clone();try{const u=await c.json();v.set(p,u)}catch{}}return m},f=()=>{const t=localStorage.getItem("play11_session")||localStorage.getItem("play11_admin_session");if(t)try{const s=JSON.parse(t);return{Authorization:`Bearer ${typeof s=="object"&&s.token||t}`}}catch{return{Authorization:`Bearer ${t}`}}return{}},j=async t=>{if(t.status===401)throw localStorage.removeItem("play11_session"),localStorage.removeItem("play11_admin_session"),new Error("Session expired. Please login again.");if(!t.ok){let i="API request failed";try{const d=await t.json();i=d.message||d.error||i}catch{}throw new Error(i)}const s=await t.json();return s.history||s.categories||s.quizzes||s.questions||s.quiz||s.user||s.stats||s.users||s},P={sendOtp:async t=>{const s=await g(`${x}/auth/send-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:t})});return j(s)},verifyOtp:async(t,s,i)=>{const d=await g(`${x}/auth/verify-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:t,otp_code:s,firebaseToken:i})}),o=await j(d);return o.token&&localStorage.setItem("play11_session",JSON.stringify({token:o.token,user:o.user})),o},updateProfile:async t=>{const s=await g(`${x}/auth/update-profile`,{method:"POST",headers:{"Content-Type":"application/json",...f()},body:JSON.stringify({name:t})});return j(s)},getHistory:async()=>{const t=await g(`${x}/auth/history`,{headers:{...f()}});return j(t)},logout:()=>{v.invalidate(),localStorage.removeItem("play11_session"),localStorage.removeItem("play11_admin_session")}},Ne={getStudyCategories:async()=>{const t=await g(`${x}/categories/study`);return await j(t)},getGameCategories:async()=>{const t=await g(`${x}/categories/game`);return await j(t)},getQuizzesByZone:async t=>{const s=await g(`${x}/quizzes/zone/${t}`,{headers:{...f()}});return await j(s)},getAllQuizzes:async()=>{const t=await g(`${x}/quizzes`,{headers:{...f()}});return await j(t)},getJoinedQuizzes:async()=>{const t=await g(`${x}/quizzes/joined`,{headers:{...f()}});return await j(t)},getQuizzes:async t=>{const s=await g(`${x}/quizzes/category/${t}`);return await j(s)},getQuizById:async t=>{const s=await g(`${x}/quizzes/${t}`,{headers:{...f()}});return j(s)},getQuestions:async t=>{const s=await g(`${x}/quizzes/${t}/questions`,{headers:{...f()}});return j(s)},submitQuiz:async(t,s)=>{const i=await g(`${x}/quizzes/${t}/submit`,{method:"POST",headers:{"Content-Type":"application/json",...f()},body:JSON.stringify({answers:s})});return j(i)}},ke={getStats:async()=>{const t=await g(`${x}/admin/dashboard`,{headers:{...f()}});return j(t)},getUsers:async(t=1)=>{const s=await g(`${x}/admin/users?page=${t}`,{headers:{...f()}});return j(s)}},Re={getSetting:async t=>{const s=await g(`${x}/settings/${t}`);return j(s)},updateSetting:async(t,s)=>{const i=await g(`${x}/settings/update`,{method:"POST",headers:{"Content-Type":"application/json",...f()},body:JSON.stringify({key:t,value:s})});return j(i)}},$e=Object.freeze(Object.defineProperty({__proto__:null,adminService:ke,authService:P,quizService:Ne,settingsService:Re},Symbol.toStringTag,{value:"Module"})),Le=r.createContext(null),Te=({children:t})=>{const[s,i]=r.useState(null),[d,o]=r.useState(!0);r.useEffect(()=>{const m=localStorage.getItem("play11_session"),c=localStorage.getItem("play11_user");if(m&&c)try{i(JSON.parse(c))}catch(u){console.error("Session user parsing error",u),localStorage.removeItem("play11_user")}o(!1)},[]);const p=async(m,c)=>{const u=await P.verifyOtp(m,c);return u.success&&i(u.user),u},h=()=>{P.logout(),i(null)};return e.jsx(Le.Provider,{value:{user:s,loading:d,login:p,logout:h},children:t})};C.createRoot(document.getElementById("root")).render(e.jsx(r.StrictMode,{children:e.jsx(Te,{children:e.jsx(Oe,{})})}));export{F as H,l as _,$e as a,Ne as q,Re as s};
