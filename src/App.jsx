import { useState, useEffect, useRef } from "react";
import { supabase, toUser, toRow } from "./supabase.js";

const HIDANE = "data:image/png;base64,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";
const NOREN = "data:image/jpeg;base64,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";

const FF = "'Zen Maru Gothic', sans-serif";
const FREQS = [
  { value: "daily", label: "毎日" },
  { value: "weekly", label: "週" },
  { value: "monthly", label: "月" },
  { value: "quarterly", label: "Q" },
  { value: "yearly", label: "年" },
];
const DOW = ["日","月","火","水","木","金","土"];
const TEAMS_INIT = ["営業チーム","マーケチーム","開発チーム","人事チーム","デザインチーム","経営企画"];

function newHabit(){ return {name:"",freq:"daily",count:1}; }
function emptyHabits(){ return [newHabit(),newHabit(),newHabit(),newHabit(),newHabit()]; }
function getToday(){ var d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function dim(y,m){ return new Date(y,m+1,0).getDate(); }
function mDays(y,m){ var r=[]; for(var i=1;i<=dim(y,m);i++) r.push(y+"-"+String(m+1).padStart(2,"0")+"-"+String(i).padStart(2,"0")); return r; }
function fDow(y,m){ return new Date(y,m,1).getDay(); }
function pKey(y,m){ return y+"-"+String(m+1).padStart(2,"0"); }
function pLabel(k){ var p=k.split("-"); return p[0]+"年"+parseInt(p[1])+"月"; }
function dayDow(d){ var p=d.split("-"); return DOW[new Date(parseInt(p[0]),parseInt(p[1])-1,parseInt(p[2])).getDay()]; }

function getActiveHabits(user,y,m){
  if(!user)return[];
  var bp=user.habitHistory||[];
  // Find the latest entry that is <= this month
  var targetKey=pKey(y,m);
  var best=null;
  for(var i=0;i<bp.length;i++){
    if(bp[i].periodKey<=targetKey) best=bp[i];
  }
  return best?best.habits:[];
}

function getExpectedCount(freq,count,y,m){
  var days=mDays(y,m); var td=getToday(); var pastDays=days.filter(function(d){return d<=td;}).length;
  if(freq==="daily") return pastDays;
  if(freq==="weekly") return Math.min(count*4, Math.ceil(pastDays/7)*count);
  if(freq==="monthly") return count;
  if(freq==="quarterly") return m%3===2?count:0;
  if(freq==="yearly") return m===11?count:0;
  return 0;
}

function calcRate(checks,idx,freq,count,y,m){
  var days=mDays(y,m); var td=getToday();
  var c=count||1;
  if(freq==="daily"){
    var pastDays=days.filter(function(d){return d<=td;}).length;
    if(pastDays<=0)return 0;
    var done=0; days.forEach(function(d){if(d<=td&&checks&&checks[idx+"-"+d])done++;}); 
    return Math.min(100,Math.round((done/pastDays)*100));
  }
  if(freq==="weekly"){
    var pastDays2=days.filter(function(d){return d<=td;}).length;
    var expected=Math.min(c*4, Math.ceil(pastDays2/7)*c);
    if(expected<=0)return 0;
    var done2=0; days.forEach(function(d){if(d<=td&&checks&&checks[idx+"-"+d])done2++;});
    return Math.min(100,Math.round((done2/expected)*100));
  }
  if(freq==="monthly"){
    if(c<=0)return 0;
    var done3=0; days.forEach(function(d){if(d<=td&&checks&&checks[idx+"-"+d])done3++;});
    return Math.min(100,Math.round((done3/c)*100));
  }
  if(freq==="quarterly"){
    // Count checks across all 3 months of this quarter
    var qStart=Math.floor(m/3)*3;
    var done4=0;
    for(var qm=qStart;qm<qStart+3;qm++){
      var qDays=mDays(y,qm);
      qDays.forEach(function(d){if(d<=td&&checks&&checks[idx+"-"+d])done4++;});
    }
    if(c<=0)return 0;
    return Math.min(100,Math.round((done4/c)*100));
  }
  if(freq==="yearly"){
    // Count checks across all 12 months of this year
    var done5=0;
    for(var ym=0;ym<12;ym++){
      var yDays=mDays(y,ym);
      yDays.forEach(function(d){if(d<=td&&checks&&checks[idx+"-"+d])done5++;});
    }
    if(c<=0)return 0;
    return Math.min(100,Math.round((done5/c)*100));
  }
  return 0;
}

function userAvgRate(user,y,m){
  var habs=getActiveHabits(user,y,m);
  if(!habs||habs.length===0)return 0;
  var sum=0;
  for(var i=0;i<habs.length;i++) sum+=calcRate(user.checks||{},i,habs[i].freq,habs[i].count||1,y,m);
  return Math.round(sum/habs.length);
}

var _pid=0;
function PersonFigure(p){
  var rate=p.rate,size=p.size||80,dance=p.dance;
  var pid=useState(function(){return"pf"+(++_pid);})[0];
  var color=rate>=100?"#C41E1E":rate>60?"#E8A83E":rate>30?"#3A7BD5":"#ddd";
  var pct=Math.min(100,Math.max(0,rate));
  var guts=rate>=100;
  var body=guts
    ?"M50,6C34,6 22,16 22,30C22,38 26,44 32,48L26,52C18,54 12,48 8,40C6,36 2,34 2,38C2,42 6,50 14,56L28,60L28,68C28,80 32,90 36,96L32,112C30,118 34,122 40,122L46,122L46,114L48,96C49,94 51,94 52,96L54,114L54,122L60,122C66,122 70,118 68,112L64,96C68,90 72,80 72,68L72,60L86,56C94,50 98,42 98,38C98,34 94,36 92,40C88,48 82,54 74,52L68,48C74,44 78,38 78,30C78,16 66,6 50,6Z"
    :"M50,6C34,6 22,16 22,30C22,38 26,44 32,48L26,54C20,58 14,60 8,60C4,60 2,62 4,64C6,66 12,66 20,64L30,58L30,68C30,80 34,90 38,96L34,112C32,118 36,122 42,122L46,122L46,114L48,96C49,94 51,94 52,96L54,114L54,122L58,122C64,122 68,118 66,112L62,96C66,90 70,80 70,68L70,58L80,64C88,66 94,66 96,64C98,62 96,60 92,60C86,60 80,58 74,54L68,48C74,44 78,38 78,30C78,16 66,6 50,6Z";
  var transform=dance?"transform:rotate(-5deg);animation:dance 0.5s infinite alternate;":"";
  return(
    <svg viewBox="0 0 100 128" width={size} height={size*1.28} style={{display:"block",margin:"0 auto"}}>
      {dance&&<style>{"@keyframes dance{0%{transform:rotate(-8deg)}100%{transform:rotate(8deg)}}"}</style>}
      <defs><clipPath id={pid}><rect x="0" y={128-(pct/100)*128} width="100" height={(pct/100)*128}/></clipPath></defs>
      <g style={dance?{transformOrigin:"50px 64px",animation:"dance 0.4s infinite alternate"}:{}}>
        <path d={body} fill="#f5f2eb" stroke="#bbb" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d={body} fill={color} stroke={color} strokeWidth="1" strokeLinejoin="round" clipPath={"url(#"+pid+")"}/>
      </g>
      {guts&&<text x="50" y="127" textAnchor="middle" fontSize="7" fill="#C41E1E" fontWeight="bold">GREAT!</text>}
    </svg>
  );
}

function Celebration(p){
  if(!p.show)return null;
  var flowers=["🌸","🌺","🌻","🌷","🌼","💐","🎉","✨","🎊"];
  var items=[];
  for(var i=0;i<20;i++){
    items.push(<div key={i} style={{position:"absolute",left:Math.random()*100+"%",top:Math.random()*80+"%",fontSize:14+Math.random()*16,animation:"floatUp "+(1.5+Math.random()*2)+"s ease-out "+(Math.random()*0.8)+"s forwards",opacity:0}}>{flowers[i%flowers.length]}</div>);
  }
  return(
    <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:9998}}>
      <style>{"@keyframes floatUp{0%{opacity:0;transform:translateY(40px) scale(0.5)}30%{opacity:1;transform:translateY(0) scale(1.2)}100%{opacity:0;transform:translateY(-100px) scale(0.3)}}"}</style>
      {items}
      <div style={{position:"absolute",bottom:"10%",left:"50%",transform:"translateX(-50%)"}}>
        <PersonFigure rate={100} size={80} dance={true}/>
      </div>
    </div>
  );
}

