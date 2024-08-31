"use client";

import { vocabularies } from "@/constant";
import { Topic } from "@/types/type";
import { useParams } from "next/navigation";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useState } from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const TopicComponent = () => {
  const params = useParams();
  const topic = params.topic as string;

  // Function to find a topic by name
  const getTopicData = (topicName: string): Topic | undefined => {
    return vocabularies.find((vocab) => vocab.topic === topicName);
  };

  // Call the function and store the result
  const topicData = getTopicData(topic);

  // Function to speak text
  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // Set language
    window.speechSynthesis.speak(utterance);
  };

  const [transcript, setTranscript] = useState("");

  const startRecognition = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
    };

    recognition.onerror = (event: Event) => {
      const error = event as SpeechRecognitionError;
      console.error("Speech recognition error:", error.error);
    };

    recognition.start();
  };

  const stopRecognition = () => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      recognition.stop();
    }
  };

  return (
    <div className="p-4 sm:p-10 md:p-20 w-full flex items-center justify-center min-h-screen">
      {topicData ? (
        <div className="text-center w-full max-w-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl pb-3 sm:pb-12">
            {topicData.topic}
          </h1>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={1}
            spaceBetween={30}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log("slide change")}
            className="w-full"
            loop
          >
            {topicData.vocabulary.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white shadow-lg rounded-lg p-4 text-center min-h-40 border border-gray-200">
                  <div className="flex items-center justify-center translate-x-4">
                    <strong className="text-lg sm:text-xl font-semibold text-gray-800">
                      {item.english}
                    </strong>
                    <button
                      className="ml-2 sm:ml-4 w-6 sm:w-8 h-6 sm:h-8 relative"
                      onClick={() => speakText(item.english)}
                    >
                      <Image
                        src="/icons/speaker.svg"
                        layout="fill"
                        alt="speaker"
                      />
                    </button>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mt-1 italic">
                    {item.ipa}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    {item.vietnamese}
                  </p>
                  <div className="flex items-center justify-center mt-2 pb-12 translate-x-4">
                    <p className="text-sm sm:text-md text-gray-500">
                      {item.sentence}
                    </p>
                    <button
                      className="ml-2 sm:ml-4 w-6 sm:w-8 h-6 sm:h-8 relative"
                      onClick={() => speakText(item.sentence)}
                    >
                      <Image
                        src="/icons/speaker.svg"
                        layout="fill"
                        alt="speaker"
                      />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="mt-4 sm:mt-6 flex flex-col">
            <button
              onClick={startRecognition}
              className="px-3 py-2 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Start Voice Recognition
            </button>
            <button
              onClick={stopRecognition}
              className="sm:px-4 py-2 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-4 w-full"
            >
              Stop Voice Recognition
            </button>
            <div className="mt-2 sm:mt-4">
              <p className="font-bold">Transcript:</p>
              <p className="text-sm sm:text-base text-gray-700">{transcript}</p>
            </div>
          </div>
        </div>
      ) : (
        <div>Topic not found</div>
      )}
    </div>
  );
};

export default TopicComponent;
