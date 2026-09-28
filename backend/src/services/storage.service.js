import ImageKit,{ toFile } from '@imagekit/nodejs';
import config from '../config/config.js';

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

export async function uploadFileToImageKit({ buffer, fileName }) {
  const response = await client.upload({
    file: await toFile(buffer),
    fileName: fileName,
    folder: 'snitch',
  });
  return response;
}
