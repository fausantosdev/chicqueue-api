class CustomException {
    message: string
    code: number

    constructor (message: string, code = 200) {
        this.message = message
        this.code = code
    }
}
export default CustomException