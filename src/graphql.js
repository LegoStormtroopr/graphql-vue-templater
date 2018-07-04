function graphql_request(baseurl, query, callback, error_callback) {
  
  // Set request params
  const request_options = {
    'method': 'GET',
    'headers': {
      'Accept': 'application/json',
    },
    'mode': 'cors',
  }

  // Set url
  var api_url = 'https://' + baseurl + '/api/graphql/api?raw=true'
  var url = api_url + '&query=' + query

  fetch(url, request_options)
    .then(
      function(response) {
        if (response.status != 200) {
          error_callback(response.status)
        } else {
          console.log(response)
          response.json()
            .then(callback)
            .catch(error_callback)
        }
      }
    )
    .catch(error_callback)

}

export function gql_request(baseurl, gql_query, callback, error_callback) {

  graphql_request(baseurl, gql_query, callback, error_callback)

}

