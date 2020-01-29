---
templateKey: 'blog-post'
title: 'Serverless CQRS in Azure'
date: 2018-02-09T15:04:10.000Z
featuredpost: true
featuredimage: /img/serverless.png
description: How we started our journey towards Sitecore JSS and React
tags:
  - Azure
  - Serverless
  - CQRS
  - LogicApps
---
![serverless](/img/serverless.png)
# Serverless CQRS in Azure

Part 1: Introduction, Commands & Event sourcing

_This is a multi-part article. In the coming weeks I’ll be publishing more articles to cover Projection Processing, Querying Materialized Views and a comparison with an Azure Functions approach._

### Introduction

Keen to explore the realms of what is possible with Azure’s Serverless technologies, I decided there was no better way than to attempt to tackle a complex, modern software pattern: Command Query Responsibly Segregation, otherwise known as CQRS (with event sourcing & materialized views thrown in for good measure).

Primary objective: to be as service-full as possible and attempt to orchestrate an application with Logic Apps, without writing any code.

Secondary objective: to evaluate the feasibility of this approach and see how the application performs against a C# equivalent.

_I’ll provide a link to a working solution on github when the final part is complete_

#### CQRS

In a nutshell, CQRS is a pattern that can be used where high throughput is required that would otherwise not be possible for traditional CRUD operations often found in an N-tier architecture using something like the repository pattern. As a system, it looks something like this:

