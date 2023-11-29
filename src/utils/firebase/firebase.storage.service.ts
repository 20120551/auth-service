import { Injectable } from '@nestjs/common';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { FirebaseInstance, IFirebaseStorageService } from '.';
import { isFile } from 'utils/file';

@Injectable()
export class FirebaseStorageService implements IFirebaseStorageService {
  private readonly _storage: any;
  constructor(app: FirebaseInstance) {
    this._storage = getStorage(app);
  }
  async upload(file: ArrayBuffer | Uint8Array, path: string): Promise<void> {
    if (isFile(path)) {
      throw new Error(`The '${path}' must be the path to file`);
    }
    const uploadRef = ref(this._storage, path);
    await uploadBytes(uploadRef, file);
  }
  async get(path: string): Promise<string | undefined> {
    try {
      if (isFile(path)) {
        throw new Error(`The '${path}' must be the path to file`);
      }
      const uploadRef = ref(this._storage, path);
      const url = await getDownloadURL(uploadRef);
      return url;
    } catch (err) {
      return undefined;
    }
  }
  async del(path: string): Promise<boolean> {
    try {
      const uploadRef = ref(this._storage, path);
      await deleteObject(uploadRef);
      return true;
    } catch (err) {
      return false;
    }
  }
}
