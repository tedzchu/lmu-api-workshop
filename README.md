# API Calls in Client-Side JavaScript

## Introduction

This will be an introductory workshop on retrieving data using the `fetch()` API for GET requests with Promises. Maybe I'll have time for more, but only tell.

This material is just a compilation of the API Calls workshop I am leading at Loyola Marymount University's inaugural hackathon (LMU Hacks). I wouldn't call myself a know-it-all and some of this material is highly tailored to the material I will be presenting on, but I'll do my best to document here.

## Quick Overview

**API** stands for Application Program Interface, which can be defined as a set of methods of communication between various software components. In other words, an API allows software to communicate with another software.

We'll be focusing specifically on Web APIs, which allow a web server to interact with third-party software. In this case, the web server is using HTTP requests to communicate to a publicly available URL **endpoint** containing JSON data.

You may be familiar with the concept of a **CRUD** app, which stands for Create, Read, Update, Delete. Any programming language can be used to make a CRUD app with various methods. A web API uses HTTP requests that correspond to the CRUD verbs.

| Action | HTTP Method   | Description                  |
| ------ | ------------- | ---------------------------- |
| Create | `POST`        | Creates a new resource       |
| Read   | `GET`         | Retrieves a resource         |
| Update | `PUT`/`PATCH` | Updates an existing resource |
| Delete | `DELETE`      | Deletes a resource           |

For the purposes of this workshop, we'll just be looking at a few implementations of `GET` and how to do a `POST`.

## Part 1 - Getting Some Data in a `<script>` Tag

Look at some cats: <https://random.cat/>

This is a simple implementation of the `fetch()` API to ping a random cat image website.

```javascript
fetch('https://aws.random.cat/meow').then(response => {
  if (response.ok) {
    console.log('cat fetched');
    return response.json();
  } else {
    return Promise.reject(response);
  }
});
```

This is the basic structure for a fetch request. `fetch()`returns what is called a **promise**.

> Promises are objects that acts as sort of a placeholder for an asynchronous function whose response is not yet known. A Promise has three states: pending (initial, result unknown), fulfilled (operation completed successfully), or rejected (operation failed).

Fetch Promises **don't reject on HTTP error statuses** and need to be checked with `response.ok`. (Note: if you are looking for HTTP statuses, [200-399] tend to be good, while anything > 400 is bad.)

```javascript
  .then(data => {
    document.getElementById('cat').src = data.file;
  })
```

Calling the URL with `fetch()` causes this API in particular to return a JSON object with a 'file' property:

```JSON
{"file":"https:\/\/purr.objects-us-east-1.dream.io\/i\/cute_animals_show_feeling_06.jpg"}
```

Since we're calling the Promise in our second `then()` "data", we'll be able to retrieve this URL by accessing `data.file`.

```
  .catch(error => {
    console.warn('error!', error);
  });
```

As stated earlier, fetch Promises don't reject on HTTP error statuses. They are most commonly rejected on network errors. This last block is to catch what the error could be in your console.

Here's what that looks like all together:

```javascript
fetch('https://aws.random.cat/meow')
  .then(response => {
    if (response.ok) {
      console.log('cat fetched');
      return response.json();
    } else {
      return Promise.reject(response);
    }
  })
  .then(data => {
    document.getElementById('cat').src = data.file;
  })
  .catch(error => {
    console.warn('error!', error);
  });
```

## Part 2 - Posting to a Public API

Read the docs: <https://developer.github.com/v3/gists/#create-a-gist>

Despite the name, the `fetch` API also allows you to publish data as well! In this example, we'll be interfacing with the GitHub API to create a Gist. This does require a GitHub account, so be wary of this.

```javascript
fetch('https://api.github.com/gists', {
  method: 'post',
  body: JSON.stringify(opts),
  headers: new Headers({
    'Content-Type': 'application/json',
    Authorization: 'token [YOUR_TOKEN_HERE]'
  })
});
```

There are a few more things going on here than the get we did last time. First off, this `fetch` is taking in both a URL string as well as an object with a few properties. Notice the `method` prpoerty indicating that we will indeed be using a post. The `fetch()` call defaults to get so this is necessary, along with some other things for the post.

```javascript
body: JSON.stringify(opts),
```

The `body` property is straightforward, as this will be the body of your post request. By calling `JSON.stringify` on my `opts` (options) value, I'm converting it into a JSON format for the endpoint.

```javascript
headers: new Headers({
  'Content-Type': 'application/json',
  Authorization: 'token [YOUR_TOKEN_HERE]'
});
```

Since the GitHub API requires authentication, you have to include `headers` here. I would imagine most (if not all) public APIs that allow posting of data would require some user authentication.

The `Authentication` property here is referring to an OAuth Token I generated on my GitHub account (please ask me to do this during the workshop). It is **absolutely required** to **not commit any tokens or other sensitive keys**. I keep them in a file called `.env` and .gitignore'd it so I can copy/paste on a whim.

