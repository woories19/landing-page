import { Box, Icon, Image } from '@chakra-ui/react'
import { VISA_LOGO } from '../constants'

export const VisaIcon = (props) => (
  <Box 
    {...props} 
    bg="white" 
    borderRadius="md"
    display="flex"
    alignItems="center"
    justifyContent="center"
    width="50px"
    height="32px"
    className="card-logo"
  >
    <Image 
      src={VISA_LOGO} 
      alt="Visa" 
      width="45px"
      height="30px"
    />
  </Box>
)

export const MastercardIcon = (props) => (
  <Box
    {...props}
    bg="white"
    borderRadius="md"
    display="flex"
    alignItems="center"
    justifyContent="center"
    width="50px"
    height="32px"
    className="card-logo"
  >
    <Icon viewBox="0 0 60 40" width="45px" height="30px">
      <rect width="60" height="40" fill="white" rx="4"/>
      <circle cx="23" cy="20" r="12" fill="#EB001B"/>
      <circle cx="37" cy="20" r="12" fill="#F79E1B"/>
      <path
        fill="#FF5F00"
        d="M30 8c4.6 0 8.7 2.6 10.7 6.4-2-3.8-6.1-6.4-10.7-6.4s-8.7 2.6-10.7 6.4c2-3.8 6.1-6.4 10.7-6.4z"
      />
    </Icon>
  </Box>
) 