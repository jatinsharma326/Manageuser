<template>
	<div class="salesLeavesManagerWrapper">
		<div class="leaves-table">
			<v-data-table :headers="headers" :expanded.sync="expanded" show-expand :items="leavesList" item-key="_id">
				<!-- <template v-slot:[`item.serial_number`]="{ item }">{{}}</template> -->
				<template v-slot:[`item.doa`]="{ item }">
					{{ getFormattedDate(item.doa, "MMMM Do YYYY dddd") }}
				</template>
				<template v-slot:[`item.date_from`]="{ item }">
					{{ getFormattedDate(item.date_from, "MMMM Do YYYY dddd") }}
				</template>
				<template v-slot:[`item.date_to`]="{ item }">
					{{ getFormattedDate(item.date_to, "MMMM Do YYYY dddd") }}
				</template>
				<template v-slot:expanded-item="{ headers }">
					<td :colspan="headers.length">
						<div class="expandable-section-title">Purpose Of Leave</div>
						<div class="expandable-section-content">Here is where the purpose of leave will go</div>
					</td>
				</template>
				<template v-slot:[`item.actions`]="{ item }">
					<template v-if="item.status != 'REJECTED' && isDateBefore(item.date_from)">
						<v-menu bottom left>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on">
									<v-icon>mdi-dots-vertical</v-icon>
								</v-btn>
							</template>

							<v-list>
								<v-list-item v-if="item.status != 'ACCEPTED'" @click="acceptAction(item)"
									>Accept</v-list-item
								>
								<v-list-item @click="rejectAction(item)">Reject</v-list-item>
							</v-list>
						</v-menu>
					</template>
				</template>
			</v-data-table>
		</div>
	</div>
</template>

<script>
	export default {
		name: "SalesLeaveManager",
		created() {},
		components: {},
		data: () => ({}),
		methods: {},
		watch: {},
		props: {},
	};
</script>
<style lang="scss" scoped></style>
