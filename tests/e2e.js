const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/?login#recipes');await p.waitForTimeout(500);
console.log('login visible',await p.isVisible('#cwLogin'));
await p.fill('#cwName','grace');await p.fill('#cwPass','nope');await p.click('#cwForm button');await p.waitForTimeout(500);
console.log('bad pw:',await p.textContent('#cwMsg'));
await p.fill('#cwPass','clay-grace');await p.click('#cwForm button');await p.waitForTimeout(1200);
console.log('login hidden',!(await p.isVisible('#cwLogin')),'|',(await p.textContent('#cwUser')).replace(/\s+/g,' '));
for(let i=0;i<3;i++){await p.click('#go');await p.waitForTimeout(1200);console.log('recipe',i+1,':',await p.textContent('#status'),'|',(await p.textContent('#cwUser')).replace(/\s+/g,' '))}
await p.click('#tab-studio');await p.fill('#q','pc-23');await p.waitForTimeout(200);await p.click('#results .ritem button.ghost');await p.waitForTimeout(1200);
console.log('shelves',await p.$$eval('#shelves .item',e=>e.length));
await p.click('#cwUser .cw-avatar');await p.click('#cwUser .cw-menu .out');await p.waitForTimeout(300);console.log('after logout shelves',await p.$$eval('#shelves .item',e=>e.length),'login shown',await p.isVisible('#cwLogin'));
await p.fill('#cwName','grace');await p.fill('#cwPass','clay-grace');await p.click('#cwForm button');await p.waitForTimeout(1500);
console.log('after relogin shelves',await p.$$eval('#shelves .item',e=>e.length));
await p.setViewportSize({width:390,height:800});await p.screenshot({path:'cw-mobile.png'});
await b.close()})();
