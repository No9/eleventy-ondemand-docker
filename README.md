# eleventy-serverless-docker

A project to demonstrate using 11ty serverless in docker to generate on demand content where the data is stored in s3.

This is intended to be used in scenarios where a container environment is available to the developer but not public cloud access. 

This project also aims to show how this approach can maintain the inner dev loop as well as a deployment folow.

Based on this project https://github.com/SomeAnticsDev/eleventy-serverless-color-contrast

## Step 1. General Setup

1. Clone this repository
    ```
    git clone eleventy-serverless-docker
    ```
1. Create an s3 bucket on your favourite cloud provider.

1. Copy the contents of the folder `sampledata` to the s3 bucket

1. Create some credentials for the bucket.

1. Then and create a `.env` file in the base folder of this project with the following entries.

    Replacing the XXXX with the vaules from the credentials you created.

    ```
    S3ACCESSKEY=XXXX
    S3SECRET=XXXX
    S3BUCKETNAME=XXXX
    S3ENDPOINT=XXXX
    ```


## Step 2. local dev loop setup 


1. Install dependencies
    ```
    npm install
    ```

1. Run the local dev service

    ```
    npm run dev
    ```
1. Open a browser to see the output

    http://localhost:8080/1/

    http://localhost:8080/2/

## Step 3. Create container

1. Build the container

    ```
    docker build -t eleventy-serverless-docker .
    ```

1. Run the container
    ```
    docker run -p 8080:8080 --env-file .env eleventy-serverless-docker
    ```

1. Test the endpoint

    ```
    curl -s -d '{ "path" : "/1/" }' http://localhost:8080/2015-03-31/functions/function/invocations

    {"statusCode":200,
    "headers":{"Content-Type":"text/html; charset=UTF-8"},
    "body":"\n\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n\t<meta charset=\"UTF-8\">\n\t
    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n\t
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\t
    <title>Document</title>\n</head>\n<body>\n\t\t
    <h1>1 - Luke Skywalker</h1>\n\t\tbirth_year : 19BBY <br />\n\t\t
    gender : male <br/>\n\t\t
    hair_color : blond\n\t<br/>\n\t
    <h3>Base Data :</h3>\n\t
    {\"birth_year\":\"19BBY\",\"created\":\"2014-12-09T13:50:51.644000Z\",
    \"edited\":\"2014-12-20T21:17:56.891000Z\",\"eye_color\":\"blue\",
    \"films\":[\"http://swapi.co/api/films/6/\",\"http://swapi.co/api/films/3/\",
    \"http://swapi.co/api/films/2/\",\"http://swapi.co/api/films/1/\",
    \"http://swapi.co/api/films/7/\"],
    \"gender\":\"male\",\"hair_color\":\"blond\",\"height\":\"172\",
    \"homeworld\":\"http://swapi.co/api/planets/1/\",\"id\":1,\"mass\":\"77\",
    \"name\":\"Luke Skywalker\",\"skin_color\":\"fair\"}\n\t
    <main>\n\t\t<p>eleventy.serverless : {\"path\":{\"coreid\":\"1\"}}</p>\n\t
    </main>\n</body>\n</html>\n"}
    ```

## notes

1. The docker file performs a double copy of the code to the root - `/var/task` and to `/var/task/knative/functions/ondemand`.
    This is to factilitate the default aws lambda container and the 11ty default config.

    There is probably an opportunity to streamline this in someway.

1. When ran in lambda container the response is a JSON object.
    The body in the return value needs to be transformed into a HTML response by a downstream system.
    When hosted on netlify the CDN performs this function probably through the API gateway so we need to find an equivalent approach using either nginx or cloudflare.
    In lambda this is usually done but using the `context.succeed(html);` but the `context` object is not available in the local 11ty serverless environment and so the inner dev loop would break with that approach.

## credits
Sample data from Nolan Lawson

https://github.com/nolanlawson/starwars-data/blob/master/people.json

Sample project from Ben Myers

https://github.com/SomeAnticsDev/eleventy-serverless-color-contrast
