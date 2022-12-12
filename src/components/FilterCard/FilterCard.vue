<template>
    <div :class="['filter', { 'is-active': isShow }]">
        <button class="filter__toggler" @click="toggleFilterShow">Фильтры</button>
        <form ref="filter" action="#" class="filter__form">
            <div class="filter__title">Фильтры</div>

            <button class="filter__close"
                    @click.prevent="toggleFilterShow">
                <img v-svg-inline
                     src="/assets/images/icons/close.svg"/>
            </button>

            <div v-if="qtyRooms && qtyRooms.length > 0"
                 class="filter__item filter__item_inline">
                <div v-for="(item, i) in qtyRooms"
                     class="filter__item-group"
                     :key="i">
                    <input type="checkbox"
                           :id="`room-${i}`"
                           :value="item"
                           v-model="checkedRoomsQty"
                           @change="changeRooms">
                    <label :for="`room-${i}`">{{ item }}к</label>
                </div>
            </div>

            <div class="filter__item filter__item_range">
                <label for="price-slider">Стомость квартиры, &#8381;</label>
                <div class="value">
                    <span>от <span class="color-black">{{ priceRange[0] | format }}</span></span>
                    <span>до <span class="color-black">{{ priceRange[1] | format }}</span></span>
                </div>
                <Slider id="price-slider"
                        :min="minPrice"
                        :max="maxPrice"
                        :step="10000"
                        :tooltips="false"
                        v-model="priceRange"
                        @change="changePrice" />
            </div>

            <div class="filter__item filter__item_range">
                <label for="square-slider">Площадь, м<sup><small>2</small></sup></label>
                <div class="value">
                    <span>от <span class="color-black">{{ squareRange[0] }}</span></span>
                    <span>до <span class="color-black">{{ squareRange[1] }}</span></span>
                </div>
                <Slider id="square-slider"
                        :min="minSquare"
                        :max="maxSquare"
                        :step="1"
                        :tooltips="false"
                        v-model="squareRange"
                        @change="changeSquare" />
            </div>

            <div class="filter__item">
                <button class="filter__reset"
                        @click.prevent="clearFilter">
                    Сбросить параметры
                </button>
            </div>
        </form>
        <div class="filter__overlay" @click="toggleFilterShow"></div>
    </div>
</template>

<script>
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import Slider from '@vueform/slider/dist/slider.vue2';

export default {
    name: 'FilterCard',

    components: {
        Slider,
    },

    props: {
        qtyRooms: Array,
        minPrice: Number,
        maxPrice: Number,
        minSquare: Number,
        maxSquare: Number,
    },

    filters: {
        format: (val) => `${val}`.replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '),
    },

    data() {
        return {
            isShow: false,
            checkedRoomsQty: [],
            priceRange: [this.minPrice, this.maxPrice],
            squareRange: [this.minSquare, this.maxSquare],
        };
    },

    created() {
        this.setFilter();
    },

    methods: {
        /**
         * Фиксируем изменение стоимости в фильтре
         */
        changePrice() {
            this.$router.push({
                query: {
                    ...this.$route.query,
                    minPrice: String(this.priceRange[0]),
                    maxPrice: String(this.priceRange[1]),
                },
            });
        },

        /**
         * Фиксируем изменение площади в фильтре
         */
        changeSquare() {
            this.$router.push({
                query: {
                    ...this.$route.query,
                    minSquare: String(this.squareRange[0]),
                    maxSquare: String(this.squareRange[1]),
                },
            });
        },

        /**
         * Фиксируем изменение комнатности в фильтре
         */
        changeRooms() {
            this.$router.push({
                query: {
                    ...this.$route.query,
                    rooms: this.checkedRoomsQty.length > 0 ? this.checkedRoomsQty.join(',') : undefined,
                },
            });
        },

        /**
         * Устнавливает значения для фильтра из гет-параметров
         */
        setFilter() {
            this.checkedRoomsQty = this.$route.query.rooms
                ? this.$route.query.rooms.split(',')
                : [];
            this.priceRange = [];
            this.priceRange[0] = this.$route.query.minPrice
                ? this.$route.query.minPrice
                : this.minPrice;
            this.priceRange[1] = this.$route.query.maxPrice
                ? this.$route.query.maxPrice
                : this.maxPrice;
            this.squareRange = [];
            this.squareRange[0] = this.$route.query.minSquare
                ? this.$route.query.minSquare
                : this.minSquare;
            this.squareRange[1] = this.$route.query.maxSquare
                ? this.$route.query.maxSquare
                : this.maxSquare;
        },

        /**
         * Сбрасывает все значения фильтра (очищает гет-параметры страницы)
         */
        clearFilter() {
            this.$router.replace({});

            this.setFilter();
        },

        /**
         * Показывает/скрывает фильтр на планшете/мобилке
         */
        toggleFilterShow() {
            this.isShow = !this.isShow;

            if (this.isShow) {
                disableBodyScroll(this.$refs.filter);

                return;
            }

            clearAllBodyScrollLocks();
        },
    },
};
</script>

<style src="@vueform/slider/themes/default.css"></style>
<style lang="scss" scoped>
@import "FilterCard";
</style>
