<template>
  <div class="partnersWrapper">
    <!-- <Users v-bind="{ ...ele.props }"></Users> -->
    <v-row class="px-6" justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <!-- @queryString="queryString" -->
        <Search
          @queryString="queryString"
          @filterObject="advanceSearch"
          @clearFilter="advanceSearch"
          :placeholder="placeholder"
          :isAdvanceSearch="true"
          :filterConfig="selectedSearchConfig"
        ></Search>
      </v-col>
    </v-row>

    <div class="card-wrapper">
      <div v-for="user in partnerList" :key="user._id" class="card-element">
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
            <div class="card-image">
              <img :src="user.logo" alt="" />
            </div>
          </template>
          <template v-slot:moreInfo>
            {{ user.countries.join(", ") }}
          </template>
          <template v-slot:actionButtons>
            <template v-if="userType == ADMIN">
              <v-btn @click="disablePartner(user)" color="error" text>
                {{ user.record.active ? "Disable" : "Enable" }}
              </v-btn>
              <v-btn
                @click="openInputForm(true, user)"
                color="secondary lighten-2"
                text
              >
                Edit
              </v-btn>
              <v-btn
                @click="openEmployeeModal(user)"
                color="primary lighten-2"
                text
              >
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
                  <v-list-item-title>{{
                    contact.contacts.join(", ")
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    contact.country
                  }}</v-list-item-subtitle>
                </v-list-item-content>
                <!-- <v-divider inset></v-divider> -->
              </v-list-item>
            </v-list>
          </template>
        </InformationCard>
      </div>
    </div>

    <div class="text-center">
      <v-pagination
        @input="updatedPageNo"
        v-model="pageNo"
        :length="Math.ceil(fetchCount / pageSize)"
      ></v-pagination>
    </div>

    <ViewMoreModal
      @closeModal="employeesModal = false"
      :toggleModal="employeesModal"
    >
      <template v-slot:modalTitle>
        <div v-if="selectedPartnerInfo.name">
          {{ selectedPartnerInfo.name }}
        </div>
      </template>
      <template v-slot:modalSubtitle>
        <div v-if="selectedPartnerInfo.business_type">
          {{ selectedPartnerInfo.business_type.join("/ ") }}
        </div>
      </template>
      <template v-slot:modalContent>
        <partnerEmployees :partnerInfo="selectedPartnerInfo"></partnerEmployees>
      </template>
    </ViewMoreModal>

    <UserForm
      @formOutput="formOutput"
      @closeForm="closeForm"
      :name="name"
      :inputConfig="inputConfig"
      :keysToWatch="keysToWatch"
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
import {
  required,
  email,
  minLength,
  numeric,
  alpha,
} from "vuelidate/lib/validators";
import { mapActions, mapGetters, mapMutations } from "vuex";
// import moment from "moment-timezone";
import helpers from "../../components/helpers";
import InformationCard from "../../components/InformationCard.vue";
import Search from "../../components/Search.vue";
import UserForm from "../../components/Form";
import PartnerEmployees from "./PartnerEmployees";
import ViewMoreModal from "../../components/ViewMoreModal";