function Fireworks(p){
  var show=p.show,onDone=p.onDone; var ref=useRef(null);
  useEffect(function(){
    if(!show)return; var c=ref.current; if(!c)return;
    var ctx=c.getContext("2d"); c.width=window.innerWidth; c.height=window.innerHeight;
    var cols=["#C41E1E","#1B4B8A","#E8A83E","#ff6b6b","#ffd93d"]; var ps=[];
    for(var b=0;b<5;b++){var cx=Math.random()*c.width*0.6+c.width*0.2,cy=Math.random()*c.height*0.4+c.height*0.1;for(var i=0;i<30;i++){var a=(Math.PI*2/30)*i,s=2+Math.random()*4;ps.push({x:cx,y:cy,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:45+Math.random()*35,color:cols[Math.floor(Math.random()*cols.length)],sz:2+Math.random()*3});}}
    var f=0;var run=function(){ctx.clearRect(0,0,c.width,c.height);ps.forEach(function(q){q.x+=q.vx;q.y+=q.vy;q.vy+=0.05;q.life--;ctx.globalAlpha=Math.max(0,q.life/80);ctx.fillStyle=q.color;ctx.beginPath();ctx.arc(q.x,q.y,q.sz,0,Math.PI*2);ctx.fill();});ps=ps.filter(function(q){return q.life>0;});f++;if(ps.length>0&&f<160)requestAnimationFrame(run);else{ctx.clearRect(0,0,c.width,c.height);if(onDone)onDone();}};run();
  },[show,onDone]);
  if(!show)return null;
  return <canvas ref={ref} style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:9999}}/>;
}

function MNav(p){
  var y=p.year,m=p.month,onChange=p.onChange;
  return(<div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
    <button onClick={function(){onChange({year:m===0?y-1:y,month:m===0?11:m-1});}} style={st.mBtn}>◀</button>
    <span style={{fontSize:16,fontWeight:700,color:"#1B4B8A",fontFamily:FF}}>{y}年{m+1}月</span>
    <button onClick={function(){onChange({year:m===11?y+1:y,month:m===11?0:m+1});}} style={st.mBtn}>▶</button>
  </div>);
}

function HabitEditor(p){
  var habits=p.habits, onChange=p.onChange;
  var upd=function(i,f,v){onChange(habits.map(function(h,j){return j===i?{...h,[f]:v}:h;}));};
  var add=function(){onChange(habits.concat([newHabit()]));};
  var rem=function(i){if(habits.length<=1)return;onChange(habits.filter(function(_,j){return j!==i;}));};
  return(
    <div>
      {habits.map(function(h,i){return(
        <div key={i} style={{display:"flex",alignItems:"center",gap:3,marginBottom:5,animation:"fadeIn 0.2s "+(i*0.04)+"s both"}}>
          <span style={{...st.hn,width:20,height:20,fontSize:9}}>{i+1}</span>
          <input value={h.name} onChange={function(e){upd(i,"name",e.target.value);}} placeholder={"習慣"+(i+1)} style={{...st.input,flex:1,marginBottom:0,fontSize:11}}/>
          <select value={h.freq} onChange={function(e){upd(i,"freq",e.target.value);}} style={{...st.input,width:55,marginBottom:0,fontSize:10,padding:"5px 2px"}}>
            {FREQS.map(function(f){return <option key={f.value} value={f.value}>{f.label}</option>;})}
          </select>
          {h.freq!=="daily"&&(
            <div style={{display:"flex",alignItems:"center",gap:1}}>
              <input type="number" min="1" max="30" value={h.count||1} onChange={function(e){upd(i,"count",parseInt(e.target.value)||1);}} style={{...st.input,width:34,marginBottom:0,fontSize:10,textAlign:"center",padding:"5px 2px"}}/>
              <span style={{fontSize:8,color:"#8B7E6A"}}>回</span>
            </div>
          )}
          {habits.length>1&&<button onClick={function(){rem(i);}} style={{background:"none",border:"none",color:"#ccc",cursor:"pointer",fontSize:14,padding:0,lineHeight:1}}>×</button>}
        </div>
      );})}
      <button onClick={add} style={{background:"none",border:"1px dashed #ccc",borderRadius:6,padding:"4px 12px",fontSize:11,color:"#8B7E6A",cursor:"pointer",marginTop:4,width:"100%",fontFamily:FF}}>＋ 習慣を追加</button>
    </div>
  );
}

