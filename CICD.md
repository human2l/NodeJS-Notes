Continuous Integration and Delivery

# Continuous Integration

merging the code continuously to the main branch, and make sure each person's code pass the build->test->result workflow in CI server, then give the feedback to the developer(i.e. red/green light in the graph).

This makes sure all code in the source repository is working on all of other developer's machine.

Popular CI tools: CircleCI, Travis CI, Github Actions, Jenkins

<img src="CICD.assets/Screen Shot 2022-03-05 at 5.52.30 PM.png" alt="Screen Shot 2022-03-05 at 5.52.30 PM" style="zoom:50%;" />

# Continuous Delivery

One step futrher base on CI, makes sure the code submitted is ready to be delivered (deployed in production).

It often add additional tests like acceptance tests or user acceptance tests to make sure the app does what it claims it does.

CD is a both front end and back end practice. Only the front/back end works in isolation is not enough, because the product is made up for both.

# Continuous Deployment

Automatically deploy the code that pass Continuous Delivery. Not suitable for all kind of projects.

<img src="CICD.assets/Screen Shot 2022-03-05 at 6.11.44 PM.png" alt="Screen Shot 2022-03-05 at 6.11.44 PM" style="zoom:50%;" />

Not suitable cases:

* Some application that needs careful tests before deployment, cost of error is so high. i.e. mission control system, health care software
* products with manual processes that are very difficult to automate

# Pipelines

<img src="CICD.assets/Screen Shot 2022-03-05 at 6.17.05 PM.png" alt="Screen Shot 2022-03-05 at 6.17.05 PM" style="zoom:50%;" />

# Github Actions

## Build Pipelines

Create `/.github/workflows/node.yml` in project folder

#### node.yml

```yml
name: MASA Project CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js version 16
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run build --prefix client
```

<img src="CICD.assets/Screen Shot 2022-03-06 at 4.11.19 PM.png" alt="Screen Shot 2022-03-06 at 4.11.19 PM" style="zoom:50%;" />

## Test Pipeline

```yml
name: MASA Project CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  build:
    env:
      # set CI to true will let create-react-app notified to turn off watch mode of testing
      CI: true
      #PORT: 9000
    strategy:
      matrix:
        # run on both 14 and 16 version of node in parallel
        node-version: [14.x, 16.x]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js version ${{ matrix.node-version }}
        uses: actions/setup-node@v2
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm install
      - run: npm run build --prefix client
      - run: npm test
```

## Add mock database for testing

Github Actions Marketplace

https://github.com/marketplace/actions/

<img src="CICD.assets/Screen Shot 2022-03-06 at 9.54.22 PM.png" alt="Screen Shot 2022-03-06 at 9.54.22 PM" style="zoom:50%;" />

```yml
name: MASA Project CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  build:
    env:
      # set CI to true will let create-react-app notified to turn off watch mode of testing
      CI: true
      #PORT: 9000
      #act the same as MONGO_URL in local .env file
      MONGO_URL: mongodb://localhost/masa
    strategy:
      matrix:
        # run on both 14 and 16 version of node in parallel
        node-version: [14.x, 16.x]
        mongodb-version: ['5.0']
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js version ${{ matrix.node-version }}
        uses: actions/setup-node@v2
        with:
          node-version: ${{ matrix.node-version }}
      - name: MongoDB in GitHub Actions
        uses: supercharge/mongodb-github-action@1.7.0
        with:
          mongodb-version: ${{ matrix.mongodb-version }}
      - run: npm install
      - run: npm run build --prefix client
      - run: npm test
```

