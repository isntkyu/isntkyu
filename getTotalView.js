import got from 'got'

const CONFIG = {
  ENDPOINTS: {
    V2: 'https://v2cdn.velog.io/graphql',
    V3: 'https://v3.velog.io/graphql'
  },
  QUERIES: {
    GET_POSTS: `
      query velogPosts($input: GetPostsInput!) {
        posts(input: $input) {
          id
          title
          short_description
          thumbnail
          user {
            id
            username
            profile {
              id
              thumbnail
              display_name
            }
          }
          url_slug
          released_at
          updated_at
          comments_count
          tags
          is_private
          likes
        }
      }
    `,
    GET_STATS: `
      query GetStats($post_id: ID!) {
        getStats(post_id: $post_id) {
          total
          count_by_day {
            count
            day
            __typename
          }
          __typename
        }
      }
    `
  }
};

const createClient = (endpoint, cookie) => got.extend({
  prefixUrl: endpoint,
  headers: {
    'Cookie': cookie
  }
});

const fetchUserPosts = async (username, cookie) => {
  const response = await got.post(CONFIG.ENDPOINTS.V3, {
    json: {
      query: CONFIG.QUERIES.GET_POSTS,
      variables: {
        input: {
          username,
          limit: 100,
          tag: ""
        }
      }
    }
  });

  return JSON.parse(response.body).data.posts;
};

const fetchPostStats = async (client, postId) => {
  const response = await client.post('', {
    json: {
      operationName: "GetStats",
      variables: {
        post_id: postId
      },
      query: CONFIG.QUERIES.GET_STATS
    }
  });

  return JSON.parse(response.body).data.getStats.total;
};

const calculateTotalViews = async (posts, client) => {
  const views = await Promise.all(
    posts.map(post => fetchPostStats(client, post.id))
  );

  return views.reduce((total, current) => total + current, 0);
};

export const getTotalView = async (cookie) => {
  try {
    const client = createClient(CONFIG.ENDPOINTS.V2, cookie);
    const posts = await fetchUserPosts('isntkyu', cookie);
    return await calculateTotalViews(posts, client);
  } catch (error) {
    console.error('조회수 집계 중 오류 발생:', error);
    throw error;
  }
};
