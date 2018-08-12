# Alaskan Fishery Network Analysis Data Viz

Alaskan fisheries are highly interconnected, meaning that fishermen with permits to exploit one fishery are likely to have permits to fish in another. A fishery is defined by its combination of species, gear (such as gillnets or longlines), and location. For instance, the Salmon–Drift gillnet–Southeast fishery (S-3-A) shares a relatively large number of permit holders with the Dungeness crab–pot gear vessel under 60 feet–Southeast fishery (D-9-A). Any change in policy governing S-3-A is therefore likely to have spillover effects on D-9-A. The same propensity is present throughout the network of fisheries.

The work informing this feature uses the techniques of network analysis to describe and quantify the interconnectedness of the fisheries. Policymakers seeking to regulate or protect one fishery need to understand that interconnectedness to avoid negative consequences, protect fish resources, and safeguard fishing communities.

This feature allows visitors to explore to see the network-analysis results for each fishery, the cluster to which it belongs, and the network as a whole. It shows which individual fisheries are most connected to others and which clusters are most tightly connected internally.

This research is described further in the peer-reviewed journal article ["Identifying the Potential for Cross-Fishery Spillovers: A Network Analysis of Alaskan Permitting Patterns"](http://www.rff.org/research/publications/identifying-potential-cross-fishery-spillovers-network-analysis-alaskan), the RFF *Resources* article ["Understanding Linkages across Fisheries Can Inform More Effective Policy Design"](http://www.rff.org/research/publications/understanding-linkages-across-fisheries-can-inform-more-effective-policy), and a related [blog post](http://www.rff.org/blog/2018/network-analysis-reveals-hidden-patterns-fishing-enterprises).

## About the code

This feature is written in framework-less ES6 JavaScript compiled and transpiled through Webpack. It uses D3 for the data viz; the map itself was prerendered through a separate D3-based standalone project.

**The Data**

The data underlying the map, bar charts, and the most and least connected lists comes from data/fisheries-sorted-csv; data for the list showing fisheries most connected to the select fishery comes from data/adjacency-matrix.csv. Cluster data is in clusters.csv; network in network.csv. Regions.csv, network.csv, and species.csv are dictionaries to decode the fishery codes. Tooltip descriptions are in  descriptions.json.

## To edit

1. [Install npm](https://www.npmjs.com/get-npm)
1. Clone the repository.
1. Run `npm install` in the directory of your repository to install Webpack and other dev dependencies
1. Run `npm run start` to start Webpack's dev server. Most edits will show in your browser immediately via Webpack's [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/).

## To deploy

1. Run `npm run build` to emit build files to the dist/ folder
1. The live code exists inline in the body of a page on RFF's site
1. To edit the live page, cut and paste css/styles.css and js,index.js and the relevant bits of index.html into the right places in the content body. Existing page content is commented to make this clear.

The app works on its own but is not fully designed until it is part of an RFF page. Global changes to the website will affect the display of this app, that is, the design relies on global CSS. 

**Note that the page's layout has been changed from two-column default to single-column**