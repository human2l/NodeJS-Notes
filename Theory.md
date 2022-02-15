### Nodejs is a JavaScript runtime

<img src="Theory.assets/Screen Shot 2022-02-14 at 12.35.56 PM.png" alt="Screen Shot 2022-02-14 at 12.35.56 PM" style="zoom:50%;" />

<img src="Theory.assets/Screen Shot 2022-02-14 at 7.17.59 PM.png" alt="Screen Shot 2022-02-14 at 7.17.59 PM" style="zoom:50%;" />

<img src="Theory.assets/Screen Shot 2022-02-14 at 12.40.09 PM.png" alt="Screen Shot 2022-02-14 at 12.40.09 PM" style="zoom:50%;" />

<img src="Theory.assets/Screen Shot 2022-01-05 at 9.58.43 AM.png" alt="Screen Shot 2022-01-05 at 9.58.43 AM" style="zoom:50%;" />

### Libuv has 4 threads available

Libuv uses OS(kernal) directly when possible (most async operations), others run using thread in thread pool

<img src="Theory.assets/Screen Shot 2022-02-15 at 9.35.46 PM.png" alt="Screen Shot 2022-02-15 at 9.35.46 PM" style="zoom:50%;" />

<img src="Theory.assets/Screen Shot 2022-02-15 at 9.36.31 PM.png" alt="Screen Shot 2022-02-15 at 9.36.31 PM" style="zoom:50%;" />

# Event Loop

written in C++, working like below:

```js
while(!shouldExit) {
	processEvents();
}
```

<img src="Theory.assets/Screen Shot 2022-01-05 at 10.04.01 AM.png" alt="Screen Shot 2022-01-05 at 10.04.01 AM" style="zoom:50%;" />

# Callback Queue

Each async function has a callback function to be added to the Callback Queue when finish executed. These "callback" functions will be executed one by one.

<img src="Theory.assets/Screen Shot 2022-02-15 at 9.47.24 PM.png" alt="Screen Shot 2022-02-15 at 9.47.24 PM" style="zoom:50%;" />

There are several Callback Queues in each phases of Event Loop:

<img src="Theory.assets/Screen Shot 2022-02-15 at 9.50.36 PM.png" alt="Screen Shot 2022-02-15 at 9.50.36 PM" style="zoom:25%;" />

There are three timers in NodeJS: `setTimer()`, `setInterval()` and `setImmediate()`

One cycle of the event loop:

<img src="Theory.assets/Screen Shot 2022-02-15 at 9.59.24 PM.png" alt="Screen Shot 2022-02-15 at 9.59.24 PM" style="zoom:25%;" />

Callback function of `SetImmediate()` will run immediate after event loop finish check I/O callbacks BEFORE next cycle of event loop.

There are other phases of event loop like idol and prepare phase, but JS cannot do anything with them, so they are not important.

# Node vs php and python

Server like Apache is model of blocking, it will create thread for each request.

<img src="Theory.assets/Screen Shot 2022-02-15 at 10.12.10 PM.png" alt="Screen Shot 2022-02-15 at 10.12.10 PM" style="zoom:25%;" />

Node is model of non-blocking I/O:

![Screen Shot 2022-02-15 at 10.15.46 PM](Theory.assets/Screen Shot 2022-02-15 at 10.15.46 PM.png)

# Pros and Cons

## Pros

* Node sends work to OS through JS engine, OS communicates CPU in a lowest level (machine code), CPU will delegate tasks to devices like graphic card or hard discs.

* Good when use on servers, talking to databases or coordinating with other servers.

* Good at serving data for I/O heavy applications. i.e. video streaming (Netflix)

<img src="Theory.assets/Screen Shot 2022-02-15 at 10.19.03 PM.png" alt="Screen Shot 2022-02-15 at 10.19.03 PM" style="zoom:50%;" />

## Cons

* Not good at video processing or machine learning, these are blocking processor heavy computations.

* If code blocks in JS or using CPU heavily, event loop will get stuck. Node won't be able to manage other tasks efficiently.

# Observer Pattern & Node Event Emitter

<img src="Theory.assets/Screen Shot 2022-02-15 at 10.35.05 PM.png" alt="Screen Shot 2022-02-15 at 10.35.05 PM" style="zoom:50%;" />

```js
const EventEmitter = require('events')
const celebrity = new EventEmitter();

// Subscribe to celebrity for Observer 1
celebrity.on('race', (result) => {
  result === 'win' && console.log('Congratulations! You are the best!');
});

// Subscribe to celebrity for Observer 2
celebrity.on('race', (result) => {
  result === 'win' && console.log('Boo I could have better than that!');
});

celebrity.emit('race', 'win');
celebrity.emit('race', 'lost');
```

process is an instance of EventEmitter

```js
//param: code, 0 for successful execution with no errors
process.on('exit', (code) => {
	console.log('Process exit event with code: ', code)
});
```

<img src="Theory.assets/Screen Shot 2022-01-05 at 8.37.06 PM.png" alt="Screen Shot 2022-01-05 at 8.37.06 PM" style="zoom:50%;" />

# npm

<img src="Theory.assets/Screen Shot 2022-01-05 at 9.12.46 PM.png" alt="Screen Shot 2022-01-05 at 9.12.46 PM" style="zoom:50%;" />

<img src="Theory.assets/Screen Shot 2022-01-07 at 6.33.53 PM.png" alt="Screen Shot 2022-01-07 at 6.33.53 PM" style="zoom:50%;" />

# nvm

Node Version Manager, is a bash script used to manage multiple released Node.js versions.

`nvm use 8` to use node version 8

# REPL

When type `node` without arguments, it will enter repl mode.

Read => Eval(Evaluation) => Print => Loop

# Node vs JavaScript

<img src="Theory.assets/Screen Shot 2022-02-14 at 1.48.42 PM.png" alt="Screen Shot 2022-02-14 at 1.48.42 PM" style="zoom:50%;" />
