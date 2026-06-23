import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ─── FOOD DATABASE (macros per 100g) ─────────────────────────────────────────
const FOOD_DB = [
  { name:"White Rice (cooked)",     cat:"Grains",  em:"🍚", cal:130, p:2.7,  c:28,   f:0.3,  sug:0.1, fib:0.4, sod:1   },
  { name:"Brown Rice (cooked)",     cat:"Grains",  em:"🍚", cal:112, p:2.6,  c:23.5, f:0.9,  sug:0.4, fib:1.8, sod:5   },
  { name:"Oats (dry)",              cat:"Grains",  em:"🌾", cal:389, p:17,   c:66,   f:7,    sug:1.1, fib:10.6,sod:2   },
  { name:"Whole-Wheat Bread",       cat:"Grains",  em:"🍞", cal:247, p:13,   c:41,   f:4.2,  sug:5.7, fib:7,   sod:400 },
  { name:"Pasta (cooked)",          cat:"Grains",  em:"🍝", cal:131, p:5,    c:25,   f:1.1,  sug:0.6, fib:1.8, sod:1   },
  { name:"Sweet Potato",            cat:"Grains",  em:"🍠", cal:86,  p:1.6,  c:20,   f:0.1,  sug:4.2, fib:3,   sod:55  },
  { name:"Quinoa (cooked)",         cat:"Grains",  em:"🌿", cal:120, p:4.4,  c:21.3, f:1.9,  sug:0.9, fib:2.8, sod:7   },
  { name:"Chicken Breast (cooked)", cat:"Protein", em:"🍗", cal:165, p:31,   c:0,    f:3.6,  sug:0,   fib:0,   sod:74  },
  { name:"Salmon (cooked)",         cat:"Protein", em:"🐟", cal:208, p:20,   c:0,    f:13,   sug:0,   fib:0,   sod:59  },
  { name:"Eggs (whole)",            cat:"Protein", em:"🥚", cal:147, p:12.6, c:0.8,  f:9.9,  sug:0.8, fib:0,   sod:124 },
  { name:"Ground Beef 80/20",       cat:"Protein", em:"🥩", cal:254, p:26,   c:0,    f:17,   sug:0,   fib:0,   sod:75  },
  { name:"Canned Tuna",             cat:"Protein", em:"🐟", cal:116, p:25.5, c:0,    f:0.8,  sug:0,   fib:0,   sod:350 },
  { name:"Shrimp (cooked)",         cat:"Protein", em:"🦐", cal:99,  p:20.9, c:0.2,  f:1.1,  sug:0,   fib:0,   sod:148 },
  { name:"Tofu (firm)",             cat:"Protein", em:"⬜", cal:76,  p:8,    c:2,    f:4.3,  sug:0.4, fib:0.3, sod:7   },
  { name:"Turkey Breast (cooked)",  cat:"Protein", em:"🦃", cal:135, p:30,   c:0,    f:1,    sug:0,   fib:0,   sod:70  },
  { name:"Egg Whites",              cat:"Protein", em:"🥚", cal:52,  p:10.9, c:0.7,  f:0.2,  sug:0.7, fib:0,   sod:166 },
  { name:"Greek Yogurt (full fat)", cat:"Dairy",   em:"🫙", cal:97,  p:9,    c:3.6,  f:5,    sug:3.2, fib:0,   sod:35  },
  { name:"Whole Milk",              cat:"Dairy",   em:"🥛", cal:61,  p:3.2,  c:4.8,  f:3.3,  sug:5.1, fib:0,   sod:44  },
  { name:"Cheddar Cheese",          cat:"Dairy",   em:"🧀", cal:402, p:25,   c:1.3,  f:33,   sug:0.1, fib:0,   sod:621 },
  { name:"Cottage Cheese",          cat:"Dairy",   em:"🫙", cal:98,  p:11.1, c:3.4,  f:4.3,  sug:2.7, fib:0,   sod:364 },
  { name:"Avocado",                 cat:"Fats",    em:"🥑", cal:160, p:2,    c:8.5,  f:14.7, sug:0.7, fib:6.7, sod:7   },
  { name:"Peanut Butter",           cat:"Fats",    em:"🥜", cal:588, p:25,   c:20,   f:50,   sug:9,   fib:6,   sod:15  },
  { name:"Almonds",                 cat:"Fats",    em:"🌰", cal:579, p:21,   c:22,   f:50,   sug:4.4, fib:12.5,sod:1   },
  { name:"Olive Oil",               cat:"Fats",    em:"🫒", cal:884, p:0,    c:0,    f:100,  sug:0,   fib:0,   sod:0   },
  { name:"Banana",                  cat:"Fruit",   em:"🍌", cal:89,  p:1.1,  c:23,   f:0.3,  sug:12,  fib:2.6, sod:1   },
  { name:"Apple",                   cat:"Fruit",   em:"🍎", cal:52,  p:0.3,  c:14,   f:0.2,  sug:10.4,fib:2.4, sod:1   },
  { name:"Blueberries",             cat:"Fruit",   em:"🫐", cal:57,  p:0.7,  c:14.5, f:0.3,  sug:9.9, fib:2.4, sod:1   },
  { name:"Orange",                  cat:"Fruit",   em:"🍊", cal:47,  p:0.9,  c:12,   f:0.1,  sug:9.4, fib:2.4, sod:0   },
  { name:"Broccoli",                cat:"Veggies", em:"🥦", cal:34,  p:2.8,  c:6.6,  f:0.4,  sug:1.7, fib:2.6, sod:33  },
  { name:"Spinach",                 cat:"Veggies", em:"🥬", cal:23,  p:2.9,  c:3.6,  f:0.4,  sug:0.4, fib:2.2, sod:79  },
  { name:"White Potato (baked)",    cat:"Veggies", em:"🥔", cal:77,  p:2,    c:17,   f:0.1,  sug:0.8, fib:2.2, sod:6   },
];
const CATS = ["All", ...new Set(FOOD_DB.map(f => f.cat))];

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const DEFAULT_GOALS = { calories:2000, protein:150, carbs:200, fat:65, sugar:50, fiber:30, sodium:2300 };
const todayStr = () => new Date().toISOString().split("T")[0];
const fmtDate  = s  => new Date(s+"T12:00:00").toLocaleDateString([],{weekday:"short",month:"short",day:"numeric"});
const sumMacros = (arr) => arr.reduce((a,e) => ({
  calories: a.calories+(e.calories||0), protein: a.protein+(e.protein_g||0),
  carbs: a.carbs+(e.carbs_g||0),       fat: a.fat+(e.fat_g||0),
  sugar: a.sugar+(e.sugar_g||0),       fiber: a.fiber+(e.fiber_g||0),
  sodium: a.sodium+(e.sodium_mg||0),
}), {calories:0,protein:0,carbs:0,fat:0,sugar:0,fiber:0,sodium:0});

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg:"#07090F", surface:"#0F1424", surface2:"#161E32", surface3:"#1C2640",
  border:"rgba(148,163,184,0.1)", text:"#F1F5F9", muted:"#64748B", bright:"#94A3B8",
  cal:"#F87171", protein:"#818CF8", carbs:"#34D399", fat:"#FBBF24",
  sugar:"#F9A8D4", fiber:"#6EE7B7", sodium:"#7DD3FC", accent:"#F97316",
};

