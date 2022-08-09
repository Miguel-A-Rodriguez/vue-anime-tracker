

<template>


  <div class="header">
    <h3 v-if="userName">Welcome {{userName}} !</h3>
    Anime Schedule Tracker

    <h6>Enter a Username to look at the anime they are watching!</h6>
    <form action="post" v-on:submit.prevent="fetchUserData">

      <input ref="searchInput" type="text" v-model="searchUser" @keyup="searchTimeOut" @keyup.enter="fetchUserData()">
      <div v-if="userNamesStates" >
        <div v-for="(userNamesState, i) in userNamesStates" :key="i">
           <input class="drop-down-box" type="text"  v-model="userNamesStates[i]" v-on:click.prevent="handleInputValueChange(userNamesStates[i])" @keyup.enter="fetchUserData()">
        </div>
      </div>
    </form>

  </div>

  <div v-if="initialLoadingState">
    <EpicSpinnersVue />
  </div>
  
  <div v-if="searchLoadingState">
    <CurrentlyAiringVue :currentlyAiringAnimes="currentlyAiringAnimes"  />
  </div>

  <div v-if="searchLoadingState">
    <FinishedAiringVue :finishedAiringAnimes="finishedAiringAnimes" />
  </div>

   <div v-if="!searchLoadingState">
      <EpicSpinnersVue />
   </div>
  
</template>

<script>
import FinishedAiringVue from './components/FinishedAiring.vue';
import CurrentlyAiringVue from './components/CurrentlyAiring.vue';
import EpicSpinnersVue from './components/EpicSpinners.vue';

let userStrings = "rockman239"

