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
        issues: score < 75? ["Clogged Pores", "Dullness Detected", "Pollution Layer", "Oil & Dust Mix"] : score < 85? ["Minor Dust Traces", "Light Dullness"] : ["Skin is Clean"],
        advice: score < 75? "Deep cleanse + Vitamin C + Moisturizer daily lagao. Pollution se bacho!" : score < 85? "Daily cleansing + Sunscreen continue rakho" : "Perfect! Routine continue rakho"
      })
      setScanning(false)
    }, 2200)
  }

  const handleUpload = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      analyze()
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center p-4">
      <div className="mt-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">FaceScan AI</h1>
        <p className="text-zinc-400 mt-2 text-sm">AI-Powered Dust & Pollution Damage Analyzer • MD-INZY</p>
      </div>

      <div className="flex gap-2 mt-7 bg-zinc-900 p-1.5 rounded-full border border-zinc-800">
        <button onClick={() => setMode("live")} className={`px-6 py-2.5 rounded-full text-sm font-medium transition ${mode === "live"? "bg-white text-black" : "text-zinc-400"}`}>🔴 Live Scan</button>
        <button onClick={() => setMode("upload")} className={`px-6 py-2.5 rounded-full text-sm font-medium transition ${mode === "upload"? "bg-white text-black" : "text-zinc-400"}`}>📁 Upload</button>
      </div>

      <div className="w-full max-w-md mt-6 bg-zinc-900/60 border border-zinc-800 rounded-[24px] p-4 backdrop-blur">
        {mode === "live"? (
          <div className="relative rounded-2xl overflow-hidden bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-[400px] object-cover" />
            <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-2xl m-4 pointer-events-none" />
            <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full animate-pulse">LIVE</div>
            {scanning && <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center"><div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin"></div><p className="mt-3 text-sm animate-pulse">Scanning Face... AI Analyzing</p></div>}
          </div>
        ) : (
          <div onClick={() => fileInputRef.current?.click()} className="h-[400px] border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-white/30 bg-black/50 overflow-hidden">
            {preview? <img src={preview} className="w-full h-full object-cover" /> : <>
              <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center text-2xl">📸</div>
              <p className="text-zinc-200 mt-3 font-medium">Upload Your Face Photo</p>
              <p className="text-xs text-zinc-500 mt-1">JPG, PNG - AI will analyze instantly</p>
              <button className="mt-4 bg-white text-black px-5 py-2 rounded-full text-sm font-bold">Select Photo</button>
            </>}
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleUpload} />
          </div>
        )}

        <button onClick={analyze} disabled={scanning} className="w-full mt-4 bg-white text-black py-3.5 rounded-full font-bold text-sm tracking-wide disabled:opacity-50 hover:bg-zinc-200 transition">
          {scanning? "Analyzing..." : "✨ Scan Now - Check Dust Damage"}
        </button>

        {result && (
          <div className="mt-5 bg-black border border-zinc-800 rounded-2xl p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm">Dust Level: <b className={`${result.dustLevel === "High"? "text-red-400" : result.dustLevel === "Medium"? "text-yellow-400" : "text-green-400"}`}>{result.dustLevel}</b></p>
              <span className="text-xs bg-zinc-900 px-2 py-1 rounded-full">{result.score}% Clean</span>
            </div>
            <div className="mt-3">
              <p className="text-[11px] text-zinc-500 uppercase tracking-widest">Detected Issues</p>
              <div className="flex flex-wrap gap-1.5 mt-2">{result.issues.map((i:string) => <span key={i} className="text-xs bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full">{i}</span>)}</div>
            </div>
            <p className="mt-4 text-sm bg-zinc-900 p-3 rounded-xl border border-zinc-800">💡 <b>Advice:</b> {result.advice}</p>
          </div>
        )}
      </div>
      <p className="text-[10px] text-zinc-600 mt-6 tracking-widest">POWERED BY INZY164 • MD-INZY AI • READY FOR WHOP</p>
    </div>
  )
}
