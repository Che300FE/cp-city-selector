<template>
  <div class="cp-city-selector__wrapper">
    <div class="city-support-radio">
      <el-radio-group v-model="includeCity" @change="cludeTypeChange">
        <el-radio v-if="canSelectInclude" :label="true" :disabled="includeRadioDisabled">添加支持城市</el-radio>
        <el-radio v-if="canSelectExclude" :label="false" :disabled="excludeRadioDisabled">添加不支持城市</el-radio>
      </el-radio-group>
    </div>
    <ul class="city-list">
      <li class="city-item" v-for="(cityItem, $index) in currentCludeCities" :key="$index">
        <el-select 
          v-model="cityItem.provinceId" 
          placeholder="请选择省份"
          size="mini"
          @change="selectProvince($event, cityItem)"
          @visible-change="provinceVisibleChange($event, cityItem)">
          <el-option
            v-for="province in cityItem.provinceList"
            :key="province.prov_id"
            :label="province.prov_name"
            :value="province.prov_id">
          </el-option>
        </el-select>
        <el-select 
          v-model="cityItem.selectedCityIds"
          v-show="cityItem.cityList.length"
          class="city-select"
          size="mini"
          multiple
          placeholder="请选择城市"
          @change="citySelectChange($event, cityItem)">
          <el-option
            v-for="city in cityItem.cityList"
            :key="city.city_id"
            :label="city.city_name"
            :value="city.city_id">
          </el-option>
        </el-select>
        <i class="el-icon-circle-close-outline" @click="deleteCityItem($index)"></i>
      </li>
    </ul>
    <el-button size="mini" @click="add" class="add-btn">{{ btnText }}</el-button>
  </div>
</template>

<script>
// 导入省与市的数据
import regionMap from '../assets/json/constants.json';

