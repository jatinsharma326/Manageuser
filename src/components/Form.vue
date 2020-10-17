<template>
  <v-dialog v-model="form" width="600px" persistent>
    <div class="form-wrapper">
      <div class="headline">
        <div class="">{{ isEditMode ? "Edit " : "Add " }}{{ name }}</div>
      </div>
      <div v-show="showError" id="error-container" class="error-container">
        {{ errorText }}
      </div>
      <div class="form-input">
        <template v-for="(config, index) in inputConfig">
          <v-text-field
            v-if="config.type == 'String'"
            :label="config.name"
            :key="config.name + '__' + index"
            v-model="formElements[config.key]"
            class="form-item"
          ></v-text-field>
          <template v-if="config.type == 'Dropdown'">
            <v-autocomplete
              :key="config.name + '__' + index"
              :label="config.name"
              v-model="formElements[config.key]"
              chips
              clearable
              :items="getItems(config)"
              :multiple="config.multi"
              class="form-item"
            ></v-autocomplete>
          </template>
          <template v-if="config.type == 'Date'">
            <div
              :key="config.name + '__' + index"
              class="date-picker form-item"
            >
              <v-menu
                :ref="config.key"
                v-model="dateMenuRef[config.key]"
                :key="config.name + '__' + index"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formElements[config.key]"
                    :label="config.name"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formElements[config.key]"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="dateMenuRef[config.key] = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    @click="dateMenuRef[config.key] = false"
                    text
                    color="primary"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </div>
          </template>

          <template v-if="config.type == 'MultiInput'">
            <template v-for="(input, mulIndex) in formElements[config.key]">
              <div
                :key="config.name + '__' + index + '__' + mulIndex"
                class="multi-input-field form-item"
              >
                <v-text-field
                  :value="formElements[config.key][mulIndex].input"
                  :label="config.name"
                  @blur="
                    updateMultiInputObject(
                      $event.target.value,
                      config,
                      mulIndex
                    )
                  "
                ></v-text-field>
              </div>
            </template>
            <div
              :key="config.name + '__' + index + '__buttons'"
              class="multi-input-buttons"
            >
              <v-btn
                @click="removeMultiInputField(config)"
                :key="config.name + '__' + index + '__remove'"
                depressed
                color="error"
                small
                text
                :disabled="formElements[config.key].length == 1"
                >Remove</v-btn
              >
              <v-btn
                @click="addMultiInputField(config)"
                :key="config.name + '__' + index + '__add'"
                depressed
                color="primary"
                small
                class="ml-2"
                >Add</v-btn
              >
            </div>
          </template>
        </template>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="closeForm()">
          Cancel
        </v-btn>
        <v-btn color="primary" text @click="formValidation">
          Submit
        </v-btn>
      </v-card-actions>
    </div>
  </v-dialog>
</template>

