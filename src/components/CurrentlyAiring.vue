<template>

 <h1 v-if="Object.keys(currentlyAiringAnimes).length > 0"> Currently Airing Anime</h1>

<section class="flex-column-container">
 <div id="component" class="currently-airing-container" v-for="(currentlyAiringAnime, index) in currentlyAiringAnimes" :key="index">
  
    <h2 class="black">{{ generateDayOfWeek(currentlyAiringAnime.media.nextAiringEpisode.airingAt) }}</h2>
    <div class="animation-container">
      <article class="current-anime">
        <a  target="_blank" :href="currentlyAiringAnime.media.siteUrl">
          <img :src=currentlyAiringAnime.media.coverImage.large alt="">
          <h3>{{ generateShortTitle(currentlyAiringAnime.media.title.romaji)}}</h3>
          <h4> {{ currentlyAiringAnime.progress }} / {{currentlyAiringAnime.media.episodes ? currentlyAiringAnime.media.episodes : "TBA"}}</h4>
         </a>
      </article>
    </div>

 </div>
</section>
 </template>

<script>


export default {
 name: 'CurrentlyAiring',


  props: {
      usersData: {
        type: Object
      },
        currentlyAiringAnimes: {
          type: Object
        },
            airingDays: {
              type: Array
            }
  },

methods: {

  generateDayOfWeek(timeStamp){
    
    var a = new Date(timeStamp*1000);
   
    var days = ['Airs Sundays','Airs Mondays','Airs Tuesdays','Airs Wednesdays','Airs Thursdays','Airs Fridays','Airs Saturdays'];
    var dayOfWeek = days[a.getDay()] 
   
    return dayOfWeek
    
  },

  generateShortTitle(title){
    const newTitle = title.slice(0, 35).concat("...")

    return newTitle
  },

    
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
    @media only screen and (min-width: 768px) {

    *{
      text-decoration: none;
    }
   
    h2,h3,h4,h5,h6{
      color: white;
      font-weight: bolder;
    }
      h1{
      margin-bottom: 50px;
      margin-top: 50px;
    }
    .currently-airing-container{
      display: flex;
      max-width: 400px;
      display: inline-block;
      margin: 0 10px;
    }

    .current-anime{
      display: flex;
      flex-direction: column;
      background: #dc3545;
      max-width: 350px;
      margin: 30px auto;
      border: 2px solid #dc3545;
    }
  
    .current-anime img{
      min-width: 350px;
      max-width: 350px;
      max-height: 400px;
    }
   .black{
      color: black;
    }

    .animation-container{
     transition: transform .2s; /* Animation */
    }
    .animation-container:hover{
     transform: scale(1.05); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
    }

   

  }

   @media only screen and (max-width: 767px) {
    *{
      text-decoration: none;
    }
    
       body, html{
          padding:0;
          margin:0;
       }
    
      h1{
        margin-top: 40px;
        margin-bottom: 20px;
        font-size: 18px;
      }

      h2,h3,h4,h5,h6{
        color: white;
        font-weight: bolder;
        margin: 0;
      }
       
      h2 {
        font-size: 4vw;
      }

      .flex-column-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      }
      .currently-airing-container{
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .currently-airing-container h2{
        margin-top: 30px;
        margin-bottom: 20px;
      }

      .current-anime{
        display: flex;
        flex-direction: column;
        background: #dc3545;
        max-width: 231px;
        margin: 0 auto;
        border: 2px solid #dc3545;
      }
      .current-anime h3, h4{
        font-size: 16px;
        margin: 5px 0;
      }
    
      .current-anime img{
        
      }
      .black{
          color: black;
          font-size: 18px;
        }

      .animation-container{
      transition: transform .2s; /* Animation */
      }
      .animation-container:hover{
      transform: scale(1.05); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
     }
    }
</style>
