export const log = {
  successDeleteRecord: "Record deleted successfully",
  errorLoadingData: "Error loading data: {{message}}",
  errorUnexpected: "An unexpected error occurred",
  noListsAvailable: "No lists available",
  emailName: "Email Name",
  recipientsCount: "Number of Recipients in Email",

  recipientEmail: "Recipient Email",
  messageDelivery: "Message Delivery",
  messageOpened: "Message Open",
  messageBlocked: "Message Blocked",
  surveyQuestion: "Survey Question",
  surveyAnswer: "Survey Answer",
  customQuestion: "Custom Survey Question",
  customAnswer: "Custom Survey Answer",
  lastCheckedAt: "Last Checked At",

  successDeleteAllRecords: "All records deleted successfully",
  deleteAllRecords: "Delete All Records",
  confirmDeleteAllRecords: "Are you sure you want to delete all records?",
  yes: "Yes",
  no: "No",
} as const;

export default log;
