<template>
  <div class="catalogue-item">
    <h3 class="catalogue-item-header">
      New Catalogue Item
    </h3>
    <form class="catalogue-item-form">
      <div class="title-wrapper">
        <label> Item Title </label>
        <input required v-model="title" placeholder="Title">
      </div>
    </form>
</div>
</template>

<script>
export default {
  name: "CatalogueItem",
  data() {
    return {
      title: null,
    };
  },
};
</script>

<style lang="scss">
  .catalogue-item {
    padding: 5px;
    background: hsl(0, 0%, 99%);
    border: 1px solid hsl(0, 0%, 88%);
    box-shadow: 5px 5px 15px hsl(0, 0%, 85%);
    width: 30%;
    .catalogue-item-header {
      margin: 5px 0;
      text-decoration: underline;
    }
  }
  @media only screen and (max-width: 1000px) {
    .catalogue-item {
      width: 80%;
    }
  }
</style>