// ─── SETUP SCREEN ─────────────────────────────────────────────────────────────
function SetupScreen({ onSave }) {
  const [key, setKey] = useState("");
  const [err, setErr] = useState("");
  const [testing, setTesting] = useState(false);

  const handleSave = async () => {
    const k = key.trim();
    if (!k.startsWith("sk-ant-")) { setErr("Key should start with sk-ant-"); return; }
    setTesting(true); setErr("");
    try {
      // Use serverless proxy on production, direct API in local dev
      const url = window.location.hostname === "localhost"
        ? "https://api.anthropic.com/v1/messages"
        : "/api/claude";
      const res = await fetch(url, {
        method:"POST",
        headers:{ "Content-Type":"application/json", "x-api-key":k, "anthropic-version":"2023-06-01" },
        body: JSON.stringify({ model:"claude-haiku-4-5-20251001", max_tokens:10, messages:[{role:"user",content:"hi"}] })
      });
      if (res.ok) { localStorage.setItem("mm_apikey", k); onSave(k); }
      else { const d=await res.json(); setErr(d.error?.message||"Invalid key"); }
    } catch(e) { setErr("Network error: " + e.message); }
    setTesting(false);
  };

  return (
    <div style={{background:T.bg,minHeight:"100dvh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"-apple-system,BlinkMacSystemFont,'Inter',sans-serif",color:T.text}}>
      <div style={{fontSize:52,marginBottom:16}}>🎤</div>
      <div style={{fontSize:26,fontWeight:900,letterSpacing:"-0.04em",marginBottom:6}}>MacroMic</div>
      <div style={{fontSize:13,color:T.muted,marginBottom:40,textAlign:"center"}}>AI-powered voice macro tracker</div>

      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:24,width:"100%",maxWidth:380}}>
        <div style={{fontSize:12,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:16}}>One-time setup</div>
        <p style={{fontSize:13,color:T.bright,marginBottom:20,lineHeight:1.6}}>
          MacroMic uses Claude AI to understand what you ate. Paste your Anthropic API key below — it stays on your device only.
        </p>
        <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer"
          style={{display:"block",fontSize:12,color:T.accent,marginBottom:16,textDecoration:"none"}}>
          → Get your free API key at console.anthropic.com ↗
        </a>
        <input
          type="password"
          placeholder="sk-ant-api03-..."
          value={key}
          onChange={e=>setKey(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleSave()}
          style={{
            width:"100%",padding:"13px 14px",background:T.surface2,
            border:`1px solid ${err?T.cal:T.border}`,borderRadius:10,
            color:T.text,fontSize:14,outline:"none",marginBottom:10,
          }}
        />
        {err && <div style={{fontSize:12,color:T.cal,marginBottom:10}}>⚠ {err}</div>}
        <button onClick={handleSave} disabled={testing||!key.trim()} style={{
          width:"100%",padding:"14px",background:testing||!key.trim()?T.surface2:"linear-gradient(135deg,#F97316,#EA580C)",
          border:"none",borderRadius:10,color:"#fff",fontSize:14,fontWeight:700,cursor:testing||!key.trim()?"not-allowed":"pointer",
        }}>
          {testing?"Verifying…":"Save & Start"}
        </button>
      </div>
      <p style={{fontSize:11,color:T.muted,marginTop:20,textAlign:"center",maxWidth:300,lineHeight:1.6}}>
        Your key is stored locally in your browser and never sent anywhere except directly to Anthropic.
      </p>
    </div>
  );
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function CalRing({ current, goal, size=190 }) {
  const sw=14, r=(size-sw)/2, circ=2*Math.PI*r;
  const pct=Math.min(current/(goal||1),1), offset=circ*(1-pct);
  const remaining=Math.max((goal||0)-current,0);
  return (
    <div style={{position:"relative",width:size,height:size,margin:"0 auto"}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <defs>
          <linearGradient id="cg1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F97316"/><stop offset="100%" stopColor="#EF4444"/>
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.surface3} strokeWidth={sw}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={pct>0?"url(#cg1)":T.surface3} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{transition:"stroke-dashoffset 0.9s cubic-bezier(0.34,1.56,0.64,1)"}}/>
      </svg>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none"}}>
        <div style={{fontSize:34,fontWeight:900,color:T.cal,letterSpacing:"-0.05em",lineHeight:1}}>{Math.round(remaining).toLocaleString()}</div>
        <div style={{fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:3}}>kcal left</div>
        <div style={{fontSize:11,color:T.bright,marginTop:5}}>{Math.round(current).toLocaleString()}<span style={{color:T.muted}}> / {(goal||0).toLocaleString()}</span></div>
      </div>
    </div>
  );
}

function MacroBar({ label, current, goal, color, unit="g", isMax=false }) {
  const pct=Math.min((current/(goal||1))*100,100), over=isMax&&current>(goal||Infinity);
  return (
    <div style={{marginBottom:11}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
        <span style={{color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}</span>
        <span style={{color:over?T.cal:color,fontWeight:600}}>
          {unit==="mg"?Math.round(current):parseFloat(current).toFixed(1)}{unit}
          <span style={{color:T.muted,fontWeight:400}}> / {goal}{unit}</span>
        </span>
      </div>
      <div style={{background:T.surface3,borderRadius:9999,height:5,overflow:"hidden"}}>
        <div style={{width:pct+"%",height:"100%",borderRadius:9999,background:over?T.cal:color,transition:"width 0.7s cubic-bezier(0.34,1.56,0.64,1)"}}/>
      </div>
    </div>
  );
}

function MacroPill({ label, value, color }) {
  return (
    <div style={{textAlign:"center",padding:"10px 6px",background:T.surface2,borderRadius:10,border:`1px solid ${T.border}`,flex:1}}>
      <div style={{fontSize:17,fontWeight:900,color,letterSpacing:"-0.03em"}}>{Math.round(value)}</div>
      <div style={{fontSize:9,color:T.muted,marginTop:2,textTransform:"uppercase",letterSpacing:"0.08em"}}>{label} g</div>
    </div>
  );
}

function PulseDot() {
  return (
    <>
      <style>{`@keyframes rp{0%{transform:scale(1);opacity:.7}70%{transform:scale(2.5);opacity:0}100%{transform:scale(1);opacity:0}}`}</style>
      <span style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",width:10,height:10,marginRight:8}}>
        <span style={{position:"absolute",width:"100%",height:"100%",borderRadius:"50%",background:"rgba(255,255,255,0.5)",animation:"rp 1.3s ease-out infinite"}}/>
        <span style={{width:8,height:8,borderRadius:"50%",background:"#fff"}}/>
      </span>
    </>
  );
}

function SectionLabel({ children }) {
  return <div style={{fontSize:10,color:T.muted,letterSpacing:"0.09em",textTransform:"uppercase",marginBottom:14}}>{children}</div>;
}

function to24h(t) {
  // "8:42 AM" → "08:42"; "08:42" passes through
  if (!t) return "12:00";
  if (/^\d{1,2}:\d{2}$/.test(t)) return t.padStart(5,"0");
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return "12:00";
  let h = parseInt(m[1]); const min = m[2]; const ap = m[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return String(h).padStart(2,"0") + ":" + min;
}
function to12h(t) {
  // "14:30" → "2:30 PM"
  if (!t) return "";
  const [hStr, m] = t.split(":");
  let h = parseInt(hStr);
  const ap = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return h + ":" + m + " " + ap;
}

function EntryCard({ entry, onDelete, onUpdateTime }) {
  const [expanded,setExpanded]=useState(false);
  const [editingTime,setEditingTime]=useState(false);
  return (
    <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,marginBottom:8,overflow:"hidden",borderLeft:`3px solid ${T.protein}`}}>
      <div style={{padding:"12px 14px",display:"flex",alignItems:"flex-start",gap:10}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:700,fontSize:14,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{entry.food_name}</div>
          <div style={{fontSize:11,color:T.muted,marginTop:1,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <span>{entry.serving}</span>
            <span>·</span>
            {editingTime ? (
              <input
                type="time"
                defaultValue={to24h(entry.time)}
                autoFocus
                onBlur={(e)=>{onUpdateTime(entry.id, to12h(e.target.value)); setEditingTime(false);}}
                onKeyDown={(e)=>{if(e.key==="Enter"){onUpdateTime(entry.id, to12h(e.target.value)); setEditingTime(false);}}}
                style={{background:T.surface2,border:`1px solid ${T.accent}`,color:T.text,padding:"2px 5px",borderRadius:4,fontSize:11,fontFamily:"inherit"}}
              />
            ) : (
              <button
                onClick={()=>setEditingTime(true)}
                style={{background:T.surface2,border:`1px solid ${T.border}`,color:T.bright,padding:"1px 6px",borderRadius:4,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}
                title="Tap to edit time">
                🕒 {entry.time}
              </button>
            )}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"5px 10px",marginTop:7,fontSize:12}}>
            <span style={{color:T.cal,fontWeight:700}}>{entry.calories} cal</span>
            <span style={{color:T.protein}}>{entry.protein_g}g P</span>
            <span style={{color:T.carbs}}>{entry.carbs_g}g C</span>
            <span style={{color:T.fat}}>{entry.fat_g}g F</span>
          </div>
        </div>
        <div style={{display:"flex",gap:6,flexShrink:0}}>
          <button onClick={()=>setExpanded(!expanded)} style={{background:T.surface2,border:`1px solid ${T.border}`,color:T.muted,fontSize:11,padding:"4px 8px",borderRadius:6,cursor:"pointer"}}>{expanded?"▲":"▼"}</button>
          <button onClick={()=>onDelete(entry.id)} style={{background:"none",border:"none",color:T.muted,fontSize:17,cursor:"pointer",padding:"2px 4px"}}>✕</button>
        </div>
      </div>
      {expanded&&(
        <div style={{padding:"10px 14px 12px",borderTop:`1px solid ${T.border}`,display:"flex",flexWrap:"wrap",gap:"5px 12px",fontSize:12,background:T.surface2}}>
          {entry.sugar_g!=null&&<span style={{color:T.sugar}}>🩷 {entry.sugar_g}g sugar</span>}
          {entry.fiber_g!=null&&<span style={{color:T.fiber}}>🌿 {entry.fiber_g}g fiber</span>}
          {entry.sodium_mg!=null&&<span style={{color:T.sodium}}>💧 {entry.sodium_mg}mg sodium</span>}
        </div>
      )}
    </div>
  );
}

// ─── VIEW COMPONENTS ──────────────────────────────────────────────────────────
function TodayView({ entries, goals, onDelete, onUpdateTime, logDate }) {
  const m=sumMacros(entries), g=goals;
  const isToday=logDate===todayStr();
  return (
    <>
      {!isToday&&<div style={{background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.3)",borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:12,color:T.accent,textAlign:"center"}}>Viewing {fmtDate(logDate)}</div>}
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"22px 20px 18px",marginBottom:10}}>
        <CalRing current={m.calories} goal={g.calories||2000}/>
        <div style={{display:"flex",gap:8,marginTop:16}}>
          <MacroPill label="Protein" value={m.protein} color={T.protein}/>
          <MacroPill label="Carbs"   value={m.carbs}   color={T.carbs}/>
          <MacroPill label="Fat"     value={m.fat}      color={T.fat}/>
        </div>
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"15px 18px",marginBottom:10}}>
        <SectionLabel>Macros</SectionLabel>
        <MacroBar label="Calories" current={m.calories} goal={g.calories||2000} color={T.cal}     unit=" kcal"/>
        <MacroBar label="Protein"  current={m.protein}  goal={g.protein||150}   color={T.protein}/>
        <MacroBar label="Carbs"    current={m.carbs}    goal={g.carbs||200}     color={T.carbs}/>
        <MacroBar label="Fat"      current={m.fat}      goal={g.fat||65}        color={T.fat}/>
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"15px 18px",marginBottom:10}}>
        <SectionLabel>Nutrients</SectionLabel>
        <MacroBar label="Sugar (max)"  current={m.sugar}  goal={g.sugar||50}    color={T.sugar}  isMax/>
        <MacroBar label="Fiber (min)"  current={m.fiber}  goal={g.fiber||30}    color={T.fiber}/>
        <MacroBar label="Sodium (max)" current={m.sodium} goal={g.sodium||2300} color={T.sodium} unit="mg" isMax/>
      </div>
      <div style={{marginBottom:10}}><SectionLabel>{entries.length} item{entries.length!==1?"s":""} logged</SectionLabel></div>
      {entries.length===0?(
        <div style={{textAlign:"center",padding:"40px 0",color:T.muted}}>
          <div style={{fontSize:36,marginBottom:10}}>🍽</div>
          <div style={{fontSize:14,color:T.text,fontWeight:600,marginBottom:4}}>Nothing logged yet</div>
          <div style={{fontSize:12}}>Tap the mic below to log a meal.</div>
        </div>
      ):([...entries].reverse().map(e=><EntryCard key={e.id} entry={e} onDelete={onDelete} onUpdateTime={onUpdateTime}/>))}
    </>
  );
}

