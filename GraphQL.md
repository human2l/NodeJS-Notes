<img src="GraphQL.assets/Screen Shot 2022-03-10 at 8.01.13 PM.png" alt="Screen Shot 2022-03-10 at 8.01.13 PM" style="zoom:50%;" />

need ONLY one request to get the all desired data from server.

<img src="GraphQL.assets/Screen Shot 2022-03-10 at 8.23.27 PM.png" alt="Screen Shot 2022-03-10 at 8.23.27 PM" style="zoom:50%;" />

# GraphQL vs REST

<img src="GraphQL.assets/Screen Shot 2022-03-10 at 8.29.07 PM.png" alt="Screen Shot 2022-03-10 at 8.29.07 PM" style="zoom:50%;" />

## Scenario:

As our user, we're browsing our store. And we're deciding if we want to purchase a pair of shoes to load those shoes. Product details for the user. First thing, we're going to need to get all the information on that individual product when we load the page for our shoes. We might make a request to the product's collection looking up our shoes by their ID. Our customer is satisfied with what they see, but they like some second opinions, so they scroll down the page and they load the product reviews to see what others have said about their pair of shoes. And we're on a limited budget, so maybe we want a notification or some sort of summary at the top of our screen telling us how many products we've already added to the cart and how much money we can expect to spend on those products so far. That would require a request to get the cart for our user. That's three requests. Three trips to the server.

## REST Problem: 

### Under-fetching

We lose time making extra unnecessary round trips between the server and the client, and we have to do more work querying multiple collections, which slows down our page load time.

### Over-fetching

Each of these requests might contain data that we don't need for our product page. i.e. /carts will give all details of products (we might only need the name and cost). We're sending unnecessary data from the server to the browser, and front end needs to filter the response from the server to get the only data that matters.

## GraphQL Solution:

<img src="GraphQL.assets/Screen Shot 2022-03-10 at 8.39.03 PM.png" alt="Screen Shot 2022-03-10 at 8.39.03 PM" style="zoom:50%;" />

1. We ask for all the data we need in our query.
2. Pass it to the the single graphQL end point.
3. graphQL code wraps up all the data we need in the back end using functions calls `resolver`s
4. When all graphQL resolvers have gathered all the data we need, server sends back everything to front end.

Front end developers don't really care how end points are structured anymore.

Downside: The flexibility of the query language adds some complexity, might not be worth for simple applications.

<img src="GraphQL.assets/Screen Shot 2022-03-10 at 8.48.46 PM.png" alt="Screen Shot 2022-03-10 at 8.48.46 PM" style="zoom:30%;" />

<img src="GraphQL.assets/Screen Shot 2022-03-10 at 8.52.56 PM.png" alt="Screen Shot 2022-03-10 at 8.52.56 PM" style="zoom:30%;" />