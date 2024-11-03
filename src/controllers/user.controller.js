import { newUser } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const findUser = await newUser.findOne({
        $or: [{ username }, { email }],
    });

    if (findUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = await newUser.create({
        username,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign(
        { _id: createUser._id, email: createUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    const user = await newUser.findById(createUser._id).select("-password");

    return res.status(201).json({
        user,
        message: "User registered successfully",
        token,
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await newUser.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign(
        { userId: user._id, userEmail: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
        { userId: user._id, userEmail: user.email },
        process.env.JWT_SECRET_REFRESH_TOKEN,
        { expiresIn: "5d" }
    );

    return res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true })
        .cookie("refreshToken", refreshToken, { httpOnly: true })
        .json({ user: { _id: user._id, email: user.email }, message: "User logged in successfully" });
};

const loggedOut = async (req, res) => {
    await newUser.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });
    return res.status(201)
    .clearCookie("accessToken",{httpOnly:true,secure:true})
    .clearCookie("refreshToken",{httpOnly:true,secure:true} )
    .json({ message: "User logged out" });

};


const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Log incoming request body for debugging
        console.log(req.body);

        // Validate input
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Both old and new passwords are required." });
        }

        // Fetch the user from the database
        const user = await newUser.findById(req.user?._id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Compare the old password with the stored hashed password
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        
        if (!passwordMatch) {
            return res.status(400).json({ message: "Old password does not match" });
        }

        // Hash the new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getData = async (req, res) => {
    try {
        // Ensure you're sending the message along with the user data
        return res.status(200).json({
            user: req.user,
            message: "User fetched successfully"
        });
    } catch (error) {
        console.error("getData Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateAccountDetails = async(req,res)=>{
    try {
        const {username} = req.body

        if(!username){
            return res.status(400).json({message: "Username is required."})
        }

        const user = await newUser.findByIdAndUpdate(
            req.user?.id,
            {
                $set :{
                    username: username
                }
            },
            {new: true}
        ).select(" -password")
        res.status(200)
        .json({message:"Account details updated successfully",user:user})
    } catch (error) {
        res.status(500).json({mesaage:"Account details not updated successfully"})
    }
}






export { registerUser, login, loggedOut,changePassword,getData,updateAccountDetails };
