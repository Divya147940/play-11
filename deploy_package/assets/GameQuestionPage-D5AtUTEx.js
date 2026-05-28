import{r as a,j as e}from"./vendor-core-754eFBWZ.js";import{H as M}from"./index-CgO54XNr.js";import{c as H,u as P}from"./vendor-router-DpCHN5bO.js";import{o as D,T as U}from"./vendor-lucide-R5TnQarU.js";const Z=()=>{var R;const{id:p}=H(),h=P(),[n,j]=a.useState(0),[d,T]=a.useState({}),[g,k]=a.useState(1200),[s,I]=a.useState([]),[u,_]=a.useState(null),[v,B]=a.useState(!0),[x,N]=a.useState(!1),[c,b]=a.useState(!1),[C,E]=a.useState(600),[A,$]=a.useState(!1);a.useEffect(()=>{const o=localStorage.getItem("play11_session")||localStorage.getItem("play11_admin_session");let i={};if(o)try{const t=JSON.parse(o);i.Authorization=`Bearer ${t.token||o}`}catch{i.Authorization=`Bearer ${o}`}fetch(`/api/quizzes/${p}`,{headers:i}).then(t=>t.json()).then(t=>{if(t.success){if(t.quiz.is_submitted){h(`/game-result/${p}`);return}_(t.quiz),t.quiz.timer_minutes&&(k(t.quiz.timer_minutes*60),E(t.quiz.timer_minutes*60))}}).catch(console.error),fetch(`/api/quizzes/${p}/questions`,{headers:i}).then(t=>t.json()).then(t=>{t.success&&t.questions.length>0?I(t.questions):I([{id:"mock",question_text:"Questions coming soon!",options:[]}])}).catch(console.error).finally(()=>B(!1))},[p]);const w=a.useCallback(async()=>{if(x||c)return;b(!0);let o=0;s.forEach(m=>{d[m.id]===m.answer&&(o+=1)});const i=(C||300)-g,t=m=>{const l=Math.floor(m/60),z=m%60;return`${l.toString().padStart(2,"0")}:${z.toString().padStart(2,"0")}`},f={score:o,total:s.length,rank:"-",time:t(i)},y=localStorage.getItem("play11_session")||localStorage.getItem("play11_admin_session"),q=localStorage.getItem("play11_guest_id"),S={"Content-Type":"application/json"};if(y)try{const m=JSON.parse(y);S.Authorization=`Bearer ${m.token||y}`}catch{S.Authorization=`Bearer ${y}`}else q&&(S["x-guest-id"]=q);try{const l=await(await fetch(`/api/quizzes/${p}/submit`,{method:"POST",headers:S,body:JSON.stringify({answers:d,time_taken:f.time})})).json();if(l.success&&l.submission)f.score=parseFloat(l.submission.total_score||f.score),f.rank=l.submission.rank||f.rank,f.correct=l.submission.correct_count||0,f.wrong=l.submission.wrong_count||0,$(!0),setTimeout(()=>{N(!0),b(!1),h(`/game-result/${p}`,{state:f})},2e3);else{b(!1);const z=l.message||l.error||"Unknown error",F=l.detail?` (${l.detail})`:"";alert("Error submitting game quiz: "+z+F)}}catch(m){b(!1),console.error("Submission failed:",m),alert("Network error: Could not submit game quiz. Please check your connection.")}},[d,p,h,x,c,s,g,C]);a.useEffect(()=>{if(v||x)return;if(g===0){w();return}const o=setInterval(()=>k(i=>i-1),1e3);return()=>clearInterval(o)},[g,w,v,x]);const L=o=>{const i=Math.floor(o/60),t=o%60;return`${i.toString().padStart(2,"0")}:${t.toString().padStart(2,"0")}`},O=o=>{if(x)return;const i=s[n];i&&i.id&&i.options&&i.options[o]&&T({...d,[i.id]:String(i.options[o].value)})};if(v)return e.jsx("div",{style:{minHeight:"100vh",background:"#0a192f",display:"flex",alignItems:"center",justifyContent:"center",color:"white"},children:e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{width:"50px",height:"50px",border:"4px solid #1e293b",borderTopColor:"#f97316",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 1rem"}}),e.jsx("p",{style:{fontWeight:800,color:"#94a3b8"},children:"Entering Game Arena..."})]})});const r=s[n],W=Object.keys(d).length;return(n+1)/s.length*100,e.jsxs("div",{className:"game-question-page",style:{minHeight:"100vh",background:"#0f172a",paddingBottom:"3rem"},children:[e.jsx(M,{}),e.jsxs("div",{className:"container",style:{padding:"0 1rem 2rem 1rem",paddingTop:"60px",maxWidth:"100%"},children:[(u==null?void 0:u.effective_banner_url)&&e.jsx("div",{style:{width:"calc(100% + 2rem)",marginLeft:"-1rem",marginRight:"-1rem",height:"clamp(160px, 25vh, 300px)",borderRadius:"0",backgroundColor:"#0d1f3c",marginBottom:"1rem",boxShadow:"0 10px 30px rgba(0,0,0,0.2)",position:"relative",overflow:"hidden"},children:e.jsx("img",{src:u.effective_banner_url,alt:"Quiz Banner",style:{width:"100%",height:"100%",objectFit:"fill",display:"block"}})}),A&&e.jsxs("div",{style:{position:"fixed",top:"80px",left:"50%",transform:"translateX(-50%)",background:"#10b981",color:"white",padding:"1rem 3rem",borderRadius:"1rem",fontWeight:900,fontSize:"1.1rem",boxShadow:"0 10px 25px -5px rgba(16, 185, 129, 0.4)",zIndex:1e3,display:"flex",alignItems:"center",gap:"1rem",animation:"slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:[e.jsx("div",{style:{width:"24px",height:"24px",borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center"},children:"✓"}),"SUBMITTED SUCCESSFULLY"]}),e.jsxs("div",{className:"top-header-container",style:{display:"flex",flexDirection:"column",alignItems:"stretch",marginBottom:"1rem",gap:"0.75rem",position:"relative"},children:[e.jsx("div",{className:"title-container",style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem",cursor:"pointer"},onClick:()=>h("/home-choice"),children:[e.jsx(D,{size:24,color:"#ffffff"}),e.jsx("h1",{style:{fontSize:"1.4rem",fontWeight:900,margin:"0",color:"#ffffff"},children:(u==null?void 0:u.title)||"Movies"})]})}),e.jsxs("div",{className:"stats-container",style:{display:"flex",gap:"1.5rem",justifyContent:"center"},children:[e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"0.65rem",fontWeight:800,color:"#cbd5e1",textTransform:"uppercase",marginBottom:"0.1rem"},children:"ZONE"}),e.jsx("div",{style:{fontSize:"1rem",fontWeight:900,color:"#ffffff"},children:"GAME"})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"0.65rem",fontWeight:800,color:g<60?"#ef4444":"#cbd5e1",textTransform:"uppercase",marginBottom:"0.1rem"},children:"TIME LEFT"}),e.jsx("div",{style:{fontSize:"1rem",fontWeight:900,color:g<60?"#ef4444":"#ffffff"},children:L(g)})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"0.65rem",fontWeight:800,color:"#cbd5e1",textTransform:"uppercase",marginBottom:"0.1rem"},children:"ANSWERED"}),e.jsxs("div",{style:{fontSize:"1rem",fontWeight:900,color:"#ffffff"},children:[W,"/",s.length]})]})]})]}),e.jsx("div",{className:"main-content-flex",style:{display:"flex",flexDirection:"column",gap:"1.5rem",marginBottom:"1.5rem"},children:e.jsxs("div",{className:"question-card",style:{width:"100%",background:"#ffffff",borderRadius:"1.5rem",padding:"1.5rem",color:"#0f172a"},children:[e.jsxs("p",{style:{fontSize:"1.1rem",fontWeight:600,marginBottom:"2rem",lineHeight:1.4,color:"#334155"},children:["Q",n+1,". ",r==null?void 0:r.question_text]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr",gap:"1rem",marginBottom:"3rem"},children:(R=r==null?void 0:r.options)==null?void 0:R.map((o,i)=>{const t=String(d[r.id])===String(o.value);return e.jsxs("div",{className:"option-item",onClick:()=>O(i),style:{display:"flex",alignItems:"center",gap:"1rem",padding:"1rem 1.25rem",borderRadius:"0.75rem",border:t?"2px solid #3b82f6":"1px solid #e2e8f0",background:t?"#eff6ff":"#ffffff",cursor:"pointer",transition:"all 0.2s ease"},children:[e.jsx("div",{style:{width:"28px",height:"28px",borderRadius:"50%",background:t?"#1e293b":"#0f172a",color:"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",fontWeight:800},children:String.fromCharCode(65+i)}),e.jsx("span",{style:{fontSize:"1rem",fontWeight:700,color:"#0f172a"},children:o.text})]},i)})}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",justifyContent:"space-between"},children:[e.jsx("button",{onClick:()=>{n>0?j(n-1):h("/home-choice")},style:{flex:1,background:"#ffffff",border:"1px solid #cbd5e1",color:"#475569",padding:"0.75rem 0",borderRadius:"0.5rem",fontWeight:700,fontSize:"0.85rem",cursor:"pointer"},children:"Previous"}),e.jsx("button",{onClick:()=>{n<s.length-1&&j(n+1)},disabled:n===s.length-1||c,style:{flex:1,background:"#ffffff",border:"1px solid #cbd5e1",color:"#475569",padding:"0.75rem 0",borderRadius:"0.5rem",fontWeight:700,fontSize:"0.85rem",cursor:"pointer",opacity:n===s.length-1?.3:1},children:"Skip"}),e.jsx("button",{onClick:()=>{n===s.length-1?w():j(n+1)},disabled:d[r==null?void 0:r.id]===void 0||c,style:{flex:1.5,background:d[r==null?void 0:r.id]===void 0||c?"#94a3b8":"#0052cc",border:"none",color:"#ffffff",padding:"0.75rem 0",borderRadius:"0.5rem",fontWeight:700,fontSize:"0.85rem",cursor:d[r==null?void 0:r.id]===void 0||c?"not-allowed":"pointer",boxShadow:d[r==null?void 0:r.id]===void 0||c?"none":"0 4px 10px rgba(0, 82, 204, 0.3)",transition:"all 0.2s ease"},children:c?"Submitting...":n===s.length-1?"Submit Battle":"Save & Next"})]})]})}),e.jsxs("div",{className:"bottom-widgets-area",style:{display:"flex",gap:"1.5rem",flexWrap:"wrap",marginBottom:"1.5rem"},children:[e.jsxs("div",{style:{flex:"1 1 300px",background:"#1e293b",borderRadius:"1.25rem",padding:"1.5rem",border:"1px solid #334155"},children:[e.jsx("h3",{style:{fontSize:"0.75rem",fontWeight:800,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"1.25rem"},children:"ARENA LEADERBOARD"}),e.jsx("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:e.jsxs("div",{style:{flex:"1 1 200px",background:"#334155",borderRadius:"0.75rem",padding:"1rem",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"1rem",fontWeight:800,color:"#f8fafc",marginBottom:"0.25rem"},children:"Progress"}),e.jsx("div",{style:{fontSize:"0.7rem",color:"#cbd5e1"},children:"Questions Attempted"})]}),e.jsxs("div",{style:{background:"#475569",padding:"0.4rem 0.75rem",borderRadius:"0.5rem",fontSize:"0.9rem",fontWeight:800,color:"#f8fafc"},children:[W,"/",s.length]})]})})]}),e.jsx("div",{style:{flex:"1 1 300px",background:"rgba(59, 130, 246, 0.05)",borderRadius:"1.25rem",padding:"1.5rem",border:"1px solid rgba(59, 130, 246, 0.1)",display:"flex",alignItems:"center"},children:e.jsxs("div",{style:{display:"flex",gap:"0.75rem",color:"#3b82f6"},children:[e.jsx(U,{size:20}),e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:"0.8rem",fontWeight:800,marginBottom:"0.25rem"},children:"WINNER INFO"}),e.jsx("p",{style:{fontSize:"0.75rem",color:"#94a3b8",lineHeight:1.4},children:"Top 3 players will receive cash rewards directly to their wallet."})]})]})})]}),e.jsx("style",{children:`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes slideIn {
            from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
          }
          @media (max-width: 768px) {
            .top-header-container {
              flex-direction: column !important;
              justify-content: center !important;
              align-items: center !important;
              padding-top: 1rem;
            }
            .mobile-back-btn {
              margin-bottom: 1rem;
            }
            .back-text {
              display: inline-block;
            }
            .title-container {
              text-align: center !important;
              width: 100% !important;
              margin-bottom: 0.5rem;
            }
            .stats-container {
              justify-content: center !important;
              width: 100% !important;
            }
            .question-page-container {
              padding: 3.5rem 0.1rem 1rem 0.1rem !important;
            }
            .main-content-flex {
              flex-direction: row !important;
              flex-wrap: nowrap !important;
              gap: 2px !important;
            }
            .question-card {
              padding: 0.35rem !important;
              border-radius: 0.4rem !important;
              flex: 1 1 72% !important;
              min-width: 0 !important;
              overflow: hidden !important;
            }
            .sidebar-column {
              display: flex !important;
              flex: 0 0 26% !important;
              min-width: 0 !important;
              gap: 2px !important;
            }
            .sidebar-column > div {
              padding: 0.4rem !important;
              border-radius: 0.4rem !important;
            }
            .sidebar-column h3 {
              font-size: 0.45rem !important;
              margin-bottom: 0.2rem !important;
            }
            .sidebar-column .navigator-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 2px !important;
            }
            .sidebar-column .navigator-grid > div {
              height: 20px !important;
              font-size: 0.6rem !important;
            }
            .bottom-widgets-area {
              flex-direction: column !important;
              gap: 0.5rem !important;
            }
            .bottom-widgets-area > div {
              flex: 1 1 100% !important;
              padding: 0.75rem !important;
            }
            .question-card h2 {
              font-size: 1rem !important;
              margin-bottom: 0.75rem !important;
            }
            .question-card .option-item {
              padding: 0.5rem !important;
              gap: 0.25rem !important;
              border-radius: 0.5rem !important;
            }
            .question-card .option-item span {
              font-size: 0.75rem !important;
            }
            .question-card .option-item div {
              width: 18px !important;
              height: 18px !important;
              font-size: 0.6rem !important;
            }
            .question-card button {
              padding: 0.8rem 1rem !important;
              font-size: 0.85rem !important;
              font-weight: 900 !important;
              flex: 1 !important;
              border-radius: 0.75rem !important;
            }
          }
        `})]})]})};export{Z as default};
