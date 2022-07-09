<template>

  <!-- // <FinishedAiringVue v-bind:usersData="usersData"/>
  // : is shorthand for v-bind:
  // note: when looping over the data in your child component, rename it to v-for="(list, entry) in movieEntries"
  // also dont forget to add it to props in your child component like you have with props: ['usersData']
  // props: {
  //   usersData: {
  //      type: Object
  //   }
  //      movieEntries: {
  //        type: Object
   //     }
  // } -->

  <div class="header">
    <h3>Welcome {{userName}}</h3>
    Anime Schedule Tracker
    <SearchBarVue />
  </div>

  <CurrentlyAiringVue :currentlyAiringAnimes="currentlyAiringAnimes"  />

  
  <FinishedAiringVue :finishedAiringAnimes="finishedAiringAnimes" />
  
</template>

<script>
import FinishedAiringVue from './components/FinishedAiring.vue';
import CurrentlyAiringVue from './components/CurrentlyAiring.vue';
import SearchBarVue from './components/SearchBar.vue';

let variables = {
    users: "rockman239"
};

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
   SearchBarVue
  },

  data (){
    return {

      finishedAiringAnimes: null,
      currentlyAiringAnimes: null,
      userName: null
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
            variables: variables
           
            
      })
      }

      fetch(url, options)
      .then(this.handleResponse)
      .then(this.handleData) 
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


      const names = data.data.MediaListCollection.user.name;
      this.userName = names

    },

     handleError(error) {
      alert('Error, check console');
      console.error(error);
    }
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
    font-size: 5vw;
    background-color: #2b2d42;
    color: white;
    padding: 30px;
    margin-top: 0 !important;
    width: 100%;
  }
</style>
