(function () {
    "use strict";

    const fs = require("fs");
    const http = require("http");
    const port = 8080;

    function postHandler(req, res) {
        console.log("Received request: %s", req.url);

        if (req.method === "POST") {
            var data = "";
            req.on("data", (chunk) => data += chunk);
            req.on("end", () => {
                console.log("Received post data: %s", data);

                fs.writeFile("postData.txt", data, "utf8");

                res.writeHead(200, "OK");
                res.end();
            });
        } else {
            res.writeHead(400, "Only POST is supported");
            res.end();
        }
    }

    http.createServer(postHandler).listen(port, () => {
        console.log("Listening on port %d", port);
    });
})();