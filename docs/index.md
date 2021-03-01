# Application Overview

This document gives a basic overview of the inner working of the application

# Components

## BarChart.vue & PieChart.vue

This component with the help of Vue chartJS helps us `create a Bar/Pie Chart.`

### Mixins

-   **mixins.reactiveProp** : This is provided by chartJS. `On data mutation`, it will call `update()` if the data inside the datasets has changed, or `renderChart()` if new datasets were added.

### Props

-   **chartData** : It contains the `main data` that is used to create the chart.
-   **options** : Options are `basic chartJs options` that help us get certain functionality out of chartJS
    <!-- -   myTabId : -->

For more information you can visit https://vue-chartjs.org/guide/#creating-your-first-chart

---

## ChangeLog.vue

This modal is used to indicate `what was the update type` on the selected element and `who updated it.` It shows Who Enabled/Disabled/Updated/Created the selected element.

### Mixins

-   **helperMixin** : Please refer **ConnectTo**
-   **SearchMixin** : Please refer **ConnectTo**

### Props

-   **toggleChangelogModal** : Used to Toggle the Modal
-   **selectedInfo** : Info of the element for which the changelog has to be displayed

---

## Form.vue

This Component is Used to Create the form which is used to Add/Edit Data for most of CRUD in the system. Mentioned below are example of all the options that can be used to create form elements.

1.String - Basic Input field - To take String Input

```js
    {
    	name: "Name of the input field (Use * to indicate Required Field)", //Required
    	type: "String",  //Required
    	key: "Name of the Form Output Key", //Required
    	width: "For Width Please Refer the width section  at the end of Form.vue section",
    	disableTriggerKey: "The key that should trigger the disable function",
    	disableCheck: "Function that returns either true or false value based on the check that needs to be performed",
    	validations: {
    		"For Width Please Refer the Validations section at the end of Form.vue section"
    	},
    }
```

2.Number - Basic Input field - To take Number Input

```js
    {
    	name: "Name of the input field (Use * to indicate Required Field)", //Required
    	type: "Number", //Required
    	key: "Name of the Form Output Key", //Required
    	width: "For Width Please Refer the width section  at the end of Form.vue section",
    	disableTriggerKey: "The key that should trigger the disable function",
    	disableCheck: "Function that returns either true or false value based on the check that needs to be performed",
    	validations: {
    		"For Width Please Refer the Validations section at the end of Form.vue section"
    	},
    }
```

3.TextArea - Basic Input field - To take TextArea Input

```js
    {
    	name: "Name of the input field (Use * to indicate Required Field)", //Required
    	type: "TextArea", //Required
    	key: "Name of the Form Output Key", //Required
    	width: "For Width Please Refer the width section  at the end of Form.vue section",
    	disableTriggerKey: "The key that should trigger the disable function",
    	disableCheck: "Function that returns either true or false value based on the check that needs to be performed",
    	validations: {
    		"For Width Please Refer the Validations section at the end of Form.vue section"
    	},
    }
```

4.Date - Basic Date Picker

```js
    {
    	name: "Name of the input field (Use * to indicate Required Field)", //Required
    	type: "Date",  //Required
    	key: "Name of the Form Output Key", //Required
    	width: "For Width Please Refer the width section  at the end of Form.vue section",
    	disableTriggerKey: "The key that should trigger the disable function",
    	disableCheck: "Function that returns either true or false value based on the check that needs to be performed",
    	validations: {
    		"For Width Please Refer the Validations section at the end of Form.vue section"
		},
		min:() => {
			"Function that returns a min value for the date picker, Format of the returned date vale has to be 'YYYY-MM-DD'"
		}
		max:() => {
			"Function that returns a max value for the date picker, Format of the returned date vale has to be 'YYYY-MM-DD'"
		}
    }
```

5.FilePicker - Basic File Picker

```js
    {
    	name: "Name of the input field (Use * to indicate Required Field)", //Required
    	type: "FilePicker",  //Required
    	key: "Name of the Form Output Key", //Required
    	width: "For Width Please Refer the width section  at the end of Form.vue section",
    	disableTriggerKey: "The key that should trigger the disable function",
    	disableCheck: "Function that returns either true or false value based on the check that needs to be performed",
    	validations: {
    		"For Width Please Refer the Validations section at the end of Form.vue section"
		},
		acceptRules:"This limits the kind of files that can be picked, for example if this is set to 'image/png, image/jpeg, image/bmp', then it can only pick image files",
		rules:[
			"Accepts a mixed array of types function, boolean and string. Functions pass an input value as an argument and must return either true / false or a string containing an error message. The input field will enter an error state if a function returns (or any value in the array contains) false or is a string"
		]
    }
```

6.Switch - Basic switch to toggle between true & false

```js
    {
    	name: "Name of the input field (Use * to indicate Required Field)", //Required
    	type: "Switch",  //Required
    	key: "Name of the Form Output Key", //Required
    	width: "For Width Please Refer the width section  at the end of Form.vue section",
    	disableTriggerKey: "The key that should trigger the disable function",
    	disableCheck: "Function that returns either true or false value based on the check that needs to be performed",
    	validations: {
    		"For Width Please Refer the Validations section at the end of Form.vue section"
		},
    }
```

7.Dropdown - Basic Dropdown

```js
    {
    	name: "Name of the input field (Use * to indicate Required Field)", //Required
    	type: "Dropdown", //Required
    	key: "Name of the Form Output Key", //Required
    	width: "For Width Please Refer the width section  at the end of Form.vue section",
    	disableTriggerKey: "The key that should trigger the disable function",
    	disableCheck: "Function that returns either true or false value based on the check that needs to be performed",
    	isListInStore:	"If the List is in the store this needs to be set to true else set to false", //Required
    	listVariable: "If isListInStore is set to TRUE then the list name comes here",
    	listItems:"If isListInStore is set to FALSE then the array of list item value is passed here",
    	multi:"Allows multiple select in the list if set to true. Can only select one by default", //Required
    	itemText:"Set property of items’s text value",
    	itemValue:"Set property of items’s value - must be primitive.",
    	validations: {
    		"For Width Please Refer the Validations section at the end of Form.vue section"
    	},
    }
```

