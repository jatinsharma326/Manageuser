<template>
  <div class="">
    <!-- <Users v-bind="{ ...ele.props }"></Users> -->
    <div class="card-wrapper">
      <div v-for="user in userList" :key="user._id" class="card-element">
        <InformationCard :expandCard="true">
          <template v-slot:topLeft>
            {{ user.business_type.join(", ") }}
          </template>
          <template v-slot:mainContent>
            {{ user.name }}
          </template>
          <template v-slot:mainContentSubtitle>
            {{ user.proprietor_info }}
          </template>
          <template v-slot:mainContentRight>
            {{ user.logo }}
          </template>
          <template v-slot:moreInfo>
            {{ user.countries.join(", ") }}
          </template>
          <template v-slot:actionButtons>
            <template v-if="userType == ADMIN">
              <v-btn @click="disableUser(user)" color="error" text>
                {{ user.record.active ? "Disable" : "Enable" }}
              </v-btn>
              <v-btn
                @click="openInputForm(true, user)"
                color="secondary lighten-2"
                text
              >
                Edit
              </v-btn>
              <v-btn color="primary lighten-2" text>
                View
              </v-btn>
            </template>
          </template>
          <template v-slot:expandCardContent>
            <v-list>
              <v-list-item
                v-for="(contact, index) in user.emergency_contacts"
                :key="user._id + '+' + index"
                two-line
              >
                <v-list-item-icon>
                  <v-icon color="indigo">
                    mdi-phone
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ contact.contacts }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    contact.country
                  }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-divider inset></v-divider>
              </v-list-item>
            </v-list>
          </template>
        </InformationCard>
      </div>
    </div>
    <!-- <div v-for="(fields, key) in schema" class="">{{ fields }} : {{ key }}</div> -->

    <!-- <UserForm
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
    </div> -->
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
    userList: [
      {
        _id: "5f8579099618e43f60826225",
        name: "Allied Partners",
        proprietor_info: "Info 1",
        business_type: ["FIT", "GIT"],
        countries: ["United States", "Egypt"],
        emergency_contacts: [
          {
            country: "United States",
            contacts: ["123456789", "987654321"],
          },
        ],
        logo: "base_64_string",
        record: {
          created_on: "2020-10-13T09:53:13.958Z",
          updated_on: "2020-10-13T11:01:45.456Z",
          active: false,
        },
      },
      {
        _id: "5f857a9ad8a96c2e4ca6e7c5",
        name: "Allied Partneras",
        proprietor_info: "Info 1",
        business_type: ["FIT", "GIT"],
        countries: ["United States", "Egypt"],
        emergency_contacts: [
          {
            country: "Egypt",
            contacts: ["123456789", "987654321"],
          },
        ],
        logo: "base_64_string",
        record: {
          created_on: "2020-10-13T09:59:54.919Z",
          updated_on: "2020-10-13T09:59:54.919Z",
          active: true,
        },
      },
      {
        _id: "5f8582dc382e8941905682c8",
        name: "Allied P",
        proprietor_info: "Info 1",
        business_type: ["FIT", "GIT"],
        countries: ["United States", "Egypt"],
        emergency_contacts: [
          {
            country: "Egypt",
            contacts: ["123456789", "987654321"],
          },
        ],
        logo: "base_64_string",
        record: {
          created_on: "2020-10-13T10:35:08.048Z",
          updated_on: "2020-10-13T10:35:08.048Z",
          active: true,
        },
      },
    ],

    search_text: "",
    partnerConfig: [
      {
        name: "Representing Partner",
        type: "sales_agent",
        placeholder: "Search Partner Info",
        inputConfig: [
          {
            name: "Partner Name",
            type: "String",
            key: "name",
            width: "half",
            validations: {
              required,
              minLength: minLength(1),
            },
          },
          {
            name: "Proprietor Info",
            type: "String",
            key: "proprietor_info",
            width: "full",
            validations: {
              required,
              minLength: minLength(10),
            },
          },
          {
            name: "Countries",
            type: "Dropdown",
            key: "countries",
            width: "half",
            multi: true,
            listVariable: "countries",
            validations: {
              required,
            },
          },
          {
            name: "Business Type",
            type: "Dropdown",
            key: "business_type",
            width: "half",
            multi: true,
            listVariable: "partners",
            validations: {
              required,
            },
          },
          {
            name: "Emergency Numbers",
            type: "MultiInput",
            key: "emergency_contacts",
            width: "half",
            validations: {
              required,
              minLength: minLength(1),
              $each: {
                input: {
                  required,
                  minLength: minLength(8),
                },
              },
            },
          },
        ],
      },
    ],
    pageSize: 20,
    pageNo: 1,
    totalCount: 0,
    fetchCount: 0,
    toggleForm: false,
    isEditMode: false,
    rowToEdit: {},
  }),
  created() {
    // this.getUsers();
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
    ...mapActions("UserManagement", [
      "getUserList",
      "addUser",
      "editUser",
      "resetPassword",
    ]),
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
        this.editUser(formData).then((data) => {
          if (data.ok) {
            console.log("Edit user success");
            this.getUsers();
            this.closeForm();
          } else {
            console.log("Edit user failed");
          }
        });
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
    disableUser(data) {
      this.editUser({ _id: data._id, active: !data.record.active }).then(
        (data) => {
          if (data.ok) {
            console.log("Failed to Update user status");
            this.getUsers();
            this.closeForm();
          } else {
            console.log("Failed to Update user status");
          }
        }
      );
    },
    userPasswordReset(data) {
      this.resetPassword({ username: data.credentials.username }).then(
        (data) => {
          if (data.ok) {
            console.log("Failed to Reset Password");
            this.getUsers();
            this.closeForm();
          } else {
            console.log("Failed to Reset Password");
          }
        }
      );
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
