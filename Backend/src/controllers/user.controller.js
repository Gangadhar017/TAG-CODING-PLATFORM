// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import {User} from "../models/user.model.js"
// import {uploadOnCloudinary} from '../utils/cloudinary.js'
// import { ApiResponse } from "../utils/ApiResponse.js";
// import jwt from 'jsonwebtoken';

// const generateAccessAndRefreshTokens = async(userId)=>{
//     try {
//         const user=await User.findById(userId);
//         const accessToken=user.generateAccessToken();
//         const refreshToken=user.generateRefreshToken();
//         user.refreshToken=refreshToken;
//         await user.save({validateBeforeSave:false});
//         return {accessToken,refreshToken};
//     } catch (error) {
//         throw new ApiError(500,"Something went Wrong in generating tokens");
//     }
// };

// const registerUser= asyncHandler( async (req,res)=>{
//     const {username,fullname,email,password}=req.body;
//     const existedUser=await User.findOne({
//         $or:[{username},{email}]
//     });
//     if(existedUser)return res.status(400).json(new ApiResponse(400,null,"User already exists"));
//     const user=await User.create({fullname,email,password,username,avatar:'https://res.cloudinary.com/dyyta5lri/image/upload/v1724514263/defaultuser_l0d3kk.png'});
//     const createUser= await User.findById(user._id).select("-password -refreshToken");
//     if(!createUser)return res.status(400).json(new ApiResponse(400,null,"Server Error"));
//     return res.status(200).json(new ApiResponse(200,createUser,"Registered Successfully"))
// });

// const loginUser= asyncHandler(async(req,res)=>{
//     const {email,password}=req.body;
//     const user=await User.findOne({email});
//     //vaildation
//     if(!user)return res.status(400).json(new ApiResponse(400,null,"Invalid Email"));
//     const isPasswordValid=await user.isPasswordCorrect(password);
//     if(!isPasswordValid)res.status(400).json(new ApiResponse(400,null,"Invalid password"));
    
//     //token generation
//     const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);
//     const loggedInUser=await User.findById(user._id).select("-password -refreshToken");
    
//     const options={
//         httpOnly:true,          
//         secure:true ,            
//         sameSite:'strict'
//     }

//     return res
//     .status(200)
//     .cookie("accessToken",accessToken,options)
//     .cookie("refreshToken",refreshToken,options)
//     .json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"USER LOGGED IN SUCCESSFULLY"))
// });

// const logoutUser= asyncHandler(async(req,res)=>{
//     await User.findByIdAndUpdate(
//         req.user._id,
//         {
//             $unset: {
//                 refreshToken:1
//             }
//         },
//         {new : true}
//     )

//     const options={
//         httpOnly:true,          
//         secure:true ,       
//         sameSite:'strict'
//     }

//     return res
//     .status(200)
//     .clearCookie("accessToken",options)
//     .clearCookie("refreshToken",options)
//     .json(new ApiResponse(200,{},"User Logged Out Successfully"))
// });

// const refreshAccessToken=asyncHandler(async(req,res)=>{
//     try {
//         const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken;
//         if(!incomingRefreshToken)return res.status(400).json(new ApiResponse(400, null, "Refresh token is missing"));
//         const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
//         const user=await User.findById(decodedToken?._id);
//         if(!user || incomingRefreshToken!==user?.refreshToken)
//         {   
//             return res.status(401).json(new ApiResponse(401, null, "Invalid or expired refresh token"));
//         }
//         const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);
//         const options={
//             httpOnly:true,          
//             secure:true ,         
//             sameSite: 'Strict'
//         }
//         return res.status(200)
//         .cookie("accessToken",accessToken,options)
//         .cookie("refreshToken",refreshToken,options)
//         .json(new ApiResponse(200,{accessToken,refreshToken},"ACCESS TOKEN REFRESHED SUCCESSFULLY"))
//     } catch (error) {
//         return res.status(404).json(new ApiResponse(401,{},"plz logout"));
//     }
// });

// const getCurrentUser = asyncHandler(async (req, res) => {
//     if (!req.user) return res.status(400).json(new ApiResponse(400, null, "User not authenticated"));

//     const curruser = await User.aggregate([
//         {
//             $match: {
//                 username: req.user.username
//             }
//         },
//         {
//             $lookup: {
//                 from: 'submissions',
//                 localField: '_id',
//                 foreignField: 'madeBy',
//                 as: 'mySubmissions',
//                 pipeline: [
//                     {
//                         $match: {
//                             status: true
//                         }
//                     },
//                     {
//                         $lookup: {
//                             from: 'problems',
//                             localField: 'problem',
//                             foreignField: '_id',
//                             as: 'problemDetails',
//                             pipeline: [
//                                 {
//                                     $project: {
//                                         difficulty: 1
//                                     }
//                                 }
//                             ]
//                         }
//                     },
//                     {
//                         $addFields: {
//                             difficulty: {
//                                 $first: "$problemDetails.difficulty"
//                             }
//                         }
//                     },
//                     {
//                         $group: {
//                             _id: "$problem",
//                             submissions: { $push: "$$ROOT" }
//                         }
//                     },
//                     {
//                         $lookup: {
//                             from: 'problems',
//                             localField: '_id',
//                             foreignField: '_id',
//                             as: 'problemDetails'
//                         }
//                     },
//                     {
//                         $unwind: "$problemDetails"
//                     },
//                     {
//                         $addFields: {
//                             difficulty: "$problemDetails.difficulty"
//                         }
//                     }
//                 ]
//             }
//         },
//         {
//             $lookup: {
//                 from: 'tweets',
//                 localField: '_id',
//                 foreignField: 'owner',
//                 as: 'mytweets',
//             }
//         },
//         {
//             $addFields: {
//                 easyCount: {
//                     $size: {
//                         $filter: {
//                             input: "$mySubmissions",
//                             as: "submission",
//                             cond: { $eq: ["$$submission.difficulty", "easy"] }
//                         }
//                     }
//                 },
//                 mediumCount: {
//                     $size: {
//                         $filter: {
//                             input: "$mySubmissions",
//                             as: "submission",
//                             cond: { $eq: ["$$submission.difficulty", "medium"] }
//                         }
//                     }
//                 },
//                 hardCount: {
//                     $size: {
//                         $filter: {
//                             input: "$mySubmissions",
//                             as: "submission",
//                             cond: { $eq: ["$$submission.difficulty", "hard"] }
//                         }
//                     }
//                 }
//             }
//         }
//     ]);

