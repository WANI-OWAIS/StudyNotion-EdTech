const Profile = require("../models/Profile");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mongoose = require("mongoose");
const { convertSecondsToDuration } = require("../utils/secToDuration");

/* ================= UPDATE PROFILE ================= */
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;

    const id = req.user.id;

    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const profile = await Profile.findById(userDetails.additionalDetails);

    await User.findByIdAndUpdate(id, { firstName, lastName }, { new: true });

    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;

    await profile.save();

    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE ACCOUNT ================= */
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await Profile.findByIdAndDelete(user.additionalDetails);

    for (const courseId of user.courses) {
      await Course.findByIdAndUpdate(courseId, {
        $pull: { studentsEnroled: id },
      });
    }

    await CourseProgress.deleteMany({ userId: id });
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "User deletion failed" });
  }
};

/* ================= GET USER DETAILS ================= */
exports.getAllUserDetails = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id)
      .populate("additionalDetails")
      .exec();

    return res.status(200).json({
      success: true,
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE DISPLAY PICTURE ================= */
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ENROLLED COURSES ================= */
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    let userDetails = await User.findById(userId)
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: { path: "subSection" },
        },
      })
      .exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    userDetails = userDetails.toObject();

    for (const course of userDetails.courses) {
      let totalDurationInSeconds = 0;
      let subSectionLength = 0;

      for (const content of course.courseContent) {
        totalDurationInSeconds += content.subSection.reduce(
          (acc, curr) => acc + Number(curr.timeDuration || 0),
          0
        );
        subSectionLength += content.subSection.length;
      }

      course.totalDuration =
        convertSecondsToDuration(totalDurationInSeconds);

      const courseProgress = await CourseProgress.findOne({
        courseID: course._id,
        userId,
      });

      const completedVideos =
        courseProgress?.completedVideos?.length || 0;

      course.progressPercentage =
        subSectionLength === 0
          ? 100
          : Math.round((completedVideos / subSectionLength) * 10000) / 100;
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= INSTRUCTOR DASHBOARD (FIXED) ================= */
exports.instructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const courses = await Course.find({ instructor: instructorId });

    const dashboardData = courses.map((course) => {
      const studentsCount = Array.isArray(course.studentsEnroled)
        ? course.studentsEnroled.length
        : 0;

      return {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled: studentsCount,
        totalAmountGenerated: studentsCount * (course.price || 0),
      };
    });

    return res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Instructor Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load instructor dashboard",
    });
  }
};
