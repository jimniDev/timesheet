# 🕓Timesheet

## Introduction

- Mobile Web App service to track the working time of AS Scope employees

- `Timesheet` 은 직원들의 근무 시간을 실시간으로 추적하고 기록하는 근무시간관리 웹서비스로, 사용자가 간편하게 2번의 클릭만으로 근무시간을 기록할 수 있게 만든 반응형 웹 어플리케이션입니다.

### Role

- Frontend 담당(80%) + 디자인
- 전체 프론트엔드를 웹버전, 모바일 버전 반응형으로 Angular로 구현하였습니다.
- 프로젝트 중간에 추가되는 기능들의 API 개발도 수행하였습니다 (10%)

## Skills

- Java (Spring)
- Angular
- JHipster
- MSSQL
- Microsoft Azure

## Function

### 🕑 근무시간 기록

- 실시간 출근, 퇴근 기록
- 출퇴근 기록 생성, 수정, 삭제
- 휴가 생성, 관리
- 근무시간, 잔여근무시간 조회
  외 ...

### 💾 파일 저장

- 근무기록표 PDF 저장

## Structure (FE)

    📦app
    ┣ 📂admin
    ┃ ┣ 📂activity-config
    ┃ ┃ ┣ 📂activity-creation-dialog
    ┃ ┃ ┣ 📂activity-edit-dialog
    ┃ ┃ ┣ 📂activity-role-mapping-dialog
    ┃ ┃ ┣ 📂activity-table
    ┃ ┃ ┣ 📂role-creation-dialog
    ┃ ┃ ┣ 📂role-edit-dialog
    ┃ ┃ ┣ 📂role-table
    ┃ ┃ ┣ 📜activity-config.component.html
    ┃ ┃ ┣ 📜activity-config.component.scss
    ┃ ┃ ┣ 📜activity-config.component.ts
    ┃ ┃ ┗ 📜activity-config.route.ts
    ┃ ┣ 📂employee-overview
    ┃ ┣ 📜admin.module.ts
    ┃ ┣ 📜admin.route.ts
    ┃ ┗ 📜index.ts
    ┣ 📂as-layouts
    ┃ ┣ 📂as-grid
    ┃ ┣ 📂as-interactive
    ┃ ┣ 📂as-main
    ┃ ┣ 📂as-main-card
    ┃ ┣ 📂as-navbar
    ┃ ┣ 📂as-table
    ┃ ┣ 📂as-time-input
    ┃ ┗ 📜as-layouts.module.ts
    ┣ 📂blocks
    ┃ ┣ 📂config
    ┃ ┗ 📂interceptor
    ┣ 📂core
    ┃ ┣ 📂auth
    ┃ ┣ 📂login
    ┃ ┃ ┗ 📜login.service.ts
    ┃ ┣ 📂user
    ┃ ┣ 📜core.module.ts
    ┃ ┗ 📜index.ts
    ┣ 📂entities
    ┃ ┣ 📂activity-timesheet
    ┃ ┃ ┣ 📜activity-timesheet.service.ts
    ┃ ┃ ┗ 📜index.ts
    ┃ ┣ 📂employee-timesheet
    ┃ ┃ ┗ 📜index.ts
    ┃ ┣ 📂role-timesheet
    ┃ ┣ 📂weekly-working-hours-timesheet
    ┃ ┣ 📂work-day-timesheet
    ┃ ┣ 📂working-entry-timesheet
    ┃ ┗ 📜entity.module.ts
    ┣ 📂home
    ┃ ┣ 📂date-form
    ┃ ┣ 📂start-stop-dialog
    ┃ ┣ 📂timetable
    ┃ ┣ 📂timetable-delete-dialog
    ┃ ┣ 📂timetable-edit-dialog
    ┃ ┣ 📂year-month-select
    ┃ ┣ 📂year-week-select
    ┃ ┣ 📜home.component.html
    ┃ ┣ 📜home.component.ts
    ┃ ┣ 📜home.module.ts
    ┃ ┣ 📜home.route.ts
    ┃ ┣ 📜home.scss
    ┃ ┣ 📜index.ts
    ┃ ┗ 📜two-digits.directive.ts
    ┣ 📂layouts
    ┃ ┣ 📂error
    ┃ ┣ 📂main
    ┃ ┗ 📜index.ts
    ┣ 📂personal-details
    ┣ 📂shared
    ┃ ┣ 📂auth
    ┃ ┃ ┗ 📜has-any-authority.directive.ts
    ┃ ┣ 📂constants
    ┃ ┃ ┣ 📜error.constants.ts
    ┃ ┃ ┣ 📜input.constants.ts
    ┃ ┃ ┗ 📜pagination.constants.ts
    ┃ ┣ 📂language
    ┃ ┃ ┗ 📜find-language-from-key.pipe.ts
    ┃ ┣ 📂model
    ┃ ┃ ┣ 📜activity-timesheet.model.ts
    ┃ ┃ ┣ 📜employee-timesheet.model.ts
    ┃ ┃ ┣ 📜role-timesheet.model.ts
    ┃ ┃ ┣ 📜weekly-working-hours-timesheet.model.ts
    ┃ ┃ ┣ 📜work-day-timesheet.model.ts
    ┃ ┃ ┗ 📜working-entry-timesheet.model.ts
    ┃ ┣ 📂pdf
    ┃ ┣ 📂util
    ┃ ┣ 📜index.ts
    ┃ ┣ 📜shared-common.module.ts
    ┃ ┣ 📜shared-libs.module.ts
    ┃ ┗ 📜shared.module.ts
    ┣ 📜app-routing.module.ts
    ┣ 📜app.constants.ts
    ┣ 📜app.main.ts
    ┣ 📜app.module.ts
    ┣ 📜polyfills.ts
    ┣ 📜timesheet_tree.txt
    ┗ 📜vendor.ts

