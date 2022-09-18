import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

import { convertHourStringToMinutes } from "./utils/hour-converted-to-minutes";
import { convertMinutesStringToHours } from "./utils/minutes-converted-to-hours";

dotenv.config();

const app = express();
const prismaClient = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/games", async (req: Request, res: Response) => {
  const games = await prismaClient.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        },
      },
    },
  });
  return res
    .status(200)
    .json({ status: "success", totalGames: games.length, data: { games } });
});

app.get("/games/:id/ads", async (req: Request, res: Response) => {
  const { id: gameId } = req.params;
  const ads = await prismaClient.ad.findMany({
    select: {
      id: true,
      name: true,
      hourEnd: true,
      weekDays: true,
      discord: false,
      hourStart: true,
      yearsPlaying: true,
      useVoiceChannel: true,
    },
    where: { gameId },
    orderBy: {
      createdAt: "desc",
    },
  });

  const adsFormated = ads.map((ad) => ({
    ...ad,
    weekDays: ad.weekDays.split(","),
    hourStart: convertMinutesStringToHours(ad.hourStart),
    hourEnd: convertMinutesStringToHours(ad.hourEnd),
  }));

  return res.status(200).json({
    status: "success",
    totalAds: adsFormated.length,
    data: { ads: adsFormated },
  });
});

app.post("/games/:gameId/ads", async (req: Request, res: Response) => {
  const { gameId } = req.params;
  const bodyRequest = req.body;
  const ad = await prismaClient.ad.create({
    data: {
      gameId,
      name: bodyRequest.name,
      discord: bodyRequest.discord,
      yearsPlaying: bodyRequest.yearsPlaying,
      weekDays: bodyRequest.weekDays.join(","),
      useVoiceChannel: bodyRequest.useVoiceChannel,
      hourEnd: convertHourStringToMinutes(bodyRequest.hourEnd),
      hourStart: convertHourStringToMinutes(bodyRequest.hourStart),
    },
  });
  return res.status(201).json({ status: "success", data: { ad } });
});

app.get("/ads/:id/discord", async (req: Request, res: Response) => {
  const { id: adId } = req.params;

  const ad = await prismaClient.ad.findUniqueOrThrow({
    where: { id: adId },
    select: { discord: true },
  });

  return res
    .status(200)
    .json({ status: "success", data: { discord: ad.discord } });
});

const port = process.env.PORT || 19999;

app.listen(port, () => console.log(`Server is running in the port 3333 🚀`));
