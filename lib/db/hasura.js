export async function insertStats(token, stats) {
  const { favourited, userId, watched, videoId } = stats;
  const operationsDoc = `
  mutation insertStats(
    $userId: String!,
    $videoId: String!,
    $favourited: Int!,
    $watched: Boolean!
  ) {
    insert_stats_one(
      object: {
        favourited: $favourited, 
        userId: $userId, 
        videoId: $videoId, 
        watched: $watched
      }, 
      on_conflict: {
        constraint: stats_pkey, 
        where: {
          userId: {
            _eq: $userId
          }, 
          videoId: {
            _eq: $videoId
          }
        }
      }) {
        favourited
        userId
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "insertStats",
    {
      userId,
      videoId,
      favourited,
      watched,
    },
    token
  );

  return response;
}

export async function updateStats(token, stats) {
  const { favourited, userId, watched, videoId } = stats;
  const operationsDoc = `
    mutation updateStats(
      $userId: String!, 
      $videoId: String!, 
      $watched: Boolean!,
      $favourited: Int!
    ) {
      update_stats(
        _set: {
          watched: $watched,
          favourited: $favourited
        },
        where: {
          userId: {
            _eq: $userId
          }, 
          videoId: {
            _eq: $videoId
          }
        }) {
        returning {
          favourited
          id
          userId
          videoId
          watched
        }
      }
    }
  `;

  const response = await queryHasuraGQL(
    operationsDoc,
    "updateStats",
    {
      userId,
      videoId,
      favourited,
      watched,
    },
    token
  );

  return response;
}

export async function findVideoIdByUser(token, userId, videoId) {
  const operationsDoc = `
    query findVideoIdByUser($userId: String!, $videoId: String!) {
      stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
        id
        userId
        videoId
        watched
        favourited
      }
    }
  `;

  const response = await queryHasuraGQL(
    operationsDoc,
    "findVideoIdByUser",
    {
      userId,
      videoId,
    },
    token
  );

  return response?.data?.stats;
}

export async function isNewUser(token, issuer) {
  const operationsDoc = `
    query isNewUser($issuer: String!) {
      users(where: {issuer: {_eq: $issuer}}) {
        id
        issuer
        email
      }
    }
  `;

  const response = await queryHasuraGQL(
    operationsDoc,
    "isNewUser",
    {
      issuer,
    },
    token
  );

  return response?.data?.users?.length === 0;
}

export async function createNewUser(token, metadata) {
  const operationsDoc = `
    mutation createNewUser(
      $issuer: String!, 
      $email: String!, 
      $publicAddress: String!) {
        insert_users(objects: {
          email: $email, 
          issuer: $issuer, 
          publicAddress: 
          $publicAddress}) {
            returning {
              email
              id
              issuer
            }
          }
      }
  `;

  const { issuer, email, publicAddress } = metadata;
  const response = await queryHasuraGQL(
    operationsDoc,
    "createNewUser",
    {
      issuer,
      email,
      publicAddress,
    },
    token
  );

  return response;
}

async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}