//     if (curruser?.length == 0) return res.status(400).json(new ApiResponse(400, {}, "User Does Not exist"));

//     return res.status(200).json(new ApiResponse(200, curruser[0], "User Fetched Successfully"));
// });


// const updateAvatar =asyncHandler(async(req,res)=>{
//     const avatarLocalPath=req.file?.path;
//     const avatar=await uploadOnCloudinary(avatarLocalPath);
//     const user=await User.findByIdAndUpdate(req.user._id,
//         {
//             $set:{
//                 avatar:avatar.url
//             }
//         },
//         {new:true}
//     ).select("-password");
//     return res.status(200).json(new ApiResponse(200,user,"Avatar updated Successfully"));
// });

// const setdefaultlang = asyncHandler(async (req, res) => {
//     if (!req.user)return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
//     const {lang}=req.params;
//     try {
//         const newuser = await User.findByIdAndUpdate(req.user._id,
//             {
//                 default_language: lang
//             },
//             {new:true});
//         if (!newuser)return res.status(500).json(new ApiResponse(500, null, "Server error"));
//         return res.status(200).json(new ApiResponse(200, newuser, "Default language updated"));
//     } catch (error) {
//         return res.status(500).json(new ApiResponse(500, null, "Server error"));
//     }
//     });

// const settemplate = asyncHandler(async (req, res) => {
//     const user = req.user;
//     if (!user) return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
//     const {lang}=req.params;
//     const {code} = req.body;
//     try {
//         const newuser = await User.findByIdAndUpdate(req.user._id, 
//             {
//                 $set: {
//                     [`template.${lang}`]: code
//                 }
//             }
//         , { new: true });
//         if (!newuser) return res.status(500).json(new ApiResponse(500, null, "Server error"));
//         return res.status(200).json(new ApiResponse(200, newuser, "Template updated"));
//     } catch (error) {
//         return res.status(500).json(new ApiResponse(500, null, "Server error"));
//     }
// });

// const gettemplateandlang = asyncHandler(async (req, res) => {
//     const user = req.user;
//     if (!user) return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
//     try {
//         const data = await User.findById(req.user?._id).select("template default_language");
//         if (!data) return res.status(500).json(new ApiResponse(500, null, "Server error"));
//         return res.status(200).json(new ApiResponse(200, data, "Template and Language fetched"));
//     } catch (error) {
//         return res.status(500).json(new ApiResponse(500, null, "Server error"));
//     }
// });

// export {registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUser,updateAvatar,setdefaultlang,settemplate,gettemplateandlang};
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// 🔐 Generate JWT Tokens (Access + Refresh)
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error generating tokens:', error);
    throw new ApiError(500, 'Something went wrong in generating tokens');
  }
};


// 🧾 Register
export const registerUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User already exists"));
  }

  const user = await User.create({
    fullname,
    email,
    password,
    username,
    avatar:
      "https://res.cloudinary.com/dyyta5lri/image/upload/v1724514263/defaultuser_l0d3kk.png",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "Registered Successfully"));
});

// 🔑 Login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json(new ApiResponse(400, null, "Invalid Email"));

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid)
    return res.status(400).json(new ApiResponse(400, null, "Invalid Password"));

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Cookie options (secure false for localhost)
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In Successfully"
      )
    );
});

// 🚪 Logout
export const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));

  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

// 🔁 Refresh Access Token
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken)
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Refresh token is missing"));

  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded?._id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid or expired refresh token"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access Token Refreshed Successfully"
        )
      );
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Please login again"));
  }
});

// 👤 Get Current User
export const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user)
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User not authenticated"));

  const currUser = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!currUser)
    return res
      .status(404)
      .json(new ApiResponse(404, null, "User does not exist"));

  return res
    .status(200)
    .json(new ApiResponse(200, currUser, "User fetched successfully"));
});

// 🖼️ Update Avatar
export const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath)
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Avatar file missing"));

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

// 🧠 Language + Template Handling
export const setdefaultlang = asyncHandler(async (req, res) => {
  const { lang } = req.params;
  const newUser = await User.findByIdAndUpdate(
    req.user._id,
    { default_language: lang },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, newUser, "Default language updated"));
});

export const settemplate = asyncHandler(async (req, res) => {
  const { lang } = req.params;
  const { code } = req.body;
  const newUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { [`template.${lang}`]: code } },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, newUser, "Template updated"));
});

export const gettemplateandlang = asyncHandler(async (req, res) => {
  const data = await User.findById(req.user._id).select(
    "template default_language"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Template and Language fetched"));
});
