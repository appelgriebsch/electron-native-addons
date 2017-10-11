'use strict';

var edge = require('electron-edge-js');

var helloWorld = edge.func(function () {/*
  async (input) => {
      return ".NET Welcomes " + input.ToString();
  }
*/});

/* var clrMethod = edge.func({
  assemblyFile: 'My.Edge.Samples.dll',
  typeName: 'Samples.FooBar.MyType',
  methodName: 'MyMethod' // This must be Func<object,Task<object>>
}); */

var osVersion = edge.func(require('path').join(__dirname, 'SysInfo.cs'));

exports.helloWorld = helloWorld;
exports.osVersion = osVersion;