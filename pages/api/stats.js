import jwt from "jsonwebtoken";
import {
  findVideoIdByUser,
  updateStats,
  insertStats,
} from "../../lib/db/hasura";

export default async function stats(req, res) {
  if (req.method === "POST") {
    try {
      const token = req.cookies.token;

      if (!req.cookies.token) {
        res.status(403).send({});
      }

      const { videoId, favourited, watched = true } = req.body;

      if (!videoId) res.send({ msg: "videoId doesn't exist" });

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.issuer;
      const doesStatsExist = await findVideoIdByUser(token, userId, videoId);

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
    } catch (error) {
      console.error("Error occured /stats", error);
      res.status(500).send({ done: false, error: error?.message });
    }
  }
}
