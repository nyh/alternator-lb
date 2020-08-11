# Alternator Load Balancing

This repository contains a collection of source code and scripts that can
be used to implement **load balancing** for a Scylla Alternator cluster.

## Introduction

[Scylla](https://github.com/scylladb/scylla) is an open-source distributed
database.  [Alternator](https://docs.scylladb.com/using-scylla/alternator/)
is a Scylla feature which adds Amazon DynamoDB&trade; compatibility to
Scylla. With Alternator, Scylla is fully (or [almost fully](https://github.com/scylladb/scylla/blob/master/docs/alternator/alternator.md#current-compatibility-with-dynamodb))
compatible with DynamoDB's HTTP and JSON based API. Unmodified applications
written with any of Amazon's [SDK libraries](https://aws.amazon.com/tools/)
can connect to a Scylla Alternator cluster instead of to Amazon's DynamoDB.

However, there is still one fundemental difference between how DynamoDB
and a Scylla cluster appear to an application. The entire DynamoDB service
is presented to the application as a **single endpoint**, for example
`http://dynamodb.us-east-1.amazonaws.com`. But Scylla is not a single
endpoint - it is a _distributed_ database - a cluster of **many nodes**.
If we configure the application to use just one of these nodes as the
single endpoint, this specific node will become a performance bottleneck
as it gets more work than the other nodes. Moreover, this node will become
a single point of failure - if it fails, the entire service is unavailable.

So what we need now is a way for DynamoDB applications, which were written
with just a single endpoint in mind, to send requests to all of Alternator's
nodes - not just to one. The mechanism we are looking for should equally
load all of Alternator's nodes (_load balancing_) and ensures the service
continues normally even if some of these nodes go down (_high availability_).

## Possible solutions

The most straightforward solution is to deploy a _load balancer_, a machine
or a virtual service, which will sit in front of the Alternator cluster
and forward the HTTP requests that it gets to the different Alternator nodes.


https://docs.google.com/document/d/1twgrs6IM1B10BswMBUNqm7bwu5HCm47LOYE-Hdhuu_8/edit#
