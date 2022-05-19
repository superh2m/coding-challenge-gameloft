<img src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Gameloft-logo-and-wordmark.png" alt="Gameloft logo" width="500"/><br><br>
[![Workflow](https://github.com/superh2m/coding-challenge-gameloft/actions/workflows/github-actions.yml/badge.svg)](https://github.com/superh2m/coding-challenge-gameloft/actions)
# Gameloft Coding Challenge

I was really happy to do this technical test, which by its openness allows a great freedom of technical choices. I hope that my choices and my work will satisfy you. Thank you for your time :)

[Test instructions](Coding-test-backend.md)

## TL;DR
- [Typescript](https://www.typescriptlang.org/) is the main language
- Install [docker](https://docs.docker.com/get-docker/) & [docker-compose](https://docs.docker.com/compose/install/)
- Install [make](https://linuxhint.com/install-make-ubuntu/) package
- `make install` installs the application
- `make start_dev` run the dev server
- [CHANGES.md](CHANGES.md)

## GraphQL

### Schema

```gql
scalar Date

type User {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  picture: String
}

type Forum {
  id: ID!
  name: String!
  forumUsers: [ForumUser]
}

type ForumUser {
  id: ID!
  user: User!
  forum: Forum!
}

type ForumMessage {
  id: ID!
  content: String!
  forum: Forum!
  forumUser: ForumUser!
  sendedAt: Date!
}

type Query {
  user(id: ID!): User
  forums(q: String): [Forum]
  forum(id: ID!): Forum
  myForums: [Forum]
  forumUsers(forumId: ID!): [ForumUser]
  forumMessages(forumId: ID!): [ForumMessage]
}

type Mutation {
  updateProfile(firstName: String!, lastName: String!, picture: String): User
  createForum(name: String!): Forum
  joinForum(forumId: ID!): ForumUser
  postMessage(forumId: ID!, content: String!): ForumMessage
}
```

## Getting Started

### Prerequisites

You are going to need:

- `git`
- `docker`
- `docker-compose`
- `make`

### Setting up your environment

1. Install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
4. Install [docker](https://docs.docker.com/get-docker/)
5. Install [docker-compose](https://docs.docker.com/compose/install/)
6. Install [make](https://linuxhint.com/install-make-ubuntu/)

### Setting up the project

#### In the project directory run:

```
make install
```

### Running the tests

The test suite can be run with:

```
make test
```

### Starting the application

#### To start a local server run:

```
make start_dev
```

#### It should produce an output similar to:

```
✌️ DB loaded and connected!
🚀 Server ready at http://localhost:4000/graphql
```

## Documentation
### Project structure
```
📦coding-challenge-gameloft
 ┣ 📂.husky                       => pre-commit hooks
 ┣ 📂docker                       => docker configuration files
 ┣ 📂src
 ┃ ┣ 📂app
 ┃ ┃ ┣ 📂config                   => app configurations
 ┃ ┃ ┣ 📂dev
 ┃ ┃ ┃ ┣ 📜authenticator.ts       => singleton default user accesor
 ┃ ┃ ┃ ┗ 📜fixtures.ts            => fixtures loader
 ┃ ┃ ┗ 📜app.ts                   => main app class
 ┃ ┣ 📂domain
 ┃ ┃ ┣ 📂document                 => mongodb document schemas
 ┃ ┃ ┗ 📂graphql                  => graphql schemas
 ┃ ┃ ┃ ┣ 📂forum                  => each schema element is separated in a different file: types, queries, mutations and resolvers
 ┃ ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┃ ┣ 📜mutations.ts
 ┃ ┃ ┃ ┃ ┣ 📜queries.ts
 ┃ ┃ ┃ ┃ ┣ 📜resolvers.ts
 ┃ ┃ ┃ ┃ ┗ 📜types.ts
 ┃ ┣ 📂infra
 ┃ ┃ ┗ 📂mongodb
 ┃ ┃ ┃ ┗ 📜mongooseClient.ts      => small abstraction for the database connection
 ┃ ┣ 📂tests                      => test suite
 ┣ 📜.eslintrc.json               => eslint config file
 ┣ 📜.nvmrc                       => nvm config file
 ┣ 📜Makefile                     => commands orchestrator
 ┣ 📜docker-compose.yml           => docker-compose config file
 ┗ 📜tsconfig.json                => typescript config file
```
All files and folders have not been listed here for readability.

### Approach and architecture
I choose to go with the [DDD](https://en.wikipedia.org/wiki/Domain-driven_design) approach, and add a much better decoupling compared to a classic NodeJS app.
A key concept of this architecture is therefore to put all the business logic in a single place called the domain (hexagon), which depends only on itself; this is the only way to ensure that the business logic is decoupled from technical layers. So all our graphQL resolvers and schemas are placed in the `src/domain/` directory.
I also chose to use a NoSQL database to store the data, with MongoDB, to present a more realistic application.
