const presets = [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage", // alternative mode: "entry"
        "corejs": 3, // default would be 2
        "targets": "> 1%, last 2 versions, IE 10" 
        // set your own target environment here (see Browserslist)
      }
    ]
  ];
  
  module.exports = { presets };