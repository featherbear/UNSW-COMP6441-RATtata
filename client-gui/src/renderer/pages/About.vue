<template>
  <div class="container is-unselectable">
    <!-- <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Primary title</h1>
          <h2 class="subtitle">Primary subtitle</h2>
        </div>
      </div>
    </section>-->
    <img class="logo" src="~@/assets/logo.png" />
    <h1 class="is-size-1">RATtata</h1>

    <h3 class="is-size-3">Version {{require('electron').remote.app.getVersion()}}</h3>
  </div>
</template>


<style scoped>
.container {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  /*  */
  height: 100%;
  /*  */

  cursor: default;
}

img.logo {
  width: 40%;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}
</style>
