<template>
  <transition name="slide-fade">
    <button
      class="scroll-arrow"
      @click="scrollUp"
      v-if="showBtn"
      >
    </button>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      showBtn: false,
    };
  },
  methods: {
    scrollUp() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    },
    handleScroll() {
      this.showBtn = window.scrollY > 50;
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
};
</script>

<style lang="css">
  .scroll-arrow {
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 40px;
    height: 40px;
    background-color: #95D0A1;
    border-radius: 100px;
    background-image: url('/assets/images/icons/arrow-up.svg');
    background-repeat: no-repeat;
    background-size: 12px 16px;
    background-position: center;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0;
  }
</style>
