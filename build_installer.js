//  Import Modules.

const {MSICreator } = require('electron-wix-msi');

const path = require('path');

// 2. Define input and output directory.

// Important: the directories must be absolute, not relative e.g

// appDirectory: "D:\\desktop-app\\electron\\Desktop-app-win32-x64",
const APP_DIR= path.resolve('C:\\Users\\VeLpeR\\Documents\\GitHub\\redbricks_Frontend_vikrant\\out\\redbricks-frontend-win32-x64');

//output directory
const OUT_DIR  = path.resolve(__dirname,'./installer_redbricks')
// 3. Instantiate the MSICreator

const msiCreator = new MSICreator({
appDirectory: APP_DIR, outputDirectory: OUT_DIR,

// Configure metadata

exe: 'redbricks-frontend',
description: 'This is a RedBox application' ,
name: 'redbricks-frontend',
version: '1.0.0',
manufacturer: 'sbst',

// Configure installer User Interface
ui: {
chooseDirectory: true
},
});

// 4. Create a .wxs template file

msiCreator.create().then(function(){

// Step 5: Compile the template to a .msi file
msiCreator.compile();
})