function NorenBar(){
  return <div style={{width:"100%",height:80,overflow:"hidden",background:"#EDE7D6"}}><img src={NOREN} alt="" style={{width:"100%",height:"auto",objectPosition:"top",display:"block"}}/></div>;
}

/* ═══ MAIN ═══ */
export default function App(){
  var _scr=useState("login");var screen=_scr[0],setScreen=_scr[1];
  var _em=useState("");var email=_em[0],setEmail=_em[1];
  var _ud=useState(null);var ud=_ud[0],setUd=_ud[1];
  var _mem=useState([]);var members=_mem[0],setMembers=_mem[1];
  var _teams=useState(TEAMS_INIT);var teams=_teams[0],setTeamsS=_teams[1];
  var _ld=useState(true);var loading=_ld[0],setLoading=_ld[1];
  var _fw=useState(false);var showFW=_fw[0],setShowFW=_fw[1];
  var _cel=useState(false);var showCel=_cel[0],setShowCel=_cel[1];
  var _sm=useState(function(){var d=new Date();return{year:d.getFullYear(),month:d.getMonth()};});var sm=_sm[0],setSm=_sm[1];
  var _df=useState("all");var df=_df[0],setDf=_df[1];
  var _du=useState(null);var du=_du[0],setDu=_du[1];
  var _eidx=useState(null);var eidx=_eidx[0],setEidx=_eidx[1];

  useEffect(function(){(async function(){
    // ① セッション（ログイン済みメール）を確認
    var savedEmail=null;
    try{savedEmail=localStorage.getItem("iv5-session");}catch(e){}
    if(savedEmail){
      try{
        var {data:uRow}=await supabase.from("users").select("*").eq("email",savedEmail).maybeSingle();
        if(uRow){var d=toUser(uRow);setUd(d);setEmail(savedEmail);setScreen(d.name&&d.habitHistory&&d.habitHistory.length>0?"check":"setup");}
        else{var r=localStorage.getItem("iv5-user");if(r){var d=JSON.parse(r);setUd(d);setEmail(d.email||"");setScreen(d.name&&d.habitHistory&&d.habitHistory.length>0?"check":"setup");}}
      }catch(e){var r=localStorage.getItem("iv5-user");if(r){var d=JSON.parse(r);setUd(d);setEmail(d.email||"");setScreen(d.name&&d.habitHistory&&d.habitHistory.length>0?"check":"setup");}}
    }
    // ② 全メンバー取得
    try{
      var {data:mRows}=await supabase.from("users").select("*");
      if(mRows&&mRows.length>0){var ms=mRows.map(toUser);setMembers(ms);localStorage.setItem("iv5-members",JSON.stringify(ms));}
      else{var m=localStorage.getItem("iv5-members");if(m)setMembers(JSON.parse(m));}
    }catch(e){var m=localStorage.getItem("iv5-members");if(m)setMembers(JSON.parse(m));}
    // ③ チーム取得
    try{
      var {data:tRows}=await supabase.from("teams").select("name");
      if(tRows&&tRows.length>0){var ts=tRows.map(function(r){return r.name;});setTeamsS(ts);localStorage.setItem("iv5-teams",JSON.stringify(ts));}
      else{var t=localStorage.getItem("iv5-teams");if(t)setTeamsS(JSON.parse(t));}
    }catch(e){var t=localStorage.getItem("iv5-teams");if(t)setTeamsS(JSON.parse(t));}
    setLoading(false);
  })();},[]);

  var sU=async function(d){setUd(d);try{localStorage.setItem("iv5-session",d.email);localStorage.setItem("iv5-user",JSON.stringify(d));}catch(e){}try{await supabase.from("users").upsert(toRow(d));}catch(e){console.error("sU:",e);}};
  var sM=async function(m){setMembers(m);try{localStorage.setItem("iv5-members",JSON.stringify(m));}catch(e){}try{if(m.length>0)await supabase.from("users").upsert(m.map(toRow));}catch(e){console.error("sM:",e);}};
  var sT=async function(t){setTeamsS(t);try{localStorage.setItem("iv5-teams",JSON.stringify(t));}catch(e){}try{await supabase.from("teams").delete().neq("name","__never__");if(t.length>0)await supabase.from("teams").insert(t.map(function(n){return{name:n};}));}catch(e){console.error("sT:",e);}};
  var delUser=async function(email){try{await supabase.from("users").delete().eq("email",email);}catch(e){console.error("delUser:",e);}};
  var sync=function(u){var idx=members.findIndex(function(m){return m.email===u.email;});if(idx>=0){var ms=members.map(function(m,i){return i===idx?{...m,checks:u.checks,habitHistory:u.habitHistory}:m;});setMembers(ms);try{localStorage.setItem("iv5-members",JSON.stringify(ms));}catch(e){}}};

  var hLogin=async function(){
    if(!email.includes("@"))return;
    setLoading(true);
    try{
      var {data:uRow}=await supabase.from("users").select("*").eq("email",email).maybeSingle();
      if(uRow){var d=toUser(uRow);await sU(d);setScreen(d.name&&d.habitHistory&&d.habitHistory.length>0?"check":"setup");}
      else{await sU({email:email,name:"",team:"",habitHistory:[],checks:{}});setScreen("setup");}
      // 最新メンバー・チームをリロード
      var {data:mRows}=await supabase.from("users").select("*");
      if(mRows&&mRows.length>0)setMembers(mRows.map(toUser));
      var {data:tRows}=await supabase.from("teams").select("name");
      if(tRows&&tRows.length>0){var ts=tRows.map(function(r){return r.name;});setTeamsS(ts);localStorage.setItem("iv5-teams",JSON.stringify(ts));}
    }catch(e){
      var found=members.find(function(m){return m.email===email;});
      if(found){await sU({...found,email:email});setScreen("check");}
      else{await sU({email:email,name:"",team:"",habitHistory:[],checks:{}});setScreen("setup");}
    }
    setLoading(false);
  };

  var hSetup=async function(name,team,habits){
    var hist=(ud&&ud.habitHistory)||[];
    var key=pKey(sm.year,sm.month);
    var now=getToday();
    // Remove existing entry for this period, add new
    hist=hist.filter(function(h){return h.periodKey!==key;});
    hist.push({periodKey:key,date:now,habits:habits});
    hist.sort(function(a,b){return a.periodKey<b.periodKey?-1:1;});
    var d={...ud,name:name,team:team,habitHistory:hist};
    await sU(d);sync(d);setScreen("check");
  };

  var hCheck=async function(idx,date){
    var key=idx+"-"+date;var nc={...ud.checks};
    if(nc[key])delete nc[key];else nc[key]=true;
    var upd={...ud,checks:nc};await sU(upd);sync(upd);
    // Check celebrations
    if(!ud.checks[key]){
      var habs=getActiveHabits(ud,sm.year,sm.month);
      var allToday=habs.every(function(_,j){return j===idx?true:upd.checks[j+"-"+date];});
      if(allToday)setShowFW(true);
      // Check full month achievement
      var avg=userAvgRate(upd,sm.year,sm.month);
      if(avg>=100&&userAvgRate(ud,sm.year,sm.month)<100)setShowCel(true);
    }
  };

  var hLogout=function(){try{localStorage.removeItem("iv5-session");localStorage.removeItem("iv5-user");}catch(e){}setUd(null);setEmail("");setScreen("login");};

  // 画面遷移時に共有データを最新化
  useEffect(function(){
    if(screen==="dashboard"||screen==="settings"){
      (async function(){
        try{var {data:mRows}=await supabase.from("users").select("*");if(mRows&&mRows.length>0){var ms=mRows.map(toUser);setMembers(ms);localStorage.setItem("iv5-members",JSON.stringify(ms));}}catch(e){}
        try{var {data:tRows}=await supabase.from("teams").select("name");if(tRows&&tRows.length>0){var ts=tRows.map(function(r){return r.name;});setTeamsS(ts);localStorage.setItem("iv5-teams",JSON.stringify(ts));}}catch(e){}
      })();
    }
  },[screen]);

  if(loading)return <div style={st.ctr}><p style={{color:"#8B7E6A",fontFamily:FF}}>読み込み中...</p></div>;

  var isAdmin=!!(ud&&ud.email==="draft@invision-inc.jp");
  var aH=ud?getActiveHabits(ud,sm.year,sm.month):[];

  return(
    <div style={{fontFamily:FF,background:"linear-gradient(180deg,#F5F0E1,#EDE7D6)",minHeight:"100vh",color:"#333"}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&display=swap');@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse80{0%,100%{color:#C41E1E}50%{color:#ff6b6b}}@keyframes slideDown{from{max-height:0;opacity:0}to{max-height:1200px;opacity:1}}*{box-sizing:border-box}"}</style>
      <Fireworks show={showFW} onDone={function(){setShowFW(false);}}/>
      <Celebration show={showCel}/>
      {showCel&&<div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:9997}} onClick={function(){setShowCel(false);}}/>}

      {screen!=="login"&&(
        <header style={{background:"rgba(245,240,225,0.97)",backdropFilter:"blur(10px)",position:"sticky",top:0,zIndex:100}}>
          <div className="iv-header-nav" style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:6,paddingBottom:6,flexWrap:"wrap",gap:4}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <img src={HIDANE} alt="" width="28" height="28"/>
              <div><div style={{fontSize:14,fontWeight:900,color:"#1B4B8A"}}>行動習慣チェック</div><div style={{fontSize:8,color:"#8B7E6A"}}>インビジョン株式会社</div></div>
            </div>
            <nav style={{display:"flex",gap:3,flexWrap:"wrap"}}>
              {["check","dashboard","habits","settings"].map(function(id){var lbs={check:"チェック",dashboard:"ダッシュボード",habits:"習慣管理",settings:"設定"};return <button key={id} onClick={function(){setScreen(id);}} style={{...st.nb,...(screen===id?st.na:{})}}>{lbs[id]}</button>;})}
              <button onClick={hLogout} style={{...st.nb,color:"#aaa",fontSize:9}}>ログアウト</button>
            </nav>
          </div>
          <NorenBar/>
        </header>
      )}

      {screen==="login"&&(
        <div style={st.ctr}><div style={st.lc}>
          <div style={{textAlign:"center",marginBottom:14}}><NorenBar/><div style={{marginTop:10}}><img src={HIDANE} alt="" width="40" height="40"/></div><h1 style={{fontSize:20,fontWeight:900,color:"#1B4B8A",margin:"6px 0 2px"}}>行動習慣チェック</h1><p style={{fontSize:10,color:"#8B7E6A",margin:0}}>インビジョン株式会社</p></div>
          <label style={st.lb}>メールアドレス</label>
          <input type="email" value={email} onChange={function(e){setEmail(e.target.value);}} placeholder="example@invision.co.jp" style={st.input} onKeyDown={function(e){if(e.key==="Enter")hLogin();}}/>
          <button onClick={hLogin} style={st.pb}>ログイン</button>
          <p style={{fontSize:9,color:"#aaa",textAlign:"center",marginTop:6}}>※本人のみチェック可能</p>
        </div></div>
      )}

      {screen==="setup"&&<SetupScr ud={ud} teams={teams} onSetup={hSetup} sm={sm}/>}
      {screen==="check"&&ud&&<CheckScr ud={ud} aH={aH} onChk={hCheck} sm={sm} setSm={setSm}/>}
      {screen==="habits"&&ud&&<HabitsScr ud={ud} sU={sU} sync={sync} sm={sm}/>}
      {screen==="dashboard"&&<DashScr ud={ud} mem={members} sm={sm} setSm={setSm} filt={df} setFilt={setDf} selU={du} setSelU={setDu}/>}
      {screen==="settings"&&<SetScr ud={ud} mem={members} sM={sM} teams={teams} sT={sT} sU={sU} setScr={setScreen} eidx={eidx} setEidx={setEidx} sm={sm} isAdmin={isAdmin} delUser={delUser}/>}
    </div>
  );
}

