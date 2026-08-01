import { Inngest } from "inngest";

// Define the shape of our events
type Events = {
  "campaign.process": {
    data: {
      campaignId: string;
    };
  };
};

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: "crawlia"
});
