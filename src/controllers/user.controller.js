import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ ValidationBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //get userDetails from req.body
    // validate userDetails
    // get userAvatar and UserCoverImage
    // check if user already exists
    // check image upload correctly
    // create user object - create object in db
    // remove password and refresh token field from response
    // check user creation
    // return res

    const { name, email, password } = req.body || {}

    if ([name, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All Field Are Required")
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!existingUser) {
        throw new ApiError(409, "User with this email or username already exists!")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar files is required")
    }

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar not uploaded")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password  -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const LoginUser = asyncHandler(async (req, res) => {
    // extract user details from req.body
    // validate users details
    // if details wrong send error
    // check email or password 
    // check correct or not 
    // if right send res

    const { email, name, password } = req.body

    if (!email || !name) {
        throw new ApiError(400, " invalid! email & name") // send error for wrong email
    }

    if (!password) {
        throw new ApiError(400, "password can not be blank!")
    }

    const user = await User.findOne({
        $or: [{ name }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User not exists!")
    }

    const isPasswordValid = await User.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "invalid credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    // login the user

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // options for save cookies in user local storage

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "user logged in successfully"
            )
        )

})

export {
    registerUser,
    LoginUser
}