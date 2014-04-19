## AngularJS Multi-Module Example

I created this example project as a companion to my speak at the Vienna AngularJS Meetup on Apr 17th, 2014. It contains an example project structure with multiple Javascript modules and a Java webapp and some examples for directives and controller inheritance.

### Structure

* angular-multimodule-base-ui: base modules & js classes used in other modules
* angular-multimodule-admin-ui: sample 'administration' project that uses the base classes
* angular-multimodule-server: spring boot project that contains the java backend and angular app using the modules

### Building the whole project:

```
./gradlew build
```

(output will be a war file that can be started with java -jar)


### JS Workflow

* start the java application with './gradlew bootRun'
* cd into angular-multimodule-server
* run 'grunt serve'

This will start a local server on port 9000 that watches any changes in the modules and refreshes the browser automatically. API requests are forwarded to the Java application (running on port 8080) via proxy.
