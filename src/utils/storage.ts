import { ImmortalDB } from 'immortal-db';

export const storage = {
  set: (key: string, value: string) => ImmortalDB.set(key, value),
  get: (key: string, defaultValue: string | null = null) =>
    ImmortalDB.get(key, defaultValue as string),
  remove: (key: string) => ImmortalDB.remove(key),
};
