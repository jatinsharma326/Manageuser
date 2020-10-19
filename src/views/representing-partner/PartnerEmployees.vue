<template>
  <div class="partnerEmployeesWrapper">
    <v-row class="px-6" justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <Search
          @queryString="queryString"
          @filterObject="advanceSearch"
          :placeholder="placeholder"
          :isAdvanceSearch="true"
          :filterConfig="selectedSearchConfig"
        ></Search>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import InformationCard from "../../components/InformationCard.vue";
import Search from "../../components/Search.vue";

export default {
  name: "PartnerEmployee",
  components: {
    InformationCard,
    Search,
  },
  created() {
    // this.getUsers();
    console.log("Partner Info", this.partnerInfo);
    if (this.partnerInfo.countries) {
      this.setSearchConfig(this.partnerInfo.countries);
    }
  },
  data: () => ({
    search_text: "",
    placeholder: "Search Employees",
  }),
  methods: {
    queryString(data) {
      this.search_text = data;
      this.getUsers();
    },
    advanceSearch(filterObject) {
      // make changes here to the filterObject
      // this.getUsers();
    },
    setSearchConfig(countries = []) {
      /*
       * Name of Employee - Text field - string or number - can this be empty
       * Designation of Employee - Text field - string or number - can this be empty
       * Countries - Dropdown multi Autocomplete - need some default filter provision. - can be empty in this case but not in specific cases
       */
      this.selectedSearchConfig = [
        {
          name: "Employee Name",
          key: "name",
          type: "text",
          inputType: "textfield",
          defaultValue: "",
        },
        {
          name: "Designation",
          key: "designation",
          type: "text",
          inputType: "textfield",
          defaultValue: "",
        },
        {
          name: "Country",
          key: "country",
          multi: false,
          inputType: "dropdown",
          defaultValue: [],
          isListInStore: false,
          listItems: countries,
        },
      ];
    },
  },
  watch: {
    partnerInfo: {
      deep: true,
      handler(nv, ov) {
        console.log("Handler");
        if (nv.countries) {
          this.setSearchConfig(nv.countries);
        }
      },
    },
  },
  props: {
    partnerInfo: { required: true, type: Object },
  },
};
</script>
<style lang="scss" scoped>
.partnerEmployeesWrapper {
  background-color: white;
  height: 100%;
}
</style>
