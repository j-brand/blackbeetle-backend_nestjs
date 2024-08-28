import { UnprocessableEntityException } from '@nestjs/common';
import { basename, extname } from 'path';
import * as fs from 'fs';
const fsPromises = require('fs/promises');

import { diskStorage } from 'multer';


export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new UnprocessableEntityException('Only image files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

export const getFileNameCallback = async (req, file, callback) => {
  const fileName = await getFileName(req, file);
  callback(null, fileName);
};
export const getDestinationCallback = (req, file, callback) => {
  const destination = getDestination(req);
  fs.mkdirSync(destination, { recursive: true });
  callback(null, destination);
};

const getDestination = (req) => {
  const entity_id = req.body.entity_id;
  const path = req.body.path;
  const destination = `storage/${path}/${entity_id}`;
  
  return destination;
};

const getFileName = async (req: Request, file: Express.Multer.File) => {
  const destination = getDestination(req);
  
  const originalName = file.originalname;
  const fileExtName = extname(originalName);
  const baseName = basename(originalName, fileExtName);
  
  let newFileName = originalName;
  let counter = 1;
  
  try {
    while (await fileExists(`${destination}/${newFileName}`)) {
      const match = baseName.match(/(.*)_(\d+)$/);
      if (match) {
        const namePart = match[1];
        const numberPart = parseInt(match[2], 10);
        newFileName = `${namePart}_${numberPart + counter}${fileExtName}`;
      } else {
        newFileName = `${baseName}_${counter}${fileExtName}`;
      }
      counter++;
    }
  } catch (error) {
    // Handle error if needed
  }
  return newFileName;
};

const fileExists = async (path: string): Promise<boolean> => {
  try {
    await fsPromises.access(path);
    return true;
  } catch {
    return false;
  }
};


/**
 * The diskStorageConf constant is a configuration object for the disk storage engine used by multer.
 * It specifies the destination and filename callbacks to be used for storing uploaded files.
 * 
 * @remarks
 * The `destination` callback determines the directory where the uploaded files will be stored.
 * The `filename` callback determines the name of the uploaded file.
 * 
 * @typedef {import('multer').StorageEngine} StorageEngine
 * 
 * @type {StorageEngine}
 */
export const diskStorageConf = diskStorage({
  destination: getDestinationCallback,
  filename: getFileNameCallback,
});