/* ═══ SETUP ═══ */
function SetupScr(p){
  var ud=p.ud,teams=p.teams,onSetup=p.onSetup,sm=p.sm;
  var _n=useState((ud&&ud.name)||"");var name=_n[0],sN=_n[1];
  var _t=useState((ud&&ud.team)||teams[0]);var team=_t[0],sT=_t[1];
  var existing=getActiveHabits(ud,sm.year,sm.month);
  var _h=useState(existing.length>0?existing.map(function(x){return{...x};}):emptyHabits());var habits=_h[0],sH=_h[1];
  var ok=name.trim()&&habits.every(function(h){return h.name.trim();});
  return(
    <div style={st.mn} className="iv-mn"><div style={{animation:"fadeIn 0.5s"}}>
      <h2 style={st.tt}>プロフィール設定</h2>
      <div style={st.cd}><label style={st.lb}>名前</label><input value={name} onChange={function(e){sN(e.target.value);}} placeholder="山田太郎" style={st.input}/><label style={st.lb}>チーム</label><select value={team} onChange={function(e){sT(e.target.value);}} style={st.input}>{teams.map(function(t){return <option key={t} value={t}>{t}</option>;})}</select></div>
      <h3 style={{fontSize:14,fontWeight:700,color:"#1B4B8A",margin:"14px 0 6px"}}>🔥 {pLabel(pKey(sm.year,sm.month))} の行動習慣</h3>
      <div style={st.cd}><HabitEditor habits={habits} onChange={sH}/></div>
      <button onClick={function(){if(ok)onSetup(name,team,habits);}} disabled={!ok} style={{...st.pb,opacity:ok?1:0.5}}>登録して始める</button>
    </div></div>
  );
}