8.DropdownWithMoreInfo - Dropdown with a more info for the list Item - Can be used to give description to the list item

```js
    {
    	name: "Name of the input field (Use * to indicate Required Field)", //Required
    	type: "DropdownWithMoreInfo", //Required
    	key: "Name of the Form Output Key", //Required
    	width: "For Width Please Refer the width section  at the end of Form.vue section",
    	disableTriggerKey: "The key that should trigger the disable function",
    	disableCheck: "Function that returns either true or false value based on the check that needs to be performed",
    	isListInStore:	"If the List is in the store this needs to be set to true else set to false", //Required
    	listVariable: "If isListInStore is set to TRUE then the list name comes here",
    	listItems:"If isListInStore is set to FALSE then the array of list item value is passed here",
    	multi:"Allows multiple select in the list if set to true. Can only select one by default", //Required
    	itemText:"Set property of items’s text value",
		itemValue:"Set property of items’s value - must be primitive.",
		titleContent:"This is a function that returns the name for the list item. The function gets the value of the list Item by default.", //Required
		subtitleContent:"This is a function that returns the description for the list item. The function gets the value of the list Item by default.",
    	validations: {
    		"For Width Please Refer the Validations section at the end of Form.vue section"
    	},
    }
```

9.AsyncDropdownWithMoreInfo - Dropdown with a more info for an `asynchronous list` Item - Can be used to give description to the list item

```js
    {
    	name: "Name of the input field (Use * to indicate Required Field)", //Required
    	type: "AsyncDropdownWithMoreInfo", //Required
    	key: "Name of the Form Output Key", //Required
    	width: "For Width Please Refer the width section  at the end of Form.vue section",
    	disableTriggerKey: "The key that should trigger the disable function",
    	disableCheck: "Function that returns either true or false value based on the check that needs to be performed",
    	isListInStore:	"If the List is in the store this needs to be set to true else set to false", //Required
    	listVariable: "If isListInStore is set to TRUE then the list name comes here",
    	listItems:"If isListInStore is set to FALSE then the array of list item value is passed here",
    	// multi:"Allows multiple select in the list if set to true. Can only select one by default", //Required
    	itemText:"Set property of items’s text value",
		itemValue:"Set property of items’s value - must be primitive.",
		titleContent:"This is a function that returns the name for the list item. The function gets the value of the list Item by default.", //Required
		subtitleContent:"This is a function that returns the description for the list item. The function gets the value of the list Item by default.",
		apiCall:() => {
			"Function that returns an array that contains the list that has to be populated. "
		} //Required
		triggerKey: "Key to watch for, When the value of this Key changes api function is called", //Required
    	validations: {
    		"For Width Please Refer the Validations section at the end of Form.vue section"
    	},
    }
```

10.MultiInput - Taking multiple Input value for a specefic key from the user

```js
    {
    	name: "Name of the input field (Use * to indicate Required Field)", //Required
    	type: "Date",  //Required
    	key: "Name of the Form Output Key", //Required
    	width: "For Width Please Refer the width section  at the end of Form.vue section",
    	validations: {
			"The validation applied here gets applied to the main input field"
			"For Width Please Refer the Validations section at the end of Form.vue section"
			$each: {
				input: {
					"The validation applied here gets applied to each sub input field"
				},
			},
		},
    }
```

11.MultiInputWithGroupKey - Taking multiple Input value for a specefic key from the user

```js
    {
    	name: "Name of the input field (Use * to indicate Required Field)", //Required
    	type: "MultiInputWithGroupKey",  //Required
    	key: "Name of the Form Output Key,in the example given below 'key' is emergency_contacts ", //Required
    	width: "For Width Please Refer the width section  at the end of Form.vue section",
    	validations: {
			"For Width Please Refer the Validations section at the end of Form.vue section"
		},
		keyToGroup: "The key based on which this input config will appear, On value change of the key mentioned here the multi input field appears,in the example given below 'keyToGroup' is countries",
		keyforGrouped: "Key of the Input form Data which needs to be found in keyToGroup, in the example given below 'keyforGrouped' is country",
		keyBeingGrouped: "Key of the Input form Data which needs to be grouped to 'keyforGroup', in the example given below 'keyBeingGrouped' is contacts",
	}
	// Input - Form Data
	// countries:["New Zealand - ANZ"]
	// emergency_contacts: [
	// 	{
	// 		"country": "New Zealand - ANZ",
	// 		"contacts": [
	// 			"+65 91168264"
	// 		]
	// 	}
	// ]

	// Output - Form output
	// [
	// 	{
	// 		"groupKey": "New Zealand - ANZ",
	// 		"input": [
	// 			{
	// 				"input": "+65 91168264"
	// 			}
	// 		]
	// 	}
	// ]
```

### Props

-   **name** : This is a `required` prop. It is the name of the form that gets displayed on the top left of the form. It gets interpolated with Add or Edit based on the value of 'isEditMode'. 'prependFormName' Needs to be set to false to remove Add or Edit. `Value` for this prop `is String`.
-   **inputConfig** : This is a `required` prop. It is the config that determines what form elements need to be set.`Value` for this prop `is Object`.
-   **isEditMode** : This is a `required` prop. `Value` for this prop `is Boolean`.
-   **toggleForm** : This is a `required` prop. `Value` for this prop `is Boolean`. It is used to toggle the form
-   **keysToWatch** : This is an `array` of keys for whom watcher needs to be initialized, This is done in the case of disable or when an api function has to be called.
-   **formData** : If `isEditMode is true` then the formData is passed to the form to populate the input fields with the existing values. `Value` for this prop `is an Object`.
-   **prependFormName** : This Needs to be set to `false if you dont want Add or Edit` to come