<script>
import {
  required,
  email,
  minLength,
  numeric,
  alpha,
} from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
// import moment from "moment-timezone";
import helpers from "./helpers";
export default {
  name: "Form",
  components: {},
  data: () => ({
    form: false,
    showError: false,
    errorText: false,
    formElements: {},
    dateMenuRef: {},
    errorMessages: {
      required: {
        type: "normal",
        msg: (name) => `${name} is a Required Field`,
      },
      alpha: { type: "normal", msg: (name) => `${name} can only be Alphabets` },
      numeric: { type: "normal", msg: (name) => `${name} can only be Numbers` },
      minLength: {
        type: "conditional",
        msg: (name, condition) =>
          `${name} needs to have a minimum of length of ${condition}`,
        conditionKey: "min",
      },
      maxLength: {
        type: "conditional",
        msg: (name, condition) =>
          `${name} needs to have a minimum of length of ${condition}`,
        conditionKey: "max",
      },
      email: { type: "normal", msg: (name) => `${name} is not a valid email` },
    },
  }),
  created() {
    this.initialiseFormElements();
  },
  mounted() {},
  computed: {
    ...mapGetters(["countries", "partners", "zone"]),
  },
  methods: {
    // ...mapActions("UserManagement", ["getUserList"]),
    formValidation() {
      this.showError = false;
      this.errorText = false;
      this.$v.$touch();
      if (this.$v.$invalid) {
        for (let config of this.inputConfig) {
          console.log(config.name, this.$v.formElements);
          if (
            this.$v.formElements[config.key] &&
            this.$v.formElements[config.key].$invalid
          ) {
            console.log(config);
            console.log(this.$v.formElements[config.key]);
            for (let param in this.$v.formElements[config.key].$params) {
              if (
                param != "$each" &&
                !this.$v.formElements[config.key][param]
              ) {
                if (this.errorMessages[param].type == "conditional") {
                  this.errorText = this.errorMessages[param].msg(
                    config.name,
                    this.$v.formElements[config.key].$params[param][
                      this.errorMessages[param].conditionKey
                    ]
                  );
                } else {
                  this.errorText = this.errorMessages[param].msg(config.name);
                  console.log(this.errorText);
                }
              }
            }
            if (!this.errorText) {
              this.errorText = config.name + " is incorrect";
            }
            this.showError = true;
            break;
          }
        }
        this.$vuetify.goTo("#error-container", {
          duration: 300,
        });
        return false;
      } else {
        if (!this.isEditMode) {
          this.$emit("formOutput", this.formElements);
        } else {
          this.$emit("formOutput", {
            ...this.formElements,
            _id: this.formData._id,
          });
        }
        return true;
      }
    },
    getItems(config) {
      return this[config.listVariable];
    },
    updateMultiInputObject(value, config, mulIndex) {
      console.log(value, config, mulIndex);
      this.formElements[config.key][mulIndex].input = value;
    },
    removeMultiInputField(config) {
      if (this.formElements[config.key].length > 1) {
        this.formElements[config.key].pop({ input: "" });
      }
    },
    addMultiInputField(config) {
      this.formElements[config.key].push({ input: "" });
    },
    closeForm() {
      this.$emit("closeForm");
    },
    initialiseFormElements() {
      for (let i of this.inputConfig) {
        if (!this.isEditMode) {
          // This will initialize the form when add user button is clicked
          if (i.type == "MultiInput") {
            this.$set(this.formElements, i.key, [{ input: "" }]);
          } else {
            this.$set(this.formElements, i.key, null);
          }

          if (i.type == "Date") {
            this.$set(this.dateMenuRef, i.key, false);
          }
        } else {
          // This will initialize the form when Edit user button is clicked
          if (i.type == "MultiInput") {
            this.$set(
              this.formElements,
              i.key,
              this.formData[i.key].map((e) => ({
                input: e,
              }))
            );
          } else if (i.type == "Date") {
            this.$set(
              this.formElements,
              i.key,
              helpers.getFormattedDate(this.formData[i.key], "YYYY-MM-DD")
            );
          } else {
            this.$set(this.formElements, i.key, this.formData[i.key]);
          }

          console.log(this.formElements);

          if (i.type == "Date") {
            this.$set(this.dateMenuRef, i.key, false);
          }
        }
      }
    },
  },
  validations() {
    let tempObj = {};
    for (let i of this.inputConfig) {
      if (i.validations) {
        tempObj[i.key] = i.validations;
      }
    }
    return { formElements: tempObj };
  },
  props: {
    name: { required: true, type: String },
    type: { required: true, type: String },
    inputConfig: { required: true, type: Array },
    toggleForm: { required: true, type: Boolean, default: false },
    formData: { required: true, type: Object },
    isEditMode: { required: true, type: Boolean, default: false },
  },
  watch: {
    toggleForm(nv, ov) {
      this.form = nv;
      this.initialiseFormElements();
    },
  },
};
</script>

<style lang="scss" scoped>
.error-container {
  margin-top: 8px;
  margin-bottom: 16px;
  // width: 300px;
  background: #ff5d5d1a 0% 0% no-repeat padding-box;
  border-radius: 5px;
  color: $error;
  padding: 10px 37px;
}
.form-wrapper {
  padding: 20px 30px;
  background: white;

  .headline {
    font-size: 32px;
    font-weight: 700;
  }

  .form-item {
    padding: 5px;
  }

  .form-input {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .date-picker {
    flex-basis: 50%;
    @include media-breakpoint-up(xs) {
      flex-basis: 100%;
    }
  }
  .multi-input-field {
    flex-basis: 100%;
  }
  .multi-input-buttons {
    flex-basis: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
