**Notice:** This project is discontinued and no longer maintained nor supported by Tresorit. This repository only exists for archival purposes.
***
# ZeroKit Web SDK 
[![Build Status](https://travis-ci.org/tresorit/ZeroKit-Web-SDK.svg?branch=master)](https://travis-ci.org/tresorit/ZeroKit-Web-SDK)

This is the Web SDK of [ZeroKit](https://tresorit.com/zerokit), that lets you enable *secure authentication* and *end-to-end encryption* in your application.
It deals with password inputs, encryption and sharing, separating all the code that handles encryption keys and authentication, protecting you from accindental leaks and most XSS attacks. 

The ZeroKit SDK for Web is currently under development and is accessible as a preview. We continuously improve it and fix bugs. Feedback is always welcome.

The project was written in typescript and is available compiled to javascript on the tenant server.
Loading from there is the recommended way of use.

## Usage
The SDK compiles into a bundle, which inserts the zkit_sdk object into the global namespace.
Calling the setup method of this object initializes the sdk.
This should be done during the pageload optionally along with a whoAmI call that will initialize the lazy loading.
After the setup you can use the exposed methods to register and log users in or encrypt and decrypt your sensitive data.

You can see for yourself:
```javascript
zkit_sdk.setup('https://host-hostId.tresorit.io', '/tenant-tenantId');
// After logging in...
zkit_sdk.createTresor().then(tresorId => {
  return zkit_sdk.encrypt('tresorId','Some sensitive data').then((encryptedText) => {
    // Now this text is only decryptable by people who you shared the above "tresor" with
    // You can transport it however you like, it wont leak..
    console.log(encryptedText);  
    return zkit_sdk.decrypt(encryptedText);
  }).then((plainText) => {
    // And we just got the original back...
    console.log(plainText);
    return zkit_sdk.shareTresor(tresorId, 'userIdB');
  }).then((oprationId) => {
    // If this operation is approved by the application server,
    // every text ever encrypted by this tresor is decryptable by userB...
    // No reencyption, no refreshing, everything handled by ZeroKit.
    return applicationServerCall(operationId);
  });
});
// That's how simple it is.
```

Go ahead to the [management portal](https://manage.tresorit.io) and find out more in the documentation and check the full set of features provided by ZeroKit!

## Requirements
First, to use the SDK you need a tenant server (basically a subscription to ZeroKit).
You can get one for free [here](https://tresorit.com/zerokit),
where you can also find a detailed documentation and sample apps for many platforms. You can also get the relevant
example from [GitHub](https://github.com/tresorit/ZeroKit-simple-example).
