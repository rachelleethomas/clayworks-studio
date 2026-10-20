import { randomBytes, pbkdf2Sync } from "node:crypto";
const words="kiln glaze slip wedge bisque cone stain shino celadon tenmoku raku porcelain trim leather greenware crawl".split(" ");
const pw=()=>[0,1,2].map(()=>words[randomBytes(1)[0]%words.length]).join("-")+"-"+(10+randomBytes(1)[0]%90);
const users={},creds={};
for(const [u,cap] of [["rachel",null],["grace",3]]){const p=pw(),salt=randomBytes(16).toString("hex");
 users[u]={salt,hash:pbkdf2Sync(p,Buffer.from(salt,"hex"),100000,32,"sha256").toString("hex"),cap};creds[u]=p}
console.log(JSON.stringify({USERS:JSON.stringify(users),SESSION_SECRET:randomBytes(32).toString("hex"),creds},null,1));
