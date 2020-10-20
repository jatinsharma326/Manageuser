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

    <div
      v-for="(country, countryIndex) in partnerInfo.countries"
      :key="country + '__' + countryIndex"
      class="card-wrapper"
    >
      <div class="country-title">{{ country }}</div>
      <div v-for="user in employeesList" :key="user._id" class="card-element">
        <InformationCard v-if="country == user.country" :expandCard="true">
          <template v-slot:mainContent>
            {{ user.name }}
          </template>
          <template v-slot:mainContentSubtitle>
            {{ user.designation }}
          </template>
          <template v-slot:moreInfo>
            {{ user.country }}
          </template>
          <template v-slot:actionButtons>
            <template v-if="userType == ADMIN">
              <v-btn @click="deleteEmployee(user)" color="error" text>
                Delete
              </v-btn>
              <v-btn
                @click="openInputForm(true, user)"
                color="secondary lighten-2"
                text
              >
                Edit
              </v-btn>
            </template>
          </template>
          <template v-slot:expandCardContent>
            <v-list>
              <v-list-item
                v-for="(number, index) in user.mobile_number"
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

              <v-list-item
                v-for="(email, index) in user.email_id"
                :key="user._id + '+' + index + 'Email'"
              >
                <v-list-item-icon>
                  <v-icon v-if="index == 0" color="indigo">
                    mdi-email
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ email }}</v-list-item-title>
                </v-list-item-content>
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

    <UserForm
      @formOutput="formOutput"
      @closeForm="closeForm"
      :name="name"
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
import {
  required,
  email,
  minLength,
  numeric,
  alpha,
} from "vuelidate/lib/validators";
import { mapActions, mapGetters, mapMutations } from "vuex";
import InformationCard from "../../components/InformationCard.vue";
import Search from "../../components/Search.vue";
import UserForm from "../../components/Form";

// import helpers from "../../components/helpers";

