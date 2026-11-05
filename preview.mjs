import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve("dist");
const mime = {".js":"text/javascript; charset=utf-8",".mp4":"video/mp4",".png":"image/png",".svg":"image/svg+xml",".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".jpg":"image/jpeg",".xml":"application/xml",".txt":"text/plain"};
http.createServer((req,res)=>{
  try {
    const url = new URL(req.url,"http://localhost");
    const name = decodeURIComponent(url.pathname);
    const file = path.resolve(root,"."+name+(name.endsWith("/")?"index.html":""));
    if (path.relative(root,file).startsWith("..")) throw Error("Invalid path");
    const body = fs.readFileSync(file);
    res.writeHead(200,{"Content-Type":mime[path.extname(file)] || "application/octet-stream"});
    res.end(body);
  } catch {
    res.writeHead(404,{"Content-Type":"text/plain; charset=utf-8"});
    res.end("Not found");
  }
}).listen(4176,"127.0.0.1",()=>console.log("http://127.0.0.1:4176/"));
