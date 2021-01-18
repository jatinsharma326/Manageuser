<script>
	import { Pie, mixins } from "vue-chartjs";
	import { mapGetters } from "vuex";

	export default {
		extends: Pie,
		mixins: [mixins.reactiveProp],
		props: {
			chartData: {
				type: Object,
			},
			options: {
				type: Object,
			},
		},
		mounted() {
			this.renderChart(this.chartData, this.options);
		},
		computed: {},
		watch: {},
	};
</script>