export default {
  name: "PartnerEmployee",
  components: {
    InformationCard,
    Search,
    UserForm,
  },
  created() {
    // this.getEmployees();
    console.log("Partner Info", this.partnerInfo);
    if (this.partnerInfo.countries) {
      this.setSearchConfig(this.partnerInfo.countries);
      this.setInputConfig(this.partnerInfo.countries);
    }
  },
  data: () => ({
    employeesList: [
      {
        _id: "5f8e8f36bbaf403c3cf40e47",
        representing_partner_id: "5f857a9ad8a96c2e4ca6e7c5",
        name: "Sachin Tendulkar",
        designation: "SS",
        country: "United States",
        phone_numbers: ["123", "321300"],
        email_id: ["eassa@tese.com", "fasda@fcsa.in"],
        record: {
          created_on: "2020-10-20T07:18:14.082Z",
          updated_on: "2020-10-20T07:18:14.082Z",
          active: true,
        },
      },
      {
        _id: "5f8e8f36bbaf403c3cf41e47",
        representing_partner_id: "5f857a9ad8a96c2e4ca6e7c5",
        name: "Sachin Tendulkar",
        designation: "SS",
        country: "Egypt",
        phone_numbers: ["123", "321300"],
        email_id: ["eassa@tese.com", "fasda@fcsa.in"],
        record: {
          created_on: "2020-10-20T07:18:14.082Z",
          updated_on: "2020-10-20T07:18:14.082Z",
          active: true,
        },
      },
      {
        _id: "5f8e8f36bbaf413c3cf40e47",
        representing_partner_id: "5f857a9ad8a96c2e4ca6e7c5",
        name: "Sachin Tendulkar",
        designation: "SS",
        country: "United States",
        phone_numbers: ["123", "321300"],
        email_id: ["eassa@tese.com", "fasda@fcsa.in"],
        record: {
          created_on: "2020-10-20T07:18:14.082Z",
          updated_on: "2020-10-20T07:18:14.082Z",
          active: true,
        },
      },
    ],
    search_text: "",
    placeholder: "Search Employees",
    name: "Representing Partner Employees",
    inputConfig: [
      {
        name: "Employee Name",
        type: "String",
        key: "name",
        width: "half",
        validations: {
          required,
          minLength: minLength(1),
        },
      },
      {
        name: "Designation",
        type: "String",
        key: "designation",
        width: "full",
        validations: {
          required,
          minLength: minLength(1),
        },
      },
      {
        name: "Country",
        type: "Dropdown",
        key: "country",
        width: "half",
        multi: false,
        listVariable: "countries",
        isListInStore: false,
        // listItems: countries,
        validations: {
          required,
        },
      },
      {
        name: "Contact Info",
        type: "MultiInput",
        key: "phone_numbers",
        width: "half",
        validations: {
          required,
          minLength: minLength(1),
          $each: {
            input: {
              required,
            },
          },
        },
      },
      {
        name: "Email",
        type: "MultiInput",
        key: "email_id",
        width: "half",
        validations: {
          required,
          minLength: minLength(1),
          $each: {
            input: {
              required,
            },
          },
        },
      },
    ],
    pageSize: 20,
    pageNo: 1,
    totalCount: 0,
    fetchCount: 0,
    toggleForm: false,
    isEditMode: false,
    rowToEdit: {},
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
      "getPartnerEmployeesList",
      "addPartnerEmployees",
      "editPartnerEmployees",
      "deletePartnerEmployees",
    ]),
    ...mapMutations(["openLoaderDialog", "closeLoaderDialog"]),
    getEmployees() {
      this.openLoaderDialog();
      this.getPartnerEmployeesList({
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
      // this.getEmployees();
    },
    advanceSearch(filterObject) {
      // make changes here to the filterObject
      this.filter = { ...filterObject };
      this.pageNo = 1;
      // this.getEmployees();
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
    setInputConfig(countries = []) {
      this.inputConfig = [
        {
          name: "Employee Name",
          type: "String",
          key: "name",
          width: "half",
          validations: {
            required,
            minLength: minLength(1),
          },
        },
        {
          name: "Designation",
          type: "String",
          key: "designation",
          width: "full",
          validations: {
            required,
            minLength: minLength(1),
          },
        },
        {
          name: "Country",
          type: "Dropdown",
          key: "country",
          width: "half",
          multi: false,
          isListInStore: false,
          listItems: countries,
          validations: {
            required,
          },
        },
        {
          name: "Contact Info",
          type: "MultiInput",
          key: "phone_numbers",
          width: "half",
          validations: {
            required,
            minLength: minLength(1),
            $each: {
              input: {
                required,
              },
            },
          },
        },
        {
          name: "Email",
          type: "MultiInput",
          key: "email_id",
          width: "half",
          validations: {
            required,
            minLength: minLength(1),
            $each: {
              input: {
                required,
              },
            },
          },
        },
      ];
    },
    formOutput(data) {
      var formData = JSON.parse(JSON.stringify(data));
      // var tempArray = [];
      // var tempObj = {};
      formData.phone_numbers = data.phone_numbers.map((data) => data.input);
      formData.email_id = data.email_id.map((data) => data.input);
      console.log("Before API call FormData Object", formData);

      this.openLoaderDialog();
      if (!this.isEditMode) {
        this.addPartnerEmployees(formData).then((data) => {
          this.closeLoaderDialog();
          if (data.ok) {
            console.log("Add Partner Employee success");
            this.getPartners();
            this.closeForm();
          } else {
            console.log("Add Partner Employee failed");
          }
        });
      } else {
        this.editPartnerEmployees(formData).then((data) => {
          this.closeLoaderDialog();
          if (data.ok) {
            console.log("Edit Partner Employee success");
            this.getPartners();
            this.closeForm();
          } else {
            console.log("Edit Partner Employee failed");
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
    updatedPageNo(page) {
      // console.log("Page", page);
      // console.log("Page Number", this.pageNo);
    },
    deleteEmployee(user) {
      console.log("Delete User");
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
