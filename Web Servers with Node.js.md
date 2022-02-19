<img src="Web Servers with Node.js.assets/Screen Shot 2022-02-18 at 12.49.10 PM.png" alt="Screen Shot 2022-02-18 at 12.49.10 PM" style="zoom:50%;" />

# HTTP Requests

<img src="Web Servers with Node.js.assets/Screen Shot 2022-02-18 at 12.54.39 PM.png" alt="Screen Shot 2022-02-18 at 12.54.39 PM" style="zoom:25%;" align="left"/>

POST /messages: add a new message into messages collection

PUT /messages/15: add or replace the message(ID:15) with current message we uploaded

Note: nomally we won't POST /message/15, because it partial make change to message 15, we replace it entirly by our new submitted message

<img src="Web Servers with Node.js.assets/Screen Shot 2022-02-18 at 1.00.30 PM.png" alt="Screen Shot 2022-02-18 at 1.00.30 PM" style="zoom:15%;" align="left"/>

# HTTP Responses

<img src="Web Servers with Node.js.assets/Screen Shot 2022-02-18 at 1.34.45 PM.png" alt="Screen Shot 2022-02-18 at 1.34.45 PM" style="zoom:15%;" align="left"/>

## Status code

<img src="Web Servers with Node.js.assets/Screen Shot 2022-02-18 at 1.35.12 PM.png" alt="Screen Shot 2022-02-18 at 1.35.12 PM" style="zoom:30%;" align="left"/>

## Successful responses

[`200 OK`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200)

The request succeeded. The result meaning of "success" depends on the HTTP method:

- `GET`: The resource has been fetched and transmitted in the message body.
- `HEAD`: The representation headers are included in the response without any message body.
- `PUT` or `POST`: The resource describing the result of the action is transmitted in the message body.
- `TRACE`: The message body contains the request message as received by the server.

[`201 Created`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201)

The request succeeded, and a new resource was created as a result. This is typically the response sent after `POST` requests, or some `PUT` requests.

## Redirection messages

[`301 Moved Permanently`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301)

The URL of the requested resource has been changed permanently. The new URL is given in the response.

## Client error response

[`400 Bad Request`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400)

The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).

[`401 Unauthorized`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401)

Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.

[`403 Forbidden`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403)

The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike `401 Unauthorized`, the client's identity is known to the server.

[`404 Not Found`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404)

The server can not find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of `403 Forbidden` to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web.

[`405 Method Not Allowed`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405)

The request method is known by the server but is not supported by the target resource. For example, an API may not allow calling `DELETE` to remove a resource.

[`408 Request Timeout`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408)

This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.

[`418 I'm a teapot`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418)

The server refuses the attempt to brew coffee with a teapot.

## Server error response

[`500 Internal Server Error`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500)

The server has encountered a situation it does not know how to handle.

[`501 Not Implemented`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501)

The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are `GET` and `HEAD`. 

Note: 501 often used when the server is currently under development

[`503 Service Unavailable`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503)

The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This response should be used for temporary conditions and the `Retry-After` HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.

# Node web server

```js
const http = require('http');

const PORT = 3000;

const server = http.createServer();

const friends = [
  {
    id: 0,
    name: 'Nikola Tesla',
  },
  {
    id: 1,
    name: 'Sir Isaac Newton',
  },
  {
    id: 2,
    name: 'Albert Einstein',
  }
];

server.on('request', (req, res) => {
  const items = req.url.split('/');
  // /friends/2 => ['', 'friends', '2']
  // /friends/
  if (req.method === 'POST' && items[1] === 'friends') {
    req.on('data', (data) => {
      const friend = data.toString();
      console.log('Request:', friend);
      friends.push(JSON.parse(friend));
    });
    req.pipe(res);// put the json from req body into res body
    //no need to res.end() because res will end() whenever req end() due to pipe()
    
  } else if (req.method === 'GET' && items[1] === 'friends') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    if (items.length === 3) {
      const friendIndex = Number(items[2]);
      res.end(JSON.stringify(friends[friendIndex]));
    } else {
      res.end(JSON.stringify(friends));
    }
  } else if (req.method === 'GET' && items[1] === 'messages') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<body>');
    res.write('<ul>');
    res.write('<li>Hello Isaac!</li>');
    res.write('<li>What are your thoughts on astronomy?</li>');
    res.write('</ul>');
    res.write('</body>');
    res.write('</html>');
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
}); //127.0.0.1 => localhost
```

To test post function through browzer:

