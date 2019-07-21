<template>
  <b-collapse class="card" aria-id="contentIdForA11y3">
    <div
      slot="trigger"
      slot-scope="props"
      class="card-header"
      role="button"
      aria-controls="contentIdForA11y3"
    >
      <p class="card-header-title">{{title}}</p>
      <a class="card-header-icon">
        <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon>
      </a>
    </div>
    <div class="card-content">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </b-collapse>
</template>

<script>
export default {
  props: {
    title: String
  }
};
</script>
