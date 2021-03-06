# bike-safety-app
# 
# API used: 
### 1) Bikewise incidents: https://www.bikewise.org/documentation/api_v2#!/incidents/GET_version_incidents_format_get_0
### 2) Reverse Geocodes lookup: https://www.bigdatacloud.com/geocoding-apis/free-reverse-geocode-to-city-api?gclid=CjwKCAjw1v_0BRAkEiwALFkj5oZPTWnaOELHK_9-whruEaiEOWboApfvBzBXuVnr_6dV43bsf_63SRoCDIoQAvD_BwE
# 
# Problem Statement
### Provide data on bike incidents in major cities to inform bikers and bike owners of safety issues in different parts of a city. Users of this app can get info about the types of problems they may encounter in the areas they are concered about. They can use the info to steer them to safe areas when using their bikes.
# 
# Target users
### People who bike for fun, for work, and people who own bikes
# 
# Wireframe
### Home
![wireframe](./wireframes/Home.png)
### Filters for Search
![wireframe](./wireframes/Filter.png)
### Hazard Reports - show zip codes with highest hazard reports
![wireframe](./wireframes/Hazard_Sort.png)
### Theft Reports - show zip codes with highest theft reports
![wireframe](./wireframes/Theft_Sort.png)
### Unconfirmed Reports - show zip codes with highest crash reports
![wireframe](./wireframes/Unconfirmed_Sort.png)
### All Reports - show Zip codes with highest overall reports
![wireframe](./wireframes/Zip_Codes.png)
# 
# Components
### Stateful components
#### App.js - holds Ajax response data, etc
#### Filters.js - holds filter input
# 
### Functional components
#### HazardSort.js
#### TheftSort.js
#### UnconfirmedSort.js
#### ZipCodes.js
#### GraphByZip.js
#### ImageRow.js
#### BarChart.js
#
# Technologies used
### Redux+React to communicate filter change from Filters.js to App.js
### React-chart and chart.js package used for bar graph