### Width

Below listed are option of what width can be set as

1. oneFourth - 25% of the total Width
2. oneThird - 33% of the total Width
3. half - 50% of the total Width
4. full - 100% of the total Width

### Validation

The validations that have been used for the form are listed below. For more info can visit https://vuelidate.js.org/#sub-builtin-validators

1. required - Forces the input field to compulsory
2. alpha - Only takes Alphabetical Values
3. numeric - Only takes Numeric Values
4. minLength - This can be given a number in `()` which forces the input to have minimum of the mentioned number.
5. maxLength - This can be given a number in `()` which forces the input to have maximum of the mentioned number.
6. email - Only takes Email Value

---

## helpers.js

Is a collection of functions. _Document this section later on_

## InformationCard.vue

_Insert a photo with slot placement here_

Information Card component helps create cards to display any kind of information with the help of slots. The List of slot is given below. Also refer the image for the slot positions

1. topLeft - Occupies 50% of the row space
2. topRight - Occupies 50% of the row space
3. mainContent - Occupies 70% of the row space
4. mainContentSubtitle - Occupies 70% of the row space
5. mainContentRight - Occupies 30% of the row space
6. moreInfo - Occupies 100% of the row space
7. actionButtons - Occupies 100% of the row space if **expandCard** is set to false
8. expandCardContent - Occupies 100% of the row space. This section is toggleable with the help of an arrow button thats placed on the bottom right of the card

### Props

-   **expandCard** : If set to True, Enables the `expandCardContent slot section`. Where we can display more info.
-   **isCardDisabled** : If set to true applies a gray background to the card
-   **isDefaulter** : If set to true applies a light background to the card
-   **isBirthDate** : If set to true applies a happy birthday gif as a background to the card

---

## Search.vue

Mentioned below are example of all the options that can be used to create form elements.

1.textfield - Basic String Input

```js
    {
    	name: "Name of the input field", //Required
		inputType: "textfield",  //Required
		type:"Sets input type for the v-text-field",
    	key: "Name of the Advance Search Output Key", //Required
		classes: "List of Array of classes present in the component. List of classes that can be used are mentioned at the end of Search.vue Component",
		defaultValue:" Sets a Default value for the selected dropdown, which in this case can be null or ''"
    }
```

2.dropdown - Basic dropdown

```js
    {
    	name: "Name of the input field", //Required
		inputType: "dropdown",  //Required
    	key: "Name of the Advance Search Output Key", //Required
		classes: "List of Array of classes present in the component. List of classes that can be used are mentioned at the end of Search.vue Component",
		isListInStore:	"If the List is in the store this needs to be set to true else set to false", //Required
    	listVariable: "If isListInStore is set to TRUE then the list name comes here",
    	listItems:"If isListInStore is set to FALSE then the array of list item value is passed here",
    	multi:"Allows multiple select in the list if set to true. Can only select one by default", //Required
    	itemText:"Set property of items’s text value",
		itemValue:"Set property of items’s value - must be primitive.",
		defaultValue:" Sets a Default value for the selected dropdown, which in this case can be null or []"
    }
```

3.switch - Basic toggleable switch

```js
    {
    	name: "Name of the input field", //Required
		inputType: "switch",  //Required
    	key: "Name of the Advance Search Output Key", //Required
		classes: "List of Array of classes present in the component. List of classes that can be used are mentioned at the end of Search.vue Component",
		defaultValue:" Sets a Default value for the selected dropdown, which in this case can be true or False"
    }
```

4.datePicker - Basic Date Picker

```js
    {
    	name: "Name of the input field", //Required
		inputType: "datePicker",  //Required
    	key: "Name of the Advance Search Output Key", //Required
		classes: "List of Array of classes present in the component. List of classes that can be used are mentioned at the end of Search.vue Component",
		defaultValue:" Sets a Default value for the selected dropdown, which in this case can be null or any value of the format 'YYYY-MM-DD'"
    }
```

### Props

-   **isAdvanceSearch** : `Value` for this prop `is Boolean`. It is set to false by default. This can be Used to toggle between a basic search field and a more advance search field.
-   **isOnlyAdvanceSearch** : `Value` for this prop `is Boolean`. When set to true this gets rid of the search input field and replaces it with a button, and a slot called `buttonSection`.
-   **isAdvanceAFilter** : `Value` for this prop `is Boolean`. This toggles the advance section submit button text from search to filter.
-   **placeholder** : It is the placeholder text for the search input field. `Value` for this prop `is String`. Default Value for this prop is `Type to Search`
-   **filterConfig** : Just like the form config a config as described above can be passed to the component to generate respective input fields which can help in performing advance search. This needs to be passed if `isAdvanceSearch` is set to true.

---

## UploadModal.vue

This component can be used to open a modal that can be used to upload or download any file to the server. The upload or download API function needs to be passed as prop to the component

### Props

-   **toggleModal** : This is a `required` prop. Basic Prop to toggle the Component. Default is set to false
-   **accept** : This is a `required` prop. This limits the kind of files that can be picked, for example if this is set to 'image/png, image/jpeg, image/bmp', then it can only pick image files
-   **title** : This is a `required` prop. Title for the modal
-   **uploadFunction** : This is a `required` prop. Pass the API function that has to be used to upload the selected file
-   **downloadSampleFunc** : Pass the API function that has to be used to download.
-   **showDownloadSampleButton** : This is a `required` prop.`Value` for this prop `is Boolean`. Can be set to false to hide thw download button
-   **process_id** : This ID gets attached to the file before uploading the file.

