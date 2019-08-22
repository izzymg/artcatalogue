<template>
  <div class="catalogue-item">
    <hr>
    <h3> Item {{ id }} </h3>
    <form class="catalogue-item-form">
      <div class="title-wrapper">
        <input type="text" required v-model="title" placeholder="Title">
      </div>
      <div class="sale-wrapper">
        <input type="checkbox" v-model="forSale" checked>
        <label @click="forSale = !forSale" class="little-label">Item is for sale</label>
      </div>
      <div class="pricing-wrapper">
        <label class="little-label">$</label>
        <input v-model="dollars" :disabled="!forSale" type="number" placeholder="Dollars">
        <label class="little-label">¢</label>
        <input v-model="cents" :disabled="!forSale" type="number" placeholder="Cents">
      </div>
      <div class="save-wrapper">
        <input type="submit" value="Save">
      </div>
    </form>
    <hr>
</div>
</template>

<script>
export default {
  name: "CatalogueItem",
  data() {
    return {
      title: null,
      forSale: true,
      dollars: 0,
      cents: 0,
    };
  },
  props: {
    id: {
      type: Number,
    }
  }
};
</script>

<style lang="scss">

  .catalogue-item {
    padding: 5px;
    width: 50%;
    margin: 0 auto;

    .save-wrapper {
      margin: 10px 0;
    }

    .pricing-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      input {
        max-width: 100px;
        min-width: unset;
        display: block;
      }
    }
  }

  @media only screen and (max-width: 1000px) {
    .catalogue-item {
      width: 80%;
    }
  }
</style>