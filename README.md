# StopDown

This project sets up a Next.js application with Tailwind CSS for a Neobrutalism design, integrates with Supabase for backend services, and includes a CI/CD pipeline for GitHub Pages deployment.

## 🚀 Project Setup

1.  **Initialize Next.js Project:**
    ```bash
    npx create-next-app@latest stopdown --ts --eslint --tailwind --app --src-dir --import-alias "@/*"
    cd stopdown
    ```
    *   Uses TypeScript, ESLint, Tailwind CSS, App Router, `src/` directory, and path aliases.

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    *   Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🎨 Tailwind CSS Configuration (Neobrutalism)

1.  **Install Tailwind CSS:** (Already done if `--tailwind` was used in `create-next-app`)
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```

2.  **Configure `tailwind.config.js`:**
    ```javascript
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}', // Ensure src directory is included
      ],
      theme: {
        extend: {
          // Neobrutalism theme properties:
          // Define bold borders, strong shadows, and a vibrant color palette here.
          // Example:
          // borderWidth: {
          //   DEFAULT: '2px',
          //   '3': '3px',
          //   '4': '4px',
          // },
          // boxShadow: {
          //   'neobrutal': '4px 4px 0px 0px rgba(0,0,0,1)',
          //   'neobrutal-md': '6px 6px 0px 0px rgba(0,0,0,1)',
          //   'neobrutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
          // },
          // colors: {
          //   primary: '#FF00FF', // Example vibrant color
          //   secondary: '#00FFFF',
          //   accent: '#FFFF00',
          //   'border-dark': '#000000',
          // },
        },
      },
      plugins: [],
    };
    ```

3.  **Add Tailwind Directives to `src/app/globals.css`:**
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    /* Base styles for Neobrutalism, e.g., body background, font, default border styles */
    /* html, body {
        @apply bg-gray-100 text-gray-900;
    }
    input, button, select, textarea {
        @apply border-2 border-border-dark p-2;
    } */
    ```

## 📊 Supabase Database Schemas

Integrate with Supabase for authentication and data management.

1.  **Supabase CLI Setup:**
    *   Install CLI: `npm install -g supabase`
    *   Login: `supabase login`
    *   Link project: `supabase link --project-ref your-project-id`

2.  **Core Database Schemas (`public` schema):**

    *   **`profiles` table:**
        ```sql
        CREATE TABLE profiles (
          id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          username TEXT UNIQUE,
          avatar_url TEXT,
          website TEXT,
          CONSTRAINT username_length CHECK (char_length(username) >= 3)
        );
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
        CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
        CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

        -- Set up triggers for new user creation
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.profiles (id, username)
          VALUES (NEW.id, NEW.email); -- Or generate a random username, or leave null for onboarding
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
        ```

    *   **`boards` table (Kanban boards):**
        ```sql
        CREATE TABLE boards (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
          title TEXT NOT NULL,
          description TEXT
        );
        ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Boards are viewable by owner." ON boards FOR SELECT USING (auth.uid() = user_id);
        CREATE POLICY "Users can insert their own boards." ON boards FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can update their own boards." ON boards FOR UPDATE USING (auth.uid() = user_id);
        CREATE POLICY "Users can delete their own boards." ON boards FOR DELETE USING (auth.uid() = user_id);
        ```

    *   **`statuses` table (Kanban columns for a board):**
        ```sql
        CREATE TABLE statuses (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          board_id UUID REFERENCES public.boards ON DELETE CASCADE NOT NULL,
          name TEXT NOT NULL,
          "order" INT NOT NULL DEFAULT 0,
          UNIQUE (board_id, name), -- Ensure unique status names per board
          UNIQUE (board_id, "order") -- Ensure unique order per board
        );
        ALTER TABLE statuses ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Statuses are viewable by board owner." ON statuses FOR SELECT USING (EXISTS (SELECT 1 FROM public.boards WHERE id = board_id AND user_id = auth.uid()));
        CREATE POLICY "Users can insert statuses into their own boards." ON statuses FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.boards WHERE id = board_id AND user_id = auth.uid()));
        CREATE POLICY "Users can update statuses in their own boards." ON statuses FOR UPDATE USING (EXISTS (SELECT 1 FROM public.boards WHERE id = board_id AND user_id = auth.uid()));
        CREATE POLICY "Users can delete statuses from their own boards." ON statuses FOR DELETE USING (EXISTS (SELECT 1 FROM public.boards WHERE id = board_id AND user_id = auth.uid()));
        ```

    *   **`cards` table (Tasks within a status/column):**
        ```sql
        CREATE TABLE cards (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          board_id UUID REFERENCES public.boards ON DELETE CASCADE NOT NULL,
          status_id UUID REFERENCES public.statuses ON DELETE SET NULL, -- Cards can exist without a status (e.g., in backlog)
          title TEXT NOT NULL,
          description TEXT,
          "order" INT NOT NULL DEFAULT 0
        );
        ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Cards are viewable by board owner." ON cards FOR SELECT USING (EXISTS (SELECT 1 FROM public.boards WHERE id = board_id AND user_id = auth.uid()));
        CREATE POLICY "Users can insert cards into their own boards." ON cards FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.boards WHERE id = board_id AND user_id = auth.uid()));
        CREATE POLICY "Users can update cards in their own boards." ON cards FOR UPDATE USING (EXISTS (SELECT 1 FROM public.boards WHERE id = board_id AND user_id = auth.uid()));
        CREATE POLICY "Users can delete cards from their own boards." ON cards FOR DELETE USING (EXISTS (SELECT 1 FROM public.boards WHERE id = board_id AND user_id = auth.uid()));
        ```

