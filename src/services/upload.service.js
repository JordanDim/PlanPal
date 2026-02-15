import { UploadClient } from "@uploadcare/upload-client";
import { restrictDemoUser } from "../common/helpers/demoUserRestriction";

const uploadClient = new UploadClient({
  publicKey: import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY,
});

const getCustomCdnUrl = (uuid, filename) => {
  return `https://1k9gq2zpdb.ucarecd.net/${uuid}/${filename}`;
};

export const uploadAvatar = async (userId, file) => {
  try {
    restrictDemoUser("upload avatars");
  } catch (error) {
    if (error?.isDemoUserRestriction) {
      throw error;
    }
  }

  try {
    const result = await uploadClient.uploadFile(file, {
      fileName: `avatar${userId}`,
      store: "auto",
    });
    return getCustomCdnUrl(result.uuid, `avatar${userId}`);
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

export const uploadCover = async (eventId, file) => {
  try {
    restrictDemoUser("upload event covers");
  } catch (error) {
    if (error?.isDemoUserRestriction) {
      throw error;
    }
  }

  try {
    const result = await uploadClient.uploadFile(file, {
      fileName: `cover${eventId}`,
      store: "auto",
    });
    return getCustomCdnUrl(result.uuid, `cover${eventId}`);
  } catch (error) {
    console.error("Error uploading cover:", error);
    throw error;
  }
};
