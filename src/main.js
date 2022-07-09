
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { createApolloProvider } from '@vue/apollo-option';
import { createApp, h } from 'vue';
import App from './App.vue';

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  cache,
  uri: 'https://graphql.anilist.co/',
})

const apolloProvider = createApolloProvider({
    defaultClient: apolloClient,
  })

const app = createApp({
render: () => h(App),
})

app.use(apolloProvider)

app.mount('#app');


// const query = `
// {
//   MediaListCollection(userId: 847462, type: ANIME) {
  
// lists {
//   entries {
//     id
//     progress
//     media{
//     episodes
//     title {
//       english
//     }
//       coverImage {
//         medium
//         large
//         color
//       }
//       nextAiringEpisode{
// 			airingAt
// 			}
//       siteUrl
//     }
//   }
// }
// user {
//   name
// }

// }

// },
// `;


// // Define our query variables and values that will be used in the query request
// var variables = {
//     id: 847462
// };



// // Define the config we'll need for our Api request
// var url = 'https://graphql.anilist.co',
//     options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//         },
//         body: JSON.stringify({
//             query: query,
//             variables: variables
//         })
//     };

// // Make the HTTP Api request

//   fetch(url, options).then(handleResponse)
//                    .then(handleData)
//                    .catch(handleError);

//  function handleResponse(response) {
//     return response.json().then(function (json) {
//         return response.ok ? json : Promise.reject(json);
//     });
// }

//  function handleData(data) {
//     console.log(data);
// }

//  function handleError(error) {
//     alert('Error, check console');
//     console.error(error);
// }



// createApp(App).mount('#app')