## ViewMoreModal.vue

_Attach an image here_

This component opens a full page modal that has slots that can be used to populate information accordingly.Refer the image for the placement of the mentioned slots. List of the available slots are given below.

-   **modalTitle** : Main Heading for the modal goes here
-   **modalSubtitle** : Subtitle for the modal goes here. Font size is smaller than the title
-   **toolbarActions** : Can be used to pass anything on the right section of the toolbar
-   **modalContent** : This slot can be used to populate the main Content

### Props

-   **toggleModal** : This is a `required` prop. Basic Prop to toggle the Component. Default is set to false

**ADD EMIT FOR ALL COMPONENTS**

# Mixins

## commonAPICallsMixin.js

This mixin is a collection of common API Calls.

List of the Components Using this is listed below

-   admin-bulletin\index.vue
-   daily-sales-report\index.vue
-   follow-up\index.vue
-   monthly-sales-report\index.vue
-   notice-board\index.vue
-   reports\index.vue
-   sales-call\index.vue
-   virtual-reach\index.vue

Methods being used is listed below

1. **getUsers()** - This Function return a list of all Sales Users in the System.
2. **getCompanies()** - This Function return a list of all active companies in the System
3. **getCountryList()** - This Function return a list of all countries in the System
4. **getActiveCurrenciesList()** - This Function return a list of all active currency list in the System

## datePickerMixin.js

This mixin is a collection of Date picker related Functions

List of the Components Using this is listed below

-   admin-bulletin\index.vue
-   daily-sales-report\reportsList.vue
-   follow-up\index.vue
-   notice-board\index.vue
-   reports\CityReport.vue
-   reports\TravelAgentReport.vue
-   reports\YearlyRevenueBusinessType.vue
-   reports\YearlyRevenueComparison.vue
-   reports\YearlyRevenueRaw.vue
-   reports\YearlyRevenueZone.vue
-   reports\ZoneReport.vue
-   sales-call\index.vue
-   virtual-reach\index.vue

Methods being used is listed below

1. **dataSelector()** -
2. **cancelDatePicker()** - Sets the datepicker date to what it was before opening the date picker dialog. and close the date picker modal
3. **submitDatePicker()** - This Function saves the updated selected date and makes a getData API call which fetches data based on updated date.
4. **resetDatePicker()** - This Function calls setDateRange() which sets the date to initial value. It also makes a getData API call to get updated data based on default date range, and closes the date picker if open.
5. **setDateRange()** - This Function sets the date range from start of the current month to the end of current month

## defaultCRUDMixins.js

This mixin is a collection of Date picker related Functions

List of the Components Using this is listed below

-   admin-bulletin\index.vue
-   daily-sales-report\index.vue
-   daily-sales-report\reportsList.vue
-   follow-up\index.vue
-   leave-manager\AdminLeaves.vue
-   leave-manager\index.vue
-   leave-manager\SalesLeave.vue
-   manage-agents\CompanyAddresses.vue
-   manage-agents\CompanyEmployees.vue
-   manage-agents\CompanyFamTrip.vue
-   manage-agents\index.vue
-   manage-targets\index.vue
-   manage-targets\ProductTargets.vue
-   manage-users\Users.vue
-   monthly-sales-report\index.vue
-   monthly-sales-report\ReportView.vue
-   notice-board\index.vue
-   reports\CityReport.vue
-   reports\index.vue
-   reports\TargetReport.vue
-   reports\TravelAgentReport.vue
-   reports\YearlyRevenueBusinessType.vue
-   reports\YearlyRevenueComparison.vue
-   reports\YearlyRevenueRaw.vue
-   reports\YearlyRevenueZone.vue
-   reports\ZoneReport.vue
-   representing-partner\index.vue
-   representing-partner\PartnerEmployees.vue
-   sales-call\callsList.vue
-   sales-call\index.vue
-   virtual-reach\index.vue

Computed functions being being used is listed below

1. **isAdminOrManagement()** - When called this computed function returns true if the signed in user is an ADMIN or MANAGEMENT user
2. **isSalesTeamMember()** - When called this computed function returns true if the signed in user is a SALES TEAM or REMOTE SALES TEAM user
3. **isOnlySalesAgent()** - When called this computed function returns true if the signed in user is a SALES TEAM user
4. **isOnlyRemoteAgent()** - When called this computed function returns true if the signed in user is a REMOTE SALES TEAM user
5. **isOnlyAdmin()** - When called this computed function returns true if the signed in user is an ADMIN user

"openLoaderDialog", "closeLoaderDialog", "openSnackbar" mutations are mapped to this mixin

InformationCard, ViewMoreModal are modals that are imported in this mixin

## helperMixins.js

This mixin is a collection of methods that use functions from helper.js. This is done so that these methods can be used in the dom directly after importing this mixin

List of the Components Using this is listed below

-   admin-bulletin\index.vue
-   daily-sales-report\reportsList.vue
-   dashboard\BirthdayReminders.vue:
-   dashboard\Followups.vue:
-   dashboard\index.vue:
-   dashboard\Notices.vue:
-   dashboard\Notifications.vue:
-   dashboard\PartnerBirthdayReminders.vue:
-   follow-up\index.vue
-   leave-manager\AdminLeaves.vue
-   leave-manager\index.vue
-   leave-manager\SalesLeave.vue
-   manage-agents\CompanyEmployees.vue
-   manage-agents\CompanyFamTrip.vue
-   manage-agents\index.vue
-   manage-agents\UploadLogs.vue
-   manage-users\Users.vue
-   monthly-sales-report\ReportView.vue
-   notice-board\index.vue
-   reports\CityReport.vue
-   reports\TargetReport.vue
-   reports\TravelAgentReport.vue
-   reports\YearlyRevenueBusinessType.vue
-   reports\YearlyRevenueComparison.vue
-   reports\YearlyRevenueRaw.vue
-   reports\YearlyRevenueZone.vue
-   reports\ZoneReport.vue
-   representing-partner\index.vue
-   representing-partner\PartnerEmployees.vue
-   sales-call\callsList.vue
-   virtual-reach\index.vue

