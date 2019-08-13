<template>
  <div class="art-form">
      <form autocomplete="off" class="art-form-form">
          <div class="details-wrapper">
            <label> Your details </label>
            <input v-model="firstName" type="text" placeholder="First Name">
            <input v-model="lastName" type="text" placeholder="Last Name">
          </div>
          <div class="section-wrapper">
            <label> Section </label>
            <select class="section-select" v-model="section">
                <option value="jewellery">Jewellery</option>
                <option value="textiles">Textiles</option>
                <option value="painting">Painting</option>
            </select>
          </div>
          <div class="submit-wrapper">
              <input type="submit" value="✔️ Done" @click.stop.prevent="onSubmit">
          </div>
      </form>
  </div>
</template>

<script>
export default {
    name: "ArtForm",
    data() {
        return {
            firstName: null,
            lastName: null,
            section: "jewellery",
        };
    },
    methods: {
        async onSubmit() { }
    }
}
</script>

<style>
.details-wrapper input {
    margin: 0 2px;
}
.submit-wrapper input {
    margin: 20px;
}
</style>