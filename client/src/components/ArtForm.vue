<template>
  <div class="art-form">
    <form autocomplete="off" class="art-form-form">
      <div class="details-wrapper">
        <label> Your details </label>
        <input v-model="formData.firstName" type="text" placeholder="First Name">
        <input v-model="formData.lastName" type="text" placeholder="Last Name">
      </div>
      <div class="ex-wrapper">
        <label> Exhibition Title for Catalogue Heading </label>
        <input v-model="formData.title" type="text" placeholder="(Optional)">
        <label> Site MAP number </label>
        <input v-model="formData.siteMap" type="number" max="100" placeholder="Site MAP number">
      </div>
      <div class="section-wrapper">
        <label> Section </label>
        <select class="section-select" v-model="formData.section">
          <option value="PHEA">PHEA</option>
          <option value="Jewellery/Textiles">Jewellery/Textiles</option>
          <option value="Painting">Painting</option>
          <option value="Sculptures/Ceramics">Sculptures/Ceramics</option>
          <option value="Printmaking">Printmaking</option>
        </select>
      </div>
      <div class="submit-wrapper">
        <h4 class="page-message" v-html="message"></h4>
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
        title: null,
        section: "PHEA",
        siteMap: 1,
      },
    };
  },
  computed: {
    // Caches site MAP number to watch changes on it 
    siteMapNumber() {
      return this.formData.siteMap;
    }
  },
  watch: {
    siteMapNumber(newValue) {
      if(newValue > 100) {
        this.formData.siteMap = 100;
      }
      if(newValue < 1) {
        this.formData.siteMap = 1;
      }
    },
  },
  methods: {
    async onSubmit() {
      this.message = "Submitting...";
      try {
        const res = await repo.submitForm(this.formData);
        this.message = res.data.message;
      } catch(error) {
        console.log({error});
        // If there was a message sent with the server response, display it
        if(error.response && error.response.data) {
          this.message = error.response.data;
          return;
        }
        this.message = "Unknown error";
      }
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