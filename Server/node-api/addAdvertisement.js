import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:5000";

// CONFIGURE THESE VALUES
const ADMIN_EMAIL = "admin@example.com";  
const ADMIN_PASSWORD = "your_password";  
const AD_IMAGE_PATH = "./test-ad.jpg";     
const AD_LINK = "https://example.com"; 
const AD_ORDER = 1;                

async function addAdvertisement() {
  try {
    console.log("🔐 Logging in as admin...");
    const loginResponse = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });
    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.error("❌ Login failed:", loginData.message);
      return;
    }

    const token = loginData.token;
    console.log("✅ Login successful!");

    console.log("\n📤 Uploading advertisement...");
    
    const formData = new FormData();
    formData.append("link", AD_LINK);
    formData.append("order", AD_ORDER);
    formData.append("image", fs.createReadStream(AD_IMAGE_PATH));

    const uploadResponse = await fetch(`${BASE_URL}/api/advertisements/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const uploadData = await uploadResponse.json();

    if (uploadData.success) {
      console.log("✅ Advertisement created successfully!");
      console.log("\n📊 Advertisement Details:");
      console.log("   ID:", uploadData.data._id);
      console.log("   Link:", uploadData.data.link);
      console.log("   Image:", uploadData.data.imageUrl);
      console.log("   Order:", uploadData.data.order);
      console.log("   Active:", uploadData.data.isActive);
    } else {
      console.error("❌ Upload failed:", uploadData.message);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

addAdvertisement();