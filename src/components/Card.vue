<template>
  <div class="card">
    <div class="card-img">
      <img :src="imagePath" :alt="name">
    </div>
    <div class="card-content">
      <div class="card-content_title">
        <a nohref>{{ name }}</a>
      </div>
      <div class="card-content_size">
        <span>
          {{ square }}
          <span class="desktop-hide"> м<sup><small>2</small></sup></span>
        </span>
      </div>
      <div class="card-content_floor">
        <span>
          {{ floor }}
          <span class="color-gray">из {{ totalFloors }}</span>
          <span class="desktop-hide color-gray"> этаж</span>
        </span>
      </div>
      <div class="card-content_price">
        <span>
          {{ price }}
          <span class="desktop-hide">&#8381;</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    image: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    room: {
      type: Number,
      default: null,
    },
    square: {
      type: Number,
      default: null,
    },
    floor: {
      type: Number,
      default: null,
    },
    price: {
      type: Number,
      default: null,
    },
    totalFloors: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      imagePath: '',
    };
  },
  created() {
    this.imagePath = this.image ? `/assets/images/${this.image}` : '/assets/images/nophoto.png';
  },
};
</script>
