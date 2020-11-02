import Search from "../components/Search.vue";

const searchMixins = {
	components: {
		Search,
	},
	data: () => ({
		pageSize: 20,
		pageNo: 1,
		totalCount: 0,
		fetchCount: 0,
		selectedSearchConfig: [],
		filter: {},
		search_text: "",
	}),
	computed: {},
	methods: {},
};

export default searchMixins;