```javascript
.then(function(response) {
  console.log(response);
  return response.json();
})
```

The response comes back as a stream, and the `json()` call will consume the promise and return the data in a JSON format. In this case, your new Gist URL should be in the response as `html_url`.

```javascript
.then(function(data) {
  if (data.html_url) {
    console.log('Created Gist:', data.html_url);
    document.querySelector('span').innerHTML =
      '<a href="' + data.html_url + '">View Your New Gist Here!</a>';
  } else {
    document.querySelector('span').innerHTML =
      'There was an error creating your Gist. Please check your authentication headers.';
  }
});
```

Finally, since there are no network errors, we add a check for whether or not the aforementioned `html_url` even exists. If not, we give them an error. I chose to ask about authentication headers since this is a likely pitfall. Hopefully we just append the span at the bottom of our page with a link to the newly created Gist.

Here's what it looks like altogether, wrapped in another function `createGist(opts)` to be called on by the submit button on our HTML page:

```javascript
function createGist(opts) {
  console.log('Posting request to GitHub API...');
  fetch('https://api.github.com/gists', {
    method: 'post',
    body: JSON.stringify(opts),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: 'token [YOUR_TOKEN_HERE]'
    })
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.html_url) {
        console.log('Created Gist:', data.html_url);
        document.querySelector('span').innerHTML =
          '<a href="' + data.html_url + '">View Your New Gist Here!</a>';
      } else {
        document.querySelector('span').innerHTML =
          'There was an error creating your Gist. Please check your authentication headers.';
      }
    });
}
```

## Part 3 - Async/Await

Read the docs: <https://ghibliapi.herokuapp.com/>

Ready for your fetch requests to take up far less lines? Me too!

We'll be using a Studio Ghibli API which returns JSON of Ghibli film titles and their descriptions.

You'll notice a lot of the code in this module is in the `script.js` file as I'd like to get closer to React, which we will cover last.

We've already covered `fetch` get requests in part 1, so let me present to you the entire request wrapped in a `getFilms()` function:

```javascript
function getFilms() {
  fetch('https://ghibliapi.herokuapp.com/films')
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    })
    .then(function(data) {
      generateFilmCards(data);
    })
    .catch(function(err) {
      console.warn('Something went wrong.', err);
    });
}
```

You'll notice that after we do our fetch, `then` something happens with the `response`. `then` another thing happens with that `data`. But we also have to `catch` any errors. These callbacks can start to look a little complicated with more data, plus multiple `then`s can easily lead to bad performance or bugs.

> Async and Await to the rescue! Keep in mind async/await is not fully supported on all browsers (unfortunately, IE11 is technically still a browser that exists) so you may have to keep that in mind.

Think of **async** as a way to deal with Promises more comfortably. Async functions **always return a promise**.

```javascript
async function f() {
  return 1;
}

f().then(alert); // 1
```

So, `async` ensures a function returns a promise, and wraps non-promise values in it. Let's also look at the other keyword, `await`. **You \*an only use `await` in an `async` function.** I'm going to get back into our Ghibli example here:

```javascript
async function getFilmsAsync() {
  let response = await fetch('https://ghibliapi.herokuapp.com/films');
  let data = await response.json();
  return data;
}
```

As you can see, this is a lot more convenient than the original `getFilms()` function. We still don't have error handling, which can be done in a simple try/catch:

```javascript
async function getFilmsAsync() {
  try {
    let response = await fetch('https://ghibliapi.herokuapp.com/films');
    let data = await response.json();
    return data;
  } catch (err) {
    console.warn(err);
  }
}
```

or this `generateFilmCards()`, but we can simply call this new `async` function and do it afterward:

```javascript
getFilmsAsync().then(function(data) {
  generateFilmCards(data);
});
```

The film cards are just something I whipped up in JS/CSS, and this is unfortunately not a workshop on any of that. Feel free to check out the finished product!

## Part 4 - Fetch in React

Read the docs: <https://www.alphavantage.co/documentation/>

> **NOTE**: I highly advise **against** using this API. I used this thinking I would make a cool sample project and ended up hating every step of the way. Just go look at the fetch in `App.js` to see what I mean. Why would you do this to your keys, man...

This is going to be a bit brief since I mostly want to walk through the app during the workshop. Basically, I'm querying a stock price API and returning a 30 trading day history of the application. I took an SVG library to make the graph prettier and added some stats.

There aren't any new concepts going on in this React app, and I did my best to keep things as verbose as possible.

I will take this time to plug [React Hooks](https://wattenberger.com/blog/react-hooks) despite the project being in classes. You can also check out my port of this at [my personal website](https://tedzchu.com/stock-price-react-hooks/) (haha plug!) where I use that. Hopefully I add a search functionality too. I also use async fetch there which is not present in this repo.

## Conclusion

Like I said, it's a bit late and I'm not good at wrapping things up but I'd like to thank everyone who's taken the time to read through this or follow along in person. I hope this repo serves as a good introduction to you querying APIs to your heart's content!
