const parts = {
  pavilhao:{title:"Pavilhão auricular",icon:"👂",type:"OUVIDO EXTERNO",text:"Capta as ondas sonoras do ambiente e ajuda a direcioná-las para o canal auditivo."},
  canal:{title:"Canal auditivo",icon:"〰️",type:"OUVIDO EXTERNO",text:"Conduz as ondas sonoras até o tímpano e também oferece alguma proteção à região mais interna."},
  timpano:{title:"Tímpano",icon:"⭕",type:"OUVIDO MÉDIO",text:"É uma membrana que vibra quando recebe ondas sonoras. Essas vibrações são transmitidas aos ossículos."},
  ossiculos:{title:"Ossículos",icon:"🔨",type:"OUVIDO MÉDIO",text:"Martelo, bigorna e estribo formam uma cadeia que transmite e ajuda a amplificar as vibrações do tímpano."},
  coclea:{title:"Cóclea",icon:"🐚",type:"OUVIDO INTERNO",text:"Estrutura espiralada que contém células sensoriais capazes de transformar vibrações em sinais relacionados à audição."},
  canais:{title:"Canais semicirculares",icon:"🌀",type:"OUVIDO INTERNO",text:"Participam do sistema vestibular, ajudando o cérebro a perceber movimentos e manter o equilíbrio."},
  nervo:{title:"Nervo auditivo",icon:"⚡",type:"CONEXÃO COM O CÉREBRO",text:"Conduz informações produzidas pelo sistema auditivo interno em direção às regiões cerebrais responsáveis pelo processamento do som."}
};
const order=["pavilhao","canal","timpano","ossiculos","coclea","canais","nervo"];
let currentPart=0;

function selectPart(key,fromUser=false){
  const p=parts[key];
  document.querySelectorAll(".part,.hotspot,.zone,.pin").forEach(e=>e.classList.remove("selected"));
  document.querySelectorAll(`[data-part="${key}"]`).forEach(e=>e.classList.add("selected"));
  document.getElementById("partIcon").textContent=p.icon;
  document.getElementById("partTitle").textContent=p.title;
  document.getElementById("partText").textContent=p.text;
  document.getElementById("partType").textContent=p.type;
  currentPart=order.indexOf(key);
  const cap=document.getElementById("stageCaption");
  if(cap) cap.textContent=p.title;
  if(fromUser && window.matchMedia("(max-width:850px)").matches){
    document.querySelector(".info-panel").scrollIntoView({behavior:"smooth",block:"nearest"});
  }
}
document.querySelectorAll("[data-part]").forEach(el=>{
  el.addEventListener("click",()=>selectPart(el.dataset.part,true));
  el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectPart(el.dataset.part,true)}});
});
document.getElementById("nextPart").addEventListener("click",()=>selectPart(order[(currentPart+1)%order.length]));

const JOURNEY_TIME = 5000; // 5 segundos por etapa (se mudar, mude também "5s" no CSS .journey-bar.run)
const journeySteps=[...document.querySelectorAll(".journey-step")];
const journeyStage=document.getElementById("journeyStage");
const journeyBar=document.getElementById("journeyBar");
const journeyBtn=document.getElementById("startJourney");
const journeyStatus=document.getElementById("journeyStatus");
const journeyData=[
  {icon:"🔊",title:"Som",text:"Tudo começa com uma vibração no ar que se propaga em forma de onda até chegar ao ouvido."},
  {icon:"👂",title:"Canal",text:"A orelha capta a onda e o canal auditivo a conduz até o tímpano."},
  {icon:"⭕",title:"Tímpano",text:"A membrana do tímpano vibra no mesmo ritmo da onda sonora."},
  {icon:"🔨",title:"Ossículos",text:"Martelo, bigorna e estribo amplificam a vibração e a levam ao ouvido interno."},
  {icon:"🐚",title:"Cóclea",text:"Dentro da cóclea, o líquido e as células ciliadas transformam vibração em impulsos."},
  {icon:"⚡",title:"Nervo",text:"O nervo auditivo carrega o sinal elétrico em direção ao cérebro."},
  {icon:"🧠",title:"Cérebro",text:"O cérebro interpreta o sinal e reconhece o som: voz, música, ruído."}
];

// cria os slides dentro do palco
const journeySlides=journeyData.map((d,n)=>{
  const s=document.createElement("div");
  s.className="journey-slide";
  s.innerHTML=`<div class="big">${d.icon}</div><div><div class="tag">Etapa ${n+1} de ${journeyData.length}</div><h3>${d.title}</h3><p>${d.text}</p></div>`;
  journeyStage.insertBefore(s,journeyBar);
  return s;
});

let journeyTimer=null, journeyCur=-1;

function showJourney(n){
  if(journeyCur>=0){
    const old=journeyCur;
    journeySlides[old].className="journey-slide out";
    setTimeout(()=>journeySlides[old].className="journey-slide",650);
  }
  journeyCur=n;
  journeySteps.forEach((s,k)=>{
    s.classList.toggle("done",k<n);
    s.classList.toggle("active",k===n);
  });
  journeyStatus.textContent=`Etapa ${n+1} de ${journeyData.length}: ${journeyData[n].title}`;
  setTimeout(()=>journeySlides[n].className="journey-slide in",n>0?300:0);

  // reinicia a barra de 5s
  journeyBar.className="journey-bar"; void journeyBar.offsetWidth; journeyBar.className="journey-bar run";

  journeyTimer=setTimeout(()=>n<journeyData.length-1?showJourney(n+1):finishJourney(),JOURNEY_TIME);
}

