let user = JSON.parse(localStorage.getItem('user_data')) || null;
let subjects = JSON.parse(localStorage.getItem('subs_data')) || [];

function toggleTheme(){

const theme =
document.documentElement.getAttribute('data-theme') === 'dark'
? 'light'
: 'dark';

document.documentElement.setAttribute('data-theme', theme);
localStorage.setItem('user_theme', theme);

}

document.documentElement.setAttribute(
'data-theme',
localStorage.getItem('user_theme') || 'dark'
);

window.onload = () =>{
if(user) showDashboard();
};

function showSection(id){

document.querySelectorAll('.section').forEach(s=>{
s.classList.add('hidden')
})

document.getElementById(id).classList.remove('hidden');

}

function handleAuth(e,type){

e.preventDefault();

if(type==='signup'){

user={
name:document.getElementById('reg-name').value,
target:parseInt(document.getElementById('reg-target').value) || 75
};

localStorage.setItem('user_data',JSON.stringify(user));

}
else if(!user){

user={
name:"Guest Student",
target:75
};

}

showDashboard();

}

function showDashboard(){

document.getElementById('nav-auth').classList.add('hidden');
document.getElementById('nav-dash').classList.remove('hidden');

showSection('dashboard');

renderDashboard();

}

function logout(){

localStorage.clear();
location.reload();

}

function openModal(){
document.getElementById('add-modal').classList.remove('hidden');
}

function closeModal(){
document.getElementById('add-modal').classList.add('hidden');
}

function randomColor(){

document.getElementById('new-sub-color').value =
'#'+Math.floor(Math.random()*16777215).toString(16);

}

function addNewSubject(){

const name=document.getElementById('new-sub-name').value;
const color=document.getElementById('new-sub-color').value;

if(!name) return;

subjects.push({
id:Date.now(),
name,
color,
attended:0,
conducted:0
});

localStorage.setItem('subs_data',JSON.stringify(subjects));

renderDashboard();

closeModal();

}

function deleteSub(id){

subjects=subjects.filter(s=>s.id!==id);

localStorage.setItem('subs_data',JSON.stringify(subjects));

renderDashboard();

}

function renderDashboard(){

const grid=document.getElementById('subjects-grid');

grid.innerHTML='';

subjects.forEach(s=>{

const perc=s.conducted>0
?(s.attended/s.conducted)*100
:0;

const div=document.createElement('div');

div.className='subject-card';

div.innerHTML=`

<h3 style="color:${s.color}">
${s.name}
</h3>

<label>Attended</label>
<input type="number"
value="${s.attended}"
oninput="updateValue(${s.id},'attended',this.value)">

<label>Conducted</label>
<input type="number"
value="${s.conducted}"
oninput="updateValue(${s.id},'conducted',this.value)">

<div class="perc-val">
${perc.toFixed(1)}%
</div>

<button onclick="deleteSub(${s.id})">
Delete
</button>

`;

grid.appendChild(div);

});

calculateOverall();

}

function updateValue(id,field,val){

const sub=subjects.find(s=>s.id===id);

sub[field]=parseInt(val)||0;

localStorage.setItem('subs_data',JSON.stringify(subjects));

renderDashboard();

}

function calculateOverall(){

let totalAtt=0;
let totalCond=0;

subjects.forEach(s=>{
totalAtt+=s.attended;
totalCond+=s.conducted;
});

const overallPerc=
totalCond>0
?(totalAtt/totalCond)*100
:0;

document.getElementById('overall-perc').innerText =
overallPerc.toFixed(1)+'%';

}