# Stratumn SDK for Javascript

## Quickstart

```javascript
var Stratumn = require('stratumn');

// Create a client for application named 'demo'
Stratumn.getApplication('demo')
  .then(function(app) {

    /**
     * Ex: Show application information
     */
    console.log(app.getInfo());

    /**
     * Ex: Create a chain and call transition functions
     */
    app
      // Create a new chain, you can pass arguments to init
      .createChain('An argument if needed')
      // It resolves with the first link
      .then(function(link) {
        // You can call a transition function like a regular function
        return link.sendMessage('Hello, World');
      })
      .then(function(link) {
        // Append another link
        return link.sendMessage('Hello, World, Again');
      })
      .then(function() {
        console.log('All done!');
      })
      // Catch any errors
      .catch(console.error);

    /**
     * Ex: Load an existing link and call transition functions
     */
    app
      // Load the link
      .getLink('a43234eccd')
      // It resolves with the link
      .then(function(link) {
        // You can call a transition function like a regular function
        return link.sendMessage('Hello, World');
      })
      .then(function() {
        console.log('All done!');
      })
      // Catch any errors
      .catch(console.error);

    /**
     * Ex: Get the previous link of a link
     */
    app
      // Load the link
      .getLink('a43234eccd')
      // It resolves with the link
      .then(function(link) {
        // Get the previous link
        return link.getPrevious();
      })
      // It resolves with the previous link
      .then(function(link) {
        // You can call a transition function like a regular function
        return link.sendMessage('Hello, World');
      })
      .then(function() {
        console.log('All done!');
      })
      // Catch any errors
      .catch(console.error);

  });
```
