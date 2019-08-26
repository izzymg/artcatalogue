<template>
  <div class="catalogue-item">
    <transition name="fade">
      <form v-if="!saved" class="catalogue-item-form">
        <div class="title-wrapper">
          <input type="text" required v-model="item.title" placeholder="Title">
        </div>
        <label class="pricing-desc"> Pricing is optional </label>
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
    <div class="save-wrapper">
      <input :disabled="saved" @click.stop.prevent="onSave" type="submit" :value="saveText">
      <input :disabled="!saved" @click.stop.prevent="onClear" type="submit" value="Clear">
    </div>
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

    .save-wrapper {
      margin: 10px 0;
      input {
        margin: 0 5px;
      }
    }

    .pricing-desc {
      font-size: 0.8em;
      margin: 5px 10px;
      font-style: italic;
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