var extractJSON = require('./extract-json');

function allTextNodes(nodes) {
  return !Object.keys(nodes).some(function (key) {
    return nodes[key].nodeName !== '#text'
  })
}

function getPreWithSource() {
  var childNodes = document.body.childNodes;

  if (childNodes.length === 1 && childNodes[0].nodeName === "PRE") {
    return childNodes[0];
  }
  return null
}

function isJSON(jsonStr) {
  var str = jsonStr;
  if (!str || str.length === 0) {
    return false
  }

  str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
  str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
  str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '')
  return (/^[\],:{}\s]*$/).test(str)
}

function isJSONP(jsonStr) {
  return isJSON(extractJSON(jsonStr));
}

function checkIfJson(sucessCallback, element) {
  var pre = element || getPreWithSource();

  if (pre !== null &&
    pre !== undefined &&
    (isJSON(pre.textContent) || isJSONP(pre.textContent))) {

    sucessCallback(pre);
  }
}

export default checkIfJson;
