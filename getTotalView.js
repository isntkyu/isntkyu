import got from 'got'

const endpoint = 'https://v2cdn.velog.io/graphql'

export const getTotalView = async (cookie) => {
  const client = got.extend({
    prefixUrl: endpoint,
    headers: {
      'Cookie': cookie
    }
  })

  const response = await client.post('', {
    json: {
      "operationName":"GetStats",
      "variables":{
        "post_id":"0c7e88fc-3dd6-4f73-976e-7d6120936788"
      },
      "query":"query GetStats($post_id: ID!) { getStats(post_id: $post_id) {\n    total\n    count_by_day {\n      count\n      day\n      __typename\n    }\n    __typename\n  }\n}\n"
    }
  })

  return JSON.parse(response.body)
}
