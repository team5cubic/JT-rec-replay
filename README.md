# Basic Node Record/Replay
### To Record
run `node express-proxy.js` and `node simple-server.js` on two seperate terminals.  
issue a GET request to `localhost:3000`.  
records are stored in `./records`
### To Replay
run `node replay.js`.  
side-by-side responses comparisons are stored in `./comparisons`
