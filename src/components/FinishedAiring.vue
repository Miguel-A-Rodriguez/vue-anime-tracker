

<template>


<h1 v-if="finishedAiringAnimes">FinishedAiring</h1>
 <div id="component" class="finished-airing-container" v-for="(finishedAiringAnime, index) in finishedAiringAnimes" :key="index">
  <div class="animation-container">
    <article class="finished-anime">
      <a  target="_blank" :href="finishedAiringAnime.media.siteUrl">
      <img :src=finishedAiringAnime.media.coverImage.large alt="">
      <h2>{{generateShortTitle(finishedAiringAnime.media.title.romaji) }}</h2>
      <h3> {{ finishedAiringAnime.progress}} / {{finishedAiringAnime.media.episodes}}</h3>
      </a>
    </article>
  </div>
 </div>
 </template>


<script>
export default {
 name: 'FinishedAiring',

  props: {
      usersData: {
        type: Object
      },
        finishedAiringAnimes: {
          type: Object
        }
  },

  methods: {

    generateShortTitle(title){
      const newTitle = title.slice(0, 23).concat("...")
      return newTitle
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
  @media only screen and (min-width: 768px) {
     *{
      text-decoration: none;
    }
    h1{
      margin-bottom: 50px;
    }
    h2,h3,h4.h5,h6{
      color: white;
      font-weight: bolder;
    }
  
    .finished-airing-container{
      display: flex;
      max-width: 400px;
      display: inline-block;
      margin: 0 10px;
    }
     /* .finished-airing-container:hover{
      opacity: 70%;
    } */

    .finished-anime{
      display: flex;
      flex-direction: column;
      background: #6c757d;
      max-width: 350px;
      margin: 30px auto;
      border: 2px solid grey;
    }
    .finished-anime img{
      min-width: 350px;
      max-width: 350px;
      max-height: 400px;
    }
        .animation-container{
     transition: transform .2s; /* Animation */
    }
    .animation-container:hover{
     transform: scale(1.05); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
    }
     h1{
            margin-bottom: 50px;
            font-size: 32px;
            font-weight: bolder;
            margin-top: 40px;
           
          }

  }

     @media only screen and (max-width: 767px) {
           *{
             text-decoration: none;
           }

          *,
          body, html{
              padding:0;
              margin:0;
          }

          h2,h3,h4.h5,h6{
            color: white;
            font-weight: bolder;
          }

          h1{
            margin-top: 40px;
            margin-bottom: 20px;
            font-size: 18px;
          }
            h2{
            font-size: 4vw;
          }
            h3{
            font-size: 3.5vw;
          }
            h4{
            font-size: 3vw;
          }
          .finished-airing-container{
            display: flex;
            justify-content: center;
          }
 

          .finished-anime{
            display: flex;
            flex-direction: column;
            background: #6c757d;
            max-width: 350px;
            margin: 30px auto;
            border: 2px solid grey;
          }
          .finished-anime h2, h3{
            font-size: 16px;
            margin: 5px 0;
          }
          .finished-anime img{
            
          }
          .animation-container{
          transition: transform .2s; /* Animation */
          }
          .animation-container:hover{
          transform: scale(1.05); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
          }
          p{
            margin-bottom: 50px;
            font-size: 6vw;
            font-weight: bolder;
            display: inline;
           
          }
     }
</style>
