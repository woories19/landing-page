import { HStack, Icon, Text } from '@chakra-ui/react'

export const SecurityBadge = ({ icon, text }) => (
  <HStack 
    spacing={2} 
    bg="gray.50" 
    p={3}
    borderRadius="lg"
    align="center"
    borderWidth="1px"
    borderColor="gray.200"
    flex="1"
    minW={{ base: "auto", sm: "200px" }}
    justify="center"
    _hover={{
      bg: "gray.100",
      transform: "translateY(-1px)",
      transition: "all 0.2s ease"
    }}
  >
    <Icon as={icon} color="blue.500" boxSize={4} />
    <Text 
      fontSize={{ base: "xs", sm: "sm" }} 
      color="gray.700" 
      fontWeight="medium" 
      whiteSpace="nowrap"
    >
      {text}
    </Text>
  </HStack>
) 