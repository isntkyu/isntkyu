import got from 'got'

const endpoint = 'https://v2cdn.velog.io/graphql'
const newEndpoint = 'https://v3.velog.io'

export const getTotalView = async (cookie) => {
  // const newClient = got.extend({
  //   prefixUrl: newEndpoint,
  //   headers: {
  //     'Cookie': cookie
  //   }
  // })
  const oldClient = got.extend({
    prefixUrl: endpoint,
    headers: {
      'Cookie': cookie
    }
  })
  const userTags = await got.post(newEndpoint + '/graphql', {
    json: {
      "query": "\n    query velogPosts($input: GetPostsInput!) {\n  posts(input: $input) {\n    id\n    title\n    short_description\n    thumbnail\n    user {\n      id\n      username\n      profile {\n        id\n        thumbnail\n        display_name\n      }\n    }\n    url_slug\n    released_at\n    updated_at\n    comments_count\n    tags\n    is_private\n    likes\n  }\n}\n    ",
      "variables": {
        "input": {
          // "cursor": "c992d932-b313-4e87-9b1a-944fb423e3ce",
          "username": "isntkyu",
          "limit": 100,
          "tag": ""
        }
      }
    }
  })

  const posts = JSON.parse(userTags.body).data.posts
  let view = 0
  for (const post of posts) {
    const response = await oldClient.post('', {
      json: {
        "operationName":"GetStats",
        "variables":{
          "post_id": post.id
        },
        "query":"query GetStats($post_id: ID!) { getStats(post_id: $post_id) {\n    total\n    count_by_day {\n      count\n      day\n      __typename\n    }\n    __typename\n  }\n}\n"
      }
    })
    view += JSON.parse(response.body).data.getStats.total
  }



  return view
}
