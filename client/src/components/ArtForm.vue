<template>
  <div class="art-form">
      <h4 class="page-message" v-html="message"></h4>
      <form autocomplete="off" class="art-form-form">
          <div class="details-wrapper">
            <label> Your details </label>
            <input v-model="formData.firstName" type="text" placeholder="First Name">
            <input v-model="formData.lastName" type="text" placeholder="Last Name">
          </div>
          <div class="section-wrapper">
            <label> Section </label>
            <select class="section-select" v-model="formData.section">
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
import repo from "../repo";
export default {
    name: "ArtForm",
    data() {
        return {
            message: null,
            formData: {
                firstName: null,
                lastName: null,
                section: "jewellery",
            },
        };
    },
    methods: {
        async onSubmit() {
            const res = await repo.submitForm(this.formData);
            this.message = JSON.stringify(res.data);
        }
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