export default {
  name: "Partners",
  components: {
    InformationCard,
    Search,
    UserForm,
    PartnerEmployees,
    ViewMoreModal,
  },
  created() {
    // this.getPartners();
    this.setSearchConfig();
  },
  data: () => ({
    partnerList: [
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
        logo: "",
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
        logo: "",
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
        logo: "",
        record: {
          created_on: "2020-10-13T10:35:08.048Z",
          updated_on: "2020-10-13T10:35:08.048Z",
          active: true,
        },
      },
    ],
    search_text: "",
    name: "Representing Partner",
    keysToWatch: ["countries"],
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
          minLength: minLength(1),
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
        listVariable: "businessType",
        validations: {
          required,
        },
      },
      {
        name: "Partner Logo",
        type: "FilePicker",
        key: "logo",
        width: "half",
        acceptRules: "image/png, image/jpeg, image/bmp",
        rules: [
          (value) =>
            !value ||
            value.size <= 100000 ||
            "Partner logo should be less than or equal to 100 kb!",
        ],
      },
      {
        name: "Emergency Numbers",
        type: "MultiInputWithGroupKey",
        key: "emergency_contacts",
        width: "half",
        keyToGroup: "countries",
      },
    ],
    pageSize: 20,
    pageNo: 1,
    totalCount: 0,
    fetchCount: 0,
    toggleForm: false,
    isEditMode: false,
    rowToEdit: {},
    employeesModal: false,
    selectedPartnerInfo: {},
    placeholder: "Search Partners",
    selectedSearchConfig: [],
    filter: {},
  }),
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
    ...mapActions("PartnerManagement", [
      "getPartnerList",
      "addPartner",
      "editPartner",
    ]),
    ...mapMutations(["openLoaderDialog", "closeLoaderDialog"]),
    getPartners() {
      this.openLoaderDialog();
      this.getPartnerList({
        filter: this.filter,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      }).then((data) => {
        this.closeLoaderDialog();
        this.partnerList = data.list;
        this.totalCount = data.totalCount;
        this.fetchCount = data.fetchCount;
      });
    },
    queryString(data) {
      this.filter["search_text"] = data;
      this.getPartners();
    },
    advanceSearch(filterObject) {
      this.filter = { ...filterObject };
      this.pageNo = 1;
      // this.getPartners();
    },
    async formOutput(data) {
      var formData = JSON.parse(JSON.stringify(data));
      var tempArray = [];
      var tempObj = {};

      // loop over the emergency contacts objects to convert it into theh backend format
      for (let contact of formData.emergency_contacts) {
        tempObj = {};
        for (let num of contact.input) {
          if (num.input != "") {
            tempObj["country"] = contact.groupKey;
            if (!tempObj["contacts"]) tempObj["contacts"] = [];
            tempObj["contacts"].push(num.input);
          }
        }
        if (Object.keys(tempObj).length) {
          tempArray.push(tempObj);
        }
      }
      formData.emergency_contacts = tempArray;

      // remove logo key if it's empty
      if (formData.logo) {
        formData.logo = await helpers.toBase64(formData.logo);
      } else {
        delete formData.logo;
      }

      console.log("Before API call FormData Object", formData);

      this.openLoaderDialog();
      if (!this.isEditMode) {
        this.addPartner(formData).then((data) => {
          this.closeLoaderDialog();
          if (data.ok) {
            console.log("Add Partner success");
            this.getPartners();
            this.closeForm();
          } else {
            console.log("Add Partner failed");
          }
        });
      } else {
        this.editPartner(formData).then((data) => {
          this.closeLoaderDialog();
          if (data.ok) {
            console.log("Edit Partner success");
            this.getPartners();
            this.closeForm();
          } else {
            console.log("Edit Partner failed");
          }
        });
      }
    },
    openInputForm(mode = false, data = {}) {
      this.isEditMode = mode;
      if (this.isEditMode) {
        this.rowToEdit = {
          ...data,
          _id: data._id,
          updated_on: data.record.updated_on,
        };
      }
      this.toggleForm = true;
    },
    closeForm() {
      this.rowToEdit = {};
      this.isEditMode = false;
      this.toggleForm = false;
    },
    disablePartner(data) {
      if (
        window.confirm(
          "Do you really want to " +
            (data.record.active ? "Disable the User?" : "Enable the User?")
        )
      ) {
        this.openLoaderDialog();
        this.editPartner({
          _id: data._id,
          active: !data.record.active,
          updated_on: data.record.updated_on,
        }).then((data) => {
          this.closeLoaderDialog();
          if (data.ok) {
            console.log("Updated Partner status");
            this.getUsers();
            this.closeForm();
          } else {
            console.log("Failed to Update Partner status");
          }
        });
      }
    },
    openEmployeeModal(userData) {
      this.selectedPartnerInfo = { ...userData };
      // console.log(this.selectedPartnerInfo);
      this.employeesModal = true;
    },
    setSearchConfig() {
      /*
       * Name of Partner - Text field - string or number - can this be empty?
       * Business Type - Dropdown multi Autocomplete - need some default filter provision. - can be empty in this case but not in specific cases
       * Countries - Dropdown multi Autocomplete - need some default filter provision. - can be empty in this case but not in specific cases
       */
      this.selectedSearchConfig = [
        {
          name: "Partner Name",
          key: "name",
          type: "text",
          inputType: "textfield",
          defaultValue: "",
        },
        {
          name: "Business Type",
          key: "business_type",
          multi: true,
          inputType: "dropdown",
          defaultValue: [],
          isListInStore: true,
          listVariable: "businessType",
        },
        {
          name: "Countries",
          key: "countries",
          multi: true,
          inputType: "dropdown",
          defaultValue: [],
          isListInStore: true,
          listVariable: "countries",
        },
      ];
    },
    updatedPageNo(page) {
      // console.log("Page", page);
      // console.log("Page Number", this.pageNo);
    },
  },
};
</script>

<style lang="scss" scopped>
.partnersWrapper {
  padding: 20px 5px;
}
.card-image img {
  max-width: 100%;
}
</style>

<style lang="scss">
.partnersWrapper .v-list-item__title,
.v-list-item__subtitle {
  white-space: normal;
}
</style>
