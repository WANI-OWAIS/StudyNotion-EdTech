import React, { useEffect, useState } from "react";
import RatingStars from "../../common/RatingStars";
import GetAvgRating from "../../../utils/avgRating";
import { Link } from "react-router-dom";

const Course_Card = ({ course, Height }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews);
    setAvgReviewCount(count);
  }, [course]);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <Link to={`/courses/${course._id}`}>
        <div className="px-4 mx-2">
          <div className="rounded-lg overflow-hidden bg-richblack-700">
            {!imageError && course?.thumbnail ? (
              <img
                src={course?.thumbnail}
                alt="course thumbnail"
                onError={handleImageError}
                className={`w-full rounded-xl object-cover max-md:h-48 ${Height}`}
              />
            ) : (
              <div
                className={`w-full rounded-xl bg-richblack-600 flex items-center justify-center max-md:h-48 ${Height}`}
              >
                <p className="text-richblack-300 text-sm">
                  Image not available
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 py-3">
            <p className="text-xl text-richblack-5">{course?.courseName}</p>
            <p className="text-sm text-richblack-50">
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Course_Card;
