import jwt from "jsonwebtoken";
import {
  findVideoIdByUser,
  updateStats,
  insertStats,
} from "../../lib/db/hasura";

export default async function stats(req, res) {
  try {
    const token = req.cookies.token;
    const { videoId } = req.body;

    if (!req.cookies.token) {
      res.status(403).send({});
    }

    if (!videoId) res.send({ msg: "videoId doesn't exist" });

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.issuer;
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
        res.send({ findVideo });
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
