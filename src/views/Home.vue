<template>
    <div class="page-wrapper">
        <Apartments />
    </div>
</template>

<script>
import Apartments from '@/sections/Apartments/Apartments';

export default {
    name: 'Home',

    components: {
        Apartments,
    },
};
</script>