3.  **Realtime Setup:**
    *   Enable Realtime for `boards`, `statuses`, and `cards` tables in the Supabase UI.

## 🔑 Authentication & Onboarding Routes

Implement secure user authentication and a smooth onboarding flow.

1.  **Authentication Routes:**
    *   `src/app/login/page.tsx`: Handles user sign-in.
    *   `src/app/signup/page.tsx`: Handles user registration.
    *   `src/app/auth/callback/route.ts`: Supabase OAuth callback handler.

2.  **Onboarding Route:**
    *   `src/app/onboarding/page.tsx`: For new users to complete their profile (e.g., set a unique username, upload an avatar) after initial sign-up.

3.  **Supabase Client:**
    *   Set up a Supabase client instance using `@supabase/supabase-js` for both client-side and server-side operations.

## 🚢 GitHub Pages Deployment Workflow

Configure a GitHub Actions workflow for automated deployment to GitHub Pages.

1.  **Next.js Export Configuration:**
    *   In `next.config.js`, ensure `output: 'export'` for static site generation compatible with GitHub Pages.
    ```javascript
    /** @type {import('next').NextConfig} */
    const nextConfig = {
      output: 'export',
      // Optional: Configure basePath if deploying to a subdirectory like <username>.github.io/<repo-name>
      // basePath: '/StopDown',
      images: {
        unoptimized: true, // Required for 'output: export' if using next/image
      },
    };

    module.exports = nextConfig;
    ```

2.  **Create GitHub Actions Workflow:**
    *   Create a file: `.github/workflows/deploy.yml`
    ```yaml
    name: Deploy to GitHub Pages

    on:
      push:
        branches:
          - main # Deploy when changes are pushed to the main branch

    jobs:
      build-and-deploy:
        runs-on: ubuntu-latest

        steps:
          - name: Checkout 🛎️
            uses: actions/checkout@v4

          - name: Setup Node.js
            uses: actions/setup-node@v4
            with:
              node-version: '20' # Or your preferred Node.js version

          - name: Install dependencies 📦
            run: npm install

          - name: Build Next.js app 🏗️
            run: npm run build

          - name: Deploy to GitHub Pages 🚀
            uses: peaceiris/actions-gh-pages@v4
            with:
              github_token: ${{ secrets.GITHUB_TOKEN }}
              publish_dir: ./out # Directory where 'next build' places the static export
              # If your project is hosted at <username>.github.io/<repo-name>, set the following:
              # publish_branch: gh-pages # The branch to publish to
              # cname: # Custom domain if applicable
    ```
    *   **Note:** If deploying to `https://<username>.github.io/<repo-name>/`, you will likely need to set `basePath` in `next.config.js` to `/<repo-name>`. For `https://<username>.github.io/`, `basePath` is not needed.

## 🔗 GitHub Webhook Handler

Set up an API route to process incoming GitHub webhooks for various events (e.g., build status, pull requests).

1.  **Create API Route:**
    *   `src/app/api/github/webhook/route.ts`:
        ```typescript
        import { NextRequest, NextResponse } from 'next/server';
        // import { verifyGithubWebhook } from '@/lib/github'; // A utility to verify webhook signatures

        export async function POST(req: NextRequest) {
          try {
            const signature = req.headers.get('x-hub-signature-256');
            const event = req.headers.get('x-github-event');
            const payload = await req.text(); // Get raw body for signature verification

            if (!signature || !event) {
              return new NextResponse('Missing required GitHub headers', { status: 400 });
            }

            // Verify the webhook signature for security
            // const secret = process.env.GITHUB_WEBHOOK_SECRET;
            // if (!secret || !verifyGithubWebhook(payload, signature, secret)) {
            //   return new NextResponse('Invalid signature', { status: 401 });
            // }

            const jsonPayload = JSON.parse(payload);

            console.log(`Received GitHub event: ${event}`);
            // console.log('Payload:', jsonPayload);

            // Handle different GitHub events
            switch (event) {
              case 'push':
                console.log(`Push to ${jsonPayload.repository.full_name} by ${jsonPayload.pusher.name}`);
                // Trigger a build, notify users, etc.
                break;
              case 'pull_request':
                console.log(`Pull Request ${jsonPayload.action}: #${jsonPayload.number} - ${jsonPayload.pull_request.title}`);
                // Run checks, update status, etc.
                break;
              // Add more event handlers as needed
              default:
                console.log(`Unhandled event type: ${event}`);
            }

            return NextResponse.json({ message: 'Webhook received successfully' }, { status: 200 });
          } catch (error) {
            console.error('Error handling GitHub webhook:', error);
            return new NextResponse('Internal Server Error', { status: 500 });
          }
        }
        ```
    *   **Note:** The `verifyGithubWebhook` utility and `GITHUB_WEBHOOK_SECRET` environment variable would need to be defined for production-ready security.