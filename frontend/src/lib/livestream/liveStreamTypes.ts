export type pastLiveStreamTypes = {
    uid: string;
    creator: string;
    thumbnail: string;
    thumbnailTimestampPct: number;
    readyToStream: boolean;
    readyToStreamAt: string;
    status: {
      state: string;
      pctComplete: string;
      errorReasonCode: string;
      errorReasonText: string;
    };
    meta: {
      name: string;
    };
    created: string;
    modified: string;
    scheduledDeletion: unknown;
    size: number;
    preview: string;
    allowedOrigins: string[];
    requireSignedURLs: boolean;
    uploaded: string;
    uploadExpiry: unknown;
    maxSizeBytes: number | null;
    maxDurationSeconds: number | null;
    duration: number;
    input: {
      width: number;
      height: number;
    };
    playback: {
      hls: string;
      dash: string;
    };
    watermark: unknown;
    liveInput: string;
    clippedFrom: unknown;
    publicDetails: {
      title: string | null;
      share_link: string | null;
      channel_link: string | null;
      logo: string | null;
    };
  }[];
  
  export type streamState = {
    created: string;
    deleteRecordingAfterDays: number;
    meta: {
      name: string;
      description: string;
      fullName: string;
      username: string;
    };
    modified: string;
    uid: string;
  }[];