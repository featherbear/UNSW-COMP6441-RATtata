<template>
  <div>
    <nav class="navbar is-light" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <div class="navbar-item">OS ICON?</div>
        <div class="navbar-item">SERVER NAME</div>
      </div>

      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item">Home</a>

          <a class="navbar-item">Documentation</a>

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">More</a>

            <div class="navbar-dropdown">
              <a class="navbar-item">About</a>
              <a class="navbar-item">Jobs</a>
              <a class="navbar-item">Contact</a>
              <hr class="navbar-divider" />
              <a class="navbar-item">Report an issue</a>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a class="button is-danger">
                <strong>Disconnect</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>
</script>
<style scoped>
nav.navbar {
  position: sticky;
  top: 0;
}
</style>