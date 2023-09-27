export const convertErrorCode = (errCode: number) => {
    return errCode && errCode <= 500 ? errCode : 500
}

export const makeHash = (tm: number) => {
    var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
    var random = ''
    for (var i = 0; i < tm; i++) {
        var rnum = Math.floor(Math.random() * characters.length)
        random += characters.substring(rnum, rnum + 1)
    }
    return random
}