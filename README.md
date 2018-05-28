# cp_city_selector

> 车300 cp后台城市选择器组件

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

### How To Use

1. 通过script标签直接src引入

2. 模块化引入

```js
  import Vue from 'vue';
  import cpCitySelector from 'cp-city-selector';

  Vue.use(cpCitySelector);
```

### 属性

|参数|说明|类型|可选值|默认值|
|:-|:-|:-|:-|:-|
|isIncludeCity|当前添加城市限制类型是否为添加支持城市|Boolean|true/false|true|
|cityIds|初始化时默认选中的城市id列表|Array|-|[ ]|

### 事件

|事件名称|说明|回调参数|
|:-|:-|:-|
|city-change|当所选择的城市发生改变的时候触发|{isIncludeCity: 当前添加城市限制类型是否为添加支持城市, cityIds: 包含所有选中城市的id的数组列表}|
