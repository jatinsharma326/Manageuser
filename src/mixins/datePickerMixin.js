import moment from "moment-timezone";

const datePickerMixin = {
	components: {},
	data: () => ({
		datePickerDate: [],
		tempDateValue: [],
		dateDialog: false,
	}),
	computed: {},
	methods: {
		dataSelector() {
			this.tempDateValue = [...this.datePickerDate];
		},
		cancelDatePicker() {
			this.datePickerDate = [...this.tempDateValue];
			this.dateDialog = false;
		},
		submitDatePicker() {
			this.$refs.dialog.save(this.datePickerDate);
			this.getData();
		},
		resetDatePicker() {
			this.setDateRange();
			this.$refs.dialog.save(this.datePickerDate);
			this.getData();
			this.dateDialog = false;
		},
		setDateRange() {
			let tempArray = [];
			let startDate = moment()
				.tz("Asia/Kolkata")
				.startOf("month")
				.format("YYYY-MM-DD");
			let endDate = moment()
				.tz("Asia/Kolkata")
				.endOf("month")
				.format("YYYY-MM-DD");
			tempArray.push(startDate);
			tempArray.push(endDate);
			this.datePickerDate = tempArray;
		},
	},
};

export default datePickerMixin;
