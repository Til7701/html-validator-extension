
function showValidationResult(tabs) {
  let tab = tabs.pop();

  console.log("hi");

  let contentElement = document.getElementById('content');
  let content = document.createTextNode("Loading...");
  contentElement.appendChild(content);

  browser.tabs.sendMessage(tab.id, { 'req': 'source-code' }).then(response => {
    console.log('url = ' + tab.url);
    console.log('source code = ' + response.content);

    fetch("https://validator.w3.org/nu/?out=json", {
      method: "POST",
      body: response.content,
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36",
        "Content-type": "text/html; charset=UTF-8"
      }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        for (let i = 0; i < json.messages.length; i++) {
          const message = json.messages[i];
          contentElement.appendChild(drawMessage(message));
        }

      })

  });

}

function drawMessage(message) {
  let content = document.createTextNode(JSON.stringify(message));
  return content;
}

function getActiveTab() {
  return browser.tabs.query({currentWindow: true, active: true});
}
getActiveTab().then(showValidationResult);
