import{r as a,j as e}from"./vendor-core-CFw98Jpq.js";import{H as F}from"./index-CQI9lRDL.js";import{c as H,u as U}from"./vendor-router-wGrc2b_U.js";import{q as J,I as Q}from"./vendor-lucide-DwXPRU3z.js";const D=()=>{var C;const{id:n}=H(),y=U(),[i,j]=a.useState(()=>{const r=localStorage.getItem(`quiz_idx_${n}`);return r?parseInt(r):0}),[m,R]=a.useState(()=>{const r=localStorage.getItem(`quiz_answers_${n}`);return r?JSON.parse(r):{}}),[u,w]=a.useState(600),[l,I]=a.useState([]),[h,B]=a.useState(null),[S,E]=a.useState(!0),[x,N]=a.useState(!1),[p,k]=a.useState(!1),[_,A]=a.useState(600),[O,P]=a.useState(!1);a.useEffect(()=>{const r=localStorage.getItem("play11_session")||localStorage.getItem("play11_admin_session");let o={};if(r)try{const t=JSON.parse(r);o.Authorization=`Bearer ${t.token||r}`}catch{o.Authorization=`Bearer ${r}`}Promise.all([fetch(`/api/quizzes/${n}`,{headers:o}).then(t=>t.json()),fetch(`/api/quizzes/${n}/questions`,{headers:o}).then(t=>t.json())]).then(([t,s])=>{if(t.success){if(t.quiz.is_submitted){y(`/study-result/${n}`);return}B(t.quiz);const c=(t.quiz.timer_minutes||10)*60;A(c);const d=localStorage.getItem(`quiz_end_${n}`);if(d){const g=Math.max(0,Math.floor((parseInt(d)-Date.now())/1e3));w(g)}else localStorage.setItem(`quiz_end_${n}`,Date.now()+c*1e3),w(c)}s.success&&s.questions.length>0?I(s.questions):I([{id:"mock",question_text:"No questions available.",options:[]}])}).catch(console.error).finally(()=>E(!1))},[n]);const z=a.useCallback(async()=>{if(x||p)return;k(!0);let r=0;l.forEach(d=>{m[d.id]===d.answer&&(r+=1)});const o=(_||300)-u,t=d=>{const g=Math.floor(d/60),f=d%60;return`${g.toString().padStart(2,"0")}:${f.toString().padStart(2,"0")}`},s={score:r,total:l.length,rank:"-",time:t(o)},c=localStorage.getItem("play11_session")||localStorage.getItem("play11_admin_session");if(c){let d;try{d=JSON.parse(c).token||c}catch{d=c}try{const f=await(await fetch(`/api/quizzes/${n}/submit`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify({answers:Object.keys(m).reduce((T,W)=>{const v=l[parseInt(W)],$=m[W];return v&&v.options&&v.options[$]&&(T[v.id]=String(v.options[$].value)),T},{}),time_taken:s.time})})).json();f.success&&f.submission?(s.score=parseFloat(f.submission.total_score||s.score),s.rank=f.submission.rank||s.rank,s.correct=f.submission.correct_count||0,s.wrong=f.submission.wrong_count||0):alert("Error submitting quiz: "+(f.error||"Unknown error"))}catch(g){console.error("Submission failed:",g),alert("Network error: Could not submit quiz. Please check your connection.")}}P(!0),localStorage.removeItem(`quiz_end_${n}`),localStorage.removeItem(`quiz_answers_${n}`),localStorage.removeItem(`quiz_idx_${n}`),setTimeout(()=>{N(!0),k(!1),y(`/study-result/${n}`,{state:s})},100)},[m,n,y,x,p,l,u,_]);a.useEffect(()=>{if(S||x)return;if(u===0){z();return}const r=setInterval(()=>w(o=>o-1),1e3);return()=>clearInterval(r)},[u,z,S,x]);const L=r=>{const o=Math.floor(r/60),t=r%60;return`${o.toString().padStart(2,"0")}:${t.toString().padStart(2,"0")}`};a.useEffect(()=>{!S&&!x&&localStorage.setItem(`quiz_idx_${n}`,i)},[i,n,S,x]);const M=r=>{if(x)return;const o={...m,[i]:r};R(o),localStorage.setItem(`quiz_answers_${n}`,JSON.stringify(o))};if(S)return e.jsx("div",{style:{minHeight:"100vh",background:"#0a192f",display:"flex",alignItems:"center",justifyContent:"center",color:"white"},children:e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{width:"50px",height:"50px",border:"4px solid #1e293b",borderTopColor:"#3b82f6",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 1rem"}}),e.jsx("p",{style:{fontWeight:800,color:"#94a3b8"},children:"Entering Study Arena..."})]})});const b=l[i],q=Object.keys(m).length;return(i+1)/l.length*100,e.jsxs("div",{className:"study-question-page",style:{minHeight:"100vh",background:"#0f172a",paddingBottom:"3rem"},children:[e.jsx(F,{}),e.jsxs("div",{className:"container",style:{padding:"0 1rem 2rem 1rem",paddingTop:"60px",maxWidth:"100%"},children:[(h==null?void 0:h.effective_banner_url)&&e.jsx("div",{style:{width:"calc(100% + 2rem)",marginLeft:"-1rem",marginRight:"-1rem",height:"clamp(160px, 25vh, 300px)",borderRadius:"0",backgroundColor:"#0d1f3c",marginBottom:"2rem",boxShadow:"0 10px 30px rgba(0,0,0,0.2)",position:"relative",overflow:"hidden"},children:e.jsx("img",{src:h.effective_banner_url,alt:"Quiz Banner",style:{width:"100%",height:"100%",objectFit:"fill",display:"block"}})}),O&&e.jsxs("div",{style:{position:"fixed",top:"80px",left:"50%",transform:"translateX(-50%)",background:"#10b981",color:"white",padding:"1rem 3rem",borderRadius:"1rem",fontWeight:900,fontSize:"1.1rem",boxShadow:"0 10px 25px -5px rgba(16, 185, 129, 0.4)",zIndex:1e3,display:"flex",alignItems:"center",gap:"1rem",animation:"slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},children:[e.jsx("div",{style:{width:"24px",height:"24px",borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center"},children:"✓"}),"SUBMITTED SUCCESSFULLY"]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"stretch",marginBottom:"1rem",gap:"0.75rem",textAlign:"center"},children:[e.jsx("div",{style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem",cursor:"pointer"},onClick:()=>y("/home-choice"),children:[e.jsx(J,{size:24,color:"#ffffff"}),e.jsx("h1",{style:{fontSize:"1.4rem",fontWeight:900,margin:"0",color:"#ffffff"},children:(h==null?void 0:h.title)||"Movies"})]})}),e.jsxs("div",{style:{display:"flex",gap:"1.5rem",justifyContent:"center"},children:[e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"0.65rem",fontWeight:800,color:"#cbd5e1",textTransform:"uppercase",marginBottom:"0.1rem"},children:"ZONE"}),e.jsx("div",{style:{fontSize:"1rem",fontWeight:900,color:"#ffffff"},children:"STUDY"})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"0.65rem",fontWeight:800,color:u<60?"#ef4444":"#cbd5e1",textTransform:"uppercase",marginBottom:"0.1rem"},children:"TIME LEFT"}),e.jsx("div",{style:{fontSize:"1rem",fontWeight:900,color:u<60?"#ef4444":"#ffffff"},children:L(u)})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"0.65rem",fontWeight:800,color:"#cbd5e1",textTransform:"uppercase",marginBottom:"0.1rem"},children:"ANSWERED"}),e.jsxs("div",{style:{fontSize:"1rem",fontWeight:900,color:"#ffffff"},children:[q,"/",l.length]})]})]})]}),e.jsx("div",{className:"main-content-flex",style:{display:"flex",flexDirection:"column",gap:"1.5rem",marginBottom:"1.5rem"},children:e.jsxs("div",{className:"question-card",style:{width:"100%",background:"#ffffff",borderRadius:"1.5rem",padding:"1.5rem",color:"#0f172a"},children:[e.jsxs("p",{style:{fontSize:"1.1rem",fontWeight:600,marginBottom:"2rem",lineHeight:1.4,color:"#334155"},children:["Q",i+1,". ",b==null?void 0:b.question_text]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr",gap:"1rem",marginBottom:"3rem"},children:(C=b==null?void 0:b.options)==null?void 0:C.map((r,o)=>{const t=m[i]==o,s="#3b82f6";return e.jsxs("div",{className:`option-item ${t?"selected":""}`,onClick:()=>M(o),style:{display:"flex",alignItems:"center",gap:"1rem",padding:"1.25rem 1.5rem",borderRadius:"1rem",border:t?`2px solid ${s}`:"1px solid #e2e8f0",background:t?s:"#ffffff",color:t?"#ffffff":"#0f172a",cursor:"pointer",transition:"all 0.2s ease",boxShadow:t?"0 8px 20px -4px rgba(59, 130, 246, 0.3)":"none"},children:[e.jsx("div",{style:{width:"32px",height:"32px",borderRadius:"50%",background:t?"#ffffff":"#1e293b",color:t?"#3b82f6":"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",fontWeight:800},children:String.fromCharCode(65+o)}),e.jsx("span",{style:{fontSize:"1.1rem",fontWeight:800},children:r.text})]},o)})}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",justifyContent:"space-between"},children:[e.jsx("button",{onClick:()=>{i>0?j(i-1):y("/home-choice")},style:{flex:1,background:"#ffffff",border:"1px solid #cbd5e1",color:"#475569",padding:"0.75rem 0",borderRadius:"0.5rem",fontWeight:700,fontSize:"0.85rem",cursor:"pointer"},children:"Previous"}),e.jsx("button",{onClick:()=>{i<l.length-1&&j(i+1)},disabled:i===l.length-1||p,style:{flex:1,background:"#ffffff",border:"1px solid #cbd5e1",color:"#475569",padding:"0.75rem 0",borderRadius:"0.5rem",fontWeight:700,fontSize:"0.85rem",cursor:"pointer",opacity:i===l.length-1?.3:1},children:"Skip"}),e.jsx("button",{onClick:()=>{i===l.length-1?z():j(i+1)},disabled:m[i]===void 0||p,style:{flex:1.5,background:m[i]===void 0||p?"#94a3b8":"#0052cc",border:"none",color:"#ffffff",padding:"0.75rem 0",borderRadius:"0.5rem",fontWeight:700,fontSize:"0.85rem",cursor:m[i]===void 0||p?"not-allowed":"pointer",boxShadow:m[i]===void 0||p?"none":"0 4px 10px rgba(0, 82, 204, 0.3)",transition:"all 0.2s ease"},children:p?"Submitting...":i===l.length-1?"Submit Battle":"Save & Next"})]})]})}),e.jsxs("div",{className:"bottom-widgets-area",style:{display:"flex",gap:"1.5rem",flexWrap:"wrap",marginBottom:"1.5rem"},children:[e.jsxs("div",{style:{flex:"1 1 300px",background:"#1e293b",borderRadius:"1.25rem",padding:"1.5rem",border:"1px solid #334155"},children:[e.jsx("h3",{style:{fontSize:"0.75rem",fontWeight:800,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"1.25rem"},children:"QUIZ PROGRESS"}),e.jsx("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:e.jsxs("div",{style:{flex:"1 1 200px",background:"#334155",borderRadius:"0.75rem",padding:"1rem",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"1rem",fontWeight:800,color:"#f8fafc",marginBottom:"0.25rem"},children:"Progress"}),e.jsx("div",{style:{fontSize:"0.7rem",color:"#cbd5e1"},children:"Questions Attempted"})]}),e.jsxs("div",{style:{background:"#475569",padding:"0.4rem 0.75rem",borderRadius:"0.5rem",fontSize:"0.9rem",fontWeight:800,color:"#f8fafc"},children:[q,"/",l.length]})]})})]}),e.jsx("div",{style:{flex:"1 1 300px",background:"rgba(56, 189, 248, 0.05)",borderRadius:"1.25rem",padding:"1.5rem",border:"1px solid rgba(56, 189, 248, 0.1)",display:"flex",alignItems:"center"},children:e.jsxs("div",{style:{display:"flex",gap:"0.75rem",color:"#38bdf8"},children:[e.jsx(Q,{size:20}),e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:"0.8rem",fontWeight:800,marginBottom:"0.25rem"},children:"PRO TIP"}),e.jsx("p",{style:{fontSize:"0.75rem",color:"#94a3b8",lineHeight:1.4},children:"Quick answers grant bonus points in the final calculation."})]})]})})]}),e.jsx("style",{children:`
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
        `})]})]})};export{D as default};
