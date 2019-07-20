<template>
  <div :class="vertical ? 'is-divider-vertical' : 'is-divider'" :data-content="label"></div>
</template><style>
</style>
<script>
import "bulma-divider/dist/css/bulma-divider.min.css";
export default {
  props: {
    label: String,
    vertical: Boolean
  }
};
</script>