import{j as e,R as o}from"./vendor-core-754eFBWZ.js";import{u as v,a as T}from"./vendor-router-DpCHN5bO.js";import{q as z,s as I}from"./index-CMhIRYTY.js";import{S as B,e as A,T as R,f as E,N as L}from"./vendor-lucide-Czx_Sl3Z.js";const W=({quizzes:d=[],title:c="Multiple quizzes scheduled by time",subtitle:g="SCHEDULED QUIZ SECTION"})=>{const s=v();return d.length===0?e.jsx("div",{className:"flex-center",style:{padding:"4rem",flexDirection:"column",gap:"1rem",background:"white",borderRadius:"1.5rem",border:"1px solid #e2e8f0"},children:e.jsx("p",{style:{fontSize:"1.2rem",fontWeight:700,color:"#94a3b8"},children:"No real-time quizzes currently active in this section"})}):e.jsxs("div",{className:"animate-slide-up",children:[e.jsx("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"end",marginBottom:"1.5rem"},children:e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:"0.75rem",fontWeight:900,color:"#4f46e5",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.5rem"},children:g}),e.jsx("h2",{style:{fontSize:"1.8rem",fontWeight:900,color:"#0f172a",letterSpacing:"-0.02em",marginBottom:0},children:c})]})}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"8px"},className:"mobile-grid-2",children:d.map(t=>{var m;const n=new Date(t.open_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),a=t.status_label==="LIVE",h=t.zone_id==="movie-zone"?"orange":t.zone_id==="sport-zone"?"secondary":t.zone_id==="news-zone"?"blue":"primary";return e.jsxs("div",{className:"game-zone-card animate-slide-up",children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"},children:[e.jsx("p",{style:{fontSize:"clamp(0.55rem, 2vw, 0.65rem)",fontWeight:900,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.05em"},children:((m=t.zone_id)==null?void 0:m.replace("-"," "))||"GENERAL ARENA"}),e.jsx("div",{className:`${a?"badge-live-mini pulse-live":t.status_label==="UPCOMING"?"badge-upcoming-mini":"badge-practice-mini"}`,children:t.status_label||"CLOSED"})]}),e.jsx("h3",{style:{fontSize:"clamp(0.85rem, 3vw, 1rem)",fontWeight:900,color:"#0f172a",marginBottom:"0.4rem",lineHeight:1.2},children:t.title}),e.jsx("div",{className:"game-status-box",style:{margin:"0.5rem 0",background:t.is_submitted?"#f0fdf4":a?"rgba(239, 68, 68, 0.03)":"rgba(15, 23, 42, 0.02)",borderColor:t.is_submitted?"#bbf7d0":a?"rgba(239, 68, 68, 0.1)":"#f1f5f9"},children:t.is_submitted?e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("p",{style:{fontSize:"0.6rem",fontWeight:800,color:"#16a34a",textTransform:"uppercase",marginBottom:"4px"},children:"SUBMITTED AT"}),e.jsx("p",{style:{fontSize:"1.1rem",fontWeight:900,color:"#16a34a"},children:t.submitted_at?new Date(t.submitted_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"Completed"})]}):a?e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("p",{className:"pulse-text",style:{fontSize:"0.9rem",fontWeight:900,color:"#ef4444",letterSpacing:"0.05em",marginBottom:"4px"},children:"LIVE NOW"}),e.jsxs("p",{style:{fontSize:"0.55rem",fontWeight:800,color:"#94a3b8",textTransform:"uppercase"},children:["ENDS AT ",new Date(t.close_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})]})]}):e.jsx("div",{style:{display:"flex",justifyContent:"center",gap:"1rem"},children:e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:"0.6rem",fontWeight:800,color:"#94a3b8",textTransform:"uppercase",marginBottom:"4px"},children:t.status_label==="CLOSED"?"ENDED":"STARTS AT"}),e.jsx("p",{style:{fontSize:"1.1rem",fontWeight:900,color:t.status_label==="CLOSED"?"#ef4444":"#0f172a"},children:t.status_label==="CLOSED"?"Closed":n})]})})}),e.jsxs("div",{style:{display:"flex",gap:"4px",marginTop:"0.5rem"},children:[e.jsxs("div",{className:"quiz-metric-pill",style:{flex:1,textAlign:"center",padding:"0.4rem 0.15rem"},children:[e.jsx("p",{style:{opacity:.7,fontSize:"0.45rem",fontWeight:800,textTransform:"uppercase",marginBottom:"1px"},children:"Qs"}),e.jsx("strong",{style:{fontSize:"0.65rem"},children:t.total_questions||t.questions||10})]}),e.jsxs("div",{className:"quiz-metric-pill",style:{flex:1,textAlign:"center",padding:"0.4rem 0.15rem"},children:[e.jsx("p",{style:{opacity:.7,fontSize:"0.45rem",fontWeight:800,textTransform:"uppercase",marginBottom:"1px"},children:"PLAYERS"}),e.jsx("strong",{style:{fontSize:"0.65rem"},children:t.players_count||"Joined"})]}),e.jsxs("div",{className:"quiz-metric-pill",style:{flex:1,textAlign:"center",padding:"0.4rem 0.15rem"},children:[e.jsx("p",{style:{opacity:.7,fontSize:"0.45rem",fontWeight:800,textTransform:"uppercase",marginBottom:"1px"},children:"WIN"}),e.jsx("strong",{style:{fontSize:"0.65rem"},children:t.reward_text||(t.entry_amount>0?`₹${t.entry_amount*5}`:"Free")})]})]}),e.jsx("button",{className:`quiz-join-btn ${t.is_submitted?"outline":h}`,onClick:()=>{t.is_submitted?s(`/game-result/${t.id}`):s(a?`/game-quiz-play/${t.id}`:`/match-quiz-room/${t.id}`)},children:t.is_submitted?"Result":a?"Join Now":t.status_label==="CLOSED"?"Results":"Details"})]},t.id)})}),e.jsx("style",{children:`
            .mobile-grid-2 {
               display: grid;
               grid-template-columns: repeat(2, 1fr);
               gap: 12px;
            }
            @media (max-width: 640px) {
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
               .mobile-grid-2 {
                  grid-template-columns: 1fr !important;
                  gap: 16px !important;
                  padding: 0 4px !important;
               }
               .game-zone-card {
                  padding: 1.25rem !important;
               }
               .game-zone-card h3 {
                  font-size: 1.15rem !important;
               }
               .game-status-box {
                  padding: 1rem !important;
               }
               .quiz-metric-pill {
                  padding: 0.5rem 0.25rem !important;
               }
               .quiz-metric-pill strong {
                  font-size: 0.8rem !important;
               }
               .quiz-join-btn {
                  width: 100% !important;
                  padding: 0.65rem !important;
                  font-size: 0.85rem !important;
                  border-radius: 8px !important;
               }
            }
         `})]})},U=()=>{var S;const d=v(),c=T();localStorage.getItem("user_name");const g=[{id:"study-zone",title:"Study Zone",desc:"SSC, GK, reasoning, news and exam-style questions for serious aspirants.",icon:A,iconBg:"linear-gradient(135deg, #3b82f6, #1d4ed8)",iconShadow:"rgba(59, 130, 246, 0.3)",prize:"₹500",entry:"₹10",players:"154",time:"02:15:30",path:"/quiz-arena/study-zone",btnColor:"primary"},{id:"sport-zone",title:"Sport Zone",desc:"Cricket, IPL, match awareness and sports knowledge battle.",icon:R,iconBg:"linear-gradient(135deg, #10b981, #047857)",iconShadow:"rgba(16, 185, 129, 0.3)",prize:"₹500",entry:"₹10",players:"255",time:"03:42:18",path:"/quiz-arena/sport-zone",btnColor:"secondary"},{id:"movie-zone",title:"Movie Quiz",desc:"Bollywood, Hollywood, actors, songs, dialogues and cinema trivia.",icon:E,iconBg:"linear-gradient(135deg, #f97316, #c2410c)",iconShadow:"rgba(249, 115, 22, 0.3)",prize:"₹500",entry:"₹10",players:"172",time:"05:20:45",path:"/quiz-arena/movie-zone",btnColor:"orange"},{id:"news-zone",title:"Daily News Quiz",desc:"News, current affairs, India, world affairs and daily awareness.",icon:L,iconBg:"linear-gradient(135deg, #06b6d4, #0891b2)",iconShadow:"rgba(6, 182, 212, 0.3)",prize:"₹500",entry:"₹10",players:"188",time:"06:10:05",path:"/quiz-arena/news-zone",btnColor:"blue"}],s=["All Rooms","Live","Upcoming","My Joined"],[t,u]=o.useState(((S=c.state)==null?void 0:S.tab)||"All Rooms"),[n,a]=o.useState([]),[h,m]=o.useState([]),[y,b]=o.useState(!1),[x,j]=o.useState(localStorage.getItem("play11_home_banner")||"");o.useEffect(()=>{const i=async()=>{n.length===0&&b(!0);const l=localStorage.getItem("play11_session");try{const[f,p,_]=await Promise.all([z.getAllQuizzes(),I.getSetting("home_banner_url"),l?z.getJoinedQuizzes():Promise.resolve([])]);a(f),p.success&&p.value?(j(p.value),localStorage.setItem("play11_home_banner",p.value)):(j(""),localStorage.removeItem("play11_home_banner")),l&&m(_)}catch(f){console.error("Failed to fetch home data:",f)}finally{b(!1)}};i();const r=setInterval(i,3e4);return()=>clearInterval(r)},[]);const w=()=>Array.isArray(n)?t==="All Rooms"?n:t==="Live"?n.filter(i=>{var r;return((r=i.status_label)==null?void 0:r.toUpperCase())==="LIVE"}):t==="Upcoming"?n.filter(i=>{var r;return((r=i.status_label)==null?void 0:r.toUpperCase())==="UPCOMING"}):t==="My Joined"?h:[]:[],C=i=>Array.isArray(n)?n.filter(r=>{var l;return r.zone_id===i&&((l=r.status_label)==null?void 0:l.toUpperCase())==="LIVE"}).length:0,N=w();return e.jsxs("div",{className:"quiz-room-bg",children:[e.jsxs("div",{style:{paddingTop:"70px",paddingBottom:"6rem"},children:[e.jsxs("div",{className:"quiz-banner-container animate-slide-up stagger-1",style:{width:"100%",position:"relative",marginBottom:"2rem",overflow:"hidden",borderRadius:"0",background:"#0d1f3c",boxShadow:"0 10px 30px rgba(0,0,0,0.2)"},children:[x&&e.jsx("div",{style:{width:"100%",height:"clamp(200px, 30vh, 350px)",overflow:"hidden"},children:e.jsx("img",{src:x,alt:"Banner",style:{width:"100%",height:"100%",objectFit:"fill",display:"block"}})}),!x&&e.jsx("div",{style:{padding:"3rem 5%",background:"radial-gradient(circle at top right, #1e3a8a, #0d1f3c)",minHeight:"220px",display:"flex",alignItems:"center"},children:e.jsxs("div",{className:"banner-text-container",children:[e.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",background:"rgba(255,255,255,0.1)",padding:"6px 14px",borderRadius:"999px",marginBottom:"1rem",backdropFilter:"blur(5px)"},children:[e.jsx(B,{size:16,color:"#38bdf8",fill:"#38bdf8"}),e.jsx("span",{style:{fontSize:"0.75rem",fontWeight:900,textTransform:"uppercase",letterSpacing:"0.12em",color:"white"},children:"QUIZ LIVE FORMAT"})]}),e.jsx("h2",{style:{fontSize:"clamp(1.8rem, 5vw, 3rem)",fontWeight:900,marginBottom:"1rem",lineHeight:1.1,color:"white"},children:"Earn from what you learn"}),e.jsx("p",{style:{fontSize:"1.1rem",opacity:.8,fontWeight:500,lineHeight:1.5,color:"white"},children:"Compete in real quiz battles, rank higher, win real prizes."})]})})]}),e.jsx("div",{className:"container animate-slide-up",style:{marginBottom:"0.5rem",display:"flex",justifyContent:"flex-start",paddingLeft:"4%",paddingRight:"4%"},children:e.jsx("div",{children:e.jsx("h1",{style:{fontSize:"clamp(1.2rem, 3vw, 1.8rem)",fontWeight:900,color:"#0f172a",letterSpacing:"-0.02em"},children:"Choose your contest room"})})}),e.jsxs("div",{className:"container",style:{paddingLeft:"clamp(0rem, 2vw, 3%)",paddingRight:"clamp(0rem, 2vw, 3%)"},children:[e.jsx("div",{style:{margin:"3rem 0",display:"flex",gap:"1rem",flexWrap:"wrap"},className:"animate-slide-up stagger-2",children:s.map(i=>e.jsx("button",{className:`tab ${t===i?"active":""}`,onClick:()=>u(i),children:i},i))}),t==="All Rooms"?e.jsx("div",{className:"mobile-grid-2",children:g.map((i,r)=>e.jsx("div",{className:"contest-room-card",style:{padding:"1.2rem",background:"white",borderRadius:"16px",border:"1px solid #edf2f7",cursor:"pointer",textAlign:"center",boxShadow:"none",display:"flex",flexDirection:"column",height:"100%"},onClick:()=>d(i.path),children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",width:"100%",height:"100%"},children:[e.jsx("div",{style:{width:"60px",height:"60px",borderRadius:"18px",background:i.iconBg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"14px",boxShadow:`0 8px 24px ${i.iconShadow}`,color:"white",transition:"transform 0.3s ease"},className:"room-icon-wrapper",children:e.jsx(i.icon,{size:28,strokeWidth:2.2})}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",width:"100%",padding:"0 6px",fontSize:"0.6rem",fontWeight:700,color:"#94a3b8",marginBottom:"8px",textTransform:"uppercase"},children:[e.jsxs("span",{children:["WIN UPTO ",i.prize]}),y?e.jsx("span",{style:{color:"#94a3b8"},children:"● ..."}):C(i.id)>0?e.jsx("span",{style:{color:"#ef4444"},children:"● LIVE"}):e.jsx("span",{style:{color:"#94a3b8"},children:"● OFF"})]}),e.jsx("h3",{style:{fontSize:"1.1rem",fontWeight:700,color:"#1a202c",marginBottom:"6px"},children:i.title}),e.jsx("p",{style:{fontSize:"0.8rem",color:"#4a5568",marginBottom:"16px",lineHeight:"1.4"},children:i.desc}),e.jsx("div",{style:{width:"100%",marginTop:"auto"},children:e.jsx("button",{style:{display:"inline-block",width:"auto",minWidth:"120px",padding:"8px 16px",borderRadius:"10px",fontWeight:700,fontSize:"0.75rem",border:"none",cursor:"pointer",background:i.btnColor==="primary"?"#2d3748":i.btnColor==="secondary"?"#38a169":i.btnColor==="orange"?"#dd6b20":"#3182ce",color:"white"},children:"Enter Room"})})]})},i.id))}):y?e.jsx("div",{className:"flex-center",style:{padding:"3rem"},children:e.jsx("div",{style:{width:"40px",height:"40px",border:"4px solid #e2e8f0",borderTopColor:"#3b82f6",borderRadius:"50%",animation:"spin 1s linear infinite"}})}):e.jsx(W,{quizzes:N,title:t==="My Joined"?"Quizzes you have participated in":`Currently ${t.toLowerCase()} quiz battles`,subtitle:t==="My Joined"?"YOUR PARTICIPATION HISTORY":`${t.toUpperCase()} QUIZ ARENA`})]})]}),e.jsx("style",{children:`
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
      `})]})};export{U as default};
