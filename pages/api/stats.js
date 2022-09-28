export default async function stats(req, res) {
  if (req.method === "POST") {
    if (!req.cookies.token) {
      res.status(403).send({});
    } else {
      res.send({ msg: "it works" });
    }
  }
}
