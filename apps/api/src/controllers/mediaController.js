import { v2 as cloudinary } from "cloudinary";
import env from "../config/env.js";

export async function generateUploadUrl(req, res) {
  try {
    const cloudName = env.CLOUDINARY_CLOUD_NAME;
    const apiKey = env.CLOUDINARY_API_KEY;
    const apiSecret = env.CLOUDINARY_API_SECRET;

    // Check if Cloudinary credentials are fully configured
    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });

      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = {
        timestamp,
        folder: "avatars",
      };

      const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        apiSecret,
      );

      return res.status(200).json({
        success: true,
        signature,
        timestamp,
        apiKey,
        cloudName,
        uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      });
    }

    // Default Fallback: Local Developer Mock Credentials
    const mockTimestamp = Math.round(new Date().getTime() / 1000);
    return res.status(200).json({
      success: true,
      signature: "mock_cloudinary_signature",
      timestamp: mockTimestamp,
      apiKey: "mock_cloudinary_api_key",
      cloudName: "mock_cloudinary_cloud_name",
      uploadUrl: `${env.APP_URL}/v1/media/mock-upload`,
    });
  } catch (error) {
    console.error("Error in generateUploadUrl controller:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate media upload credentials",
    });
  }
}

export async function mockUpload(req, res) {
  try {
    // Generate a random seed for mock avatar generator
    const randomSeed = Math.random().toString(36).substring(7);
    const mockAvatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${randomSeed}`;

    return res.status(200).json({
      success: true,
      secure_url: mockAvatarUrl,
    });
  } catch (error) {
    console.error("Error in mockUpload controller:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to process mock upload",
    });
  }
}