Computed functions being being used is listed below

1. **getFormattedDate(date, format)** - This function can be used to get a formatted date. The date to be formatted is sent as the first argument. Format is sent as the second argument. By default the format is "DD/MM/YYYY"
2. **daysUntil(dateToCheckAgainst, todayMessage)** - The date for which days until needs to be checked is passed as the first param. As the second param we can set a custom message for when dateToCheckAgainst is equal to todays date.
3. **isSelectedDateCurrentDate(date)** - The date passed to this function is ealuated with todays date and returns true if they are the same.

## inputFormMixins.js

This mixin is a collection of everything basic required to use the input form

List of the Components Using this is listed below

-   admin-bulletin\index.vue
-   daily-sales-report\reportsList.vue
-   follow-up\index.vue
-   leave-manager\SalesLeave.vue
-   manage-agents\CompanyAddresses.vue
-   manage-agents\CompanyEmployees.vue
-   manage-agents\CompanyFamTrip.vue
-   manage-agents\index.vue
-   manage-targets\index.vue
-   manage-targets\ProductTargets.vue
-   manage-users\Users.vue
-   monthly-sales-report\index.vue
-   notice-board\index.vue
-   representing-partner\index.vue
-   representing-partner\PartnerEmployees.vue
-   sales-call\callsList.vue
-   virtual-reach\index.vue

Computed functions being being used is listed below

1. **openInputForm(mode , data)** - This is called to open the input form. for ADD form just call the function. For EDIT form mode is set to true and form data is passed as the second argument.
2. **closeForm()** - Calling this function resets the rowToEdit and isEditMode and closes the input form modal

Form component is imported in this mixin

## searchMixin.js

This mixin contains everything required for search to work it also has a function that evaluates what error needs to be displayed based on the data coming in.

List of the Components Using this is listed below

-   components\ChangeLog.vue
-   admin-bulletin\index.vue
-   daily-sales-report\reportsList.vue
-   follow-up\index.vue
-   leave-manager\AdminLeaves.vue
-   leave-manager\SalesLeave.vue
-   manage-agents\CompanyAddresses.vue
-   manage-agents\CompanyEmployees.vue
-   manage-agents\CompanyFamTrip.vue
-   manage-agents\index.vue
-   manage-agents\UploadLogs.vue
-   manage-targets\ProductTargets.vue
-   manage-users\Users.vue
-   monthly-sales-report\index.vue
-   monthly-sales-report\ReportView.vue
-   notice-board\index.vue
-   reports\CityReport.vue
-   reports\TargetReport.vue
-   reports\TravelAgentReport.vue
-   reports\YearlyRevenueBusinessType.vue
-   reports\YearlyRevenueComparison.vue
-   reports\YearlyRevenueRaw.vue
-   reports\YearlyRevenueZone.vue
-   reports\ZoneReport.vue
-   representing-partner\index.vue
-   representing-partner\PartnerEmployees.vue
-   sales-call\callsList.vue
-   virtual-reach\index.vue

Computed and Method functions being being used is listed below

1. **isPaginationRequired()** - This computed function divides the fetchcount with the pagesize to determine if pagination needs to be displayed or not.
2. **checkForErrorMessage(data, key)** - Returns appropriate error message based on the fetched data. Data(i.e the list of data) that is recived from the server is passed as the first param. Second param is to indicate for what this function was called.
3. **updatedPageNo()** - This gets called whenever page number is updated. It fetches the data based on updated page number.
4. **queryString()** - This function can be used with emit of query string from the search component when a basic search needs to be performed.

"openSnackbar" mutations are mapped to this mixin

## pageContentCheckMixin.js

This mixin is not being used anywhere. Content of this mixin are also present in searchMixin.js.

# Plugins

## vuetify.js

This is where colors for vuetify components have been defined

# Views

Listed Below are some commonly used functions

1. Computed

-   dateRangeText: Joins the selected date with ' ~ '

2. Methods

-   getData(): Basic fetch call to get required data.
-   setConfig(): Sets input config / Search Config, or Both.
-   formOutput(): This is where form output is manipulated for whatever is required for the API Call. After manipulation POST(Add) or PUT(Edit) API function is called.
-   getEditRowObject(): Adds \_id and updated_on to the data thats passed to the input form.
-   deleteEntry(): Calls DELETE API call to delete the selected entry
-   disableEntry(): Calls EDIT API call to disable the selected entry
-   getCountryList(): Gets a list of all Active Countries
-   **setDateRange()** - This Function sets the date range from start of the current month to the end of current month

## admin-bulletin & notice-board

This Component is only visible to the admin and management users. It can be used to set daily bulletin which is then visible on the dashboard

### index.vue

1. Mixins

-   defaultCRUDMixin
-   inputFormMixin
-   helperMixin
-   searchMixin
-   datePickerMixin
-   commonAPICallsMixin

2. Computed

-   dateRangeText: Joins the selected date with ' ~ '

3. Methods

-   setDateRange(), getData(), setConfig(), formOutput(), getEditRowObject(), deleteEntry()

## daily-sales-report

Daily sales report section is accessible to all the users in system where my DSR section is only visible to sales and remote sales agent. My DSR Consists of all the sales report made by the user that is logged in. All DSR consists of DSR made by all the system users.

