# CallFloat import fix

Fixed the Vite 500 errors caused by incorrect and duplicate `CallFloat` imports.

All page files now import the component from:

```jsx
import CallFloat from '../../components/CallFloat/CallFloat'
```

The duplicate declaration in `client/src/pages/Contact/Contact.jsx` was removed.

Validated all JS/JSX syntax and relative imports.
