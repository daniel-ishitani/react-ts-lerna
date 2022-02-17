import path from 'path';
import { Command } from 'commander';

import { serve } from 'local-api';

const useProxy = !(process.env.NODE_ENV === 'production');

export const serveCommand = new Command()
  .command('serve [filename]')
  .description('Open a file for editing')
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action(async (filename = 'notes.js', options: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
  
      await serve(parseInt(options.port), path.basename(filename), dir, useProxy);
      console.log(`Opened ${filename}. Navigate to localhost:${options.port} to edit.`);
    } catch (err: any) {
      if (err.code === 'EADDRINUSE') {
        console.error('Port is in use. Try running on a different port. [-p <number>]');
      } else {
        console.log(err.message);
      }

      process.exit(1);
    }
  });