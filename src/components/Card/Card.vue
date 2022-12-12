<template>
    <div class="card">
        <div v-if="imagePath && name" class="card__image">
            <img :src="imagePath" :alt="name">
        </div>
        <div class="card__content">
            <div class="card__content-title">
                <a href="#" @click.prevent>{{ name }}</a>
            </div>
            <div class="card__content-size">
                <span>
                  {{ square }}
                  <span class="desktop-hide"> м<sup><small>2</small></sup></span>
                </span>
            </div>
            <div class="card__content-floor">
                <span>
                  {{ floor }}
                  <span class="color-gray">из {{ totalFloors }}</span>
                  <span class="desktop-hide color-gray"> этаж</span>
                </span>
            </div>
            <div class="card__content-price">
                <span>
                  {{ price | format }}
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
        image: String,
        name: String,
        square: Number,
        floor: Number,
        price: Number,
        totalFloors: Number,
    },

    filters: {
        format: (val) => `${val}`.replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '),
    },

    computed: {
        imagePath() {
            return this.image ? `/assets/images/${this.image}` : '/assets/images/nophoto.png';
        },
    },
};
</script>

<style lang="scss" scoped>
@import "Card";
</style>
