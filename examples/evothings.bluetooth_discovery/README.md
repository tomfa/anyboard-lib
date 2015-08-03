# Example: evothings.bluetooth_discovery

## Use
- Drag the index.html file into [Evothings](http://evothings.com) workbench.
- Open Evothings app on your phone
- Run the example app

## Example of:
### Adding a listener that is executen upon BaseToken events 

 ```
  token.on('connect', function() {
    document.getElementById(token.name).className = 'green';
  })
 ```

### Full TokenManager driver example 
which  sets itself as default TokenManager driver, see *[drivers/bean.evothings.bluetooth.js](./drivers/bean.evothings.bluetooth.js)*

### Discovering nearby tokens
 
```
  AnyBoard.TokenManager.scan(
    // success function to be executed upon _each_ token that is discovered
    function(token) {
        self.addDiscovered(token);
    },
    // function to be executed upon failure
    function(errorCode) {
        console.log(errorCode)
    }
  );
```

### Connecting to nearby tokens
 
``` 
  token.connect();
```

### Sending data to token 
(firmware included in [firmware folder](./firmware))
```
  var data = {"device":"LED","event":"on","color":"green"};
  token.send(
      JSON.stringify(data)
  );
```

