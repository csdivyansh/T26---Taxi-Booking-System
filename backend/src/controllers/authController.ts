import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import {
  signupValidation,
  signinValidation,
} from "../validations/authValidation";

interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "rider" | "driver";
}

interface SigninRequest {
  email: string;
  password: string;
}

const generateToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "your_secret_key",
    { expiresIn: "7d" }
  );
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { error, value } = signupValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, firstName, lastName, phone, role }: SignupRequest =
      value;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Create new user
    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    // Return user data without password
    const userResponse = {
      id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      role: newUser.role,
      isVerified: newUser.isVerified,
    };

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "An error occurred during signup" });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { error, value } = signinValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password }: SigninRequest = value;

    // Find user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user);

    // Return user data without password
    const userResponse = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
    };

    res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "An error occurred during signin" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userResponse = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      profilePicture: user.profilePicture,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    res.status(200).json(userResponse);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "An error occurred while fetching profile" });
  }
};
