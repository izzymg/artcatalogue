<template>
  <div class="catalogue-item">
    <transition name="fade">
      <form class="catalogue-item-form">
        <label class="desc"> Title </label>
        <div class="title-wrapper">
          <input type="text" required v-model="item.title" :placeholder="itemPlaceholder" @input="updateState">
        </div>
        <label class="desc"> Medium </label>
        <div class="medium-wrapper">
          <select required v-model="item.medium" @change="updateState">
            <option v-for="medium in mediums" :key="medium" :value="medium"> {{ medium }} </option>
          </select>
        </div>
        <label class="desc"> Dimensions are optional </label>
        <div class="dimensions-wrapper">
          <input v-model="item.dimensions" type="text" placeholder="Dimensions" value="20x20x20">
          <label class="little-label"> (WxHxL) Centimetres </label>
        </div>
        <label class="desc"> Pricing is optional </label>
        <div class="dollars-wrapper">
          <input v-model="item.dollars" type="number" placeholder="Dollars">
          <label class="little-label">$ Dollars</label>
        </div>
        <div class="dollars-wrapper">
          <input v-model="item.cents" type="number" placeholder="Cents">
          <label class="little-label">¢ Cents</label>
        </div>
      </form>
    </transition>
</div>
</template>

<script>
export default {
  name: "CatalogueItem",
  data() {
    return {
      item: {
        title: null,
        medium: this.mediums[0],
        dollars: 0,
        cents: 0,
        dimensions: "20x20x20"
      },
    };
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    mediums: {
      type: Array,
      required: true,
    },
  },
  methods: {
    updateState() {
      this.$store.commit("update", {
        id: this.id,
        title: this.item.title,
        medium: this.item.medium,
        value: this.value,
        dimensions: this.item.dimensions,
      });
    }
  },
  computed: {
    itemPlaceholder() {
      return `Item ${this.id}`;
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
    },
    value() {
      // Update state on value change, not on dollar/cent change
      this.updateState();
    }
  },
};
</script>

<style lang="scss">

  .catalogue-item {
    padding: 5px;

    .save-wrapper {
      margin: 10px 0;
      input {
        margin: 0 5px;
      }
    }

    .desc {
      font-size: 0.8em;
      margin: 5px 10px;
    }

    .title-wrapper {
      margin: 5px 0;
    }

    .dollars-wrapper, .cents-wrapper {
      display: flex;
      align-items: center;
    }
  }

  @media only screen and (max-width: 1000px) {
    .catalogue-item {
      width: 80%;
    }
  }
</style>