### index.vue

This File Creates the tab structure and passes data to the component in the tab accordingly.

1. Component

-   daily-sales-report/reportsList.vue

1. Mixins

-   defaultCRUDMixin
-   commonAPICallsMixin

2. Methods

-   getSalesCallList(): Basic fetch call to get all Sales call made by the logged in user this is the passed to setConfig. As the list of sales call is required to make a DSR.
-   setConfig(): Sets Tab config for the DSR section. This tab config consists of the props data, input config, search config that needs to be passed to reportsList.vue Component.

### reportsList.vue

This component gets rendedred as TAB item. When this component gets rendered as 'My DSR' it fetches data for for the specific logged in User. While when rendered as 'ALL DSR' fetches data for all the user. Header Needs to be set for the columns that need to be visible

1. Mixins

-   defaultCRUDMixin
-   inputFormMixin
-   helperMixin
-   searchMixin
-   datePickerMixin

2. Computed

-   dateRangeText: Joins the selected date with ' ~ '

3. Methods

-   getData(), advanceSearch(), formOutput(), getEditRowObject()
-   canUserEdit(): Checks if the DSR Entry fits into the Edit period. The current Edit period is two months in the past and 1 month in future. For example if the current month is February, the call date can be from December of previous year to March.
-   deleteCall() - Same as deleteEntry()

4. Props

-   name: This is passed to the form component and is the name displayed on the top of the form
-   type: receives 'my_dsr' or 'all_dsr' to render different elements.
-   placeholder: This is placeholder for the search input
-   inputConfig: Config to set the form
-   searchConfig: Config to set the advance search

## dashboard

This Renders system dashboard which shows DSRNotification, Travel Agent Birthdays, System User Birthdays, Partner Birthdays, Notice Board To show message set by admin or managemnt,followup set for DSR and followup section

### index.vue

This File Creates the tab structure and passes data to the component in the tab accordingly.

1. Component

-   dashboard/Followups
-   dashboard/BirthdayReminders
-   dashboard/PartnerBirthdayReminders
-   dashboard/Notifications
-   dashboard/DashboardNotices

2. Mixins

-   helperMixin

3. Methods

-   getDateRange(): This sets value for the start and end of the month
-   checkNotifications():With the help of date set in getDateRange function, API functions are called these have a page size of 1 to signify to send just one item. Date of this item is checked, If its todays date then displayBadge in config is set to true and a notification bubble appears on that specefic tab config
-   setTabConfig(): Sets Tab config
    -   It renders all the tabs for Sales users
    -   It doesnt render Notification.vue for the remote sales users.
    -   It doesnt render Notification.vue and Followup.vue for Admin/Management User

### BirthdayReminders.vue, Followups.vue, Notices.vue, Notification.vue, PartnerBirthdayReminders.vue

All of these Components are rendered in the index.vue files where

-   BirthdayReminders.vue: Displays Travel Agent Birthdays in Column One and System User Birthdays in the second tab
-   PartnerBirthdayReminders.vue: Displays Partner Birthdays
-   Followups.vue: Displays the followup set in DSR and Followup section
-   Notices.vue: Displays a Message set by Admin User and Management User Each
-   Notification.vue: This displays DSR Notification, i.e whenever another system user adds a DSR with logged in users country

1. Mixins

-   helperMixin

2. Methods

-   Gets basic Data using
    -   getAgentBirthdayList()
    -   getGDEmployeeBirthdayList()
    -   getDSRRemindersList()
    -   getFollowUpRemindersList()
    -   getAdminBulletinList()
    -   getNoticeBoardList()
    -   getDSRNotificationList()
    -   getPartnerBirthdayList()
    -   getPartnerEmployeeBirthdayList()
-   loadMoreColumnOne(): Loads 20 more values for column one
-   loadMoreColumnTwo(): Loads 20 more values for column two
-   checkForBirthDate(): For BirthdayReminders.vue & PartnerBirthdayRemonders.vue , checks if the informationCard to which this function is attached to, is for today. If true then with the help of classes a gif is set as an background image to that informationCard.
-   initializeToggleObject(), toggleReadmore(), setClass(): In Followups.vue & Notifications.vue, Sets a Toggle for MoreInfo section of the info card

## follow-up

Only the Sales and Remote Sales Users can add a followup.

### index.vue

1. Mixins

-   defaultCRUDMixin
-   inputFormMixin
-   helperMixin
-   searchMixin
-   datePickerMixin
-   commonAPICallsMixin

2. Computed

-   dateRangeText: Joins the selected date with ' ~ '

3. Methods

-   getData(), setConfig(), advanceSearch(), formOutput(), getEditRowObject(), deleteEntry()
-   setDateRange(): Sets the Date Range from Start of month to End of 3rd month from the current month.
-   getCountries(): If Uses the sales user Countries if Sales User. Fetches List of all Countries is Remote Sales User
-   getCities(): Fetches list of all cities in the database
-   checkDisableCondition(): Disables certain config based on the condition check in this function. Returns true or false based on the condition

## leave-manager

In this section sales and remote sales team member can apply for leave. And Admin/Management can approve or reject those leaves

### index.vue

This just checks the logged in user type and accordingly displays the component to the user

### AdminLeaves.vue

This section is visible to Admin/ Management Users. Where they can accept or reject

1. Mixins

-   defaultCRUDMixin
-   inputFormMixin
-   helperMixin
-   searchMixin
-   datePickerMixin
-   commonAPICallsMixin

2. Computed

-   dateRangeText: Joins the selected date with ' ~ '

3. Methods

-   getData(), setConfig(), advanceSearch()
-   getUsers(): Gets list of all SalesTeam Users (Sales and Remote sales user both).
-   isDateBefore(): checks if the date passed is before todays date (Currently Not being Used in this section)
-   acceptAction(): Accepts the leave
-   rejectAction(): Rejects the leave

