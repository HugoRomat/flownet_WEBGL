const path = require('path');
const webpack = require('webpack');
var webpackUglifyJsPlugin = require('webpack-uglify-js-plugin');
var debug = process.env.NODE_ENV !== "production";


module.exports = {
  entry: [
    "./src/js/index.ts"
  ],
  module: {
    rules: [
		{
			test: /\.(glsl|vert|frag)$/,
			use: ["raw-loader", "glslify-loader"],
			exclude: /node_modules/
    },
    {
      test: /\.node$/,
      use: 'node-loader'
  },
		{	
			test: /\.(jpe?g|png|gif|svg)$/i, 
			loader: "url-loader?name=/src/img/[name].[ext]"
		},
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader', 
            options: {
              ignoreDiagnostics: [7034, 7005, 7030, 2350, 7018, 6133, 7008, 7006, 2345, 2339, 2403, 7017, 2362, 2686, 2693, 2322]
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' , '.vert', '.png']
  },
  output: {
    libraryTarget: 'umd',
    filename: "[name].entry.js",
	  path: path.resolve(__dirname, 'dist'),
	  library: 'flownet'
  },
  plugins: !debug ?[
	  // new webpack.optimize.UglifyJsPlugin({
		// sourceMap: true,
		// comments: false,
		// compress: {
		// 	// remove warnings
		// 	   warnings: false,
   
		// 	// Drop console statements
		// 	   drop_console: true
		//   }})
	  
  ] : []
};