function WeekView({ entries, chartData, goals }) {
  const m=sumMacros(entries), days=new Set(entries.map(e=>e.date)).size;
  const avg=v=>days>0?Math.round(v/days):0;
  return (
    <>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:10}}>
        <SectionLabel>7-Day Totals</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,textAlign:"center",marginBottom:8}}>
          {[{l:"Cal",v:Math.round(m.calories).toLocaleString(),c:T.cal},{l:"Protein",v:Math.round(m.protein)+"g",c:T.protein},{l:"Carbs",v:Math.round(m.carbs)+"g",c:T.carbs},{l:"Fat",v:Math.round(m.fat)+"g",c:T.fat}].map(x=>(
            <div key={x.l} style={{background:T.surface2,borderRadius:8,padding:"9px 4px"}}>
              <div style={{fontSize:15,fontWeight:900,color:x.c}}>{x.v}</div>
              <div style={{fontSize:9,color:T.muted,marginTop:2,textTransform:"uppercase",letterSpacing:"0.07em"}}>{x.l}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,textAlign:"center"}}>
          {[{l:"Sugar",v:Math.round(m.sugar)+"g",c:T.sugar},{l:"Fiber",v:Math.round(m.fiber)+"g",c:T.fiber},{l:"Sodium",v:Math.round(m.sodium)+"mg",c:T.sodium}].map(x=>(
            <div key={x.l} style={{background:T.surface2,borderRadius:8,padding:"8px 4px"}}>
              <div style={{fontSize:13,fontWeight:700,color:x.c}}>{x.v}</div>
              <div style={{fontSize:9,color:T.muted,marginTop:2,textTransform:"uppercase",letterSpacing:"0.07em"}}>{x.l}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",fontSize:11,color:T.muted}}>
          <span>{days} day{days!==1?"s":""} tracked</span>
          <span>Avg <span style={{color:T.cal,fontWeight:600}}>{avg(m.calories)}</span> kcal · <span style={{color:T.protein,fontWeight:600}}>{avg(m.protein)}g</span> P</span>
        </div>
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:10}}>
        <SectionLabel>Daily Calories</SectionLabel>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData} margin={{top:0,right:0,bottom:0,left:-28}}>
            <XAxis dataKey="day" tick={{fill:T.muted,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontSize:12}}/>
            <Bar dataKey="cal" name="Calories" fill={T.accent} radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px"}}>
        <SectionLabel>Macros by Day (g)</SectionLabel>
        <div style={{display:"flex",gap:14,marginBottom:10,fontSize:11}}>
          {[["Protein",T.protein],["Carbs",T.carbs],["Fat",T.fat]].map(([l,c])=>(
            <span key={l} style={{display:"flex",alignItems:"center",gap:4,color:T.bright}}>
              <span style={{width:8,height:8,borderRadius:2,background:c,display:"inline-block"}}/>{l}
            </span>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData} margin={{top:0,right:0,bottom:0,left:-28}}>
            <XAxis dataKey="day" tick={{fill:T.muted,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontSize:12}}/>
            <Bar dataKey="P" name="Protein" stackId="s" fill={T.protein}/>
            <Bar dataKey="C" name="Carbs"   stackId="s" fill={T.carbs}/>
            <Bar dataKey="F" name="Fat"     stackId="s" fill={T.fat} radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

function MonthView({ entries, goals }) {
  const m=sumMacros(entries), days=new Set(entries.map(e=>e.date)).size;
  const avg=v=>days>0?Math.round(v/days):0;
  const month=new Date().toLocaleDateString([],{month:"long",year:"numeric"});
  const wkData=[1,2,3,4].map(wk=>{
    const we=entries.filter(e=>{const d=new Date(e.date+"T12:00:00").getDate();return d>=(wk-1)*7+1&&d<=wk*7;});
    const wm=sumMacros(we);
    return{week:`Wk ${wk}`,cal:Math.round(wm.calories)};
  });
  return (
    <>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:10}}>
        <SectionLabel>{month} · {days} day{days!==1?"s":""} tracked</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            {l:"Total Calories",  v:Math.round(m.calories).toLocaleString()+" kcal",c:T.cal},
            {l:"Daily Avg",       v:avg(m.calories).toLocaleString()+" kcal",       c:"#FB923C"},
            {l:"Total Protein",   v:Math.round(m.protein)+"g",                      c:T.protein},
            {l:"Avg Protein/Day", v:avg(m.protein)+"g",                             c:"#A5B4FC"},
            {l:"Total Sugar",     v:Math.round(m.sugar)+"g",                        c:T.sugar},
            {l:"Avg Sodium/Day",  v:avg(m.sodium)+"mg",                             c:T.sodium},
          ].map(s=>(
            <div key={s.l} style={{background:T.surface2,borderRadius:10,padding:"12px 14px"}}>
              <div style={{fontSize:10,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>{s.l}</div>
              <div style={{fontSize:16,fontWeight:800,color:s.c}}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px"}}>
        <SectionLabel>Calories by Week</SectionLabel>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={wkData} margin={{top:0,right:0,bottom:0,left:-28}}>
            <XAxis dataKey="week" tick={{fill:T.muted,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontSize:12}}/>
            <Bar dataKey="cal" name="Calories" fill={T.accent} radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

function FoodsView({ onLog, logDate }) {
  const [search,setSearch]=useState(""), [cat,setCat]=useState("All"), [grams,setGrams]=useState({}), [logged,setLogged]=useState(null);
  const filtered=FOOD_DB.filter(f=>(cat==="All"||f.cat===cat)&&f.name.toLowerCase().includes(search.toLowerCase()));
  const getG=name=>grams[name]??100;
  const calc=food=>{const mult=getG(food.name)/100;return{cal:Math.round(food.cal*mult),p:(food.p*mult).toFixed(1),c:(food.c*mult).toFixed(1),f:(food.f*mult).toFixed(1),sug:(food.sug*mult).toFixed(1),fib:(food.fib*mult).toFixed(1),sod:Math.round(food.sod*mult)};};
  const handleLog=food=>{onLog(food,getG(food.name));setLogged(food.name);setTimeout(()=>setLogged(null),2000);};
  return (
    <>
      <div style={{background:"rgba(249,115,22,0.08)",border:"1px solid rgba(249,115,22,0.2)",borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:12,color:T.bright,textAlign:"center"}}>
        Logging to: <span style={{color:T.accent,fontWeight:700}}>{logDate===todayStr()?"Today":fmtDate(logDate)}</span>
      </div>
      <input placeholder="🔍  Search foods…" value={search} onChange={e=>setSearch(e.target.value)}
        style={{width:"100%",padding:"11px 14px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,color:T.text,fontSize:14,marginBottom:10,boxSizing:"border-box",outline:"none"}}/>
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:10,marginBottom:4}}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{padding:"5px 12px",borderRadius:9999,border:`1px solid ${cat===c?T.accent:T.border}`,background:cat===c?T.accent:T.surface,color:cat===c?"#fff":T.muted,fontSize:11,fontWeight:cat===c?700:400,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{c}</button>
        ))}
      </div>
      <div style={{fontSize:10,color:T.muted,marginBottom:12}}>All values per 100g. Adjust grams → macros update instantly.</div>
      {filtered.map(food=>{
        const v=calc(food),g=getG(food.name),isLogged=logged===food.name;
        return (
          <div key={food.name} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <span style={{fontSize:26}}>{food.em}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>{food.name}</div>
                <div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:1}}>{food.cat}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <input type="number" min="1" value={g}
                  onChange={e=>setGrams(prev=>({...prev,[food.name]:Math.max(1,parseInt(e.target.value)||1)}))}
                  style={{width:60,padding:"6px 8px",background:T.surface2,border:`1px solid ${T.border}`,borderRadius:6,color:T.text,fontSize:14,fontWeight:700,textAlign:"center"}}/>
                <span style={{fontSize:12,color:T.muted}}>g</span>
              </div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px 10px",fontSize:12,marginBottom:10,padding:"8px 10px",background:T.surface2,borderRadius:8}}>
              <span style={{color:T.cal,fontWeight:700}}>{v.cal} cal</span>
              <span style={{color:T.protein}}>{v.p}g P</span>
              <span style={{color:T.carbs}}>{v.c}g C</span>
              <span style={{color:T.fat}}>{v.f}g F</span>
              <span style={{color:T.sugar}}>{v.sug}g sugar</span>
              <span style={{color:T.fiber}}>{v.fib}g fiber</span>
              <span style={{color:T.sodium}}>{v.sod}mg Na</span>
            </div>
            <button onClick={()=>handleLog(food)} style={{width:"100%",padding:"9px 0",background:isLogged?"#15803D":T.accent,border:"none",borderRadius:9,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",transition:"background 0.2s"}}>
              {isLogged?"✓ Logged!":` + Log ${g}g`}
            </button>
          </div>
        );
      })}
    </>
  );
}

// ─── BMI + Mifflin-St Jeor calorie calc ──────────────────────────────────────
function calcBMI(weight_kg, height_cm) {
  if (!weight_kg || !height_cm) return null;
  const m = height_cm / 100;
  return +(weight_kg / (m * m)).toFixed(1);
}
function bmiCategory(bmi) {
  if (!bmi) return { label: "—", color: T.muted };
  if (bmi < 18.5) return { label: "Underweight", color: T.sodium };
  if (bmi < 25)   return { label: "Healthy", color: T.fiber };
  if (bmi < 30)   return { label: "Overweight", color: T.fat };
  return { label: "Obese", color: T.cal };
}
function suggestGoals(profile) {
  // Mifflin-St Jeor for BMR, then activity multiplier, then macro split
  const { weight_kg, height_cm, age, sex, activity, goal_type } = profile;
  if (!weight_kg || !height_cm || !age) return null;
  const bmr = sex === "f"
    ? 10*weight_kg + 6.25*height_cm - 5*age - 161
    : 10*weight_kg + 6.25*height_cm - 5*age + 5;
  const mult = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725, very:1.9 }[activity] || 1.55;
  let cals = bmr * mult;
  if (goal_type === "cut") cals -= 500;
  if (goal_type === "bulk") cals += 300;
  cals = Math.round(cals / 10) * 10;
  // Macro split: 30% protein, 40% carbs, 30% fat (good general default)
  return {
    calories: cals,
    protein: Math.round(weight_kg * 2),     // ~2g/kg
    carbs:   Math.round((cals * 0.4) / 4),
    fat:     Math.round((cals * 0.30) / 9),
    sugar: 50, fiber: 30, sodium: 2300,
  };
}

// ─── PROFILE VIEW ────────────────────────────────────────────────────────────
function ProfileView({ profile, onUpdate, weights, onLogWeight, onApplySuggested }) {
  const [w, setW] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const latest = weights.length ? weights[weights.length-1] : null;
  const bmi = calcBMI(latest?.kg, profile.height_cm);
  const cat = bmiCategory(bmi);
  const suggested = suggestGoals({...profile, weight_kg: latest?.kg});

  const handleWeight = () => {
    const kg = parseFloat(w);
    if (!kg || kg < 30 || kg > 300) return;
    onLogWeight(kg);
    setW("");
  };

  // Build weight chart (last 30 entries)
  const chartData = weights.slice(-30).map(x => ({
    date: new Date(x.date+"T12:00:00").toLocaleDateString([],{month:"numeric",day:"numeric"}),
    kg: x.kg,
  }));

  return (
    <>
      {/* Personal info */}
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:10}}>
        <SectionLabel>About You</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div>
            <div style={{fontSize:10,color:T.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Age</div>
            <input type="number" value={profile.age||""} placeholder="—"
              onChange={e=>onUpdate({...profile,age:parseInt(e.target.value)||0})}
              style={{background:T.surface2,border:`1px solid ${T.border}`,color:T.text,padding:"8px 10px",borderRadius:6,width:"100%",fontSize:14,fontWeight:700,boxSizing:"border-box"}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:T.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Sex</div>
            <div style={{display:"flex",gap:4}}>
              {[["m","Male"],["f","Female"]].map(([v,l])=>(
                <button key={v} onClick={()=>onUpdate({...profile,sex:v})} style={{
                  flex:1,padding:"8px 0",background:profile.sex===v?T.accent:T.surface2,
                  border:`1px solid ${profile.sex===v?T.accent:T.border}`,
                  color:profile.sex===v?"#fff":T.muted,borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:10,color:T.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Height (cm)</div>
            <input type="number" value={profile.height_cm||""} placeholder="—"
              onChange={e=>onUpdate({...profile,height_cm:parseInt(e.target.value)||0})}
              style={{background:T.surface2,border:`1px solid ${T.border}`,color:T.text,padding:"8px 10px",borderRadius:6,width:"100%",fontSize:14,fontWeight:700,boxSizing:"border-box"}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:T.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Activity</div>
            <select value={profile.activity||"moderate"} onChange={e=>onUpdate({...profile,activity:e.target.value})}
              style={{background:T.surface2,border:`1px solid ${T.border}`,color:T.text,padding:"8px 8px",borderRadius:6,width:"100%",fontSize:12,fontWeight:600,boxSizing:"border-box"}}>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very">Very active</option>
            </select>
          </div>
        </div>
        <div>
          <div style={{fontSize:10,color:T.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Goal</div>
          <div style={{display:"flex",gap:4}}>
            {[["cut","Cut"],["maintain","Maintain"],["bulk","Bulk"]].map(([v,l])=>(
              <button key={v} onClick={()=>onUpdate({...profile,goal_type:v})} style={{
                flex:1,padding:"9px 0",background:profile.goal_type===v?T.accent:T.surface2,
                border:`1px solid ${profile.goal_type===v?T.accent:T.border}`,
                color:profile.goal_type===v?"#fff":T.muted,borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BMI + current weight */}
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:10}}>
        <SectionLabel>Stats</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div style={{background:T.surface2,borderRadius:10,padding:"12px 14px"}}>
            <div style={{fontSize:10,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Current Weight</div>
            <div style={{fontSize:22,fontWeight:900,color:T.text,letterSpacing:"-0.03em"}}>
              {latest ? latest.kg.toFixed(1) : "—"}<span style={{fontSize:13,color:T.muted,fontWeight:400}}> kg</span>
            </div>
            {latest && <div style={{fontSize:10,color:T.muted,marginTop:2}}>{fmtDate(latest.date)}</div>}
          </div>
          <div style={{background:T.surface2,borderRadius:10,padding:"12px 14px"}}>
            <div style={{fontSize:10,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>BMI</div>
            <div style={{fontSize:22,fontWeight:900,color:cat.color,letterSpacing:"-0.03em"}}>
              {bmi ?? "—"}
            </div>
            <div style={{fontSize:10,color:cat.color,marginTop:2,fontWeight:600}}>{cat.label}</div>
          </div>
        </div>
      </div>

      {/* Weight logger */}
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:10}}>
        <SectionLabel>Log Weight</SectionLabel>
        <div style={{display:"flex",gap:8}}>
          <input type="number" step="0.1" value={w} placeholder="e.g. 75.4"
            onChange={e=>setW(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleWeight()}
            style={{flex:1,background:T.surface2,border:`1px solid ${T.border}`,color:T.text,padding:"12px 14px",borderRadius:10,fontSize:15,fontWeight:700,outline:"none"}}/>
          <button onClick={handleWeight} disabled={!w} style={{
            padding:"12px 18px",
            background:!w?T.surface2:"linear-gradient(135deg,#F97316,#EA580C)",
            border:"none",borderRadius:10,color:"#fff",fontSize:14,fontWeight:700,
            cursor:!w?"not-allowed":"pointer",whiteSpace:"nowrap"}}>
            + Log kg
          </button>
        </div>
      </div>

      {/* Weight chart */}
      {weights.length >= 2 && (
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:10}}>
          <SectionLabel>Weight Trend ({weights.length} entries)</SectionLabel>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} margin={{top:5,right:5,bottom:0,left:-22}}>
              <XAxis dataKey="date" tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis domain={['dataMin - 1','dataMax + 1']} tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontSize:12}}/>
              <Bar dataKey="kg" name="kg" fill={T.protein} radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Suggested goals */}
      {suggested && (
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px"}}>
          <SectionLabel>Suggested Daily Targets</SectionLabel>
          <div style={{fontSize:11,color:T.muted,marginBottom:12}}>Based on your stats + {profile.goal_type||"maintain"} goal. You can apply these or override anytime in Goals.</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,textAlign:"center",marginBottom:14}}>
            {[
              {l:"Cal",v:suggested.calories,c:T.cal},
              {l:"P",v:suggested.protein+"g",c:T.protein},
              {l:"C",v:suggested.carbs+"g",c:T.carbs},
              {l:"F",v:suggested.fat+"g",c:T.fat},
            ].map(x=>(
              <div key={x.l} style={{background:T.surface2,borderRadius:8,padding:"9px 4px"}}>
                <div style={{fontSize:14,fontWeight:900,color:x.c,letterSpacing:"-0.03em"}}>{x.v}</div>
                <div style={{fontSize:9,color:T.muted,marginTop:2,textTransform:"uppercase",letterSpacing:"0.07em"}}>{x.l}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>onApplySuggested(suggested)} style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#F97316,#EA580C)",border:"none",borderRadius:10,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>
            Apply as Daily Goals
          </button>
        </div>
      )}
    </>
  );
}

// ─── WORKOUTS VIEW ───────────────────────────────────────────────────────────
function WorkoutsView({ workouts, onLog, onRemove, logDate }) {
  const today = workouts.filter(w => w.date === logDate);
  const types = [
    { key:"strength",     label:"Strength",     em:"🏋️", color:"#EF4444" },
    { key:"calisthenics", label:"Calisthenics", em:"🤸",  color:"#F97316" },
    { key:"cardio",       label:"Cardio",       em:"🏃",  color:"#34D399" },
    { key:"mobility",     label:"Mobility",     em:"🧘",  color:"#818CF8" },
  ];

  // Last 7 days streak data
  const streak = Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-(6-i));
    const ds=d.toISOString().split("T")[0];
    const sessions = workouts.filter(w=>w.date===ds);
    return { day: d.toLocaleDateString([],{weekday:"short"}).slice(0,2), count: sessions.length, date: ds };
  });
  const weekCount = workouts.filter(w => {
    const d=new Date(); d.setDate(d.getDate()-6);
    return w.date >= d.toISOString().split("T")[0];
  }).length;
  const monthCount = workouts.filter(w => w.date.startsWith(new Date().toISOString().slice(0,7))).length;

  return (
    <>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:10}}>
        <SectionLabel>Log a Session — {logDate===todayStr()?"Today":fmtDate(logDate)}</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {types.map(t=>{
            const done = today.some(w => w.type === t.key);
            return (
              <button key={t.key} onClick={()=>onLog(t.key)} style={{
                background: done ? t.color : T.surface2,
                border: `1px solid ${done ? t.color : T.border}`,
                borderRadius: 12, padding: "16px 12px",
                color: done ? "#fff" : T.text,
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                transition:"all 0.18s",
              }}>
                <span style={{fontSize:30}}>{t.em}</span>
                <span>{t.label}</span>
                <span style={{fontSize:10,fontWeight:600,opacity:0.8}}>
                  {done ? "✓ Logged" : "Tap to log"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's sessions */}
      {today.length > 0 && (
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:10}}>
          <SectionLabel>{today.length} session{today.length>1?"s":""} this day</SectionLabel>
          {today.map(w=>{
            const t = types.find(x=>x.key===w.type);
            return (
              <div key={w.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:T.surface2,borderRadius:8,marginBottom:6,borderLeft:`3px solid ${t.color}`}}>
                <span style={{fontSize:20}}>{t.em}</span>
                <span style={{flex:1,fontWeight:600,fontSize:13}}>{t.label}</span>
                <span style={{fontSize:11,color:T.muted}}>{w.time}</span>
                <button onClick={()=>onRemove(w.id)} style={{background:"none",border:"none",color:T.muted,fontSize:16,cursor:"pointer"}}>✕</button>
              </div>
            );
          })}
        </div>
      )}

      {/* Streak / stats */}
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:10}}>
        <SectionLabel>This Week</SectionLabel>
        <div style={{display:"flex",justifyContent:"space-between",gap:6,marginBottom:14}}>
          {streak.map(s=>(
            <div key={s.date} style={{flex:1,textAlign:"center"}}>
              <div style={{
                height:42,borderRadius:8,
                background: s.count>0 ? (s.count>=2 ? "#15803D" : T.fiber) : T.surface3,
                display:"flex",alignItems:"center",justifyContent:"center",
                color:s.count>0?"#fff":T.muted,fontSize:12,fontWeight:700,
                marginBottom:5,
              }}>
                {s.count>0 ? s.count : "·"}
              </div>
              <div style={{fontSize:10,color:T.muted,textTransform:"uppercase"}}>{s.day}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div style={{background:T.surface2,borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:900,color:T.fiber}}>{weekCount}</div>
            <div style={{fontSize:10,color:T.muted,marginTop:2,textTransform:"uppercase",letterSpacing:"0.06em"}}>This Week</div>
          </div>
          <div style={{background:T.surface2,borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:900,color:T.protein}}>{monthCount}</div>
            <div style={{fontSize:10,color:T.muted,marginTop:2,textTransform:"uppercase",letterSpacing:"0.06em"}}>This Month</div>
          </div>
        </div>
      </div>

      {/* Type breakdown */}
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px"}}>
        <SectionLabel>This Month by Type</SectionLabel>
        {types.map(t=>{
          const count = workouts.filter(w => w.type===t.key && w.date.startsWith(new Date().toISOString().slice(0,7))).length;
          return (
            <div key={t.key} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontSize:20}}>{t.em}</span>
              <span style={{flex:1,fontSize:13,fontWeight:600}}>{t.label}</span>
              <span style={{fontSize:14,fontWeight:800,color:t.color}}>{count}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function GoalsPanel({ goals, onUpdate }) {
  const fields=[
    {key:"calories",label:"Calories",unit:"kcal",color:T.cal},{key:"protein",label:"Protein",unit:"g",color:T.protein},
    {key:"carbs",label:"Carbs",unit:"g",color:T.carbs},{key:"fat",label:"Fat",unit:"g",color:T.fat},
    {key:"sugar",label:"Sugar max",unit:"g",color:T.sugar},{key:"fiber",label:"Fiber min",unit:"g",color:T.fiber},
    {key:"sodium",label:"Sodium max",unit:"mg",color:T.sodium},
  ];
  return (
    <div style={{margin:"14px 20px 0",background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:"16px 18px"}}>
      <SectionLabel>Daily Targets</SectionLabel>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {fields.map(({key,label,unit,color})=>(
          <div key={key}>
            <div style={{fontSize:10,color,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <input type="number" value={goals[key]??DEFAULT_GOALS[key]}
                onChange={e=>onUpdate({...goals,[key]:parseInt(e.target.value)||0})}
                style={{background:T.surface2,border:`1px solid ${T.border}`,color:T.text,padding:"7px 8px",borderRadius:6,width:74,fontSize:14,fontWeight:700}}/>
              <span style={{fontSize:11,color:T.muted}}>{unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [apiKey,    setApiKey]    = useState(() => localStorage.getItem("mm_apikey")||"");
  const [entries,   setEntries]   = useState(()=>{ try{return JSON.parse(localStorage.getItem("mm_entries")||"[]")}catch{return[]} });
  const [goals,     setGoals]     = useState(()=>{ try{return JSON.parse(localStorage.getItem("mm_goals")||"null")||DEFAULT_GOALS}catch{return DEFAULT_GOALS} });
  const [weights,   setWeights]   = useState(()=>{ try{return JSON.parse(localStorage.getItem("mm_weights")||"[]")}catch{return[]} });
  const [workouts,  setWorkouts]  = useState(()=>{ try{return JSON.parse(localStorage.getItem("mm_workouts")||"[]")}catch{return[]} });
  const [profile,   setProfile]   = useState(()=>{ try{return JSON.parse(localStorage.getItem("mm_profile")||"null")||{age:0,sex:"m",height_cm:0,activity:"moderate",goal_type:"maintain"}}catch{return{age:0,sex:"m",height_cm:0,activity:"moderate",goal_type:"maintain"}} });
  const [view,      setView]      = useState("today");
  const [showGoals, setShowGoals] = useState(false);
  const [listening, setListening] = useState(false);
  const [processing,setProcessing]= useState(false);
  const [transcript,setTranscript]= useState("");
  const [status,    setStatus]    = useState("");
  const [logDate,   setLogDate]   = useState(todayStr());
  const recRef=useRef(null), txRef=useRef("");

  const persist = arr => { localStorage.setItem("mm_entries",JSON.stringify(arr)); };
  const persistGoals = g => { localStorage.setItem("mm_goals",JSON.stringify(g)); };
  const updateGoals = next => { setGoals(next); persistGoals(next); };

  // Weight, workout, profile handlers
  const updateProfile = next => { setProfile(next); localStorage.setItem("mm_profile",JSON.stringify(next)); };
  const logWeight = (kg) => {
    // Replace today's entry if exists, else add
    const t = todayStr();
    const filtered = weights.filter(w => w.date !== t);
    const next = [...filtered, { date: t, kg, id: Date.now() }].sort((a,b)=>a.date.localeCompare(b.date));
    setWeights(next); localStorage.setItem("mm_weights",JSON.stringify(next));
    setStatus(`✓ Logged ${kg}kg`);
  };
  const logWorkout = (type) => {
    // Prevent duplicate same-type on same day
    if (workouts.some(w => w.date===logDate && w.type===type)) {
      // Untoggle: remove it
      const next = workouts.filter(w => !(w.date===logDate && w.type===type));
      setWorkouts(next); localStorage.setItem("mm_workouts",JSON.stringify(next));
      return;
    }
    const entry = {
      id: Date.now(), date: logDate, type,
      time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})
    };
    const next = [...workouts, entry];
    setWorkouts(next); localStorage.setItem("mm_workouts",JSON.stringify(next));
  };
  const removeWorkout = (id) => {
    const next = workouts.filter(w => w.id !== id);
    setWorkouts(next); localStorage.setItem("mm_workouts",JSON.stringify(next));
  };
  const applySuggestedGoals = (s) => {
    updateGoals({...goals, ...s});
    setStatus("✓ Applied suggested goals");
    setView("today");
  };

  // ── Mic (works in top-level window — no iframe restriction here) ──
  const startListening = async () => {
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if (!SR) { setStatus("Voice requires Chrome or Safari."); return; }
    try {
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      stream.getTracks().forEach(t=>t.stop());
    } catch(err) {
      setStatus("🚫 Mic denied — tap the 🔒 in the address bar → allow Microphone.");
      return;
    }
    const r=new SR();
    recRef.current=r; r.continuous=false; r.interimResults=true; r.lang="en-US";
    txRef.current="";
    r.onresult=ev=>{const t=Array.from(ev.results).map(x=>x[0].transcript).join(" ");setTranscript(t);txRef.current=t;};
    r.onend=()=>{setListening(false);const t=txRef.current.trim();if(t)processFood(t);else setStatus("Didn't catch that — tap again.");};
    r.onerror=ev=>{setListening(false);setStatus("Mic error: "+ev.error);};
    r.start(); setListening(true); setTranscript(""); setStatus("Listening…");
  };
  const stopListening=()=>recRef.current?.stop();

  const processFood = async text => {
    setProcessing(true); setStatus(`Analyzing: "${text}"`);
    try {
      const url = window.location.hostname === "localhost"
        ? "https://api.anthropic.com/v1/messages"
        : "/api/claude";
      const res=await fetch(url,{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:500,messages:[{role:"user",content:
`Parse this food entry. Return ONLY valid JSON, no markdown.
Entry: "${text}"
{"food_name":"concise name max 6 words","calories":integer,"protein_g":number,"carbs_g":number,"fat_g":number,"sugar_g":number,"fiber_g":number,"sodium_mg":integer,"serving":"e.g. 2 eggs, 250g"}`
        }]})
      });
      const data=await res.json();
      const raw=data.content?.find(b=>b.type==="text")?.text||"";
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      const entry={id:Date.now(),date:logDate,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),...parsed,source:"voice"};
      const next=[...entries,entry]; setEntries(next); persist(next);
      setStatus(`✓ Logged: ${parsed.food_name}`); setTranscript("");
    } catch { setStatus("Parse error — try again."); }
    setProcessing(false);
  };

  const logFoodFromDB=(food,g)=>{
    const mult=g/100;
    const entry={id:Date.now(),date:logDate,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
      food_name:food.name,calories:Math.round(food.cal*mult),protein_g:parseFloat((food.p*mult).toFixed(1)),
      carbs_g:parseFloat((food.c*mult).toFixed(1)),fat_g:parseFloat((food.f*mult).toFixed(1)),
      sugar_g:parseFloat((food.sug*mult).toFixed(1)),fiber_g:parseFloat((food.fib*mult).toFixed(1)),
      sodium_mg:Math.round(food.sod*mult),serving:`${g}g`,source:"db"};
    const next=[...entries,entry]; setEntries(next); persist(next);
    setStatus(`✓ Logged ${g}g ${food.name}`); setView("today");
  };

  const deleteEntry=id=>{const next=entries.filter(e=>e.id!==id);setEntries(next);persist(next);};
  const updateEntryTime=(id,newTime)=>{
    const next=entries.map(e=>e.id===id?{...e,time:newTime}:e);
    setEntries(next); persist(next);
  };

  const todayEntries=entries.filter(e=>e.date===logDate);
  const weekEntries=(()=>{const d=new Date();d.setDate(d.getDate()-6);return entries.filter(e=>e.date>=d.toISOString().split("T")[0]);})();
  const monthEntries=entries.filter(e=>e.date.startsWith(new Date().toISOString().slice(0,7)));
  const weekChartData=Array.from({length:7},(_,i)=>{
    const d=new Date();d.setDate(d.getDate()-(6-i));
    const ds=d.toISOString().split("T")[0];
    const m=sumMacros(entries.filter(e=>e.date===ds));
    return{day:d.toLocaleDateString([],{weekday:"short"}),cal:Math.round(m.calories),P:Math.round(m.protein),C:Math.round(m.carbs),F:Math.round(m.fat)};
  });

  if (!apiKey) return <SetupScreen onSave={setApiKey}/>;

  const TABS=[
    {id:"today",   label:"Today"   },
    {id:"week",    label:"Week"    },
    {id:"month",   label:"Month"   },
    {id:"foods",   label:"Foods"   },
    {id:"workout", label:"Workouts"},
    {id:"profile", label:"Profile" },
  ];

  return (
    <div style={{background:T.bg,minHeight:"100dvh",color:T.text,fontFamily:"-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif",maxWidth:480,margin:"0 auto",paddingBottom:(view==="foods"||view==="profile"||view==="workout")?40:150}}>
      <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,height:"35%",background:"radial-gradient(ellipse at 65% 0%,rgba(249,115,22,0.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"relative",zIndex:1}}>
        {/* Header */}
        <div style={{padding:"20px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:22,fontWeight:900,letterSpacing:"-0.04em"}}>MacroMic <span style={{fontSize:18}}>🎤</span></div>
            <div style={{fontSize:11,color:T.muted,marginTop:2}}>{new Date().toLocaleDateString([],{weekday:"long",month:"long",day:"numeric"})}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>setShowGoals(!showGoals)} style={{background:showGoals?T.accent:T.surface2,border:`1px solid ${showGoals?T.accent:T.border}`,color:showGoals?"#fff":T.muted,padding:"7px 13px",borderRadius:8,fontSize:12,cursor:"pointer"}}>
              {showGoals?"Done":"⚙ Goals"}
            </button>
            <button onClick={()=>{if(confirm("Sign out and clear API key?")){{localStorage.removeItem("mm_apikey");setApiKey("");}}}} style={{background:"none",border:`1px solid ${T.border}`,color:T.muted,padding:"7px 10px",borderRadius:8,fontSize:11,cursor:"pointer"}}>⏏</button>
          </div>
        </div>
        {showGoals&&<GoalsPanel goals={goals} onUpdate={updateGoals}/>}
        {/* Tabs (scrollable) */}
        <div style={{display:"flex",padding:"14px 20px 0",gap:5,overflowX:"auto",scrollbarWidth:"none"}}>
          {TABS.map(tab=>(
            <button key={tab.id} onClick={()=>setView(tab.id)} style={{
              flex:"1 0 auto",minWidth:64,padding:"9px 12px",
              background:view===tab.id?T.accent:T.surface,
              border:`1px solid ${view===tab.id?T.accent:T.border}`,
              color:view===tab.id?"#fff":T.muted,
              borderRadius:8,fontSize:11,fontWeight:view===tab.id?700:400,
              cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap",
            }}>{tab.label}</button>
          ))}
        </div>
        {/* Content */}
        <div style={{padding:"14px 20px"}}>
          {view==="today"  &&<TodayView entries={todayEntries} goals={goals} onDelete={deleteEntry} onUpdateTime={updateEntryTime} logDate={logDate}/>}
          {view==="week"   &&<WeekView  entries={weekEntries} chartData={weekChartData} goals={goals}/>}
          {view==="month"  &&<MonthView entries={monthEntries} goals={goals}/>}
          {view==="foods"  &&<FoodsView onLog={logFoodFromDB} logDate={logDate}/>}
          {view==="workout"&&<WorkoutsView workouts={workouts} onLog={logWorkout} onRemove={removeWorkout} logDate={logDate}/>}
          {view==="profile"&&<ProfileView profile={profile} onUpdate={updateProfile} weights={weights} onLogWeight={logWeight} onApplySuggested={applySuggestedGoals}/>}
        </div>
      </div>
      {/* Dock — hidden on profile/workout tabs */}
      {(view!=="profile"&&view!=="workout")&&<div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(7,9,15,0.96)",backdropFilter:"blur(20px)",borderTop:`1px solid ${T.border}`,padding:"12px 20px 28px",zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <span style={{fontSize:11,color:T.muted,whiteSpace:"nowrap"}}>Log for:</span>
          <input type="date" value={logDate} max={todayStr()} onChange={e=>setLogDate(e.target.value||todayStr())}
            style={{flex:1,background:T.surface2,border:`1px solid ${T.border}`,color:T.text,padding:"5px 10px",borderRadius:7,fontSize:12,cursor:"pointer"}}/>
          {logDate!==todayStr()&&<button onClick={()=>setLogDate(todayStr())} style={{background:"none",border:`1px solid ${T.border}`,color:T.accent,padding:"5px 8px",borderRadius:6,fontSize:11,cursor:"pointer",whiteSpace:"nowrap"}}>→ Today</button>}
        </div>
        {view!=="foods"&&(
          <>
            {(status||transcript)&&(
              <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",marginBottom:8,fontSize:12,textAlign:"center",color:transcript?T.text:status.startsWith("✓")?T.fiber:status.includes("🚫")||status.includes("error")?T.cal:T.muted}}>
                {transcript?`"${transcript}"`:status}
              </div>
            )}
            <button onClick={listening?stopListening:startListening} disabled={processing} style={{width:"100%",padding:"16px 0",background:processing?T.surface2:listening?"linear-gradient(135deg,#EF4444,#DC2626)":"linear-gradient(135deg,#F97316,#EA580C)",border:"none",borderRadius:13,color:"#fff",fontSize:15,fontWeight:800,cursor:processing?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,letterSpacing:"-0.01em",transition:"background 0.2s",boxShadow:listening?"0 0 0 6px rgba(239,68,68,0.25)":"none"}}>
              {processing?"⏳  Analyzing…":listening?<><PulseDot/>Tap to Stop</>:"🎤  Tap to Log Food"}
            </button>
            <div style={{textAlign:"center",fontSize:10,color:T.muted,marginTop:7}}>"250g chicken and rice" · "Two eggs and toast" · "Grande oat latte"</div>
          </>
        )}
        {view==="foods"&&<div style={{textAlign:"center",fontSize:11,color:T.muted,marginTop:2}}>Adjust grams on any card, then tap <span style={{color:T.accent}}>+ Log</span></div>}
      </div>}
    </div>
  );
}
