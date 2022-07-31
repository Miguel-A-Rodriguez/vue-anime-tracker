<template>
  <div id="app">
     <pixel-spinner
        :animation-duration="2000"
        :pixel-size="3000"
        :color="'#ff1d5e'"
/>
  </div>
</template>

<script>
  // To use minified css and js files instead of .vue single file components:
  // import 'epic-spinners/dist/lib/epic-spinners.min.css'
  // import {AtomSpinner} from 'epic-spinners/dist/lib/epic-spinners.min.js'
  
  import {PixelSpinner} from 'epic-spinners'
  export default {
    components: {
      PixelSpinner
    }
  }
</script>