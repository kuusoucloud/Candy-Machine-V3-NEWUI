'use client'

import MintCard from '@/components/MintCard'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(1200px_800px_at_70%_-10%,rgba(255,111,181,.12),transparent),radial-gradient(1000px_600px_at_0%_100%,rgba(155,231,255,.10),transparent)]">
      <div className="w-full max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-kuusou-pink" />
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">KUUSOU</h1>
              <p className="text-xs text-white/70 -mt-1">Head in the clouds, mind on the moon.</p>
            </div>
          </div>
        </header>
        <div className="flex justify-center">
          <MintCard />
        </div>
      </div>
    </div>
  )
}
