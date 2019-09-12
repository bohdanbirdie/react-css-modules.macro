const pluginTester = require("babel-plugin-tester");
const plugin = require("babel-plugin-macros");
const prettier = require("prettier");

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: {
    filename: __filename,
  },
  formatResult(result) {
    return prettier.format(result, { trailingComma: "es5" });
  },
  tests: {
    "basic usage": `
    import { macro } from "../macro";
    import React, { Component } from 'react';
    import styles from './Button.module.css';
    import './another-stylesheet.css';
    
    macro(styles)
    
    class Button extends Component {
      render() {
        return (
          <button className="some_global_style" styleName="styles-file-style">
              Error Button
          </button>
        )
      }
    }
    `,
  },
});
