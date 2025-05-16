# Mango

Mango is a Next.js project that allows users to track their macronutrient intake
over time.

Users input a text description of their meal, which is then analyzed by AI.

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the
result.

## Run Production Server

Build the Docker image:

```bash
docker build --secret id=env_local,src=.env.local -t mango-app . 
```

Expose and map port 3000 using the local env file:

```bash
docker run -d --env-file .env.local -p 3000:3000 mango-app
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the
result.
