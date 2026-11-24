const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const WA='5511992975834',brl=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
/* ===== Dados (edite aqui) ===== */
const SVC=[
['Construção residencial e comercial','Casas, escritórios e lojas construídos do projeto às chaves, com fidelidade ao projeto arquitetônico e acabamentos impecáveis.',['Fundação e estrutura','Alvenaria e coberturas','Acabamentos finos','Fachadas corporativas']],
['Reformas','Modernização de estruturas existentes com planejamento rigoroso para reduzir ruído, sujeira e impacto no prazo.',['Cozinhas e banheiros','Pintura e revestimentos','Reformas globais','Adequação de lojas e escritórios']],
['Instalação e manutenção elétrica','Projeto e execução de instalações residenciais, comerciais e prediais, conforme as normas da ABNT.',['Quadros de distribuição','Manutenção preventiva','Manutenção corretiva','Instalações prediais']],
['Engenharia e projeto legal','Cálculo estrutural, projetos executivos, laudos, A.R.T. e protocolo junto à prefeitura até o Habite-se.',['Cálculo estrutural','Laudos técnicos e A.R.T.','Projeto legal','Regularização da obra']],
['Gestão de obras','Acompanhamento físico-financeiro, compra estratégica de insumos e supervisão contínua para evitar desperdício.',['Cronograma e medições','Compra de insumos','Relatórios de progresso','Controle de qualidade']],
['Estudos de viabilidade','Análise técnica, financeira e de mercado antes da obra, para decidir com segurança.',['Análise de riscos','Estimativa de custos','Levantamento do terreno','Parecer técnico']]];
const STAGES=[['Fundação','Sondagem, cálculo e execução da base da obra.',3],['Estrutura','Pilares, vigas e lajes dimensionados por cálculo estrutural.',0],['Alvenaria','Paredes e vedações executadas no esquadro e no prumo.',0],['Elétrica','Quadros e circuitos conforme a ABNT.',2],['Hidráulica','Tubulações testadas antes do revestimento.',1],['Revestimento','Pisos, azulejos e bancadas com acabamento fino.',1],['Pintura','Preparo de superfície e pintura final.',1],['Cobertura','Telhado, impermeabilização e entrega.',4]];
const TIPOS=[['Construção residencial',[2800,3600],8,12],['Reforma completa',[1300,2100],14,3],['Cozinha ou banheiro',[2800,4200],20,2],['Pintura',[40,70],60,1],['Instalação elétrica',[130,240],40,1]]; /* [nome,[R$/m² mín,máx],m² por semana,semanas mín] valores referenciais */
const MULT=[1,1.25,1.6],PAD=['básico','médio','alto'];
const STEPS=[['Diagnóstico técnico','Visita ao local, levantamento e análise de viabilidade arquitetônica e estrutural.'],['Orçamento e cronograma','Detalhamento financeiro minucioso, com prazos claros para cada fase.'],['Execução supervisionada','Acompanhamento diário por engenheiros e construtores, com relatórios de progresso.'],['Entrega das chaves','Vistoria rigorosa, laudos e documentação legal completa.']];
const SECS=[['inicio','Início'],['sobre','Sobre'],['servicos','Serviços'],['projetos','Projetos'],['orcamento','Simulador'],['processo','Processo'],['equipe','Equipe'],['contato','Contato']];
const tabs=$('#tabs'),box=$('#box');let cur=0;

/* Cabeçalho, menu, progresso */
const hd=$('#hd'),bar=$('#bar');
addEventListener('scroll',()=>{hd.classList.toggle('sc',scrollY>40);const m=document.body.scrollHeight-innerHeight;bar.style.width=(scrollY/m*100)+'%'},{passive:true});
const menu=o=>{hd.classList.toggle('open',o);$('#nav').classList.toggle('on',o);$('#burger').classList.toggle('on',o);document.body.style.overflow=o?'hidden':''};$('#burger').onclick=()=>menu(!$('#nav').classList.contains('on'));$$('#nav a').forEach(a=>a.onclick=()=>menu(false));addEventListener('keydown',e=>{if(e.key==='Escape')menu(false)});
$('#yr').textContent=new Date().getFullYear();$('#top').onclick=()=>scrollTo({top:0,behavior:'smooth'});

