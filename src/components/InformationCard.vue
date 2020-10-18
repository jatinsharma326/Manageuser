<template>
  <v-card class="information-card" min-width="300px">
    <div class="top-content-wrapper">
      <div class="subtitle">
        <slot name="topLeft"></slot>
      </div>
      <div class="subtitle text-right">
        <slot name="topRight"></slot>
      </div>
    </div>

    <div class="main-content-wrapper">
      <div class="main-content-left">
        <div class="main-content">
          <slot name="mainContent"></slot>
        </div>
        <div class="subtitle">
          <slot name="mainContentSubtitle"></slot>
        </div>
      </div>
      <div class="main-content-right">
        <slot name="mainContentRight"></slot>
      </div>
    </div>
    <div class="more-info subtitle">
      <slot name="moreInfo"></slot>
    </div>

    <div class="bottom-content-wrapper">
      <v-card-actions>
        <div class="action-button">
          <slot name="actionButtons"></slot>
        </div>

        <v-spacer></v-spacer>
        <div v-if="expandCard" class="">
          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
          </v-btn>
        </div>
      </v-card-actions>
    </div>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <slot name="expandCardContent"></slot>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  name: "InformationCard",
  created() {},
  mounted() {
    // this.dialog = false;
  },
  data: () => ({
    show: false,
  }),
  methods: {},
  computed: {},
  watch: {},
  props: {
    expandCard: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.v-card__actions {
  padding: 0;
}
.subtitle {
  color: grey;
  font-size: 14px;
}

.main-content {
  font-size: 32px;
  font-weight: 500;
  @include custom-max(475px) {
    font-size: 24px;
  }
}

.information-card {
  padding: 16px;

  .top-content-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;

    padding-bottom: 10px;
  }
  .main-content-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;

    padding-bottom: 10px;
    .main-content-left {
      flex-basis: 75%;
    }
    .main-content-right {
      flex-basis: 25%;
    }
  }
  .bottom-content-wrapper {
    padding-top: 10px;
  }
}
</style>
