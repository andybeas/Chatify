import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,  // Store the hashed password
            gender,
            profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
        });

        await newUser.save();

        // Generate JWT token here
        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
        });
    } catch (error) {
        console.log("Error signing up", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};





export const login = async(req,res) => {
    try {
        const { username, password } = req.body;

        // Log the username and password received
        console.log("Username:", username);
        console.log("Password:", password);

        const user = await User.findOne({ username });

        // Log the user found
        console.log("User found:", user);

        if (!user) {
            console.log("No user found with that username");
            return res.status(400).json({ error: "Invalid username" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        // Log the password comparison result
        console.log("User's stored password:", user.password);
        console.log("Password from request:", password);
        console.log("Password match:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            console.log("Password does not match");
            return res.status(400).json({ error: "Invalid password" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
    console.log("You have logged in!");
}


export const logout = (req,res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "You have logged out!"});
    } catch (error) {
        console.error("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
