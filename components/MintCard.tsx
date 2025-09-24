'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { makeUmi, withWallet } from '@/lib/umi'
import { publicKey, generateSigner } from '@metaplex-foundation/umi'
import { fetchCandyMachine, mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import { Loader2, CheckCircle, Shield, Coins, Timer } from 'lucide-react'

const CM_ID = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID as string

export default function MintCard() {
  const { connected, wallet } = useWallet()
  const [loading, setLoading] = useState(true)
  const [minting, setMinting] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [successSig, setSuccessSig] = useState<string | null>(null)
  const [itemsAvailable, setItemsAvailable] = useState<number>(0)
  const [itemsMinted, setItemsMinted] = useState<number>(0)

  const umi = useMemo(() => makeUmi(), [])

  useEffect(() => {
    (async () => {
      try {
        const cm = await fetchCandyMachine(umi, publicKey(CM_ID))
        setItemsAvailable(Number(cm.data.itemsAvailable))
        setItemsMinted(Number(cm.itemsRedeemed))
      } catch (e:any) {
        console.error(e)
        setErr(e?.message ?? 'Failed to load Candy Machine')
      } finally {
        setLoading(false)
      }
    })()
  }, [umi])

  const remaining = Math.max(itemsAvailable - itemsMinted, 0)

  const onMint = useCallback(async () => {
    if (!connected || !wallet) return
    setErr(null)
    setSuccessSig(null)
    setMinting(true)
    try {
      const umiWithWallet = withWallet(umi, wallet.adapter)
      const nftMint = generateSigner(umiWithWallet)
      const result = await mintV2(umiWithWallet, {
        candyMachine: publicKey(CM_ID),
        nftMint,
      }).sendAndConfirm(umiWithWallet, { confirm: { commitment: 'confirmed' } })
      setSuccessSig(result.signature)
    } catch (e:any) {
      console.error(e)
      setErr(e?.message ?? 'Mint failed')
    } finally {
      setMinting(false)
    }
  }, [connected, wallet, umi])

  return (
    <div className="w-full max-w-xl">
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-kuusou-pink/60 via-white/10 to-kuusou-sky/60 shadow-[0_0_60px_rgba(255,111,181,.18)]">
        <div className="rounded-2xl bg-kuusou-card/90 backdrop-blur px-6 py-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">KUUSOU Mint</h1>
              <p className="text-sm text-white/70 mt-1">Mint on Solana mainnet • Guards enforced on-chain</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-kuusou-pink/15 text-kuusou-pink font-semibold whitespace-nowrap">
              {loading ? 'Loading…' : `${remaining} left`}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5 text-xs">
            <div className="flex items-center gap-2 rounded-xl bg-black/20 px-3 py-2">
              <Coins className="w-4 h-4 opacity-80" />
              <span className="opacity-80">Mainnet</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-black/20 px-3 py-2">
              <Shield className="w-4 h-4 opacity-80" />
              <span className="opacity-80">Token Gate</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-black/20 px-3 py-2">
              <Timer className="w-4 h-4 opacity-80" />
              <span className="opacity-80">Live</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <WalletMultiButton className="!bg-kuusou-pink !text-black !rounded-xl !h-11 !font-bold hover:!opacity-90" />
            <button
              onClick={onMint}
              disabled={!connected, minting || loading || remaining === 0}
              className="flex-1 h-11 rounded-xl font-bold bg-kuusou-pink text-black disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition shadow-[0_10px_30px_rgba(255,111,181,.35)]"
            >
              {minting ? (
                <span className="inline-flex items-center gap-2 justify-center"><Loader2 className="animate-spin w-4 h-4"/> Minting…</span>
              ) : remaining === 0 ? 'Sold Out' : 'Mint Now'}
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {err && (
              <div className="text-sm text-red-300 bg-red-800/20 rounded-lg p-3">{err}</div>
            )}
            {successSig && (
              <div className="text-sm text-green-300 bg-green-800/20 rounded-lg p-3 inline-flex items-center gap-2">
                <CheckCircle className="w-4 h-4"/> Success! Tx: <a className="underline" target="_blank" rel="noreferrer" href={`https://solscan.io/tx/${successSig}`}>{successSig.slice(0,8)}…</a>
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-white/60 flex items-center justify-between">
            <div>Items: {itemsMinted}/{itemsAvailable}</div>
            <div>Network: {process.env.NEXT_PUBLIC_SOLANA_NETWORK}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