const query = `
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



export default {
  name: 'App',
  components: {
   FinishedAiringVue,
   CurrentlyAiringVue,
   EpicSpinnersVue
  },

  data (){
    return {
      initialLoadingState: true,
      searchLoadingState: true,
      finishedAiringAnimes: null,
      currentlyAiringAnimes: { },
      userName: null,
      searchUser: null,
      searchData: null,
      userNamesStates: null,
      inputValueState: null
    }
  },

  methods: {
    fetchMovieData() {
      
      const url = 'https://graphql.anilist.co',
        options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: query, 
            
      })
      }

      fetch(url, options)
      .then(this.handleResponse)
      .then(this.handleData)
      .then(this.changeinitialLoadingState) 
      .catch(this.handleError)
    },
  

    handleResponse(response) {
       
      return response.json().then(function (json) {
        
        return response.ok ? json : Promise.reject(json);
      });
    },

    handleData(data) {
  

      console.log(data)
      const allAnimesArray = data.data.MediaListCollection.lists[0].entries;     

      // checks if the "nextAiringEpisode" is null and then populates the array with those animes i.e only returns animes that have finished airing
      const doneAiringAnime = allAnimesArray.filter(item => Boolean(!item.media.nextAiringEpisode));
      this.finishedAiringAnimes = doneAiringAnime;

       // checks if the "nextAiringEpisode" is true and then populates the array with those animes i.e only returns animes that are currently airing
      const currentlyAiringAnime = allAnimesArray.filter(item => Boolean(item.media.nextAiringEpisode));
      this.currentlyAiringAnimes = currentlyAiringAnime;


      const dataBaseNames = data.data.MediaListCollection.user.name;
      console.log(dataBaseNames);
      this.userName = dataBaseNames

    },

    changeinitialLoadingState(){
      return this.initialLoadingState = false;
    },

     handleError(error) {
      alert('Error, check console');
      console.error(error);
    },


   // Fetch the dynamic user data in the input tag
     fetchUserData() {

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
      .then(this.handleUserResponse)
      .then(this.handleUserData) 
      .then(this.showAnimeAfterApiCall)
      .catch(this.handleUserError)
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

    

     handleUserResponse(response) {
      this.searchLoadingState = false;
      console.log(this.searchLoadingState)
      
      return response.json().then(function (json) {
        console.log(json)
        return response.ok ? json : Promise.reject(json);
      });
    },

    handleUserData(data) {
      console.log(this.searchUser.length);
      if (data.data.MediaListCollection.lists.length <= 0) return alert("This user has no anime please try another user");

      this.userNamesStates = null;
      this.searchUser = null;

      const allAnimesArray = data.data.MediaListCollection.lists[0].entries;

      this.searchData = allAnimesArray;

      
     // checks if the "nextAiringEpisode" is null and then populates the array with those animes i.e only returns animes that have finished airing
      const doneAiringAnime = allAnimesArray.filter(item => Boolean(!item.media.nextAiringEpisode));
      this.finishedAiringAnimes = doneAiringAnime;
      
 
    // checks if the "nextAiringEpisode" is true and then populates the array with those animes i.e only returns animes that are currently airing
      const currentlyAiringAnime = allAnimesArray.filter(item => Boolean(item.media.nextAiringEpisode));
      this.currentlyAiringAnimes = currentlyAiringAnime;
      
      const names = data.data.MediaListCollection.user.name;
      
      this.userName = names

      

      console.log(this.searchData)
      console.log({userStrings})

      // Remove drop down input fields and clear the input field
      
    },

   

    showAnimeAfterApiCall(){
      this.searchLoadingState = true;
      console.log(this.searchLoadingState)
    },

    handleUserError(error) {
      alert(error.errors[0].message);
      console.error(error);
    },


     fetchUserNames() {

      var variables = {
          search: this.searchUser,
          page: 1,
          perPage: 5
      };
      const url = 'https://graphql.anilist.co',
      
        options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },

          body: JSON.stringify({

            query: this.handleUserNamesQueryUpdate(),
            variables: variables
            
      })
      
      }

      fetch(url, options)
      .then(this.handleUserNamesResponse)
      .then(this.handleUserNamesData) 
      .catch(this.handleUserError)
    },

    handleUserNamesResponse(response) {
      
      return response.json().then(function (json) {
        console.log(json)
        return response.ok ? json : Promise.reject(json);
      });
    },

    handleUserNamesData(data){
      let userNameData = data.data.Page.users;
      
      let nameArray = userNameData.map(({name})=>{ 

        return name

      });
      // this.userNamesStates = userNameData;
      this.userNamesStates = nameArray

    },

    handleUserNamesQueryUpdate() {
          // Query to get every username matching the search input
          // Must create a function that forces a popup menu that contains the mapped usernames from this specific query (debounce method*)
          const userNames = `
           query ( $page: Int, $perPage: Int, $search: String) {
            Page (page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }


                 users(search: $search ) {
                  name
                } 
            }
          }
            `;

            return userNames

    },

    handleInputValueChange(userName) {
      this.inputValueState = userName;
      this.searchUser = this.inputValueState;
      if(this.inputValueState != null) this.userNamesStates = false;
      this.fetchUserData();
    },

    searchTimeOut() {  
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.timer = setTimeout(() => {
           if (this.searchUser.length <= 1) return this.userNamesStates = false;
          this.fetchUserNames();
           console.log("hi");
        }, 1000);
    },




  },


  mounted() {
    this.fetchMovieData();
  }


}




</script>
<style>
 #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      /* margin-top: 60px; */
}
</style>

<style scoped>
  .header{
    text-align: left;
    font-size: 3vw;
    background-color: #2b2d42;
    color: white;
    padding: 30px;
    margin-top: 0 !important;
    width: 100%;
  }
  h6{
    margin-top: 20px;
    margin-bottom: 10px;
  }

  /* search input  */
  form{
    height: auto;
    max-height: 100px;
    padding-bottom: 20px;
  }
  input {
    width: 100%;
    max-width: 700px;
    min-height: 50px;
    font-size: 24px;
  }
  .drop-down-box{
    position: relative;
    z-index: 999;
  }
</style>
