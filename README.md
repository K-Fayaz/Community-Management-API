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

User (user)
###Key	       ###Kind	               ###Notes
id	        string (snowflake)	 primary key
name	      varchar(64)	        default: null
email	     varchar(128)	       unique
password	  varchar(64)	          -
created_at	datetime	             -
