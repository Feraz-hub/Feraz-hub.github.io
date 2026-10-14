import {writeFile} from 'node:fs/promises';
const repos=[];
for(let page=1;;page++){
  const response=await fetch(`https://api.github.com/users/Feraz-hub/repos?per_page=100&type=owner&page=${page}`,{headers:{'User-Agent':'Feranmi-Portfolio'}});
  if(!response.ok)throw new Error(`GitHub returned ${response.status}; existing snapshot preserved.`);
  const batch=await response.json();
  repos.push(...batch.filter(r=>!r.private).map(({name,description,html_url,homepage,language,fork,archived,size})=>({name,description,html_url,homepage,language,fork,archived,size})));
  if(batch.length<100)break;
}
await writeFile(new URL('../repos.json',import.meta.url),JSON.stringify(repos,null,2)+'\n');
console.log(`Saved ${repos.length} public repositories.`);

