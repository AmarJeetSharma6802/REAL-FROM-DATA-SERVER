import { newUser } from "../model/user.model.js"; // Ensure this is correct
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const registerUser = async (req, res) => {
    const { username, email, password } = req.body; // Corrected order

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const findUser = await newUser.findOne({
        $or: [{ username }, { email }]
    });

    if (findUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const createUser = await newUser.create({
        username,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign({ _id: createUser._id, email: createUser.email }, "mySecretNameBye", { expiresIn: "1d" });

    const user = await newUser.findById(createUser._id).select("-password");

    if (!user) {
        return res.status(500).json({ message: "Something went wrong while registering the user" });
    }

    return res.status(201).json({ createUser, message: "User registered successfully", "token":token, });
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

    // Create access token
    const token = jwt.sign(
        {
            userEmail: user.email,
            userId: user._id
        },
        "mysecrectShername",
        { expiresIn: "1d" }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
        {
            userEmail: user.email, 
            userId: user._id       
        },
        "mysecrectShername",
        { expiresIn: "5d" }
    );

    // Optionally, you can save the refresh token in the user's document
    // user.refreshToken = refreshToken;
    // await user.save();

    const loggedInUser = await newUser.findById(user._id).select("-password -refreshToken");

    return res.status(201)
        .cookie("token", token)
        .cookie("refreshToken", refreshToken)
        .json({ newUser: loggedInUser, message: "User logged In Successfully" });
};

const logggedOut = async(req,res)=>{
    
}

export { 
    registerUser,
    login

 };
