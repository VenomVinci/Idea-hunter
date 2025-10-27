"use strict";(()=>{chrome.runtime.onMessage.addListener((n,s,r)=>{if(n?.type==="PROCESS_TRANSCRIPT")return(async()=>{try{let t=await d();if(!t.apiKey){r({ok:!1,error:"Missing OpenAI API key. Set it in the extension Options."});return}let c=await h(t.apiKey,t.model,n.title,n.transcript);r({ok:!0,data:c})}catch(t){console.error("Hunter analyze error",t),r({ok:!1,error:t?.message||String(t)})}})(),!0});async function d(){return new Promise(n=>{chrome.storage.local.get(["OPENAI_API_KEY","OPENAI_MODEL"],s=>{n({apiKey:s.OPENAI_API_KEY||null,model:s.OPENAI_MODEL||"gpt-4o-mini"})})})}async function h(n,s,r,t){let c=`You are Hunter, an assistant that analyzes YouTube tutorial transcripts. You must return a strict JSON object with keys: topics (array), quizzes (array). Do not include any text outside JSON. The JSON schema is:
{
  topics: [
    { id: string, title: string, startTimeSec: number, endTimeSec: number, summary: string, bullets: string[] }
  ],
  quizzes: [
    { id: string, timestampSec: number, question: string, options: string[], correctOptionIndex: number, explanation?: string }
  ]
}
Guidelines:
- Detect 4-10 key topics spanning the whole video.
- Use concise titles.
- Summaries should be 2-4 sentences.
- Bullets should be 3-5 actionable takeaways.
- Create 4-8 quiz questions focused on practical understanding.
- Timestamps must align with the topic or question segment.
- If transcript is short or unclear, still return a well-structured best effort.`,p=t.map(o=>`[${Math.round(o.startTimeSec)}s] ${o.text}`).join(`
`),u=24e3,y=p.length>u?p.slice(0,u)+`
...[truncated]...`:p,g=`Video title: ${r}

Transcript with timestamps (seconds):
${y}`,a=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({model:s,messages:[{role:"system",content:c},{role:"user",content:g}],temperature:.3,response_format:{type:"json_object"}})});if(!a.ok){let o=await a.text();throw new Error(`OpenAI error: ${a.status} ${o}`)}let i=(await a.json()).choices?.[0]?.message?.content;if(!i)throw new Error("Empty response from OpenAI");let e;try{e=JSON.parse(i)}catch{console.warn("Non-JSON content from OpenAI, attempting to recover");let l=i.indexOf("{"),m=i.lastIndexOf("}");if(l>=0&&m>=0)e=JSON.parse(i.slice(l,m+1));else throw new Error("Failed to parse JSON response from OpenAI")}return e.topics=Array.isArray(e.topics)?e.topics:[],e.quizzes=Array.isArray(e.quizzes)?e.quizzes:[],e}})();
