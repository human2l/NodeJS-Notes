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

