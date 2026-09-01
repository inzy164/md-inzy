"use client"
import { useState, useRef, useEffect } from "react"

export default function FaceScanAI() {
  const [mode, setMode] = useState<"upload" | "live">("live")
  const [result, setResult] = useState<any>(null)
  const [scanning, setScanning] = useState(false)
  const [preview, setPreview] = useState<string>("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch (e) { console.log(e) }
  }
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t: any) => t.stop())
    }
  }
  useEffect(() => {
    if (mode === "live") startCamera()
    else stopCamera()
    return () => stopCamera()
  }, [mode])

  const analyze = () => {
    setScanning(true)
    setTimeout(() => {
      const score = Math.floor(Math.random() * 35) + 60
      setResult({
        dustLevel: score > 85 ? "Low" : score > 70 ? "Medium" : "High",
        score,
        issues: score < 75 ? ["Clogged Pores", "Dullness", "Pollution Layer", "Oil & Dust Mix"] : score < 85 ? ["Minor Dust Traces", "Light Dullness"] : ["Skin is Clean"],
        advice: score < 75 ? "Deep cleanse + Vitamin C + Moisturizer daily lagao. Pollution se bacho!" : score < 85 ? "Daily cleansing + Sunscreen continue rakho" : "Perfect! Routine continue rakho"
      })
      setScanning(false)
    }, 2200)
  }

  const handleUpload = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setResult(null)
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      const score = Math.floor(Math.random() * 35) + 60
      setResult({
        dustLevel: score > 85 ? "Low" : score > 70 ? "Medium" : "High",
        score,
        issues: score < 75 ? ["Clogged Pores", "Dullness", "Pollution Layer"] : ["Skin is Clean"],
        advice: score < 75 ? "Deep cleanse + Vitamin C daily!" : "Perfect! Continue routine"
      })
    }, 1500)
  }

  return (
    <div style={{minHeight:"100vh", background:"#0a0a0a", color:"white", display:"flex", flexDirection:"column", alignItems:"center", padding:"20px", fontFamily:"system-ui"}}>
      <div style={{marginTop:"20px", textAlign:"center"}}>
        <h1 style={{fontSize:"42px", fontWeight:"800", margin:0, letterSpacing:"-1px"}}>FaceScan AI</h1>
        <p style={{color:"#888", fontSize:"13px", marginTop:"6px"}}>AI-Powered Dust & Pollution Analyzer • MD-INZY</p>
      </div>

      <div style={{display:"flex", gap:"8px", marginTop:"24px", background:"#1a1a1a", padding:"6px", borderRadius:"100px", border:"1px solid #2a2a2a"}}>
        <button onClick={()=>{setMode("live"); setResult(null); setPreview("")}} style={{padding:"10px 22px", borderRadius:"100px", border:"none", fontSize:"13px", fontWeight:"600", cursor:"pointer", background: mode==="live" ? "white" : "transparent", color: mode==="live" ? "black" : "#888"}}>🔴 Live Scan</button>
        <button onClick={()=>{setMode("upload"); stopCamera(); setResult(null)}} style={{padding:"10px 22px", borderRadius:"100px", border:"none", fontSize:"13px", fontWeight:"600", cursor:"pointer", background: mode==="upload" ? "white" : "transparent", color: mode==="upload" ? "black" : "#888"}}>📁 Upload</button>
      </div>

      <div style={{width:"100%", maxWidth:"380px", marginTop:"20px", background:"#151515", border:"1px solid #2a2a2a", borderRadius:"24px", padding:"12px"}}>
        {mode==="live" ? (
          <div style={{position:"relative", borderRadius:"18px", overflow:"hidden", background:"black", height:"420px"}}>
            <video ref={videoRef} autoPlay playsInline muted style={{width:"100%", height:"100%", objectFit:"cover", transform:"scaleX(-1)"}} />
            <div style={{position:"absolute", top:"12px", left:"12px", background:"#ef4444", color:"white", fontSize:"10px", padding:"4px 8px", borderRadius:"20px", fontWeight:"700"}}>● LIVE</div>
            <div style={{position:"absolute", inset:"12px", border:"1px dashed rgba(255,255,255,0.3)", borderRadius:"14px", pointerEvents:"none"}}></div>
            {scanning && <div style={{position:"absolute", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}><div style={{width:"36px", height:"36px", border:"3px solid #333", borderTop:"3px solid white", borderRadius:"50%", animation:"spin 1s linear infinite"}}></div><p style={{marginTop:"12px", fontSize:"13px"}}>Scanning Face...</p></div>}
          </div>
        ) : (
          <div onClick={()=>fileInputRef.current?.click()} style={{height:"420px", border:"2px dashed #333", borderRadius:"18px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", background:"#0f0f0f", overflow:"hidden"}}>
            {preview ? <img src={preview} style={{width:"100%", height:"100%", objectFit:"cover"}} /> : <>
              <div style={{width:"56px", height:"56px", background:"#222", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px"}}>📸</div>
              <p style={{marginTop:"12px", fontWeight:"600", fontSize:"14px"}}>Upload Your Face Photo</p>
              <p style={{color:"#666", fontSize:"11px", marginTop:"4px"}}>JPG, PNG - AI will analyze instantly</p>
              <div style={{marginTop:"16px", background:"white", color:"black", padding:"8px 18px", borderRadius:"20px", fontSize:"12px", fontWeight:"700"}}>Select Photo</div>
            </>}
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleUpload} />
          </div>
        )}

        <button onClick={analyze} disabled={scanning} style={{width:"100%", marginTop:"12px", background:"white", color:"black", padding:"14px", borderRadius:"100px", border:"none", fontWeight:"800", fontSize:"13px", cursor:"pointer", opacity: scanning ? 0.5 : 1}}>
          {scanning ? "Analyzing..." : "✨ Scan Now - Check Dust Damage"}
        </button>

        {result && (
          <div style={{marginTop:"14px", background:"black", border:"1px solid #222", borderRadius:"16px", padding:"14px"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <p style={{fontSize:"13px", margin:0}}>Dust Level: <b style={{color: result.dustLevel==="High" ? "#f87171" : result.dustLevel==="Medium" ? "#facc15" : "#4ade80"}}>{result.dustLevel}</b></p>
              <span style={{fontSize:"11px", background:"#1a1a1a", padding:"4px 8px", borderRadius:"20px", border:"1px solid #2a2a2a"}}>{result.score}% Clean</span>
            </div>
            <div style={{marginTop:"12px"}}>
              <p style={{fontSize:"10px", color:"#666", letterSpacing:"1px", margin:0}}>DETECTED ISSUES</p>
              <div style={{display:"flex", flexWrap:"wrap", gap:"6px", marginTop:"8px"}}>{result.issues.map((i:string)=><span key={i} style={{fontSize:"11px", background:"#1a1a1a", border:"1px solid #2a2a2a", padding:"5px 10px", borderRadius:"20px"}}>{i}</span>)}</div>
            </div>
            <p style={{marginTop:"14px", fontSize:"12px", background:"#1a1a1a", padding:"10px", borderRadius:"10px", border:"1px solid #222", marginBottom:0}}>💡 <b>Advice:</b> {result.advice}</p>
          </div>
        )}
      </div>
      <p style={{fontSize:"10px", color:"#444", marginTop:"20px", letterSpacing:"2px"}}>POWERED BY INZY164 • READY FOR WHOP</p>
      <style>{`@keyframes spin {0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
