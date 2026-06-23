import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

function getRoleLabel(role: string) {
  if (role === "admin") return "Admin Dashboard";
  if (role === "manager") return "Manager Dashboard";
  return "Employee Dashboard";
}

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ roles: [] });
  }

  const users = await prisma.user.findMany({
    where: { email },
    select: {
      id: true,
      role: true,
      password: true,
    },
  });

  const roles = [];

  for (const user of users) {
    if (await bcrypt.compare(password, user.password)) {
      roles.push({
        role: user.role,
        label: getRoleLabel(user.role),
      });
    }
  }

  return NextResponse.json({ roles });
}
