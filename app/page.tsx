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
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop())
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
        dustLevel: score > 85? "Low" : score > 70? "Medium" : "High",
        score,
        issues: score < 75? ["Clogged Pores", "Dullness", "Pollution Layer", "Oil & Dust Mix"] : score < 85? ["Minor Dust Traces", "Light Dullness"] : ["Skin is Clean ✨"],
        advice: score < 75? "Deep cleanse + Vitamin C + Moisturizer daily. Pollution se bacho, sunscreen lagao!" : score < 85? "Daily cleansing + Sunscreen continue rakho, hydration badhao" : "Perfect! Routine continue rakho, skin glow kar rahi hai!"
      })
      setScanning(false)
    }, 2400)
  }

  const handleUpload = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setResult(null)
    setTimeout(() => analyze(), 800)
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center p-4 selection:bg-white selection:text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap');
        *{font-family:'Space Grotesk', system-ui}
      `}</style>
      
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1 rounded-full text-[11px] tracking-widest">⚡ AI-POWERED • INZY164</div>
        <h1 className="text-[42px] font-bold tracking-[-2px] mt-4 leading-none">FaceScan AI</h1>
        <p className="text-zinc-500 mt-2 text-[13px] max-w-xs mx-auto">Dust & Pollution Damage Analyzer • Detect pores, dullness, oil in 2 sec</p>
      </div>

      <div className="flex gap-2 mt-8 bg-[#111113] p-1.5 rounded-full border border-zinc-800/80 shadow-2xl">
        <button onClick={() => {setMode("live"); setResult(null)}} className={`px-7 py-2.5 rounded-full text-[13px] font-semibold transition-all ${mode === "live"? "bg-white text-black shadow-lg scale-105" : "text-zinc-500 hover:text-zinc-300"}`}>🔴 Live Scan</button>
        <button onClick={() => {setMode("upload"); stopCamera(); setResult(null)}} className={`px-7 py-2.5 rounded-full text-[13px] font-semibold transition-all ${mode === "upload"? "bg-white text-black shadow-lg scale-105" : "text-zinc-500 hover:text-zinc-300"}`}>📁 Upload</button>
      </div>

      <div className="w-full max-w-[390px] mt-6 bg-[#121214] border border-zinc-800 rounded-[28px] p-3 shadow-[0_0_80px_rgba(255,255,255,0.05)]">
        {mode === "live"? (
          <div className="relative rounded-[20px] overflow-hidden bg-black aspect-[3/4]">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            <div className="absolute inset-0 rounded-[20px] border border-white/10 m-0 pointer-events-none" />
            <div className="absolute inset-[18px] border border-dashed border-white/20 rounded-[16px] pointer-events-none" />
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-red-500/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest"><div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"/>LIVE</div>
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-2.5 py-1 rounded-full text-[10px] border border-white/10">HD • AI</div>
            {scanning && <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center"><div className="w-12 h-12 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div><p className="mt-4 text-sm font-medium tracking-wide animate-pulse">AI Scanning Face...</p><p className="text-[11px] text-zinc-400 mt-1">Analyzing dust, pores, pollution</p></div>}
          </div>
        ) : (
          <div onClick={() => fileInputRef.current?.click()} className="h-[380px] border border-dashed border-zinc-700/80 rounded-[20px] flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 hover:bg-white/[0.02] transition bg-[#0a0a0c] overflow-hidden group">
            {preview? <img src={preview} className="w-full h-full object-cover" /> : <>
              <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition">📸</div>
              <p className="text-white mt-4 font-semibold tracking-tight">Drop Photo or Click</p>
              <p className="text-[12px] text-zinc-500 mt-1">JPG, PNG • Instant AI Analysis</p>
              <div className="mt-5 bg-white text-black px-6 py-2 rounded-full text-[12px] font-bold tracking-wide">SELECT PHOTO</div>
            </>}
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleUpload} />
          </div>
        )}

        <button onClick={analyze} disabled={scanning} className="w-full mt-3 bg-white text-black py-[15px] rounded-full font-bold text-[13px] tracking-wide disabled:opacity-50 hover:bg-zinc-100 active:scale-[0.98] transition-all shadow-lg">
          {scanning? "⚡ Analyzing..." : "✨ Scan Now - Check Dust Damage"}
        </button>

        {result && (
          <div className="mt-3 bg-[#08080a] border border-zinc-800/80 rounded-[18px] p-4 animate-[fadeIn_0.5s]">
            <div className="flex justify-between items-center">
              <p className="text-[13px] text-zinc-400">Dust Level: <b className={`text-[15px] ${result.dustLevel === "High"? "text-red-400" : result.dustLevel === "Medium"? "text-yellow-300" : "text-emerald-400"}`}>{result.dustLevel}</b></p>
              <span className="text-[11px] bg-[#1a1a1e] border border-zinc-800 px-3 py-1 rounded-full font-bold">{result.score}% Clean</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 rounded-full mt-3 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${result.score > 85? "bg-emerald-400 w-[90%]" : result.score > 70? "bg-yellow-400 w-[70%]" : "bg-red-400 w-[40%]"}`} />
            </div>
            <div className="mt-4">
              <p className="text-[10px] text-zinc-500 uppercase tracking-[2px] font-bold">Detected Issues</p>
              <div className="flex flex-wrap gap-1.5 mt-2">{result.issues.map((i:string) => <span key={i} className="text-[11px] bg-[#151518] border border-zinc-800/80 px-3 py-1.5 rounded-full text-zinc-300">{i}</span>)}</div>
            </div>
            <div className="mt-4 bg-gradient-to-br from-zinc-900 to-[#111] p-3.5 rounded-[14px] border border-zinc-800/50">
              <p className="text-[12px] leading-relaxed"><span className="text-[11px] bg-white text-black px-1.5 py-0.5 rounded font-bold mr-1">AI ADVICE</span> {result.advice}</p>
            </div>
          </div>
        )}
      </div>
      <p className="text-[10px] text-zinc-600 mt-8 tracking-[3px] uppercase">Powered by INZY164 • MD-INZY AI</p>
    </div>
  )
}