### SalesLeave.vue

1. Mixins

-   defaultCRUDMixin
-   inputFormMixin
-   helperMixin
-   searchMixin

2. Computed

-   dateRangeText: Joins the selected date with ' ~ '

3. Methods

-   getData(), formOutput(), getEditRowObject()
-   fetchPendingLeaves(): Fetches Pending Leaves for the logged in User
-   isDateBefore(): checks if the date passed is before todays date
-   deleteLeaveEntry(): Same As deleteEntry

## manage-agents

Travel Agent Section which contains detail for travel agent, their Addresses, Employees and Familarity Trip.

### index.vue

This section displays the Travel Agents and the Grade assigned to them. Admin/Management can assign a grade to the travel Agent, while sales/remote sales team member can only assign a grade for the country selected for Tarvel Agent

1. Mixins

-   defaultCRUDMixin
-   inputFormMixin
-   searchMixin

2. Components

-   companyInfo
-   ChangeLogModal
-   UploadModal
-   UploadLogs
-   ViewMoreModal

3. Computed

-   hidePreviousIcon: To hide the Previous Arrow in the ViewMoreModal Components Slot

4. Methods

-   getData(), setConfig(), advanceSearch(), formOutput(), getEditRowObject(), deleteEntry(), getCountryList()
-   getCities(): Gets a list of all Cities from the database
-   openChangelogsModal(): Toggle Opens Changelog modal
-   openUploadlogsModal(): Toggle Opens Upload Logs modal
-   openInformationModal(): Opens Viewmore Modal also stores value for selectedCompany and its Index
-   toggleUploadModal(): Toggle Upload modal
-   deleteTravelAgentEntry(): Same As deleteEntry
-   disableCompany(): Same As disableEntry
-   uploadFileFunc(): Calls the file upload API call
-   closeUploadModal(): Closes Upload modal
-   previousItem(): If Previous Arrow button is clicked this function is called
-   nextItem(): If next Arrow button is clicked this function is called
-   downloadSampleFileFunc(): Is called when Download File button is clicked in Upload Modal

### CompanyInfo.vue

It Sets the Tab For Each Selected Travel Agent in index.vue

### CompanyAddresses.vue

This section displays the Addresses for Selected Travel Agent Any User can Add/Edit or Disable an address

1. Mixins

-   defaultCRUDMixin
-   inputFormMixin
-   searchMixin

2. Components

-   ChangeLogModal

3. Methods

-   getData(), setInputConfig(), setSearchConfig(), advanceSearch(), formOutput(), getEditRowObject()
-   getCities(): Gets a list of all Cities from the database
-   openChangelogsModal(): Toggle Opens Changelog modal
-   disablePartner(): Same As disableEntry

### CompanyEmployees.vue

This section displays the Employees for Selected Travel Agent Any User can Add/Edit or Disable an Employee. But to create an employee an address should already exist

1. Mixins

-   defaultCRUDMixin
-   inputFormMixin
-   searchMixin
-   helperMixin

2. Components

-   ChangeLogModal

3. Methods

-   getData(), setInputConfig(), setSearchConfig(), advanceSearch(), formOutput(), getEditRowObject()
-   getAddresses(): Gets a list of all Address for the selected travel agent
-   getStates(): Gets a list of all States
-   openChangelogsModal(): Toggle Opens Changelog modal
-   disableEmployee(): Same As disableEntry
-   addCompanyEmployeeWrapper(): After Checking certain condition in formoutput, this function is called to add the travel agent Employee

### CompanyFamTrip.vue

This section displays the Addresses for Selected Travel Agent Any User can Add/Edit or Disable an address

1. Mixins

-   defaultCRUDMixin
-   inputFormMixin
-   searchMixin

2. Components

-   ChangeLogModal

3. Methods

-   getData(), setInputConfig(), setSearchConfig(), advanceSearch(), formOutput(), getEditRowObject(), deleteEntry(), getCountryList()
-   getEmployees(): Gets a list of all Employees for the selected travel agent
-   openChangelogsModal(): Toggle Opens Changelog modal
-   disableEmployee(): Same As disableEntry

## manage-targets

This section is only visible to the Admin/Management. It is used to Create, Delete Targets for any Year. Target is set to countries. To the sales team and remote sales team this is visible in the report section

### index.vue

In this section a year can be created, for whom the target needs to be set. In the Input config form, an existing year can be selected to just duplicate the targets.

1. Component

-   manage-targets/ProductTargets.vue

1. Mixins

-   defaultCRUDMixin
-   inputFormMixin

2. Methods

-   setInputConfig(), formOutput(), getEditRowObject()
-   getYearlyTargets(): Same as getData
-   deleteYear(): same as deleteEntry
-   openTargetsModal(): used to toggle viewMoreModal

### ProductTargets.vue

1. Mixins

-   defaultCRUDMixin
-   inputFormMixin
-   searchMixin

2. Computed

-   dateRangeText: Joins the selected date with ' ~ '

3. Methods

-   getData(), advanceSearch(),setInputConfig(), formOutput(), getEditRowObject(), getCountryList()
-   getCurrencyList(): Fetches a list of all active currencies in the system.
-   saveChanges() - This function is called when 'Save Changes' button is called. In the function the target list is traversed, where the target for whom value was set to blank. Also Every value is converted to a Number. Then an API function is called to save the values
-   discardChange(): Sets the Target values to the initial values.
-   resetValues(): This is called when another year is selected and the values for the component need to reset.

4. Props

-   targetYear: Contains the detail for the year selected in index.vue

## manage-users

This is where system users are created, updated or disabled.

### index.vue

