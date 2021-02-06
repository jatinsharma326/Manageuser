# Application Overview

This document gives a basic overview of the inner working of the application

# Components

## BarChart.vue

This component with the help of Vue chartJS helps us `create a Bar Chart.`

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
    	width: "For Width Please Refer to **ConnectTo**",
    	disableTriggerKey: "The key that should trigger the disable function",
    	disableCheck: "Function that returns either true or false value based on the check that needs to be performed",
    	validations: {
    		For Validations Please Refer to **ConnectTo**
    	},
    }
```

2.Number - Basic Input field - To take Number Input

```js
    {
    	name: "Name of the input field (Use * to indicate Required Field)", //Required
    	type: "Number", //Required
    	key: "Name of the Form Output Key", //Required
    	width: "For Width Please Refer to **ConnectTo**",
    	disableTriggerKey: "The key that should trigger the disable function",
    	disableCheck: "Function that returns either true or false value based on the check that needs to be performed",
    	validations: {
    		For Validations Please Refer to **ConnectTo**
    	},
    }
```

3.TextArea - Basic Input field - To take TextArea Input

```js
    {
    	name: "Name of the input field (Use * to indicate Required Field)", //Required
    	type: "TextArea", //Required
    	key: "Name of the Form Output Key", //Required
    	width: "For Width Please Refer to **ConnectTo**",
    	disableTriggerKey: "The key that should trigger the disable function",
    	disableCheck: "Function that returns either true or false value based on the check that needs to be performed",
    	validations: {
    		For Validations Please Refer to **ConnectTo**
    	},
    }
```

4.Date - Basic Date Picker

```js
    {
    	name: "Name of the input field (Use * to indicate Required Field)", //Required
    	type: "Date",  //Required
    	key: "Name of the Form Output Key", //Required
    	width: "For Width Please Refer to **ConnectTo**",
    	disableTriggerKey: "The key that should trigger the disable function",
    	disableCheck: "Function that returns either true or false value based on the check that needs to be performed",
    	validations: {
    		For Validations Please Refer to **ConnectTo**
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
    	width: "For Width Please Refer to **ConnectTo**",
    	disableTriggerKey: "The key that should trigger the disable function",
    	disableCheck: "Function that returns either true or false value based on the check that needs to be performed",
    	validations: {
    		For Validations Please Refer to **ConnectTo**
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
    	width: "For Width Please Refer to **ConnectTo**",
    	disableTriggerKey: "The key that should trigger the disable function",
    	disableCheck: "Function that returns either true or false value based on the check that needs to be performed",
    	validations: {
    		For Validations Please Refer to **ConnectTo**
		},
    }
```

7.Dropdown - Basic Dropdown

```js
    {
    	name: "Name of the input field (Use * to indicate Required Field)", //Required
    	type: "Dropdown", //Required
    	key: "Name of the Form Output Key", //Required
    	width: "For Width Please Refer to **ConnectTo**",
    	disableTriggerKey: "The key that should trigger the disable function",
    	disableCheck: "Function that returns either true or false value based on the check that needs to be performed",
    	isListInStore:	"If the List is in the store this needs to be set to true else set to false", //Required
    	listVariable: "If isListInStore is set to TRUE then the list name comes here",
    	listItems:"If isListInStore is set to FALSE then the array of list item value is passed here",
    	multi:"Allows multiple select in the list if set to true. Can only select one by default", //Required
    	itemText:"Set property of items’s text value",
    	itemValue:"Set property of items’s value - must be primitive.",
    	validations: {
    		For Validations Please Refer to **ConnectTo**
    	},
    }
```

8.DropdownWithMoreInfo - Dropdown with a more info for the list Item - Can be used to give description to the list item

```js
    {
    	name: "Name of the input field (Use * to indicate Required Field)", //Required
    	type: "DropdownWithMoreInfo", //Required
    	key: "Name of the Form Output Key", //Required
    	width: "For Width Please Refer to **ConnectTo**",
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
    		For Validations Please Refer to **ConnectTo**
    	},
    }
```

9.AsyncDropdownWithMoreInfo - Dropdown with a more info for an `asynchronous list` Item - Can be used to give description to the list item

```js
    {
    	name: "Name of the input field (Use * to indicate Required Field)", //Required
    	type: "AsyncDropdownWithMoreInfo", //Required
    	key: "Name of the Form Output Key", //Required
    	width: "For Width Please Refer to **ConnectTo**",
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
    		For Validations Please Refer to **ConnectTo**
    	},
    }
```

### Mixins

-   **lorem** :

### Props

-   **ipsum** :
-   **dolar** :

---

## ComponentName.vue

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Mixins

-   **lorem** :

### Props

-   **ipsum** :
-   **dolar** :

---

## ComponentName.vue

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Mixins

-   **lorem** :

### Props

-   **ipsum** :
-   **dolar** :

---

## ComponentName.vue

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Mixins

-   **lorem** :

### Props

-   **ipsum** :
-   **dolar** :
