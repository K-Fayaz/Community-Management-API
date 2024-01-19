# Community-Management-API
## About
You run a SaaS Platform that enables user to make their communities and add members to it.

Each user, can create a community and (automatically) gets assigned the Community Admin role. They can add other users to the community who get assigned the Community Member role.4

## User Stories (Features)
### Module: Authentication
  * Feature: User should be able to signup using valid name, email and strong password.
  * Feature: User should be able to signin using valid credentials.
### Module: Community
  * Feature: User should be able to see all communities.
  * Feature: User should be able to create a community.
### Module: Moderation
  * Feature: User should be able to see all community members.
  * Feature: User should be able to add a user as member.
  * Feature: User should be able to remove a member from community.

## Problem Statement
Building the APIs that adheres to above user stories.
The Role names are strict.
The API URLs and Response Structure is fixed.
The field attributes and table names are strict as well.
Validations for each API must be carried out.

## Architecture
![Hiring-Assignment](https://github.com/K-Fayaz/Community-Management-API/assets/91357470/3e0e98e4-f003-46f9-97ed-a741837723f2)

## API End points
![user](https://github.com/K-Fayaz/Community-Management-API/assets/91357470/b36bd78e-a124-4ca4-b882-eed1a8fdd882)
![role](https://github.com/K-Fayaz/Community-Management-API/assets/91357470/4d8c9819-0f2c-4ba1-abd2-c4afea3d6294)
![member](https://github.com/K-Fayaz/Community-Management-API/assets/91357470/cbdb8553-9131-4791-8c35-00fb8dcaaba1)
![table-chart](https://github.com/K-Fayaz/Community-Management-API/assets/91357470/0eba7a11-fc36-4d95-8f43-ea280e323314)


## Role
Role is assigned to a person who is a member of the community.

### POST Create
#### /v1/role
paylod:
{<br>
  "name": "Community Admin"<br>
}

Reponse: <br>
{<br>
  "status": true,<br>
  "content": {<br>
    "data": {<br>
      "id": "7039871299706947583",<br>
      "name": "Community Admin",<br>
      "created_at": "2020-01-01T00:00:00.000Z",<br>
      "updated_at": "2020-01-01T00:00:00.000Z"<br>
    }<br>
  }<br>
}<br>

### GET Get All
#### /v1/role
List all the data with pagination.

meta.total - Total number of documents (eg: 500)

meta.pages - Total number of pages (with 10 documents per page, eg: 50)

meta.page - Current page number (eg: 1)

{<br>
  "status": true,<br>
  "content": {<br>
    "meta": {<br>
      "total": 2,<br>
      "pages": 1,<br>
      "page": 1<br>
    },<br>
    "data": [<br>
      {<br>
        "id": "7039871299706947583",<br>
        "name": "Community Admin",<br>
        "created_at": "2020-01-01T00:00:00.000Z",<br>
        "updated_at": "2020-01-01T00:00:00.000Z"<br>
      },<br>
      {<br>
        "id": "7039873122358527999",<br>
        "name": "Community Member",<br>
        "created_at": "2020-01-01T00:00:00.000Z",<br>
        "updated_at": "2020-01-01T00:00:00.000Z"<br>
      }<br>
    ]<br>
  }<br>
}<br>

## User
### POST Sign Up
#### /v1/auth/signup

It should not return password in response.

It should return the access token to sign in in meta.access_token field.

Payload: <br>
{<br>
  "name": "Dolores Abernathy",<br>
  "email": "dolores@westworld.com", <br>
  "password": "vGuFQ1nJSSrdMaYV1LiN3G1i"<br>
}<br>

Response :
{<br>
  "status": true,<br>
  "content": {<br>
    "data": {<br>
      "id": "7039874298864994303",<br>
      "name": "Dolores Abernathy",<br>
      "email": "dolores@westworld.com",<br>
      "created_at": "2020-01-01T00:00:00.000Z"<br>
    },<br>
    "meta": {<br>
      "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyMDIwLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJpZCI6IjcwMzk4NzQyOTg4NjQ5OTQzMDMiLCJleHAiOiIyMDIwLTAxLTAyVDAwOjAwOjAwLjAwMFoifQ.0WNbCXm8hZBPmib5Q-d1RNJWLoNsHj1AGtfHtcCguI0"<br>
    }<br>
  }<br>
}<br>

### POST Sign In
#### /v1/auth/signin
Sign in user from the valid crdentials given by them. I have used bcrypt to verify hash of the saved password.

It does not return password in the response.

It should return the token to sign in, in meta.access_token field.

{<br>
  "email": "dolores@westworld.com",<br>
  "password": "vGuFQ1nJSSrdMaYV1LiN3G1i"<br>
}<br>

Response: 
{<br>
  "status": true,<br>
  "content": {<br>
    "data": {<br>
      "id": "7039874298864994303",<br>
      "name": "Dolores Abernathy",<br>
      "email": "dolores@westworld.com",<br>
      "created_at": "2020-01-01T00:00:00.000Z"<br>
    },<br>
    "meta": {<br>
      "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyMDIwLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJpZCI6IjcwMzk4NzQyOTg4NjQ5OTQzMDMiLCJleHAiOiIyMDIwLTAxLTAyVDAwOjAwOjAwLjAwMFoifQ.0WNbCXm8hZBPmib5Q-d1RNJWLoNsHj1AGtfHtcCguI0"<br>
    }<br>
  }<br>
}<br>

### GET Get Me
#### /v1/auth/me
Should return the details on the currently signed in user, using the access token.

It should not return the password in response.
AUTHORIZATION
Bearer Token
Token : eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyMDIwLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJpZCI6IjcwMzk4NzQyOTg4NjQ5OTQzMDMiLCJleHAiOiIyMDIwLTAxLTAyVDAwOjAwOjAwLjAwMFoifQ.0WNbCXm8hZBPmib5Q-d1RNJWLoNsHj1AGtfHtcCguI0

Response : 
{<br>
  "status": true,<br>
  "content": {<br>
    "data": {<br>
      "id": "7039874298864994303",<br>
      "name": "Dolores Abernathy",<br>
      "email": "dolores@westworld.com",<br>
      "created_at": "2020-01-01T00:00:00.000Z"<br>
    }<br>
  }<br>
}<br>


## Community
Community is created by a user. User can join the community and become the member. The user creating the community becomes the first member with the role Community Admin, the rest of the users become Community Member.

### POST Create
#### /v1/community
Create a community from the given data.

Important:

The person who creates the community should be added as owner in the community. They should also be added with the role Community Admin as the first member of the community.

AUTHORIZATION
Bearer Token
Token: eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyMDIwLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJpZCI6IjcwMzk4NzQyOTg4NjQ5OTQzMDMiLCJleHAiOiIyMDIwLTAxLTAyVDAwOjAwOjAwLjAwMFoifQ.0WNbCXm8hZBPmib5Q-d1RNJWLoNsHj1AGtfHtcCguI0

Payload: 
{<br>
  "name": "Westworld"<br>
}<br>

Response:
{<br>
  "status": true,<br>
  "content": {<br>
    "data": {<br>
      "id": "7039920812358371327",<br>
      "name": "Westworld",<br>
      "slug": "westworld",<br>
      "owner": "7039874298864994303",<br>
      "created_at": "2020-01-01T00:00:00.000Z",<br>
      "updated_at": "2020-01-01T00:00:00.000Z"<br>
    }<br>
  }<br>
}<br>

### GET Get All
#### /v1/community
List all the data with pagination.

The user who is the owner should be expanded into an object, to know their details. Only id and name should be expanded inside the owner attribute, as we do not want to reveal the email, password and other fields of the user.

meta.total - Total number of documents (eg: 500)

meta.pages - Total number of pages (with 10 documents per page, eg: 50)

meta.page - Current page number (eg: 1)

Response: 
{<br>
  "status": true,<br>
  "content": {<br>
    "meta": {<br>
      "total": 3,<br>
      "pages": 1,<br>
      "page": 1<br>
    },<br>
    "data": [<br>
      {<br>
        "id": "7039920812358371327",<br>
        "name": "Westworld",<br>
        "slug": "westworld",<br>
        "owner": {<br>
          "id": "7039874298864994303",<br>
          "name": "Dolores Abernathy"<br>
        },<br>
        "created_at": "2020-01-01T00:00:00.000Z",<br>
        "updated_at": "2020-01-01T00:00:00.000Z"<br>
      },<br>
      {<br>
        "id": "7039921751504979967",<br>
        "name": "Delos Community",<br>
        "slug": "delos-community",<br>
        "owner": {<br>
          "id": "7039921766419924991",<br>
          "name": "Robert Ford"<br>
        },<br>
        "created_at": "2020-01-01T00:00:00.000Z",<br>
        "updated_at": "2020-01-01T00:00:00.000Z"<br>
      },<br>
      {<br>
        "id": "7039922116220684287",<br>
        "name": "Delos Investors",<br>
        "slug": "delos-investors",<br>
        "owner": {<br>
          "id": "7039921766419924991",<br>
          "name": "Robert Ford"<br>
        },<br>
        "created_at": "2020-01-01T00:00:00.000Z",<br>
        "updated_at": "2020-01-01T00:00:00.000Z"<br>
      }<br>
    ]<br>
  }<br>
}<br>

### GET Get All Members
#### /v1/community/:id/members
List all the data with pagination.

The community is know so it will not be expanded. The roleand user should be expanded to know its details. Only id and name should be expanded inside the user attribute, as we do not want to reveal the email, password and other fields of the user.

meta.total - Total number of documents (eg: 500)

meta.pages - Total number of pages (with 10 documents per page, eg: 50)

meta.page - Current page number (eg: 1)

PATH VARIABLES : id

Response: 
{<br>
  "status": true,<br>
  "content": {<br>
    "meta": {<br>
      "total": 2,<br>
      "pages": 1,<br>
      "page": 1<br>
    },<br>
    "data": [<br>
      {<br>
        "id": "7039923251111266303",<br>
        "community": "7039920812358371327",<br>
        "user": {<br>
          "id": "7039874298864994303",<br>
          "name": "Dolores Abernathy"<br>
        },<br>
        "role": {<br>
          "id": "7039871299706947583",<br>
          "name": "Community Admin"<br>
        },<br>
        "created_at": "2020-01-01T00:00:00.000Z"<br>
      },<br>
      {<br>
        "id": "7039923591432898559",<br>
        "community": "7039920812358371327",<br>
        "user": {<br>
          "id": "7039921766419924991",<br>
          "name": "Robert Ford"<br>
        },<br>
        "role": {<br>
          "id": "7039873122358527999",<br>
          "name": "Community Member"<br>
        },<br>
        "created_at": "2020-01-01T00:00:00.000Z"<br>
      },<br>
      {<br>
        "id": "7039923726313326591",<br>
        "community": "7039920812358371327",<br>
        "user": {<br>
          "id": "7039923743962957823",<br>
          "name": "Maeve Millay"<br>
        },<br>
        "role": {<br>
          "id": "7039873122358527999",<br>
          "name": "Community Member"<br>
        },<br>
        "created_at": "2020-01-01T00:00:00.000Z"<br>
      },<br>
      {<br>
        "id": "7039923868705753087",<br>
        "community": "7039920812358371327",<br>
        "user": {<br>
          "id": "7039923853975357439",<br>
          "name": "Bernard Lowe"<br>
        },<br>
        "role": {<br>
          "id": "7039873122358527999",<br>
          "name": "Community Member"<br>
        },<br>
        "created_at": "2020-01-01T00:00:00.000Z"<br>
      }<br>
    ]<br>
  }<br>
}<br>

### GET Get My Owned Community
#### /v1/community/me/owner
List all the data with pagination.

Since, the owner is known, which is the currently signed in user, it will not expanded.

meta.total - Total number of documents (eg: 500)

meta.pages - Total number of pages (with 10 documents per page, eg: 50)

meta.page - Current page number (eg: 1)

AUTHORIZATION : Bearer Token
Token : eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyMDIwLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJpZCI6IjcwMzk4NzQyOTg4NjQ5OTQzMDMiLCJleHAiOiIyMDIwLTAxLTAyVDAwOjAwOjAwLjAwMFoifQ.0WNbCXm8hZBPmib5Q-d1RNJWLoNsHj1AGtfHtcCguI0

Response: 

{<br>
  "status": true,<br>
  "content": {<br>
    "meta": {<br>
      "total": 1,<br>
      "pages": 1,<br>
      "page": 1<br>
    },<br>
    "data": [<br>
      {<br>
        "id": "7039920812358371327",<br>
        "name": "Westworld",<br>
        "slug": "westworld",<br>
        "owner": "7039874298864994303",<br>
        "created_at": "2020-01-01T00:00:00.000Z",<br>
        "updated_at": "2020-01-01T00:00:00.000Z"<br>
      }<br>
    ]<br>
  }<br>
}<br>

### GET Get My Joined Community
#### /v1/community/me/member
List all the data with pagination.

The user who is the owner should be expanded into an object, to know their details. Only id and name should be expanded inside the owner attribute, as we do not want to reveal the email, password and other fields of the user.

meta.total - Total number of documents (eg: 500)

meta.pages - Total number of pages (with 10 documents per page, eg: 50)

meta.page - Current page number (eg: 1)

AUTHORIZATION
Bearer Token
Token : eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyMDIwLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJpZCI6IjcwMzk4NzQyOTg4NjQ5OTQzMDMiLCJleHAiOiIyMDIwLTAxLTAyVDAwOjAwOjAwLjAwMFoifQ.0WNbCXm8hZBPmib5Q-d1RNJWLoNsHj1AGtfHtcCguI0

Response: 
{<br>
  "status": true,<br>
  "content": {<br>
    "meta": {<br>
      "total": 3,<br>
      "pages": 1,<br>
      "page": 1<br>
    },<br>
    "data": [<br>
      {<br>
        "id": "7039920812358371327",<br>
        "name": "Westworld",<br>
        "slug": "westworld",<br>
        "owner": {<br>
          "id": "7039874298864994303",<br>
          "name": "Dolores Abernathy"<br>
        },<br>
        "created_at": "2020-01-01T00:00:00.000Z",<br>
        "updated_at": "2020-01-01T00:00:00.000Z"<br>
      },<br>
      {<br>
        "id": "7039921751504979967",<br>
        "name": "Delos Community",<br>
        "slug": "delos-community",<br>
        "owner": {<br>
          "id": "7039921766419924991",<br>
          "name": "Robert Ford"<br>
        },<br>
        "created_at": "2020-01-01T00:00:00.000Z",<br>
        "updated_at": "2020-01-01T00:00:00.000Z"<br>
      },<br>
      {<br>
        "id": "7039922116220684287",<br>
        "name": "Delos Investors",<br>
        "slug": "delos-investors",<br>
        "owner": {<br>
          "id": "7039921766419924991",<br>
          "name": "Robert Ford"<br>
        },<br>
        "created_at": "2020-01-01T00:00:00.000Z",<br>
        "updated_at": "2020-01-01T00:00:00.000Z"<br>
      }<br>
    ]<br>
  }<br>
}<br>

## Member
A user when added to a community and assigned a role in it, is called a member.

### POST Add Member
#### /v1/member
Only Community Admin can add user. Other roles will be thrown the NOT_ALLOWED_ACCESS error.

payload: {<br>
  "community": "7039920812358371327",<br>
  "user": "7039921766419924991",<br>
  "role": "7039873122358527999"<br>
}<br>

AUTHORIZATION
Bearer Token
Token: eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyMDIwLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJpZCI6IjcwMzk4NzQyOTg4NjQ5OTQzMDMiLCJleHAiOiIyMDIwLTAxLTAyVDAwOjAwOjAwLjAwMFoifQ.0WNbCXm8hZBPmib5Q-d1RNJWLoNsHj1AGtfHtcCguI0

Response: 
{<br>
  "status": true,<br>
  "content": {<br>
    "data": {<br>
      "id": "7039929260764563455",<br>
      "community": "7039920812358371327",<br>
      "user": "7039921766419924991",<br>
      "role": "7039873122358527999",<br>
      "created_at": "2020-01-01T00:00:00.000Z"<br>
    }<br>
  }<br>
}<br>

### DELETE Remove Member
#### /v1/member/:id
Only Community Admin and Community Moderator can remove user. Other roles will be thrown the NOT_ALLOWED_ACCESS error.

AUTHORIZATION
Bearer Token
Token: eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyMDIwLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJpZCI6IjcwMzk4NzQyOTg4NjQ5OTQzMDMiLCJleHAiOiIyMDIwLTAxLTAyVDAwOjAwOjAwLjAwMFoifQ.0WNbCXm8hZBPmib5Q-d1RNJWLoNsHj1AGtfHtcCguI0

PATH VARIABLES: id

Response: 
{<br>
  "status": true<br>
}<br>
