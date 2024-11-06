import { saveBossImage } from '@/utils/save-image'

export async function POST(req: Request) {
  const body = (await req.json()) as { image: string; sender: string; postfix: string }

  try {
    const name = await saveBossImage(body.image, body.sender, body.postfix)
    return Response.json({ success: true, name })
  } catch (error) {
    return Response.json({ success: false, error: error })
  }
}
