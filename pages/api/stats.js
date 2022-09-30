import {
  findVideoIdByUser,
  updateStats,
  insertStats,
} from "../../lib/db/hasura";
import { verifyToken } from "../../lib/utils";

export default async function stats(req, res) {
  try {
    const token = req.cookies.token;
    const inputParams = req.method === "POST" ? req.body : req.query;
    const { videoId } = inputParams;

    if (!token) {
      res.status(403).send({});
    }

    if (!videoId) res.send({ msg: "videoId doesn't exist" });

    const userId = verifyToken(token);
    const findVideo = await findVideoIdByUser(token, userId, videoId);
    const doesStatsExist = findVideo?.length > 0;

    if (req.method === "POST") {
      const { favourited, watched = true } = req.body;

      if (doesStatsExist) {
        // update it
        const response = await updateStats(token, {
          favourited,
          watched,
          userId,
          videoId,
        });

        res.send({ stats: response });
      } else {
        // add it
        const response = await insertStats(token, {
          favourited,
          watched,
          userId,
          videoId,
        });

        res.send({ stats: response });
      }
    } else {
      if (doesStatsExist) {
        res.send(findVideo);
      } else {
        res.status(404);
        res.send({ user: null, msg: "Video not found" });
      }
    }
  } catch (error) {
    console.error("Error occured /stats", error);
    res.status(500).send({ done: false, error: error?.message });
  }
}
