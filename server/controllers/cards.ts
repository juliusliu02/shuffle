import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { reviewCardSchema } from "@/lib/schemas/cards";
import type { CardSelect, CardWithNoteWithArticle } from "@/lib/types";
import { requireAuth } from "@/server/middlewares/auth";
import * as schedulerService from "@/server/services/cards";
import { reviewCard } from "@/server/services/scheduler";

type CardResponse =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      card: CardSelect;
    };

const CardApp = new Hono()
  .use(requireAuth())
  .get("/", async (c) => {
    const cards: CardWithNoteWithArticle[] = await schedulerService.getDueCards(
      c.get("user").id,
    );
    return c.json(cards, 200);
  })
  .post("/:id", zValidator("json", reviewCardSchema), async (c) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id))
      return c.json<CardResponse>(
        { success: false, error: "invalid input" },
        400,
      );
    const { rating } = c.req.valid("json");

    const newCard = await reviewCard(id, c.get("user").id, rating);
    if (!newCard)
      return c.json<CardResponse>(
        { success: false, error: "invalid input" },
        400,
      );
    return c.json<CardResponse>({ success: true, card: newCard }, 200);
  });

export default CardApp;
