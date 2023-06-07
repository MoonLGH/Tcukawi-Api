# API Installation Guide

## Introduction
The TsukariAPI is a powerful API that allows you to interact with the Tsukari.tech platform. This guide will walk you through the steps to install and use the API in your project.

## Option 1: Sending API Requests Manually
To send API requests manually, you can use the base URL `https://api.tsukari.tech` and make HTTP requests to the desired endpoints using your preferred programming language or tool. Below is an example using JavaScript's `fetch` function:

```javascript
fetch('https://api.tsukari.tech/endpoint', {
  method: 'POST', // or GET, PUT, DELETE, etc.
  headers: {
    'Content-Type': 'application/json',
    // Add any other required headers
  },
  body: JSON.stringify({
    // Include the request payload here
  }),
})
  .then(response => response.json())
  .then(data => {
    // Handle the response data
  })
  .catch(error => {
    // Handle any errors
  });
```

Replace `'https://api.tsukari.tech/endpoint'` with the actual API endpoint URL you want to send requests to.

## Option 2: Installing the NPM Package (MoonLGH/TsukariAPI)
If you prefer a more convenient way to interact with the TsukariAPI, you can install the NPM package `MoonLGH/TsukariAPI`. This package provides a client library that simplifies API usage. Follow the steps below to install and use it:

1. Install the package using NPM:

```shell
npm install @moonlgh/tsukari-api
```

2. Import the `client` object from the package in your project:

```javascript
import { client } from '@moonlgh/tsukari-api';
```

3. Create a client instance with optional configuration:

```javascript
const apiClient = client({
  // Configuration options (if needed)
});
```

You can pass a configuration object to the `client` function to customize the behavior of the API client. Examples of configuration options include authentication tokens, default headers, and base URL overrides.

4. Use the `apiClient` object to call the desired API endpoints using the provided methods. Here's an example of making a POST request:

```javascript
apiClient.*.*()
```


That's it! You have successfully installed and configured the TsukariAPI for your project. Feel free to explore the available endpoints and methods in the API documentation for more details on how to use specific features.
