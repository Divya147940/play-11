import{r as a,j as e}from"./vendor-core-754eFBWZ.js";import{H}from"./index-C6Hl-48i.js";import{c as M,u as U}from"./vendor-router-DpCHN5bO.js";import{o as Q,I as Y}from"./vendor-lucide-Czx_Sl3Z.js";const Z=()=>{var T;const{id:f}=M(),x=U(),[r,j]=a.useState(0),[l,E]=a.useState({}),[p,k]=a.useState(600),[s,z]=a.useState([]),[g,q]=a.useState(null),[v,N]=a.useState(!0),[b,$]=a.useState(!1),[c,I]=a.useState(!1),[C,A]=a.useState(600),[L,P]=a.useState(!1);a.useEffect(()=>{const i=localStorage.getItem("play11_session")||localStorage.getItem("play11_admin_session");let n={};if(i)try{const t=JSON.parse(i);n.Authorization=`Bearer ${t.token||i}`}catch{n.Authorization=`Bearer ${i}`}Promise.all([fetch(`/api/quizzes/${f}`,{headers:n}).then(t=>t.json()),fetch(`/api/quizzes/${f}/questions`,{headers:n}).then(t=>t.json())]).then(([t,o])=>{if(t.success){if(t.quiz.is_submitted){x(`/study-result/${f}`);return}q(t.quiz),t.quiz.timer_minutes&&(k(t.quiz.timer_minutes*60),A(t.quiz.timer_minutes*60))}o.success&&o.questions.length>0?z(o.questions):z([{id:"mock",question_text:"No questions available.",options:[]}])}).catch(console.error).finally(()=>N(!1))},[f]);const w=a.useCallback(async()=>{if(b||c)return;I(!0);let i=0;s.forEach(d=>{l[d.id]===d.answer&&(i+=1)});const n=(C||300)-p,t=d=>{const h=Math.floor(d/60),m=d%60;return`${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`},o={score:i,total:s.length,rank:"-",time:t(n)},y=localStorage.getItem("play11_session")||localStorage.getItem("play11_admin_session");if(y){let d;try{d=JSON.parse(y).token||y}catch{d=y}try{const m=await(await fetch(`/api/quizzes/${f}/submit`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify({answers:Object.keys(l).reduce((R,B)=>{const S=s[parseInt(B)],_=l[B];return S&&S.options&&S.options[_]&&(R[S.id]=String(S.options[_].value)),R},{}),time_taken:o.time})})).json();m.success&&m.submission?(o.score=parseFloat(m.submission.total_score||o.score),o.rank=m.submission.rank||o.rank,o.correct=m.submission.correct_count||0,o.wrong=m.submission.wrong_count||0):alert("Error submitting quiz: "+(m.error||"Unknown error"))}catch(h){console.error("Submission failed:",h),alert("Network error: Could not submit quiz. Please check your connection.")}}P(!0),setTimeout(()=>{$(!0),I(!1),x(`/study-result/${f}`,{state:o})},100)},[l,f,x,b,c,s,p,C]);a.useEffect(()=>{if(v||b)return;if(p===0){w();return}const i=setInterval(()=>k(n=>n-1),1e3);return()=>clearInterval(i)},[p,w,v,b]);const O=i=>{const n=Math.floor(i/60),t=i%60;return`${n.toString().padStart(2,"0")}:${t.toString().padStart(2,"0")}`},F=i=>{b||E({...l,[r]:i})};if(v)return e.jsx("div",{style:{minHeight:"100vh",background:"#0a192f",display:"flex",alignItems:"center",justifyContent:"center",color:"white"},children:e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{width:"50px",height:"50px",border:"4px solid #1e293b",borderTopColor:"#3b82f6",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 1rem"}}),e.jsx("p",{style:{fontWeight:800,color:"#94a3b8"},children:"Entering Study Arena..."})]})});const u=s[r],W=Object.keys(l).length;return(r+1)/s.length*100,e.jsxs("div",{className:"study-question-page",style:{minHeight:"100vh",background:"#0f172a",paddingBottom:"3rem"},children:[e.jsx(H,{}),e.jsxs("div",{className:"container",style:{padding:"0 1rem 2rem 1rem",paddingTop:"60px",maxWidth:"100%"},children:[(g==null?void 0:g.effective_banner_url)&&e.jsx("div",{style:{width:"calc(100% + 2rem)",marginLeft:"-1rem",marginRight:"-1rem",height:"clamp(160px, 25vh, 300px)",borderRadius:"0",backgroundColor:"#0d1f3c",marginBottom:"2rem",boxShadow:"0 10px 30px rgba(0,0,0,0.2)",position:"relative",overflow:"hidden"},children:e.jsx("img",{src:g.effective_banner_url,alt:"Quiz Banner",style:{width:"100%",height:"100%",objectFit:"fill",display:"block"}})}),L&&e.jsxs("div",{style:{position:"fixed",top:"80px",left:"50%",transform:"translateX(-50%)",background:"#10b981",color:"white",padding:"1rem 3rem",borderRadius:"1rem",fontWeight:900,fontSize:"1.1rem",boxShadow:"0 10px 25px -5px rgba(16, 185, 129, 0.4)",zIndex:1e3,display:"flex",alignItems:"center",gap:"1rem",animation:"slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:[e.jsx("div",{style:{width:"24px",height:"24px",borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center"},children:"✓"}),"SUBMITTED SUCCESSFULLY"]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"stretch",marginBottom:"1rem",gap:"0.75rem",textAlign:"center"},children:[e.jsx("div",{style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem",cursor:"pointer"},onClick:()=>x("/home-choice"),children:[e.jsx(Q,{size:24,color:"#ffffff"}),e.jsx("h1",{style:{fontSize:"1.4rem",fontWeight:900,margin:"0",color:"#ffffff"},children:(g==null?void 0:g.title)||"Movies"})]})}),e.jsxs("div",{style:{display:"flex",gap:"1.5rem",justifyContent:"center"},children:[e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"0.65rem",fontWeight:800,color:"#cbd5e1",textTransform:"uppercase",marginBottom:"0.1rem"},children:"ZONE"}),e.jsx("div",{style:{fontSize:"1rem",fontWeight:900,color:"#ffffff"},children:"STUDY"})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"0.65rem",fontWeight:800,color:p<60?"#ef4444":"#cbd5e1",textTransform:"uppercase",marginBottom:"0.1rem"},children:"TIME LEFT"}),e.jsx("div",{style:{fontSize:"1rem",fontWeight:900,color:p<60?"#ef4444":"#ffffff"},children:O(p)})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"0.65rem",fontWeight:800,color:"#cbd5e1",textTransform:"uppercase",marginBottom:"0.1rem"},children:"ANSWERED"}),e.jsxs("div",{style:{fontSize:"1rem",fontWeight:900,color:"#ffffff"},children:[W,"/",s.length]})]})]})]}),e.jsx("div",{className:"main-content-flex",style:{display:"flex",flexDirection:"column",gap:"1.5rem",marginBottom:"1.5rem"},children:e.jsxs("div",{className:"question-card",style:{width:"100%",background:"#ffffff",borderRadius:"1.5rem",padding:"1.5rem",color:"#0f172a"},children:[e.jsxs("p",{style:{fontSize:"1.1rem",fontWeight:600,marginBottom:"2rem",lineHeight:1.4,color:"#334155"},children:["Q",r+1,". ",u==null?void 0:u.question_text]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr",gap:"1rem",marginBottom:"3rem"},children:(T=u==null?void 0:u.options)==null?void 0:T.map((i,n)=>{const t=l[r]==n,o="#3b82f6";return e.jsxs("div",{className:`option-item ${t?"selected":""}`,onClick:()=>F(n),style:{display:"flex",alignItems:"center",gap:"1rem",padding:"1.25rem 1.5rem",borderRadius:"1rem",border:t?`2px solid ${o}`:"1px solid #e2e8f0",background:t?o:"#ffffff",color:t?"#ffffff":"#0f172a",cursor:"pointer",transition:"all 0.2s ease",boxShadow:t?"0 8px 20px -4px rgba(59, 130, 246, 0.3)":"none"},children:[e.jsx("div",{style:{width:"32px",height:"32px",borderRadius:"50%",background:t?"#ffffff":"#1e293b",color:t?"#3b82f6":"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",fontWeight:800},children:String.fromCharCode(65+n)}),e.jsx("span",{style:{fontSize:"1.1rem",fontWeight:800},children:i.text})]},n)})}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",justifyContent:"space-between"},children:[e.jsx("button",{onClick:()=>{r>0?j(r-1):x("/home-choice")},style:{flex:1,background:"#ffffff",border:"1px solid #cbd5e1",color:"#475569",padding:"0.75rem 0",borderRadius:"0.5rem",fontWeight:700,fontSize:"0.85rem",cursor:"pointer"},children:"Previous"}),e.jsx("button",{onClick:()=>{r<s.length-1&&j(r+1)},disabled:r===s.length-1||c,style:{flex:1,background:"#ffffff",border:"1px solid #cbd5e1",color:"#475569",padding:"0.75rem 0",borderRadius:"0.5rem",fontWeight:700,fontSize:"0.85rem",cursor:"pointer",opacity:r===s.length-1?.3:1},children:"Skip"}),e.jsx("button",{onClick:()=>{r===s.length-1?w():j(r+1)},disabled:l[r]===void 0||c,style:{flex:1.5,background:l[r]===void 0||c?"#94a3b8":"#0052cc",border:"none",color:"#ffffff",padding:"0.75rem 0",borderRadius:"0.5rem",fontWeight:700,fontSize:"0.85rem",cursor:l[r]===void 0||c?"not-allowed":"pointer",boxShadow:l[r]===void 0||c?"none":"0 4px 10px rgba(0, 82, 204, 0.3)",transition:"all 0.2s ease"},children:c?"Submitting...":r===s.length-1?"Submit Battle":"Save & Next"})]})]})}),e.jsxs("div",{className:"bottom-widgets-area",style:{display:"flex",gap:"1.5rem",flexWrap:"wrap",marginBottom:"1.5rem"},children:[e.jsxs("div",{style:{flex:"1 1 300px",background:"#1e293b",borderRadius:"1.25rem",padding:"1.5rem",border:"1px solid #334155"},children:[e.jsx("h3",{style:{fontSize:"0.75rem",fontWeight:800,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"1.25rem"},children:"LIVE RANK PREVIEW"}),e.jsx("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:e.jsxs("div",{style:{flex:"1 1 200px",background:"#334155",borderRadius:"0.75rem",padding:"1rem",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"1rem",fontWeight:800,color:"#f8fafc",marginBottom:"0.25rem"},children:"Progress"}),e.jsx("div",{style:{fontSize:"0.7rem",color:"#cbd5e1"},children:"Questions Attempted"})]}),e.jsxs("div",{style:{background:"#475569",padding:"0.4rem 0.75rem",borderRadius:"0.5rem",fontSize:"0.9rem",fontWeight:800,color:"#f8fafc"},children:[W,"/",s.length]})]})})]}),e.jsx("div",{style:{flex:"1 1 300px",background:"rgba(56, 189, 248, 0.05)",borderRadius:"1.25rem",padding:"1.5rem",border:"1px solid rgba(56, 189, 248, 0.1)",display:"flex",alignItems:"center"},children:e.jsxs("div",{style:{display:"flex",gap:"0.75rem",color:"#38bdf8"},children:[e.jsx(Y,{size:20}),e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:"0.8rem",fontWeight:800,marginBottom:"0.25rem"},children:"PRO TIP"}),e.jsx("p",{style:{fontSize:"0.75rem",color:"#94a3b8",lineHeight:1.4},children:"Quick answers grant bonus points in the final calculation."})]})]})})]}),e.jsx("style",{children:`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes slideIn {
            from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
          }
          @media (max-width: 768px) {
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
              padding: 0.5rem 0.75rem !important;
              font-size: 0.7rem !important;
              min-width: 0 !important;
            }
          }
        `})]})]})};export{Z as default};
