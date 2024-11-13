import { BOSS_PUBLIC_KEY, PROGRAM } from '@/constants'
import { formatDamage } from './format-damage'
import { generateCharacter } from './generate-character'

export const fetchBossData = async (myAddress: string) => {
  const boss = await PROGRAM.account.boss.fetch(BOSS_PUBLIC_KEY)
  const records = await PROGRAM.account.record.all([
    {
      memcmp: {
        offset: 8,
        bytes: BOSS_PUBLIC_KEY.toBase58(),
      },
    },
  ])

  const players = records
    .map((record) => ({
      address: record.account.address.toString(),
      damage: Number(record.account.damage),
    }))
    .sort((a, b) => b.damage - a.damage)
    .slice(0, 5)
    .map((player) => ({
      address: player.address === myAddress ? 'You' : player.address,
      damage: formatDamage(player.damage),
    }))

  const playerWithoutMe = players.filter((player) => player.address !== 'You')
  const leftPlayer = playerWithoutMe.length > 0 ? playerWithoutMe[0] : null
  const rightPlayer = playerWithoutMe.length > 1 ? playerWithoutMe[1] : null

  const leftCharacter = leftPlayer ? generateCharacter(leftPlayer.address) : null
  const rightCharacter = rightPlayer ? generateCharacter(rightPlayer.address) : null
  const myCharacter = generateCharacter(myAddress)

  const cleanup = {
    health: Number(boss.health),
    maxHealth: Number(boss.maxHealth),
    players,
    leftPlayer,
    rightPlayer,
    leftCharacter,
    rightCharacter,
    myCharacter,
  }

  return cleanup
}
