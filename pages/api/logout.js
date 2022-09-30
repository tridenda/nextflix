import { deleteTokenCookie } from "../../lib/cookies";

export default function logout(req, res) {
  if (req.method === "GET") {
    deleteTokenCookie(res);

    res.send({ done: true });
  }
}
