<template>
  <div id="app">
    <h1 class="page-title"> Art Site Form </h1>
    <h4 class="page-desc">
      <span class="poly"> Otago Polytechnic </span>
      <span class="sep"> | </span>
      <a class="op-link" href="https://www.op.ac.nz/study/creative/art/">Art School</a>
    </h4>
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
  font-family: "Montserrat", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #3b3b3b;
  text-align: center;
}

.page-title {
  text-align: center;
}

.page-desc .poly {
  color: #53453E;
}

.page-desc .op-link {
  color: #7b7361;
}

input[type="text"], input[type="number"], select {
  padding: 5px;
  border-radius: none;
  border: 1px solid hsl(0, 0%, 82%);
  box-shadow: inset 2px 2px 5px hsl(0, 0%, 92%);
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

</style>
