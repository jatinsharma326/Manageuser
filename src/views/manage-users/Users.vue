<template>
	<div class="usersComponentWrapper primary-background-color">
		<v-row class="px-6 manageusers-search-bar " justify="center" align="center">
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
							<v-btn @click="userPasswordReset(user)" color="orange lighten-2" text>
								Reset
							</v-btn>
							<v-btn @click="disableUser(user)" color="error" text>
								{{ user.record.active ? "Disable" : "Enable" }}
							</v-btn>
							<v-btn @click="openInputForm(true, user)" color="primary lighten-2" text>
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
									<v-list-item-title>{{ user.usr_data.email }}</v-list-item-title>
								</v-list-item-content>
							</v-list-item>

							<v-divider inset></v-divider>

							<template v-if="user.type == SALES_AGENT">
								<v-list-item
									v-for="(partner, index) in user.usr_data.representing_partner_ids"
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
									<v-list-item-title>{{ user.usr_data.address }}</v-list-item-title>
								</v-list-item-content>
							</v-list-item>

							<v-divider></v-divider>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title>
										<div class="date-container">
											<div class="doj">DOJ: {{ getFormattedDate(user.usr_data.doj) }}</div>
											<div class="doe">
												DOE:
												{{
													user.usr_data.doe
														? getFormattedDate(user.usr_data.doe)
														: "--/--/----"
												}}
											</div>
										</div>
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</template>
				</InformationCard>
			</div>
		</div>

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

		<div v-if="userType == ADMIN" class="floating-button">
			<v-btn @click="openInputForm()" color="primary" dark fab>
				<v-icon>mdi-plus</v-icon>
			</v-btn>
		</div>
	</div>
</template>

