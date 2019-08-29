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
      <label> Add a Catalogue Item </label>
      <div class="catalogue-items-wrapper">
        <ul class="catalogue-item-list">
          <li
            v-for="i in ciForms"
            :key="i.id"
            @click.stop="selectedCiForm = i.id"
            :class="{ selected: i.id == selectedCiForm }"
          > Item {{ i.id }}
          </li>
        </ul>
        <CatalogueItem
          v-for="i in ciForms"
          :key="i.id"
          :id="i.id"
          :hidden="selectedCiForm !== i.id"
        >
        </CatalogueItem>
      </div>
      <input type="submit" @click.stop.prevent="addCiForm" class="add-item-btn" value="Add item">
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
      },
      selectedCiForm: 1,
    };
  },
  computed: {
    // Caches site MAP number to watch changes on it 
    siteMapNumber() {
      return this.formData.siteMap;
    },
    ciForms() {
      return this.$store.getters.catalogueItems;
    }
  },
  watch: {
    siteMapNumber(newValue) {
      if(newValue > 100) {
        this.formData.siteMap = this.formData.siteMap.replace(/^./, '');
      }
      if(newValue < 1) {
        this.formData.siteMap = 1;
      }
    },
  },
  methods: {
    addCiForm() {
      this.$store.commit("add");
    },
    async onSubmit() {
      this.message = "Submitting...";
      try {
        const catalogueItems = this.$store.getters.catalogueItems;

        // Mix in items with rest of form data and submit
        const res = await repo.submitForm({
          ...this.formData,
          items: catalogueItems,
        });
        this.message = res.data.message;

      } catch(error) {

        console.log({error});

        // If there was a message sent with the server response, display it
        if(error.response && error.response.data) {
          this.message = error.response.data;
          return;
        }

        this.message = "Unknown error (server may be down)";
      }
    }
  }
}
</script>

<style lang="scss">

.art-form {
  margin-left: 9px;

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
    display: flex;
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 400px;

    .catalogue-item-list {
      min-height: 220px;
      max-height: 220px;
      overflow-y: auto;
      font-size: 0.8em;
      list-style: none;
      li {
        padding: 10px 45px;
        background: hsl(0, 0%, 96%);
        cursor: pointer;
        &.selected {
          background: hsl(204, 48%, 69%);
          color: #fff;
        }
        &:hover:not(.selected) {
          background: hsl(0, 0%, 75%);
        }
      }
    }
    
    .catalogue-item {
      margin: 0 20px;
    }
  }

  .submit-wrapper input {
    margin: 20px;
  }
}


</style>