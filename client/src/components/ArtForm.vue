<template>
  <div class="art-form">
    <form autocomplete="off" class="art-form-form">
      <div class="initial-wrapper">
        <div class="details-wrapper">
          <label> Your details </label>
          <input v-model="formData.firstName" type="text" placeholder="First Name">
          <input v-model="formData.lastName" type="text" placeholder="Last Name">
        </div>
        <div class="ex-wrapper">
          <label> Exhibition Title for Catalogue Heading </label>
          <input v-model="formData.title" type="text" placeholder="Title (Optional)">
          <label> Site MAP number </label>
          <input v-model="formData.siteMap" type="number" max="100" placeholder="Site MAP number">
        </div>
        <div class="section-wrapper">
          <label> Section </label>
          <select class="section-select" v-model="formData.section">
            <option value="PHEA">PHEA</option>
            <option value="Jewellery/Textiles">Jewellery/Textiles</option>
            <option value="Paintings">Paintings</option>
            <option value="Sculptures/Ceramics">Sculptures/Ceramics</option>
            <option value="Printmakings">Printmakings</option>
          </select>
        </div>
      </div>
      <CatalogueItem/>
      <div class="submit-wrapper">
        <input type="submit" value="Done" @click.stop.prevent="onSubmit">
        <p class="page-message" v-html="message"></p>
      </div>
    </form>
  </div>
</template>

<script>
import repo from "../repo";
import CatalogueItem from "../components/CatalogueItem";
export default {
  name: "ArtForm",
  components: {
    CatalogueItem,
  },
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

<style lang="scss">
.page-message {
  font-size: 0.7em;
  margin: 0;
  text-align: center;
}
.art-form {
  margin-left: 9px;
}
.details-wrapper input {
  margin: 0 2px;
}
.submit-wrapper input {
  margin: 20px;
}
.initial-wrapper {
  margin: 30px 0;
}

</style>