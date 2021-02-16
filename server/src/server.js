const cors = require("cors");
const path = require("path");
const express = require("express");
const client = require("./client/elasticsearch");
// const bodybuilder = require("bodybuilder");

const app = express();
const bodyParser = require("body-parser");
const { parse } = require("./utils/parser");

try {
  client.ping({
    requestTimeout: 30000
  }, function(err, response, status) {
    if (err) {
      console.error("elasticsearch is not ready or is down", response, (status || ""));
    } else {
      const index = "analytics";
      const file = path.join(__dirname, "..", "data.csv");
      parse({ file, index });
      console.log("elastic search service is ready to receive requests");
    }
  });
} catch (error) {
  console.error("", + error.message);
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("port", process.env.PORT || 3085);

app.use(function(_, res, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Header", "Origin, X-Requested-Width, Content-Type, Accept");
});

app.get("/", function(_, res) {
  res.status(200).json({
    message: "welcome to elasticsearch analytics server"
  });
});

app.post("/index", function(req, res) {
  //
});

app.delete("/delete", async function(req, res) {
  const { index } = req.body;

  try {
    if (await client.indices.exists({ index })) {
      await client.indices.delete({ index });
      res.status(200).json({
        message: "index deleted successfully",
        data: { index }
      });
    } else {
      res.status(404).json({
        message: "index not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error
    });
  }
});

app.post("/search", function(req, res) {
  // const q = req.query.q.length ? "*" + req.query.q + "*" : "";

  // construct query here
  // const query = {}
  const body = req.body;
  console.log(body, "-->");

  client.search({
    index: "analytics",
    body,
  }).then(results => {
    console.log(results, ["results"]);
    res.status(200).json({
      status: "success",
      // data: results.hits.hits
      data: results.aggregations.popular_colors.buckets
    });
  }).catch(err => {
    console.error(err);
    res.send([]);
  })
});

app.listen(app.get("port"), function() {
  console.log("express server listening on port " + app.get("port"));
});
