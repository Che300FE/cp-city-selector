<template>
  <div id="app">
    <city-selector :city-ids="cityIds" @city-change="cityChange" :is-include-city="isIncludeCity"></city-selector>
  </div>
</template>

<script>

import citySelector from './components/city_selector.vue';

export default {
  name: 'app',
  components: {
    citySelector
  },
  data () {
    return {
      cityIds: [ "41", "69", "97", "125", "153", "180", "207", "233", "257", "279", "298", "315"],
      isIncludeCity: false,
    }
  },
  mounted() {
    setTimeout(() => {
      // this.cityIds = ["11", "125", "315", "233", "257", "41", "14", "128", "100"]
    }, 3000);
  },
  methods: {
    cityChange(newVal) {
       console.log('当前城市选择数据', newVal);
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  margin: 0;
  padding: 0;
}
</style>
