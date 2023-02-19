# Happenings
Happenings is an open-source application to create and showcase your timeline of achievements.

## Tech Stack
- [React](https://reactjs.org/) – Framework
- [Ant design](https://ant.design/) – UI Library
- [Supabase](https://supabase.com/) – Database
- [Netlify](https://www.netlify.com/) – Hosting

## Record & Share your journey

Happenings was built on a weekend with an idea of documenting your journey.
You can either keep your timeline private to yourself or generate a public url for you to showcase your achievments / journey.

## DB Schema
<img width="1104" alt="image" src="https://user-images.githubusercontent.com/47049152/219935049-d5200630-b1a2-4092-974e-5d9b5fce4506.png">

## Setup Guide

- Create a new project on [Supabase](https://supabase.com/)
- Navigate to SQL editor and execute the below SQL statement (This creates the required tables)
```
create table user_config (
  id bigint not null primary key,
  created_at timestamp default now(),
  user_id uuid default uuid_generate_v4(),
  url character not null,
  is_public boolean not null,
  display_name character not null
);

create table timeline (
  event_id bigint not null primary key,
  created_at timestamp default now(),
  user_id uuid default uuid_generate_v4(),
  title character,
  description text,
  date date default now(),
  image_url text
);

```

- Navigate to Storage and create a new bucket named ```event-images```
- Grab your project URL and public anon key from Project Settings -> API and add them to the .env file (Refer .env.sample file)
- Configure google auth by following this [Supabase google auth docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
- That's it. You are good to go. Start your app with ```npm start```

# Support
Please feel free to join [Discord](https://discord.gg/NMyFEDre) and clarify things.
