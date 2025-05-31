// Payment amount
export const PAYMENT_AMOUNT = 1650.00;

// Test card details
export const TEST_CARD = {
  number: '4658598163901044',
  expiry: '12/28',
  cvv: '726'
};

// Processing stages with their respective delays (in ms)
export const PROCESSING_STAGES = [
  { message: "Initiating secure payment...", delay: 1800 },     // Initial handshake
  { message: "Encrypting card details...", delay: 1200 },       // Encryption
  { message: "Contacting your bank...", delay: 2800 },         // Network latency to bank
  { message: "Verifying payment details...", delay: 3500 },    // Bank verification
  { message: "Processing with merchant...", delay: 2400 },     // Merchant processing
  { message: "Confirming transaction...", delay: 2100 },       // Final confirmation
  { message: "Payment successful!" }                           // Success message
];

// Base64 encoded Visa logo
export const VISA_LOGO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgLTE0MCA3ODAgNzgwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA3ODAgNTAwIiB2ZXJzaW9uPSIxLjEiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTI5My4yIDM0OC43M2wzMy4zNTktMTk1Ljc2aDUzLjM1OGwtMzMuMzg0IDE5NS43NmgtNTMuMzMzem0yNDYuMTEtMTkxLjU0Yy0xMC41NjktMy45NjYtMjcuMTM1LTguMjIyLTQ3LjgyMS04LjIyMi01Mi43MjYgMC04OS44NjMgMjYuNTUxLTkwLjE4MSA2NC42MDQtMC4yOTcgMjguMTI5IDI2LjUxNSA0My44MjIgNDYuNzU0IDUzLjE4NSAyMC43NzEgOS41OTggMjcuNzUyIDE1LjcxNiAyNy42NTIgMjQuMjgzLTAuMTMzIDEzLjEyMy0xNi41ODYgMTkuMTE1LTMxLjkyNCAxOS4xMTUtMjEuMzU1IDAtMzIuNzAxLTIuOTY3LTUwLjIyNS0xMC4yNzNsLTYuODc4LTMuMTExLTcuNDg3IDQzLjgyMmMxMi40NjMgNS40NjcgMzUuNTA4IDEwLjE5OSA1OS40MzggMTAuNDQ1IDU2LjA5IDAgOTIuNTAyLTI2LjI0OCA5Mi45MTYtNjYuODg1IDAuMTk5LTIyLjI3LTE0LjAxNi0zOS4yMTUtNDQuODAxLTUzLjE4OC0xOC42NS05LjA1Ni0zMC4wNzItMTUuMDk5LTI5Ljk1MS0yNC4yNjkgMC04LjEzNyA5LjY2OC0xNi44MzggMzAuNTYtMTYuODM4IDE3LjQ0Ni0wLjI3MSAzMC4wODggMy41MzQgMzkuOTM2IDcuNWw0Ljc4MSAyLjI1OSA3LjIzMS00Mi40MjdtMTM3LjMxLTQuMjIzaC00MS4yM2MtMTIuNzcyIDAtMjIuMzMyIDMuNDg2LTI3Ljk0IDE2LjIzNGwtNzkuMjQ5IDE3OS40aDU2LjAzMXM5LjE1OS0yNC4xMjEgMTEuMjMxLTI5LjQxOGM2LjEyMyAwIDYwLjU1NSAwLjA4NCA2OC4zMzYgMC4wODQgMS41OTYgNi44NTQgNi40OTIgMjkuMzM0IDYuNDkyIDI5LjMzNGg0OS41MTJsLTQzLjE4Ny0xOTUuNjR6bS02NS40MTcgMTI2LjQxYzQuNDE0LTExLjI3OSAyMS4yNi01NC43MjQgMjEuMjYtNTQuNzI0LTAuMzE0IDAuNTIxIDQuMzgxLTExLjMzNCA3LjA3NC0xOC42ODRsMy42MDYgMTYuODc4czEwLjIxNyA0Ni43MjkgMTIuMzUzIDU2LjUyN2gtNDQuMjkzdjNlLTN6bS0zNjMuMy0xMjYuNDFsLTUyLjIzOSAxMzMuNS01LjU2NS0yNy4xMjljLTkuNzI2LTMxLjI3NC00MC4wMjUtNjUuMTU3LTczLjg5OC04Mi4xMmw0Ny43NjcgMTcxLjIgNTYuNDU1LTAuMDYzIDg0LjAwNC0xOTUuMzktNTYuNTI0LTFlLTMiIGZpbGw9IiMwRTQ1OTUiLz48cGF0aCBkPSJtMTQ2LjkyIDE1Mi45NmgtODYuMDQxbC0wLjY4MiA0LjA3M2M2Ni45MzkgMTYuMjA0IDExMS4yMyA1NS4zNjMgMTI5LjYyIDEwMi40MmwtMTguNzA5LTg5Ljk2Yy0zLjIyOS0xMi4zOTYtMTIuNTk3LTE2LjA5Ni0yNC4xODYtMTYuNTI4IiBmaWxsPSIjRjJBRTE0Ii8+PC9zdmc+'; 