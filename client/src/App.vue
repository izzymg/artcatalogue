<template>
  <div id="app">
    <div class="nav-bar">
      <h3 class="page-title"> Otago PolyTech ArtCat Form </h3>
    </div>
    <ArtForm/>
  </div>
</template>

<script>
import ArtForm from "./components/ArtForm";
export default {
  name: "app",
  components: {
    ArtForm,
  }
}
</script>

<style lang="scss">

#app {
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: hsl(0, 0%, 10%);
  text-align: left;
  font-size: 1.4em;
}

body {
  margin: 0;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  background: #2c2c2c;
  padding: 10px;
  .page-title {
    margin: 0;
    font-size: 0.9em;
    color: #fff;
  }
}

input[type="text"], input[type="number"], select {
  font-size: 0.7em;
  padding: 12px;
  border-radius: none;
  border: 1px solid hsl(0, 0%, 82%);
  box-shadow: inset 2px 2px 5px hsl(0, 0%, 92%);
  min-width: 30vw;
  &:focus {
    border: 1px solid #1DAEEA;
  }
}

input[type="submit"] {
  cursor: pointer;
  padding: 15px;
  background: linear-gradient(217deg, #5a82a8, #6296c7 60%);
  border: none;
  border-radius: none;
  color: #fff;
  &:hover {
    background: linear-gradient(217deg, #7f9bb6, #6296c7 60%);
  }
}

input, select {
  &:focus {
    outline-width: 0;
  }
}

label {
  display: block;
  margin: 15px 0;
}

h1, h2, h3 {
  font-weight: normal;
}

</style>
