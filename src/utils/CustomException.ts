export default class CustomException extends Error {
  code: number

  constructor (message: string, code = 200) {
    super()
    this.code = code
  }
}
