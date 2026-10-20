import http from "node:http";
import worker from "../worker/worker.js";
const kv=new Map();
const USAGE={get:async k=>kv.get(k)??null,put:async(k,v)=>{kv.set(k,v)}};
const enc=new TextEncoder(),hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("");
async function mk(pw,salt){const key=await crypto.subtle.importKey("raw",enc.encode(pw),"PBKDF2",false,["deriveBits"]);
 return hex(await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:Uint8Array.from(salt.match(/../g).map(h=>parseInt(h,16))),iterations:100000},key,256))}
const USERS={rachel:{salt:"aa11",hash:await mk("clay-rachel","aa11"),cap:null},grace:{salt:"bb22",hash:await mk("clay-grace","bb22"),cap:0.03}};
const env={USAGE,SESSION_SECRET:"test-secret",USERS:JSON.stringify(USERS),ANTHROPIC_API_KEY:"x",ALLOWED_ORIGIN:"http://localhost:8765"};
const realFetch=globalThis.fetch;
globalThis.fetch=async(u,o)=>{if(String(u).includes("anthropic.com")){const b=JSON.parse(o.body);
  const isRecipe=b.model.includes("sonnet");
  const text=isRecipe?JSON.stringify({colors:[{hex:"ACB0AB",name:"Sage",options:[{title:"Mock",stains:[["6500","Sage",4]],predicted:"A9AEA6",note:"mock"}]}]}):JSON.stringify({items:[{kind:"glaze",brand:"Amaco",line:"Potter's Choice",code:"PC-20",name:"Blue Rutile"}]});
  return new Response(JSON.stringify({content:[{type:"text",text}],usage:{input_tokens:2500,output_tokens:1500},stop_reason:"end_turn"}),{status:200,headers:{"content-type":"application/json"}})}
 return realFetch(u,o)};
http.createServer(async(req,res)=>{const chunks=[];for await(const c of req)chunks.push(c);
 const r=new Request("http://localhost:8787"+req.url,{method:req.method,headers:req.headers,body:["GET","HEAD","OPTIONS"].includes(req.method)?undefined:Buffer.concat(chunks)});
 const out=await worker.fetch(r,env);res.writeHead(out.status,Object.fromEntries(out.headers));res.end(Buffer.from(await out.arrayBuffer()))}).listen(8787,()=>console.log("mock up"));
