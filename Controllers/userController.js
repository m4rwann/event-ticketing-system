const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const userController = {
    register: async (req, res) => {
        try {
            const { email, password, name, role, age } = req.body;

            // Check if the user already exists
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: "User already exists" });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const newUser = new userModel({
                email,
                password: hashedPassword,
                name,
                role,
                age,
            });

            // Save the user to the database
            await newUser.save();

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ message: "Server error" });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find the user by email
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "email not found" });
            }

            console.log("password: ", user.password);
            // Check if the password is correct

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(405).json({ message: "incorect password" });
            }

            const currentDateTime = new Date();
            const expiresAt = new Date(+currentDateTime + 1800000); // expire in 3 minutes
            // Generate a JWT token
            const token = jwt.sign(
                { user: { userId: user._id, role: user.role } },
                secretKey,
                {
                    expiresIn: 3 * 60 * 60,
                }
            );

            return res
                .cookie("token", token, {
                    expires: expiresAt,
                    httpOnly: true,
                    secure: true, // if not working on thunder client , remove it
                    SameSite: "none",
                })
                .status(200)
                .json({ message: "login successfully", user });
        } catch (error) {
            console.error("Error logging in:", error);
            res.status(500).json({ message: "Server error" });
        }
    },
};

module.exports = userController;