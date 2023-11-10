export const convertErrorCode = (errCode: number) => {
  return errCode && errCode <= 500 ? errCode : 500
}

export const makeHash = (tm: number) => {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
  let random = ''
  for (let i = 0; i < tm; i++) {
    const rnum = Math.floor(Math.random() * characters.length)
    random += characters.substring(rnum, rnum + 1)
  }
  return random
}