function finishJourney(){
  journeySlides[journeyCur].className="journey-slide out";
  journeySteps.forEach(s=>{s.classList.remove("active");s.classList.add("done")});
  journeyBar.className="journey-bar"; journeyCur=-1;
  journeyStatus.textContent="Viagem concluída! 🧠";
  journeyBtn.disabled=false;
  journeyBtn.textContent="↻ Reiniciar viagem";
}

journeyBtn.addEventListener("click",()=>{
  clearTimeout(journeyTimer);
  journeySlides.forEach(s=>s.className="journey-slide");
  journeySteps.forEach(s=>s.classList.remove("active","done"));
  journeyCur=-1;
  journeyBtn.disabled=true;
  journeyBtn.textContent="Viajando...";
  showJourney(0);
});

const frequencies=[125,250,500,1000,2000,4000,8000,12000];
let testIndex=0, answers=[];
let audioCtx=null, oscillator=null, gainNode=null;

function updateTest(){
  const f=frequencies[testIndex];
  document.getElementById("testStep").textContent=testIndex+1;
  document.getElementById("testFreqLabel").textContent=f+" Hz";
  document.getElementById("freqBig").textContent=f.toLocaleString("pt-BR");
  document.getElementById("progressBar").style.width=(testIndex/8*100)+"%";
  document.getElementById("resultScore").textContent=answers.length+"/8";
}
function ensureAudio(){
  if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==="suspended") audioCtx.resume();
}
function stopTone(){
  if(oscillator){try{oscillator.stop()}catch(e){} oscillator.disconnect();oscillator=null}
}
function playTone(){
  ensureAudio(); stopTone();
  oscillator=audioCtx.createOscillator();
  gainNode=audioCtx.createGain();
  oscillator.type="sine";
  oscillator.frequency.value=frequencies[testIndex];
  const rel=Number(document.getElementById("volumeRange").value);
  gainNode.gain.value=Math.min(.08, rel/1000);
  oscillator.connect(gainNode).connect(audioCtx.destination);
  oscillator.start();
  setTimeout(stopTone,1500);
}
function answer(heard){
  stopTone();
  answers.push({frequency:frequencies[testIndex],heard});
  document.getElementById("resultScore").textContent=answers.length+"/8";
  if(answers.length>=8){
    document.getElementById("progressBar").style.width="100%";
    const heardCount=answers.filter(a=>a.heard).length;
    document.getElementById("testResult").innerHTML=`<div class="result-icon">📊</div><h3>Teste concluído</h3><p>Você indicou que ouviu ${heardCount} de 8 tons.</p>`;
    return;
  }
  testIndex++;
  updateTest();
  document.getElementById("testResult").innerHTML=`<div class="result-icon">🎧</div><h3>Próxima frequência</h3><p>Continue em um volume confortável.</p>`;
}
document.getElementById("playTone").addEventListener("click",playTone);
document.getElementById("stopTone").addEventListener("click",stopTone);
document.getElementById("heardBtn").addEventListener("click",()=>answer(true));
document.getElementById("notHeardBtn").addEventListener("click",()=>answer(false));
document.getElementById("volumeRange").addEventListener("input",e=>document.getElementById("volumeValue").textContent=e.target.value);
document.getElementById("resetTest").addEventListener("click",()=>{stopTone();testIndex=0;answers=[];updateTest();document.getElementById("testResult").innerHTML=`<div class="result-icon">🎧</div><h3>Faça o primeiro teste</h3><p>Reproduza o tom e responda com sinceridade.</p>`});

const conditionData={
 labirintite:["🌀","Labirintite","O termo é usado de forma ampla para problemas que envolvem o labirinto/ ouvido interno. Tontura, desequilíbrio e outros sintomas podem ocorrer. A causa precisa ser investigada por um profissional."],
 zumbido:["🔔","Zumbido","É a percepção de um som sem uma fonte sonora externa correspondente. Pode ter diferentes causas e características e, quando persistente ou incômodo, merece avaliação."],
 otite:["🦠","Otite","É uma inflamação ou infecção que pode atingir diferentes partes do ouvido. Dor, sensação de ouvido tampado e alterações na audição podem ocorrer, dependendo do caso."],
 perda:["📉","Perda auditiva","Pode ser leve a profunda e pode envolver diferentes mecanismos. Mudanças persistentes na capacidade de ouvir devem ser avaliadas profissionalmente."],
 ruido:["🎧","Exposição a ruído","Sons intensos por tempo suficiente podem prejudicar estruturas sensíveis da audição. Reduzir o volume, afastar-se da fonte e usar proteção adequada são medidas importantes."],
 meniere:["⚖️","Doença de Ménière","É uma condição do ouvido interno que pode envolver episódios de vertigem, zumbido, sensação de pressão no ouvido e alterações auditivas."]
};
const modal=document.getElementById("modal");
document.querySelectorAll("[data-modal]").forEach(btn=>btn.addEventListener("click",()=>{
  const d=conditionData[btn.dataset.modal];
  document.getElementById("modalIcon").textContent=d[0];
  document.getElementById("modalTitle").textContent=d[1];
  document.getElementById("modalText").textContent=d[2];
  modal.classList.add("open"); modal.setAttribute("aria-hidden","false");
}));
function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}
document.getElementById("modalClose").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});

const bars=document.getElementById("waveBars");
for(let i=0;i<26;i++){const b=document.createElement("i");b.style.height=(8+Math.random()*38)+"px";b.style.animationDelay=(i*.04)+"s";bars.appendChild(b)}

document.getElementById("menuBtn").addEventListener("click",()=>{
  const nav=document.querySelector(".topbar nav");
  nav.style.display=nav.style.display==="flex"?"none":"flex";
  nav.style.position="absolute";nav.style.top="74px";nav.style.left="0";nav.style.right="0";
  nav.style.padding="20px";nav.style.background="#0b1828";nav.style.flexDirection="column";
});
updateTest();
selectPart("pavilhao");
