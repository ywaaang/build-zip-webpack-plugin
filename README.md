# Zip File Plugin

## functionality
1. zip all build output into one zip file
2. it is easier for manual deployment

## usage
```js
const ZipFilePlugin = require('zip-file-plugin');
new ZipFilePlugin({
    name: 'dev', // zip file name
    removeOrigin: true, // delete outputted files
    path: './build', // out put file folders to be zipped
})
```