'use client'

import { createDefaultUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createSolanaRpc } from '@metaplex-foundation/umi-rpc-web3js'
import { createWalletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'

export function makeUmi() {
  const rpc = createSolanaRpc(process.env.NEXT_PUBLIC_RPC_HOST!)
  const umi = createDefaultUmi(rpc)
  return umi
}

export function withWallet(umi: ReturnType<typeof makeUmi>, wallet: any) {
  return umi.use(createWalletAdapterIdentity(wallet))
}
