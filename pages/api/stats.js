import jwt from "jsonwebtoken";
import { findVideoIdByUser, updateStats } from "../../lib/db/hasura";

export default async function stats(req, res) {
  if (req.method === "POST") {
    try {
      const token = req.cookies.token;

      if (!req.cookies.token) {
        res.status(403).send({});
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.issuer;
      const videoId = req.query.videoId;
      const doesStatsExist = await findVideoIdByUser(token, userId, videoId);

      if (doesStatsExist) {
        // update it
        const response = await updateStats(token, {
          favoutited: 0,
          watched: false,
          userId,
          videoId: "dRuwjZJ-DQw",
        });

        res.send({ msg: "Update success", updateStats: response });
      } else {
        // add it
        // const response = await insertStats(token);

        res.send({ msg: "it works", decodedToken, doesStatsExist });
      }
    } catch (error) {
      console.error("Error occured /stats", error);
      res.status(500).send({ done: false, error: error?.message });
    }
  }
}
