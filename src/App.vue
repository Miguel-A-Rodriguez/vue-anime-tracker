

<template>


  <div class="header">
    <h3 v-if="queriedUserName">Welcome {{queriedUserName}} !</h3>
    <h4>Anime Schedule Tracker</h4>

    <h6>Enter a Username to look at the anime they are watching!</h6>
    <form action="post" v-on:submit.prevent="fetchInputtedUserAnimeData" :disabled="alreadySubmittedState">

      <input ref="searchInput" type="text" v-model="queriedUserState" @keyup="searchTimeOut" @keyup.enter="fetchInputtedUserAnimeData()" >
      <div v-if="userNamesState" >
        <div v-for="(userNamesStat, i) in userNamesState" :key="i">
           <input class="drop-down-box" type="text" 
            v-model="userNamesState[i]" v-on:click.prevent="handleInputValueChange(userNamesState[i])" @keyup.enter="fetchInputtedUserAnimeData()">
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

const animeInfoQuery = `
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
      queriedUserName: null,
      queriedUserState: null,
      searchedAnimeData: null,
      userNamesState: null,
      inputValueState: null,
      alreadySubmittedState: null
    }
  },

  methods: {
    fetchDefaultUserAnimes() {
      
      const url = 'https://graphql.anilist.co',
        options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: animeInfoQuery, 
            
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
      const allAnimesArray = data.data.MediaListCollection.lists[0].entries;     

      // checks if the "nextAiringEpisode" is null and then populates the array with those animes i.e only returns animes that have finished airing
      const doneAiringAnime = allAnimesArray.filter(item => Boolean(!item.media.nextAiringEpisode));
      this.finishedAiringAnimes = doneAiringAnime;

       // checks if the "nextAiringEpisode" is true and then populates the array with those animes i.e only returns animes that are currently airing
      const currentlyAiringAnime = allAnimesArray.filter(item => Boolean(item.media.nextAiringEpisode));
      this.currentlyAiringAnimes = currentlyAiringAnime;


      const dataBaseNames = data.data.MediaListCollection.user.name;
      this.queriedUserName = dataBaseNames

    },

    changeinitialLoadingState(){
      return this.initialLoadingState = false;
    },

     handleError(error) {
      alert('Error, check console');
      console.error(error);
    },


   // Fetch the dynamic user data in the input tag
     fetchInputtedUserAnimeData() {

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
      
      if (this.alreadySubmittedState === true) return
       this.alreadySubmittedState = true;
      fetch(url, options)
      .then(this.handleUserResponse)
      .then(this.handleUserData) 
      .then(this.showAnimeAfterApiCall)
      .then(this.setSubmittedStateTrue)
      .then(this.setSubmittedStateFalse)
      
      .catch(this.handleUserError)
    },
    
    handleQueryUpdate() {
        let dynamicInput = this.queriedUserState
        userStrings = dynamicInput;

        const dynamicUsersAnimeQuery = `
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

            return dynamicUsersAnimeQuery

    },

    setSubmittedStateFalse(){
      this.alreadySubmittedState = null;
    },
    setSubmittedStateTrue(){
      this.alreadySubmittedState = true;
    },

     handleUserResponse(response) {
      this.searchLoadingState = false;
      console.log("Im querying")
      return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
      });
    },

    handleUserData(data) {
      if (data.data.MediaListCollection.lists.length <= 0) return alert("This user has no anime please try another user");

      this.userNamesState = null;
      this.queriedUserState = null;
      this.alreadySubmittedState = true;

      const allAnimesArray = data.data.MediaListCollection.lists[0].entries;

      this.searchedAnimeData = allAnimesArray;

      
     // checks if the "nextAiringEpisode" is null and then populates the array with those animes i.e only returns animes that have finished airing
      const doneAiringAnime = allAnimesArray.filter(item => Boolean(!item.media.nextAiringEpisode));
      this.finishedAiringAnimes = doneAiringAnime;
      
 
    // checks if the "nextAiringEpisode" is true and then populates the array with those animes i.e only returns animes that are currently airing
      const currentlyAiringAnime = allAnimesArray.filter(item => Boolean(item.media.nextAiringEpisode));
      this.currentlyAiringAnimes = currentlyAiringAnime;
      
      const searchedUserNamesFromDatabase = data.data.MediaListCollection.user.name;
      
      this.queriedUserName = searchedUserNamesFromDatabase
      
    },

   

      showAnimeAfterApiCall(){
        this.searchLoadingState = true;
        
      },


      handleUserError(error) {
        alert(error.errors[0].message);
        console.error(error);
      },


     fetchUserNames() {

      const variables = {
          search: this.queriedUserState,
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
        return response.ok ? json : Promise.reject(json);
      });
    },

    handleUserNamesData(data){
      let userNameData = data.data.Page.users;
      
      let nameArray = userNameData.map(({name})=>{ 

        return name

      });

      this.userNamesState = nameArray

    },

    handleUserNamesQueryUpdate() {
          // Query to get every username matching the search input
          // Must create a function that forces a popup menu that contains the mapped usernames from this specific query (debounce method*)
          const userNamesSearchQuery = `
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

            return userNamesSearchQuery

    },

    handleInputValueChange(clickedSuggestedUserName) {
      this.inputValueState = clickedSuggestedUserName;
      this.queriedUserState = this.inputValueState;
      if(this.inputValueState != null) this.userNamesState = false;
      this.fetchInputtedUserAnimeData();
    },

    searchTimeOut() {  
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.timer = setTimeout(() => {
           if (this.queriedUserState.length <= 1) return this.userNamesState = false;
          this.fetchUserNames();
           
        }, 700);
    },
  },


  mounted() {
    this.fetchDefaultUserAnimes();
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
body{
  margin: 0;
}
</style>

<style scoped>
@media only screen and (min-width: 768px) {
   .header{
    text-align: left;
    font-size: 32px;
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
}

 @media only screen and (max-width: 767px) {

     body, html{
              padding:0;
              margin:0;
     }

     .header{
      text-align: left;
      background-color: #2b2d42;
      color: white;
      padding: 3vw;
      margin-top: 0 !important;
      width: 100%;
    }
    .header h3 {
      font-size: 6vw;
      margin: 0;
      margin-top: 10px;
    }
    .header h4 {
      font-size: 5vw;
      margin: 0;
      margin-top: 10px;
    }
    .header h6{
      font-size: 3.5vw;
      word-break: break-all;
      width: 37ch;
      margin: 0;
      margin-top: 10px;
      margin-bottom: 10px;
    }

    /* search input  */
    form{
      height: auto;
      max-height: 100px;
    }
    input {
      max-width: 80%;
      min-width: 80%;
      min-height: 10px;
      font-size: 12px;
    }
    .drop-down-box{
      position: relative;
      z-index: 999;
    }
   }
 
</style>
