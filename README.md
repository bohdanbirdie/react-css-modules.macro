# react-css-modules.macro

[![Babel Macro](https://img.shields.io/badge/babel--macro-%F0%9F%8E%A3-f5da55.svg?style=flat-square)](https://github.com/kentcdodds/babel-plugin-macros)

Inspired by [babel-plugin-react-css-modules](https://github.com/gajus/babel-plugin-react-css-modules)

## Motivation

With support of CSS Loader - CSS modules became a common use case, especially in [Create React App](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet).
One of the downsides is that you are forced to access styles map via object keys which is not so handy.

```JavaScript
import React, { Component } from 'react';
import styles from './Button.module.css'; // Import css modules stylesheet as styles
import './another-stylesheet.css'; // Import regular stylesheet

class Button extends Component {
  render() {
    // reference as a js object
    return <button className={styles.error}>Error Button</button>;
  }
}
```

One of the solutions is using the [babel-plugin-react-css-modules](https://github.com/gajus/babel-plugin-react-css-modules) but you either need to eject or rewire.

Since CRA support [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) - we can take andatage of that and still have `styleName` attribute be mapped to imported css modules.

## Usage

```JavaScript
import { macro } from 'react-css-modules.macro';
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
```

Will be converted to

```JavaScript
import _bindStyleNames from "react-css-modules.macro'/dist/bindStyleName";
import React, { Component } from 'react';
import styles from './Button.module.css'; // Import css modules stylesheet as styles

import './another-stylesheet.css'; // Import regular stylesheet

const _getStyleName = _bindStyleNames(styles);

class Button extends Component {
  render() {
    return (
      <button className={"some_global_style" + _getStyleName("styles-file-style")}>
        Error Button
      </button>
    );
  }

}
```



## License

MIT
