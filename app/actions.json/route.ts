import { ACTIONS_CORS_HEADERS, ActionsJson } from '@solana/actions'

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: '/',
        apiPath: '/api/blinks/boss',
      },
      {
        pathPattern: '/blinks/boss',
        apiPath: '/api/blinks/boss',
      },
      {
        pathPattern: '/boss',
        apiPath: '/api/boss',
      },
    ],
  }

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  })
}
// ensures cors
export const OPTIONS = GET
