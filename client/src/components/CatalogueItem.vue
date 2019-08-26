<template>
  <div class="catalogue-item">
    <hr>
    <h3> Item {{ id }} </h3>
    <transition name="fade">
      <form :hidden="saved" class="catalogue-item-form">
        <div class="title-wrapper">
          <input type="text" required v-model="item.title" placeholder="Title">
        </div>
        <div class="sale-wrapper">
          <input type="checkbox" v-model="item.forSale" checked>
          <label @click="item.forSale = !item.forSale" class="little-label">Item is for sale</label>
        </div>
        <div class="pricing-wrapper">
          <label class="little-label">$</label>
          <input v-model="item.dollars" :disabled="!item.forSale" type="number" placeholder="Dollars">
          <label class="little-label">¢</label>
          <input v-model="item.cents" :disabled="!item.forSale" type="number" placeholder="Cents">
        </div>
      </form>
    </transition>
    <div class="save-wrapper">
      <input :disabled="saved" @click.stop.prevent="onSave" type="submit" :value="saveText">
      <input :disabled="!saved" @click.stop.prevent="onClear" type="submit" value="Clear">
    </div>
    <hr>
</div>
</template>

<script>
export default {
  name: "CatalogueItem",
  data() {
    return {
      saved: false,
      item: {
        title: null,
        forSale: true,
        dollars: 0,
        cents: 0,
      },
    };
  },
  props: {
    id: {
      type: Number,
      required: true,
    }
  },
  computed: {
    saveText() {
      return this.saved ? "Saved" : "Save";
    },
    dollars() {
      return this.item.dollars;
    },
    cents() {
      return this.item.cents;
    },
    // Value of items stored as an integer of cents
    // Not graphically exposed
    value() {
      return (this.item.dollars * 100) + this.item.cents;
    },
  },
  watch: {
    dollars(n) {
      this.item.dollars = parseInt(n, 10) || 0;
      if(this.item.dollars < 0) {
        this.item.dollars = 0;
      }
    },
    cents(n) {
      this.item.cents = parseInt(n, 10) || 0;
      if(this.item.cents < 0) {
        this.item.cents = 0;
      } else if(this.item.cents > 99) {
        this.item.dollars++;
        this.item.cents = 0;
      }
    }
  },
  methods: {
    onSave() {
      if(this.saved) {
        return;
      }
      this.saved = true;
      this.$emit("save", {
        id: this.id,
        title: this.item.title,
        forSale: this.item.forSale,
        value: this.value,
      });
    },
    onClear() {
      if(!this.saved) {
        return;
      }
      this.saved = false;
      this.$emit("clear", this.id);
      this.item.title = null;
      this.item.forSale = true;
      this.item.dollars = 0;
      this.item.cents = 0;
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
      input {
        margin: 0 5px;
      }
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