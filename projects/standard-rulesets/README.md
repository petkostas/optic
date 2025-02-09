# Standard rulesets

Installation:

```
npm install -D @useoptic/standard-rulesets
```

```
yarn add -D @useoptic/standard-rulesets
```

Standard rules can be configured to certain endpoints by passing in a matches block. Example:

```javascript
new BreakingChangesRules({
  matches: (ruleContext) =>
    ruleContext.operation.method === 'get' &&
    ruleContext.operation.path === '/api/users',
});

// or you can match custom extentions
new BreakingChangesRules({
  matches: (ruleContext) =>
    ruleContext.operation.value['x-stability'] !== 'draft',
});
```

## Breaking Changes Rules

```javascript
const { BreakingChangesRuleset } = require('@useoptic/standard-rulesets');
```

The rules that are enforced are:

- prevent operation removal
- prevent adding new required query, cookie or header parameters
- prevent changing query, cookie, or header parameter optional -> required
- prevent changing query, cookie, path or header parameter types
- prevent adding required request body property
- prevent changing request body property optional -> required
- prevent changing request body property types
- prevent removing a response body property
- prevent changing response body property required -> optional
- prevent changing response body property types
- prevent removing a response status code

Specific rules can be ignored with the `skipRules` attribute, and an accept list can be passed with `rulesOnly`:

```javascript
new BreakingChangesRuleset({
  // the "prevent operation removal" rule won't apply. All other rules apply.
  skipRules: ['prevent operation removal'],
});

new BreakingChangesRuleset({
  // Only the two selected rules will apply.
  rulesOnly: [
    'prevent removing response property',
    'prevent new required path parameters',
  ],
});
```

## Naming Change rules

```javascript
const { NamingChangesRuleset } = require('@useoptic/standard-rulesets');
```

```javascript
new NamingChangesRuleset({
  applies: 'always', // also available: 'added' | 'addedOrChanged'
  options: {
    // valid formats are: 'camelCase' | 'Capital-Param-Case' | 'param-case' | 'PascalCase' | 'snake_case'
    properties: 'camelCase',
    queryParameters: 'camelCase',
    requestHeaders: 'camelCase',
    pathComponents: 'param-case',
    responseHeaders: 'camelCase',
  },
});
```
