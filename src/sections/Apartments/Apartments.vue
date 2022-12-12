<template>
    <div class="container apartments">
        <h1>Квартиры</h1>
        <div class="apartments__wrapper">
            <Loader v-if="preload" />
            <template v-else>
                <div class="apartments__content">
                    <template v-if="cards && cards.length">
                        <div class="apartments__navigation">
                            <div class="apartments__navigation-item">
                                <span>Планировка</span>
                            </div>
                            <div class="apartments__navigation-item">
                                <span>Квартира</span>
                            </div>
                            <div class="apartments__navigation-item">
                                <button @click="changeSort('square',
                                query.sort === 'asc' ? 'desc' : 'asc')"
                                        :class="[
                                                { 'active': query.by === 'square' },
                                                query.sort === 'asc' ? 'asc' : 'desc'
                                                ]">
                                    <span>S, м<sup><small>2</small></sup></span>
                                    <img v-svg-inline
                                         class="icon up"
                                         src="/assets/images/icons/arrow-small.svg"/>
                                    <img v-svg-inline
                                         class="icon down"
                                         src="/assets/images/icons/arrow-small.svg"/>
                                </button>
                            </div>
                            <div class="apartments__navigation-item">
                                <button @click="changeSort('floor',
                                query.sort === 'asc' ? 'desc' : 'asc')"
                                        :class="[
                                            { 'active': query.by === 'floor' },
                                            query.sort === 'asc' ? 'asc' : 'desc'
                                            ]">
                                    <span>Этаж</span>
                                    <img v-svg-inline
                                         class="icon up"
                                         src="/assets/images/icons/arrow-small.svg"/>
                                    <img v-svg-inline
                                         class="icon down"
                                         src="/assets/images/icons/arrow-small.svg"/>
                                </button>
                            </div>
                            <div class="apartments__navigation-item">
                                <button @click="changeSort('price',
                                query.sort === 'asc' ? 'desc' : 'asc')"
                                        :class="[
                                                { 'active': query.by === 'price' },
                                                query.sort === 'asc' ? 'asc' : 'desc'
                                                ]">
                                    <span>Цена, &#8381;</span>
                                    <img v-svg-inline
                                         class="icon up"
                                         src="/assets/images/icons/arrow-small.svg"/>
                                    <img v-svg-inline
                                         class="icon down"
                                         src="/assets/images/icons/arrow-small.svg"/>
                                </button>
                            </div>
                        </div>
                        <div class="apartments__list">
                            <Card v-for="item in cards"
                                  :image="item.image"
                                  :name="item.name"
                                  :square="item.square"
                                  :floor="item.floor"
                                  :price="item.price"
                                  :totalFloors="totalFloors"
                                  :key="item.id"/>
                        </div>
                        <button class="apartments__more"
                                @click="showMore"
                                v-if="query.limit < qtyCards && query.limit <= cards.length">
                            Загрузить ещё
                        </button>
                    </template>
                    <div v-else
                         class="apartments__empty">
                        По вашему запросу ничего не найдено!<br/>
                        Измените параметры фильтров.
                    </div>
                </div>
                <aside class="apartments__filter">
                    <FilterCard v-if="filter !== null"
                                :qtyRooms="filter.qtyRooms"
                                :minPrice="filter.minPrice"
                                :maxPrice="filter.maxPrice"
                                :minSquare="filter.minSquare"
                                :maxSquare="filter.maxSquare"/>
                </aside>
            </template>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Card from '@/components/Card/Card';
import FilterCard from '@/components/FilterCard/FilterCard';
import Loader from '@/components/Loader/Loader';

