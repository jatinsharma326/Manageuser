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
