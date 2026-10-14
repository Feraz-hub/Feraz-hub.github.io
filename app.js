'use strict';
const repoCopy = {
  'Feraz-hub.github.io':['This portfolio','Web projects, creative studies and interactive tools in one place.','web'],
  'Country-API':['Country explorer','Country data interface with list and detail pages.','web'],
  'multi-step-form-main':['Multi-step form','A staged form interface with plan selection and summary.','web'],
  'bean_scene':['Bean Scene','Coffee-themed landing page and responsive styling.','web'],
  'e-commerce':['E-commerce product page','Product interface with browser-side interaction.','web'],
  'Sigma2':['Sigma2','Landing page layout and CSS practice.','web'],
  'resduty':['Resduty','Frontend layout study built with HTML and CSS.','web'],
  'bussiness':['Business landing page','Business website layout and visual styling.','web'],
  'advice-generator':['Advice generator','A small frontend interface experiment.','web'],
  'Real-feedback-rep':['Feedback component','Interactive feedback interface exercise.','web'],
  'hangman':['Hangman','Browser game experiment.','play'],
  'tic-tac-toe':['Tic-tac-toe','A browser-based game exercise.','play'],
  'flip-cards':['Flip cards','An interactive card experiment.','play'],
  'fun':['Fun','Creative JavaScript experiments.','play'],
  'timeee':['Timeee','A small visual web experiment.','play'],
  'month':['Month','A personal HTML experiment.','play'],
  'enough':['Enough','An early HTML experiment.','play'],
  'surprise-site':['Surprise site','A personal interactive web project.','play'],
  'timetable':['Timetable','A simple HTML timetable exercise.','web'],
  'timetable2':['Timetable 2','Another timetable layout exercise.','web'],
  'KHAN-XD':['KHAN-XD','JavaScript repository; explore the source on GitHub.','play']
};
let repos = [], activeFilter = 'all';
const search = document.querySelector('#repo-search');
function renderRepos() {
  const term = search.value.toLowerCase().trim();
  const filtered = repos.filter(r => {
    const copy = repoCopy[r.name];
    const category = r.fork ? 'fork' : (copy?.[2] || 'play');
    return (activeFilter === 'all' || activeFilter === category) && `${r.name} ${copy?.[0] || ''} ${r.language || ''}`.toLowerCase().includes(term);
  });
  const root = document.querySelector('#repositories'); root.replaceChildren();
  document.querySelector('#repo-status').textContent = `${filtered.length} of ${repos.length} public repositories · snapshot October 2026`;
  if (!filtered.length) { const p = document.createElement('p'); p.className = 'repo-empty'; p.textContent = 'No matches. Try another search or filter.'; root.append(p); }
  filtered.forEach((r,i) => {
    const item = document.createElement('article'); item.className = 'repo-row';
    const index = document.createElement('span'); index.className = 'repo-index'; index.textContent = String(i+1).padStart(2,'0');
    const info = document.createElement('div'); info.className = 'repo-info';
    const link = document.createElement('a'); link.href = r.html_url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = repoCopy[r.name]?.[0] || r.name;
    const text = document.createElement('p'); text.textContent = r.fork ? 'Fork of a community project · not original authorship' : !r.size ? 'Empty repository · placeholder' : repoCopy[r.name]?.[1] || 'Learning repository · browse the source on GitHub.';
    const badge = document.createElement('span'); badge.className = 'repo-badge'; badge.textContent = r.fork ? 'FORK' : !r.size ? 'EMPTY' : r.language || 'SOURCE';
    const arrow = document.createElement('span'); arrow.className = 'repo-arrow'; arrow.textContent = '↗'; arrow.setAttribute('aria-hidden','true');
    info.append(link,badge,text); item.append(index,info,arrow); root.append(item);
  });
}
async function loadRepos(){
  try { const response = await fetch('repos.json'); if(!response.ok) throw new Error('Repository snapshot unavailable'); repos = await response.json(); repos.sort((a,b) => Number(a.fork)-Number(b.fork) || a.name.localeCompare(b.name)); renderRepos(); }
  catch { document.querySelector('#repo-status').textContent = 'The repository archive could not load. Visit @Feraz-hub on GitHub to see the full collection.'; }
}
search.addEventListener('input', renderRepos);
document.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => { activeFilter = b.dataset.filter; document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));}); renderRepos(); }));
function attendancePlan(attended,held,remaining,required){
  if(![attended,held,remaining,required].every(Number.isInteger) || attended<0 || held<1 || remaining<0 || attended>held || required<1 || required>100 || Math.max(attended,held,remaining)>10000) return {error:'Enter whole numbers. Attended classes cannot exceed classes held; the target must be 1–100%.'};
  const target = Math.ceil((held+remaining)*required/100);
  const needed = Math.max(0,target-attended);
  const current = attended/held*100;
  return {current,needed,canMiss:Math.max(0,remaining-needed),possible:needed<=remaining,best:(attended+remaining)/(held+remaining)*100};
}
function renderAttendance(){
  const values = ['attended','held','remaining','required'].map(id=>Number(document.getElementById(id).value));
  const result = attendancePlan(...values); const node = document.querySelector('#attendance-result'); node.replaceChildren();
  const strong = document.createElement('strong'), p = document.createElement('p');
  if(result.error){strong.textContent='Check your numbers';p.textContent=result.error;}
  else if(!result.possible){strong.textContent='Target is out of reach';p.textContent=`Even attending every remaining class gives ${result.best.toFixed(1)}%. Current attendance: ${result.current.toFixed(1)}%. Speak with your lecturer about your options.`;}
  else {strong.textContent=`You can miss ${result.canMiss} ${result.canMiss===1?'class':'classes'}.`;p.textContent=`Attend at least ${result.needed} of the ${values[2]} remaining classes to finish at or above ${values[3]}%. Current attendance: ${result.current.toFixed(1)}%.`;}
  node.append(strong,p);
}
document.querySelector('#attendance-form').addEventListener('submit',e=>{e.preventDefault();renderAttendance();});
function luminance(hex){const rgb=hex.replace('#','').match(/.{2}/g).map(x=>parseInt(x,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];}
function contrastRatio(fg,bg){const a=luminance(fg),b=luminance(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);}
function renderContrast(){const fg=document.querySelector('#text-color').value,bg=document.querySelector('#bg-color').value;const ratio=contrastRatio(fg,bg);const preview=document.querySelector('#contrast-preview');preview.style.color=fg;preview.style.backgroundColor=bg;const node=document.querySelector('#contrast-result');node.replaceChildren();const strong=document.createElement('strong'),p=document.createElement('p');strong.textContent=`${ratio.toFixed(2)}:1 contrast`;p.textContent=ratio>=7?'AAA normal text: pass · AA normal text: pass':ratio>=4.5?'AA normal text: pass · AAA normal text: fail':ratio>=3?'AA large text: pass · AA normal text: fail':'AA normal and large text: fail — try more contrasting colors.';node.append(strong,p);}
['text-color','bg-color'].forEach(id=>document.getElementById(id).addEventListener('input',renderContrast));
const galleries={
  zentor:{title:'Zentor / the real product',context:'A look at Zentor’s lecturer, student and parent interfaces, alongside captures of the public website in October 2026.',images:[['zentor-lecturer.jpg','Lecturer console: QR session, live attendance and Fraud Radar.'],['zentor-student.jpg','Published student dashboard screenshot.'],['zentor-parent.jpg','Published parent portal screenshot.'],['zentor-home.jpg','Public website capture: Zentor homepage.'],['zentor-features.jpg','Public website capture: attendance capabilities.'],['zentor-product.jpg','Public website capture: product gallery.']]},
  crash:{title:'Midnight Coupe / Blender study',context:'Supplied Blender viewport captures of a 3D scene. A visual study; no claim of a validated physics simulation.',images:[['crash-coupe.png','Vehicle impact scene: materials, debris and lighting.'],['crash-wireframe.png','Wireframe view of the scene construction.']]},
  roblox:{title:'Game assets / in development',context:'Supplied Blender work-in-progress captures. Exploring stylized assets and character rig workflows.',images:[['treasure-chest.png','Open treasure chest with coins and gems.'],['roblox-rig.png','Roblox-style character armature study.']]}
};
const dialog=document.querySelector('#gallery');let galleryTrigger;
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{const data=galleries[button.dataset.gallery];galleryTrigger=button;document.querySelector('#gallery-title').textContent=data.title;const root=document.querySelector('#gallery-content');root.replaceChildren();const context=document.createElement('p');context.className='gallery-context';context.textContent=data.context;root.append(context);data.images.forEach(([file,caption])=>{const figure=document.createElement('figure');figure.className='gallery-item';const image=document.createElement('img');image.src=`assets/${file}`;image.alt=caption;image.loading='lazy';const text=document.createElement('figcaption');text.textContent=caption;figure.append(image,text);root.append(figure);});dialog.showModal();dialog.scrollTop=0;}));
document.querySelector('#gallery-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>galleryTrigger?.focus());
document.querySelector('#copy-discord').addEventListener('click',async()=>{const status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText('dfw.gerald');status.textContent='Discord username copied: dfw.gerald';}catch{status.textContent='Discord username: dfw.gerald — select and copy this text.';}});
loadRepos();renderAttendance();renderContrast();
