/*

In this stage we will work on container management

Till now we are doing
    ---> docker run --rm ...
          ----> so this means we 
                -> pull the image(if needed)
                -> start container
                -> run script
                -> destroy container

But there are problems in this system as of now 
    --> slow cold start everytime
    --> overhead of launching a full container for each request
    --> not resource efficient for high load




Now there are two ways to handle this issue
     -> container pooling
     -> persistent docker container

And persistent docker container is a better option for now as it is
easy to implement

We will not implement this for now and see it later





*/
