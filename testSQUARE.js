


var SquareConnect = require('square-connect');
var defaultClient = SquareConnect.ApiClient.instance;

// Configure OAuth2 access token for authorization: oauth2
var oauth2 = defaultClient.authentications['oauth2'];
// oauth2.accessToken = "sq0atp-lVl-AkY7Rp1bfo4EKDG32w";

oauth2.accessToken = "sandbox-sq0atb-uG05sLO0iQRfdT7_YKDWQA";

// Beta LOCATION_ID
const LOCATION_ID = 'CBASEAbSyLLvf_tIIcJQvODHt28gAQ';



var api = new SquareConnect.LocationsApi();

var transactionsAPI = new SquareConnect.TransactionsApi();

// api.listLocations().then(function(data) {
//   console.log('API called successfully. Returned data: ');
//   console.log(data);
// }, function(error) {
//   console.error(error);
//   console.log('ERROR');
// });

transactionsAPI.listTransactions(LOCATION_ID).then((response) => {
    // Handle response
    console.log('TRANSACTIONS FOR BETA');

    // console.log(Object.keys(response.transactions));

    response.transactions.forEach((item, index)=>{
        console.log(response.transactions[index].tenders);
    });

  });
