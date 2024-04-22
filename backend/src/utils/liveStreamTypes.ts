export type LiveInput = {
    created: string;
    deleteRecordingAfterDays: number;
    meta: {
      name: string,
      description: string
    };
    modified: string;
    uid: string;
}


export type liveStreamData = {
  name: string;
  description: string;
};


export type cloudflareResponse = {
        errors: any[]; // Array of errors, assuming they can be of any type
        messages: any[]; // Array of messages, assuming they can be of any type
        result: {
          created: string; // Date string in ISO 8601 format
          deleteRecordingAfterDays: number;
          meta: {
            name: string;
          };
          modified: string; // Date string in ISO 8601 format
          recording: {
            mode: string; // Assuming mode can be any string value
            requireSignedURLs: boolean;
            timeoutSeconds: number;
          };
          rtmps: {
            streamKey: string;
            url: string;
          };
          rtmpsPlayback: {
            streamKey: string;
            url: string;
          };
          srt: {
            passphrase: string;
            streamId: string;
            url: string;
          };
          srtPlayback: {
            passphrase: string;
            streamId: string;
            url: string;
          };
          status: any; // Assuming status can be any type
          uid: string;
          webRTC: {
            url: string;
          };
          webRTCPlayback: {
            url: string;
          };
        };
        success: boolean;
      
      
}



export type pastLiveStreamTypes = {
  uid: string;
  creator: any; // You can replace 'any' with a more specific type if available
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
  scheduledDeletion: any; // You can replace 'any' with a more specific type if available
  size: number;
  preview: string;
  allowedOrigins: string[];
  requireSignedURLs: boolean;
  uploaded: string;
  uploadExpiry: any; // You can replace 'any' with a more specific type if available
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
  watermark: any; // You can replace 'any' with a more specific type if available
  liveInput: string;
  clippedFrom: any; // You can replace 'any' with a more specific type if available
  publicDetails: {
    title: string | null;
    share_link: string | null;
    channel_link: string | null;
    logo: string | null;
  };
}

export type pastLiveStreamApiResponse = {
  result: pastLiveStreamTypes[];
  success: boolean;
  errors: any[]; 
  messages: any[]; 

}


export type editVideoTypes = {
  result: {
    uid: string;
  creator: any; // You can replace 'any' with a more specific type if available
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
  scheduledDeletion: any; // You can replace 'any' with a more specific type if available
  size: number;
  preview: string;
  allowedOrigins: string[];
  requireSignedURLs: boolean;
  uploaded: string;
  uploadExpiry: any; // You can replace 'any' with a more specific type if available
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
  watermark: any; // You can replace 'any' with a more specific type if available
  liveInput: string;
  clippedFrom: any; // You can replace 'any' with a more specific type if available
  publicDetails: {
    title: string | null;
    share_link: string | null;
    channel_link: string | null;
    logo: string | null;
  };
  }
  success: boolean;
  errors: any[]; 
  messages: any[]; 
}