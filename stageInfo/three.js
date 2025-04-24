/*

In this stage, we will work on filesystem isolalation using temporary
directories

    -> multiple execution can overwrite the same file which is not
       thread safe, not isolated and also not clean


What we will do now ->
     -> Use fs.mkdtempSync() to create a unique temp folder per request.
     -> Write the code file inside that temp directory.
     -> Mount only that isolated directory into the container.
     -> Clean up the temp folder afterward.






*/