![](https://cdn-images-1.medium.com/max/800/1*sqRCAd1ByHPVD3ny7cCIhQ.png)

Many others have gone in to extensive detail on this subject so I suggest getting up to speed by reading the fantastic documentation on Microsoft’s Azure architecture site and Martin Fowler’s bliki.

[**CQRS**  
_In this article Segregate operations that read data from operations that update data by using separate interfaces. This…_docs.microsoft.com](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs "https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs")[](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)

[**bliki: CQRS**  
_domain driven design · application architecture · API design · event architectures tags: CQRS stands for Command Query…_martinfowler.com](https://martinfowler.com/bliki/CQRS.html "https://martinfowler.com/bliki/CQRS.html")[](https://martinfowler.com/bliki/CQRS.html)

#### Event sourcing & Materialized views

These are two patterns that work very well with CQRS. The idea for event sourcing is that you store only events and use the event store as a mechanism, or log, of everything that has happened within a system. This event store can then be used to create materialized views (at any point in time) to reconstruct the current state of a query-able view from the read store. More information can be found here:

[**Event Sourcing**  
_In this article Instead of storing just the current state of the data in a domain, use an append-only store to record…_docs.microsoft.com](https://docs.microsoft.com/en-us/azure/architecture/patterns/event-sourcing "https://docs.microsoft.com/en-us/azure/architecture/patterns/event-sourcing")[](https://docs.microsoft.com/en-us/azure/architecture/patterns/event-sourcing)

[**Materialized View**  
_In this article Generate prepopulated views over the data in one or more data stores when the data isn't ideally…_docs.microsoft.com](https://docs.microsoft.com/en-us/azure/architecture/patterns/materialized-view "https://docs.microsoft.com/en-us/azure/architecture/patterns/materialized-view")[](https://docs.microsoft.com/en-us/azure/architecture/patterns/materialized-view)

#### The Problem

Imagine a world where someone had the foresight to create some electric cars and a network of places to charge them. Perhaps you might want to call them superchargers, and maybe they would look like this: [https://www.tesla.com/supercharger](https://www.tesla.com/supercharger). The scenario I set myself was that I’m creating a global database to:

· Help people to find superchargers

· Allow the operations teams to see usage

· Prioritise engineer servicing

The problem being solved isn’t really the point of this exercise and so without putting too much thought into it I came up with the following bounded contexts:

![](https://cdn-images-1.medium.com/max/800/1*ALzY-gCH1NW7sqc_Nfn9OQ.png)

#### Architecture

It is in fact possible to build some pretty complex workflows in Logic Apps and hence it should be possible to aim for a no-code target architecture like so:

![](https://cdn-images-1.medium.com/max/800/1*k2zhg44BdG-vEWz3YLwDUA.png)

For the purpose of this exercise I’m going to gloss over the apps, API management and authentication within this system as that is not the topic of this post.

If we extract just what’s required for our CQRS implementation it would look like this:

![](https://cdn-images-1.medium.com/max/800/1*86jbTTGEuruJ76EuC3vbdA.png)

The next steps are to break down the system into its component parts.

### Commands and Event sourcing

In order to stay true to the no-code challenge I set myself there are some decisions that had to be made about the system. First, there would be no ORM and no SQL database. Commands would be received as JSON objects, validated as JSON schema, manipulated as JSON and stored as, you guessed it, JSON documents. A great excuse to use Cosmos DB then.

Lets focus in on the part of the system we are building in this article:

![](https://cdn-images-1.medium.com/max/800/1*A09CKFWY5LuloIbOVEAEmg.png)

Whilst that might look incredibly simple the command handler is actually quite complicated. The first thing we need to do is decide on what commands we need in our system and identify a schema. The supercharger commands I have chosen are:

*   installed
*   inuse
*   notinuse
*   serviced
*   decomissioned

There is one thing that remains common for these commands and that is the need for a supercharger serial number, my made up way of identifying each one uniquely. This led to a base command JSON schema that looks like this:

{

  "type": "object",

  "properties": {

    "command\_name": {

      "type": "string",

      "required": true

    },

    "received": {

      "type": "string",

      "format": "date-time",

      "required": true

    },

    "command": {

      "type": "object",

      "properties": {

        "supercharger\_serial": {

        "type": "string",

        "required": true

       }

.....

The installed command requires some extra fields:

.....

"command": {

  "type": "object",

  "properties": {

    "location\_name": {

      "type": "string",

      "required": true

      },

   "supercharger\_type": {

      "type": "string",

      "required": true

    },

  "supercharger\_serial": {

    "type": "string",

    "required": true

    },

    "lat": {

      "type": "number",

      "required": true

    },

    "long": {

      "type": "number",

      "required": true

    }

.....

_\*full source will be up on Github with the final articles_

#### The Logic App

I will be building one of these:

[**Logic App Service | Microsoft Azure**  
_Logic Apps enable you to develop and deliver powerful integration solutions with ease._azure.microsoft.com](https://azure.microsoft.com/en-gb/services/logic-apps "https://azure.microsoft.com/en-gb/services/logic-apps")[](https://azure.microsoft.com/en-gb/services/logic-apps)

Microsoft has clearly aimed Logic Apps at enterprise integration with a serverless twist. The connectors allow stitching systems together through published APIs and transforming data in between. There’s also an enterprise integration pack for scenarios that require other protocols and file formats ([https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-enterprise-integration-overview](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-enterprise-integration-overview)).

What makes logic apps really powerful though, is the workflows you can build and the Workflow Definition Language (WDL) that sits behind them (more on this later).

First, the following needs to be created:

*   Resource Group
*   Event Grid Topic
*   Cosmos DB
*   Logic App

The resource group and event grid topic need no configuration (yet), just a sensible name.

Cosmos needs a collection created. If you chose the lowest tier with 400RU you will not be able to create partitions — which may be desirable. It should look something like this:

![](https://cdn-images-1.medium.com/max/800/1*CE2iiVJOlzo69HDpS6zm0A.png)

The Logic App needs configuring next. This is where most of the work is. First off, we need to parse the body of the HTTP post, our command, to validate the contents.

![](https://cdn-images-1.medium.com/max/800/1*1i7mTDR-02frd0OVS01mBA.png)

Now that we know the command is valid against the general schema we need to check the command name exists and that it has a valid schema for the specific command. In this instance, we validate against the ‘installed’ JSON schema. We do this within a switch statement.

![](https://cdn-images-1.medium.com/max/800/1*465OCYOoIKyHJMZxjXHg4w.png)

The last of the switch statements is followed by the default case. In this scenario that equates to an invalid message for which we return an HTTP code 444 (the number is of little significance, it could be any error code).

![](https://cdn-images-1.medium.com/max/800/1*oYpX_MjDsQoQKnoEjmlOsg.png)

A document in a Cosmos DB requires each document contains a unique identifier. As the serial number for our superchargers will be used multiple times we cannot use that. A guid would be perfect, which is what we generate here with the _fx_ function.

![](https://cdn-images-1.medium.com/max/800/1*41chcctjVCuAh3UcQlpYsQ.png)

Behind the scenes this is using WDL which you can edit by clicking the Logic App Code View button:

![](https://cdn-images-1.medium.com/max/800/1*KbPpH4P5PfiBzREz79Ow6Q.png)

The _fx_ function in this case actually looks like this:

![](https://cdn-images-1.medium.com/max/800/1*EuXoDdYXT9QMfp4DHMge_A.png)

Of note, is that the syntax is similar to razor cshtml views in that code lives within a single set of curly braces after an @ symbol like so: @{ doSuff(doNestedStuff()) }

You can of course do something like this @guid() if you have a single function to call but in our example there are 3 functions:

*   addProperty — this adds a property to a JSON document (id in this case)
*   body — gets the body property of the named step
*   guid — generates a new guid

There is a complete guide to the language here:

[**Workflow Definition Language schema - Azure Logic Apps**  
_In this article A workflow definition contains the actual logic that executes as a part of your logic app. This…_docs.microsoft.com](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-workflow-definition-language "https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-workflow-definition-language")[](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-workflow-definition-language)

Now that we have saved our JSON document with our new id we need to raise an event and respond with an HTTP 200. This is done by adding the preview Event Grid and HTTP response connectors respectively.

![](https://cdn-images-1.medium.com/max/800/1*ZjJadmDXORKPOGY4gqDUTQ.png)

Time to test it. This is easily done with Postman ( [https://www.getpostman.com](https://www.getpostman.com)). All it takes is copying the URL from the first step in the Logic App, setting the HTTP verb to POST, adding a header for ‘Content-Type’ of ‘application/json’ and manually populating the body with a JSON object:

![](https://cdn-images-1.medium.com/max/800/1*dM_abYcZ3IBiefREZy7-Wg.png)

We should now see the Logic App runs in the overview:

![](https://cdn-images-1.medium.com/max/800/1*ixSnL3mn9IJZXvA7tGemZQ.png)

With the first part working it is time to start thinking about part 2 of this article: Projection processing and querying the Materialized views.

Feedback always welcome. Happy coding.

By [Rich James](https://medium.com/@richg0) on [February 9, 2018](https://medium.com/p/e0f2c423f071).

[Canonical link](https://medium.com/@richg0/serverless-cqrs-in-azure-p1-e0f2c423f071)

Exported from [Medium](https://medium.com) on January 28, 2020.