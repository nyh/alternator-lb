// snippet-sourcedescription:[ ]
// snippet-service:[dynamodb]
// snippet-keyword:[JavaScript]
// snippet-sourcesyntax:[javascript]
// snippet-keyword:[Amazon DynamoDB]
// snippet-keyword:[Code Sample]
// snippet-keyword:[ ]
// snippet-sourcetype:[full-example]
// snippet-sourcedate:[ ]
// snippet-sourceauthor:[AWS]
// snippet-start:[dynamodb.JavaScript.CodeExample.MoviesItemOps02] 

/**
 * Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * This file is licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License. A copy of
 * the License is located at
 *
 * http://aws.amazon.com/apache2.0/
 *
 * This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
*/
var AWS = require("aws-sdk");
var http = require("http");
var dns = require("dns");

const ALTERNATOR_FAKE_HOST = "dog.scylladb.com";

// I know, global variables are bad.
var hostIdx = 0;
var hosts = ["127.0.0.1", "127.0.0.2", "127.0.0.3", "127.0.0.4", "127.0.0.5"];

var agent = new http.Agent;

var oldCreateConnection = agent.createConnection;
agent.createConnection = function(options, callback = null) {
    options.lookup = function(hostname, options = null, callback) {
        if (hostname == ALTERNATOR_FAKE_HOST) {
            var host = hosts[hostIdx];
            hostIdx = (hostIdx + 1) % hosts.length;
            console.log("Picked", host);
            return dns.lookup(host, options, callback);
        }
        return dns.lookup(hostname, options, callback);
    };
    return oldCreateConnection(options, callback);
};

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://" + ALTERNATOR_FAKE_HOST + ":8000",
  httpOptions:{
    agent: agent
  }
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "Movies";

var year = 2015;
var title = "The Big New Movie";

var params = {
    TableName: table,
    Key:{
        "year": year,
        "title": title
    }
};

docClient.get(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
    }
});
docClient.get(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
    }
});
// snippet-end:[dynamodb.JavaScript.CodeExample.MoviesItemOps02]
