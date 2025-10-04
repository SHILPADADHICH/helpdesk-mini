import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../database/models/User";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role = "user" } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        error: {
          code: "FIELD_REQUIRED",
          field: !email ? "email" : !password ? "password" : "name",
          message: `${!email ? "Email" : !password ? "Password" : "Name"} is required`,
        },
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: {
          code: "USER_EXISTS",
          message: "User with this email already exists",
        },
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Registration failed",
      },
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: "FIELD_REQUIRED",
          field: !email ? "email" : "password",
          message: `${!email ? "Email" : "Password"} is required`,
        },
      });
    }

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Login failed",
      },
    });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.status(200).json({
      user: req.user,
      message: "User profile retrieved successfully",
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to retrieve user profile",
      },
    });
  }
};
