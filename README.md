This is a [Next.js](https://nextjs.org) project for users to track their
macronutrient intake over time.

Users input a text description of their meal, which is then analyzed by an AI
tool.

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

## TODO

Query a database for nutrition facts on common food items, and feed this
information into the AI for more reliable analysis.

Grade each meal from F to A+, depending on the nutrition goals of the user.

## Run Production Server

Build the Docker image:

```bash
docker build --secret id=env_local,src=.env.local -t mango-app . 
```

Expose and map port 3000 using the local env file:

```bash
docker run -d --env-file .env.local -p 3000:3000 mango-app
```

Open http://localhost:3000 in your browser to view the running app.
