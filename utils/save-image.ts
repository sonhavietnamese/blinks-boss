'use server'

import { BOSS_ID } from '@/constants'
import fs from 'fs'
import path from 'path'

export async function saveBossImage(svg: string, sender: string, postfix: string) {
  const name = `public/thumbs/${BOSS_ID}-${sender}-${postfix}.svg`
  const filePath = path.join(process.cwd(), name)

  await fs.promises.writeFile(filePath, svg)

  return name
}
