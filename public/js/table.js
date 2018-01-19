


function createtable(){
var request = new XMLHttpRequest();

request.open('POST', 'https://app.pipefy.com/queries');

request.setRequestHeader('Content-Type', 'application/json');
request.setRequestHeader('Authorization', 'd6SRbHmCrzzRxWMAqk-o');

request.onreadystatechange = function () {
  if (this.readyState === 4) {
    console.log('Status:', this.status);
    console.log('Headers:', this.getAllResponseHeaders());
    console.log('Body:', this.responseText);
  }
};

var body = {
  'query': 'mutation { createTable(input: { organization_id: 1 name: \'Table example\'description: \'Table that comtain some data\'public: true authorization: write }) { table { id name description public authorization } } }'
};

request.send(JSON.stringify(body));

}
