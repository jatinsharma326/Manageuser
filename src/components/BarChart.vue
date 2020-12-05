<script>
	// import { Bar } from "vue-chartjs";
	import { Bar, mixins } from "vue-chartjs";
	import { mapGetters } from "vuex";
	// var randomColor = require("randomcolor");

	export default {
		extends: Bar,
		// mixins: [],
		mixins: [mixins.reactiveProp],
		props: {
			chartData: {
				type: Object,
			},
			options: {
				type: Object,
			},
			myTabId: {
				type: Number,
			},
		},
		mounted() {
			this.renderChart(this.chartData, this.options);
		},
		computed: {},
		watch: {},
	};
</script>
