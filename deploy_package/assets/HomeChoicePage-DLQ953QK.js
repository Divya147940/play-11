import{j as e,R as f}from"./vendor-core-CFw98Jpq.js";import{u as C,a as B}from"./vendor-router-wGrc2b_U.js";import{q as _,s as E}from"./index-CQI9lRDL.js";import{S as R,g as D,T as k,h as O,N as U}from"./vendor-lucide-DwXPRU3z.js";const w=s=>{if(!s)return new Date;if(typeof s=="object")return s;const o=s.includes("T")?s:s.replace(" ","T"),p=o.includes("Z")||o.includes("+")||o.includes("-")&&o.indexOf("-",11)!==-1?o:o+"+05:30";return new Date(p)},$=({openAt:s,closeAt:o})=>{const[j,p]=f.useState("");return f.useEffect(()=>{const t=()=>{const n=new Date().getTime(),m=w(s).getTime()-n;if(m<=0){p("Starting...");return}const c=Math.floor(m/(1e3*60*60*24)),g=Math.floor(m%(1e3*60*60*24)/(1e3*60*60)),z=Math.floor(m%(1e3*60*60)/(1e3*60)),x=Math.floor(m%(1e3*60)/1e3);let y="";c>0?y=`${c}d ${g}h ${z}m ${x}s`:g>0?y=`${g}h ${z}m ${x}s`:y=`${z}m ${x}s`,p(y)};t();const u=setInterval(t,1e3);return()=>clearInterval(u)},[s]),e.jsx("div",{style:{textAlign:"center",display:"flex",flexDirection:"column",gap:"4px",alignItems:"center",width:"100%"},children:e.jsxs("div",{className:"upcoming-timer-bubble",children:[e.jsx("div",{className:"upcoming-timer-dot"}),e.jsxs("span",{className:"upcoming-timer-text",children:["Starts in: ",j]})]})})},Q=({quizzes:s=[],title:o="Multiple quizzes scheduled by time",subtitle:j="SCHEDULED QUIZ SECTION"})=>{const p=C();return s.length===0?e.jsx("div",{className:"flex-center",style:{padding:"4rem",flexDirection:"column",gap:"1rem",background:"white",borderRadius:"1.5rem",border:"1px solid #e2e8f0"},children:e.jsx("p",{style:{fontSize:"1.2rem",fontWeight:700,color:"#94a3b8"},children:"No real-time quizzes currently active in this section"})}):e.jsxs("div",{className:"animate-slide-up",children:[e.jsx("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"end",marginBottom:"1.5rem"},children:e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:"0.75rem",fontWeight:900,color:"#4f46e5",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.5rem"},children:j}),e.jsx("h2",{style:{fontSize:"1.8rem",fontWeight:900,color:"#0f172a",letterSpacing:"-0.02em",marginBottom:0},children:o})]})}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"8px"},className:"mobile-grid-2",children:s.map(t=>{var g;const u=w(t.open_at),n=`${u.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}, ${u.toLocaleDateString([],{day:"numeric",month:"short",year:"numeric"})}`,b=t.status_label==="LIVE",m=t.zone_id==="movie-zone"?"orange":t.zone_id==="sport-zone"?"secondary":t.zone_id==="news-zone"?"blue":"primary";let c="Details";return t.is_submitted?c="Awaiting Result":t.status_label==="CLOSED"?c="Results":t.status_label==="UPCOMING"?t.is_registered?c="Joined ✓":c=t.entry_amount>0?`Join (₹${t.entry_amount})`:"Join (Free)":t.status_label==="LIVE"&&(c="Join Now"),e.jsxs("div",{className:"game-zone-card animate-slide-up",children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"},children:[e.jsx("p",{style:{fontSize:"clamp(0.55rem, 2vw, 0.65rem)",fontWeight:900,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.05em"},children:((g=t.zone_id)==null?void 0:g.replace("-"," "))||"GENERAL ARENA"}),e.jsx("div",{className:`${b?"badge-live-mini pulse-live":t.status_label==="UPCOMING"?"badge-upcoming-mini":"badge-practice-mini"}`,children:t.status_label||"CLOSED"})]}),e.jsx("h3",{style:{fontSize:"clamp(0.85rem, 3vw, 1rem)",fontWeight:900,color:"#0f172a",marginBottom:"0.4rem",lineHeight:1.2},children:t.title}),e.jsx("div",{className:"game-status-box",style:{margin:"0.5rem 0",background:t.is_submitted?"#f0fdf4":b?"rgba(239, 68, 68, 0.03)":"rgba(15, 23, 42, 0.02)",borderColor:t.is_submitted?"#bbf7d0":b?"rgba(239, 68, 68, 0.1)":"#f1f5f9"},children:t.is_submitted?e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("p",{style:{fontSize:"0.6rem",fontWeight:800,color:"#16a34a",textTransform:"uppercase",marginBottom:"4px"},children:"SUBMITTED AT"}),e.jsx("div",{style:{color:"#16a34a",display:"flex",flexDirection:"column",alignItems:"center",gap:"2px"},children:t.submitted_at?e.jsxs(e.Fragment,{children:[e.jsx("span",{style:{fontSize:"1.1rem",fontWeight:900,lineHeight:1.1},children:w(t.submitted_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}),e.jsx("span",{style:{fontSize:"0.75rem",fontWeight:800,color:"#15803d"},children:w(t.submitted_at).toLocaleDateString([],{day:"2-digit",month:"short",year:"numeric"})})]}):e.jsx("span",{style:{fontSize:"1.1rem",fontWeight:900},children:"Completed"})})]}):b?e.jsxs("div",{style:{textAlign:"center",display:"flex",flexDirection:"column",gap:"2px",alignItems:"center"},children:[e.jsx("p",{className:"pulse-text",style:{fontSize:"0.9rem",fontWeight:900,color:"#ef4444",letterSpacing:"0.05em",marginBottom:"2px"},children:"LIVE NOW"}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:"4px",flexWrap:"wrap",fontSize:"0.55rem",fontWeight:800,color:"#94a3b8",textTransform:"uppercase"},children:[e.jsx("span",{children:"STARTS:"}),e.jsx("span",{style:{color:"#0f172a"},children:n})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:"4px",flexWrap:"wrap",fontSize:"0.55rem",fontWeight:800,color:"#94a3b8",textTransform:"uppercase"},children:[e.jsx("span",{children:"ENDS:"}),e.jsxs("span",{style:{color:"#ef4444"},children:[w(t.close_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),", ",w(t.close_at).toLocaleDateString([],{day:"numeric",month:"short",year:"numeric"})]})]})]}):t.status_label==="UPCOMING"?e.jsx($,{openAt:t.open_at,closeAt:t.close_at}):e.jsx("div",{style:{display:"flex",justifyContent:"center",gap:"1rem",textAlign:"center"},children:e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:"0.6rem",fontWeight:800,color:"#94a3b8",textTransform:"uppercase",marginBottom:"4px"},children:t.status_label==="CLOSED"?"ENDED":"STARTS AT"}),e.jsx("p",{style:{fontSize:t.status_label==="CLOSED"?"1.1rem":"0.85rem",fontWeight:900,color:t.status_label==="CLOSED"?"#ef4444":"#0f172a"},children:t.status_label==="CLOSED"?"Closed":n})]})})}),e.jsxs("div",{style:{display:"flex",gap:"4px",marginTop:"0.5rem"},children:[e.jsxs("div",{className:"quiz-metric-pill",style:{flex:1,textAlign:"center",padding:"0.4rem 0.15rem"},children:[e.jsx("p",{style:{opacity:.7,fontSize:"0.45rem",fontWeight:800,textTransform:"uppercase",marginBottom:"1px"},children:"Questions"}),e.jsx("strong",{style:{fontSize:"0.65rem"},children:t.total_questions||t.questions||10})]}),e.jsxs("div",{className:"quiz-metric-pill",style:{flex:1,textAlign:"center",padding:"0.4rem 0.15rem"},children:[e.jsx("p",{style:{opacity:.7,fontSize:"0.45rem",fontWeight:800,textTransform:"uppercase",marginBottom:"1px"},children:"SPOT"}),e.jsx("strong",{style:{fontSize:"0.65rem"},children:t.players_count??0})]}),e.jsxs("div",{className:"quiz-metric-pill",style:{flex:1,textAlign:"center",padding:"0.4rem 0.15rem"},children:[e.jsx("p",{style:{opacity:.7,fontSize:"0.45rem",fontWeight:800,textTransform:"uppercase",marginBottom:"1px"},children:"WIN"}),e.jsx("strong",{style:{fontSize:"0.65rem"},children:t.reward_text||(t.entry_amount>0?`₹${t.entry_amount*5}`:"Free")})]})]}),e.jsx("button",{className:`quiz-join-btn ${t.is_submitted?"outline":m}`,onClick:()=>{t.is_submitted?p(`/game-result/${t.id}`):p(`/match-quiz-room/${t.id}`)},children:c})]},t.id)})}),e.jsx("style",{children:`
             .upcoming-timer-bubble {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: #eff6ff;
                padding: 6px 14px;
                border-radius: 20px;
                border: 1px solid #dbeafe;
                max-width: 100%;
                box-sizing: border-box;
             }
             .upcoming-timer-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #3b82f6;
                animation: pulse 1.5s infinite ease-in-out;
                flex-shrink: 0;
             }
             .upcoming-timer-text {
                font-size: 0.75rem;
                font-family: monospace;
                font-weight: 950;
                color: #3b82f6;
                white-space: nowrap;
             }
             .mobile-grid-2 {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
             }
             @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(0.85); opacity: 0.5; }
             }
             @media (max-width: 640px) {
                .upcoming-timer-bubble {
                   padding: 4px 8px;
                   gap: 4px;
                }
                .upcoming-timer-text {
                   font-size: 0.62rem;
                }
                .upcoming-timer-dot {
                   width: 6px;
                   height: 6px;
                }
                .mobile-grid-2 {
                   grid-template-columns: 1fr 1fr !important;
                   gap: 8px !important;
                   padding: 0 8px !important;
                   width: 100% !important;
                   box-sizing: border-box !important;
                }
                .game-zone-card {
                   padding: 0.75rem 0.6rem !important;
                   min-width: 0 !important;
                }
                .game-zone-card h3 {
                   font-size: 0.95rem !important;
                }
                .game-status-box {
                   padding: 0.75rem 0.4rem !important;
                }
                .quiz-metric-pill {
                   padding: 0.35rem 0.1rem !important;
                }
             }
             @media (max-width: 480px) {
                .upcoming-timer-text {
                   font-size: 0.6rem;
                }
                .upcoming-timer-bubble {
                   padding: 4px 8px;
                   gap: 4px;
                }
                .upcoming-timer-dot {
                   width: 6px;
                   height: 6px;
                }
                .mobile-grid-2 {
                   grid-template-columns: repeat(2, 1fr) !important;
                   gap: 8px !important;
                   padding: 0 4px !important;
                }
                .game-zone-card {
                   padding: 0.75rem 0.6rem !important;
                }
                .game-zone-card h3 {
                   font-size: 0.95rem !important;
                }
                .game-status-box {
                   padding: 0.5rem 0.3rem !important;
                }
                .quiz-metric-pill {
                   padding: 0.35rem 0.1rem !important;
                }
                .quiz-metric-pill strong {
                   font-size: 0.65rem !important;
                }
                .quiz-join-btn {
                   width: 100% !important;
                   padding: 0.5rem !important;
                   font-size: 0.75rem !important;
                   border-radius: 8px !important;
                }
             }
             @media (max-width: 360px) {
                .upcoming-timer-text {
                   font-size: 0.52rem;
                }
             }
          `})]})},G=()=>{var v;const s=C(),o=B();localStorage.getItem("user_name");const j=[{id:"study-zone",title:"Study Zone",desc:"SSC, GK, reasoning, news and exam-style questions for serious aspirants.",icon:D,iconBg:"linear-gradient(135deg, #3b82f6, #1d4ed8)",iconShadow:"rgba(59, 130, 246, 0.3)",prize:"₹500",entry:"₹10",players:"154",time:"02:15:30",path:"/quiz-arena/study-zone",btnColor:"primary"},{id:"sport-zone",title:"Sport Zone",desc:"Cricket, IPL, match awareness and sports knowledge battle.",icon:k,iconBg:"linear-gradient(135deg, #10b981, #047857)",iconShadow:"rgba(16, 185, 129, 0.3)",prize:"₹500",entry:"₹10",players:"255",time:"03:42:18",path:"/quiz-arena/sport-zone",btnColor:"secondary"},{id:"movie-zone",title:"Movie Quiz",desc:"Bollywood, Hollywood, actors, songs, dialogues and cinema trivia.",icon:O,iconBg:"linear-gradient(135deg, #f97316, #c2410c)",iconShadow:"rgba(249, 115, 22, 0.3)",prize:"₹500",entry:"₹10",players:"172",time:"05:20:45",path:"/quiz-arena/movie-zone",btnColor:"orange"},{id:"news-zone",title:"Daily News Quiz",desc:"News, current affairs, India, world affairs and daily awareness.",icon:U,iconBg:"linear-gradient(135deg, #06b6d4, #0891b2)",iconShadow:"rgba(6, 182, 212, 0.3)",prize:"₹500",entry:"₹10",players:"188",time:"06:10:05",path:"/quiz-arena/news-zone",btnColor:"blue"}],p=["All Rooms","Upcoming","Live","Completed"],[t,u]=f.useState(((v=o.state)==null?void 0:v.tab)||"All Rooms");f.useEffect(()=>{var i;(i=o.state)!=null&&i.tab&&u(o.state.tab)},[o.state]);const[n,b]=f.useState([]),[m,c]=f.useState([]),[g,z]=f.useState(!1),[x,y]=f.useState(()=>{const i=localStorage.getItem("play11_home_banner");return i&&i!=="0"?i:""});f.useEffect(()=>{const i=async(h=!1)=>{n.length===0&&z(!0);const l=localStorage.getItem("play11_session");try{const d=[_.getAllQuizzes().catch(a=>(console.error("Failed to fetch all quizzes:",a),[])),l?_.getJoinedQuizzes().catch(a=>(console.error("Failed to fetch joined quizzes:",a),a.message&&a.message.toLowerCase().includes("expired")&&localStorage.removeItem("play11_session"),[])):Promise.resolve([])];h&&d.push(E.getSetting("home_banner_url").catch(a=>(console.error("Failed to fetch home banner setting:",a),null)));const S=await Promise.all(d),L=S[0]||[],W=S[1]||[];if(b(L),l&&c(W),h){const a=S[2];a&&a.success&&a.value&&a.value!=="0"?(y(a.value),localStorage.setItem("play11_home_banner",a.value)):a&&(y(""),localStorage.removeItem("play11_home_banner"))}}catch(d){console.error("Failed to fetch home data:",d)}finally{z(!1)}};i(!0);const r=setInterval(()=>i(!1),1e4);return()=>clearInterval(r)},[t]);const T=()=>{if(!Array.isArray(n))return[];if(t==="All Rooms")return n;if(t==="Live")return n.filter(i=>{var r;return((r=i.status_label)==null?void 0:r.toUpperCase())==="LIVE"&&i.is_registered});if(t==="Upcoming")return n.filter(i=>{var r;return((r=i.status_label)==null?void 0:r.toUpperCase())==="UPCOMING"&&i.is_registered});if(t==="Completed"){const i=new Set(m.map(l=>l.id)),r=n.filter(l=>l.is_registered&&!i.has(l.id));return[...m,...r].filter(l=>{var d;return l.is_submitted||((d=l.status_label)==null?void 0:d.toUpperCase())==="CLOSED"})}return[]},N=i=>Array.isArray(n)?n.filter(r=>{var h;return r.zone_id===i&&((h=r.status_label)==null?void 0:h.toUpperCase())==="LIVE"}).length:0,I=i=>{if(!Array.isArray(n)||n.length===0)return"₹0";const r=n.filter(d=>d.zone_id===i);if(r.length===0)return"₹0";const h=Math.max(...r.map(d=>d.prize_amount||0));if(h>0)return`₹${h}`;const l=r.find(d=>d.reward_text);return l?l.reward_text:"Free"},A=T();return e.jsxs("div",{className:"quiz-room-bg",children:[e.jsxs("div",{className:"quiz-choice-page-content",style:{paddingBottom:"6rem"},children:[e.jsxs("div",{className:"quiz-banner-container animate-slide-up stagger-1",style:{width:"100%",position:"relative",marginBottom:"2rem",overflow:"hidden",borderRadius:"0",background:"#0d1f3c",boxShadow:"0 10px 30px rgba(0,0,0,0.2)"},children:[x&&x!=="0"&&e.jsx("div",{style:{width:"100%",height:"clamp(200px, 30vh, 350px)",overflow:"hidden"},children:e.jsx("img",{src:x,alt:"Banner",style:{width:"100%",height:"100%",objectFit:"fill",display:"block"}})}),(!x||x==="0")&&e.jsx("div",{style:{padding:"3rem 5%",background:"radial-gradient(circle at top right, #1e3a8a, #0d1f3c)",minHeight:"220px",display:"flex",alignItems:"center"},children:e.jsxs("div",{className:"banner-text-container",children:[e.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",background:"rgba(255,255,255,0.1)",padding:"6px 14px",borderRadius:"999px",marginBottom:"1rem",backdropFilter:"blur(5px)"},children:[e.jsx(R,{size:16,color:"#38bdf8",fill:"#38bdf8"}),e.jsx("span",{style:{fontSize:"0.75rem",fontWeight:900,textTransform:"uppercase",letterSpacing:"0.12em",color:"white"},children:"QUIZ LIVE FORMAT"})]}),e.jsx("h2",{style:{fontSize:"clamp(1.8rem, 5vw, 3rem)",fontWeight:900,marginBottom:"1rem",lineHeight:1.1,color:"white"},children:"Earn from what you learn"}),e.jsx("p",{style:{fontSize:"1.1rem",opacity:.8,fontWeight:500,lineHeight:1.5,color:"white"},children:"Compete in real quiz battles, rank higher, win real prizes."})]})})]}),e.jsx("div",{className:"container animate-slide-up",style:{marginBottom:"0.5rem",display:"flex",justifyContent:"center",paddingLeft:"4%",paddingRight:"4%",textAlign:"center",width:"100%"},children:e.jsx("div",{children:e.jsx("h1",{style:{fontSize:"clamp(1.2rem, 3vw, 1.8rem)",fontWeight:900,color:"#0f172a",letterSpacing:"-0.02em"},children:"Choose your contest room"})})}),e.jsxs("div",{className:"container",style:{paddingLeft:"clamp(0rem, 2vw, 3%)",paddingRight:"clamp(0rem, 2vw, 3%)"},children:[e.jsx("div",{style:{margin:"1.5rem 0",display:"flex",justifyContent:"center",gap:"1rem",flexWrap:"wrap"},className:"animate-slide-up stagger-2",children:p.map(i=>e.jsx("button",{className:`tab ${t===i?"active":""}`,onClick:()=>u(i),children:i},i))}),t==="All Rooms"?e.jsx("div",{className:"mobile-grid-2",children:j.map((i,r)=>e.jsx("div",{className:"contest-room-card",style:{padding:"1.2rem",background:"white",borderRadius:"16px",border:"1px solid #edf2f7",cursor:"pointer",textAlign:"center",boxShadow:"none",display:"flex",flexDirection:"column",height:"100%"},onClick:()=>s(i.path),children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",width:"100%",height:"100%"},children:[e.jsx("div",{style:{width:"60px",height:"60px",borderRadius:"18px",background:i.iconBg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"14px",boxShadow:`0 8px 24px ${i.iconShadow}`,color:"white",transition:"transform 0.3s ease"},className:"room-icon-wrapper",children:e.jsx(i.icon,{size:28,strokeWidth:2.2})}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",width:"100%",padding:"0 6px",fontSize:"0.6rem",fontWeight:700,color:"#94a3b8",marginBottom:"8px",textTransform:"uppercase"},children:[e.jsxs("span",{children:["WIN UPTO ",I(i.id)]}),g?e.jsx("span",{style:{color:"#94a3b8"},children:"● ..."}):N(i.id)>0?e.jsx("span",{style:{color:"#ef4444"},children:"● LIVE"}):e.jsx("span",{style:{color:"#94a3b8"},children:"● OFF"})]}),e.jsx("h3",{style:{fontSize:"1.1rem",fontWeight:700,color:"#1a202c",marginBottom:"6px"},children:i.title}),e.jsx("p",{style:{fontSize:"0.8rem",color:"#4a5568",marginBottom:"16px",lineHeight:"1.4"},children:i.desc}),e.jsx("div",{style:{width:"100%",marginTop:"auto"},children:e.jsx("button",{style:{display:"inline-block",width:"auto",minWidth:"120px",padding:"8px 16px",borderRadius:"10px",fontWeight:700,fontSize:"0.75rem",border:"none",cursor:"pointer",background:i.btnColor==="primary"?"#2d3748":i.btnColor==="secondary"?"#38a169":i.btnColor==="orange"?"#dd6b20":"#3182ce",color:"white"},children:"Enter Room"})})]})},i.id))}):g?e.jsx("div",{className:"flex-center",style:{padding:"3rem"},children:e.jsx("div",{style:{width:"40px",height:"40px",border:"4px solid #e2e8f0",borderTopColor:"#3b82f6",borderRadius:"50%",animation:"spin 1s linear infinite"}})}):e.jsx(Q,{quizzes:A,title:t==="Completed"?"Quizzes you have participated in":t==="Upcoming"?"Upcoming quizzes you have joined":`Currently ${t.toLowerCase()} quiz battles`,subtitle:t==="Completed"?"YOUR PARTICIPATION HISTORY":t==="Upcoming"?"YOUR UPCOMING JOINED":`${t.toUpperCase()} QUIZ ARENA`})]})]}),e.jsx("style",{children:`
        .quiz-choice-page-content {
           padding-top: 88px;
        }
        .mobile-grid-2 {
           display: grid;
           grid-template-columns: repeat(2, 1fr);
           gap: 12px;
        }
        @media (max-width: 768px) {
          .banner-stats-container {
            padding-right: 5% !important;
            justify-content: center;
            width: 100%;
            margin-top: 1rem;
          }
          .banner-text-container {
            text-align: center;
            padding-right: 5% !important;
          }
        }
        @media (max-width: 480px) {
          .mobile-full-width {
            max-width: 100% !important;
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 1px solid #f1f5f9;
            padding-top: 1.5rem;
          }
          .mobile-grid-2 {
             grid-template-columns: repeat(2, 1fr) !important;
             gap: 12px !important;
             padding: 0 4px !important;
          }
          .contest-room-card {
             padding: 1.5rem !important;
          }
          .room-icon-wrapper {
             width: 64px !important;
             height: 64px !important;
             border-radius: 20px !important;
          }
        }
      `})]})};export{G as default};
