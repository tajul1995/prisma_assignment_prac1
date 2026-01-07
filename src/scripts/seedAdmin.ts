import { prisma } from "../lib/prisma";
import { UserRole } from "../middleWare/auth";

async function seedAdmin() {
  try {
    const adminData = {
      name: "tajul islam masum3",
      email: "maaumhossain123456@gmail.com",
      role: UserRole.ADMIN,
      password: "tajul1989@"
    };

    const findUser = await prisma.user.findUnique({
      where: { email: adminData.email }
    });

    if (findUser) {
      console.log("⚠️ User already exists, skipping seed");
      return;
    }

    const signUpUser = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin":"http://localhost:4000"
        },
        body: JSON.stringify(adminData)
      }
    );

    const responseData = await signUpUser.json();
    console.log("Signup response:", responseData);

    if (!signUpUser.ok) {
      throw new Error(responseData?.message || "Signup failed");
    }

    await prisma.user.update({
      where: { email: adminData.email },
      data: { emailVerified: true }
    });

    console.log("✅ Admin user created & verified");
  } catch (error) {
    console.error("❌ Seed admin error:", error);
  }
}

seedAdmin();
