import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "../../App.css";
// Icons
import { FaStar } from "react-icons/fa";
// Import required modules
import { Autoplay, FreeMode, Pagination } from "swiper";

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiconnector";
import { ratingsEndpoints } from "../../services/apis";

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 15;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API,
        );
        if (data?.success) {
          setReviews(data?.data);
        }
      } catch (error) {
        console.log("Could not fetch reviews.", error);
      }
    })();
  }, []);

  // console.log(reviews)

  return (
    <div className="text-white w-full px-4 sm:px-0">
      <div className="my-[50px] w-full max-w-maxContentTab lg:max-w-maxContent mx-auto">
        {reviews.length === 0 ? (
          <p className="text-center text-richblack-300">No Reviews yet</p>
        ) : (
          <Swiper
            slidesPerView={1}
            spaceBetween={16}
            loop={true}
            freeMode={false}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              480: { slidesPerView: 1.2, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            modules={[FreeMode, Pagination, Autoplay]}
            className="w-full"
          >
            {reviews.map((review, i) => {
              return (
                <SwiperSlide key={i}>
                  <div className="flex flex-col gap-3 sm:gap-4 bg-richblack-800 rounded-xl p-4 sm:p-5 text-[14px] text-richblack-25 border border-richblack-700 hover:border-richblack-600 transition-all duration-300 shadow-lg h-[200px] sm:h-[220px]">
                    {/* User Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={
                          review?.user?.image
                            ? review?.user?.image
                            : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                        }
                        alt=""
                        className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover ring-2 ring-richblack-600 flex-shrink-0"
                      />
                      <div className="flex flex-col overflow-hidden min-w-0">
                        <h1 className="font-semibold text-richblack-5 text-[14px] sm:text-[15px] truncate">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                        <h2 className="text-[11px] sm:text-[12px] font-medium text-richblack-400 truncate">
                          {review?.course?.courseName}
                        </h2>
                      </div>
                    </div>
                    {/* Review Text */}
                    <p className="font-medium text-richblack-25 leading-relaxed flex-grow text-[12px] sm:text-[13px]">
                      {review?.review.split(" ").length > truncateWords
                        ? `${review?.review
                            .split(" ")
                            .slice(0, truncateWords)
                            .join(" ")} ...`
                        : `${review?.review}`}
                    </p>
                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-auto">
                      <h3 className="font-bold text-yellow-50 text-[15px]">
                        {review.rating.toFixed(1)}
                      </h3>
                      <ReactStars
                        count={5}
                        value={review.rating}
                        size={18}
                        edit={false}
                        activeColor="#ffd700"
                        emptyIcon={<FaStar />}
                        fullIcon={<FaStar />}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </div>
  );
}

export default ReviewSlider;
