<script>
	import { Bar } from "vue-chartjs";
	// var randomColor = require("randomcolor");

	export default {
		extends: Bar,
		props: {
			mainAxis: {
				type: Array,
			},
			secondaryAxis: {
				type: Array,
			},
			options: {
				type: Object,
			},
			// chartColors: {
			// 	type: Object,
			// },
		},
		updated() {
			// function getRandomColor() {
			// 	var letters = "0123456789ABCDEF".split("");
			// 	var color = "#";
			// 	for (var i = 0; i < 6; i++) {
			// 		color += letters[Math.floor(Math.random() * 16)];
			// 	}
			// 	return color;
			// }
			this.renderChart(
				{
					labels: this.mainAxis,
					datasets: this.secondaryAxis,
				},
				this.options
			);
		},
	};
</script>
