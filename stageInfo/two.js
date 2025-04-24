// In this we will improve the docker command so that it will become more
// secure and with hardend docker flags

/*


--cap-drop=ALL: Removes access to privileged Linux features.

--security-opt=no-new-privileges: Prevents elevation of privileges from 
                                  within the container.

-u 1000:1000: Runs container as a non-root user (make sure this UID can run
              Python).

:ro on volume: Prevents writing from inside container.

--read-only: Makes the container's filesystem read-only except for mounted 
             volumes.



previously host path is directly mounted (-v ${__dirname}) but now there are temp directories 
with cleanup



*/
