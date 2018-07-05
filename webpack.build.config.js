const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const scssSharedLoaders = [{ // defining array of css loaders here to avoid duplication below
		loader: MiniCssExtractPlugin.loader,
	},{
		loader: 'postcss-loader',
		options: {
			sourceMap: true
		}
	},{
		loader: 'sass-loader',
		options: {
			sourceMap: true
		}
}];

module.exports = {
	entry: {
      	'js/index': './src/index.js'
    },
    devtool: 'inline-source-map', // may be too slow an option; set to another if so
    mode: 'production',
    module: {
    	rules: [
	       	{
	        	test: /\.scss$/,
	        	exclude: /main\.scss/,
	         	use: [scssSharedLoaders[0], 
	         		{
						loader: 'css-loader',
						options: {
							//modules: true,
							//localIdentName: '[name]_[local]',
							sourceMap: true,
							minimize: true,
							importLoaders: 1		
						}
					},
					...scssSharedLoaders.slice(1)]
	        }, {
	        	test: /main\.scss/, // the html refering to classes in main.scss is hard-coded in the index.ejs template
	        						// and therefore these styles should not be renamed bc the html would no longer match
	         	use: [scssSharedLoaders[0],
	         		{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							minimize: true,
							importLoaders: 1		
						}
					},
					...scssSharedLoaders.slice(1)]
	        },{
			      test: /\.js$/,
			      exclude: /node_modules/,
			      use: ['babel-loader','eslint-loader']
		    }
     	]
   },
    plugins: [
    	new CleanWebpackPlugin(['dist']),
    	new HtmlWebpackPlugin({
    		title: 'TITLE TITLE TITLE',
    		inject: false,
		    template: './src/index.html',
		}),
     	new MiniCssExtractPlugin({
	      // Options similar to the same options in webpackOptions.output
	      // both options are optional
	      filename: "css/styles.css",
	      chunkFilename: "[id].css",
	    }),
        new CopyWebpackPlugin([{
            from: 'data/*.*',
            context: 'src'
        }])
    ],
  	output: {
    	filename: '[name].js',
    	path: path.resolve(__dirname, 'dist')
  	}
};