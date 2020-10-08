<template>
	<div>
		<v-overlay :opacity="1" :value="loaderDialog" :z-index="100">
			<v-progress-circular
				color="primary"
				indeterminate
				size="64"
			></v-progress-circular>
		</v-overlay>
		<app v-if="showApp"></app>
		<auth @startSession="startSessionAuth" v-else-if="showAuth"></auth>
		<verify-auth
			@startSession="startSessionVerifyAuth"
			v-else-if="showVerifyAuth"
		></verify-auth>
	</div>
</template>

<script>
	import jwt from "jsonwebtoken";

	import lt from "long-timeout";
	import App from "./App.vue";
	import Auth from "./Auth.vue";
	import VerifyAuth from "./VerifyAuth.vue";

	import { mapGetters, mapMutations, mapActions } from "vuex";
	export default {
		name: "Provider",
		/*
		 * Clear all references to any previous timeouts that might have persisted.
		 * Initiate check for if the user session exists
		 */
		created() {
			this.expiryBuffer = 60 * 1000;
			let id = setTimeout(function() {}, 0);
			console.log("In memory timeouts", id);
			while (id--) {
				clearTimeout(id); // will do nothing if no timeout with id is present
			}
			this.checkUserSession();
		},
		mounted() {},
		data: () => ({
			expiryBuffer: 60 * 1000,
			refreshTokenTimeoutRef: 0,
			loaderDialog: true
		}),
		methods: {
			...mapActions(["extendUserSession", "fetchVisualConfig"]),
			...mapMutations([
				"openLoaderDialog",
				"closeLoaderDialog",
				"typeTenLogin",
				"typeTwentyLogin",
				"typeThirtyLogin"
			]),
			/*
			 * Check if token exists inside the localstorage and also if the token isVerifed.
			 * if token is not expired then auto log in the user and start the refresh token cycle and fetch the visual config
			 * if the token has expired then try to extend the users session using extendSession() and fetch the visual config
			 * else make the user login again
			 */
			async checkUserSession() {
				let currentState = JSON.parse(localStorage.getItem("userState"));
				let existingToken = localStorage.getItem("auth");
				if (existingToken && currentState.isVerified) {
					let decodedAuthToken = jwt.decode(existingToken);
					let decodedRefreshToken = jwt.decode(currentState.refreshToken);
					if (this.isTokenExpired(decodedAuthToken.exp)) {
						this.autoLoginUser();
						this.startRefreshCycle();
						this.getVisualConfig().then(() => {
							this.loaderDialog = false;
						});
						console.log("AUTO LOGIN HAPPENED");
					} else if (this.isTokenExpired(decodedRefreshToken.exp)) {
						await this.extendUserSession({
							refreshToken: currentState.refreshToken,
							currentState
						});
						this.startRefreshCycle();
						this.getVisualConfig().then(() => {
							this.loaderDialog = false;
						});
					}
				} else {
					this.loaderDialog = false;
				}
			},
			/*
			 * If the users token has not expired then using the information on the localstorage set the state of the user based on the userType
			 */
			autoLoginUser() {
				let token = localStorage.getItem("auth");
				let userState = JSON.parse(localStorage.getItem("userState"));
				if (localStorage.getItem("userType") == this.ADMIN) {
					this.typeTenLogin({
						token,
						userData: userState.mortal.userData,
						dataObj: userState
					});
				} else if (localStorage.getItem("userType") == this.CHECKER) {
					this.typeTwentyLogin({
						token,
						userData: userState.mortal.userData,
						dataObj: userState
					});
				} else if (localStorage.getItem("userType") == this.MAKER) {
					this.typeThirtyLogin({
						token,
						userData: userState.mortal.userData,
						dataObj: userState
					});
				}
			},
			/*
			 * Checks if token has expired or not
			 */
			isTokenExpired(exp) {
				if (exp * 1000 - this.expiryBuffer > new Date().getTime()) {
					return true;
				}
				return false;
			},
			/*
			 * starts token refresh cycle, keeps refreshing the auth token using the refresh token
			 */
			startRefreshCycle() {
				let decodedAuthToken = jwt.decode(this.authToken);
				lt.clearTimeout(this.refreshTokenTimeoutRef);
				let interval = decodedAuthToken.exp * 1000 - this.expiryBuffer;
				this.refreshTokenTimeoutRef = lt.setTimeout(() => {
					if (this.refreshToken) {
						this.extendUserSession({
							refreshToken: this.refreshToken,
							currentState: this.currentState
						}).then(() => {
							this.startRefreshCycle();
						});
					}
				}, interval);
			},
			async getVisualConfig() {
				await this.fetchVisualConfig();
			},
			/*
			 * emitted from the auth component when login happens, used to startRefreshCycle() and fetch the visual config
			 */
			async startSessionAuth() {
				this.startRefreshCycle();
				await this.getVisualConfig();
			},
			/*
			 * emitted from the verifyAuth component when password is updated, used to startRefreshCycle() and fetch the visual config
			 */
			async startSessionVerifyAuth() {
				this.startRefreshCycle();
				await this.getVisualConfig();
			}
		},
		destroyed() {
			lt.clearTimeout(this.refreshTokenTimeoutRef);
		},
		computed: {
			...mapGetters([
				"auth",
				"authToken",
				"isVerified",
				"refreshToken",
				"currentState",
				"isVisualConfigAvailable",
				"ADMIN",
				"CHECKER",
				"MAKER"
			]),
			showApp: function() {
				return this.auth && this.isVerified && this.isVisualConfigAvailable;
			},
			showAuth: function() {
				if (!this.auth && !this.isVerified) {
					return true;
				} else if (
					this.auth &&
					this.isVerified &&
					!this.isVisualConfigAvailable
				) {
					return true;
				} else if (this.auth && !this.isVerified) {
					return false;
				}
				return false;
			},
			showVerifyAuth: function() {
				return this.auth && !this.isVerified;
			}
		},
		components: {
			App,
			Auth,
			VerifyAuth
		}
	};
</script>
