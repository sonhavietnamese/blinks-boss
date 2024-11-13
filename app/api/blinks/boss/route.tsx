/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Action, ActionType, BASE_URL, BOSS_ID, CONFIG, Font, SUPABASE_URL } from '@/constants'
import { supabase } from '@/libs/supabase'
import { createDealDamageTransaction } from '@/utils/create-deal-damage-tx'
import { fetchBossData } from '@/utils/fetch-boss-data'
import { formatWallet } from '@/utils/format-wallet'
import { loadFont } from '@/utils/load-font'
import { ActionGetResponse, createActionHeaders, createPostResponse } from '@solana/actions'
import { PublicKey } from '@solana/web3.js'
import satori from 'satori'

export const runtime = 'edge'

export async function GET() {
  const backbeat = await loadFont(Font.BACKBEAT)

  const svg = await satori(
    <div tw='flex flex-col w-full h-full items-center justify-center'>
      <img src={`${BASE_URL}/bg/bg.png`} width={CONFIG.IMAGE_WIDTH} height={CONFIG.IMAGE_HEIGHT} tw='w-full h-full absolute' />
      <img src={`${BASE_URL}/boss/compressed-minotos-00.png`} width={CONFIG.IMAGE_WIDTH} height={CONFIG.IMAGE_HEIGHT} tw='w-full h-full absolute' />
    </div>,
    {
      width: CONFIG.IMAGE_WIDTH,
      height: CONFIG.IMAGE_HEIGHT,
      fonts: [
        {
          name: 'Backbeat',
          data: backbeat,
        },
      ],
    },
  )

  const response: ActionGetResponse = {
    type: ActionType.ACTION,
    icon: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
    title: '[Testnet] Blinks Boss - Season 1',
    description: 'Gear up! Join the squad and take down Minitos for SOL rewards!',
    label: '',
    links: {
      actions: [
        {
          label: 'Start',
          href: `/api/blinks/boss?action=${Action.START}&type=${ActionType.POST}`,
          type: ActionType.POST,
        },
      ],
    },
  }

  return Response.json(response, {
    headers: createActionHeaders({
      chainId: 'devnet',
      actionVersion: '2.2.1',
    }),
  })
}

export const OPTIONS = GET

const actions = [
  {
    label: `⚔️ 100 DMG`,
    href: `/api/blinks/boss?action=${Action.DEAL_DAMAGE}&damage=100&type=${ActionType.TRANSACTION}`,
    type: ActionType.TRANSACTION,
  },
  {
    label: `⚔️ 1,000 DMG`,
    href: `/api/blinks/boss?action=${Action.DEAL_DAMAGE}&damage=1000&type=${ActionType.TRANSACTION}`,
    type: ActionType.TRANSACTION,
  },
  {
    label: `⚔️ 5,000 DMG`,
    href: `/api/blinks/boss?action=${Action.DEAL_DAMAGE}&damage=5000&type=${ActionType.TRANSACTION}`,
    type: ActionType.TRANSACTION,
  },
  // {
  //   label: `Stats`,
  //   href: `/api/blinks/boss?action=${Action.STATS}&type=${ActionType.EXTERNAL_LINK}`,
  //   type: ActionType.EXTERNAL_LINK,
  // },
]

