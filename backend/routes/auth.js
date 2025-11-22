// Auth routes - login, signup, password reset
import express from "express"
import bcrypt from "bcryptjs"
import prisma from "../lib/db.js"
import { generateToken } from "../lib/auth.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

// Signup - naya user banao
router.post("/signup", async (req, res) => {
  try {
    const { email, password, role, name, phone, dateOfBirth } = req.body

    // Check karo user pehle se hai ya nahi
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Password hash karo
    const hashedPassword = await bcrypt.hash(password, 10)

    // User create karo
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    })

    // Agar patient hai to profile bhi banao
    if (role === "PATIENT") {
      await prisma.patient.create({
        data: {
          userId: user.id,
          name,
          phone,
          dateOfBirth: new Date(dateOfBirth),
          emergencyContact: phone,
        },
      })
    } else if (role === "DOCTOR") {
      await prisma.doctor.create({
        data: {
          userId: user.id,
          name,
          specialization: "",
          qualification: "",
          experience: 0,
          consultationFee: 0,
        },
      })
    }

    const token = generateToken(user.id, user.role)
    res.status(201).json({ user: { id: user.id, email, role }, token })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ error: "Signup failed" })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(404).json({ error: "No account found with this email. Please sign up first." })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password. Please try again." })
    }

    const token = generateToken(user.id, user.role)
    res.json({ user: { id: user.id, email, role: user.role }, token })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Login failed" })
  }
})

// Verify token endpoint
router.get("/verify", authMiddleware, async (req, res) => {
  try {
    // If authMiddleware passes, token is valid
    res.json({ valid: true, userId: req.userId })
  } catch (error) {
    res.status(401).json({ valid: false })
  }
})

router.post("/password-reset", async (req, res) => {
  try {
    const { email, newPassword } = req.body

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    res.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Password reset error:", error)
    res.status(500).json({ error: "Password reset failed" })
  }
})

// Admin routes
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })
    res.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ error: "Failed to fetch users" })
  }
})

router.delete("/users/:id", authMiddleware, async (req, res) => {
  try {
    const userId = Number.parseInt(req.params.id)
    
    // Delete associated patient or doctor profile first
    await prisma.patient.deleteMany({ where: { userId } })
    await prisma.doctor.deleteMany({ where: { userId } })
    
    // Delete user
    await prisma.user.delete({ where: { id: userId } })
    
    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({ error: "Failed to delete user" })
  }
})

export default router
