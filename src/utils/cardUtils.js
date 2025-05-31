// Card type detection
export const detectCardType = (number) => {
  const cleaned = number.replace(/\s/g, '')
  if (cleaned.length < 2) return null
  
  // Visa starts with 4
  if (cleaned.startsWith('4')) {
    return 'visa'
  }
  // Mastercard starts with 51-55 or 2221-2720
  if ((cleaned.startsWith('5') && ['1','2','3','4','5'].includes(cleaned[1])) ||
      (cleaned.startsWith('2') && cleaned.length >= 4 && 
       parseInt(cleaned.substr(0,4)) >= 2221 && 
       parseInt(cleaned.substr(0,4)) <= 2720)) {
    return 'mastercard'
  }
  return null
}

// Format card number with spaces
export const formatCardNumber = (value) => {
  const cleaned = value.replace(/\s/g, '')
  return cleaned.replace(/(\d{4})/g, '$1 ').trim()
}

// Format expiry date
export const formatExpiryDate = (value) => {
  let cleaned = value.replace(/\D/g, '')
  if (cleaned.length >= 2) {
    cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
  }
  return cleaned
} 