import cpCitySelector from './city_selector.vue';

const citySelector = {
  install (Vue) {
    Vue.component(cpCitySelector.name, cpCitySelector);
  }
};

if (typeof window !== undefined && window.Vue) {
  window.Vue.use(citySelector);
}

export default citySelector