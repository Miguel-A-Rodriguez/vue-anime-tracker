

<template>


<form action="post" v-on:submit.prevent="fetchMovieData">

    <input type="text" v-model="searchUser">
</form>



 </template>

<script>

let userStrings = "rockman239";


export default {
 name: 'SearchBar',



// props: {

//        finishedAiringAnimes: {
//          type: Object
//        }
// },

 data (){
    return {

      searchData: null,
      searchUser: null,
    }
  },

  methods: {
  

    fetchMovieData() {

    //   Attempt to change the query variable dynamically by changing it before the post reqeust is made
    //   let dynamicInput = this.searchUser
    //   userStrings = dynamicInput;

    

      this.console.log(userStrings)

      const url = 'https://graphql.anilist.co',
      
        options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },

          body: JSON.stringify({

            query: this.handleQueryUpdate(),

           
            
      })
      
      }

      fetch(url, options)
      .then(this.handleResponse)
      .then(this.handleData) 
      .catch(this.handleError)
    },
  
    
    handleQueryUpdate() {
        let dynamicInput = this.searchUser
        userStrings = dynamicInput;

        const userNames = `
            {
            MediaListCollection(userName: "${userStrings}", type: ANIME) {
            
            lists {
            entries {
                id
                progress
                media{
                episodes
                title {
                english
                romaji
                }
                coverImage {
                    medium
                    large
                    color
                }
                nextAiringEpisode{
                        airingAt
                        }
                siteUrl
                }
            }
            }
            user {
            name
            }

            }

            },
            `;
            return userNames
    },

     handleResponse(response) {
      return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
      });
    },

    handleData(data) {
      if (data.data.MediaListCollection.lists.length <= 0) return;
     


      const allAnimesArray = data.data.MediaListCollection.lists[0].entries;

      this.searchData = allAnimesArray;


      console.log(this.searchData)
      console.log({userStrings})
    },

     handleError(error) {
      alert(error.errors[0].message);
      console.error(error);
    }
  },

 mounted() {
   
  },

  computed: {
    console: () => console,
    window: () => window,
  },

  

}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
