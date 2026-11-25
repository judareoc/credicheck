const API=process.env.NEXT_PUBLIC_API_URL||"http://localhost:5000/api";
export const getToken=()=>typeof window==="undefined"?null:sessionStorage.getItem("cc_token");
export const getUser=()=>{if(typeof window==="undefined")return null;try{return JSON.parse(sessionStorage.getItem("cc_user")||"null")}catch{return null}};
export function saveSession(d){sessionStorage.setItem("cc_token",d.token);sessionStorage.setItem("cc_user",JSON.stringify(d.usuario))}
export function clearSession(){sessionStorage.removeItem("cc_token");sessionStorage.removeItem("cc_user")}
export async function api(path,options={}){const token=getToken();const r=await fetch(API+path,{...options,cache:"no-store",headers:{"Content-Type":"application/json",...(token?{Authorization:`Bearer ${token}`}:{ }),...(options.headers||{})}});const d=await r.json().catch(()=>({}));if(!r.ok){const e=new Error(d.error||"Error de API");e.status=r.status;throw e}return d}
