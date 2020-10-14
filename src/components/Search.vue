<template>
  <div class="">
    <v-text-field
      @click:append="toggleAdvanceSearchSection()"
      :append-icon="appendIcon"
      label="Search"
      filled
      class="search-bar"
      @input="performBasicSearch()"
      v-model="queryString"
      :placeholder="placeholder"
    ></v-text-field>
    <v-expand-transition v-if="isAdvanceSearch">
      <div v-show="menu">
        <v-card elevation="0">
          Filters Come Here
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="error" text @click="clearFilters()">
              Clear
            </v-btn>
            <v-btn outlined color="primary" @click="performAdvanceSearch()">
              Search
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Search",
  components: {},
  data: () => ({
    menu: false,
    queryString: "",
    filterObject: "",
    searchTimeoutRef: "",
  }),
  computed: {
    ...mapGetters([]),
    appendIcon() {
      if (this.isAdvanceSearch) {
        return this.menu
          ? "mdi-arrow-up-drop-circle-outline"
          : "mdi-arrow-down-drop-circle-outline";
      } else {
        return "mdi-magnify";
      }
    },
  },
  methods: {
    performBasicSearch() {
      clearTimeout(this.searchTimeoutRef);
      this.searchTimeoutRef = setTimeout(() => {
        console.log(this.queryString);
        this.$emit("queryString", this.queryString);
      }, 500);
    },
    clearFilters() {},
    performAdvanceSearch() {
      this.$emit("filterObject", this.filterObject);
    },
    toggleAdvanceSearchSection() {
      this.menu = !this.menu;
    },
  },
  props: {
    isAdvanceSearch: {
      required: false,
      type: Boolean,
      default: false,
    },
    placeholder: {
      required: false,
      type: String,
      default: "Type to Search",
    },
  },
};
</script>
