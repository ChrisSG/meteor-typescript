'use strict';

var ts = require("typescript");
var _ = require("underscore");

function presetCompilerOptions(customOptions) {
  if (! customOptions) return;

  var compilerOptions = _.clone(customOptions);

  // Declaration files are expected to
  // be generated separately.
  compilerOptions.declaration = false;

  // Overrides watching,
  // it is handled by Meteor itself.
  compilerOptions.watch = false;

  // We use source maps via Meteor file API,
  // This class's API provides source maps
  // separately but alongside compilation results.
  // Hence, skip generating inline source maps.
  compilerOptions.inlineSourceMap = false;
  compilerOptions.inlineSources = false;

  // Always emit.
  compilerOptions.noEmit = false;
  compilerOptions.noEmitOnError = false;

  // Don't generate any files, hence,
  // skip setting outDir and outFile.
  compilerOptions.outDir = null;
  compilerOptions.outFile = null;

  // This is not need as well.
  // API doesn't have paramless methods.
  compilerOptions.rootDir = null;
  compilerOptions.sourceRoot = null;

  return compilerOptions;
}

exports.presetCompilerOptions = presetCompilerOptions;

// Default compiler options.
function getDefaultCompilerOptions() {
  return {
    target: "ES3",
    module : "commonjs",
    moduleResolution: "node",
    sourceMap: true,
    noResolve: false,
    diagnostics: true,
    // Always emit class metadata,
    // especially useful for Angular2.
    emitDecoratorMetadata: true,
    // Support decorators by default.
    experimentalDecorators: true
  }
}

exports.getDefaultCompilerOptions = getDefaultCompilerOptions;

// Validate compiler options and convert them from 
// user-friendly format to enum values used by TypeScript, e.g.:
// 'system' string converted to ts.ModuleKind.System value.
function convertCompilerOptionsOrThrow(options) {
  if (! options) return null;

  var testOptions = {};
  testOptions.compilerOptions = options;
  testOptions.files = [];
  var result = ts.parseJsonConfigFileContent(testOptions);

  if (result.errors && result.errors.length) {
    throw new Error(result.errors[0].messageText);
  }

  return result.options;
}

exports.convertCompilerOptionsOrThrow = convertCompilerOptionsOrThrow;
