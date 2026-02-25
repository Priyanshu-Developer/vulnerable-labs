import crypto from "crypto";

const flagStore = new Map<string, string>();

export function generateRandomFlag(labID: string) {
  const randomPart = crypto.randomBytes(4).toString("hex");
  return `FLAG-${labID}-${randomPart}`;
}

export function saveFlag(labID: string) {
  const flag = generateRandomFlag(labID);
  flagStore.set(labID, flag);
  return flag; // return so you can send/store it
}

export function getFlag(labID: string) {
  return flagStore.get(labID);
}

export function deleteFlag(labID: string) {
  flagStore.delete(labID);
}
