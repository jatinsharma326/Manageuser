<template>
  <div class="partnerEmployeesWrapper">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ partnerInfo.name }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialog = false">
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-card>
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
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
  watch: {},
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