<img src="Web Servers with Node.js.assets/Screen Shot 2022-02-18 at 8.51.27 PM.png" alt="Screen Shot 2022-02-18 at 8.51.27 PM" style="zoom:25%;" />

In the terminal of vscode:

<img src="Web Servers with Node.js.assets/Screen Shot 2022-02-18 at 8.52.02 PM.png" alt="Screen Shot 2022-02-18 at 8.52.02 PM" style="zoom:25%;" />

After we pipe the json from req to res through the code:

<img src="Web Servers with Node.js.assets/Screen Shot 2022-02-18 at 9.24.35 PM.png" alt="Screen Shot 2022-02-18 at 9.24.35 PM" style="zoom:25%;" />

# Same Origin Policy

## Origin:

<img src="Web Servers with Node.js.assets/Screen Shot 2022-02-18 at 7.46.19 PM.png" alt="Screen Shot 2022-02-18 at 7.46.19 PM" style="zoom:25%" />

##### Origin = Protocol+Host+Port

##### Question:

Say you're browsing a page on www.wikipedia.org. In general, will the following requests succeed, or fail?

1. A JavaScript `GET` request to www.bank.com.

2. A JavaScript `POST` request to www.bank.com.

3. Clicking an HTML link to a video on www.bank.com.

##### Answer:

1. This request will *FAIL*, because requests to get information from a cross-origin domain are not allowed by the browser. The browser is trying to protect your privacy by preventing www.wikipedia.org from stealing your private information from www.bank.com.

2. This request will *SUCCEED*. This is a little known exception to the Same Origin Policy! The decision to allow `POST` requests is mostly historical, but there is also a lower chance that a `POST` request will steal your private information. `POST` requests are used to write data to a server, rather than `GET` data from it, so it's less likely the response will contain private information.

3. This request will *SUCCEED*. The Same Origin Policy applies only to scripts and not static resources like HTML tags.

## CORS

Cross Origin Resource Sharing

To allow request from other domains, add header below:

Access-Control-Allow-Origin: https://www.google.com

Access-Control-Allow-Origin: *

<img src="Web Servers with Node.js.assets/Screen Shot 2022-02-18 at 8.25.05 PM.png" alt="Screen Shot 2022-02-18 at 8.25.05 PM" style="zoom:50%;" />

# Restful APIs

<img src="Web Servers with Node.js.assets/Screen Shot 2022-02-19 at 9.48.28 PM.png" alt="Screen Shot 2022-02-19 at 9.48.28 PM" style="zoom:50%;" />

Stateless: each request is separate and not connected to any state to the client

# CRUD

Create, Read, Update, Delete

| HTTP Verb | CRUD           | Entire Collection (e.g. /customers)                          | Specific Item (e.g. /customers/{id})                         |
| :-------- | :------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| POST      | Create         | 201 (Created), 'Location' header with link to /customers/{id} containing new ID. | 404 (Not Found), 409 (Conflict) if resource already exists.. |
| GET       | Read           | 200 (OK), list of customers. Use pagination, sorting and filtering to navigate big lists. | 200 (OK), single customer. 404 (Not Found), if ID not found or invalid. |
| PUT       | Update/Replace | 405 (Method Not Allowed), unless you want to update/replace every resource in the entire collection. | 200 (OK) or 204 (No Content). 404 (Not Found), if ID not found or invalid. |
| PATCH     | Update/Modify  | 405 (Method Not Allowed), unless you want to modify the collection itself. | 200 (OK) or 204 (No Content). 404 (Not Found), if ID not found or invalid. |
| DELETE    | Delete         | 405 (Method Not Allowed), unless you want to delete the whole collection—not often desirable. | 200 (OK). 404 (Not Found), if ID not found or invalid.       |

References: https://www.restapitutorial.com/lessons/httpmethods.html

# Templating Engines

Template engines supported by Express.js:

<img src="Web Servers with Node.js.assets/Screen Shot 2022-02-19 at 11.08.48 PM.png" alt="Screen Shot 2022-02-19 at 11.08.48 PM" style="zoom:50%;" />

## handlebars

`npm install hbs --save`

Create a `views`folder under project folder

In server.js:

```js
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/' ,(req,res) => {
  res.render('index', {
    title: 'My Friends Ary VERYY Clever',
    caption: 'Let\'s go skiing!'
  })
})
```

In ./views/index.hbs:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>{{title}}</title>
    <link rel='stylesheet' href='site/css/style.css' />
  </head>
  <body>
    {{{caption}}}
  </body>
</html>
```