## Running

This application was generated using JHipster 6.1.2, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v6.1.2](https://www.jhipster.tech/documentation-archive/v6.1.2).

## Development

Before you can build this project, you must install and configure the following dependencies on your machine:

1. [Node.js][]: We use Node to run a development web server and build the project.
   Depending on your system, you can install Node either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](package.json).

    npm install

We use npm scripts and [Webpack][] as our build system.

Run the following commands in two separate terminals to create a blissful development experience where your browser
auto-refreshes when files change on your hard drive.

    ./mvnw
    npm start

Npm is also used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in [package.json](package.json). You can also run `npm update` and `npm install` to manage dependencies.
Add the `help` flag on any command to see how you can use it. For example, `npm help update`.

The `npm run` command will list all of the scripts available to run for this project.

## OAuth 2.0 / OpenID Connect

Congratulations! You've selected an excellent way to secure your JHipster application. If you're not sure what OAuth and OpenID Connect (OIDC) are, please see [What the Heck is OAuth?](https://developer.okta.com/blog/2017/06/21/what-the-heck-is-oauth)

To log in to your app, you'll need to have [Keycloak](https://keycloak.org) up and running. The JHipster Team has created a Docker container for you that has the default users and roles. Start Keycloak using the following command.

```
docker-compose -f src/main/docker/keycloak.yml up
```

The security settings in `src/main/resources/application.yml` are configured for this image.

```yaml
spring:
  ...
  security:
    oauth2:
      client:
        provider:
          oidc:
            issuer-uri: http://localhost:9080/auth/realms/jhipster
        registration:
          oidc:
            client-id: web_app
            client-secret: web_app
```

### Okta

If you'd like to use Okta instead of Keycloak, you'll need to change a few things. First, you'll need to create a free developer account at <https://developer.okta.com/signup/>. After doing so, you'll get your own Okta domain, that has a name like `https://dev-123456.okta.com`.

Modify `src/main/resources/application.yml` to use your Okta settings.

```yaml
spring:
  ...
  security:
    oauth2:
      client:
        provider:
          oidc:
            issuer-uri: https://{yourOktaDomain}/oauth2/default
        registration:
          oidc:
            client-id: {clientId}
            client-secret: {clientSecret}
security:
```

Create an OIDC App in Okta to get a `{clientId}` and `{clientSecret}`. To do this, log in to your Okta Developer account and navigate to **Applications** > **Add Application**. Click **Web** and click the **Next** button. Give the app a name you’ll remember, specify `http://localhost:8080` as a Base URI, and `http://localhost:8080/login/oauth2/code/oidc` as a Login Redirect URI. Click **Done**, then Edit and add `http://localhost:8080` as a Logout redirect URI. Copy and paste the client ID and secret into your `application.yml` file.

> **TIP:** If you want to use the [Ionic Module for JHipster](https://www.npmjs.com/package/generator-jhipster-ionic), you'll need to add `http://localhost:8100` as a **Login redirect URI** as well.

Create a `ROLE_ADMIN` and `ROLE_USER` group and add users into them. Modify e2e tests to use this account when running integration tests. You'll need to change credentials in `src/test/javascript/e2e/account/account.spec.ts` and `src/test/javascript/e2e/admin/administration.spec.ts`.

Navigate to **API** > **Authorization Servers**, click the **Authorization Servers** tab and edit the default one. Click the **Claims** tab and **Add Claim**. Name it "roles", and include it in the ID Token. Set the value type to "Groups" and set the filter to be a Regex of `.*`.

After making these changes, you should be good to go! If you have any issues, please post them to [Stack Overflow](https://stackoverflow.com/questions/tagged/jhipster). Make sure to tag your question with "jhipster" and "okta".

### Service workers

Service workers are commented by default, to enable them please uncomment the following code.

- The service worker registering script in index.html

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(function() {
      console.log('Service Worker Registered');
    });
  }
</script>
```

Note: workbox creates the respective service worker and dynamically generate the `service-worker.js`

### Managing dependencies

For example, to add [Leaflet][] library as a runtime dependency of your application, you would run following command:

    npm install --save --save-exact leaflet

To benefit from TypeScript type definitions from [DefinitelyTyped][] repository in development, you would run following command:

    npm install --save-dev --save-exact @types/leaflet

Then you would import the JS and CSS files specified in library's installation instructions so that [Webpack][] knows about them:
Edit [src/main/webapp/app/vendor.ts](src/main/webapp/app/vendor.ts) file:

```
import 'leaflet/dist/leaflet.js';
```

Edit [src/main/webapp/content/css/vendor.css](src/main/webapp/content/css/vendor.css) file:

```
@import '~leaflet/dist/leaflet.css';
```

Note: there are still few other things remaining to do for Leaflet that we won't detail here.

For further instructions on how to develop with JHipster, have a look at [Using JHipster in development][].

### Using angular-cli

You can also use [Angular CLI][] to generate some custom client code.

For example, the following command:

    ng generate component my-component

will generate few files:

    create src/main/webapp/app/my-component/my-component.component.html
    create src/main/webapp/app/my-component/my-component.component.ts
    update src/main/webapp/app/app.module.ts

## Building for production

### Packaging as jar

To build the final jar and optimize the timesheet application for production, run:

    ./mvnw -Pprod clean verify

This will concatenate and minify the client CSS and JavaScript files. It will also modify `index.html` so it references these new files.
To ensure everything worked, run:

    java -jar target/*.jar

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

Refer to [Using JHipster in production][] for more details.

### Packaging as war

To package your application as a war in order to deploy it to an application server, run:

    ./mvnw -Pprod,war clean verify

## Testing

To launch your application's tests, run:

    ./mvnw verify

### Client tests

Unit tests are run by [Jest][] and written with [Jasmine][]. They're located in [src/test/javascript/](src/test/javascript/) and can be run with:

    npm test

For more information, refer to the [Running tests page][].

### Code quality

Sonar is used to analyse code quality. You can start a local Sonar server (accessible on http://localhost:9001) with:

```
docker-compose -f src/main/docker/sonar.yml up -d
```

You can run a Sonar analysis with using the [sonar-scanner](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner) or by using the maven plugin.

Then, run a Sonar analysis:

```
./mvnw -Pprod clean verify sonar:sonar
```

If you need to re-run the Sonar phase, please be sure to specify at least the `initialize` phase since Sonar properties are loaded from the sonar-project.properties file.

```
./mvnw initialize sonar:sonar
```

or

For more information, refer to the [Code quality page][].

## Using Docker to simplify development (optional)

You can use Docker to improve your JHipster development experience. A number of docker-compose configuration are available in the [src/main/docker](src/main/docker) folder to launch required third party services.

For example, to start a postgresql database in a docker container, run:

    docker-compose -f src/main/docker/postgresql.yml up -d

To stop it and remove the container, run:

    docker-compose -f src/main/docker/postgresql.yml down

You can also fully dockerize your application and all the services that it depends on.
To achieve this, first build a docker image of your app by running:

    ./mvnw -Pprod verify jib:dockerBuild

Then run:

    docker-compose -f src/main/docker/app.yml up -d

For more information refer to [Using Docker and Docker-Compose][], this page also contains information on the docker-compose sub-generator (`jhipster docker-compose`), which is able to generate docker configurations for one or several JHipster applications.

## Continuous Integration (optional)

To configure CI for your project, run the ci-cd sub-generator (`jhipster ci-cd`), this will let you generate configuration files for a number of Continuous Integration systems. Consult the [Setting up Continuous Integration][] page for more information.

[jhipster homepage and latest documentation]: https://www.jhipster.tech
[jhipster 6.1.2 archive]: https://www.jhipster.tech/documentation-archive/v6.1.2
[using jhipster in development]: https://www.jhipster.tech/documentation-archive/v6.1.2/development/
[using docker and docker-compose]: https://www.jhipster.tech/documentation-archive/v6.1.2/docker-compose
[using jhipster in production]: https://www.jhipster.tech/documentation-archive/v6.1.2/production/
[running tests page]: https://www.jhipster.tech/documentation-archive/v6.1.2/running-tests/
[code quality page]: https://www.jhipster.tech/documentation-archive/v6.1.2/code-quality/
[setting up continuous integration]: https://www.jhipster.tech/documentation-archive/v6.1.2/setting-up-ci/
[node.js]: https://nodejs.org/
[yarn]: https://yarnpkg.org/
[webpack]: https://webpack.github.io/
[angular cli]: https://cli.angular.io/
[browsersync]: http://www.browsersync.io/
[jest]: https://facebook.github.io/jest/
[jasmine]: http://jasmine.github.io/2.0/introduction.html
[protractor]: https://angular.github.io/protractor/
[leaflet]: http://leafletjs.com/
[definitelytyped]: http://definitelytyped.org/
