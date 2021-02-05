# Application Overview

This document gives a basic overview of inner working of the application

# Components

## BarChart.vue

This component with the help of Vue chartJS helps us `create Bar Chart.`

### Mixins

-   **mixins.reactiveProp** : This is pCrovided by chartJS. `On data mutation`, it will call `update()` if the data inside the datasets has changed, or `renderChart()` if new datasets were added.

### Props

-   **chartData** : It contains the `main data` that is used to create the chart.
-   **options** : Options are `basic chartJs options` that help us get certain functionality out of chartJS
    <!-- -   myTabId : -->

For more information you can visit https://vue-chartjs.org/guide/#creating-your-first-chart

---

## ChangeLog.vue

This is the changelog modal. Which is used to show `what was updated` on the selected object and `who updated it.` It shows Who Enabled/Disabled/Updated/Created the selected Element

### Mixins

-   **helperMixin** : Please refer **ConnectTo**
-   **SearchMixin** : Please refer **ConnectTo**

### Props

-   **toggleChangelogModal** : Used to Toggle the Modal
-   **selectedInfo** : Info of the element for which the changelog has to be displayed

---

## Form.vue

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

---

## ComponentName.vue

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Mixins

-   **lorem** :

### Props

-   **ipsum** :
-   **dolar** :
