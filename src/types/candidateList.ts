import { ChatLogChatType, MsgFeedbackType } from "src/types/apps/chatTypes"

export type candidateListType = {
    id: string
    first_name: string
    last_name: string
    profile_pic: string
    email: string
    phone_number?: string
    whatsapp_number?: string
    joined_at: string
    status: string
    stage: string
    overall_rating: Number
    ratings_count: Number
    ratings: string
    total_rating: Number
    job_deadline: string
    job: string
}


export type CandidateAnswer = {
    id: string;
    video: string;
    takes: number;
    video_length: number;
    created_at: string;
    question: string;
    candidate: string;
};

export type CandidateProfile = {
    id: string;
    first_name: string;
    last_name: string;
    profile_pic: string;
    email: string;
    phone_number: string;
    whatsapp_number: string;
    joined_at: string;
    status: string;
    stage: string;
    overall_rating: number;
    ratings_count: number;
    ratings: string;
    total_rating: number;
    job_deadline: string;
    job: string;
};

export type CandidateData = {
    candidate: CandidateProfile;
    answers: CandidateAnswer[];
};

export type FormattedChatsType = {
    senderId: number
    authorFname: string
    authorLname: string
    authorAvatar: string
    messages: ChatLogChatType[]
  }

export type ReviewLogType = {
    msg: string
    rating: number
    time: string | Date
    feedback: MsgFeedbackType
  }

export type ReviewType = {
    senderId: number
    authorFname: string
    authorLname: string
    authorAvatar: string
    messages: ReviewLogType[]
  }


export type PricingPlanType = {
    title: string
    imgSrc: string
    subtitle: string
    imgWidth?: number
    imgHeight?: number
    currentPlan: boolean
    popularPlan: boolean
    monthlyPrice: number
    planBenefits: string[]
    yearlyPlan: {
      perMonth: number
      totalAnnual: number
    }
  }