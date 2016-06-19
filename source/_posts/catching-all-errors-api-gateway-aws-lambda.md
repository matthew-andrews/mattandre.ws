---
title: Catching All Errors in AWS Lambda and API Gateway
date: 2016-06-12
categories:
- Technologies
- AWS
tags:
- API Gateway
- Lambda
---

When building applications with AWS Lambda and API Gateway I've found error handling quite difficult to work with.

You first define what status codes your API method is able to serve (200, 404 and 500, for example).  You are encouraged to choose 200 as the default.  Then you can write regular expressions that match against ‘Lambda Errors’.

According to [Amazon's documentation](http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-method-settings-execution-console.html):-

{% blockquote %}
For **Lambda error regex** […] type a regular expression to specify which Lambda function error strings (for a Lambda function) […] map to this output mapping.

**Note**
The error patterns are matched against the `errorMessage` property in the Lambda response, which is populated by `context.fail(errorMessage)` in Node.js or by `throw new MyException(errorMessage)` in Java.
Be aware of the fact that the `.\` pattern will not match any newline (`\n`).
{% endblockquote %}

This seems simple enough.

Lambda functions that have run successfully _shouldn't_ have `errorMessage`s so I should be able to:-

1. Set a Lambda Error Regex that looks for `.*404 Not Found.*` and maps that to 404 errors — this works fine
2. and then I should be able to map all other errors to 500 with `(\n|.)*` (note the `\n` is there because I heeded the warning in the documentation above in case one of my errors has a new line).

Whilst the Lambda Error Regex does indeed now map all errors to 500 responses, unfortunately it **also maps _all the successful_ Lambda response to 500s as well**.

## Lambda ~~Error~~ Regex

WARNING: THE LAMBDA ERROR REGEX WILL TRY TO MATCH AGAINST SUCCESSFUL RESPONSES FROM LAMBDA FUNCTIONS AS WELL AS FAILED ONES.

## So, how do we fix it?

Easy.  Whilst the Lambda Error Regex is used to compare against successful Lambda responses, in this case `errorMessage` is set to _something like_ an empty string.  

Just set the Lambda Error Regex that you want to match to your ‘catch all’ error response to `(\n|.)+`.

Like this:-

{% img /images/lambda-error-regex.png %}

## Thoughts

I'm really surprised that this is so difficult and that none of the documentation encourages (or helps) developers to write Lambda Error Regexs that match against all possible errors.

If I had to write regular expressions against all the errors I anticipated having to handle I would never feel 100% confident that I got them all and would have needlessly risked returning 200 responses containing errors to users.