export async function POST(req: Request) {
  const body = (await req.json()) as { account: string; signature: string }
  const { searchParams } = new URL(req.url)

  const sender = new PublicKey(body.account)
  const action = searchParams.get('action') as Action
  const damage = searchParams.get('damage') || 0
  const type = searchParams.get('type')

  let payload = {}

  if (action === Action.DEAL_DAMAGE && type === ActionType.TRANSACTION) {
    const tx = await createDealDamageTransaction(sender, Number(damage))

    payload = await createPostResponse({
      fields: {
        type: ActionType.TRANSACTION,
        transaction: tx,
        links: {
          next: {
            type: ActionType.POST,
            href: `/api/blinks/boss?action=${Action.VERIFY}&type=${ActionType.POST}`,
          },
        },
      },
    })

    return Response.json(payload, {
      headers: createActionHeaders({
        chainId: 'devnet',
        actionVersion: '2.2.1',
      }),
    })
  }

  const boss = await fetchBossData(sender.toString())

  const backbeat = await loadFont(Font.BACKBEAT)
  const randomBossImage = `${BASE_URL}/boss/compressed-minotos-0${Math.floor(Math.random() * 10)}.png`
  const svg = await satori(
    <div tw='flex flex-col w-full h-full items-center justify-center'>
      <img src={`${BASE_URL}/bg/bg.png`} width={CONFIG.IMAGE_WIDTH} height={CONFIG.IMAGE_HEIGHT} tw='w-full h-full absolute' />

      <div tw='absolute inset-0 w-full h-full flex flex-col items-center justify-center'>
        <img src={randomBossImage} width={CONFIG.IMAGE_WIDTH} height={CONFIG.IMAGE_HEIGHT} tw='w-full h-full absolute' />

        <div tw='absolute left-0 top-0 w-[328px] h-[30px] top-[70px] left-[244px] flex flex-col items-center justify-center'>
          <div tw='w-[300px] h-[24px] bg-[#544656]'></div>
          <div tw='h-[24px] bg-[#51AF6E] absolute origin-left left-3' style={{ width: 302 * (boss.health / boss.maxHealth) }}></div>
          <img src={`${BASE_URL}/ui/boss-hp-bar.png`} width={328} height={30} tw='w-full h-full absolute' />
          <span tw='text-[18px] font-backbeat text-white -top-[20px]'>
            {boss.health.toLocaleString()}/{boss.maxHealth.toLocaleString()}
          </span>
        </div>
      </div>

      {boss.leftPlayer && (
        <div tw='absolute inset-0 w-full h-full flex flex-col items-center justify-center'>
          <img
            src={`${BASE_URL}/left/compressed-${boss.leftCharacter}.png`}
            width={CONFIG.IMAGE_WIDTH}
            height={CONFIG.IMAGE_HEIGHT}
            tw='w-full h-full absolute'
          />

          <span tw='text-white absolute left-[80px] top-[490px] text-[28px] font-backbeat'>{formatWallet(boss.leftPlayer.address, 3, '..')}</span>
        </div>
      )}

      <div tw='absolute inset-0 w-full h-full flex flex-col top-10 items-center justify-center'>
        <img
          src={`${BASE_URL}/middle/compressed-${boss.myCharacter}.png`}
          width={CONFIG.IMAGE_WIDTH}
          height={CONFIG.IMAGE_HEIGHT}
          tw='w-full h-full absolute'
        />

        <span tw='text-white absolute left-[370px] top-[490px] text-[28px] font-backbeat'>You</span>
      </div>

      {boss.rightPlayer && (
        <div tw='absolute inset-0 w-full h-full flex flex-col items-center justify-center'>
          <img
            src={`${BASE_URL}/right/compressed-${boss.rightCharacter}.png`}
            width={CONFIG.IMAGE_WIDTH}
            height={CONFIG.IMAGE_HEIGHT}
            tw='w-full h-full absolute'
          />

          <span tw='text-white absolute right-[20px] top-[460px] text-[28px] font-backbeat'>{formatWallet(boss.rightPlayer.address, 3, '..')}</span>
        </div>
      )}

      <div tw='absolute top-0 left-0 w-[250px] h-[235px] flex flex-col items-center justify-center'>
        <img src={`${BASE_URL}/ui/rank-panel.png`} width={250} height={235} tw='w-full h-full' />

        <div tw='flex flex-col w-[250px] absolute gap-12 top-[75px] items-center pl-12 pr-9 justify-center z-[10]'>
          {boss.players.map((player, index) => (
            <div key={index} tw='flex items-center justify-between w-full mt-[3px]'>
              <span tw='text-white text-[20px] font-backbeat'>{player.address === 'You' ? 'You' : formatWallet(player.address, 3, '...')}</span>
              <span tw='text-white text-[19px] font-backbeat'>{player.damage}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    {
      width: CONFIG.IMAGE_WIDTH,
      height: CONFIG.IMAGE_HEIGHT,
      fonts: [
        {
          name: 'Backbeat',
          data: backbeat,
        },
      ],
    },
  )

  const postfix = Date.now().toString()

  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const { data, error } = await supabase.storage.from('thumbs').upload(`${BOSS_ID}-${sender}-${postfix}.svg`, blob, {
    cacheControl: '3600',
    upsert: false,
    contentType: 'image/svg+xml',
  })

  if (error) {
    return Response.json(
      { message: 'Failed to load image' },
      {
        headers: createActionHeaders({
          chainId: 'devnet',
          actionVersion: '2.2.1',
        }),
      },
    )
  }

  if (action === Action.START && type === ActionType.POST) {
    payload = {
      type: ActionType.POST,
      links: {
        next: {
          type: ActionType.INLINE,
          action: {
            description: 'Minitos is focking strong because of the aura of Mars. Send it to the Hell!',
            icon: `${SUPABASE_URL}/storage/v1/object/public/${data?.fullPath}`,
            label: '',
            title: '[Testnet] Blinks Boss - Season 1',
            type: ActionType.ACTION,
            links: {
              actions: actions,
            },
          },
        },
      },
    }
  }

  if (action === Action.VERIFY && type === ActionType.POST) {
    payload = {
      type: ActionType.ACTION,
      icon: `${SUPABASE_URL}/storage/v1/object/public/${data?.fullPath}`,
      title: '[Testnet] Blinks Boss - Season 1',
      description: '',
      label: '',
      links: {
        actions: actions,
      },
    }
  }

  if (action === Action.STATS && type === ActionType.EXTERNAL_LINK) {
    payload = {
      type: ActionType.EXTERNAL_LINK,
      externalLink: `https://www.anchor-lang.com/docs/tic-tac-toe`,
      links: {
        next: {
          type: ActionType.INLINE,
          action: {
            icon: `${SUPABASE_URL}/storage/v1/object/public/${data?.fullPath}`,
            title: '[Testnet] Blinks Boss',
            description: 'Minitos is focking strong because of the aura of Mars. Send it to the Hell!',
            label: '',
            links: {
              actions: actions,
            },
          },
        },
      },
    }
  }

  return Response.json(payload, {
    headers: createActionHeaders({
      chainId: 'devnet',
      actionVersion: '2.2.1',
    }),
  })
}
