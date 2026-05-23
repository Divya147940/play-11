import{r as o,j as e}from"./vendor-core-754eFBWZ.js";import{c as R,u as T}from"./vendor-router-DpCHN5bO.js";import{O as C,g as I}from"./vendor-lucide-Czx_Sl3Z.js";const J=()=>{const{id:n}=R(),v=T(),c=!n,[x,k]=o.useState([]),[m,j]=o.useState(null),[N,z]=o.useState(""),[y,h]=o.useState(!0),[O,g]=o.useState(null);o.useEffect(()=>{(async()=>{var s;h(!0),g(null);try{const r=localStorage.getItem("play11_session")||localStorage.getItem("play11_admin_session");let d="";if(r)try{d=JSON.parse(r).token||r}catch{d=r}const q=d?{Authorization:`Bearer ${d}`}:{},E=c?"/api/quizzes/leaderboard":`/api/quizzes/${n}/leaderboard`,u=await(await fetch(E,{headers:q})).text();if(!u)throw new Error("Server returned an empty response.");const p=JSON.parse(u);if(!p.success)throw new Error(p.error||"Failed to load leaderboard.");const w=p.leaderboard||[];w.sort((t,i)=>i.total_score-t.total_score);const _=w.map((t,i)=>{const l=(t.name||"User").trim().split(/\s+/);let b="";return l.length>=2?b=(l[0][0]+l[1][0]).toUpperCase():b=(t.name||"User").slice(0,2).toUpperCase(),{...t,rank:i+1,avatar:b}});if(k(_),j(p.userRank||null),!c){const i=await(await fetch(`/api/quizzes/${n}`)).text();if(i){const l=JSON.parse(i);l.success&&z(((s=l.quiz)==null?void 0:s.title)||"")}}}catch(r){g(r.message)}finally{h(!1)}})()},[n,c]);const f=x.filter(a=>a.rank<=3),S=x.filter(a=>a.rank>3),L=[f.find(a=>a.rank===2),f.find(a=>a.rank===1),f.find(a=>a.rank===3)].filter(Boolean);return y?e.jsxs("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#ffffff"},children:[e.jsx(C,{size:36,className:"spin-loader"}),e.jsx("style",{children:".spin-loader { animation: spin 1s linear infinite; color: #3b82f6; } @keyframes spin { to { transform: rotate(360deg); } }"})]}):e.jsxs("div",{className:"lb-page",children:[e.jsx("div",{className:"lb-header-container",children:e.jsxs("div",{className:"lb-header-top",children:[e.jsx("button",{className:"lb-back-btn",onClick:()=>v(-1),children:e.jsx(I,{size:20})}),e.jsxs("div",{className:"lb-title-block",children:[e.jsx("h1",{className:"lb-title",children:"Leaderboard 🏆"}),e.jsx("p",{className:"lb-subtitle",children:c?"ALL-TIME BEST":N||"QUIZ CONTEST"})]})]})}),e.jsx("div",{className:"lb-podium-wrap",children:e.jsx("div",{className:"lb-podium",children:L.map(a=>e.jsxs("div",{className:`lb-podium-item spot-${a.rank}`,children:[e.jsx("div",{className:"lb-avatar-box",children:e.jsxs("div",{className:"lb-avatar-circle",children:[a.rank===1&&e.jsxs("div",{className:"lb-crown",children:[e.jsx("div",{className:"lb-crown-ring"}),e.jsx("div",{className:"lb-crown-dot"})]}),a.avatar]})}),e.jsxs("div",{className:"lb-p-info",children:[e.jsx("div",{className:"lb-p-name",children:a.name}),e.jsx("div",{className:"lb-p-score",children:a.total_score})]})]},a.rank))})}),e.jsx("div",{className:"lb-list-wrap",children:e.jsx("div",{className:"lb-list",children:S.map(a=>{const s=m&&String(a.user_id)===String(m.user_id);return e.jsxs("div",{className:`lb-row ${s?"lb-me":""}`,children:[e.jsx("div",{className:"lb-rank",children:a.rank}),e.jsx("div",{className:"lb-avatar-small",children:s?"You":a.avatar}),e.jsx("div",{className:"lb-name-small",children:s?"You":a.name}),e.jsx("div",{className:"lb-score-small",children:a.total_score})]},a.rank)})})}),e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800;900&display=swap');

        .lb-page {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Lexend', sans-serif;
          padding: 80px 0 100px;
        }
        @media (max-width: 768px) {
          .lb-page { padding-top: 75px; }
        }

        .lb-header-container {
          padding: 20px 24px;
          margin-bottom: 20px;
        }

        .lb-header-top {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .lb-back-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #0f172a;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .lb-back-btn:hover {
          background: #f1f5f9;
          transform: translateX(-2px);
        }

        .lb-title-block {
          text-align: left;
        }

        .lb-title {
          font-size: 22px; font-weight: 900; color: #0f172a; margin: 0;
          letter-spacing: -0.02em;
        }
        .lb-subtitle {
          font-size: 10px; font-weight: 800; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.1em; margin: 2px 0 0;
        }

        .lb-podium-wrap {
          display: flex; justify-content: center; margin-bottom: 40px;
          padding-top: 30px;
        }
        .lb-podium {
          display: flex; align-items: flex-end; gap: 20px;
        }

        .lb-podium-item {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          width: 70px;
        }
        .spot-1 { width: 90px; transform: translateY(-30px); }

        .lb-avatar-box { position: relative; }
        .lb-avatar-circle {
          width: 52px; height: 52px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 15px;
          background: #f1f5f9; border: 1px solid #e2e8f0; color: #0f172a;
          position: relative;
        }

        .spot-1 .lb-avatar-circle {
          width: 72px; height: 72px; font-size: 20px;
          background: #fef9c3; border: 3px solid #facc15; color: #a16207;
        }
        .spot-2 .lb-avatar-circle { background: #f1f5f9; border-color: #cbd5e1; }
        .spot-3 .lb-avatar-circle { background: #fff7ed; border-color: #fdba74; color: #9a3412; }

        .lb-crown {
          position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
        }
        .lb-crown-ring {
          width: 14px; height: 8px; border: 2.2px solid #facc15; border-radius: 50%;
        }
        .lb-crown-dot {
          width: 4px; height: 4px; background: #facc15; border-radius: 50%;
          position: absolute; top: -3px; left: 50%; transform: translateX(-50%);
        }

        .lb-p-name { font-weight: 800; font-size: 11px; color: #0f172a; }
        .lb-p-score { font-weight: 800; font-size: 10px; color: #0ea5e9; margin-top: 2px; }

        .lb-list-wrap {
          padding: 0 20px;
        }
        .lb-list {
          display: flex; flex-direction: column; gap: 12px;
          max-width: 440px; margin: 0 auto;
        }

        .lb-row {
          background: white; padding: 14px 16px; border-radius: 18px;
          display: flex; align-items: center; gap: 14px;
          border: 1px solid #f1f5f9; box-shadow: 0 1px 3px rgba(0,0,0,0.01);
        }

        .lb-me {
          background: #f0f9ff; border-color: #bae6fd;
        }

        .lb-rank {
          font-weight: 700; color: #94a3b8; width: 22px; text-align: center; font-size: 12px;
        }
        .lb-avatar-small {
          width: 38px; height: 38px; background: #0f172a; border-radius: 50%;
          color: white; display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 12px;
        }
        .lb-me .lb-avatar-small { background: #3b82f6; font-size: 11px; }

        .lb-name-small {
          flex: 1; font-weight: 800; color: #0f172a; font-size: 13px;
        }
        .lb-score-small {
          font-weight: 900; color: #0f172a; font-size: 14px;
        }

        .lb-me .lb-name-small, .lb-me .lb-score-small, .lb-me .lb-rank { color: #0369a1; }
      `})]})};export{J as default};
