# Component styling structure

Each React component now lives in its own folder and imports its own CSS file.

Example:

```text
client/src/components/Hero/
├── Hero.jsx
└── Hero.css
```

`client/src/styles/global.css` contains only design tokens, reset rules, shared layout utilities, and shared button styles. Component-specific styling is no longer stored in one monolithic stylesheet.
