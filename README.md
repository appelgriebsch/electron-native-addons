# electron-native-addons
Some samples for reusing native code in Electron applications

## Getting started

### Pre-requisites

1. Install a recent node.js variant (LTS, current) - http://www.nodejs.org
2. Install Git - https://git-scm.com/
3. Install Python 2.7.x - http://www.python.org
4. Install OS-specific development tools - https://github.com/nodejs/node-gyp
  - Windows: Visual C++ Build Tools - http://landinghub.visualstudio.com/visual-cpp-build-tools
  - Mac: Xcode, Command Line Tools - http://developer.apple.com
  - Linux: Make, GCC, G++
5. Install Electron-Forge npm package via ```npm i -g electron-forge```
6. Initialize a new Electron application via ```electron-forge init <appname>```
7. Install required node dependencies into Electron application
  - C/C++ Source Code: NAN / node-addon-api - https://github.com/nodejs/node-addon-examples
  - Node-FFI: ffi / ref-array - https://github.com/node-ffi/node-ffi
  - Edge-JS: edge-js / electron-edge-js - https://github.com/agracio/edge-js
