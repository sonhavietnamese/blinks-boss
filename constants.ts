import { IDL } from '@/idls/boss'
import { Program } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { Boss } from './idls/boss'
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL as string
export const connection = new Connection('https://devnet.helius-rpc.com/?api-key=eadd6885-8c9c-4ccc-9063-43f1e7d6012d' as string, 'confirmed')

export const fontCache = new Map<string, ArrayBuffer>()

export enum Font {
  BACKBEAT = 'CCBackBeatRegular',
}

export enum Action {
  START = 'start',
  DEAL_DAMAGE = 'deal-damage',
  VERIFY = 'verify',
  STATS = 'stats',
}

export enum ActionType {
  POST = 'post',
  INLINE = 'inline',
  TRANSACTION = 'transaction',
  MESSAGE = 'message',
  EXTERNAL_LINK = 'external-link',
  ACTION = 'action',
}

export const FONT_MAP: Record<Font, string> = {
  [Font.BACKBEAT]: new URL('./assets/CCBackBeatRegular.ttf', import.meta.url).toString(),
}

export const CONFIG = {
  IMAGE_WIDTH: 800,
  IMAGE_HEIGHT: 800,
}

export const BOSS_PROGRAM_ID = new PublicKey(process.env.BOSS_PROGRAM_ID as string)
export const BOSS_PUBLIC_KEY = new PublicKey(process.env.BOSS_PUBLIC_KEY as string)

export const PROGRAM = new Program(IDL, BOSS_PROGRAM_ID, { connection: connection }) as Program<Boss>
export const BOSS_ID = process.env.BOSS_ID as string

export const SUPABASE_URL = process.env.SUPABASE_URL as string
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY as string
