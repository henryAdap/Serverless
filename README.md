Build a RESTful API with the Serverless Framework
Today, we’re going to implement serverless RESTful API services by using “Serverless Framework”. There are many cloud services provider offers serverless functionality like AWS Lambda, Azure Functions, and Google CloudFunctions but in this article, I’m sticking with AWS Lambda as a cloud service provider.

If you don’t know about the serverless idea then I strongly recommended that first checkout this video and come back once finished it.

Serverless Framework
The serverless framework is an open source CLI tool that allows us to build, configure and deploy serverless functions (In our case, AWS Lambda functions).

Without "Serverless Framework", we have to go manually on console then create and configure necessary resources. That’s okay when the project is small and functions are limited but as soon as the project grows then creating and configuring resources is a challenging task and in lots of case unmaintainable. Writing code on console and managing team workflow becomes a tedious job.

With a "Serverless Framework", we can quickly build, configure and deploy resources within few commands. We can store our code and configuration into a centralized repository so we can design proper workflow and developers can later write, reuse and refer other developers codebase.

There are lots of significant advantages of using a serverless framework instead of doing manually work.

In this article, we're going to build a serverless RESTful API services with a "Serverless Framework". Checkout below table for reference.



#	ENDPOINT	METHOD	DESCRIPTION
1	henry/	GET	Get a list of all from the database
2	henry/{id}	GET	Get a specific 
3	henry/	POST	Add new to the database.
4	henry/{id}	PUT	Update existing .
5	henry/{id}	DELETE	Delete existing .
Prerequisites
Install the following tools and frameworks:

Node.js 8.10 or above
MySQL
Visual Studio Code (preffered) or any code editor
Postman
Next, create the project folder and initialize it using npm.

mkdir henry-app
cd henry-app
npm init -f
Dependencies
Install the following packages to work with "Serverless Framework"

express - Fast, unopinionated, minimalist web framework for Node.js.
body-parser - Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
mysql - A pure node.js JavaScript Client implementing the MySql protocol.
serverless - Framework for operationalize serverless development.
serverless-http - Plugin allows you to wrap express API for serverless use.
serverless-offline - Plugin to emulate AWS Lambda and API Gateway for speed up local development.
First up, we’ll install the serverless CLI:

npm install -g serverless
Now, let's install plugins and libraries step by step.

npm install express body-parser mysql serverless-http --save # app dependancies
npm install serverless-offline --save-dev # development dependancies
App structure
Before we start writing the handler code, we’re going to structure the project folder and configure our tools.

Create the following structure at the root level:

/henry-app/
|--/configs
|----/dbConfig.js
|--/node_modules
|--.gitignore
|--index.js
|--package.json
|--serverless.yml
Make sure to list private files into .gitignore file so that we don’t accidentally commit it to public repository. Copy paste raw material from https://www.gitignore.io/api/node to .gitignore file.

serverless.yml file serves as a manifest for our RESTful api service. Where we define our functions, events, and necessary resources. Later, with serverless CLI we configure and deploy our service to AWS infrastructure.

# serverless.yml
service: henry-service

provider:
  name: aws
  runtime: nodejs8.10
  stage: dev
  region: us-east-1
  memorySize: 512

functions:
  henryFunc:
    handler: index.handler
    events:
      - http:
          path: henry
          method: get
      - http:
          path: henry/{id}
          method: get
      - http:
          path: henry
          method: post
      - http:
          path: henry/{id}
          method: put
      - http:
          path: henry/{id}
          method: delete

plugins:
  - serverless-offline
We are doing a few things here:

service: henry-service is a name of the service. You can give any type name for your service.
provider: This is where we specify the name of the provider we’re using (AWS as cloud service provider) and configurations specific to it. In our case, we’ve configured the runtime (Node.js) with 8.10 version and region to us-east-1.
functions: We specify the functions provided by our service, Here I'm specifying henryFunc as function name with http events. We can also say that this is our AWS Lambda function.
We have to store our henry somewhere, for sake of simplicity I'm chosen MySQL but you can also use another type database. I have already created a database with name henry_db and inside a database created table henry_db with id, name, height, weight, avatar, and createAt columns.

CREATE TABLE `henry` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `height` float NOT NULL,
  `weight` float NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `henry` ADD PRIMARY KEY (`id`);

ALTER TABLE `henry` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
Rather than creating and managing connections every time, we configure pool connections once inside dbConfig.js file and reused it multiple times.

// dbConfig.js
const mysql = require("mysql");
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "henry_db"
});

module.exports = pool;
