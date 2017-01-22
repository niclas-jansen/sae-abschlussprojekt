#### Libraries Used
##### mathjs
http://mathjs.org/
```javascript
math.eval('sin(45 deg) ^ 2');
```
#### change text node
to change the value of a text node inside a `<lable>` element without changing it's child elements do this:
```javascript
document.querySelector('[uid="1"]').firstChild.nodeValue = "lol";
// or this
document.querySelector('[uid="1"]').childNodes[0].nodeValue = "test";
```

#### get position in node list
```javascript
Array.prototype.indexOf.call(nodelist, el)
```


#### DO
DO MORE TYPE CHECKS 
especially for Number