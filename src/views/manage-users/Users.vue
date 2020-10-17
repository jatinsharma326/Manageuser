<template>
  <div class="usersComponentWrapper">
    <v-row class="px-6" justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <Search @queryString="queryString" :placeholder="placeholder"></Search>
      </v-col>
    </v-row>

    <div class="card-wrapper">
      <div v-for="user in userList" :key="user._id" class="card-element">
        <InformationCard :expandCard="true">
          <template v-slot:topLeft>
            {{ user.usr_data.designation }}
          </template>
          <template v-slot:topRight>
            {{ getFormattedDate(user.usr_data.dob) }}
          </template>
          <template v-slot:mainContent>
            {{ user.usr_data.name }}
          </template>
          <template v-slot:mainContentSubtitle>
            {{ getMainContentSubtitle(user) }}
          </template>
          <!-- <template v-slot:mainContentRight>
            Grade/ Logo
          </template>
          <template v-slot:moreInfo>
            More Information Goes here. More Information Goes here.
          </template> -->
          <template v-slot:actionButtons>
            <!-- <v-btn icon color="primary lighten-2" text
              ><v-icon>mdi-information-outline</v-icon></v-btn
            > -->
            <template v-if="userType == ADMIN">
              <v-btn color="orange lighten-2" text>
                Reset Password
              </v-btn>
              <v-btn color="error" text>
                Disable
              </v-btn>
              <v-btn
                @click="openInputForm(true, user)"
                color="primary lighten-2"
                text
              >
                Edit
              </v-btn>
            </template>
          </template>
          <template v-slot:expandCardContent>
            <v-list>
              <v-list-item
                v-for="(number, index) in user.usr_data.phone_numbers"
                :key="user._id + '+' + index"
              >
                <v-list-item-icon>
                  <v-icon v-if="index == 0" color="indigo">
                    mdi-phone
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="indigo">
                    mdi-email
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{
                    user.usr_data.email
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <template v-if="user.type == SALES_AGENT">
                <v-list-item
                  v-for="(partner, index) in user.usr_data
                    .representing_partner_ids"
                  :key="user._id + '+' + index + '+' + partner.value"
                >
                  <v-list-item-icon>
                    <v-icon v-if="index == 0" color="indigo">
                      mdi-account
                    </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ partner.text }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider inset></v-divider>
              </template>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="indigo">
                    mdi-map-marker
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{
                    user.usr_data.address
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </template>
        </InformationCard>
      </div>
    </div>
    <!-- <div v-for="(fields, key) in schema" class="">{{ fields }} : {{ key }}</div> -->

    <UserForm
      @formOutput="formOutput"
      @closeForm="closeForm"
      :name="name"
      :type="type"
      :inputConfig="inputConfig"
      :toggleForm="toggleForm"
      :formData="rowToEdit"
      :isEditMode="isEditMode"
    ></UserForm>

    <div class="floating-button">
      <v-btn @click="openInputForm()" color="primary" dark fab>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
// import moment from "moment-timezone";
import helpers from "../../components/helpers";
import InformationCard from "../../components/InformationCard.vue";
import Search from "../../components/Search.vue";
import UserForm from "../../components/Form";

export default {
  name: "Users",
  components: {
    InformationCard,
    Search,
    UserForm,
  },
  data: () => ({
    userList: [],
    search_text: "",
    pageSize: 20,
    pageNo: 1,
    totalCount: 0,
    fetchCount: 0,
    toggleForm: false,
    isEditMode: false,
    rowToEdit: {},
  }),
  created() {
    this.getUsers();
  },
  computed: {
    ...mapGetters([
      "REMOTE_SALES_AGENT",
      "SALES_AGENT",
      "MANAGEMENT",
      "ADMIN",
      "userType",
    ]),
  },
  methods: {
    ...mapActions("UserManagement", ["getUserList", "addUser"]),
    getUsers() {
      this.getUserList({
        filter: {
          type: this.type,
        },
        search_text: this.search_text,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      }).then((data) => {
        console.log(data);
        this.userList = data.userList;
        this.totalCount = data.totalCount;
        this.fetchCount = data.fetchCount;
      });
    },
    getFormattedDate(date) {
      return helpers.getFormattedDate(date, "DD/MM/YYYY");
    },
    getISODate(date) {
      return helpers.getISODate(date);
    },
    getMainContentSubtitle(user) {
      if (user.type == this.SALES_AGENT) {
        return user.usr_data.countries.join(", ");
      } else if (user.type == this.REMOTE_SALES_AGENT) {
        return user.usr_data.zone;
      }
      return "";
    },
    queryString(data) {
      this.search_text = data;
      this.getUsers();
    },
    formOutput(data) {
      console.log(data);
      var formData = { ...data };
      formData.type = this.type;
      formData.dob = this.getISODate(formData.dob);
      formData.doj = this.getISODate(formData.doj);
      if (formData.doe) {
        formData.doe = this.getISODate(formData.dob);
      } else {
        delete formData.doe;
      }
      formData.phone_numbers = data.phone_numbers.map((data) => data.input);
      console.log(formData);

      if (!this.isEditMode) {
        this.addUser(formData).then((data) => {
          if (data.ok) {
            console.log("Add user success");
            this.getUsers();
            this.closeForm();
          } else {
            console.log("Add user failed");
          }
        });
      } else {
        // made edit API call here
      }
    },
    openInputForm(mode = false, data = {}) {
      console.log(data);
      this.isEditMode = mode;
      this.rowToEdit = { ...data.usr_data, _id: data._id };
      this.toggleForm = true;
    },
    closeForm() {
      this.toggleForm = false;
    },
  },
  props: {
    name: { required: true, type: String },
    type: { required: true, type: String },
    placeholder: { required: true, type: String },
    inputConfig: { required: true, type: Array },
  },
};
</script>

<style lang="scss" scopped>
.usersComponentWrapper {
  position: relative;
  width: 100%;
}
.card-wrapper {
  //   display: flex;
  //   justify-content: flex-start;
  //   flex-wrap: wrap;
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 16px;

  .card-element {
    // flex: 1 0 400px;
    // margin: 16px 10px;
  }
}
.floating-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
}
</style>
