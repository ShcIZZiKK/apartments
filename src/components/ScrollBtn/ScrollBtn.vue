<template>
    <transition name="slide-fade">
        <button class="scroll-arrow"
                @click="scrollUp"
                v-if="showBtn" />
    </transition>
</template>

<script>
export default {
    name: 'ScrollBtn',

    data() {
        return {
            showBtn: false,
        };
    },

    methods: {
        /**
         * Прокручивает странице к началу
         */
        scrollUp() {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
        },

        /**
         * Отслеживает уровень прокрутки страницы, и сообщает когда нужно показывать кнопку скролла
         */
        handleScroll() {
            this.showBtn = window.scrollY > 50;
        },
    },

    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
};
</script>

<style lang="scss" scoped>
@import "ScrollBtn";
</style>
