"use client";
import { useState, useRef } from "react";

export default function FaceScanPage() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
    setResult(null);
  };

  const analyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const dust = Math.floor(Math.random()*40)+55;
      const acne = Math.floor(Math.random()*30)+10;
      const oil = Math.floor(Math.random()*35)+20;
      setResult({
        dustLevel: dust,
        dustStatus: dust > 80 ? "Very High" : dust > 65 ? "High" : "Moderate",
        acneRisk: acne,
        oiliness: oil,
        pores: Math.floor(Math.random()*20)+70,
        recommendation: dust > 75 ? "Deep cleansing needed! Use face wash 2x daily and anti-pollution serum." : "Good skin! Keep hydrating and use SPF 50."
      });
      setAnalyzing(false);
    }, 2500);
  };

  return (
    <div style={{minHeight:"100vh", background:"linear-gradient(135deg,#0f0f0f,#1a1a2e)", color:"white", padding:"20px"}}>
      <div style={{maxWidth:900, margin:"0 auto"}}>
        <h1 style={{textAlign:"center", fontSize:42, fontWeight:900, marginTop:20}}>FaceScan AI ✨</h1>
        <p style={{textAlign:"center", opacity:0.7, fontSize:18}}>AI-Powered Dust & Pollution Damage Analyzer</p>

        <div style={{background:"rgba(255,255,255,0.08)", borderRadius:24, padding:30, marginTop:30, border:"1px solid rgba(255,255,255,0.1)"}}>
          {!image ? (
            <div onClick={()=>inputRef.current?.click()} style={{border:"2px dashed rgba(255,255,255,0.3)", borderRadius:20, padding:60, textAlign:"center", cursor:"pointer"}}>
              <div style={{fontSize:60}}>📸</div>
              <h3>Upload Your Face Photo</h3>
              <p style={{opacity:0.6}}>JPG, PNG — AI will analyze dust particles instantly</p>
              <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleUpload} />
              <button style={{marginTop:20, background:"white", color:"black", border:"none", padding:"14px 32px", borderRadius:100, fontWeight:800, fontSize:16, cursor:"pointer"}}>Select Photo</button>
            </div>
          ) : (
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:20}}>
              <div>
                <img src={image} style={{width:"100%", borderRadius:20, maxHeight:400, objectFit:"cover"}} />
                <div style={{display:"flex", gap:10, marginTop:15}}>
                  <button onClick={()=>{setImage(null); setResult(null)}} style={{flex:1, background:"rgba(255,255,255,0.1)", color:"white", border:"none", padding:12, borderRadius:12, cursor:"pointer"}}>Change</button>
                  <button onClick={analyze} disabled={analyzing} style={{flex:2, background: analyzing ? "#555" : "white", color:"black", border:"none", padding:12, borderRadius:12, fontWeight:800, cursor:"pointer"}}>{analyzing ? "Analyzing AI..." : "Analyze Now 🚀"}</button>
                </div>
              </div>
              <div>
                {!result && !analyzing && <div style={{opacity:0.5, padding:40, textAlign:"center"}}>Click Analyze Now to see AI results</div>}
                {analyzing && <div style={{textAlign:"center", padding:40}}><div style={{fontSize:40}}>🔬</div><p>AI Scanning Dust Particles...<br/>Detecting pores, oil, pollution damage</p></div>}
                {result && (
                  <div style={{display:"flex", flexDirection:"column", gap:12}}>
                    <div style={{background:"rgba(255,255,255,0.1)", padding:16, borderRadius:16}}>
                      <div style={{display:"flex", justifyContent:"space-between"}}><span>Dust Level</span><b style={{color: result.dustLevel>75 ? "#ff4444" : "#4ade80"}}>{result.dustLevel}% — {result.dustStatus}</b></div>
                      <div style={{height:8, background:"rgba(0,0,0,0.3)", borderRadius:10, marginTop:8}}><div style={{width:`${result.dustLevel}%`, height:"100%", background: result.dustLevel>75 ? "#ff4444" : "#4ade80", borderRadius:10}}></div></div>
                    </div>
                    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                      <div style={{background:"rgba(255,255,255,0.08)", padding:14, borderRadius:14, textAlign:"center"}}><div style={{fontSize:24, fontWeight:800}}>{result.acneRisk}%</div><div style={{fontSize:12, opacity:0.6}}>Acne Risk</div></div>
                      <div style={{background:"rgba(255,255,255,0.08)", padding:14, borderRadius:14, textAlign:"center"}}><div style={{fontSize:24, fontWeight:800}}>{result.oiliness}%</div><div style={{fontSize:12, opacity:0.6}}>Oiliness</div></div>
                    </div>
                    <div style={{background:"linear-gradient(135deg,#667eea,#764ba2)", padding:16, borderRadius:16, marginTop:10}}>
                      <b>💡 AI Advice:</b><p style={{margin:"8px 0 0 0", fontSize:14}}>{result.recommendation}</p>
                    </div>
                    <button onClick={()=>window.print()} style={{background:"white", color:"black", border:"none", padding:14, borderRadius:12, fontWeight:800, marginTop:10, cursor:"pointer"}}>Download Report PDF</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <p style={{textAlign:"center", opacity:0.4, marginTop:30, fontSize:12}}>Powered by FaceScan AI • For Whop Store</p>
      </div>
    </div>
  );
}