/* ═══ CHECK ═══ */
function CheckScr(p){
  var ud=p.ud,aH=p.aH,onChk=p.onChk,sm=p.sm,setSm=p.setSm;
  var td=getToday(),y=sm.year,m=sm.month,days=mDays(y,m);
  var ckDays=days.filter(function(d){return d<=td;});
  var tc=aH.reduce(function(s,_,i){return s+(ud.checks&&ud.checks[i+"-"+td]?1:0);},0);
  var pr=tc/Math.max(1,aH.length);
  var avg=userAvgRate(ud,y,m);

  return(
    <div style={st.mn} className="iv-mn"><div>
      <div style={{...st.cd,display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#C41E1E,#E8A83E)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:16}}>{ud.name?ud.name[0]:"?"}</div>
        <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{ud.name}</div><div style={{fontSize:10,color:"#8B7E6A"}}>{ud.team} · {pLabel(pKey(y,m))}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#8B7E6A"}}>今日</div><div style={{fontSize:20,fontWeight:900,color:pr>=0.8?"#C41E1E":"#1B4B8A"}}>{tc}/{aH.length}</div></div>
        {pr>=1&&<div style={{position:"absolute",top:3,right:6,fontSize:8,background:"#C41E1E",color:"#fff",padding:"1px 5px",borderRadius:6,fontWeight:700}}>🎉 全達成！</div>}
      </div>
      <MNav year={y} month={m} onChange={setSm}/>
      {aH.length===0&&<div style={st.cd}><p style={{color:"#8B7E6A",fontSize:12,textAlign:"center"}}>この期間の行動習慣が未設定です。「習慣管理」から設定してください。</p></div>}
      {aH.map(function(hab,i){
        var rate=calcRate(ud.checks||{},i,hab.freq,hab.count||1,y,m);
        var hi=rate>=80; var fq=FREQS.find(function(f){return f.value===hab.freq;});
        var freqLabel=fq?fq.label:"";
        if(hab.freq!=="daily"&&hab.count>1) freqLabel+=hab.count+"回";
        return(
          <div key={i} style={{...st.cd,marginBottom:10,animation:"fadeIn 0.25s "+(i*0.05)+"s both"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
              <div style={{display:"flex",alignItems:"center",gap:5}}><span style={st.hn}>{i+1}</span><span style={{fontWeight:700,fontSize:13}}>{hab.name}</span><span style={{fontSize:9,color:"#8B7E6A",background:"#f0ede5",padding:"1px 5px",borderRadius:5}}>{freqLabel}</span></div>
              <div style={{fontWeight:900,fontSize:15,color:hi?"#C41E1E":"#1B4B8A",animation:hi?"pulse80 1s infinite":"none"}}>{rate}%</div>
            </div>
            <div style={{height:5,background:"#f0ede5",borderRadius:3,marginBottom:8,overflow:"hidden"}}><div style={{height:"100%",width:rate+"%",background:hi?"linear-gradient(90deg,#C41E1E,#E8A83E)":"linear-gradient(90deg,#1B4B8A,#3A7BD5)",borderRadius:3,transition:"width 0.5s"}}/></div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
              {ckDays.map(function(d){
                var ck=ud.checks&&ud.checks[i+"-"+d];var isT=d===td;var dn=parseInt(d.split("-")[2]);var dw=dayDow(d);
                return(<button key={d} onClick={function(){onChk(i,d);}} style={{width:38,height:38,borderRadius:7,border:isT?"2px solid #C41E1E":"1px solid #e0dbd0",background:ck?"linear-gradient(135deg,#C41E1E,#E8A83E)":"#fff",color:ck?"#fff":"#888",fontSize:10,fontWeight:ck?700:400,cursor:"pointer",transition:"all 0.2s",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",lineHeight:1.1}}>
                  <span style={{fontSize:7,opacity:0.7}}>{dw}</span>
                  <span>{ck?"✓":dn}</span>
                </button>);
              })}
            </div>
          </div>
        );
      })}
      <div style={{...st.cd,textAlign:"center",marginTop:14}}>
        <div style={{fontSize:11,color:"#8B7E6A",marginBottom:4}}>今月の平均達成率</div>
        <PersonFigure rate={avg} size={50} dance={avg>=100}/>
        <div style={{fontSize:24,fontWeight:900,color:avg>=80?"#C41E1E":"#1B4B8A",animation:avg>=80?"pulse80 1s infinite":"none",marginTop:4}}>{avg}%</div>
      </div>
    </div></div>
  );
}

/* ═══ HABITS MANAGEMENT ═══ */
function HabitsScr(p){
  var ud=p.ud,sU=p.sU,sync=p.sync,sm=p.sm;
  var hist=(ud.habitHistory||[]).slice().sort(function(a,b){return a.periodKey>b.periodKey?-1:1;});
  var curKey=pKey(sm.year,sm.month);
  var curHabs=getActiveHabits(ud,sm.year,sm.month);
  var _ed=useState(false);var editing=_ed[0],setEd=_ed[1];
  var _eh=useState(curHabs.map(function(h){return{...h};})||emptyHabits());var eHabs=_eh[0],setEH=_eh[1];
  var _msg=useState("");var msg=_msg[0],setMsg=_msg[1];

  var save=async function(){
    if(!eHabs.every(function(h){return h.name.trim();})){setMsg("全ての習慣名を入力してください");return;}
    var newHist=(ud.habitHistory||[]).filter(function(h){return h.periodKey!==curKey;});
    newHist.push({periodKey:curKey,date:getToday(),habits:eHabs});
    newHist.sort(function(a,b){return a.periodKey<b.periodKey?-1:1;});
    var upd={...ud,habitHistory:newHist};
    await sU(upd);sync(upd);setEd(false);setMsg("✅ 保存しました");setTimeout(function(){setMsg("");},2000);
  };

  return(
    <div style={st.mn} className="iv-mn"><div>
      <h2 style={st.tt}>📋 習慣管理</h2>
      {msg&&<div style={{background:"#e8f5e9",color:"#2e7d32",padding:"6px 10px",borderRadius:6,marginBottom:10,fontSize:12,textAlign:"center"}}>{msg}</div>}

      {/* Current period */}
      <div style={{...st.cd,borderLeft:"3px solid #C41E1E"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{fontWeight:700,fontSize:13,color:"#C41E1E"}}>📅 現在の行動習慣 ({pLabel(curKey)})</div>
          {!editing&&<button onClick={function(){setEd(true);setEH(curHabs.length>0?curHabs.map(function(h){return{...h};}):emptyHabits());}} style={{background:"none",border:"1px solid #C41E1E",borderRadius:4,color:"#C41E1E",cursor:"pointer",fontSize:10,padding:"2px 8px"}}>編集</button>}
        </div>
        {editing?(
          <div><HabitEditor habits={eHabs} onChange={setEH}/><div style={{display:"flex",gap:6,marginTop:8}}><button onClick={save} style={{...st.pb,flex:1}}>保存</button><button onClick={function(){setEd(false);}} style={{...st.pb,flex:1,background:"#999"}}>キャンセル</button></div></div>
        ):(
          curHabs.map(function(h,i){
            var fq=FREQS.find(function(f){return f.value===h.freq;});
            var fl=fq?fq.label:""; if(h.freq!=="daily"&&h.count>1) fl+=h.count+"回";
            return <div key={i} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 0",borderBottom:i<curHabs.length-1?"1px solid #e8e3d8":"none"}}><span style={{...st.hn,width:20,height:20,fontSize:9}}>{i+1}</span><span style={{fontSize:12,flex:1}}>{h.name}</span><span style={{fontSize:10,color:"#8B7E6A"}}>{fl}</span></div>;
          })
        )}
      </div>

      {/* History */}
      {hist.length>0&&(
        <div style={{marginTop:16}}>
          <h3 style={{fontSize:13,fontWeight:700,color:"#1B4B8A",marginBottom:8}}>📚 変更履歴</h3>
          {hist.map(function(entry,ei){
            var isCur=entry.periodKey===curKey;
            return <div key={ei} style={{...st.cd,marginBottom:6,borderLeft:"3px solid "+(isCur?"#C41E1E":"#1B4B8A"),opacity:isCur?1:0.85}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <span style={{fontWeight:700,fontSize:12,color:isCur?"#C41E1E":"#1B4B8A"}}>{pLabel(entry.periodKey)}{isCur?" (現在)":""}</span>
                <span style={{fontSize:9,color:"#8B7E6A"}}>変更日: {entry.date}</span>
              </div>
              {entry.habits.map(function(h,i){
                var fq=FREQS.find(function(f){return f.value===h.freq;});
                var fl=fq?fq.label:""; if(h.freq!=="daily"&&h.count>1) fl+=h.count+"回";
                return <div key={i} style={{fontSize:11,color:"#555",padding:"2px 0"}}>{(i+1)+". "+h.name+" ("+fl+")"}</div>;
              })}
            </div>;
          })}
        </div>
      )}
    </div></div>
  );
}

/* ═══ DASHBOARD ═══ */
function DashScr(p){
  var ud=p.ud,mem=p.mem,sm=p.sm,setSm=p.setSm,filt=p.filt,setFilt=p.setFilt,selU=p.selU,setSelU=p.setSelU;
  var y=sm.year,m=sm.month,td=getToday(),days=mDays(y,m),fd=fDow(y,m);
  var allU=[{...(ud||{}),isMe:true,name:(ud&&ud.name)||"あなた"}].concat(mem.filter(function(x){return x.email!==(ud&&ud.email);}).map(function(x){return{...x,isMe:false};}));
  var uT=[];allU.forEach(function(u){if(u.team&&uT.indexOf(u.team)===-1)uT.push(u.team);});
  var fl=filt==="all"?allU:allU.filter(function(u){return u.team===filt;});
  var gCC=function(u,d){var hs=getActiveHabits(u,y,m);return hs.filter(function(_,i){return u.checks&&u.checks[i+"-"+d];}).length;};

  return(
    <div style={st.mn} className="iv-mn"><div>
      <h2 style={st.tt}>📊 全社ダッシュボード</h2>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:14}}>
        <MNav year={y} month={m} onChange={setSm}/>
        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}><button onClick={function(){setFilt("all");setSelU(null);}} style={{...st.fb,...(filt==="all"?st.fa:{})}}>全社</button>{uT.map(function(t){return <button key={t} onClick={function(){setFilt(t);setSelU(null);}} style={{...st.fb,...(filt===t?st.fa:{})}}>{t}</button>;})}</div>
      </div>
      {fl.map(function(u,ui){
        var rate=userAvgRate(u,y,m);var hi=rate>=80;var sel=selU===ui;var hs=getActiveHabits(u,y,m);
        return(
          <div key={ui} style={{marginBottom:6,animation:"fadeIn 0.2s "+(ui*0.03)+"s both"}}>
            <div onClick={function(){setSelU(sel?null:ui);}} style={{...st.cd,cursor:"pointer",marginBottom:0,borderLeft:"3px solid "+(hi?"#C41E1E":"#1B4B8A")}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <PersonFigure rate={rate} size={22}/>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:12}}>{u.name}{u.isMe&&<span style={{fontSize:8,background:"#E8A83E",color:"#fff",padding:"0 4px",borderRadius:4,marginLeft:3}}>YOU</span>}</div><div style={{fontSize:9,color:"#8B7E6A"}}>{u.team}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:8,color:"#8B7E6A"}}>今月の達成率</div><div style={{fontWeight:900,fontSize:15,color:hi?"#C41E1E":"#1B4B8A",animation:hi?"pulse80 1s infinite":"none"}}>{rate}%</div></div>
                <span style={{fontSize:9,color:"#bbb"}}>{sel?"▲":"▼"}</span>
              </div>
            </div>
            {sel&&(
              <div style={{...st.cd,marginTop:0,borderTop:"none",borderRadius:"0 0 10px 10px",background:"#faf7f0",animation:"slideDown 0.3s",padding:10}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,textAlign:"center",fontSize:9,marginBottom:6}}>
                  {DOW.map(function(d){return <div key={d} style={{fontWeight:700,color:"#8B7E6A",padding:1}}>{d}</div>;})}
                  {Array.from({length:fd}).map(function(_,i){return <div key={"e"+i}/>;})}
                  {days.map(function(d){
                    var dn=parseInt(d.split("-")[2]);var cnt=gCC(u,d);var mx=hs.length||1;var int=cnt/mx;var fut=d>td;
                    var bg=fut?"transparent":int>=1?"rgba(196,30,30,0.25)":int>0.6?"rgba(232,168,62,0.2)":int>0?"rgba(58,123,213,0.12)":"#f5f2eb";
                    return <div key={d} style={{padding:2,borderRadius:3,background:bg}}><div style={{fontSize:9,color:fut?"#ccc":d===td?"#C41E1E":"#555",fontWeight:d===td?900:400}}>{dn}</div>{!fut&&int>=1&&<div style={{fontSize:7,textAlign:"center"}}>✓</div>}</div>;
                  })}
                </div>
                {hs.map(function(h,hi){
                  var fq=FREQS.find(function(f){return f.value===h.freq;});var fl2=fq?fq.label:"";if(h.freq!=="daily"&&h.count>1)fl2+=h.count+"回";
                  var hR=calcRate(u.checks||{},hi,h.freq,h.count||1,y,m);var hH=hR>=80;
                  return <div key={hi} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 0",borderBottom:hi<hs.length-1?"1px solid #e8e3d8":"none"}}><span style={{...st.hn,width:18,height:18,fontSize:8}}>{hi+1}</span><span style={{fontSize:11,flex:1}}>{h.name}</span><span style={{fontSize:9,color:"#8B7E6A"}}>{fl2}</span><span style={{fontWeight:900,fontSize:12,minWidth:36,textAlign:"right",color:hH?"#C41E1E":"#1B4B8A",animation:hH?"pulse80 1s infinite":"none"}}>{hR}%</span></div>;
                })}
              </div>
            )}
          </div>
        );
      })}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8,marginTop:18}}>
        {[{l:"参加者数",v:fl.length+"人",i:"👥"},{l:"平均達成率",v:Math.round(fl.reduce(function(s,u){return s+userAvgRate(u,y,m);},0)/Math.max(1,fl.length))+"%",i:"📈"},{l:"80%以上",v:fl.filter(function(u){return userAvgRate(u,y,m)>=80;}).length+"人",i:"🔥"}].map(function(s,si){return <div key={si} style={{...st.cd,textAlign:"center"}}><div style={{fontSize:20}}>{s.i}</div><div style={{fontSize:20,fontWeight:900,color:"#1B4B8A"}}>{s.v}</div><div style={{fontSize:10,color:"#8B7E6A"}}>{s.l}</div></div>;})}
      </div>
    </div></div>
  );
}

