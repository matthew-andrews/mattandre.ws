---
title: How to securely configure Cloudflare for static website hosting on AWS S3
date: 2019-10-25
categories:
- Technologies
- AWS
tags:
- Cloudflare
- S3
- Website Performance
- Static Website
---

Goal: to create a static website hosted on **S3** and **Cloudflare** securely — by which I mean **restrict access to the contents of the bucket to Cloudflare _only_**.

## Step 1 - Create your bucket

First we'll create your S3 bucket. Login to the AWS console and head over the S3 service and click the big blue **+ Create Bucket** button to start the wizard that will guide you through creating your bucket.

The first question it'll ask you is for a name. The name that you will need to enter will need to **match the eventual hostname website** you plan to host. I'm going to create `testing.mattandre.ws` so I've named the bucket that:-

{% img /images/create-bucket.png %}

Leave the rest as default and hit **Next**.

## Step 2 - Configure Options

On the **Configure options** you can leave all the other options as default.

## Step 3 - Set permissions

Again leave this as default (**Block _all_ public access**), which at first might not seem intuitive as we're making a public website. But don't worry, in a later step we will grant permission **just** to Cloudflare to access the content.

{% img /images/bucket-permissions.png %}

## Step 4 - Review & Create bucket

Assuming you've followed everything correctly so far — go ahead and hit **Create Bucket**.

## Step 5 - Enable static website hosting

Staying in the AWS console for the S3 service, click into your newly created empty bucket, and click **Properties**.

Then, click the **Static website hosting** box — and choose **Use this bucket to host a website**.

You'll need to enter the **Index document**, which I'll set to be their suggestion, `index.html`.

**Make sure to take note of the `Endpoint` — you'll need that later!** In my case this is `http://testing.mattandre.ws.s3-website-eu-west-1.amazonaws.com/`.

{% img /images/bucket-properties.png %}

## Step 6 - Grant access to your bucket from Cloudflare

Next, click the **Permissions** tab of your S3 bucket (between Properties and Management) and click **Bucket Policy**.

Take a copy of the following JSON, take care to **replace** `testing.mattandre.ws` (my bucketname) with **your bucket name**, then paste it into the Bucket policy editor. Then click **Save**.

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::testing.mattandre.ws/*",
            "Condition": {
                "IpAddress": {
                    "aws:SourceIp": [
                        "2400:cb00::/32",
                        "2405:8100::/32",
                        "2405:b500::/32",
                        "2606:4700::/32",
                        "2803:f800::/32",
                        "2c0f:f248::/32",
                        "2a06:98c0::/29",
                        "103.21.244.0/22",
                        "103.22.200.0/22",
                        "103.31.4.0/22",
                        "104.16.0.0/12",
                        "108.162.192.0/18",
                        "131.0.72.0/22",
                        "141.101.64.0/18",
                        "162.158.0.0/15",
                        "172.64.0.0/13",
                        "173.245.48.0/20",
                        "188.114.96.0/20",
                        "190.93.240.0/20",
                        "197.234.240.0/22",
                        "198.41.128.0/17"
                    ]
                }
            }
        }
    ]
}
```
(This grants [Cloudflare's IP ranges](https://www.cloudflare.com/ips/) **read-only** access to your S3 bucket contents)

## Extra step - Upload a `index.html` file to your bucket

Strictly speaking not necessary but useful to check everything is working.

I uploaded an `index.html` file with the contents `<h1>Hello world</h1>` to my S3 bucket.

## Step 7 - Add the DNS hostname to your Cloudflare DNS console

- Login to your [Cloudflare dashboard](https://dash.cloudflare.com)
- Click on the domain that you'll be setting up a static website on (in my case `mattandre.ws`)
- Then click **DNS**
- Click **Add record**
- Set the **Type** to be `CNAME`
- Set the **Name** to be the subdomain (or leave blank if you are creating a static website on the root of your website)
- Set the **Target** to be equal to the **Endpoint** that you were given in step 5 but **remove** the `http://` prefix and `/` suffix. In my case this is `testing.mattandre.ws.s3-website-eu-west-1.amazonaws.com`
- Leave **TTL** and **Proxy Status** to be their defaults (_Auto_ and _Proxied_)
- Click **Save**

{% img images/cloudflare-add-record.png %}

## Finished!

You're done — load up your domain to see the fruits of your hard work: [https://testing.mattandre.ws](https://testing.mattandre.ws).
