<template>
  <form action="#" class="filter">
    <div class="filter-item filter-item_inline" v-if="qtyRooms.length > 0">
      <div class="filter-item_group filter-item_checkbox" v-for="(item, i) in qtyRooms" :key="i">
        <input
          type="checkbox"
          :id="`room-${i}`"
          :value="item"
          v-model="checkedRoomsQty"
          @change="changeProps">
        <label :for="`room-${i}`">{{ item }}к</label>
      </div>
    </div>
    <div class="filter-item filter-item_range">
      <label for="price-slider">Стомость квартиры, &#8381;</label>
      <div class="value">
        <span>от <span class="color-black">{{ priceRange[0] }}</span></span>
        <span>до <span class="color-black">{{ priceRange[1] }}</span></span>
      </div>
      <Slider
        id="price-slider"
        :min="minPrice"
        :max="maxPrice"
        :step="10000"
        :tooltips="false"
        v-model="priceRange"
        @change="changePrice"
       />
    </div>
    <div class="filter-item filter-item_range">
      <label for="square-slider">Площадь, м<sup><small>2</small></sup></label>
      <div class="value">
        <span>от <span class="color-black">{{ squareRange[0] }}</span></span>
        <span>до <span class="color-black">{{ squareRange[1] }}</span></span>
      </div>
      <Slider
        id="square-slider"
        :min="minSquare"
        :max="maxSquare"
        :step="1"
        :tooltips="false"
        v-model="squareRange"
        @change="changeSquare"
       />
    </div>
    <div class="filter-item filter-item_btn">
      <button class="filter-reset" @click.prevent="clearFilter">Сбросить параметры</button>
    </div>
  </form>
</template>

<script>
import Slider from '@vueform/slider/dist/slider.vue2';

export default {
  name: 'FilterCard',
  components: {
    Slider,
  },
  props: {
    qtyRooms: {
      type: Array,
      default: () => [],
    },
    minPrice: {
      type: Number,
      default: null,
    },
    maxPrice: {
      type: Number,
      default: null,
    },
    minSquare: {
      type: Number,
      default: null,
    },
    maxSquare: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      checkedRoomsQty: [],
      priceRange: [this.minPrice, this.maxPrice],
      squareRange: [this.minSquare, this.maxSquare],
    };
  },
  created() {
    this.fillFilter();
  },
  methods: {
    changePrice() {
      this.$router.push({
        query: {
          ...this.$route.query,
          minprice: this.priceRange[0],
          maxprice: this.priceRange[1],
        },
      });
    },
    changeSquare() {
      this.$router.push({
        query: {
          ...this.$route.query,
          minsquare: this.squareRange[0],
          maxsquare: this.squareRange[1],
        },
      });
    },
    changeProps() {
      this.$router.push({
        query: {
          ...this.$route.query,
          rooms: this.checkedRoomsQty.length > 0 ? this.checkedRoomsQty.join(',') : undefined,
        },
      });
    },
    fillFilter() {
      this.checkedRoomsQty = this.$route.query.rooms ? this.$route.query.rooms.split(',') : [];
      this.priceRange[0] = this.$route.query.minprice ? this.$route.query.minprice : this.minPrice;
      this.priceRange[1] = this.$route.query.maxprice ? this.$route.query.maxprice : this.maxPrice;
      this.squareRange[0] = this.$route.query.minsquare
        ? this.$route.query.minsquare
        : this.minSquare;
      this.squareRange[1] = this.$route.query.maxsquare
        ? this.$route.query.maxsquare
        : this.maxSquare;
    },
    clearFilter() {
      this.$router.push({
        query: {
          ...this.$route.query,
          rooms: undefined,
          minprice: undefined,
          maxprice: undefined,
          minsquare: undefined,
          maxsquare: undefined,
        },
      });

      this.fillFilter();
    },
  },
};
</script>

<style src="@vueform/slider/themes/default.css"></style>
