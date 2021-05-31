# Reduction in mobility and COVID-19 transmission


Data analysis and interactive website to explore the patterns between changes in population mobility due to COVID-19 policies and the effect on the spread of the virus and its reproduction rate.



## Contents

### >> EDA
Folder `EDA` contains all the exploratory data analysis performed in order to collect ideas and insights worthy to be developed further.

The file `main.R` contains the source code that gets data from Google COVID-19 Community Mobility Reports and coronavirus statistic from Our World in Data website. It perform some basic data crunching in order to joing both datasets and generate a file with data at national level, for a specific list of countries.

The folder `snapshots`contain temporal images of exploratory visualizations created in Tableau and Vega.js, in order to validate initial ideas (like the weekly seasonality on mobility changes and the relationship between the mobility and the R0). Vega specifications are located at the folder `vega_specifications`.




### >> Interactive website

Folder `web-interactive` contains the website boostraped with React.js using the toolchain [Create React App](https://github.com/facebook/create-react-app). Graphics and scrollytelling are built with D3.js and scrollama.js.


#### Available Scripts

In the project directory, you can run:

`yarn start` to runs the app in the development mode.Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

`yarn build` to build the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.


### Further ideas
- The visual features present in the connected scaterplots (["Connected Scatterplot for Presenting Paired Time Series"](http://steveharoz.com/research/connected_scatterplot/), Steve Haroz et al) look powerful when used in the right context, specially when doing narrative storytelling. 
- When looking at the correlation between mobility changes and reproduction R, explore rolling averages on both metrics, to smooth local peaks. Also having a time window of 10 days between mobility and R to see effect on R due to previous mobility restrictions.
- Wondering if there is a way to cluster countries based on its similar pandemic behaviour. Although this would present a lot of methodological problems (reliable data sources, complete and trusty enough), I would like to try some Principal Component Analysis on time series in order to get some preliminary results and compare them with e.g. the Bloomberg’s Covid Resilience Ranking.
- On the same line, grouping countries by economies or other large-scale indicartors and dig further with more analysis.