<script>
	import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
	import helpers from "../../components/helpers";
	import { mapActions, mapGetters, mapMutations } from "vuex";

	export default {
		name: "Users",
		mixins: [defaultCRUDMixin],
		data: () => ({
			userList: [
				// {
				//   _id: "5f86e229249b154d40536494",
				//   record: {
				//     created_on: "2020-10-14T11:34:01.617Z",
				//     updated_on: "2020-10-14T11:34:01.617Z",
				//     active: true,
				//   },
				//   credentials: {
				//     username: "pocketwala.ali@gmail.com",
				//   },
				//   type: 30,
				//   owner: "5f758a8d90d2426336f37c44",
				//   usr_data: {
				//     name: "Aliasgar Pocketwala",
				//     dob: "2020-09-30T18:30:00.000Z",
				//     address: "Mazgaon",
				//     phone_numbers: ["9768835921"],
				//     email: "pocketwala.ali@gmail.com",
				//     designation: "SS",
				//     doj: "2020-09-30T18:30:00.000Z",
				//     doe: "2020-09-30T18:30:00.000Z",
				//     representing_partner_ids: [],
				//     countries: ["USA"],
				//     no_of_leaves: 26,
				//   },
				// },
				// {
				//   _id: "5f86f00568c8a450285d6f93",
				//   record: {
				//     created_on: "2020-10-14T12:33:09.032Z",
				//     updated_on: "2020-10-14T12:33:09.032Z",
				//     active: true,
				//   },
				//   credentials: {
				//     username: "skypunch@gmail.com",
				//   },
				//   type: 30,
				//   owner: "5f758a8d90d2426336f37c44",
				//   usr_data: {
				//     name: "Aliasgar Pocketwala",
				//     dob: "2020-09-30T18:30:00.000Z",
				//     address: "Mazgaon",
				//     phone_numbers: ["9768835921"],
				//     email: "skypunch@gmail.com",
				//     designation: "SS",
				//     doj: "2020-09-30T18:30:00.000Z",
				//     doe: "2020-09-30T18:30:00.000Z",
				//     representing_partner_ids: [
				//       {
				//         text: "Allied Partneras",
				//         value: "5f857a9ad8a96c2e4ca6e7c5",
				//       },
				//     ],
				//     countries: ["United States"],
				//     no_of_leaves: 26,
				//   },
				// },
				// {
				//   _id: "5f899e04c0f5464a64a301ab",
				//   record: {
				//     created_on: "2020-10-16T13:20:04.748Z",
				//     updated_on: "2020-10-16T13:20:04.748Z",
				//     active: true,
				//   },
				//   credentials: {
				//     username: "hsuhhuhu@huhhu.com",
				//   },
				//   type: 30,
				//   owner: "5f758a8d90d2426336f37c44",
				//   usr_data: {
				//     name: "Huzefa",
				//     dob: "2020-09-30T18:30:00.000Z",
				//     address: "bbhbhbh ghjgjgjhgjhg hgjhgjhgjh",
				//     phone_numbers: ["1111111111111111"],
				//     email: "hsuhhuhu@huhhu.com",
				//     designation: "uuhhuhuhhhuuu",
				//     doj: "2020-09-30T18:30:00.000Z",
				//     representing_partner_ids: [
				//       {
				//         text: "Allied Partneras",
				//         value: "5f857a9ad8a96c2e4ca6e7c5",
				//       },
				//     ],
				//     countries: ["Australia"],
				//     doe: null,
				//     no_of_leaves: 26,
				//   },
				// },
			],
			search_text: "",
		}),
		created() {
			this.getUsers();
		},

		methods: {
			...mapActions("UserManagement", ["getUserList", "addUser", "editUser", "resetPassword"]),

			getUsers() {
				this.openLoaderDialog();
				this.getUserList({
					filter: {
						type: this.type,
						search_text: this.search_text,
					},
					pageSize: this.pageSize,
					pageNo: this.pageNo,
				}).then((data) => {
					this.closeLoaderDialog();
					if (!data.ok) {
						this.openSnackbar({ text: "Failed to Fetched User Data" });
					}
					this.userList = data.list;
					this.totalCount = data.totalCount;
					this.fetchCount = data.fetchCount;
				});
			},
			/* getFormattedDate(date, format = "DD/MM/YYYY") {
				return helpers.getFormattedDate(date, format);
			}, */
			// getISODate(date) {
			//   return helpers.getISODate(date);
			// },
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
				var formData = { ...data };
				formData.type = this.type;
				formData.dob = helpers.getISODate(formData.dob);
				formData.doj = helpers.getISODate(formData.doj);
				if (formData.doe) {
					formData.doe = helpers.getISODate(formData.dob);
				} else {
					delete formData.doe;
				}
				formData.phone_numbers = data.phone_numbers.map((data) => data.input);
				console.log(formData);

				this.openLoaderDialog();
				if (!this.isEditMode) {
					this.addUser(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Added User Sucessfully" });
							console.log("Add user success");
							this.getUsers();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							console.log("Add user failed");
						}
					});
				} else {
					this.editUser(formData).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Edited User Sucessfuly" });
							console.log("Edit user success");
							this.getUsers();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							console.log("Edit user failed");
						}
					});
				}
			},

			getEditRowObject(data) {
				return {
					...data.usr_data,
					_id: data._id,
					updated_on: data.record.updated_on,
				};
			},
			disableUser(data) {
				if (
					window.confirm(
						"Do you really want to " + (data.record.active ? "Disable the User?" : "Enable the User?")
					)
				) {
					this.openLoaderDialog();
					this.editUser({
						_id: data._id,
						active: !data.record.active,
						updated_on: data.record.updated_on,
					}).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Updated User Status" });
							console.log("Updated user status");
							this.getUsers();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							console.log("Failed to Update user status");
						}
					});
				}
			},
			userPasswordReset(data) {
				if (window.confirm("Do you really want to Reset User Password")) {
					this.openLoaderDialog();
					this.resetPassword({ _id: data._id }).then((data) => {
						this.closeLoaderDialog();
						if (data.ok) {
							this.openSnackbar({ text: "Sucessfully Reset Password" });
							console.log("Sucessfully Reset Password");
							this.getUsers();
							this.closeForm();
						} else {
							this.openSnackbar({ text: data.message });
							console.log("Failed to Reset Password");
						}
					});
				}
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
		height: 100%;
	}
	.date-container {
		display: flex;
		justify-content: space-between;
	}
	.manageusers-search-bar {
		margin-top: 12px;
	}
</style>
