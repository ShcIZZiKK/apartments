<template>
    <div id="app">
        <router-view/>
        <ScrollBtn/>
    </div>
</template>

<script>
import ScrollBtn from '@/components/ScrollBtn/ScrollBtn';

export default {
    components: {
        ScrollBtn,
    },
};
</script>

<style lang="scss">
@import "./assets/scss/app";
</style>