/* ═══ SETTINGS ═══ */
function SetScr(p){
  var ud=p.ud,mem=p.mem,sM=p.sM,teams=p.teams,sT=p.sT,sU=p.sU,setScr=p.setScr,eidx=p.eidx,setEidx=p.setEidx,sm=p.sm,isAdmin=p.isAdmin,delUser=p.delUser;
  var _nt=useState("");var nT=_nt[0],sNT=_nt[1];
  var _nn=useState("");var nN=_nn[0],sNN=_nn[1];
  var _ne=useState("");var nE=_ne[0],sNE=_ne[1];
  var _nmt=useState(teams[0]||"");var nMT=_nmt[0],sNMT=_nmt[1];
  var _nh=useState(emptyHabits());var nH=_nh[0],sNH=_nh[1];

  var _en=useState("");var en=_en[0],sEN=_en[1];
  var _et=useState("");var et=_et[0],sET=_et[1];
  var _eh=useState(emptyHabits());var eh=_eh[0],sEH=_eh[1];
  var _emsg=useState("");var emsg=_emsg[0],sEmsg=_emsg[1];

  var startEdit=function(i){
    var m2=mem[i];setEidx(i);sEN(m2.name||"");sET(m2.team||teams[0]);
    var hs=getActiveHabits(m2,sm.year,sm.month);
    sEH(hs.length>0?hs.map(function(h){return{...h};}):emptyHabits());
  };
  var saveEdit=function(){
    if(!en.trim()||!eh.every(function(h){return h.name.trim();}))return;
    var m2=mem[eidx];var key=pKey(sm.year,sm.month);
    var hist=(m2.habitHistory||[]).filter(function(h){return h.periodKey!==key;});
    hist.push({periodKey:key,date:getToday(),habits:eh});
    hist.sort(function(a,b){return a.periodKey<b.periodKey?-1:1;});
    var upd={...m2,name:en,team:et,habitHistory:hist};
    var ms=mem.map(function(x,i){return i===eidx?upd:x;});sM(ms);
    if(ud&&ud.email===upd.email)sU({...ud,...upd});
    setEidx(null);sEmsg("✅ 保存しました");setTimeout(function(){sEmsg("");},2000);
  };

  var addTeam=function(){if(nT.trim()&&teams.indexOf(nT.trim())===-1){sT(teams.concat([nT.trim()]));sNT("");}};
  var remTeam=function(t){sT(teams.filter(function(x){return x!==t;}));};
  var addMem=function(){
    if(!nN.trim()||!nE.includes("@")||!nH.every(function(h){return h.name.trim();}))return;
    var key=pKey(sm.year,sm.month);
    var m2={name:nN.trim(),email:nE.trim(),team:nMT,habitHistory:[{periodKey:key,date:getToday(),habits:nH.map(function(h){return{...h};})}],checks:{}};
    sM(mem.concat([m2]));sNN("");sNE("");sNH(emptyHabits());
  };
  var remMem=function(i){var removed=mem[i];sM(mem.filter(function(_,j){return j!==i;}));if(removed&&removed.email)delUser(removed.email);};

  return(
    <div style={st.mn} className="iv-mn"><div>
      <h2 style={st.tt}>{isAdmin?"⚙️ 設定（管理者）":"⚙️ 設定"}</h2>
      {emsg&&<div style={{background:"#e8f5e9",color:"#2e7d32",padding:"6px 10px",borderRadius:6,marginBottom:10,fontSize:12,textAlign:"center"}}>{emsg}</div>}

      <div style={st.cd}><h3 style={{fontSize:13,fontWeight:700,color:"#1B4B8A",marginBottom:6}}>チーム管理</h3><div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>{teams.map(function(t){return <span key={t} style={{background:"#1B4B8A",color:"#fff",padding:"2px 8px",borderRadius:10,fontSize:10,display:"inline-flex",alignItems:"center",gap:3}}>{t}{isAdmin&&<button onClick={function(){remTeam(t);}} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:11,padding:0,lineHeight:1}}>×</button>}</span>;})}</div>{isAdmin&&<div style={{display:"flex",gap:4}}><input value={nT} onChange={function(e){sNT(e.target.value);}} placeholder="新しいチーム名" style={{...st.input,flex:1,marginBottom:0}}/><button onClick={addTeam} style={{...st.pb,width:"auto",padding:"6px 14px",marginTop:0}}>追加</button></div>}</div>

      {isAdmin&&<div style={{...st.cd,marginTop:10}}><h3 style={{fontSize:13,fontWeight:700,color:"#1B4B8A",marginBottom:6}}>メンバー新規登録</h3>
        <label style={st.lb}>名前</label><input value={nN} onChange={function(e){sNN(e.target.value);}} placeholder="佐藤花子" style={st.input}/>
        <label style={st.lb}>メールアドレス</label><input type="email" value={nE} onChange={function(e){sNE(e.target.value);}} placeholder="sato@invision.co.jp" style={st.input}/>
        <label style={st.lb}>チーム</label><select value={nMT} onChange={function(e){sNMT(e.target.value);}} style={st.input}>{teams.map(function(t){return <option key={t} value={t}>{t}</option>;})}</select>
        <label style={st.lb}>行動習慣</label>
        <HabitEditor habits={nH} onChange={sNH}/>
        <button onClick={addMem} style={{...st.pb,marginTop:6}}>メンバーを登録</button>
      </div>}

      {mem.length>0&&(
        <div style={{...st.cd,marginTop:10}}><h3 style={{fontSize:13,fontWeight:700,color:"#1B4B8A",marginBottom:6}}>登録済みメンバー ({mem.length}人)</h3>
          {mem.map(function(m2,i){
            var isE=eidx===i;
            return <div key={i} style={{borderBottom:i<mem.length-1?"1px solid #e8e3d8":"none",padding:"6px 0"}}>
              {isE?(
                <div style={{background:"#faf7f0",padding:10,borderRadius:8,animation:"slideDown 0.3s"}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#C41E1E",marginBottom:6}}>✏️ {m2.name} を編集中</div>
                  <label style={st.lb}>名前</label><input value={en} onChange={function(e){sEN(e.target.value);}} style={st.input}/>
                  <label style={st.lb}>チーム</label><select value={et} onChange={function(e){sET(e.target.value);}} style={st.input}>{teams.map(function(t){return <option key={t} value={t}>{t}</option>;})}</select>
                  <label style={st.lb}>行動習慣 ({pLabel(pKey(sm.year,sm.month))})</label>
                  <HabitEditor habits={eh} onChange={sEH}/>
                  <div style={{display:"flex",gap:4,marginTop:8}}><button onClick={saveEdit} style={{...st.pb,flex:1}}>保存</button><button onClick={function(){setEidx(null);}} style={{...st.pb,flex:1,background:"#999"}}>キャンセル</button></div>
                </div>
              ):(
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div><span style={{fontWeight:700,fontSize:12}}>{m2.name}</span><span style={{fontSize:9,color:"#8B7E6A",marginLeft:4}}>{m2.team}</span><span style={{fontSize:8,color:"#aaa",marginLeft:4}}>{m2.email}</span></div>
                  {isAdmin&&<div style={{display:"flex",gap:4}}><button onClick={function(){startEdit(i);}} style={{background:"none",border:"1px solid #1B4B8A",borderRadius:3,color:"#1B4B8A",cursor:"pointer",fontSize:9,padding:"1px 6px"}}>編集</button><button onClick={function(){remMem(i);}} style={{background:"none",border:"1px solid #ddd",borderRadius:3,color:"#999",cursor:"pointer",fontSize:9,padding:"1px 6px"}}>削除</button></div>}
                </div>
              )}
            </div>;
          })}
        </div>
      )}
      <button onClick={function(){setScr("setup");}} style={{...st.pb,background:"linear-gradient(135deg,#1B4B8A,#3A7BD5)",marginTop:12}}>自分のプロフィールを編集</button>
    </div></div>
  );
}

