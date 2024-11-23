import { createServer } from "http";
import { createReadStream } from "fs";
import { spawn } from "child_process";

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

  res.writeHead(200, {
    'Content-Type': 'video/mp4'
  })

  const ffmpegProcess = spawn('ffmpeg', [
    '-i', 'pipe:0',
    '-f', 'mp4',
    '-vcodec', 'h264',
    '-acodec', 'aac',
    '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
    '-b:v', '1500k',
    '-maxrate', '1500k',
    '-bufsize', '1000k',
    '-f', 'mp4',
    '-vf', "drawtext=text='racionais@gmail.com':x=10:y=H-th-10:fontsize=50:fontcolor=red:shadowcolor=red:shadowx=5",
    'pipe:1'
  ], {
    stdio: ['pipe', 'pipe', 'pipe']
  })

  createReadStream('./assets/video-ready.mp4').pipe(ffmpegProcess.stdin)

  ffmpegProcess.stderr.on('data', msg => console.log(msg.toString()))
  ffmpegProcess.stdout.pipe(res)

  req.once('close', () => {
    ffmpegProcess.stdout.destroy();
    ffmpegProcess.stdin.destroy();
    console.log('disconnected', ffmpegProcess.kill())
  })

})
  .listen(port, () => console.log('server is running at 3000'))