export default {
  name: 'cpCitySelector',
  props: {
    isIncludeCity: {
      type: Boolean,
      default: true
    },
    cityIds: {
      type: Array,
      default: () => []
    },
    // radio是否显示`添加支持城市`选项
    canSelectInclude: {
      type: Boolean,
      default: true
    },
    // radio是否显示`添加不支持城市`选项
    canSelectExclude: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      provinceMap: regionMap.provinces,
      cityMap: regionMap.city,
      includeCity: true,
      // 支持的城市列表
      includeCities: [],
      // 不支持的城市列表
      excludeCities: [],
      currentCludeCities: null,
      // 根据省份的id查询该省份下所有城市的列表的缓存对象
      provIdFindCityListMap: {},
    }
  },
  computed: {
    btnText() {
      return this.includeCity ? '添加支持城市' : '添加不支持城市';
    },
    // 城市支持类型切换是否可以切换到支持城市
    includeRadioDisabled() {
      return this.excludeCities.length !== 0;
    },
    // 是否可以切换到不支持城市
    excludeRadioDisabled() {
      return this.includeCities.length !== 0;
    }
  },
  watch: {
    isIncludeCity() {
      this.init();
    },
    cityIds() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init () {
      this.includeCities = [];
      this.excludeCities = [];
      this.currentCludeCities = this.isIncludeCity ? this.includeCities : this.excludeCities;
      this.includeCity = this.isIncludeCity;
      this.cityIds.length && this.initCitiesByCityIds(this.cityIds);
    },
    // 支持与不支持城市列表类型发生改变
    cludeTypeChange(includeCity) {
      this.currentCludeCities = includeCity ? this.includeCities : this.excludeCities;
      this.emitCityChange();
    },

    // 根据省份的id查询到当前可以进行选择的省份列表
    // 去掉已经选择过的省份
    filterProvinceList(provId) {
      var selectedProvinceIds = this.currentCludeCities.map(curCludeCity => {
        return curCludeCity.provinceId;
      });
      var curIndex = selectedProvinceIds.indexOf(provId);

      curIndex > -1 && selectedProvinceIds.splice(curIndex, 1);
      return this.provinceMap.filter(province => {
        return selectedProvinceIds.indexOf(province.prov_id) === -1;
      });
    },

    // 根据省份的id查询到这个省包含的所有市的列表数据
    filterCityListByProvId(provId) {
      // 如果在内存缓存中已经存在了该省份id对应的城市列表数据
      // 直接使用该城市列表
      if (this.provIdFindCityListMap[provId]) {
        return this.provIdFindCityListMap[provId];
      }

      var cityList = this.cityMap.filter(city => {
        return city.prov_id === provId;
      });

      // 添加`全部`可选项
      cityList.unshift({
        city_id: "#",
        city_name: "全部",
        prov_id: provId,      
      });

      this.provIdFindCityListMap[provId] = cityList;
      return cityList;
    },

    // 根据省份的Id查询到省份数据
    findProvinceById(provId) {
      return this.provinceMap.find(province => {
        return province.prov_id === provId;
      });
    },

    // 根据城市Id查询到城市数据
    findCityById(cityId) {
      return this.cityMap.find(city => {
        return city.city_id === cityId;
      })
    },

    // 根据省份的id查找当前选择模式中 被选中的城市项
    findCludeCityByProvId(provId) {
      return this.currentCludeCities.find(currentCludeCity => {
        return currentCludeCity.provinceId === provId;
      })
    },

    // 判断一个省下面所有的市是否都被选中了
    predicateAllCitiesSelected(cityItem) {
      // 所有城市id列表
      var cityIds = cityItem.cityList.map(city => {
        return city.city_id;
      });
      var selectedIdsLength = cityItem.selectedCityIds.length;
      // cityIds需要去掉全部的id `#`去判断
      if (selectedIdsLength === (cityIds.length - 1)) {
        for (var i = 0; i < selectedIdsLength; i++) {
          if (cityIds.indexOf(cityItem.selectedCityIds[i]) === -1 ) {
            return false;
          }
        }
        return true;
      }
      return false;
    },
    
    // 根据所有城市的Id来初始化被选择城市列表数据
    initCitiesByCityIds(cityIds) {
      cityIds.forEach(cityId => {
        var city = this.findCityById(cityId);
        var provId = city.prov_id;
        // 当前城市所在城市项
        var currentCludeCity = this.findCludeCityByProvId(provId);

        // 当前的省份还没有初始化过
        if (currentCludeCity == null) {
          var cityList = this.filterCityListByProvId(provId);

          this.currentCludeCities.push({
            provinceId: provId,
            provinceName: city.prov_name,
            cityList: cityList,
            selectedCityIds: [cityId]
          });
        }
        else {
          currentCludeCity.selectedCityIds.push(cityId);
        }
      });

      this.currentCludeCities.forEach(curCludeCity => {
        this.$set(curCludeCity, 'provinceList', this.filterProvinceList(curCludeCity.provinceId));
        // 如果是已经选择了全省所有市
        if (this.predicateAllCitiesSelected(curCludeCity)) {
          curCludeCity.selectedCityIds = ['#'];
        }
      });
    },

    // 获取当前被选中的城市类型与列表数据
    getCurSelectedData() {
      var cityIds = this.currentCludeCities.reduce((total, cityItem) => {
        // 当前遍历到的省份的城市选择了`全部选项`
        if (cityItem.selectedCityIds.length === 1 && cityItem.selectedCityIds[0] === '#') {
          // 实际上被选中的是该省份下面所有城市的id
          var realSelectedCityIds = cityItem.cityList.filter(city => {
            return city.city_id !== '#';
          }).map(city => {
            return city.city_id;
          });
          return total.concat(realSelectedCityIds);
        }
        else {
          return total.concat(cityItem.selectedCityIds);
        }
      }, []);
      
      return {
        isIncludeCity: this.includeCity,
        cityIds: cityIds
      }
    },

    // 告诉外部组件 内部城市选择发生了改变
    emitCityChange() {
      var selectedData = this.getCurSelectedData();
      this.$emit('city-change', selectedData);
    },

    // 省份选择下拉显示状态发生改变
    provinceVisibleChange(isShow, cityItem) {
      if (isShow) {
        cityItem.provinceList = this.filterProvinceList(cityItem.provinceId);
      }
    },
    
    // 新增一个支持城市或者不支持城市
    add() {
      this.currentCludeCities.push({
        provinceId: '',
        provinceName: '',
        provinceList: this.filterProvinceList(),
        cityList: [],
        selectedCityIds: [],
      })
    },

    // 删除一个城市单项
    deleteCityItem(index) {
      this.currentCludeCities.splice(index, 1);
      this.emitCityChange();
    },

    // 选择了一个省份
    selectProvince(provinceId, cityItem) {
      var province = this.findProvinceById(provinceId);
      // 先清空可选城市列表以及改省份下已经选择的城市数据
      cityItem.cityList = [];
      cityItem.selectedCityIds = [];

      cityItem.provinceId = provinceId;
      cityItem.provinceName = province.prov_name;
      cityItem.cityList = this.filterCityListByProvId(provinceId);
      this.emitCityChange();
    },

    // 城市选择发生改变
    citySelectChange(selectedIds, cityItem) {
      // 选择项中包含了`全部`选项
      if(selectedIds.indexOf('#') > -1) {
        // 选中的城市只有全部
        cityItem.selectedCityIds = ['#'];
      }

      // 如果此时选择了一个城市之后 选择了全部的城市 默认将选择的城市改为`全部`
      if (this.predicateAllCitiesSelected(cityItem)) {
        cityItem.selectedCityIds = ['#'];
      }

      this.emitCityChange();
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-city-selector__wrapper{
  .city-support-radio{
    margin-bottom: 20px;
  }

  .city-item{
    margin-bottom: 10px;
  }

  .city-select{
    margin-left: 10px;
  }

  .el-icon-circle-close-outline{
    position: relative;
    z-index: 1;
    top: 2px;
    margin-left: 10px;
    font-size: 18px;
    color: #606266;
    cursor: pointer;
  }
}
</style>