var st={
  ctr:{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:16,background:"linear-gradient(180deg,#F5F0E1,#EDE7D6)"},
  mn:{paddingTop:16,paddingBottom:50},
  tt:{fontSize:18,fontWeight:900,color:"#1B4B8A",marginBottom:8},
  cd:{background:"#fff",borderRadius:10,padding:12,marginBottom:12,boxShadow:"0 1px 8px rgba(0,0,0,0.04)",border:"1px solid #e8e3d8",position:"relative"},
  lc:{background:"#fff",borderRadius:14,padding:28,maxWidth:360,width:"100%",boxShadow:"0 6px 30px rgba(27,75,138,0.1)",border:"1px solid #e8e3d8"},
  lb:{display:"block",fontSize:10,fontWeight:700,color:"#8B7E6A",marginBottom:3,marginTop:8},
  input:{width:"100%",padding:"7px 10px",border:"2px solid #e8e3d8",borderRadius:5,fontSize:12,fontFamily:FF,outline:"none",marginBottom:5,background:"#faf7f0",color:"#000000"},
  pb:{width:"100%",padding:"9px",background:"linear-gradient(135deg,#C41E1E,#8B1515)",color:"#fff",border:"none",borderRadius:7,fontSize:13,fontWeight:700,fontFamily:FF,cursor:"pointer",boxShadow:"0 3px 12px rgba(196,30,30,0.3)",marginTop:4},
  hn:{width:22,height:22,borderRadius:"50%",background:"#1B4B8A",color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0},
  nb:{border:"none",background:"transparent",fontFamily:FF,fontSize:11,fontWeight:500,color:"#666",padding:"4px 8px",borderRadius:5,cursor:"pointer"},
  na:{background:"#1B4B8A",color:"#fff",fontWeight:700},
  mBtn:{width:26,height:26,borderRadius:"50%",border:"2px solid #e8e3d8",background:"#fff",cursor:"pointer",fontSize:10,fontFamily:FF,display:"flex",alignItems:"center",justifyContent:"center"},
  fb:{border:"1px solid #e8e3d8",background:"#fff",padding:"3px 9px",borderRadius:10,fontSize:10,fontFamily:FF,cursor:"pointer",color:"#666"},
  fa:{background:"#1B4B8A",color:"#fff",borderColor:"#1B4B8A",fontWeight:700},
};
