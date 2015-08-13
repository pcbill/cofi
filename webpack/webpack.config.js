var webpack = require('webpack');
var path = require('path');
var appRoot = path.join(__dirname, 'public');
var nodeRoot = path.join(__dirname, 'node_modules');

module.exports = {
  entry: ['./main.js'],
  output: {
    publicPath: "/js/",
    //path: '../../../build/distributions/mdm/static/js',
    path: '../../../static/js',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
    /*{
      test: /\.js(x?)$/,
      loaders: ['react-hot', 'babel'],
      exclude: /node_modules/
    },*/
    {
      test: /\.js(x?)$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.less$/,
      loader: 'style-loader!css-loader!less-loader'
    },

    {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    },    
    { test: /\.png$/, loader: "url-loader?limit=100000" },
    { test: /.gif$/, loader: "url-loader?mimetype=image/png" },
    { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
    { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }/*,
    {
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=100000'
    }*/]
    
  },
  resolve: {

    extensions: ['', '.js', '.jsx'],

    alias: {
      "defineMyCSS": "./css/defineStyle.css",
      "bootstrapCSS": nodeRoot + "/bootstrap/dist/css/bootstrap.min.css",
      "components": path.join(__dirname, "./componets"),
      "pages": path.join(__dirname, "./pages"),
      "actions": path.join(__dirname, "./actions"),
      "stores": path.join(__dirname, "./stores"),
      "locales": path.join(__dirname, "./locales"),
      "net": path.join(__dirname, "./net"),
      "AppDispatcher": path.join(__dirname, "./dispatcher/AppDispatcher")
    }

  },
  plugins: [
      //new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
  ]
};
