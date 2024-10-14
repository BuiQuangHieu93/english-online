"use client";

import { vocabularies } from "@/constant";
import { Topic, VocabularyItem, VocabularyItemReturnList } from "@/types/type";
import { useParams } from "next/navigation";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useEffect, useState } from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const TopicComponent = () => {
  const params = useParams();
  const topic = decodeURIComponent(params.topic as string);
  const [transcript, setTranscript] = useState("");
  const [ipa, setIpa] = useState("");
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [vocabularyReturn, setVocabularyReturn] =
    useState<VocabularyItemReturnList>();

  let recognition: SpeechRecognition | null = null;

  const initRecognition = () => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        handleConvert(speechResult);
      };

      recognition.onerror = (event: Event) => {
        const error = event as SpeechRecognitionError;
        console.error("Speech recognition error:", error.error);
        stopRecognition(); // Stop recognition in case of error
      };

      recognition.onend = () => {
        setIsRecognizing(false); // Update state when recognition ends
      };
    }
  };

  const startRecognition = () => {
    if (!isRecognizing) {
      initRecognition(); // Re-initialize recognition each time
      if (recognition) {
        recognition.start();
        setIsRecognizing(true);
      }
    }
  };

  const stopRecognition = () => {
    if (recognition) {
      recognition.stop();
      setIsRecognizing(false);
    }
  };

  const handleConvert = async (text: string) => {
    try {
      const response = await fetch(
        "https://english-online-backend.vercel.app/convert-to-ipa",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({ transcript: text }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIpa(data.ipa);
      } else {
        console.error("Failed to convert text to IPA.");
      }
    } catch (error) {
      console.error("Error fetching IPA transcription:", error);
    }
  };

  const getTopicData = (topicName: string): Topic | undefined => {
    return vocabularies.find((vocab) => vocab.topic === topicName);
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const topicData = getTopicData(topic);
  console.log(topicData?.vocabulary);

  const handleConvertWords = async (vocabularies: VocabularyItem[]) => {
    try {
      const response = await fetch(
        "https://english-online-backend.vercel.app/convert-vocabularies-to-ipa",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({ vocabulary: vocabularies }),
        }
      );

      if (response.ok) {
        const data: VocabularyItemReturnList = await response.json();
        setVocabularyReturn(data);
        console.log(data);
      } else {
        console.error("Failed to fetch vocabulary IPA conversion.");
      }
    } catch (error) {
      console.error("Error fetching vocabulary IPA conversion:", error);
    }
  };

  useEffect(() => {
    if (topicData?.vocabulary) {
      handleConvertWords(topicData.vocabulary);
    }
  }, [topicData?.vocabulary]);

  return (
    <div className="p-4 sm:p-10 md:p-20 w-full flex items-center justify-center min-h-screen flex-col">
      {vocabularyReturn ? (
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          slidesPerView={1}
          spaceBetween={30}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          loop={vocabularyReturn.vocabulary.length > 1}
          className="w-full"
        >
          {vocabularyReturn.vocabulary.map((item, index) => (
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
                    <Image src="/icons/speaker.svg" fill alt="speaker" />
                  </button>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mt-1 italic">
                  {item.ipa}
                </p>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {item.vietnamese}
                </p>
                <div className="flex items-center justify-center mt-2 pb-12 translate-x-4 flex-col">
                  <p className="text-sm sm:text-md text-gray-500">
                    {item.sentence}
                  </p>
                  <p className="text-sm sm:text-md text-gray-500 italic">
                    {item.sentence_to_ipa}
                  </p>
                  <button
                    className="ml-2 sm:ml-4 w-6 sm:w-8 h-6 sm:h-8 relative"
                    onClick={() => speakText(item.sentence)}
                  >
                    <Image src="/icons/speaker.svg" fill alt="speaker" />
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div>Topic not found</div>
      )}

      <div className="mt-4 sm:mt-6 flex flex-col">
        <button
          onClick={startRecognition}
          className={`px-3 py-2 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
            isRecognizing ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isRecognizing}
        >
          {isRecognizing ? "Recognizing..." : "Start Voice Recognition"}
        </button>
        <button
          onClick={stopRecognition}
          className="sm:px-4 py-2 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-4 w-full"
          disabled={!isRecognizing}
        >
          Stop Voice Recognition
        </button>
        <div className="mt-2 sm:mt-4">
          <p className="font-bold">Transcript:</p>
          <p className="text-sm sm:text-base text-gray-700">{transcript}</p>
        </div>
        {ipa && (
          <div className="mt-2 sm:mt-4">
            <p className="font-bold">IPA Transcription:</p>
            <p className="text-sm sm:text-base text-gray-700">{ipa}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicComponent;