/* Trilho de níveis: seção ativa */
const rail=$('#rail');rail.innerHTML=SECS.map(s=>`<li data-s="${s[0]}"><a href="#${s[0]}">${s[1]}</a></li>`).join('');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){$$('li',rail).forEach(l=>l.classList.toggle('on',l.dataset.s===e.target.id));$$('#nav a').forEach(a=>a.classList.toggle('cur',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-45% 0px -50% 0px'});
SECS.forEach(s=>io.observe($('#'+s[0])));

/* Contadores */
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);const t=+e.target.dataset.n,t0=performance.now();
const f=n=>{const p=Math.min((n-t0)/1600,1);e.target.textContent=Math.round((1-Math.pow(1-p,3))*t);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}));
$$('[data-n]').forEach(el=>cio.observe(el));

/* Prédio interativo no hero */
const svg=$('#plan'),cap=$('#cap'),H=48,G=430;let h='';
STAGES.forEach((s,i)=>{const y=i?G-H*i:G,d=(i*.22+.3).toFixed(2)+'s';
 if(!i)h+=`<g class="fl" data-i="0" style="--d:${d}"><rect class="f" x="95" y="${G}" width="250" height="38"/><path class="w" d="M105 ${G+38}l24-38M145 ${G+38}l24-38M185 ${G+38}l24-38M225 ${G+38}l24-38M265 ${G+38}l24-38M305 ${G+38}l24-38"/><text x="104" y="${G+14}">${s[0]}</text></g>`;
 else h+=`<g class="fl" data-i="${i}" style="--d:${d}"><rect class="f" x="120" y="${y}" width="200" height="${H}"/>${[0,1,2,3].map(k=>`<rect class="w" x="${138+k*44}" y="${y+14}" width="26" height="20"/>`).join('')}<text x="126" y="${y+10}">${s[0]}</text></g>`});
h+=`<line class="gnd" x1="30" y1="${G}" x2="410" y2="${G}"/><path class="dim" d="M376 ${G}V${G-H*7}M368 ${G}h16M368 ${G-H*7}h16"/><text class="dimt" id="dh" x="386" y="${G-H*3.5}" transform="rotate(90 386 ${G-H*3.5})" text-anchor="middle">+0,00 m</text>`;
svg.innerHTML=h;
const dh=$('#dh'),t0=performance.now();(function f(n){const p=Math.min((n-t0-300)/1500,1);dh.textContent='+'+(Math.max(p,0)*21).toFixed(2).replace('.',',')+' m';if(p<1)requestAnimationFrame(f)})(t0);
const show=g=>{$$('.fl',svg).forEach(x=>x.classList.toggle('on',x===g));if(g){const s=STAGES[g.dataset.i];cap.innerHTML=`<b>${s[0]}</b>${s[1]}`}};
$$('.fl',svg).forEach(g=>{g.onmouseenter=()=>show(g);g.onclick=()=>{if(!g.classList.contains('on')){show(g);return}pick(STAGES[g.dataset.i][2]);$('#servicos').scrollIntoView({behavior:'smooth'})}});

/* Serviços (mestre e detalhe) */
tabs.innerHTML=SVC.map((s,i)=>`<button role="tab" data-i="${i}">${s[0]}</button>`).join('');
function pick(i){cur=i;$$('button',tabs).forEach((b,k)=>b.classList.toggle('on',k===i));const s=SVC[i];
 box.innerHTML=`<h3>${s[0]}</h3><p>${s[1]}</p><ul>${s[2].map(x=>`<li>${x}</li>`).join('')}</ul><a href="#orcamento" class="btn btn--d">Simular este serviço</a>`}
tabs.onclick=e=>{const b=e.target.closest('button');if(b)pick(+b.dataset.i)};pick(0);

/* Portfólio: filtro e lightbox */
const grid=$('#grid'),figs=$$('figure',grid);let vis=figs,li=0;
$('#chips').onclick=e=>{const b=e.target.closest('button');if(!b)return;$$('#chips button').forEach(x=>x.classList.toggle('on',x===b));const f=b.dataset.f;
 figs.forEach(g=>g.classList.toggle('hide',f!=='all'&&g.dataset.c!==f));grid.classList.toggle('f',f!=='all');vis=figs.filter(g=>!g.classList.contains('hide'))};
const lb=$('#lb'),open=i=>{li=(i+vis.length)%vis.length;const g=vis[li];$('#lbI').src=$('img',g).src;$('#lbI').alt=$('img',g).alt;$('#lbC').textContent=$('figcaption',g).firstChild.textContent;lb.classList.add('on')};
figs.forEach(g=>g.onclick=()=>open(vis.indexOf(g)));$('#lbX').onclick=()=>lb.classList.remove('on');$('#lbP').onclick=()=>open(li-1);$('#lbN').onclick=()=>open(li+1);
let sx=0;lb.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)open(li+(d<0?1:-1))});
lb.onclick=e=>{if(e.target===lb)lb.classList.remove('on')};
addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;if(e.key==='Escape')lb.classList.remove('on');if(e.key==='ArrowLeft')open(li-1);if(e.key==='ArrowRight')open(li+1)});