This File Creates the tab structure and passes data to the component in the tab accordingly.

1. Component

-   manage-users/Users.vue

2. Methods

-   getCountryList()
-   setTabConfig(): Sets Tab config for the Manage Users section. This tab config consists of the props data, input config, search config that needs to be passed to Users.vue Component.

### Users.vue

This component gets rendedred as TAB item.

1. Mixins

-   defaultCRUDMixin
-   inputFormMixin
-   helperMixin
-   searchMixin

2. Methods

-   getData(), advanceSearch(), formOutput(), getEditRowObject(), disableUser(), setSearchConfig()
-   getMainContentSubtitle() - Gets different subtitle content for the Info Card Slot, based on the logged in user.
-   userPasswordReset() - Sends an API call to Reset password for the selected user.

3. Props

-   name: This is passed to the form component and is the name displayed on the top of the form
-   type: receives 'my_dsr' or 'all_dsr' to render different elements.
-   placeholder: This is placeholder for the search input
-   inputConfig: Config to set the form
-   activeCountriesList: Array of Active countries used to assign a country to any sales agent User.

## monthly-sales-report

This section is visible to all the users. Sales Team member and remote sales team member can create/edit a MSR by selecting a product, year, month and a monthly highlight. Admin/ Management can only view these MSR Entries. Admin/Management can see all the created Entries for the selected year. Sales/Remote Sales Users can only see the entries created by them.

### index.vue

In this section MSR Entries can be created/updated. Admin/ Management can only view these MSR Entries. Admin/Management can see all the created Entries for the selected year. Sales/Remote Sales Users can only see the entries created by them.

1. Component

-   monthly-sales-report/ReportView.vue

2. Mixins

-   defaultCRUDMixin
-   inputFormMixin
-   searchMixin
-   commonAPICallsMixin

3. Methods

-   getData(), setInputConfig(), formOutput(), getEditRowObject(), advanceSearch(),setSearchConfig()
-   setYear(): Sets the current and selected year
-   getMonthName(): Returns the complete name of the month based on the month number, for eg when 02 is passed to the function, February is returned.
-   getCountries(): For sales agent user sets the countrylist to the ones associated with the sales agent, For Remote sales agent countries list is set to all active countries
-   openExportForm(): used to toggle open exportForm. Export form is only visible to remotes sales user.
-   closeExportForm(): used to toggle close exportForm. Export form is only visible to remotes sales user.
-   exportFormOutput(): downloads the MSR for all products for selected year and month.
-   openTargetsModal(): used to toggle viewMoreModal
-   openMonthModal(): opens viewMoreModal to render reportview component

### ReportView.vue

This renders a downloadable list of all consolidated DSR entries

1. Mixins

-   helperMixins
-   defaultCRUDMixin

2. Methods

-   getData()
-   downloadReport(): Downloads the reportfor selected MSR Entry

3. Props

-   monthInfo: This is the info for the selected month. based on which get call is made

## representing-partner

This section is visible to all the users. Sales Team member and remote sales team member can only view the data. Admin/ Management can add/edit/disable these partners.

### index.vue

This component is where the partner companies are listed with the info of their proprietors information.

1. Component

-   representing-partner/PartnerEmployees.vue

2. Mixins

-   defaultCRUDMixin
-   inputFormMixin
-   searchMixin
-   helperMixin

3. Methods

-   getData(), formOutput(), getEditRowObject(), advanceSearch(),setSearchConfig()
-   disablePartner(): Same as disableEntry()
-   openEmployeeModal(): Opens viewmore modal and sets the selected partner information

### PartnerEmployees.vue

This component is where the partner companies employees are listed based on the country that they belong to.

2. Mixins

-   defaultCRUDMixin
-   inputFormMixin
-   searchMixin
-   helperMixin

3. Methods

-   getData(), formOutput(), getEditRowObject(), advanceSearch(),setSearchConfig(), setInputConfig()
-   deleteEmployee(): Same as deleteEntry()

## daily-sales-report

Daily sales report section is accessible to all the users in system where my DSR section is only visible to sales and remote sales agent. My DSR Consists of all the sales report made by the user that is logged in. All DSR consists of DSR made by all the system users.

### index.vue

This File Creates the tab structure and passes data to the component in the tab accordingly.

1. Component

-   daily-sales-report/reportsList.vue

1. Mixins

-   defaultCRUDMixin
-   commonAPICallsMixin

2. Methods

-   getSalesCallList(): Basic fetch call to get all Sales call made by the logged in user this is the passed to setConfig. As the list of sales call is required to make a DSR.
-   setConfig(): Sets Tab config for the DSR section. This tab config consists of the props data, input config, search config that needs to be passed to reportsList.vue Component.

### reportsList.vue

This component gets rendedred as TAB item. When this component gets rendered as 'My DSR' it fetches data for for the specific logged in User. While when rendered as 'ALL DSR' fetches data for all the user. Header Needs to be set for the columns that need to be visible

1. Mixins

-   defaultCRUDMixin
-   inputFormMixin
-   helperMixin
-   searchMixin
-   datePickerMixin

2. Computed

-   dateRangeText: Joins the selected date with ' ~ '

3. Methods

-   getData(), advanceSearch(), formOutput(), getEditRowObject()
-   canUserEdit(): Checks if the DSR Entry fits into the Edit period. The current Edit period is two months in the past and 1 month in future. For example if the current month is February, the call date can be from December of previous year to March.
-   deleteCall() - Same as deleteEntry()

4. Props

-   name: This is passed to the form component and is the name displayed on the top of the form
-   type: receives 'my_dsr' or 'all_dsr' to render different elements.
-   placeholder: This is placeholder for the search input
-   inputConfig: Config to set the form
-   searchConfig: Config to set the advance search
