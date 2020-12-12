const webpack = require('webpack');


module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        API: {
          GET_TIER_LIST_API: JSON.stringify(process.env.GET_TIER_LIST_API)
        }
      }
    })
  ]
}
