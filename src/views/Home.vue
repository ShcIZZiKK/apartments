<template>
  <div class="home">
    <div class="container">
      <div class="apartments-wrapper">
        <h1>Квартиры</h1>
        <div class="apartments-nav">
          <div>
            <span>Планировка</span>
          </div>
          <div>
            <span>Квартира</span>
          </div>
          <div>
            <button
              @click="changeSort('square', query.sort === 'asc' ? 'desc' : 'asc')"
              :class="[{ active: query.by === 'square' }, query.sort === 'asc' ? 'asc' : 'desc' ]">
              <span>S, м<sup><small>2</small></sup></span>
              <img v-svg-inline class="icon up" src="/assets/images/icons/arrow-small.svg" />
              <img v-svg-inline class="icon down" src="/assets/images/icons/arrow-small.svg" />
            </button>
          </div>
          <div>
            <button
              @click="changeSort('floor', query.sort === 'asc' ? 'desc' : 'asc')"
              :class="[{ active: query.by === 'floor' }, query.sort === 'asc' ? 'asc' : 'desc']">
              <span>Этаж</span>
              <img v-svg-inline class="icon up" src="/assets/images/icons/arrow-small.svg" />
              <img v-svg-inline class="icon down" src="/assets/images/icons/arrow-small.svg" />
            </button>
          </div>
          <div>
            <button
              @click="changeSort('price', query.sort === 'asc' ? 'desc' : 'asc')"
              :class="[{ active: query.by === 'price' }, query.sort === 'asc' ? 'asc' : 'desc']">
              <span>Цена, &#8381;</span>
              <img v-svg-inline class="icon up" src="/assets/images/icons/arrow-small.svg" />
              <img v-svg-inline class="icon down" src="/assets/images/icons/arrow-small.svg" />
            </button>
          </div>
        </div>
        <div class="apartments-list">
          <Card
            v-for="item in cards"
            :image="item.image"
            :name="item.name"
            :room="item.room"
            :square="item.square"
            :floor="item.floor"
            :price="item.price"
            :totalFloors="totalFloors"
            :key="item.id" />
        </div>
        <button
          class="apartments-more"
          @click="showMore"
          v-if="query.limit < qtyCards && query.limit <= cards.length">
            Загрузить ещё
        </button>
      </div>
      <aside class="apartments-filter">
        <FilterCard
          v-if="filter !== null"
          :qtyRooms="filter.qtyRooms"
          :minPrice="filter.minPrice"
          :maxPrice="filter.maxPrice"
          :minSquare="filter.minSquare"
          :maxSquare="filter.maxSquare" />
      </aside>
    </div>
    <ScrollBtn />
  </div>
</template>

<script>
import axios from 'axios';
import Card from '@/components/Card';
import FilterCard from '@/components/FilterCard';
import ScrollBtn from '@/components/ScrollBtn';

export default {
  name: 'Home',
  components: {
    Card,
    FilterCard,
    ScrollBtn,
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
        minprice: null,
        maxprice: null,
        minsquare: null,
        maxsquare: null,
        rooms: null,
        by: null,
        sort: null,
      },
    };
  },
  created() {
    this.query.limit = this.$route.query.limit || this.defaultShowCards;
    this.query.minprice = this.$route.query.minprice;
    this.query.maxprice = this.$route.query.maxprice;
    this.query.minsquare = this.$route.query.minsquare;
    this.query.maxsquare = this.$route.query.maxsquare;
    this.query.rooms = this.$route.query.rooms;
    this.query.by = this.$route.query.by || 'price';
    this.query.sort = this.$route.query.sort || 'asc';
    this.getApartmentsData(this.query);
  },
  methods: {
    getApartmentsData(query) {
      axios.get('/data.json')
        .then((responce) => {
          const {
            apartments, qtyRooms, minPrice, maxPrice, minSquare, maxSquare, totalFloors,
          } = responce.data;

          let tempApartments = apartments;

          this.qtyCards = tempApartments.length;

          // Здесь я бы передавал в параметрах данные, но так как без бэка
          // то просто сделаем вид, будто обрабатывается
          tempApartments = this.filerData(tempApartments, query);
          tempApartments = this.sortData(tempApartments, query.by, query.sort);

          this.cards = tempApartments.slice(0, query.limit || this.defaultShowCards);
          this.query.limit = query.limit || this.defaultShowCards;

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
    filerData(arr, query) {
      let resultArr = arr;

      if (query.minprice && query.maxprice) {
        resultArr = resultArr
          .filter((item) => (item.price >= query.minprice) && (item.price <= query.maxprice));
      }

      if (query.minsquare && query.maxsquare) {
        resultArr = resultArr
          .filter((item) => (item.square >= query.minsquare) && (item.square <= query.maxsquare));
      }

      if (query.rooms) {
        const rooms = query.rooms.split(',');

        resultArr = resultArr
          .filter((item) => rooms.includes(String(item.room)));
      }

      return resultArr;
    },
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
    changeSort(type, direction) {
      if (type !== this.$route.query.by) {
        this.query.by = type;

        this.$router.push({
          query: {
            ...this.$route.query,
            by: type,
          },
        });
      }

      if (direction !== this.$route.query.sort) {
        this.query.sort = direction;

        this.$router.push({
          query: {
            ...this.$route.query,
            sort: direction,
          },
        });
      }
    },
    showMore() {
      let newLimit = +this.$route.query.limit || this.query.limit;

      this.$router.push({ query: { ...this.$route.query, limit: newLimit += 3 } });
    },
  },
  watch: {
    $route() {
      this.getApartmentsData(this.$route.query);
    },
  },
};
</script>