/* Simulador */
const sT=$('#sT'),sA=$('#sA');sT.innerHTML=TIPOS.map((t,i)=>`<option value="${i}">${t[0]}</option>`).join('');
function sim(){const t=TIPOS[sT.value],a=+sA.value,m=MULT[+($('[name=p]:checked').value)],r=x=>{const v=x*a*m;return v>=10000?Math.round(v/500)*500:Math.round(v/10)*10};
 const lo=r(t[1][0]),hi=r(t[1][1]),w=Math.max(t[3],Math.ceil(a/t[2]));$('#sAv').textContent=a;
 $('#oV').textContent=`${brl(lo)} a ${brl(hi)}`;$('#oP').textContent=`Prazo referencial: cerca de ${w} ${w>1?'semanas':'semana'}`;
 $('#oW').href=`https://wa.me/${WA}?text=`+encodeURIComponent(`Olá! Fiz uma simulação no site: ${t[0]}, ${a} m², padrão ${PAD[$('[name=p]:checked').value]}. Estimativa de ${brl(lo)} a ${brl(hi)}. Gostaria de uma proposta.`);$('#oW').target='_blank'}
$('#sim').addEventListener('input',sim);sim();

/* Processo */
const st=$('#steps');st.innerHTML='<i id="sf"></i>'+STEPS.map((s,i)=>`<button data-i="${i}"><em>${i+1}</em><strong>${s[0]}</strong></button>`).join('');
function step(i){$$('button',st).forEach((b,k)=>{b.classList.toggle('on',k===i);b.classList.toggle('dn',k<i)});$('#sf').style.width=(i/3*100)+'%';$('#stepBox').innerHTML=`<b>${STEPS[i][0]}</b><p>${STEPS[i][1]}</p>`}
st.onclick=e=>{const b=e.target.closest('button');if(b)step(+b.dataset.i)};step(0);

/* Formulário */
const frm=$('#frm');frm.service.innerHTML='<option value="">Selecione</option>'+SVC.map(s=>`<option>${s[0]}</option>`).join('')+'<option>Outro</option>';
const V={name:v=>v.trim().length>2,phone:v=>/^[\d\s()+-]{8,}$/.test(v.trim()),email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),service:v=>!!v,message:v=>v.trim().length>9};
const MS={name:'Informe seu nome completo.',phone:'Informe um telefone válido.',email:'Informe um e-mail válido.',service:'Escolha o tipo de obra.',message:'Descreva o projeto em pelo menos 10 caracteres.'};
const chk=k=>{const f=frm[k],ok=V[k](f.value),l=f.closest('label');l.classList.toggle('bad',!ok);$('em',l).textContent=ok?'':MS[k];return ok};
Object.keys(V).forEach(k=>frm[k].addEventListener('blur',()=>chk(k)));
frm.onsubmit=e=>{e.preventDefault();const ok=Object.keys(V).map(chk).every(Boolean);if(!ok){const b=$('.bad input,.bad select,.bad textarea',frm);b&&b.focus();return}
 const f=frm.elements;open2(`Olá! Gostaria de solicitar um orçamento pelo site.\n\n*Nome:* ${f.name.value.trim()}\n*Telefone:* ${f.phone.value.trim()}\n*E-mail:* ${f.email.value.trim()}\n*Tipo de obra:* ${f.service.value}\n*Detalhes:* ${f.message.value.trim()}`);
 $('#ok').classList.add('v');frm.reset();setTimeout(()=>$('#ok').classList.remove('v'),6000)};
const open2=t=>window.open(`https://wa.me/${WA}?text=${encodeURIComponent(t)}`,'_blank');

/* Botão do WhatsApp: some onde já há botão de contato e ao rolar para baixo no celular */
const wa=$('.wa'),zs=new Set();let ly=scrollY,dn=false;
const wUp=()=>wa.classList.toggle('off',zs.size>0||dn);
const wio=new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?zs.add(e.target):zs.delete(e.target));wUp()},{threshold:.05});
['#orcamento','#contato','.ft'].forEach(s=>wio.observe($(s)));
addEventListener('scroll',()=>{const y=scrollY;if(innerWidth<=960){if(y>ly+6)dn=true;else if(y<ly-6)dn=false}else dn=false;ly=y;wUp()},{passive:true});
