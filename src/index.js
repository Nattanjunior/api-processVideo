import { createServer } from "http";
import { createReadStream } from "fs";

const port = 3000;

createServer(async (req, res) => {
  const headers = {
    'Acess-Control-Allow-Origin': "*",
    'Acess-Control-Allow-Methods': "*",
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  createReadStream('./assets/video.mp4')
    .pipe(res)
})
  .listen(port, () => console.log('server is running at 3000'))