import { Hono } from "hono";
import { renderer } from "./renderer";
import { drizzle } from "drizzle-orm/d1";
import { likesTable } from "./schema";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(renderer);

app.use(logger());

app.use(
  "/likes",
  cors({
    origin: ["https://x.com"],
    allowHeaders: [
      "X-Custom-Header",
      "Upgrade-Insecure-Requests",
      "Content-Type",
    ],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  }),
);

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const links = await db.select().from(likesTable).all();
  links.reverse();

  return c.render(
    <div>
      <h1>Liked Tweets</h1>
      <ul>
        {links.map((link) => (
          <li
            key={link.id}
            style="list-none border-4 border-pink-500 rounded-lg p-4 mb-4 shadow-lg bg-yellow-100 transform transition-transform hover:scale-105; list-style: none;"
          >
            <h2 style="text-2xl font-bold text-pink-700 mb-2">
              {link.created_at}
            </h2>
            <blockquote className="twitter-tweet">
              <a
                href={`https://twitter.com/x/status/${link.link.split("/").pop()}`}
              ></a>
            </blockquote>
          </li>
        ))}
      </ul>
      <script
        async
        src="https://platform.x.com/widgets.js"
        charSet="utf-8"
      ></script>
    </div>,
  );
});

app.get("/likes", async (c) => {
  const db = drizzle(c.env.DB);
  const likes = await db.select().from(likesTable).all();
  return c.json(likes);
});

app.post("/likes", async (c) => {
  const db = drizzle(c.env.DB);
  const { x } = c.req.query();
  const tweet = await db
    .insert(likesTable)
    .values({
      link: x,
      created_at: new Date().toString(),
    })
    .run();
  return c.json(tweet);
});

export default app;
