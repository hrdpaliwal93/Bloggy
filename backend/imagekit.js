import ImageKit from '@imagekit/nodejs';
import fs from 'fs'
const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});



export default client