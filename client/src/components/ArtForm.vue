<template>
  <div class="art-form">
    <form autocomplete="off" class="art-form-form">
      <div class="details-wrapper">
        <label> Entry information </label>
        <input v-model="formData.firstName" type="text" placeholder="First Name">
        <input v-model="formData.lastName" type="text" placeholder="Last Name">
      </div>
      <div class="ex-wrapper">
        <input v-model="formData.title" type="text" placeholder="Exhibition Title (opt.)">
        <input v-model="formData.siteMap" type="number" max="100" placeholder="Site MAP number">
        <label class="little-label"> Site MAP number </label>
      </div>
      <div class="section-wrapper">
        <select class="section-select" v-model="formData.section">
          <option value="PHEA">PHEA</option>
          <option value="Jewellery/Textiles">Jewellery/Textiles</option>
          <option value="Paintings">Paintings</option>
          <option value="Sculptures/Ceramics">Sculptures/Ceramics</option>
          <option value="Printmakings">Printmakings</option>
        </select>
        <label class="little-label"> Section </label>
      </div>
      <div class="catalogue-items-wrapper">
        <label> Add a Catalogue Item (<span @click="hideHelp = !hideHelp" class="link">{{ hideHelp ? "X" : "?" }}</span>) </label>
        <transition name="fade">
          <p v-if="hideHelp" class="help">
            Fill out your first catalogue item, then save click "Save" when finished.
            You can click "New Item" to add another catalogue item, and cycle between those you've created.
            If you want to delete a saved item, click "clear" to reset it.
          </p>
        </transition>
        <transition-group name="fade">
          <CatalogueItem
            @save="onCiSave" @clear="onCiClear"
            :hidden="ci != selectedCiForm" v-for="ci in ciForms"
            :id="ci" :key="ci"
          >
          </CatalogueItem>
        </transition-group>
      </div>
      <hr>
      <div class="catalogue-items-control-wrapper">
        <input :disabled="!previousCiValid" @click="onPrevCi" type="button" value="Prev">
        <span class="selected-ci-text"> Item {{ selectedCiForm }} </span>
        <input v-if="nextCiValid" @click="onNextCi" type="button" value="Next">
        <input v-else @click="onNewCi" type="button" value="New Item">
      </div>
      <hr>
      <div class="submit-wrapper">
        <input type="submit" value="Done and submit" @click.stop.prevent="onSubmit">
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
        items: [],
      },
      hideHelp: true,
      ciForms: 1,
      selectedCiForm: 1,
    };
  },
  computed: {
    // Caches site MAP number to watch changes on it 
    siteMapNumber() {
      return this.formData.siteMap;
    },
    // Should the "previous catalogue item" button be enabled
    previousCiValid() {
      return this.selectedCiForm > 1;
    },
    // Should the "next catalogue item" be enabled
    nextCiValid() {
      return this.selectedCiForm < this.ciForms;
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
    onCiSave(item) {
      this.formData.items.push(item);
    },
    onCiClear(id) {
      this.formData.items.forEach((item, index) => {
        console.log({item, index, id});
        if(item.id == id) {
          this.formData.items.splice(index, 1);
        }
      });
    },
    onNewCi() {
      this.ciForms++;
      this.selectedCiForm = this.ciForms;
    },
    onNextCi() {
      this.selectedCiForm++;
    },
    onPrevCi() {
      if(this.selectedCiForm > 1) {
        this.selectedCiForm--;
      }
    },
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

.art-form {
  margin-left: 9px;

  .help {
    font-size: 0.9em;
    word-wrap: break-word;
    max-width: 600px;
  }

  .page-message {
    font-size: 0.7em;
    margin: 0;
    text-align: center;
  }

  .selected-ci-text {
    font-size: 0.8em;
  }

  input, select {
    margin-left: 10px;
    margin-right: 10px;
  }

  .ex-wrapper {
    margin: 10px 0;
    input {
      &[type="number"] {
        width: 50px;
      }
    }
  }

  .catalogue-items-wrapper {
    margin-top: 30px;
  }

  .submit-wrapper input {
    margin: 20px;
  }
}


</style>