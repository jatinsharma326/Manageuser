<script>
	import { Bar, mixins } from "vue-chartjs";
	// import { mapGetters } from "vuex";

	export default {
		extends: Bar,
		mixins: [mixins.reactiveProp],
		props: {
			chartData: {
				type: Object,
			},
			options: {
				type: Object,
			},
			// myTabId: {
			// 	type: Number,
			// },
		},
		mounted() {
			this.renderChart(this.chartData, this.options);
		},
		computed: {},
		watch: {},
	};
</script>
