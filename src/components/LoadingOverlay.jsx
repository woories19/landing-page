import { Box, Text, VStack, Spinner } from '@chakra-ui/react'

export const LoadingOverlay = ({ message }) => (
  <Box
    position="fixed"
    inset="0"
    zIndex="overlay"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <Box
      position="absolute"
      inset="0"
      bg="rgba(0, 0, 0, 0.6)"
      backdropFilter="blur(16px)"
      opacity="1"
      animation="fadeIn 0.2s ease-out"
    />
    <Box
      bg="white"
      borderRadius="2xl"
      boxShadow="xl"
      p={8}
      maxW="sm"
      w="90%"
      position="relative"
      animation="slideUp 0.3s ease-out"
    >
      <VStack spacing={6}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.100"
          color="blue.500"
          size="xl"
        />
        <Text
          color="gray.700"
          fontSize="lg"
          fontWeight="medium"
          textAlign="center"
        >
          {message}
        </Text>
      </VStack>
    </Box>
  </Box>
) 