export default {
    name: 'Apartments',

    components: {
        Card,
        FilterCard,
        Loader,
    },

    data() {
        return {
            cards: [],
            qtyCards: 0,
            totalFloors: null,
            filter: null,
            defaultShowCards: 5,
            query: {
                limit: null,
                minPrice: null,
                maxPrice: null,
                minSquare: null,
                maxSquare: null,
                rooms: null,
                by: null,
                sort: null,
            },
            preload: true,
        };
    },

    async created() {
        this.getQueryData();
        await this.getApartmentsData();

        this.preload = false;
    },

    methods: {
        /**
         * Получает данные из гет параметров и устанавливает их в переменную
         */
        getQueryData() {
            this.query = {
                limit: Number(this.$route.query.limit) || this.defaultShowCards,
                minPrice: Number(this.$route.query.minPrice),
                maxPrice: Number(this.$route.query.maxPrice),
                minSquare: Number(this.$route.query.minSquare),
                maxSquare: Number(this.$route.query.maxSquare),
                rooms: this.$route.query.rooms,
                by: this.$route.query.by || 'price',
                sort: this.$route.query.sort || 'asc',
            };
        },

        /**
         * Получает данные по помещениям
         */
        async getApartmentsData() {
            await axios.get('/data.json')
                .then((response) => {
                    const {
                        apartments, qtyRooms, minPrice, maxPrice, minSquare, maxSquare, totalFloors,
                    } = response.data;

                    let tempApartments = apartments;

                    this.qtyCards = tempApartments.length;

                    // Здесь я бы передавал в параметрах данные, но так как без бэка
                    // то просто сделаем вид, будто обрабатывается
                    tempApartments = this.filterData(tempApartments);
                    tempApartments = this.sortData(tempApartments, this.query.by, this.query.sort);

                    this.cards = tempApartments.slice(0, this.query.limit || this.defaultShowCards);

                    this.totalFloors = totalFloors;

                    this.filter = {
                        qtyRooms,
                        minPrice,
                        maxPrice,
                        minSquare,
                        maxSquare,
                    };
                })
                .catch((e) => {
                    // eslint-disable-next-line no-console
                    console.log(e);
                });
        },

        /**
         * Фильтрует карточки по заданным фильтрам/параметрам
         * @param arr Array - массив карточек
         * @returns {Array} - отфильтрованный массив
         */
        filterData(arr) {
            let resultArr = arr;

            if (this.query.minPrice && this.query.maxPrice) {
                // eslint-disable-next-line max-len
                resultArr = resultArr.filter((item) => (item.price >= this.query.minPrice) && (item.price <= this.query.maxPrice));
            }

            if (this.query.minSquare && this.query.maxSquare) {
                // eslint-disable-next-line max-len
                resultArr = resultArr.filter((item) => (item.square >= this.query.minSquare) && (item.square <= this.query.maxSquare));
            }

            if (this.query.rooms) {
                const rooms = this.query.rooms.split(',');

                resultArr = resultArr
                    .filter((item) => rooms.includes(String(item.room)));
            }

            return resultArr;
        },

        /**
         * Сортирует карточки
         * @param arr Array - массив карточек
         * @param type String - по какому полю сортируем
         * @param direction String - навправление сортировки asc/desc
         * @returns {Array} - отсортированный массив
         */
        sortData(arr, type, direction) {
            const resultArr = arr;

            switch (type) {
            case 'square':
                resultArr.sort((prev, next) => {
                    if (prev.square < next.square) return -1;
                    if (prev.square > next.square) return 1;

                    return 0;
                });
                break;
            case 'floor':
                resultArr.sort((prev, next) => {
                    if (prev.floor < next.floor) return -1;
                    if (prev.floor > next.floor) return 1;

                    return 0;
                });
                break;
            case 'price':
                resultArr.sort((prev, next) => {
                    if (prev.price < next.price) return -1;
                    if (prev.price > next.price) return 1;

                    return 0;
                });
                break;
            default:
                break;
            }

            return direction === 'asc' ? resultArr : resultArr.reverse();
        },

        /**
         * Фиксирует изменение сортировки карточек
         * @param type String - по какому полю сортируем
         * @param direction String - навправление сортировки asc/desc
         */
        changeSort(type, direction) {
            if (type !== this.$route.query.by) {
                this.$router.push({
                    query: {
                        ...this.$route.query,
                        by: type,
                    },
                });
            }

            if (direction !== this.$route.query.sort) {
                this.$router.push({
                    query: {
                        ...this.$route.query,
                        sort: direction,
                    },
                });
            }
        },

        /**
         * Фиксирует увелечение лимита карточек для показа
         */
        showMore() {
            const limit = this.query.limit + this.defaultShowCards;

            this.$router.push({ query: { ...this.$route.query, limit } });
        },
    },

    watch: {
        $route() {
            this.getQueryData();
            this.getApartmentsData();
        },
    },
};
</script>

<style lang="scss" scoped>
@import "Apartments";
</style>
